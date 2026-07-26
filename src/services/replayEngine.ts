export interface ReplayCandle {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ReplayPosition {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  quantity: number;
  takeProfit?: number;
  stopLoss?: number;
  status: 'OPEN' | 'CLOSED';
  pnl?: number;
}

export interface ReplayAccount {
  balance: number;
  equity: number;
  positions: ReplayPosition[];
  tradeHistory: ReplayPosition[];
}

// Fetch historical data from Binance API (For Crypto only)
const fetchBinanceHistoricalData = async (
  symbol: string,
  interval: string = '15m'
): Promise<ReplayCandle[]> => {
  try {
    // Map standard intervals to Binance intervals
    let binanceInterval = interval;
    if (interval === '60') binanceInterval = '1h';
    if (interval === '240') binanceInterval = '4h';
    if (interval === 'D' || interval === '1D') binanceInterval = '1d';
    if (interval === 'W' || interval === '1W') binanceInterval = '1w';
    if (!binanceInterval.endsWith('m') && !binanceInterval.endsWith('h') && !binanceInterval.endsWith('d') && !binanceInterval.endsWith('w')) {
      binanceInterval = interval + 'm';
    }

    let url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${binanceInterval}&limit=1000`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Binance API error: ${response.statusText}`);
    
    const data = await response.json();
    
    // Binance kline format: [Open time, Open, High, Low, Close, Volume, Close time, Quote asset volume, Number of trades, Taker buy base asset volume, Taker buy quote asset volume, Ignore]
    return data.map((kline: any) => ({
      time: Math.floor(kline[0] / 1000), // Convert ms to s for lightweight-charts
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5])
    }));
  } catch (err) {
    console.error('Error fetching historical data for Replay:', err);
    return [];
  }
};

