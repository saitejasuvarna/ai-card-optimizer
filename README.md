# 💳 Pointwise - AI Credit Card Optimizer

An intelligent Chrome extension that uses AI to analyze websites and recommend the best credit card for maximum rewards at any merchant.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![AI Powered](https://img.shields.io/badge/AI-Powered%20by%20Claude-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🤖 **AI-Powered Analysis**: Uses Claude Sonnet 4 to analyze merchant categories and recommend optimal cards
- 💳 **Smart Card Management**: Add and manage your credit card portfolio
- 🏆 **Best Card Recommendations**: Get personalized recommendations based on spending category
- 📊 **Transparent Decision Matrix**: See detailed scoring breakdown for each card
- ⚡ **Real-Time Analysis**: Instant recommendations as you browse
- 🎯 **Category-Specific**: Optimized recommendations for dining, gas, groceries, travel, and more

## 🖥️ Screenshots

![Extension Popup](screenshots/popup.png)
*Extension popup showing card management*

![Analysis Overlay](screenshots/analysis.png)
*AI analysis overlay with recommendations*

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ and npm
- Chrome browser
- Claude API key from [Anthropic Console](https://console.anthropic.com/api)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ai-card-optimizer.git
   cd ai-card-optimizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the proxy server:**
   ```bash
   # Option 1: Regular start (keep terminal open)
   npm start
   
   # Option 2: Background service (recommended)
   ./start-proxy-background.sh start
   ```

4. **Load extension in Chrome:**
   - Open Chrome → More Tools → Extensions
   - Enable "Developer mode"
   - Click "Load unpacked" → Select this directory

5. **Configure your API key:**
   - Click the extension icon
   - Go to Settings
   - Add your Claude API key
   - Add your credit cards

## 📦 Project Structure

```
ai-card-optimizer/
├── manifest.json              # Chrome extension manifest
├── popup.html                 # Extension popup interface  
├── popup.js                   # Popup functionality
├── content.js                 # Content script (main logic)
├── background.js              # Background service worker
├── proxy-server.js            # Local proxy server for API calls
├── styles.css                 # Extension styles
├── start-proxy.sh            # Simple proxy launcher
├── start-proxy-background.sh  # Background proxy manager
└── README.md                  # This file
```

## 🛠️ Usage

### Adding Credit Cards

1. Click the extension icon in your browser toolbar
2. Use the search box to find and add your credit cards
3. Cards are stored locally and never transmitted

### Getting Recommendations

1. Visit any shopping website
2. Click the floating "P" button or extension icon
3. Get instant AI-powered recommendations for that merchant

### Managing the Proxy Server

**Background Service (Recommended):**
```bash
./start-proxy-background.sh start    # Start in background
./start-proxy-background.sh status   # Check status
./start-proxy-background.sh stop     # Stop server
./start-proxy-background.sh logs     # View logs
```

**PM2 Process Manager:**
```bash
npm install -g pm2
pm2 start npm --name "card-optimizer" -- start
pm2 save && pm2 startup  # Auto-start on boot
```

## 🔧 Configuration

### API Key Setup

1. Get your Claude API key from [Anthropic Console](https://console.anthropic.com/api)
2. Open extension popup → Settings → API Configuration
3. Enter your API key and save

### Supported Credit Cards

The extension includes a comprehensive database of popular credit cards from major issuers:

- **Chase**: Sapphire Preferred/Reserve, Freedom Unlimited/Flex, Amazon Prime, United Explorer
- **American Express**: Platinum, Gold, Blue Cash Preferred/Everyday, Delta, Hilton, Marriott  
- **Capital One**: Venture/Venture X, Savor/SavorOne, Quicksilver
- **Citi**: Double Cash, Premier, Custom Cash, AAdvantage
- **Discover**: it Cash Back, it Miles, it Chrome
- **Wells Fargo**: Active Cash, Autograph, Bilt Mastercard
- **Bank of America**: Premium Rewards, Cash Rewards, Alaska Airlines
- And many more...

## 🤖 How It Works

1. **Content Detection**: The extension analyzes the current website's domain
2. **AI Processing**: Sends merchant info and your card portfolio to Claude API via local proxy
3. **Smart Analysis**: AI determines merchant category and evaluates each card's benefits
4. **Decision Matrix**: Creates transparent scoring based on reward multipliers, fees, caps, and flexibility
5. **Recommendations**: Presents the optimal card with detailed reasoning

## 🔒 Privacy & Security

- **Local Storage**: All card information stored locally in Chrome
- **No Data Collection**: No personal data transmitted or stored externally
- **API Key Security**: Your Claude API key is stored securely in Chrome's local storage
- **Local Proxy**: API calls routed through local proxy server for additional security

## 🐛 Troubleshooting

### Common Issues

**"Proxy server is not running"**
```bash
cd ai-card-optimizer
./start-proxy-background.sh start
```

**"Claude AI API key is required"**
- Add your API key in extension settings
- Verify key is valid at [Anthropic Console](https://console.anthropic.com/api)

**"Extension context invalidated"**
- Refresh the webpage
- Reload the extension in Chrome extensions page

**Permission errors with scripts**
```bash
chmod +x start-proxy.sh start-proxy-background.sh
```

### Debug Mode

Enable debug logging in the browser console to see detailed execution flow:
```javascript
// In browser console
localStorage.setItem('pointwise-debug', 'true')
```

## 📊 Performance

- **Analysis Speed**: ~2-3 seconds per recommendation
- **Memory Usage**: ~10MB Chrome extension overhead  
- **API Usage**: ~1-2 API calls per analysis
- **Background Process**: ~20MB Node.js proxy server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Anthropic](https://www.anthropic.com) for the Claude AI API
- Chrome Extensions API documentation
- Credit card data sourced from official issuer websites

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-card-optimizer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-card-optimizer/discussions)
- **Email**: your-email@example.com

---

**⭐ If this extension helps you maximize your credit card rewards, please consider giving it a star!**