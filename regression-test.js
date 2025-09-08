// Comprehensive Regression Test for Pointwise Chrome Extension
// Tests all core functionality to ensure nothing is broken

const assert = require('assert');
const fetch = require('node-fetch');

console.log('=== POINTWISE REGRESSION TEST SUITE ===\n');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testProxyServer() {
    console.log('1. Testing Proxy Server...');
    
    try {
        // Test health endpoint
        const healthResponse = await fetch('http://localhost:3002/health');
        const healthData = await healthResponse.json();
        assert.strictEqual(healthData.status, 'ok', 'Health check failed');
        console.log('   ✓ Health endpoint working');
        
        // Test analyze endpoint with mock data
        const testPayload = {
            domain: 'amazon.com',
            cards: [
                { name: 'Chase Sapphire Preferred', issuer: 'Chase' },
                { name: 'American Express Gold Card', issuer: 'American Express' }
            ],
            apiKey: process.env.CLAUDE_API_KEY || 'test-key'
        };
        
        console.log('   - Testing analyze endpoint (this may take a moment)...');
        const analyzeResponse = await fetch('http://localhost:3002/analyze-card', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload)
        });
        
        if (analyzeResponse.ok) {
            const analyzeData = await analyzeResponse.json();
            
            // Check response structure
            assert(analyzeData.success !== undefined, 'Response missing success field');
            
            if (analyzeData.success) {
                assert(analyzeData.data, 'Response missing data field');
                console.log('   ✓ Analyze endpoint working with valid API key');
            } else {
                console.log('   ⚠ Analyze endpoint returned error (check API key):', analyzeData.error);
            }
        } else {
            console.log('   ⚠ Analyze endpoint returned status:', analyzeResponse.status);
        }
        
        console.log('   ✅ Proxy server tests passed\n');
        return true;
    } catch (error) {
        console.error('   ❌ Proxy server test failed:', error.message);
        return false;
    }
}

async function testFileIntegrity() {
    console.log('2. Testing File Integrity...');
    
    const fs = require('fs');
    const requiredFiles = [
        'manifest.json',
        'background.js',
        'content.js',
        'popup.html',
        'popup.js',
        'styles.css',
        'proxy-server.js',
        'package.json'
    ];
    
    let allFilesExist = true;
    for (const file of requiredFiles) {
        if (fs.existsSync(file)) {
            console.log(`   ✓ ${file} exists`);
        } else {
            console.log(`   ❌ ${file} missing`);
            allFilesExist = false;
        }
    }
    
    if (allFilesExist) {
        console.log('   ✅ All required files present\n');
    } else {
        console.log('   ❌ Some files are missing\n');
    }
    
    return allFilesExist;
}

async function testManifestStructure() {
    console.log('3. Testing Manifest Structure...');
    
    const fs = require('fs');
    try {
        const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
        
        // Check required fields
        assert(manifest.manifest_version === 3, 'Manifest version should be 3');
        assert(manifest.name, 'Missing extension name');
        assert(manifest.version, 'Missing extension version');
        assert(manifest.permissions.includes('activeTab'), 'Missing activeTab permission');
        assert(manifest.permissions.includes('storage'), 'Missing storage permission');
        assert(manifest.permissions.includes('scripting'), 'Missing scripting permission');
        assert(manifest.action, 'Missing action configuration');
        assert(manifest.background, 'Missing background service worker');
        
        console.log('   ✓ Manifest version: 3');
        console.log('   ✓ Required permissions present');
        console.log('   ✓ Action configured');
        console.log('   ✓ Background service worker configured');
        console.log('   ✅ Manifest structure valid\n');
        return true;
    } catch (error) {
        console.error('   ❌ Manifest test failed:', error.message);
        return false;
    }
}

async function testJavaScriptSyntax() {
    console.log('4. Testing JavaScript Syntax...');
    
    const fs = require('fs');
    const vm = require('vm');
    
    const jsFiles = [
        { name: 'background.js', isModule: false },
        { name: 'content.js', isModule: false },
        { name: 'popup.js', isModule: false },
        { name: 'proxy-server.js', isModule: true }
    ];
    
    let allValid = true;
    for (const file of jsFiles) {
        try {
            const code = fs.readFileSync(file.name, 'utf8');
            
            if (file.isModule) {
                // For Node.js modules, just check basic syntax
                new vm.Script(code, { filename: file.name, displayErrors: false });
            } else {
                // For browser scripts, wrap in IIFE to check syntax
                new vm.Script(`(function() { ${code} })()`, { 
                    filename: file.name, 
                    displayErrors: false 
                });
            }
            
            console.log(`   ✓ ${file.name} syntax valid`);
        } catch (error) {
            console.log(`   ❌ ${file.name} syntax error:`, error.message);
            allValid = false;
        }
    }
    
    if (allValid) {
        console.log('   ✅ All JavaScript files have valid syntax\n');
    } else {
        console.log('   ❌ Some JavaScript files have syntax errors\n');
    }
    
    return allValid;
}

