// 100% FREE Live WebSocket Service for TradeOS AI
// Connects to Binance Public Live WebSocket (No API key needed!)

export interface BinanceTickerPayload {
  s: string; // Symbol (e.g. BTCUSDT)
  c: string; // Close/Current Price
  P: string; // 24h Price Change Percent
  h: string; // 24h High
  l: string; // 24h Low
  q: string; // 24h Quote Volume
}

export class LiveDataStreamService {
  private ws: WebSocket | null = null;
  private onTickerUpdateCallback: ((data: Record<string, { price: number; change24h: number; high: number; low: number; volume: string }>) => void) | null = null;

  public connectBinancePublicStream(onUpdate: (data: Record<string, { price: number; change24h: number; high: number; low: number; volume: string }>) => void) {
    this.onTickerUpdateCallback = onUpdate;

    try {
      // Free public WebSocket stream for all USDT pairs on Binance
      this.ws = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');

      this.ws.onopen = () => {
        console.log('⚡ TradeOS AI: Connected to FREE Binance Public WebSocket Live Stream');
      };

      this.ws.onmessage = (event) => {
        try {
          const tickers: BinanceTickerPayload[] = JSON.parse(event.data);
          const updates: Record<string, { price: number; change24h: number; high: number; low: number; volume: string }> = {};

          tickers.forEach(t => {
            if (['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'BNBUSDT'].includes(t.s)) {
              updates[t.s] = {
                price: parseFloat(t.c),
                change24h: parseFloat(t.P),
                high: parseFloat(t.h),
                low: parseFloat(t.l),
                volume: `$${(parseFloat(t.q) / 1e9).toFixed(1)}B`
              };
            }
          });

          if (Object.keys(updates).length > 0 && this.onTickerUpdateCallback) {
            this.onTickerUpdateCallback(updates);
          }
        } catch (e) {
          console.error('Error parsing live payload:', e);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('WebSocket stream fallback to simulated simulation:', err);
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed, attempting reconnect in 5s...');
        setTimeout(() => this.connectBinancePublicStream(onUpdate), 5000);
      };
    } catch (e) {
      console.error('WebSocket connection failed:', e);
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const liveStreamService = new LiveDataStreamService();
