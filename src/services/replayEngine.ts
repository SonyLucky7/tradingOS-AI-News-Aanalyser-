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

// Mathematical Aggregator to fuse 5m candles into 10m candles
const aggregateTo10m = (candles: ReplayCandle[]): ReplayCandle[] => {
  const result: ReplayCandle[] = [];
  for (let i = 0; i < candles.length; i += 2) {
    const c1 = candles[i];
    const c2 = candles[i + 1];
    if (!c2) {
      result.push(c1); // push the last incomplete candle if odd number
      break;
    }
    result.push({
      time: c1.time, // Use the start time of the 10m block
      open: c1.open,
      high: Math.max(c1.high, c2.high),
      low: Math.min(c1.low, c2.low),
      close: c2.close,
      volume: c1.volume + c2.volume
    });
  }
  return result;
};

// Fetch historical data from Binance API (For Crypto only)
const fetchBinanceHistoricalData = async (
  symbol: string,
  interval: string = '15m'
): Promise<ReplayCandle[]> => {
  try {
    let is10m = false;
    let binanceInterval = interval;
    
    if (interval === '10m') {
      is10m = true;
      binanceInterval = '5m';
    } else if (interval === '60') {
      binanceInterval = '1h';
    } else if (interval === '240') {
      binanceInterval = '4h';
    } else if (interval === 'D' || interval === '1D') {
      binanceInterval = '1d';
    } else if (interval === 'W' || interval === '1W') {
      binanceInterval = '1w';
    } else if (!binanceInterval.endsWith('m') && !binanceInterval.endsWith('h') && !binanceInterval.endsWith('d') && !binanceInterval.endsWith('w')) {
      binanceInterval = interval + 'm';
    }

    let url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${binanceInterval}&limit=1000`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Binance API error: ${response.statusText}`);
    
    const data = await response.json();
    
    // Binance kline format: [Open time, Open, High, Low, Close, Volume, Close time, Quote asset volume, Number of trades, Taker buy base asset volume, Taker buy quote asset volume, Ignore]
    const candles = data.map((kline: any) => ({
      time: Math.floor(kline[0] / 1000), // Convert ms to s for lightweight-charts
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5])
    }));

    return is10m ? aggregateTo10m(candles) : candles;
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
      const query1Url = url.replace('query2.finance.yahoo.com', 'query1.finance.yahoo.com');
      
      // Priority order:
      // 1. Vite dev proxy / Vercel serverless proxy (works in browser)
      // 2. Direct query2 (works in Electron desktop app where webSecurity=false)
      // 3. Direct query1 (fallback Yahoo endpoint)
      // 4. Public CORS proxies (last resort)
      const proxies = [
        { url: viteProxyUrl, headers: {} },
        { url: url, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } },
        { url: query1Url, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } },
        { url: `https://thingproxy.freeboard.io/fetch/${url}`, headers: {} },
      ];
      
      for (const proxy of proxies) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          
          const res = await fetch(proxy.url, { 
            signal: controller.signal,
            headers: proxy.headers
          });
          clearTimeout(timeoutId);
          
          if (res.ok) {
            const text = await res.text();
            // Guard against non-JSON responses from bad proxies (HTML error pages)
            if (text.startsWith('{') || text.startsWith('[')) {
              return JSON.parse(text);
            }
          }
        } catch (e) {
          console.warn(`Proxy failed: ${proxy.url}`);
        }
      }
      throw new Error('All CORS proxies failed');
    };

    // Clean up exchange prefixes (BSE:, NSE:, OANDA:, TVC:, FX:, BINANCE:, etc.) and suffixes (.NS, .BO, =X)
    const rawSym = symbol.toUpperCase().trim();
    const cleanSym = rawSym
      .replace(/^(BSE|NSE|OANDA|TVC|FX|BINANCE|FOREXCOM|NASDAQ|COMEX|NYMEX|CBOT|CAPTRADER|CAPITALCOM|SPREADEX):/, '')
      .replace(/\.NS$/, '')
      .replace(/\.BO$/, '')
      .replace(/=X$/, '')
      .replace(/\.NYB$/, '');

    const yahooSymbolMap: Record<string, string> = {
      'NIFTY50': '^NSEI',
      'NIFTY': '^NSEI',
      'NIFTY1!': '^NSEI',
      'BANKNIFTY': '^NSEBANK',
      'BANKNIFTY1!': '^NSEBANK',
      'FINNIFTY': 'NIFTY_FIN_SERVICE.NS',
      'FINNIFTY1!': 'NIFTY_FIN_SERVICE.NS',
      'SENSEX': '^BSESN',
      'XAUUSD': 'GC=F',
      'XAGUSD': 'SI=F',
      'USOIL': 'CL=F',
      'UKOIL': 'BZ=F',
      'NATGAS': 'NG=F',
      'DXY': 'DX-Y.NYB',
      'SPX': '^GSPC',
      'NASDAQ': '^IXIC',
      'DJI': '^DJI',
      'AAPL': 'AAPL',
      'MSFT': 'MSFT',
      'TSLA': 'TSLA',
      'NVDA': 'NVDA',
      'AMZN': 'AMZN',
      'GOOGL': 'GOOGL',
      'META': 'META'
    };

    let ySym = yahooSymbolMap[cleanSym];
    if (!ySym) {
      // 1. Check if Forex pair (e.g., EURUSD, GBPUSD, USDJPY, EURGBP, USDCAD, USDCHF, GBPJPY, AUDUSD, NZDUSD)
      const isForex = /^(EUR|GBP|USD|JPY|AUD|CAD|CHF|NZD|HKD|SGD|SEK|NOK|MXN|ZAR|CNY|INR){2}$/.test(cleanSym) || cleanSym.endsWith('USD');
      // 2. Check if known US Stock
      const isUSStock = ['AAPL','MSFT','TSLA','NVDA','AMZN','GOOGL','META','AMD','INTC','NFLX','PYPL','BA','JPM','V','MA','DIS'].includes(cleanSym);

      if (isForex) {
        ySym = `${cleanSym}=X`;
      } else if (isUSStock) {
        ySym = cleanSym;
      } else {
        // Default Indian Stock
        ySym = `${cleanSym}.NS`;
      }
    }

    // Yahoo intervals: 1m, 5m, 15m, 60m, 1d, 1wk, 1mo
    let is10m = false;
    let yInterval = interval;
    
    if (interval === '10m') {
      is10m = true;
      yInterval = '5m';
    } else if (interval === '1h') {
      yInterval = '60m';
    } else if (interval === '1D') {
      yInterval = '1d';
    } else if (interval === '1W') {
      yInterval = '1wk';
    }
    
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
    
    return is10m ? aggregateTo10m(candles) : candles;
  } catch (err) {
    console.error('Yahoo Finance Replay fetch error:', err);
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
