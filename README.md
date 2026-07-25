# ⚡ TradeOS AI — Institutional Trading Intelligence OS

> **Know the Market Before the Market Moves**  
> An institutional-grade real-time market intelligence desktop terminal & web app powered by multi-provider AI agents, live breaking news impact engines, real-time WebSocket feeds, option chain liquidity heatmaps, and embedded TradingView charts.

---

## 🌟 Key Features

### 1. 📈 Multi-Asset Live Market Terminal (78+ Tickers)
- **Asset Coverage**: 20 Crypto pairs, 25 NSE Indian Stocks & Indices (**priced in ₹ Rupees**), 15 Forex pairs, 8 Commodities, and 10 US Equities.
- **Real-Time Data Engine**: Binance WebSocket streams for Crypto + live Yahoo Finance quotes for NSE, Commodities, & Forex.
- **Market Hours Engine**: Live status tags (OPEN, CLOSED, WEEKEND) tailored for NSE India (Asia/Kolkata IST) and EST global markets.
- **TradingView Controls**: Native Fullscreen toggles, technical indicators, and manual refresh controls.
- **Starred-to-Top Watchlist**: Star any asset to float it to the top of your watchlist automatically.

### 2. 🧠 Multi-Provider AI Intelligence Engine
- **Pre-Configured Default Keys**: Works out-of-the-box using **Google Gemini 2.0 Flash** & **Groq Llama 3.1 70B**.
- **7 Supported AI Providers**:
  1. **Google Gemini** (Gemini 2.0 Flash — default)
  2. **Groq Cloud** (Llama 3.1 70B — ultra-fast inference)
  3. **OpenAI** (GPT-4o / GPT-4o-mini)
  4. **Anthropic Claude** (Claude Sonnet 4 / Opus)
  5. **Ollama Local** (Run Llama 3 / Mistral offline on your PC)
  6. **Custom API** (Any OpenAI-compatible endpoint)
  7. **Smart Local Engine** (Built-in rule engine, zero latency, guaranteed offline analysis)
- **Automatic Fallback Chain**: Selected Provider → Gemini → Groq → Smart Local Engine (100% Uptime guaranteed).

### 3. 🚨 Real-Time Live Breaking News Toast Alerts
- **Live Impact Flash**: Pops up automatically when breaking financial news arrives.
- **Which Markets Affected**: Highlights exact impacted symbols (`BTCUSDT`, `NIFTY50`, `EURUSD`, `BANKNIFTY`, etc.).
- **WHY it Moves the Market**: 2-3 sentence AI summary explaining cause and effect, directional impact (🟢 BULLISH / 🔴 BEARISH / 🟡 VOLATILE), and risk duration.

### 4. 📺 Institutional Live TV Streams
- Verified 24/7 direct YouTube embeds for:
  - **Bloomberg TV Live** (Global Business & Crypto Macro)
  - **Sky News Live** (Global Macro & UK)
  - **France 24 English** (Global Commodities & Oil)
  - **DW News Live** (European ECB & Trade)
  - **TV9 Telugu Live** & **NTV Telugu Live** (Telugu News & Indian Markets)
- Backup stream switcher button for zero playback interruptions.

### 5. 🛡️ Institutional Intelligence Modules
- **Pre-Trade Safety Co-Pilot**: Multi-agent entry score (1-100) checking whale inflows, funding rates, and news risk prior to entry.
- **Stoploss Post-Mortem Investigator**: Forensic diagnostic determining whether an SL hit was a liquidity sweep/stop hunt or a real trend reversal.
- **Option Chain & FII/DII Intelligence**: Put-Call Ratio (PCR), Max Pain anchor, Call/Put Open Interest (OI) buildup, and FII/DII cash flow tracking.
- **Daily & EOD Briefings**: Automated Morning checklists and End-of-Day trade performance audits.
- **Trading Journal with AI Psychology Coach**: Auto-logs trades, tracks trader emotions (FOMO, Revenge, Calm), and gives behavioral feedback.

---

## 🚀 How to Install (For Clients)

Welcome to TradeOS AI! Follow these simple steps to install the software on your Windows PC:

1. **Download the Installer**: Download the official `TradeOS_AI_Setup_1.0.0.exe` file provided to you.
2. **Run the Setup**: Double-click the downloaded `.exe` file.
3. **Wait for Installation**: You will see the TradeOS AI splash screen appear briefly while the software silently installs in the background. No complicated wizard steps required!
4. **Launch & Trade**: Once installed, TradeOS AI will automatically launch. You will also find a convenient **TradeOS AI** shortcut on your Desktop and in your Start Menu for future use.

---

## ⚙️ AI Configuration & Settings

Go to **Settings & API Keys** in the sidebar to select your AI model:
- **Default Out-of-the-Box**: Uses Google Gemini 2.0 Flash / Groq Llama 3.1 70B (Keys pre-configured).
- **Custom API Keys**: Easily enter your own OpenAI (`sk-...`), Claude (`sk-ant-...`), or Gemini (`AIza...`) key.
- **Ollama Local Setup**:
  1. Download Ollama from [ollama.com](https://ollama.com/download)
  2. Run: `ollama pull llama3`
  3. Start server: `ollama serve`
  4. Select **Ollama Local** in TradeOS Settings.

---

## 📂 Project Structure

```
tradingOS-AI-News-Aanalyser-/
├── electron/                 # Electron main & preload scripts for Desktop App
│   ├── main.cjs
│   └── preload.cjs
├── src/
│   ├── components/
│   │   ├── Header.tsx        # Top navigation, global dual-format IST clocks
│   │   ├── Sidebar.tsx       # Module navigation panel
│   │   ├── TradingViewChart.tsx # Embedded TradingView player with fullscreen & indicators
│   │   ├── LiveTVStream.tsx  # Direct live stream embeds (Forex, Crypto, Telugu)
│   │   ├── NewsToastPopup.tsx# Real-time breaking news flash alert toast
│   │   └── modules/          # 10 Intelligence Modules (Terminal, News, Copilot, SL, Option Chain, Journal, etc.)
│   ├── context/
│   │   └── TradeOSContext.tsx # Central state management & WebSocket / Yahoo quote orchestration
│   ├── services/
│   │   ├── groqAI.ts         # Multi-provider AI service (Gemini, Groq, OpenAI, Claude, Ollama, Local)
│   │   ├── unifiedLiveData.ts# Yahoo Finance quote proxy & Google RSS live news feed
│   │   └── liveWebSocket.ts  # Binance WebSocket live crypto price engine
│   ├── utils/
│   │   └── marketHours.ts    # IST / EST market status detection engine
│   └── App.tsx               # Main application routing container
├── package.json              # Project scripts & Electron packager settings
├── vite.config.ts            # Vite bundler configuration
└── README.md                 # Documentation
```

---

## 🛡️ License & Disclaimer

*Disclaimer: TradeOS AI is designed for informational and institutional trading research purposes. Always apply strict risk management and position sizing rules before executing financial trades.*
