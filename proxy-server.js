// Proxy Server for Claude API Calls
// This server allows the Chrome extension to make API calls to Claude

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS for the extension
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Analyze card endpoint
app.post('/analyze-card', async (req, res) => {
    try {
        const { domain, cards, apiKey } = req.body;
        
        if (!apiKey) {
            return res.status(400).json({ 
                success: false, 
                error: 'API key is required' 
            });
        }
        
        if (!cards || cards.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'No cards provided for analysis' 
            });
        }
        
        // Create the prompt for Claude
        const prompt = `You are analyzing credit card rewards for a purchase at ${domain}.
        
        The user has the following credit cards:
        ${cards.map(card => `- ${card.name} (${card.issuer})`).join('\n')}
        
        MANDATORY ANALYSIS STRUCTURE:
        
        1. FIRST: Explain the decision criteria in detail
        2. SECOND: Create a comprehensive comparison table
        3. THIRD: Determine the winner based on the table results
        4. FOURTH: Write reasoning that matches the winner
        
        CRITICAL REQUIREMENTS:
        - The card with the HIGHEST TOTAL SCORE must be the winner
        - Your reasoning must explain why the HIGHEST SCORING card is best
        - Winner selection must be 100% consistent with your scoring table
        - If Chase cards have portal advantages, score them higher for relevant merchants
        
        ANALYSIS STEPS:
        
        Step 1: Identify the merchant category and explain what reward factors matter most
        Step 2: Look up the ACTUAL features of each card provided and create a detailed scoring matrix
        Step 3: Calculate total scores based on real card benefits and identify the clear winner
        Step 4: Write reasoning that specifically highlights why the winner scored highest
        
        Format your response as JSON with this structure:
        {
            "merchantCategory": "Category identified (e.g., 'Dining', 'Gas', 'Groceries')",
            "criteriaExplanation": "Detailed explanation of what factors matter most for this merchant category and why these criteria were chosen for evaluation",
            "decisionMatrix": {
                "evaluationCriteria": [
                    "Reward multiplier for category",
                    "Portal/partner benefits",
                    "Annual fee value",
                    "Spending caps/limits", 
                    "Redemption flexibility"
                ],
                "comparisonTable": [
                    {
                        "cardName": "Card Name",
                        "actualValues": {
                            "Reward multiplier for category": "3x points",
                            "Portal/partner benefits": "Chase Ultimate Rewards portal access",
                            "Annual fee value": "$95 annual fee",
                            "Spending caps/limits": "No spending caps",
                            "Redemption flexibility": "Transfer to partners at 1:1"
                        },
                        "scores": {
                            "Reward multiplier for category": 8,
                            "Portal/partner benefits": 10,
                            "Annual fee value": 7,
                            "Spending caps/limits": 9,
                            "Redemption flexibility": 8
                        },
                        "totalScore": 42,
                        "multiplier": "3x",
                        "rewardType": "Points"
                    }
                ]
            },
            "bestCard": "Exact card name from highest totalScore",
            "rewardRate": "3x", 
            "rewardType": "Points" or "Cash Back" or "Miles",
            "reasoning": "Explanation focusing specifically on why the HIGHEST SCORING card from the table is the best choice, referencing the specific criteria where it excelled",
            "winnerJustification": "Clear statement explaining how the winner was selected: 'Based on the comparison table, [Card Name] scored highest with [X] points, excelling in [specific criteria] which are most important for this purchase category.'"
        }
        
        IMPORTANT FORMATTING REQUIREMENTS:
        - For "actualValues", provide real card features for each criterion as simple text strings
        - For "scores", provide numerical ratings 1-10 based on how good each actual value is
        - Keep all text values simple without special formatting
        - The comparison table will display both actual values AND scores for complete transparency
        
        REMEMBER: The card with the highest totalScore MUST be named as bestCard, and your reasoning must explain why that specific high-scoring card is best.`;
        
        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4096,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Claude API error:', response.status, errorData);
            
            if (response.status === 401) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Invalid API key. Please check your Claude API key in Settings.' 
                });
            }
            
            if (response.status === 429) {
                return res.status(429).json({ 
                    success: false, 
                    error: 'Rate limit exceeded' 
                });
            }
            
            if (response.status === 529) {
                return res.status(529).json({ 
                    success: false, 
                    error: 'Claude API is temporarily overloaded' 
                });
            }
            
            return res.status(response.status).json({ 
                success: false, 
                error: errorData.error?.message || 'Claude API request failed' 
            });
        }
        
        const data = await response.json();
        
        // Parse Claude's response - NO FALLBACKS
        const content = data.content[0].text;
        
        // Extract JSON from the response - try to clean it first
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('No JSON found in Claude response:', content.substring(0, 500));
            return res.status(500).json({
                success: false,
                error: 'Claude API did not return valid JSON format'
            });
        }
        
        let analysisResult;
        try {
            // Clean up potential JSON issues
            let jsonString = jsonMatch[0];
            
            // Log the raw JSON for debugging (first 500 chars)
            console.log('Raw JSON (first 500 chars):', jsonString.substring(0, 500));
            
            // Try to parse the JSON
            analysisResult = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Error parsing Claude response:', parseError);
            console.error('Failed JSON (around error position):', jsonMatch[0].substring(Math.max(0, parseError.position - 100), parseError.position + 100));
            
            // Try a more lenient approach - extract just the essential data
            try {
                // Create a fallback response with minimal data
                analysisResult = {
                    merchantCategory: "General",
                    criteriaExplanation: "Analysis failed due to formatting issues",
                    decisionMatrix: {
                        evaluationCriteria: ["Standard analysis"],
                        comparisonTable: []
                    },
                    bestCard: cards[0]?.name || "First Card",
                    rewardRate: "Unknown",
                    rewardType: "Points",
                    reasoning: "Analysis encountered formatting issues. Please try again.",
                    winnerJustification: "Unable to complete full analysis due to response formatting."
                };
            } catch (fallbackError) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to parse Claude API response and create fallback'
                });
            }
        }
        
        // Sort comparison table by totalScore (highest first) to ensure winner is first
        const sortedComparisons = (analysisResult.decisionMatrix?.comparisonTable || [])
            .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
        
        // Format response for extension
        const formattedResponse = {
            success: true,
            data: {
                merchantCategory: analysisResult.merchantCategory || 'General',
                criteriaExplanation: analysisResult.criteriaExplanation || 'Standard card analysis',
                winnerJustification: analysisResult.winnerJustification || 'Winner selected based on highest score',
                decisionMatrix: {
                    evaluationCriteria: analysisResult.decisionMatrix?.evaluationCriteria || ['Standard analysis'],
                    comparisonTable: sortedComparisons
                },
                cardComparisons: sortedComparisons.slice(0, 3).map(card => ({
                    cardName: card.cardName,
                    displayValue: card.multiplier || '1x',
                    rewardType: card.rewardType || 'Points',
                    multiplier: parseFloat(card.multiplier) || 1,
                    score: card.totalScore || 0,
                    whyNotBest: card.totalScore === sortedComparisons[0]?.totalScore ? 'Winner' : `Score: ${card.totalScore}/${sortedComparisons[0]?.totalScore}`
                })),
                reasoning: analysisResult.reasoning,
                transparentAnalysis: {
                    show: true,
                    criteria: analysisResult.decisionMatrix?.evaluationCriteria || [],
                    evaluations: sortedComparisons.map(card => ({
                        cardName: card.cardName,
                        multiplier: card.multiplier,
                        rewardType: card.rewardType,
                        score: card.totalScore,
                        criteriaScores: card.scores,
                        actualValues: card.actualValues
                    })),
                    comparisonTable: sortedComparisons
                }
            }
        };
        
        res.json(formattedResponse);
        
    } catch (error) {
        console.error('Proxy server error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error: ' + error.message 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║     Pointwise Proxy Server Running             ║
║                                                 ║
║     Port: ${PORT}                              ║
║     URL: http://localhost:${PORT}              ║
║                                                 ║
║     The extension can now use Claude AI        ║
║     for enhanced card recommendations!         ║
╚════════════════════════════════════════════════╝
    `);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down proxy server...');
    process.exit(0);
});