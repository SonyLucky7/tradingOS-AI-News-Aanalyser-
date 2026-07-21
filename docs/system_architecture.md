# TradeOS AI - System & Backend Architecture Specification

## 1. High-Level Microservice Overview
TradeOS AI uses an event-driven microservices architecture communicating via high-throughput gRPC for inter-service calls and Apache Kafka for asynchronous event ingestion.

```
                    ┌─────────────────────────┐
                    │    React / Next.js OS   │
                    │ (WebSocket + REST API)  │
                    └────────────┬────────────┘
                                 │ TLS 1.3 / WSS
                    ┌────────────▼────────────┐
                    │  API Gateway (Kong/Envoy)│
                    │  Auth, Rate-limiting    │
                    └────────────┬────────────┘
                                 │
   ┌───────────────────┬─────────┴─────────┬───────────────────┐
   │                   │                   │                   │
┌──▼───────────┐   ┌───▼───────────┐   ┌───▼───────────┐   ┌───▼───────────┐
│ Market Data  │   │ AI Event      │   │ AI Agent Mesh │   │ Trading Engine│
│ Microservice │   │ Ingestion     │   │ (13 Agents)   │   │ & Journal     │
└──────┬───────┘   └──────┬────────┘   └──────┬────────┘   └──────┬────────┘
       │                  │                   │                   │
┌──────▼──────────────────▼───────────────────▼───────────────────▼────────┐
│                        Kafka Event Bus / Redis PubSub                     │
└──────┬──────────────────────────────────────────────────────────┬─────────┘
       │                                                          │
┌──────▼──────────────────────────┐                    ┌───────────▼─────────┐
│ TimescaleDB (Time-series ticks) │                    │ PostgreSQL (Master) │
└─────────────────────────────────┘                    └─────────────────────┘
```

## 2. The 13 AI Agent Orchestration Pipeline
TradeOS AI deploys 13 domain-expert LLM workers orchestrated by a **Master Coordinator Agent**:

1. **News Agent**: Deduplicates news using MinHash/LSH, classifies impact (1-100), extracts entities.
2. **Macro Agent**: Monitors interest rates, FOMC dot plots, CPI/PPI data releases, bond yields.
3. **Crypto Agent**: Analyzes funding rates, liquidation heatmaps, ETF inflows/outflows, whale transfers.
4. **Forex Agent**: Computes currency strength matrix and carry trade differentials.
5. **Indian Market Agent**: Computes NSE/BSE option chain PCR, FII/DII institutional cash activity, Max Pain.
6. **Risk Agent**: Computes Trade Score (0-100), Risk Score, recommended position sizing.
7. **Trading Coach**: Evaluates proposed trade entries against current market regimes.
8. **Journal Coach**: Mines past user trade journals to identify behavioral weaknesses.
9. **Psychology Coach**: Detects FOMO, revenge trading, and emotional over-leveraging.
10. **Alert Agent**: Dispatches priority push notifications across Web, Telegram, Discord, Email.
11. **Research Agent**: Cross-references historical market patterns with incoming catalysts.
12. **Portfolio Agent**: Analyzes cross-asset correlations to prevent portfolio overexposure.
13. **Automation Agent**: Executes automated morning briefings, pre-market checks, and EOD reports.

## 3. Real-Time Streaming Architecture
- **Inbound Data Ingestion**: WebSocket connections to Binance, OKX, CoinGlass, Refinitiv/Bloomberg APIs, NSE/BSE feeds.
- **Deduplication Engine**: Hash-based deduplication window (5-minute rolling window) preventing duplicate news stories.
- **Latency Target**: Event detection to UI alert dispatch in < 450ms.

## 4. Security & Compliance
- **Authentication**: JWT with refresh token rotation + OAuth2 (Google/GitHub/Okta).
- **Two-Factor Authentication**: TOTP (Google Authenticator, Authy) & WebAuthn hardware keys.
- **Role-Based Access Control (RBAC)**: `TRADER`, `PRO_TRADER`, `INSTITUTIONAL`, `ADMIN`.
- **API Security**: Cloudflare WAF, Envoy rate limiting, TLS 1.3 encryption in transit, AES-256 for user PII and trade notes.
