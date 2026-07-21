export type MarketCategory = 'CRYPTO' | 'FOREX' | 'INDIAN_STOCKS' | 'US_STOCKS' | 'COMMODITIES' | 'GEOPOLITICAL';

export type EventUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type MarketSentiment = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type ExpectedVolatility = 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export interface NewsEvent {
  id: string;
  headline: string;
  source: string;
  timeAgo: string;
  timestamp: string;
  category: MarketCategory;
  importanceScore: number; // 1-100
  urgency: EventUrgency;
  confidencePercent: number;
  sentiment: MarketSentiment;
  expectedVolatility: ExpectedVolatility;
  affectedSymbols: string[];
  summary: string;
  aiExplanation: string;
  historicalComparison: string;
  probabilityLargeMove: number;
  effectTimeframe: string;
  tradeRecommendation: string;
  warningAlert?: string;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  fundingRate?: number;
  openInterest?: string;
  chartData: number[];
}

export interface PreTradeInput {
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  timeframe: string;
}

export interface PreTradeEvaluation {
  symbol: string;
  side: 'LONG' | 'SHORT';
  tradeScore: number; // 0-100
  riskScore: number; // 0-100
  confidence: number;
  verdict: 'SAFE_ENTRY' | 'WAIT' | 'AVOID';
  safeEntryTime: string;
  suggestedStopLoss: number;
  suggestedTarget: number;
  suggestedPositionSizePct: number;
  expectedVolatility: ExpectedVolatility;
  upcomingEventsWarning: string[];
  reasoningSummary: string;
  agentBreakdowns: {
    agentName: string;
    verdict: 'BULLISH' | 'BEARISH' | 'CAUTION';
    keyPoint: string;
  }[];
}

export interface StoplossInvestigation {
  symbol: string;
  slPrice: number;
  stoppedAtTime: string;
  tradeSide: 'LONG' | 'SHORT';
  rootCauseCategory: 'FED_SPEECH' | 'LIQUIDITY_SWEEP' | 'WHALE_DUMP' | 'FUNDING_SPIKE' | 'MANIPULATION';
  title: string;
  detailedReport: string;
  wasManipulation: boolean;
  recoveryAdvice: string;
  anomaliesDetected: {
    type: string;
    metric: string;
    severity: string;
  }[];
}

export interface RiskMarker {
  id: string;
  title: string;
  category: 'MILITARY' | 'CYBER' | 'WEATHER' | 'ENERGY' | 'ELECTION' | 'SHIPPING';
  severity: EventUrgency;
  lat: number;
  lng: number;
  locationName: string;
  affectedMarkets: string[];
  summary: string;
  aiDossier: string;
  timestamp: string;
}

export interface OptionChainRow {
  strikePrice: number;
  callOI: number;
  callOIChange: number;
  callIV: number;
  callLTP: number;
  putOI: number;
  putOIChange: number;
  putIV: number;
  putLTP: number;
}

export interface OptionChainData {
  symbol: string;
  underlyingPrice: number;
  pcrRatio: number;
  maxPain: number;
  fiiNetFlowCr: number;
  diiNetFlowCr: number;
  interpretation: string;
  rows: OptionChainRow[];
}

export interface JournalEntry {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  pnlUsd: number;
  pnlPercent: number;
  riskReward: number;
  entryTime: string;
  setupName: string;
  emotion: 'CALM' | 'FOMO' | 'REVENGE' | 'ANXIOUS' | 'GREEDY';
  mistakes: string[];
  attachedNews: string;
  aiPsychologyCoachFeedback: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  forecast: string;
  previous: string;
  actual?: string;
  countdownMinutes: number;
  aiWarning?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  agentName?: string;
  text: string;
  timestamp: string;
  dataCard?: any;
}