// Fetch historical data from Yahoo Finance via Proxy (For Forex, Indian Markets, US Equities)
const fetchYahooHistoricalData = async (
  symbol: string,
  interval: string = '15m'
): Promise<ReplayCandle[]> => {
  try {
    const fetchWithFallback = async (url: string) => {
      const viteProxyUrl = url.replace('https://query2.finance.yahoo.com', '/api/yahoo');
      const proxies = [
        url, // Try DIRECT connection first (works flawlessly in Electron desktop app since webSecurity is false)
        viteProxyUrl, // Local Vite proxy (works perfectly in browser during 'npm run dev')
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        `https://thingproxy.freeboard.io/fetch/${url}`
      ];
      
      for (const proxy of proxies) {
        try {
          const res = await fetch(proxy);
          if (res.ok) return await res.json();
        } catch (e) {
          console.warn(`Proxy failed: ${proxy}`);
        }
      }
      throw new Error('All CORS proxies failed');
    };

    const yahooSymbolMap: Record<string, string> = {
      'NIFTY50': '^NSEI',
      'BANKNIFTY': '^NSEBANK',
      'XAUUSD': 'GC=F',
      'USOIL': 'CL=F',
      'DXY': 'DX-Y.NYB',
      'SPX': '^GSPC',
      'EURUSD': 'EURUSD=X',
      'GBPUSD': 'GBPUSD=X',
      'USDJPY': 'USDJPY=X',
      'RELIANCE': 'RELIANCE.NS',
      'HDFCBANK': 'HDFCBANK.NS',
      'TCS': 'TCS.NS',
      'AAPL': 'AAPL',
      'TSLA': 'TSLA'
    };

    const ySym = yahooSymbolMap[symbol] || (symbol.endsWith('USD') ? symbol + '=X' : symbol + '.NS');

    // Yahoo intervals: 1m, 5m, 15m, 60m, 1d, 1wk, 1mo
    let yInterval = interval;
    if (interval === '1h') yInterval = '60m';
    if (interval === '1D') yInterval = '1d';
    if (interval === '1W') yInterval = '1wk';
    if (!['1m','5m','15m','60m','1d','1wk','1mo'].includes(yInterval)) yInterval = '15m';

    // range for intra-day needs to be smaller (e.g., 5d, 60d max) to get 1000 candles
    let range = '60d';
    if (yInterval === '1m') range = '7d';
    if (yInterval === '1d') range = '2y';

    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySym)}?interval=${yInterval}&range=${range}`;
    
    const data = await fetchWithFallback(url);
    const result = data.chart?.result?.[0];
    
    if (!result || !result.timestamp || !result.indicators?.quote?.[0]) return [];
    
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    
    const candles: ReplayCandle[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (quotes.open[i] !== null && quotes.close[i] !== null) {
        candles.push({
          time: timestamps[i],
          open: Number(quotes.open[i].toFixed(4)),
          high: Number(quotes.high[i].toFixed(4)),
          low: Number(quotes.low[i].toFixed(4)),
          close: Number(quotes.close[i].toFixed(4)),
          volume: quotes.volume[i] || 0
        });
      }
    }
    
    return candles;
  } catch (err) {
    console.error('Error fetching Yahoo historical data:', err);
    return [];
  }
};

// Unified historical fetcher
export const fetchHistoricalData = async (
  symbol: string,
  interval: string = '15m'
): Promise<ReplayCandle[]> => {
  // If it's a crypto pair ending in USDT, use Binance. Otherwise use Yahoo.
  if (symbol.endsWith('USDT') || symbol.endsWith('BTC')) {
    return fetchBinanceHistoricalData(symbol, interval);
  } else {
    return fetchYahooHistoricalData(symbol, interval);
  }
};

// Replay Paper Trading Engine
export class ReplayTradingEngine {
  private account: ReplayAccount;

  constructor(initialBalance: number = 10000) {
    this.account = {
      balance: initialBalance,
      equity: initialBalance,
      positions: [],
      tradeHistory: []
    };
  }

  public getAccount(): ReplayAccount {
    return this.account;
  }

  public executeMarketOrder(symbol: string, type: 'LONG' | 'SHORT', quantity: number, currentPrice: number, tp?: number, sl?: number) {
    const requiredMargin = currentPrice * quantity;
    if (this.account.balance < requiredMargin) {
      throw new Error("Insufficient Balance for this trade.");
    }

    const position: ReplayPosition = {
      id: Math.random().toString(36).substring(7),
      symbol,
      type,
      entryPrice: currentPrice,
      quantity,
      takeProfit: tp,
      stopLoss: sl,
      status: 'OPEN'
    };

    this.account.positions.push(position);
    this.updateEquity(currentPrice);
    return position;
  }

  public updateEquity(currentPrice: number) {
    let floatingPnl = 0;

    this.account.positions.forEach(pos => {
      if (pos.status === 'OPEN') {
        const priceDiff = pos.type === 'LONG' ? (currentPrice - pos.entryPrice) : (pos.entryPrice - currentPrice);
        const pnl = priceDiff * pos.quantity;
        pos.pnl = pnl;
        floatingPnl += pnl;

        // Check SL / TP triggers
        if (pos.takeProfit && pos.type === 'LONG' && currentPrice >= pos.takeProfit) this.closePosition(pos.id, pos.takeProfit);
        if (pos.takeProfit && pos.type === 'SHORT' && currentPrice <= pos.takeProfit) this.closePosition(pos.id, pos.takeProfit);
        
        if (pos.stopLoss && pos.type === 'LONG' && currentPrice <= pos.stopLoss) this.closePosition(pos.id, pos.stopLoss);
        if (pos.stopLoss && pos.type === 'SHORT' && currentPrice >= pos.stopLoss) this.closePosition(pos.id, pos.stopLoss);
      }
    });

    this.account.equity = this.account.balance + floatingPnl;
  }

  public closePosition(id: string, closePrice: number) {
    const posIndex = this.account.positions.findIndex(p => p.id === id && p.status === 'OPEN');
    if (posIndex === -1) return;

    const pos = this.account.positions[posIndex];
    const priceDiff = pos.type === 'LONG' ? (closePrice - pos.entryPrice) : (pos.entryPrice - closePrice);
    const pnl = priceDiff * pos.quantity;
    
    pos.status = 'CLOSED';
    pos.pnl = pnl;
    
    this.account.balance += pnl;
    this.account.tradeHistory.push(pos);
    this.account.positions.splice(posIndex, 1);
    
    this.updateEquity(closePrice);
  }
}
