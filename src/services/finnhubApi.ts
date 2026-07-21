// Finnhub Live Market Data & News Integration for TradeOS AI
// Key: d9fko59r01qu5nhesvugd9fko59r01qu5nhesvv0

const FINNHUB_KEY = 'd9fko59r01qu5nhesvugd9fko59r01qu5nhesvv0';

export interface FinnhubQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Change percent
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
}

export interface FinnhubNewsItem {
  id: number;
  category: string;
  datetime: number;
  headline: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

// Fetch Live Quote from Finnhub
export async function fetchFinnhubQuote(symbol: string): Promise<FinnhubQuote | null> {
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_KEY}`);
    if (!res.ok) return null;
    const data: FinnhubQuote = await res.json();
    if (data && data.c > 0) {
      return data;
    }
    return null;
  } catch (err) {
    console.warn(`Finnhub quote fetch failed for ${symbol}:`, err);
    return null;
  }
}

// Fetch Live Market News from Finnhub
export async function fetchFinnhubLiveNews(): Promise<FinnhubNewsItem[]> {
  try {
    const res = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_KEY}`);
    if (!res.ok) return [];
    const data: FinnhubNewsItem[] = await res.json();
    return Array.isArray(data) ? data.slice(0, 10) : [];
  } catch (err) {
    console.warn('Finnhub news fetch failed:', err);
    return [];
  }
}

// Finnhub WebSocket Connection
export class FinnhubWebSocketService {
  private ws: WebSocket | null = null;
  private onTradeCallback: ((symbol: string, price: number) => void) | null = null;

  public connect(symbols: string[], onTrade: (symbol: string, price: number) => void) {
    this.onTradeCallback = onTrade;

    try {
      this.ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_KEY}`);

      this.ws.onopen = () => {
        console.log('⚡ TradeOS AI: Connected to Finnhub Live WebSocket Stream');
        symbols.forEach(sym => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'subscribe', symbol: sym }));
          }
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'trade' && Array.isArray(payload.data)) {
            payload.data.forEach((trade: any) => {
              if (trade.s && trade.p && this.onTradeCallback) {
                this.onTradeCallback(trade.s, trade.p);
              }
            });
          }
        } catch (e) {
          // ignore heartbeat parsing
        }
      };

      this.ws.onerror = (err) => {
        console.warn('Finnhub WebSocket error:', err);
      };
    } catch (e) {
      console.error('Finnhub WS failed:', e);
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const finnhubWs = new FinnhubWebSocketService();
