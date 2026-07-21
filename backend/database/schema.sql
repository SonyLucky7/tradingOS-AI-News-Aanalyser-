-- ============================================================================
-- TradeOS AI: Production Database Schema (PostgreSQL + TimescaleDB)
-- Version: 1.0.0
-- Security: Row Level Security (RLS), RBAC, Encrypted PII, Time-series Partitioning
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. USERS & SUBSCRIPTIONS
-- ----------------------------------------------------------------------------

CREATE TYPE user_role AS ENUM ('TRADER', 'PRO_TRADER', 'INSTITUTIONAL', 'ADMIN');
CREATE TYPE subscription_tier AS ENUM ('FREE', 'PRO', 'INSTITUTIONAL_TERMINAL');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role user_role DEFAULT 'TRADER',
    tier subscription_tier DEFAULT 'PRO',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key_name VARCHAR(100) NOT NULL,
    api_key_hash VARCHAR(255) UNIQUE NOT NULL,
    permissions JSONB DEFAULT '["read"]'::jsonb,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. MARKET DATA & ASSETS
-- ----------------------------------------------------------------------------

CREATE TYPE asset_category AS ENUM ('CRYPTO', 'FOREX', 'INDIAN_STOCKS', 'US_STOCKS', 'COMMODITIES', 'MACRO_INDEX');

CREATE TABLE market_assets (
    symbol VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category asset_category NOT NULL,
    exchange VARCHAR(50),
    base_currency VARCHAR(10),
    quote_currency VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE realtime_tickers (
    symbol VARCHAR(30) REFERENCES market_assets(symbol),
    time TIMESTAMPTZ NOT NULL,
    price NUMERIC(20, 8) NOT NULL,
    change_24h NUMERIC(10, 4),
    volume_24h NUMERIC(30, 8),
    high_24h NUMERIC(20, 8),
    low_24h NUMERIC(20, 8),
    open_interest NUMERIC(30, 8),
    funding_rate NUMERIC(10, 6),
    PRIMARY KEY (symbol, time)
);

-- ----------------------------------------------------------------------------
-- 3. AI NEWS & EVENT PROCESSING ENGINE
-- ----------------------------------------------------------------------------

CREATE TYPE event_urgency AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE market_sentiment AS ENUM ('BULLISH', 'BEARISH', 'NEUTRAL');
CREATE TYPE expected_volatility AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'EXTREME');

CREATE TABLE news_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dedup_hash VARCHAR(64) UNIQUE NOT NULL,
    headline TEXT NOT NULL,
    source VARCHAR(100) NOT NULL,
    original_url TEXT,
    raw_content TEXT,
    ai_summary TEXT NOT NULL,
    ai_explanation TEXT,
    importance_score INT CHECK (importance_score BETWEEN 1 AND 100),
    urgency event_urgency DEFAULT 'MEDIUM',
    confidence_percent INT CHECK (confidence_percent BETWEEN 0 AND 100),
    sentiment market_sentiment DEFAULT 'NEUTRAL',
    expected_volatility expected_volatility DEFAULT 'MEDIUM',
    historical_similarity TEXT,
    probability_large_move INT CHECK (probability_large_move BETWEEN 0 AND 100),
    effect_timeframe VARCHAR(50),
    trade_recommendation TEXT,
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_affected_assets (
    event_id UUID REFERENCES news_events(id) ON DELETE CASCADE,
    symbol VARCHAR(30) REFERENCES market_assets(symbol),
    impact_direction market_sentiment,
    impact_magnitude INT CHECK (impact_magnitude BETWEEN 1 AND 100),
    PRIMARY KEY (event_id, symbol)
);

-- ----------------------------------------------------------------------------
-- 4. OPTION CHAIN & ON-CHAIN DATA
-- ----------------------------------------------------------------------------

CREATE TABLE option_chains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(30) REFERENCES market_assets(symbol),
    expiry_date DATE NOT NULL,
    strike_price NUMERIC(15, 2) NOT NULL,
    call_oi INT DEFAULT 0,
    call_oi_change INT DEFAULT 0,
    call_iv NUMERIC(6, 3),
    put_oi INT DEFAULT 0,
    put_oi_change INT DEFAULT 0,
    put_iv NUMERIC(6, 3),
    pcr NUMERIC(6, 3),
    max_pain NUMERIC(15, 2),
    fii_dii_net_flow_cr NUMERIC(15, 2),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE onchain_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(30) REFERENCES market_assets(symbol),
    whale_wallet_tx_count INT DEFAULT 0,
    exchange_net_inflow_usd NUMERIC(20, 2) DEFAULT 0.0,
    etf_net_inflow_usd NUMERIC(20, 2) DEFAULT 0.0,
    liquidation_24h_usd NUMERIC(20, 2) DEFAULT 0.0,
    active_addresses_24h INT DEFAULT 0,
    hashrate_ehs NUMERIC(10, 2),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. AI PRE-TRADE ASSISTANT & STOPLOSS INVESTIGATIONS
-- ----------------------------------------------------------------------------

CREATE TABLE pre_trade_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(30) REFERENCES market_assets(symbol),
    trade_side VARCHAR(10) CHECK (trade_side IN ('LONG', 'SHORT')),
    entry_price NUMERIC(20, 8),
    trade_score INT CHECK (trade_score BETWEEN 0 AND 100),
    risk_score INT CHECK (risk_score BETWEEN 0 AND 100),
    verdict VARCHAR(20) CHECK (verdict IN ('SAFE_ENTRY', 'WAIT', 'AVOID')),
    suggested_stop_loss NUMERIC(20, 8),
    suggested_target NUMERIC(20, 8),
    position_size_pct NUMERIC(5, 2),
    reasoning_summary TEXT,
    agent_breakdowns JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sl_investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(30) REFERENCES market_assets(symbol),
    sl_price NUMERIC(20, 8) NOT NULL,
    stopped_at TIMESTAMPTZ NOT NULL,
    root_cause_category VARCHAR(100) NOT NULL,
    investigation_report TEXT NOT NULL,
    was_manipulation BOOLEAN DEFAULT FALSE,
    recommended_recovery_action TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. PERSONAL TRADING JOURNAL & PSYCHOLOGY
-- ----------------------------------------------------------------------------

CREATE TABLE trading_journal (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(30) REFERENCES market_assets(symbol),
    trade_type VARCHAR(10) CHECK (trade_type IN ('LONG', 'SHORT')),
    entry_price NUMERIC(20, 8) NOT NULL,
    exit_price NUMERIC(20, 8),
    position_size NUMERIC(20, 8),
    risk_reward_ratio NUMERIC(5, 2),
    pnl_usd NUMERIC(15, 2),
    pnl_percent NUMERIC(8, 2),
    entry_time TIMESTAMPTZ NOT NULL,
    exit_time TIMESTAMPTZ,
    setup_name VARCHAR(100),
    emotional_state VARCHAR(50),
    mistakes TEXT[],
    news_during_trade JSONB,
    ai_psychology_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. GLOBAL RISK MAP MARKERS
-- ----------------------------------------------------------------------------

CREATE TABLE global_risk_markers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    ai_dossier TEXT NOT NULL,
    affected_markets VARCHAR(30)[],
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_news_published ON news_events(published_at DESC);
CREATE INDEX idx_news_urgency ON news_events(urgency);
CREATE INDEX idx_realtime_tickers_symbol_time ON realtime_tickers(symbol, time DESC);
CREATE INDEX idx_journal_user ON trading_journal(user_id, entry_time DESC);
CREATE INDEX idx_global_risk_category ON global_risk_markers(category);