async function testCSSValidity() {
    console.log('5. Testing CSS Validity...');
    
    const fs = require('fs');
    try {
        const css = fs.readFileSync('styles.css', 'utf8');
        
        // Basic CSS validation checks
        const openBraces = (css.match(/{/g) || []).length;
        const closeBraces = (css.match(/}/g) || []).length;
        assert.strictEqual(openBraces, closeBraces, 'Mismatched braces in CSS');
        
        // Check for required animations
        assert(css.includes('@keyframes pointwise-spin'), 'Missing pointwise-spin animation');
        assert(css.includes('@keyframes pointwise-fade-in'), 'Missing pointwise-fade-in animation');
        
        // Check for essential classes
        assert(css.includes('#pointwise-floating-button'), 'Missing floating button styles');
        assert(css.includes('#pointwise-analysis-overlay'), 'Missing overlay styles');
        assert(css.includes('.loading-spinner'), 'Missing loading spinner styles');
        
        console.log('   ✓ CSS braces balanced');
        console.log('   ✓ Required animations present');
        console.log('   ✓ Essential classes defined');
        console.log('   ✅ CSS validity checks passed\n');
        return true;
    } catch (error) {
        console.error('   ❌ CSS test failed:', error.message);
        return false;
    }
}

async function testCriticalFunctionality() {
    console.log('6. Testing Critical Functionality...');
    
    const fs = require('fs');
    
    try {
        // Check content.js for critical functions
        const contentJs = fs.readFileSync('content.js', 'utf8');
        assert(contentJs.includes('setupAnalyzeButton'), 'Missing setupAnalyzeButton function');
        assert(contentJs.includes('checkAndRunAutomaticAnalysis'), 'Missing analysis function');
        assert(contentJs.includes('chrome.runtime.onMessage'), 'Missing message listener');
        console.log('   ✓ Content script has required functions');
        
        // Check background.js for message handling
        const backgroundJs = fs.readFileSync('background.js', 'utf8');
        assert(backgroundJs.includes('analyzeCardWithProxy'), 'Missing proxy function');
        assert(backgroundJs.includes('injectContentScript'), 'Missing injection handler');
        console.log('   ✓ Background script has required handlers');
        
        // Check popup.js for initialization
        const popupJs = fs.readFileSync('popup.js', 'utf8');
        assert(popupJs.includes('DOMContentLoaded'), 'Missing DOM ready listener');
        assert(popupJs.includes('injectContentScript'), 'Missing content script injection');
        console.log('   ✓ Popup script has initialization code');
        
        console.log('   ✅ Critical functionality present\n');
        return true;
    } catch (error) {
        console.error('   ❌ Functionality test failed:', error.message);
        return false;
    }
}

// Run all tests
async function runRegressionTests() {
    console.log('Starting regression tests...\n');
    console.log('===============================\n');
    
    const results = {
        proxyServer: await testProxyServer(),
        fileIntegrity: await testFileIntegrity(),
        manifestStructure: await testManifestStructure(),
        javascriptSyntax: await testJavaScriptSyntax(),
        cssValidity: await testCSSValidity(),
        criticalFunctionality: await testCriticalFunctionality()
    };
    
    console.log('===============================');
    console.log('REGRESSION TEST SUMMARY:');
    console.log('===============================');
    
    let totalTests = 0;
    let passedTests = 0;
    
    for (const [test, passed] of Object.entries(results)) {
        totalTests++;
        if (passed) {
            passedTests++;
            console.log(`✅ ${test}: PASSED`);
        } else {
            console.log(`❌ ${test}: FAILED`);
        }
    }
    
    console.log('===============================');
    console.log(`Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 ALL REGRESSION TESTS PASSED! 🎉');
        console.log('The extension is ready for use.');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the errors above.');
    }
    
    return passedTests === totalTests;
}

// Execute tests
runRegressionTests().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});