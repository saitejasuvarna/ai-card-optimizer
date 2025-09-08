// Background service worker that makes API calls through local proxy server

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeCard') {
        analyzeCardWithProxy(request.domain, request.cards)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep the message channel open for async response
    }
    
    // Handle request to inject content script from popup
    if (request.action === 'injectContentScript') {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs[0]) {
                try {
                    // Check if content script is already injected
                    const response = await chrome.tabs.sendMessage(tabs[0].id, { action: 'ping' }).catch(() => null);
                    
                    if (!response) {
                        // Inject CSS first
                        await chrome.scripting.insertCSS({
                            target: { tabId: tabs[0].id },
                            files: ['styles.css']
                        });
                        
                        // Then inject the content script
                        await chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            files: ['content.js']
                        });
                    }
                    
                    sendResponse({ success: true });
                } catch (error) {
                    console.error('Failed to inject content script:', error);
                    sendResponse({ success: false, error: error.message });
                }
            }
        });
        return true; // Keep message channel open for async response
    }
});

async function analyzeCardWithProxy(domain, selectedCards) {
    try {
        // Get the stored API key
        const result = await chrome.storage.local.get('claudeApiKey');
        const apiKey = result.claudeApiKey;
        
        if (!apiKey) {
            throw new Error('No API key configured. Please go to Settings to add your Claude API key.');
        }
        
        // Call local proxy server instead of Claude API directly
        const response = await fetch("http://localhost:3002/analyze-card", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                domain: domain,
                cards: selectedCards,
                apiKey: apiKey
            })
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your Claude API key in Settings.');
            }
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again in a few minutes.');
            }
            if (response.status === 529) {
                throw new Error('Claude API is temporarily overloaded. Please try again in a few moments.');
            }
            if (response.status === 500) {
                throw new Error('Server error. Please check if the proxy server is running correctly.');
            }
            if (response.status === 503) {
                throw new Error('Service temporarily unavailable. Please try again later.');
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Request failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.error || 'Analysis failed');
        }
        
    } catch (error) {
        console.error('Claude API error:', error);
        
        // Check for network errors
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Cannot connect to proxy server. Please ensure the proxy server is running on localhost:3002.');
        }
        
        // Check for CORS or connection refused
        if (error.message.includes('CORS') || error.message.includes('ERR_CONNECTION_REFUSED')) {
            throw new Error('Proxy server connection refused. Please start the proxy server (node proxy-server.js) first.');
        }
        
        // Pass through any other errors
        throw error;
    }
}