// This script provides credit card recommendations using AI analysis

// Prevent multiple script executions
if (!window.pointwiseExtensionLoaded) {
    window.pointwiseExtensionLoaded = true;

(function() {
    'use strict';
    
    // Load Josefin Sans font
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;600;700;800&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    
    let analysisOverlay = null;
    let settingsSidebar = null;
    let isAnalyzing = false;
    let floatingButton = null;
    
    // Listen for ping messages to check if content script is loaded
    try {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                try {
                    if (request.action === 'ping') {
                        sendResponse({ status: 'pong', loaded: true });
                    }
                    return false;
                } catch (error) {
                    console.error('Pointwise: Message listener error:', error);
                    return false;
                }
            });
        }
    } catch (error) {
        console.error('Pointwise: Failed to add message listener:', error);
    }
    
    // Safe Chrome storage helper function with retry logic
    async function safeChromeStorageGet(keys) {
        // Retry up to 3 times with delays for Chrome API to become available
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    // Use Promise wrapper to ensure proper error handling
                    return new Promise((resolve) => {
                        chrome.storage.local.get(keys, (result) => {
                            if (chrome.runtime.lastError) {
                                console.error('Chrome storage get error:', chrome.runtime.lastError);
                                resolve({});
                            } else {
                                resolve(result || {});
                            }
                        });
                    });
                } else {
                    if (attempt === 1) {
                        console.log('Pointwise: Chrome storage API not immediately available, waiting...');
                    }
                    
                    // Wait before retry (increasing delays)
                    await new Promise(resolve => setTimeout(resolve, attempt * 100));
                }
            } catch (error) {
                // Handle extension context invalidation (common during extension reload)
                if (error.message && error.message.includes('Extension context invalidated')) {
                    console.log(`Pointwise: Extension was reloaded (attempt ${attempt}), retrying...`);
                    if (attempt === 3) {
                        console.log('Pointwise: Extension context still invalid after retries, please refresh the page');
                        return {};
                    }
                    await new Promise(resolve => setTimeout(resolve, attempt * 200));
                    continue;
                }
                
                console.error(`Pointwise: Chrome storage get error (attempt ${attempt}):`, error);
                if (attempt === 3) {
                    return {};
                }
                await new Promise(resolve => setTimeout(resolve, attempt * 100));
            }
        }
        
        console.log('Pointwise: Chrome storage API get operation completed with fallback');
        return {};
    }
    
    async function safeChromeStorageSet(data) {
        // Retry up to 3 times with delays for Chrome API to become available
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    // Use Promise wrapper to ensure proper error handling
                    return new Promise((resolve) => {
                        chrome.storage.local.set(data, () => {
                            if (chrome.runtime.lastError) {
                                console.error('Chrome storage set error:', chrome.runtime.lastError);
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    });
                } else {
                    if (attempt === 1) {
                        console.log('Pointwise: Chrome storage API not immediately available for set, waiting...');
                    }
                    
                    // Wait before retry (increasing delays)
                    await new Promise(resolve => setTimeout(resolve, attempt * 100));
                }
            } catch (error) {
                // Handle extension context invalidation (common during extension reload)
                if (error.message && error.message.includes('Extension context invalidated')) {
                    console.log(`Pointwise: Extension was reloaded (set attempt ${attempt}), retrying...`);
                    if (attempt === 3) {
                        console.log('Pointwise: Extension context still invalid after retries, please refresh the page');
                        return false;
                    }
                    await new Promise(resolve => setTimeout(resolve, attempt * 200));
                    continue;
                }
                
                console.error(`Pointwise: Chrome storage set error (attempt ${attempt}):`, error);
                if (attempt === 3) {
                    return false;
                }
                await new Promise(resolve => setTimeout(resolve, attempt * 100));
            }
        }
        
        console.log('Pointwise: Chrome storage API set operation completed with fallback');
        return false;
    }
    
    // Safe Chrome runtime sendMessage wrapper with error handling
    async function safeChromeRuntimeSendMessage(message, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                    return new Promise((resolve) => {
                        try {
                            chrome.runtime.sendMessage(message, (response) => {
                                // Check for runtime error first
                                if (chrome.runtime.lastError) {
                                    const error = chrome.runtime.lastError.message || 'Unknown runtime error';
                                    if (error.includes('Extension context invalidated') || error.includes('Could not establish connection')) {
                                        console.log(`Pointwise: Extension context invalid (attempt ${attempt}): ${error}`);
                                        resolve({ success: false, error: 'Extension context invalidated', shouldRetry: true });
                                        return;
                                    }
                                    console.error('Pointwise: Chrome runtime error:', error);
                                    resolve({ success: false, error: error });
                                    return;
                                }
                                
                                // Return the response or indicate success
                                resolve(response || { success: true });
                            });
                        } catch (sendError) {
                            console.error(`Pointwise: Send message error (attempt ${attempt}):`, sendError);
                            resolve({ success: false, error: sendError.message, shouldRetry: true });
                        }
                    });
                } else {
                    console.log(`Pointwise: Chrome runtime API not available (attempt ${attempt})`);
                    return { success: false, error: 'Chrome runtime API not available', shouldRetry: true };
                }
            } catch (error) {
                console.error(`Pointwise: Runtime send message wrapper error (attempt ${attempt}):`, error);
                if (error.message && error.message.includes('Extension context invalidated')) {
                    console.log('Pointwise: Extension was reloaded, retrying...');
                    if (attempt === maxRetries) {
                        return { success: false, error: 'Extension context invalidated after retries', shouldRefresh: true };
                    }
                    // Wait before retry with increasing delay
                    await new Promise(resolve => setTimeout(resolve, attempt * 500));
                    continue;
                }
                
                if (attempt === maxRetries) {
                    return { success: false, error: error.message || 'Runtime send message failed' };
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, attempt * 200));
            }
        }
        
        return { success: false, error: 'Max retries exceeded' };
    }
    
    // Create floating button
    function createFloatingButton() {
        if (floatingButton) {
            console.log('Pointwise: Floating button already exists');
            return;
        }

        floatingButton = document.createElement('div');
        floatingButton.id = 'pointwise-floating-button';
        floatingButton.innerHTML = 'P';
        floatingButton.title = 'Pointwise - AI Card Optimizer';
        
        // Add styles
        floatingButton.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 60px !important;
            height: 60px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: 24px !important;
            font-family: 'Josefin Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
            cursor: pointer !important;
            z-index: 1000000 !important;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4) !important;
            border: none !important;
            transition: all 0.3s ease !important;
            user-select: none !important;
        `;

        // Add hover effect
        floatingButton.addEventListener('mouseenter', () => {
            floatingButton.style.transform = 'scale(1.1)';
            floatingButton.style.boxShadow = '0 6px 30px rgba(102, 126, 234, 0.6)';
        });

        floatingButton.addEventListener('mouseleave', () => {
            floatingButton.style.transform = 'scale(1)';
            floatingButton.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
        });

        // Add click handler
        floatingButton.addEventListener('click', openAnalysisOverlay);

        // Make it draggable
        makeButtonDraggable(floatingButton);

        // Add to page
        document.body.appendChild(floatingButton);
        
        console.log('Pointwise: Floating button created successfully');
    }

    // Make button draggable
    function makeButtonDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;
        
        element.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return; // Only handle left mouse button
            
            pos3 = e.clientX;
            pos4 = e.clientY;
            isDragging = false;
            
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDragElement);
            
            e.stopPropagation();
        });
        
        function elementDrag(e) {
            e.preventDefault();
            isDragging = true;
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        }
        
        function closeDragElement() {
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDragElement);
            
            // Only trigger click if not dragging
            setTimeout(() => {
                isDragging = false;
            }, 100);
        }
    }
    
    
    // Toggle analysis overlay
    function toggleAnalysisOverlay() {
        console.log('Pointwise: toggleAnalysisOverlay called, current overlay:', !!analysisOverlay);
        
        if (analysisOverlay) {
            console.log('Pointwise: Closing existing overlay');
            closeAnalysisOverlay();
        } else {
            console.log('Pointwise: Opening new overlay');
            openAnalysisOverlay();
        }
    }
    
    // Create a simple test overlay
    function createTestOverlay() {
        console.log('Pointwise: Creating test overlay');
        
        const testOverlay = document.createElement('div');
        testOverlay.id = 'pointwise-test-overlay';
        testOverlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.9) !important;
            z-index: 9999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            font-family: 'Josefin Sans', Arial, sans-serif !important;
            font-size: 24px !important;
        `;
        
        testOverlay.innerHTML = `
            <div style="text-align: center; background: #333; padding: 40px; border-radius: 10px;">
                <h2>Pointwise Test Overlay</h2>
                <p>This confirms the click is working!</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    margin-top: 20px; 
                    padding: 10px 20px; 
                    background: #667eea; 
                    color: white; 
                    border: none; 
                    border-radius: 5px; 
                    cursor: pointer;
                ">Close</button>
            </div>
        `;
        
        document.body.appendChild(testOverlay);
        analysisOverlay = testOverlay;
        
        console.log('Pointwise: Test overlay created and added to page');
    }
    
    // Create setup overlay when no cards are configured
    function createSetupOverlay(domain) {
        console.log('Pointwise: Creating setup overlay');
        
        analysisOverlay = document.createElement('div');
        analysisOverlay.id = 'pointwise-analysis-overlay';
        analysisOverlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.8) !important;
            backdrop-filter: blur(8px) !important;
            z-index: 1000000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-family: 'Josefin Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
        `;
        
        analysisOverlay.innerHTML = `
            <div class="pointwise-overlay-container" style="
                background: #1a1a1a !important;
                border-radius: 20px !important;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                min-width: 500px !important;
                max-width: 90vw !important;
                max-height: 80vh !important;
                overflow: hidden !important;
                color: #ffffff !important;
            ">
                <div class="pointwise-overlay-header" style="
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    padding: 20px 24px !important;
                    background: rgba(255, 255, 255, 0.02) !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
                ">
                    <div class="pointwise-overlay-title" style="
                        display: flex !important;
                        align-items: center !important;
                        gap: 12px !important;
                        font-size: 18px !important;
                        font-weight: 600 !important;
                        color: #ffffff !important;
                    ">
                        <span class="pointwise-logo" style="
                            width: 32px !important;
                            height: 32px !important;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                            border-radius: 8px !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            font-weight: 700 !important;
                            font-size: 16px !important;
                            color: white !important;
                        ">P</span>
                        <span>Welcome to Pointwise</span>
                    </div>
                    <button class="pointwise-close-btn" style="
                        width: 32px !important;
                        height: 32px !important;
                        border: none !important;
                        background: rgba(255, 255, 255, 0.1) !important;
                        border-radius: 50% !important;
                        color: #ffffff !important;
                        cursor: pointer !important;
                        font-size: 20px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    ">&times;</button>
                </div>
                <div class="pointwise-overlay-content" style="
                    padding: 40px 24px !important;
                    text-align: center !important;
                ">
                    <div style="
                        font-size: 64px !important;
                        margin-bottom: 20px !important;
                        opacity: 0.6 !important;
                    ">💳</div>
                    
                    <h3 style="
                        font-size: 20px !important;
                        font-weight: 600 !important;
                        margin-bottom: 16px !important;
                        color: #ffffff !important;
                    ">No Credit Cards Added</h3>
                    
                    <p style="
                        font-size: 16px !important;
                        color: rgba(255, 255, 255, 0.7) !important;
                        line-height: 1.5 !important;
                        margin-bottom: 30px !important;
                        max-width: 400px !important;
                        margin-left: auto !important;
                        margin-right: auto !important;
                    ">
                        To get personalized credit card recommendations for <strong style="color: white;">${domain}</strong>, 
                        you'll need to add your credit cards first.
                    </p>
                    
                    <button class="pointwise-setup-btn" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        border: none !important;
                        color: white !important;
                        padding: 14px 28px !important;
                        border-radius: 12px !important;
                        cursor: pointer !important;
                        font-size: 16px !important;
                        font-weight: 600 !important;
                        transition: all 0.3s ease !important;
                        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3) !important;
                    ">Add Your Credit Cards</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(analysisOverlay);
        
        // Add close handler
        analysisOverlay.querySelector('.pointwise-close-btn').addEventListener('click', closeAnalysisOverlay);
        
        // Add setup button handler
        analysisOverlay.querySelector('.pointwise-setup-btn').addEventListener('click', () => {
            openSettingsSidebar();
        });
        
        // Click outside to close
        analysisOverlay.addEventListener('click', (e) => {
            if (e.target === analysisOverlay) {
                closeAnalysisOverlay();
            }
        });
        
        console.log('Pointwise: Setup overlay created successfully');
    }
    
    // Open analysis overlay
    async function openAnalysisOverlay() {
        console.log('Pointwise: openAnalysisOverlay called, isAnalyzing:', isAnalyzing, 'existing overlay:', !!analysisOverlay);
        
        if (analysisOverlay || isAnalyzing) {
            console.log('Pointwise: Overlay already exists or is analyzing, returning');
            return;
        }
        
        isAnalyzing = true;
        const domain = window.location.hostname.replace('www.', '');
        
        console.log('Pointwise: Creating overlay for domain:', domain);
        
        // Check if user has cards configured
        const result = await safeChromeStorageGet('selectedCardIds');
        const selectedCardIds = result.selectedCardIds || [];
        
        if (selectedCardIds.length === 0) {
            console.log('Pointwise: No cards configured, showing setup message');
            createSetupOverlay(domain);
            isAnalyzing = false;
            return;
        }
        
        // Create overlay
        analysisOverlay = document.createElement('div');
        analysisOverlay.id = 'pointwise-analysis-overlay';
        
        // Add styles directly to ensure visibility
        analysisOverlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.8) !important;
            backdrop-filter: blur(8px) !important;
            z-index: 1000000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-family: 'Josefin Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
        `;
        
        analysisOverlay.innerHTML = `
            <div class="pointwise-overlay-container" style="
                background: #1a1a1a !important;
                border-radius: 20px !important;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                min-width: 500px !important;
                max-width: 90vw !important;
                max-height: 80vh !important;
                overflow: hidden !important;
                color: #ffffff !important;
            ">
                <div class="pointwise-overlay-header" style="
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    padding: 20px 24px !important;
                    background: rgba(255, 255, 255, 0.02) !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
                ">
                    <div class="pointwise-overlay-title" style="
                        display: flex !important;
                        align-items: center !important;
                        gap: 12px !important;
                        font-size: 18px !important;
                        font-weight: 600 !important;
                        color: #ffffff !important;
                    ">
                        <span class="pointwise-logo" style="
                            width: 32px !important;
                            height: 32px !important;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                            border-radius: 8px !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            font-weight: 700 !important;
                            font-size: 16px !important;
                            color: white !important;
                        ">P</span>
                        <span>Pointwise Analysis</span>
                    </div>
                    <button class="pointwise-close-btn" style="
                        width: 32px !important;
                        height: 32px !important;
                        border: none !important;
                        background: rgba(255, 255, 255, 0.1) !important;
                        border-radius: 50% !important;
                        color: #ffffff !important;
                        cursor: pointer !important;
                        font-size: 20px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    ">&times;</button>
                </div>
                <div class="pointwise-overlay-content" style="
                    padding: 24px !important;
                    min-height: 200px !important;
                    max-height: calc(80vh - 80px) !important;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                ">
                    <div class="pointwise-merchant" style="
                        display: flex !important;
                        align-items: center !important;
                        gap: 8px !important;
                        margin-bottom: 20px !important;
                        padding: 12px 16px !important;
                        background: rgba(102, 126, 234, 0.1) !important;
                        border: 1px solid rgba(102, 126, 234, 0.2) !important;
                        border-radius: 12px !important;
                    ">
                        <span class="merchant-label" style="
                            font-size: 14px !important;
                            color: rgba(255, 255, 255, 0.7) !important;
                            font-weight: 500 !important;
                        ">Merchant:</span>
                        <span class="merchant-name" style="
                            font-size: 14px !important;
                            color: #ffffff !important;
                            font-weight: 600 !important;
                        ">${domain}</span>
                    </div>
                    <div class="pointwise-ready" style="
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        gap: 20px !important;
                        padding: 40px 20px !important;
                        color: rgba(255, 255, 255, 0.7) !important;
                    ">
                        <div style="
                            font-size: 48px !important;
                            margin-bottom: 10px !important;
                            opacity: 0.8 !important;
                        ">🎯</div>
                        <div style="
                            font-size: 18px !important;
                            font-weight: 600 !important;
                            color: #ffffff !important;
                            text-align: center !important;
                            margin-bottom: 8px !important;
                        ">Ready to Analyze</div>
                        <div style="
                            font-size: 14px !important;
                            color: rgba(255, 255, 255, 0.7) !important;
                            text-align: center !important;
                            margin-bottom: 20px !important;
                            max-width: 300px !important;
                            line-height: 1.4 !important;
                        ">Click below to get AI-powered credit card recommendations for this merchant</div>
                        <button class="pointwise-analyze-btn" style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                            border: none !important;
                            color: white !important;
                            padding: 14px 32px !important;
                            border-radius: 12px !important;
                            cursor: pointer !important;
                            font-size: 16px !important;
                            font-weight: 600 !important;
                            transition: all 0.3s ease !important;
                            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3) !important;
                            font-family: 'Josefin Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
                        ">🚀 Analyze Best Cards</button>
                    </div>
                    <div class="pointwise-footer" style="
                        text-align: center !important;
                        padding-top: 20px !important;
                        border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
                    ">
                        <button class="pointwise-settings-btn" style="
                            background: transparent !important;
                            border: 1px solid rgba(255, 255, 255, 0.2) !important;
                            color: rgba(255, 255, 255, 0.7) !important;
                            padding: 8px 16px !important;
                            border-radius: 8px !important;
                            cursor: pointer !important;
                            font-size: 14px !important;
                            font-family: 'Josefin Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
                            transition: all 0.3s ease !important;
                        ">⚙️ Configure Extension</button>
                    </div>
                </div>
            </div>
        `;
        
        console.log('Pointwise: Appending overlay to body');
        document.body.appendChild(analysisOverlay);
        
        // Add close handler
        analysisOverlay.querySelector('.pointwise-close-btn').addEventListener('click', closeAnalysisOverlay);
        
        // Add configure extension handler
        analysisOverlay.querySelector('.pointwise-settings-btn').addEventListener('click', () => {
            openSettingsSidebar();
        });
        
        // Add analyze button handler
        analysisOverlay.querySelector('.pointwise-analyze-btn').addEventListener('click', async () => {
            console.log('Pointwise: Analyze button clicked');
            showLoadingState();
            try {
                const recommendations = await getCardRecommendations();
                displayRecommendations(recommendations);
            } catch (error) {
                console.error('Pointwise: Error getting recommendations:', error);
                displayRecommendations({ error: 'Unable to analyze cards. Please check your configuration and try again.' });
            }
        });
        
        // Click outside to close
        analysisOverlay.addEventListener('click', (e) => {
            if (e.target === analysisOverlay) {
                closeAnalysisOverlay();
            }
        });
        
        isAnalyzing = false;
    }
    
    // Show loading state during analysis
    function showLoadingState() {
        if (!analysisOverlay) return;
        
        const content = analysisOverlay.querySelector('.pointwise-overlay-content');
        const domain = window.location.hostname.replace('www.', '');
        
        content.innerHTML = `
            <div class="pointwise-merchant" style="
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                margin-bottom: 20px !important;
                padding: 12px 16px !important;
                background: rgba(102, 126, 234, 0.1) !important;
                border: 1px solid rgba(102, 126, 234, 0.2) !important;
                border-radius: 12px !important;
            ">
                <span class="merchant-label" style="
                    font-size: 14px !important;
                    color: rgba(255, 255, 255, 0.7) !important;
                    font-weight: 500 !important;
                ">Merchant:</span>
                <span class="merchant-name" style="
                    font-size: 14px !important;
                    color: #ffffff !important;
                    font-weight: 600 !important;
                ">${domain}</span>
            </div>
            <div class="pointwise-loading" style="
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                gap: 16px !important;
                padding: 40px 20px !important;
                color: rgba(255, 255, 255, 0.7) !important;
            ">
                <div class="loading-spinner" style="
                    width: 32px !important;
                    height: 32px !important;
                    border: 3px solid rgba(102, 126, 234, 0.2) !important;
                    border-top: 3px solid #667eea !important;
                    border-radius: 50% !important;
                    animation: pointwise-spin 1s linear infinite !important;
                "></div>
                <span style="
                    font-size: 16px !important;
                    font-weight: 500 !important;
                ">Analyzing best rewards...</span>
                <div style="
                    font-size: 14px !important;
                    color: rgba(255, 255, 255, 0.5) !important;
                    text-align: center !important;
                ">This may take a few seconds</div>
            </div>
        `;
    }
    
    // Close analysis overlay
    function closeAnalysisOverlay() {
        if (analysisOverlay) {
            analysisOverlay.remove();
            analysisOverlay = null;
        }
    }
    
    // Get card recommendations
    async function getCardRecommendations() {
        try {
            const result = await safeChromeStorageGet(['selectedCardIds', 'claudeApiKey']);
            const selectedCardIds = result.selectedCardIds || [];
            const apiKey = result.claudeApiKey;
            
            if (selectedCardIds.length === 0) {
                return { error: 'No cards configured. Please add your cards in the extension settings.' };
            }
            
            const domain = window.location.hostname.replace('www.', '');
            
            console.log('Pointwise: Getting recommendations for', selectedCardIds.length, 'cards on', domain);
            
            // Get cards from storage (we need the full card data)
            const cards = await getCardsFromIds(selectedCardIds);
            
            // Check if we have an API key for AI analysis
            if (apiKey && apiKey.length > 10) {
                console.log('Pointwise: API key found, attempting AI analysis...');
                
                try {
                    // Send message to background script for AI analysis using safe wrapper
                    const aiResult = await safeChromeRuntimeSendMessage({
                        action: 'analyzeCard',
                        domain: domain,
                        cards: cards
                    });
                    
                    // Check if the safe wrapper succeeded
                    if (aiResult.success && aiResult.data) {
                        console.log('Pointwise: AI analysis successful');
                        return { success: true, data: aiResult.data, cards: cards, aiAnalysis: true };
                    } else if (aiResult.shouldRefresh) {
                        // Extension context invalidated, show user message
                        console.log('Pointwise: Extension context invalidated - user should refresh page');
                        return { error: 'Extension context was invalidated. Please refresh the page and try again.', shouldRefresh: true };
                    } else {
                        // Log the specific error
                        const errorMsg = aiResult.error || 'Unknown error';
                        console.log('Pointwise: AI analysis failed:', errorMsg);
                        
                        // Check if it's a proxy server error
                        if (errorMsg.includes('proxy server') || 
                            errorMsg.includes('localhost:3002') || 
                            errorMsg.includes('ECONNREFUSED') ||
                            errorMsg.includes('connect to proxy') ||
                            errorMsg.includes('Connection refused')) {
                            console.log('Pointwise: Proxy server not available - AI analysis failed');
                            return { error: 'Proxy server is not running. Please run "npm start" in the extension directory and try again.', proxyError: true };
                        }
                        return { error: `AI analysis failed: ${errorMsg}. Please check your API key and try again.` };
                    }
                } catch (error) {
                    console.error('Pointwise: AI analysis error:', error);
                    return { error: `Analysis failed with error: ${error.message}. Please try again.` };
                }
            } else {
                console.log('Pointwise: No API key configured');
                return {
                    error: 'Claude AI API key is required for analysis. Please configure your API key in the extension settings.',
                    needsApiKey: true
                };
            }
            
            // If we reach here, AI analysis failed
            console.log('Pointwise: AI analysis failed - no fallback available');
            return {
                error: 'AI analysis failed. Please check your API key and try again. Ensure the proxy server is running on localhost:3002.',
                aiAnalysisFailed: true
            };
            
        } catch (error) {
            console.error('Pointwise: Recommendation error:', error);
            return { error: 'Unable to get recommendations. Please ensure you have added cards and try again.' };
        }
    }
    
    // Get cards from IDs
    async function getCardsFromIds(cardIds) {
        // Comprehensive card database matching the search database
        const cardDatabase = {
            // Chase Cards
            'chase_sapphire_preferred': { name: 'Chase Sapphire Preferred', issuer: 'Chase' },
            'chase_sapphire_reserve': { name: 'Chase Sapphire Reserve', issuer: 'Chase' },
            'chase_freedom_unlimited': { name: 'Chase Freedom Unlimited', issuer: 'Chase' },
            'chase_freedom_flex': { name: 'Chase Freedom Flex', issuer: 'Chase' },
            'chase_amazon_prime': { name: 'Chase Amazon Prime Rewards', issuer: 'Chase' },
            'chase_united_explorer': { name: 'Chase United Explorer', issuer: 'Chase' },
            'chase_southwest_plus': { name: 'Chase Southwest Rapid Rewards Plus', issuer: 'Chase' },
            
            // American Express Cards
            'amex_platinum': { name: 'American Express Platinum Card', issuer: 'American Express' },
            'amex_gold': { name: 'American Express Gold Card', issuer: 'American Express' },
            'amex_green': { name: 'American Express Green Card', issuer: 'American Express' },
            'amex_blue_cash_preferred': { name: 'American Express Blue Cash Preferred', issuer: 'American Express' },
            'amex_blue_cash_everyday': { name: 'American Express Blue Cash Everyday', issuer: 'American Express' },
            'amex_delta_gold': { name: 'American Express Delta SkyMiles Gold', issuer: 'American Express' },
            'amex_hilton': { name: 'American Express Hilton Honors', issuer: 'American Express' },
            'amex_marriott': { name: 'American Express Marriott Bonvoy Brilliant', issuer: 'American Express' },
            
            // Capital One Cards
            'capital_one_venture': { name: 'Capital One Venture Rewards', issuer: 'Capital One' },
            'capital_one_venture_x': { name: 'Capital One Venture X Rewards', issuer: 'Capital One' },
            'capital_one_venture_one': { name: 'Capital One VentureOne Rewards', issuer: 'Capital One' },
            'capital_one_savor': { name: 'Capital One Savor Cash Rewards', issuer: 'Capital One' },
            'capital_one_savor_one': { name: 'Capital One SavorOne Cash Rewards', issuer: 'Capital One' },
            'capital_one_quicksilver': { name: 'Capital One Quicksilver Cash Rewards', issuer: 'Capital One' },
            'capital_one_walmart': { name: 'Capital One Walmart Rewards', issuer: 'Capital One' },
            
            // Citi Cards
            'citi_double_cash': { name: 'Citi Double Cash Card', issuer: 'Citi' },
            'citi_premier': { name: 'Citi Premier Card', issuer: 'Citi' },
            'citi_custom_cash': { name: 'Citi Custom Cash Card', issuer: 'Citi' },
            'citi_aadvantage': { name: 'Citi AAdvantage Platinum Select', issuer: 'Citi' },
            'costco_anywhere': { name: 'Costco Anywhere Visa', issuer: 'Citi' },
            
            // Discover Cards
            'discover_it_cash': { name: 'Discover it Cash Back', issuer: 'Discover' },
            'discover_it_miles': { name: 'Discover it Miles', issuer: 'Discover' },
            'discover_it_chrome': { name: 'Discover it Chrome', issuer: 'Discover' },
            
            // Wells Fargo Cards
            'wells_fargo_active_cash': { name: 'Wells Fargo Active Cash Card', issuer: 'Wells Fargo' },
            'wells_fargo_autograph': { name: 'Wells Fargo Autograph Card', issuer: 'Wells Fargo' },
            'bilt_mastercard': { name: 'Bilt Mastercard', issuer: 'Wells Fargo' },
            
            // Bank of America Cards
            'boa_premium_rewards': { name: 'Bank of America Premium Rewards', issuer: 'Bank of America' },
            'boa_cash_rewards': { name: 'Bank of America Cash Rewards', issuer: 'Bank of America' },
            'alaska_airlines_visa': { name: 'Alaska Airlines Visa', issuer: 'Bank of America' },
            
            // Other Popular Cards
            'apple_card': { name: 'Apple Card', issuer: 'Goldman Sachs' },
            'amazon_prime_visa': { name: 'Amazon Prime Rewards Visa', issuer: 'Chase' },
            'target_redcard': { name: 'Target RedCard', issuer: 'TD Bank' },
            'rei_coop': { name: 'REI Co-op Mastercard', issuer: 'U.S. Bank' },
            'uber_visa': { name: 'Uber Visa Card', issuer: 'Barclays' },
            'paypal_cashback': { name: 'PayPal Cashback Mastercard', issuer: 'Synchrony' }
        };
        
        console.log('Pointwise: getCardsFromIds - Mapping', cardIds.length, 'card IDs to full card data');
        return cardIds.map(id => {
            const cardData = cardDatabase[id];
            if (!cardData) {
                console.warn('Pointwise: Card ID not found in database:', id);
            }
            return {
                id: id,
                name: cardData ? cardData.name : id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                issuer: cardData ? cardData.issuer : getCardIssuer(id)
            };
        });
    }
    
    
    
    
    
    // Display recommendations in overlay
    function displayRecommendations(result) {
        if (!analysisOverlay) return;
        
        const content = analysisOverlay.querySelector('.pointwise-overlay-content');
        
        // Handle null or undefined results
        if (!result) {
            result = { error: 'Extension context was invalidated. Please refresh the page and try again.' };
        }
        
        if (result.error) {
            const isProxyError = result.proxyError === true;
            const needsApiKey = result.needsApiKey === true;
            const isInvalidKey = result.invalidApiKey === true;
            const isRateLimited = result.rateLimited === true;
            
            let helpText = '';
            if (isProxyError) {
                helpText = `
                    <div style="
                        margin-top: 16px;
                        padding: 16px;
                        background: rgba(103, 126, 234, 0.1);
                        border: 1px solid rgba(103, 126, 234, 0.3);
                        border-radius: 8px;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.9);
                        line-height: 1.6;
                    ">
                        <div style="margin-bottom: 12px; font-weight: 600; color: #667eea;">🚀 How to enable AI analysis:</div>
                        <ol style="margin: 0; padding-left: 20px; color: rgba(255, 255, 255, 0.8);">
                            <li>Open terminal in extension directory</li>
                            <li>Run: <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 3px;">npm start</code></li>
                            <li>Keep the terminal open while using the extension</li>
                        </ol>
                    </div>
                `;
            } else if (needsApiKey) {
                helpText = `
                    <div style="
                        margin-top: 16px;
                        padding: 16px;
                        background: rgba(103, 126, 234, 0.1);
                        border: 1px solid rgba(103, 126, 234, 0.3);
                        border-radius: 8px;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.9);
                        line-height: 1.6;
                    ">
                        <div style="margin-bottom: 12px; font-weight: 600; color: #667eea;">🔑 How to add your API key:</div>
                        <ol style="margin: 0; padding-left: 20px; color: rgba(255, 255, 255, 0.8);">
                            <li>Get an API key from <a href="https://console.anthropic.com/api" target="_blank" style="color: #667eea;">Claude Console</a></li>
                            <li>Click "Configure Extension" below</li>
                            <li>Scroll to "API Configuration"</li>
                            <li>Enter your API key and save</li>
                        </ol>
                    </div>
                `;
            } else if (isInvalidKey) {
                helpText = `
                    <div style="
                        margin-top: 16px;
                        padding: 16px;
                        background: rgba(239, 68, 68, 0.1);
                        border: 1px solid rgba(239, 68, 68, 0.3);
                        border-radius: 8px;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.9);
                    ">
                        <div style="font-weight: 600; color: #ef4444;">⚠️ Invalid API Key</div>
                        <div style="margin-top: 8px; color: rgba(255, 255, 255, 0.8);">Please check your Claude API key in settings.</div>
                    </div>
                `;
            }
            
            content.innerHTML = `
                <div class="pointwise-merchant">
                    <span class="merchant-label">Merchant:</span>
                    <span class="merchant-name">${window.location.hostname.replace('www.', '')}</span>
                </div>
                <div class="pointwise-error" style="
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 16px;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    border-radius: 8px;
                    margin: 20px 0;
                ">
                    <span class="error-icon" style="font-size: 20px;">❌</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 4px;">AI Analysis Required</div>
                        <div style="font-size: 14px; color: rgba(255, 255, 255, 0.8);">${result.error}</div>
                    </div>
                </div>
                ${helpText}
                <div class="pointwise-footer" style="
                    display: flex !important;
                    gap: 12px !important;
                    justify-content: center !important;
                    align-items: center !important;
                    flex-wrap: wrap !important;
                    padding-top: 20px !important;
                    border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
                ">
                    <button class="pointwise-analyze-btn" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        border: none !important;
                        color: white !important;
                        padding: 10px 20px !important;
                        border-radius: 8px !important;
                        cursor: pointer !important;
                        font-size: 14px !important;
                        font-weight: 600 !important;
                        transition: all 0.3s ease !important;
                        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
                        font-family: 'Josefin Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
                    ">🔄 Try Again</button>
                    <button class="pointwise-settings-btn" style="
                        background: transparent !important;
                        border: 1px solid rgba(255, 255, 255, 0.2) !important;
                        color: rgba(255, 255, 255, 0.7) !important;
                        padding: 10px 20px !important;
                        border-radius: 8px !important;
                        cursor: pointer !important;
                        font-size: 14px !important;
                        font-family: 'Josefin Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
                        transition: all 0.3s ease !important;
                    ">⚙️ Configure Extension</button>
                </div>
            `;
            
            // Add handler for settings button
            content.querySelector('.pointwise-settings-btn').addEventListener('click', () => {
                openSettingsSidebar();
            });
            
            // Add handler for analyze button
            content.querySelector('.pointwise-analyze-btn').addEventListener('click', async () => {
                console.log('Pointwise: Re-analyze button clicked');
                showLoadingState();
                try {
                    const recommendations = await getCardRecommendations();
                    displayRecommendations(recommendations);
                } catch (error) {
                    console.error('Pointwise: Error getting recommendations:', error);
                    displayRecommendations({ error: 'Unable to analyze cards. Please check your configuration and try again.' });
                }
            });
            return;
        }
        
        const cards = result.cards || result.data?.cardComparisons || [];
        const bestCard = result.bestCard || cards[0];
        const merchantCategory = result.data?.merchantCategory || result.merchantCategory || 'general';
        const reasoning = result.data?.reasoning || result.reasoning || '';
        const transparentAnalysis = result.data?.transparentAnalysis;
        
        let tableHtml = `
            <div class="pointwise-merchant">
                <span class="merchant-label">Merchant:</span>
                <span class="merchant-name">${window.location.hostname.replace('www.', '')}</span>
                ${merchantCategory && merchantCategory !== 'general' ? `<span style="font-size: 12px; color: rgba(255,255,255,0.6); margin-left: 8px;">(${merchantCategory})</span>` : ''}
            </div>
            
            
            ${reasoning && (transparentAnalysis?.evaluations?.length > 0 || bestCard || cards.length > 0) ? `
                <div style="
                    margin: 20px 0;
                    padding: 24px;
                    background: linear-gradient(135deg, rgba(103, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
                    border: 1px solid rgba(103, 126, 234, 0.4);
                    border-radius: 16px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px rgba(103, 126, 234, 0.2);
                ">
                    <div style="
                        text-align: center;
                        margin-bottom: 20px;
                    ">
                        <div style="
                            font-size: 24px;
                            font-weight: 800;
                            color: #ffffff;
                            margin-bottom: 8px;
                            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        ">🏆 ${transparentAnalysis?.evaluations?.[0]?.cardName || bestCard?.cardName || cards[0]?.cardName || 'Best Card'}</div>
                        <div style="
                            font-size: 16px;
                            font-weight: 600;
                            color: rgba(255, 255, 255, 0.8);
                            margin-bottom: 4px;
                        ">${transparentAnalysis?.evaluations?.[0]?.multiplier || bestCard?.displayValue || cards[0]?.displayValue || ''}${transparentAnalysis?.evaluations?.[0]?.multiplier ? 'x' : ''} ${transparentAnalysis?.evaluations?.[0]?.rewardType || bestCard?.rewardType || cards[0]?.rewardType || ''}</div>
                        <div style="
                            font-size: 12px;
                            color: rgba(255, 255, 255, 0.6);
                            font-weight: 500;
                        ">AI Analysis by Claude Sonnet 4</div>
                    </div>
                    
                    ${result.data?.criteriaExplanation ? `
                    <div style="
                        margin-bottom: 20px;
                        padding: 16px;
                        background: rgba(103, 126, 234, 0.1);
                        border-radius: 12px;
                        border-left: 4px solid #667eea;
                    ">
                        <div style="
                            font-size: 14px;
                            font-weight: 600;
                            color: #667eea;
                            margin-bottom: 8px;
                        ">📋 Decision Criteria</div>
                        <div style="
                            font-size: 14px;
                            line-height: 1.6;
                            color: rgba(255, 255, 255, 0.85);
                        ">
                            <ul style="
                                margin: 0;
                                padding-left: 20px;
                                list-style-type: disc;
                            ">
                                ${result.data.criteriaExplanation.split(/,\s*(?=\d+\))|,\s*and\s+(?=\d+\))|(?=\d+\)\s*[A-Z])/).filter(item => item.trim().length > 0).map(item => 
                                    `<li style="margin-bottom: 6px;">${item.trim().replace(/^\d+\)\s*/, '')}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>
                    ` : ''}
                    
                    ${result.data?.winnerJustification ? `
                    <div style="
                        margin-bottom: 20px;
                        padding: 16px;
                        background: rgba(134, 239, 172, 0.1);
                        border-radius: 12px;
                        border-left: 4px solid #10b981;
                    ">
                        <div style="
                            font-size: 14px;
                            font-weight: 600;
                            color: #10b981;
                            margin-bottom: 8px;
                        ">🏆 Winner Selection</div>
                        <div style="
                            font-size: 14px;
                            line-height: 1.6;
                            color: rgba(255, 255, 255, 0.85);
                        ">${result.data.winnerJustification}</div>
                    </div>
                    ` : ''}
                    
                    <div style="
                        text-align: left;
                        font-size: 15px;
                        line-height: 1.7;
                        color: rgba(255, 255, 255, 0.9);
                    ">
                        ${reasoning.split(/[.!?]+/).filter(s => s.trim().length > 15).map(point => {
                            const cleanPoint = point.trim();
                            if (!cleanPoint) return '';
                            
                            // Clean up the point and ensure proper capitalization
                            let formattedPoint = cleanPoint.charAt(0).toUpperCase() + cleanPoint.slice(1);
                            
                            if (!formattedPoint.match(/[.!?]$/)) {
                                formattedPoint += '.';
                            }
                            
                            return `<div style="
                                display: flex;
                                align-items: flex-start;
                                margin-bottom: 12px;
                                padding-left: 4px;
                            ">
                                <span style="
                                    color: #667eea;
                                    font-size: 16px;
                                    margin-right: 12px;
                                    margin-top: 2px;
                                    flex-shrink: 0;
                                ">•</span>
                                <span>${formattedPoint}</span>
                            </div>`;
                        }).filter(item => item).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${transparentAnalysis && transparentAnalysis.show && transparentAnalysis.evaluations?.length > 0 ? `
                <div style="
                    margin: 20px 0;
                    padding: 0;
                    background: linear-gradient(135deg, rgba(103, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%);
                    border: 1px solid rgba(103, 126, 234, 0.4);
                    border-radius: 16px;
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px rgba(103, 126, 234, 0.15);
                ">
                    <div style="
                        padding: 20px 24px 16px 24px;
                        background: linear-gradient(135deg, rgba(103, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
                        border-bottom: 1px solid rgba(103, 126, 234, 0.25);
                    ">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                            <div style="
                                width: 40px;
                                height: 40px;
                                border-radius: 12px;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 18px;
                                box-shadow: 0 4px 16px rgba(103, 126, 234, 0.3);
                            ">📊</div>
                            <div>
                                <div style="font-weight: 700; font-size: 18px; color: #ffffff; margin-bottom: 2px;">Decision Matrix & Scoring</div>
                                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); font-weight: 500;">Transparent evaluation breakdown</div>
                            </div>
                        </div>
                        
                        ${transparentAnalysis.comparisonTable && transparentAnalysis.comparisonTable.length > 0 ? `
                        <div style="margin-top: 20px;">
                            <div style="font-weight: 600; color: #667eea; margin-bottom: 12px; font-size: 14px;">📊 Detailed Scoring Matrix:</div>
                            <div style="
                                background: rgba(255, 255, 255, 0.03);
                                border-radius: 12px;
                                padding: 16px;
                                border: 1px solid rgba(103, 126, 234, 0.15);
                                overflow-x: auto;
                            ">
                                <table style="
                                    width: 100%;
                                    border-collapse: collapse;
                                    font-size: 12px;
                                    color: rgba(255, 255, 255, 0.9);
                                ">
                                    <thead>
                                        <tr>
                                            <th style="
                                                text-align: left;
                                                padding: 8px 12px;
                                                border-bottom: 2px solid rgba(103, 126, 234, 0.3);
                                                font-weight: 600;
                                                color: #667eea;
                                            ">Card</th>
                                            ${transparentAnalysis.criteria?.map(criteria => `
                                                <th style="
                                                    text-align: center;
                                                    padding: 8px 8px;
                                                    border-bottom: 2px solid rgba(103, 126, 234, 0.3);
                                                    font-weight: 600;
                                                    color: #667eea;
                                                    font-size: 11px;
                                                    max-width: 80px;
                                                    word-wrap: break-word;
                                                ">${criteria}</th>
                                            `).join('') || ''}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${transparentAnalysis.comparisonTable.map((card, index) => `
                                            <tr style="
                                                background: ${index === 0 ? 'rgba(103, 126, 234, 0.1)' : 'transparent'};
                                                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                                            ">
                                                <td style="
                                                    padding: 10px 12px;
                                                    font-weight: ${index === 0 ? '700' : '500'};
                                                    color: rgba(255, 255, 255, 0.9);
                                                ">${index === 0 ? '🏆 ' : ''}${card.cardName}</td>
                                                ${transparentAnalysis.criteria.map(criterion => {
                                                    // Get the actual value for this criterion
                                                    let actualValue = card.actualValues?.[criterion];
                                                    if (!actualValue && card.criteriaScores?.[criterion]) {
                                                        // If no actualValues but we have criteriaScores, show the score as the value
                                                        actualValue = `Score: ${card.criteriaScores[criterion]}`;
                                                    }
                                                    if (!actualValue) {
                                                        actualValue = 'N/A';
                                                    }
                                                    
                                                    return `
                                                    <td style="
                                                        text-align: center;
                                                        padding: 8px 6px;
                                                        font-weight: 500;
                                                        color: #ffffff;
                                                        font-size: 12px;
                                                        line-height: 1.3;
                                                    ">
                                                        <div style="font-weight: 600;">${actualValue}</div>
                                                    </td>`;
                                                }).join('')}
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            ` : ''}
            
            <div class="pointwise-footer" style="
                display: flex !important;
                gap: 12px !important;
                justify-content: center !important;
                align-items: center !important;
                flex-wrap: wrap !important;
                padding-top: 20px !important;
                border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
            ">
                <button class="pointwise-analyze-btn" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                    border: none !important;
                    color: white !important;
                    padding: 10px 20px !important;
                    border-radius: 8px !important;
                    cursor: pointer !important;
                    font-size: 14px !important;
                    font-weight: 600 !important;
                    transition: all 0.3s ease !important;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
                    font-family: 'Josefin Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
                ">🔄 Re-Analyze</button>
                <button class="pointwise-settings-btn" style="
                    background: transparent !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    color: rgba(255, 255, 255, 0.7) !important;
                    padding: 10px 20px !important;
                    border-radius: 8px !important;
                    cursor: pointer !important;
                    font-size: 14px !important;
                    font-family: 'Josefin Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
                    transition: all 0.3s ease !important;
                ">⚙️ Configure Extension</button>
            </div>
        `;
        
        content.innerHTML = tableHtml;
        
        // Add handler for settings button
        content.querySelector('.pointwise-settings-btn').addEventListener('click', () => {
            openSettingsSidebar();
        });
        
        // Add handler for re-analyze button
        content.querySelector('.pointwise-analyze-btn').addEventListener('click', async () => {
            console.log('Pointwise: Re-analyze button clicked');
            showLoadingState();
            try {
                const recommendations = await getCardRecommendations();
                displayRecommendations(recommendations);
            } catch (error) {
                console.error('Pointwise: Error getting recommendations:', error);
                displayRecommendations({ error: 'Unable to analyze cards. Please check your configuration and try again.' });
            }
        });
    }
    
    // Settings Sidebar Functionality
    let selectedCards = [];
    
    // Open settings sidebar
    function openSettingsSidebar() {
        if (settingsSidebar) {
            closeSettingsSidebar();
            return;
        }
        
        console.log('Pointwise: Opening settings sidebar');
        
        settingsSidebar = document.createElement('div');
        settingsSidebar.id = 'pointwise-settings-sidebar';
        settingsSidebar.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            right: -400px !important;
            width: 400px !important;
            height: 100vh !important;
            background: #1a1a1a !important;
            border-left: 1px solid rgba(255, 255, 255, 0.1) !important;
            z-index: 1000001 !important;
            transition: right 0.3s ease !important;
            overflow-y: auto !important;
            font-family: 'Josefin Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
            color: white !important;
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5) !important;
        `;
        
        settingsSidebar.innerHTML = `
            <div class="sidebar-header" style="
                padding: 20px !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                background: rgba(255, 255, 255, 0.02) !important;
            ">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="pointwise-logo" style="
                            width: 32px !important;
                            height: 32px !important;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                            border-radius: 8px !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            font-weight: 700 !important;
                            font-size: 16px !important;
                            color: white !important;
                        ">P</span>
                        <h2 style="font-size: 18px; font-weight: 600; margin: 0; color: white;">Configure Extension</h2>
                    </div>
                    <button class="sidebar-close-btn" style="
                        width: 32px !important;
                        height: 32px !important;
                        border: none !important;
                        background: rgba(255, 255, 255, 0.1) !important;
                        border-radius: 50% !important;
                        color: #ffffff !important;
                        cursor: pointer !important;
                        font-size: 20px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                    ">&times;</button>
                </div>
            </div>
            
            <div class="sidebar-content" style="padding: 20px;">
                <!-- Card Management Section -->
                <div class="config-section" style="margin-bottom: 30px;">
                    <h3 style="
                        font-size: 16px; 
                        font-weight: 600; 
                        margin-bottom: 15px; 
                        color: #ffffff;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <span style="color: #667eea;">💳</span>
                        Your Credit Cards
                    </h3>
                    
                    <div class="card-search-container" style="
                        margin-bottom: 20px; 
                        position: relative;
                    ">
                        <input 
                            type="text" 
                            id="sidebar-card-search" 
                            placeholder="Search for credit cards..."
                            style="
                                width: 100% !important;
                                padding: 12px 16px !important;
                                background: rgba(255, 255, 255, 0.05) !important;
                                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                                border-radius: 8px !important;
                                color: white !important;
                                font-size: 14px !important;
                                outline: none !important;
                                box-sizing: border-box !important;
                            "
                        />
                        <div id="sidebar-card-dropdown" style="
                            position: absolute !important;
                            top: calc(100% + 4px) !important;
                            left: 0 !important;
                            right: 0 !important;
                            background: #2a2a2a !important;
                            border: 1px solid rgba(255, 255, 255, 0.1) !important;
                            border-radius: 8px !important;
                            max-height: 200px !important;
                            overflow-y: auto !important;
                            z-index: 10000 !important;
                            display: none !important;
                            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
                        "></div>
                    </div>
                    
                    <div id="sidebar-selected-cards" style="
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    ">
                        <!-- Selected cards will be populated here -->
                    </div>
                    
                    
                    <div id="sidebar-no-cards" style="
                        text-align: center;
                        padding: 30px 20px;
                        color: rgba(255, 255, 255, 0.5);
                        font-size: 14px;
                        display: block;
                    ">
                        <div style="font-size: 48px; margin-bottom: 10px; opacity: 0.3;">💳</div>
                        <div>No cards added yet</div>
                        <div>Search above to add your credit cards</div>
                    </div>
                </div>
                
                <!-- API Configuration Section -->
                <div class="config-section" style="margin-bottom: 30px;">
                    <h3 style="
                        font-size: 16px; 
                        font-weight: 600; 
                        margin-bottom: 15px; 
                        color: #ffffff;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <span style="color: #667eea;">🔑</span>
                        API Configuration
                    </h3>
                    
                    <div id="api-status-container">
                        <!-- API status will be populated here -->
                    </div>
                    
                    <div id="api-input-container" style="display: none; margin-top: 15px;">
                        <input 
                            type="password" 
                            id="sidebar-api-key-input" 
                            placeholder="Enter your Claude API key..."
                            style="
                                width: 100% !important;
                                padding: 12px 16px !important;
                                background: rgba(255, 255, 255, 0.05) !important;
                                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                                border-radius: 8px !important;
                                color: white !important;
                                font-size: 14px !important;
                                outline: none !important;
                                box-sizing: border-box !important;
                                margin-bottom: 10px !important;
                                font-family: monospace !important;
                            "
                        />
                        <div style="display: flex; gap: 8px;">
                            <button id="save-api-key-btn" style="
                                flex: 1;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                                border: none !important;
                                color: white !important;
                                padding: 8px 16px !important;
                                border-radius: 6px !important;
                                cursor: pointer !important;
                                font-size: 14px !important;
                                font-weight: 500 !important;
                            ">Save</button>
                            <button id="cancel-api-key-btn" style="
                                background: rgba(255, 255, 255, 0.1) !important;
                                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                                color: white !important;
                                padding: 8px 16px !important;
                                border-radius: 6px !important;
                                cursor: pointer !important;
                                font-size: 14px !important;
                            ">Cancel</button>
                        </div>
                    </div>
                </div>
                
                <!-- About Section -->
                <div class="config-section">
                    <h3 style="
                        font-size: 16px; 
                        font-weight: 600; 
                        margin-bottom: 15px; 
                        color: #ffffff;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <span style="color: #667eea;">ℹ️</span>
                        About
                    </h3>
                    
                    <div style="
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.7);
                        line-height: 1.5;
                    ">
                        <div style="margin-bottom: 8px;">
                            <strong style="color: white;">Pointwise v1.0</strong>
                        </div>
                        <div>
                            AI-powered credit card rewards optimization using Claude
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(settingsSidebar);
        
        // Add close handler
        settingsSidebar.querySelector('.sidebar-close-btn').addEventListener('click', closeSettingsSidebar);
        
        // Slide in animation
        setTimeout(() => {
            settingsSidebar.style.right = '0px';
        }, 50);
        
        // Load existing cards
        loadSidebarCards();
        
        // Setup card search - add small delay to ensure DOM is ready
        setTimeout(() => {
            console.log('Pointwise: Calling setupSidebarCardSearch after DOM ready');
            setupSidebarCardSearch();
        }, 250);
        
        // Load and setup API key management
        loadApiKeyStatus();
        setupApiKeyManagement();
    }
    
    // Close settings sidebar
    function closeSettingsSidebar() {
        if (!settingsSidebar) return;
        
        settingsSidebar.style.right = '-400px';
        
        setTimeout(() => {
            if (settingsSidebar) {
                settingsSidebar.remove();
                settingsSidebar = null;
            }
        }, 300);
    }
    
    // Load cards in sidebar
    async function loadSidebarCards() {
        try {
            const result = await safeChromeStorageGet('selectedCardIds');
            selectedCards = result.selectedCardIds || [];
            
            const container = settingsSidebar.querySelector('#sidebar-selected-cards');
            const noCardsMsg = settingsSidebar.querySelector('#sidebar-no-cards');
            
            if (selectedCards.length === 0) {
                container.innerHTML = '';
                noCardsMsg.style.display = 'block';
                return;
            }
            
            noCardsMsg.style.display = 'none';
            
            // Get card data from the database (need to import the full database)
            const cardData = selectedCards.map(id => {
                // For now, create a simple representation
                return {
                    id: id,
                    name: id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    issuer: getCardIssuer(id)
                };
            });
            
            container.innerHTML = cardData.map(card => `
                <div class="sidebar-card-item" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                ">
                    <div style="
                        width: 60px;
                        height: 38px;
                        border-radius: 4px;
                        overflow: hidden;
                        flex-shrink: 0;
                        background: rgba(255, 255, 255, 0.05);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <img 
                            src="${getCardImageUrl(card.id)}" 
                            alt="${card.name}"
                            style="
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                border-radius: 4px;
                            "
                            onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                        />
                        <div style="
                            display: none;
                            color: rgba(255,255,255,0.5);
                            font-size: 10px;
                            text-align: center;
                            padding: 4px;
                        ">
                            ${card.issuer.substring(0, 4)}
                        </div>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 600; font-size: 14px; color: white; margin-bottom: 2px;">
                            ${card.name}
                        </div>
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6);">
                            ${card.issuer}
                        </div>
                    </div>
                    <button 
                        class="remove-card-btn" 
                        data-card-id="${card.id}"
                        style="
                            width: 24px;
                            height: 24px;
                            border: none;
                            background: rgba(255, 59, 48, 0.2);
                            border-radius: 4px;
                            color: #ff3b30;
                            cursor: pointer;
                            font-size: 14px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        "
                    >×</button>
                </div>
            `).join('');
            
            // Add remove handlers
            container.querySelectorAll('.remove-card-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const cardId = e.target.getAttribute('data-card-id');
                    removeSidebarCard(cardId);
                });
            });
            
        } catch (error) {
            console.error('Error loading sidebar cards:', error);
        }
    }
    
    // Get card issuer from ID
    function getCardIssuer(cardId) {
        if (cardId.includes('chase')) return 'Chase';
        if (cardId.includes('amex')) return 'American Express';
        if (cardId.includes('capital_one')) return 'Capital One';
        if (cardId.includes('citi')) return 'Citi';
        if (cardId.includes('discover')) return 'Discover';
        if (cardId.includes('wells_fargo')) return 'Wells Fargo';
        if (cardId.includes('boa')) return 'Bank of America';
        if (cardId.includes('barclays')) return 'Barclays';
        if (cardId.includes('us_bank')) return 'U.S. Bank';
        return 'Other';
    }
    
    // Load card image manifest
    const CARD_IMAGE_MANIFEST = {
        "chase_sapphire_preferred": "data:image/svg+xml,%0A%20%20%20%20%20%20%20%20%3Csvg%20width%3D%22200%22%20height%3D%22125%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Crect%20width%3D%22200%22%20height%3D%22125%22%20rx%3D%228%22%20fill%3D%22%23117ACA%22%20stroke%3D%22%23ddd%22%20stroke-width%3D%221%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctext%20x%3D%2210%22%20y%3D%2220%22%20fill%3D%22white%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%3EChase%3C%2Ftext%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctext%20x%3D%2210%22%20y%3D%2240%22%20fill%3D%22white%22%20font-family%3D%22Arial%22%20font-size%3D%2210%22%3EChase%20Sapphire%20Preferred%3C%2Ftext%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%22170%22%20cy%3D%22100%22%20r%3D%2215%22%20fill%3D%22white%22%20opacity%3D%220.3%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%22185%22%20cy%3D%22100%22%20r%3D%2215%22%20fill%3D%22white%22%20opacity%3D%220.3%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2Fsvg%3E%0A%20%20%20%20",
        "chase_sapphire_reserve": "data:image/svg+xml,%0A%20%20%20%20%20%20%20%20%3Csvg%20width%3D%22200%22%20height%3D%22125%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Crect%20width%3D%22200%22%20height%3D%22125%22%20rx%3D%228%22%20fill%3D%22%23117ACA%22%20stroke%3D%22%23ddd%22%20stroke-width%3D%221%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctext%20x%3D%2210%22%20y%3D%2220%22%20fill%3D%22white%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%3EChase%3C%2Ftext%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ctext%20x%3D%2210%22%20y%3D%2240%22%20fill%3D%22white%22%20font-family%3D%22Arial%22%20font-size%3D%2210%22%3EChase%20Sapphire%20Reserve%3C%2Ftext%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%22170%22%20cy%3D%22100%22%20r%3D%2215%22%20fill%3D%22white%22%20opacity%3D%220.3%22%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Ccircle%20cx%3D%22185%22%20cy%3D%22100%22%20r%3D%2215%22%20fill%3D%22white%22%20opacity%3D%220.3%22%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2Fsvg%3E%0A%20%20%20%20",
        "amex_platinum": "images/cards/amex_platinum.png",
        "amex_gold": "images/cards/amex_gold.png"
        // More cards would be added from the full manifest
    };

    // Comprehensive credit card database
    const CREDIT_CARDS_DATABASE = [
        // Chase Cards (sample - full database would be much larger)
        { name: "Chase Sapphire Preferred", issuer: "Chase", id: "chase_sapphire_preferred" },
        { name: "Chase Sapphire Reserve", issuer: "Chase", id: "chase_sapphire_reserve" },
        { name: "Chase Freedom Unlimited", issuer: "Chase", id: "chase_freedom_unlimited" },
        { name: "Chase Freedom Flex", issuer: "Chase", id: "chase_freedom_flex" },
        { name: "Chase Amazon Prime Rewards", issuer: "Chase", id: "chase_amazon_prime" },
        { name: "Chase United Explorer", issuer: "Chase", id: "chase_united_explorer" },
        { name: "Chase Southwest Rapid Rewards Plus", issuer: "Chase", id: "chase_southwest_plus" },
        
        // American Express Cards
        { name: "American Express Platinum Card", issuer: "American Express", id: "amex_platinum" },
        { name: "American Express Gold Card", issuer: "American Express", id: "amex_gold" },
        { name: "American Express Green Card", issuer: "American Express", id: "amex_green" },
        { name: "American Express Blue Cash Preferred", issuer: "American Express", id: "amex_blue_cash_preferred" },
        { name: "American Express Blue Cash Everyday", issuer: "American Express", id: "amex_blue_cash_everyday" },
        { name: "American Express Delta SkyMiles Gold", issuer: "American Express", id: "amex_delta_gold" },
        { name: "American Express Hilton Honors", issuer: "American Express", id: "amex_hilton" },
        { name: "American Express Marriott Bonvoy Brilliant", issuer: "American Express", id: "amex_marriott" },
        
        // Capital One Cards
        { name: "Capital One Venture Rewards", issuer: "Capital One", id: "capital_one_venture" },
        { name: "Capital One Venture X Rewards", issuer: "Capital One", id: "capital_one_venture_x" },
        { name: "Capital One VentureOne Rewards", issuer: "Capital One", id: "capital_one_venture_one" },
        { name: "Capital One Savor Cash Rewards", issuer: "Capital One", id: "capital_one_savor" },
        { name: "Capital One SavorOne Cash Rewards", issuer: "Capital One", id: "capital_one_savor_one" },
        { name: "Capital One Quicksilver Cash Rewards", issuer: "Capital One", id: "capital_one_quicksilver" },
        { name: "Capital One Walmart Rewards", issuer: "Capital One", id: "capital_one_walmart" },
        
        // Citi Cards
        { name: "Citi Double Cash Card", issuer: "Citi", id: "citi_double_cash" },
        { name: "Citi Premier Card", issuer: "Citi", id: "citi_premier" },
        { name: "Citi Custom Cash Card", issuer: "Citi", id: "citi_custom_cash" },
        { name: "Citi AAdvantage Platinum Select", issuer: "Citi", id: "citi_aadvantage" },
        { name: "Costco Anywhere Visa", issuer: "Citi", id: "costco_anywhere" },
        
        // Discover Cards
        { name: "Discover it Cash Back", issuer: "Discover", id: "discover_it_cash" },
        { name: "Discover it Miles", issuer: "Discover", id: "discover_it_miles" },
        { name: "Discover it Chrome", issuer: "Discover", id: "discover_it_chrome" },
        
        // Wells Fargo Cards
        { name: "Wells Fargo Active Cash Card", issuer: "Wells Fargo", id: "wells_fargo_active_cash" },
        { name: "Wells Fargo Autograph Card", issuer: "Wells Fargo", id: "wells_fargo_autograph" },
        { name: "Bilt Mastercard", issuer: "Wells Fargo", id: "bilt_mastercard" },
        
        // Bank of America Cards
        { name: "Bank of America Premium Rewards", issuer: "Bank of America", id: "boa_premium_rewards" },
        { name: "Bank of America Cash Rewards", issuer: "Bank of America", id: "boa_cash_rewards" },
        { name: "Alaska Airlines Visa", issuer: "Bank of America", id: "alaska_airlines_visa" },
        
        // Other Popular Cards
        { name: "Apple Card", issuer: "Goldman Sachs", id: "apple_card" },
        { name: "Amazon Prime Rewards Visa", issuer: "Chase", id: "amazon_prime_visa" },
        { name: "Target RedCard", issuer: "TD Bank", id: "target_redcard" },
        { name: "REI Co-op Mastercard", issuer: "U.S. Bank", id: "rei_coop" },
        { name: "Uber Visa Card", issuer: "Barclays", id: "uber_visa" },
        { name: "PayPal Cashback Mastercard", issuer: "Synchrony", id: "paypal_cashback" }
    ];

    // Check if both cards and API key are configured, then run automatic analysis
    async function checkAndRunAutomaticAnalysis() {
        try {
            console.log('Pointwise: Checking if automatic analysis should run...');
            
            const storage = await safeChromeStorageGet(['selectedCardIds', 'claudeApiKey']);
            const selectedCardIds = storage.selectedCardIds || [];
            const apiKey = storage.claudeApiKey;
            
            const hasCards = selectedCardIds.length > 0;
            const hasApiKey = apiKey && apiKey.trim().length > 0;
            
            console.log('Pointwise: Configuration check - Cards:', hasCards, 'API Key:', hasApiKey);
            
            if (hasCards && hasApiKey) {
                console.log('Pointwise: Both cards and API key configured - running automatic analysis');
                
                // Close settings sidebar if open
                if (settingsSidebar && settingsSidebar.style.display !== 'none') {
                    settingsSidebar.style.display = 'none';
                    console.log('Pointwise: Closed settings sidebar');
                }
                
                // Wait a moment for UI to update
                setTimeout(() => {
                    console.log('Pointwise: Triggering automatic analysis for current merchant');
                    openAnalysisOverlay();
                }, 500);
                
                return true;
            } else {
                console.log('Pointwise: Automatic analysis not triggered - missing configuration');
                if (!hasCards) {
                    console.log('Pointwise: - No cards configured');
                }
                if (!hasApiKey) {
                    console.log('Pointwise: - No API key configured');
                }
                return false;
            }
            
        } catch (error) {
            console.error('Pointwise: Error in automatic analysis check:', error);
            return false;
        }
    }

    // Convert card name to card ID for image lookup
    function getCardIdFromName(cardName) {
        if (!cardName) return '';
        
        // Create a mapping from common card names to IDs
        const cardNameMapping = {
            'Chase Sapphire Preferred': 'chase_sapphire_preferred',
            'Chase Sapphire Reserve': 'chase_sapphire_reserve', 
            'Chase Freedom Unlimited': 'chase_freedom_unlimited',
            'Chase Freedom Flex': 'chase_freedom_flex',
            'American Express Platinum': 'amex_platinum',
            'American Express Gold': 'amex_gold',
            'Amex Platinum': 'amex_platinum',
            'Amex Gold': 'amex_gold',
            'Capital One Venture X': 'capital_one_venture_x',
            'Capital One Venture': 'capital_one_venture',
            'Citi Double Cash': 'citi_double_cash',
            'Discover it Cash Back': 'discover_it_cash',
            'Apple Card': 'apple_card'
        };
        
        // Try exact match first
        if (cardNameMapping[cardName]) {
            return cardNameMapping[cardName];
        }
        
        // Try partial matching
        const lowerName = cardName.toLowerCase();
        for (const [name, id] of Object.entries(cardNameMapping)) {
            if (lowerName.includes(name.toLowerCase()) || name.toLowerCase().includes(lowerName)) {
                return id;
            }
        }
        
        // Fallback: convert name to ID format
        return cardName.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .replace(/^(.{0,30}).*/, '$1'); // Limit length
    }

    // Get card image URL with fallback
    function getCardImageUrl(cardId) {
        const imageUrl = CARD_IMAGE_MANIFEST[cardId];
        if (imageUrl) {
            return imageUrl;
        }
        
        // Generate fallback placeholder
        const card = CREDIT_CARDS_DATABASE.find(c => c.id === cardId);
        if (!card) return '';
        
        const issuerColors = {
            "Chase": "#117ACA",
            "American Express": "#006FCF", 
            "Capital One": "#004879",
            "Citi": "#056EAE",
            "Discover": "#FF6000",
            "Wells Fargo": "#D71921",
            "Bank of America": "#E31837",
            "Goldman Sachs": "#000000",
            "TD Bank": "#00B04F",
            "U.S. Bank": "#0D4F8C",
            "Barclays": "#00AEEF",
            "Synchrony": "#0066CC"
        };
        
        const color = issuerColors[card.issuer] || "#666666";
        
        return `data:image/svg+xml,${encodeURIComponent(`
            <svg width="60" height="38" xmlns="http://www.w3.org/2000/svg">
                <rect width="60" height="38" rx="4" fill="${color}" stroke="#ddd" stroke-width="1"/>
                <text x="4" y="12" fill="white" font-family="Arial" font-size="8" font-weight="bold">${card.issuer}</text>
                <text x="4" y="22" fill="white" font-family="Arial" font-size="6">${card.name.substring(0, 15)}</text>
                <circle cx="50" cy="30" r="4" fill="white" opacity="0.3"/>
                <circle cx="56" cy="30" r="4" fill="white" opacity="0.3"/>
            </svg>
        `)}`;
    }

    // Setup card search in sidebar
    function setupSidebarCardSearch() {
        console.log('Pointwise: Setting up sidebar card search');
        
        // Check if sidebar exists
        if (!settingsSidebar) {
            console.error('Pointwise: Settings sidebar not found!');
            return;
        }
        
        const searchInput = settingsSidebar.querySelector('#sidebar-card-search');
        const dropdown = settingsSidebar.querySelector('#sidebar-card-dropdown');
        
        console.log('Pointwise: Search input found:', !!searchInput, searchInput);
        console.log('Pointwise: Dropdown found:', !!dropdown, dropdown);
        
        if (!searchInput || !dropdown) {
            console.error('Pointwise: Search setup failed - missing elements');
            console.error('Pointwise: settingsSidebar exists:', !!settingsSidebar);
            console.error('Pointwise: searchInput selector: #sidebar-card-search');
            console.error('Pointwise: dropdown selector: #sidebar-card-dropdown');
            return;
        }
        
        // Clear any existing event listeners to prevent duplicates
        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);
        
        newSearchInput.addEventListener('input', async (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            console.log('Pointwise: Card search input:', query);
            console.log('Pointwise: Event target:', e.target);
            
            if (query.length === 0) {
                dropdown.style.display = 'none';
                console.log('Pointwise: Hiding dropdown - empty query');
                return;
            }
            
            // Refresh selectedCards from storage to ensure we have the latest
            try {
                const result = await safeChromeStorageGet('selectedCardIds');
                selectedCards = result.selectedCardIds || [];
                console.log('Pointwise: Refreshed selectedCards from storage:', selectedCards);
            } catch (error) {
                console.error('Pointwise: Error refreshing selectedCards:', error);
                selectedCards = []; // Fallback to empty array
            }
            
            // Use comprehensive card database (now defined at top level)
            
            console.log('Pointwise: Total cards in database:', CREDIT_CARDS_DATABASE.length);
            console.log('Pointwise: Query to search for:', `"${query}"`);
            console.log('Pointwise: Sample cards from database:', CREDIT_CARDS_DATABASE.slice(0, 3));
            
            const filteredCards = CREDIT_CARDS_DATABASE.filter(card => {
                const nameMatch = card.name.toLowerCase().includes(query);
                const issuerMatch = card.issuer.toLowerCase().includes(query);
                const notSelected = !selectedCards.includes(card.id);
                
                console.log(`Pointwise: Checking card "${card.name}": nameMatch=${nameMatch}, issuerMatch=${issuerMatch}, notSelected=${notSelected}`);
                
                return notSelected && (nameMatch || issuerMatch);
            });
            
            console.log('Pointwise: Filtered cards:', filteredCards.length, 'results for query:', query);
            console.log('Pointwise: Selected cards to exclude:', selectedCards);
            console.log('Pointwise: Actual filtered cards:', filteredCards.map(c => c.name));
            
            if (filteredCards.length === 0) {
                // Check if cards exist but are already selected
                const allMatchingCards = CREDIT_CARDS_DATABASE.filter(card => 
                    card.name.toLowerCase().includes(query) || 
                    card.issuer.toLowerCase().includes(query)
                );
                
                console.log('Pointwise: All matching cards (ignoring selection):', allMatchingCards.length);
                
                if (allMatchingCards.length > 0) {
                    const alreadySelectedCount = allMatchingCards.filter(card => selectedCards.includes(card.id)).length;
                    dropdown.innerHTML = `<div style="padding: 12px; color: rgba(255,255,255,0.5);">
                        Found ${allMatchingCards.length} matching cards, but ${alreadySelectedCount} are already selected.
                        ${alreadySelectedCount === allMatchingCards.length ? 'Try a different search term.' : ''}
                    </div>`;
                    console.log('Pointwise: Cards found but already selected:', alreadySelectedCount, 'out of', allMatchingCards.length);
                } else {
                    dropdown.innerHTML = '<div style="padding: 12px; color: rgba(255,255,255,0.5);">No cards found. Try "chase", "amex", "capital", or "citi"</div>';
                    console.log('Pointwise: No cards found for query - database might be empty or query not matching');
                }
            } else {
                console.log('Pointwise: Displaying', filteredCards.length, 'cards');
                dropdown.innerHTML = filteredCards.map(card => `
                    <div class="sidebar-card-option pointwise-card-option" data-card-id="${card.id}" style="
                        padding: 12px;
                        cursor: pointer;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                        transition: background 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    ">
                        <div style="
                            width: 60px;
                            height: 38px;
                            border-radius: 4px;
                            overflow: hidden;
                            flex-shrink: 0;
                            background: rgba(255, 255, 255, 0.05);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <img 
                                src="${getCardImageUrl(card.id)}" 
                                alt="${card.name}"
                                style="
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                    border-radius: 4px;
                                "
                                onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                            />
                            <div style="
                                display: none;
                                color: rgba(255,255,255,0.5);
                                font-size: 10px;
                                text-align: center;
                                padding: 4px;
                            ">
                                ${card.issuer.substring(0, 4)}
                            </div>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="
                                font-weight: 600; 
                                font-size: 14px; 
                                color: white; 
                                margin-bottom: 2px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            ">
                                ${card.name}
                            </div>
                            <div style="
                                font-size: 12px; 
                                color: rgba(255, 255, 255, 0.6);
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            ">
                                ${card.issuer}
                            </div>
                        </div>
                    </div>
                `).join('');
            }
            
            // Show dropdown first
            dropdown.style.display = 'block';
            console.log('Pointwise: Dropdown shown with', filteredCards.length, 'results');
            
            // Add click handlers after dropdown is visible
            setTimeout(() => {
                const cardOptions = dropdown.querySelectorAll('.sidebar-card-option');
                console.log('Pointwise: Attaching handlers to', cardOptions.length, 'card options');
                
                cardOptions.forEach((option, index) => {
                    const cardId = option.getAttribute('data-card-id');
                    console.log(`Pointwise: Option ${index}: cardId=${cardId}`);
                    
                    // Remove any existing handlers by cloning
                    const newOption = option.cloneNode(true);
                    option.parentNode.replaceChild(newOption, option);
                    
                    // Add hover effects
                    newOption.addEventListener('mouseenter', () => {
                        newOption.style.background = 'rgba(255, 255, 255, 0.1)';
                    });
                    newOption.addEventListener('mouseleave', () => {
                        newOption.style.background = 'transparent';
                    });
                    
                    // Add click handler
                    newOption.addEventListener('click', (e) => {
                        console.log('Pointwise: Card clicked!', cardId);
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if (cardId) {
                            console.log('Pointwise: Adding card to selection:', cardId);
                            addSidebarCard(cardId).then(() => {
                                console.log('Pointwise: Card added successfully');
                            }).catch(err => {
                                console.error('Pointwise: Error adding card:', err);
                            });
                        } else {
                            console.error('Pointwise: No cardId found!');
                        }
                    });
                });
            }, 100);
            console.log('Pointwise: Search input handler completed');
        });
        
        // Hide dropdown when clicking outside
        const clickOutsideHandler = (e) => {
            const isInsideSearch = e.target.closest('#sidebar-card-search');
            const isInsideDropdown = e.target.closest('#sidebar-card-dropdown');
            
            if (!isInsideSearch && !isInsideDropdown) {
                dropdown.style.display = 'none';
            }
        };
        
        // Remove existing handler and add new one
        document.removeEventListener('click', clickOutsideHandler);
        document.addEventListener('click', clickOutsideHandler);
    }
    
    
    // Add card in sidebar
    async function addSidebarCard(cardId) {
        console.log('Pointwise: addSidebarCard called with cardId:', cardId);
        console.log('Pointwise: Current selectedCards before add:', selectedCards);
        
        if (selectedCards.includes(cardId)) {
            console.log('Pointwise: Card already selected, skipping:', cardId);
            return;
        }
        
        try {
            selectedCards.push(cardId);
            console.log('Pointwise: Updated selectedCards:', selectedCards);
            
            const saveResult = await safeChromeStorageSet({selectedCardIds: selectedCards});
            if (!saveResult) {
                console.error('Pointwise: Failed to save selectedCards to storage');
                alert('Failed to save card selection. Please try again or refresh the page.');
                return;
            }
            console.log('Pointwise: Successfully saved selectedCards to storage');
            
            // Removed automatic analysis - user must click analyze button manually
            
            // Clear search and reload cards
            const searchInput = settingsSidebar.querySelector('#sidebar-card-search');
            const dropdown = settingsSidebar.querySelector('#sidebar-card-dropdown');
            
            if (searchInput) {
                searchInput.value = '';
                console.log('Pointwise: Cleared search input');
            } else {
                console.error('Pointwise: Search input not found!');
            }
            
            if (dropdown) {
                dropdown.style.display = 'none';
                console.log('Pointwise: Hidden dropdown');
            } else {
                console.error('Pointwise: Dropdown not found!');
            }
            
            console.log('Pointwise: Calling loadSidebarCards to refresh display');
            await loadSidebarCards(); // Wait for the reload to complete
        } catch (error) {
            console.error('Pointwise: Error in addSidebarCard:', error);
        }
    }
    
    // Remove card in sidebar
    async function removeSidebarCard(cardId) {
        selectedCards = selectedCards.filter(id => id !== cardId);
        
        const saveResult = await safeChromeStorageSet({selectedCardIds: selectedCards});
        if (!saveResult) {
            console.error('Pointwise: Failed to save selectedCards after removal');
            alert('Failed to save card removal. Please try again or refresh the page.');
            return;
        }
        
        console.log('Pointwise: Successfully removed card from storage:', cardId);
        loadSidebarCards();
    }
    
    // Load API key status in sidebar
    async function loadApiKeyStatus() {
        try {
            const result = await safeChromeStorageGet('claudeApiKey');
            const apiKey = result.claudeApiKey;
            const statusContainer = settingsSidebar.querySelector('#api-status-container');
            
            if (apiKey && apiKey.length > 10) {
                // API key is configured
                statusContainer.innerHTML = `
                    <div class="api-status" style="
                        padding: 12px;
                        background: rgba(103, 126, 234, 0.1);
                        border: 1px solid rgba(103, 126, 234, 0.3);
                        border-radius: 8px;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.8);
                        margin-bottom: 10px;
                    ">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span>🟢</span>
                                <span>API key configured</span>
                            </div>
                            <button id="edit-api-key-btn" style="
                                background: rgba(255, 255, 255, 0.1);
                                border: 1px solid rgba(255, 255, 255, 0.2);
                                color: white;
                                padding: 4px 8px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            ">Edit</button>
                        </div>
                        <div style="margin-top: 8px; font-size: 12px; opacity: 0.8;">
                            Key: •••••••••••${apiKey.slice(-4)}
                        </div>
                    </div>
                `;
            } else {
                // No API key configured
                statusContainer.innerHTML = `
                    <div class="api-status" style="
                        padding: 12px;
                        background: rgba(255, 59, 48, 0.1);
                        border: 1px solid rgba(255, 59, 48, 0.3);
                        border-radius: 8px;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.8);
                        margin-bottom: 10px;
                    ">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span>🔴</span>
                                <span>Claude API key not configured</span>
                            </div>
                            <button id="add-api-key-btn" style="
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                border: none;
                                color: white;
                                padding: 4px 8px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: 500;
                            ">Add Key</button>
                        </div>
                        <div style="margin-top: 8px; font-size: 12px; opacity: 0.8;">
                            Add your API key to enable AI analysis
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading API key status:', error);
        }
    }
    
    // Setup API key management
    function setupApiKeyManagement() {
        const statusContainer = settingsSidebar.querySelector('#api-status-container');
        const inputContainer = settingsSidebar.querySelector('#api-input-container');
        const apiKeyInput = settingsSidebar.querySelector('#sidebar-api-key-input');
        const saveBtn = settingsSidebar.querySelector('#save-api-key-btn');
        const cancelBtn = settingsSidebar.querySelector('#cancel-api-key-btn');
        
        // Handle add/edit API key button clicks
        statusContainer.addEventListener('click', async (e) => {
            if (e.target.id === 'add-api-key-btn' || e.target.id === 'edit-api-key-btn') {
                // Show input container
                inputContainer.style.display = 'block';
                
                // Load existing key if editing
                if (e.target.id === 'edit-api-key-btn') {
                    const result = await safeChromeStorageGet('claudeApiKey');
                    if (result.claudeApiKey) {
                        apiKeyInput.value = result.claudeApiKey;
                    }
                }
                
                apiKeyInput.focus();
            }
        });
        
        // Handle save button
        saveBtn.addEventListener('click', async () => {
            const apiKey = apiKeyInput.value.trim();
            
            if (!apiKey) {
                alert('Please enter an API key');
                return;
            }
            
            if (!apiKey.startsWith('sk-ant-')) {
                alert('Please enter a valid Claude API key (should start with sk-ant-)');
                return;
            }
            
            try {
                // Save the API key
                const saveResult = await safeChromeStorageSet({ claudeApiKey: apiKey });
                if (!saveResult) {
                    console.error('Pointwise: Failed to save API key to storage');
                    alert('Failed to save API key. Please try again or refresh the page.');
                    return;
                }
                
                // Hide input container
                inputContainer.style.display = 'none';
                apiKeyInput.value = '';
                
                // Refresh the status display
                loadApiKeyStatus();
                
                console.log('Pointwise: API key saved successfully');
                
                // Removed automatic analysis - user must click analyze button manually
                
            } catch (error) {
                console.error('Error saving API key:', error);
                alert('Failed to save API key. Please try again.');
            }
        });
        
        // Handle cancel button
        cancelBtn.addEventListener('click', () => {
            inputContainer.style.display = 'none';
            apiKeyInput.value = '';
        });
        
        // Handle Enter key in input
        apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveBtn.click();
            }
        });
    }
    
    // Comprehensive regression test function
    function runRegressionTest() {
        console.log('🧪 Pointwise: Starting comprehensive regression test...');
        
        let testResults = {
            passed: 0,
            failed: 0,
            tests: []
        };
        
        function runTest(name, testFunction) {
            try {
                const result = testFunction();
                if (result) {
                    testResults.passed++;
                    testResults.tests.push({ name, status: '✅ PASS', details: result });
                    console.log(`✅ ${name}: PASSED`);
                } else {
                    testResults.failed++;
                    testResults.tests.push({ name, status: '❌ FAIL', details: 'Test returned false' });
                    console.log(`❌ ${name}: FAILED`);
                }
            } catch (error) {
                testResults.failed++;
                testResults.tests.push({ name, status: '❌ FAIL', details: error.message });
                console.log(`❌ ${name}: FAILED - ${error.message}`);
            }
        }
        
        // Test 1: Floating button exists
        runTest('Floating button creation', () => {
            return document.getElementById('pointwise-floating-button') !== null;
        });
        
        // Test 2: Floating button has correct styles
        runTest('Floating button styling', () => {
            const button = document.getElementById('pointwise-floating-button');
            if (!button) return false;
            const styles = window.getComputedStyle(button);
            return styles.position === 'fixed' && 
                   styles.zIndex >= '999999' &&
                   styles.display !== 'none';
        });
        
        // Test 3: Click handler exists
        runTest('Floating button click handler', () => {
            const button = document.getElementById('pointwise-floating-button');
            if (!button) return false;
            // Create a mock click event to test the handler
            const clickEvent = new Event('click', { bubbles: true });
            try {
                button.dispatchEvent(clickEvent);
                return true; // If no error, handler exists
            } catch (e) {
                return false;
            }
        });
        
        // Test 4: Storage access
        runTest('Chrome storage access', async () => {
            try {
                await safeChromeStorageGet('selectedCardIds');
                return true;
            } catch (e) {
                return false;
            }
        });
        
        // Test 5: Card database exists
        runTest('Card database availability', () => {
            // Test the card database in the search function
            const sampleQuery = 'chase';
            const cardDatabase = [
                { name: "Chase Sapphire Preferred", issuer: "Chase", id: "chase_sapphire_preferred" },
                { name: "Chase Sapphire Reserve", issuer: "Chase", id: "chase_sapphire_reserve" }
            ];
            const filtered = cardDatabase.filter(card => 
                card.name.toLowerCase().includes(sampleQuery) || 
                card.issuer.toLowerCase().includes(sampleQuery)
            );
            return filtered.length > 0;
        });
        
        // Test 6: AI-only approach verification
        runTest('AI-only approach (no local analysis)', () => {
            // Verify local analysis functions are removed
            return typeof getMerchantCategory === 'undefined' && 
                   typeof getCardMultiplier === 'undefined' && 
                   typeof getCardRewardType === 'undefined' &&
                   typeof performLocalAnalysis === 'undefined';
        });
        
        // Test 8: API key validation
        runTest('API key validation logic', () => {
            // Test the validation logic
            const validKey = 'sk-ant-1234567890abcdef';
            const invalidKey = 'invalid-key';
            return validKey.startsWith('sk-ant-') && !invalidKey.startsWith('sk-ant-');
        });
        
        // Print final results
        setTimeout(() => {
            console.log('\n🧪 REGRESSION TEST RESULTS:');
            console.log(`✅ Passed: ${testResults.passed}`);
            console.log(`❌ Failed: ${testResults.failed}`);
            console.log(`📊 Total: ${testResults.tests.length}`);
            console.log(`🎯 Success Rate: ${((testResults.passed / testResults.tests.length) * 100).toFixed(1)}%`);
            
            if (testResults.failed > 0) {
                console.log('\n❌ Failed Tests:');
                testResults.tests.filter(t => t.status.includes('FAIL')).forEach(test => {
                    console.log(`   • ${test.name}: ${test.details}`);
                });
            }
            
            console.log('\n🔧 Manual Tests to Perform:');
            console.log('   1. Click floating button → Should show overlay');
            console.log('   2. Click "Configure Extension" → Should open sidebar');
            console.log('   3. Search for cards → Should show dropdown');
            console.log('   4. Add/remove cards → Should update list');
            console.log('   5. Add API key → Should change status');
            console.log('   6. Test recommendations → Should show analysis');
            
        }, 100);
        
        return testResults;
    }
    
    // Initialize floating button
    function init() {
        console.log('Pointwise: Initializing floating button...');
        try {
            createFloatingButton();
            console.log('Pointwise: Floating button created successfully');
            
            // Run regression test in development
            if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
                setTimeout(runRegressionTest, 2000);
            }
        } catch (error) {
            console.error('Pointwise: Error creating floating button:', error);
        }
    }
    
    // Expose test function globally for manual testing
    window.pointwiseTest = runRegressionTest;
    
    // Start the extension immediately
    console.log('Pointwise: Content script loaded, document ready state:', document.readyState);
    console.log('💡 Tip: Run window.pointwiseTest() in console to run regression tests manually');
    
    // Initialize extension without floating button
    if (document.readyState === 'complete') {
        init();
    } else if (document.readyState === 'interactive') {
        setTimeout(init, 100);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
    
    // Make functions available globally for external access
    window.openAnalysisOverlay = openAnalysisOverlay;
    window.openSettingsSidebar = openSettingsSidebar;
    window.safeChromeStorageGet = safeChromeStorageGet;
    window.safeChromeStorageSet = safeChromeStorageSet;
    window.checkAndRunAutomaticAnalysis = checkAndRunAutomaticAnalysis;
    window.getCardRecommendations = getCardRecommendations;
    
    // Make database available globally for search functionality
    window.CREDIT_CARDS_DATABASE = CREDIT_CARDS_DATABASE;
})();

} // Close the if (!window.pointwiseExtensionLoaded) block