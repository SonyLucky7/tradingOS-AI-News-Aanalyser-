import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, RefreshCw, BarChart2, Sliders, Layers } from 'lucide-react';

interface TradingViewChartProps {
  symbol: string;
}

declare global {
  interface Window {
    TradingView?: any;
  }
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<string>('15');
  const [chartStyle, setChartStyle] = useState<string>('1'); // 1: Candles, 8: Heikin Ashi, 2: Line, 3: Area
  const [showSideToolbar, setShowSideToolbar] = useState<boolean>(true);
  const [key, setKey] = useState(0);
  const [useIframeFallback, setUseIframeFallback] = useState(false);

  const containerId = useRef(`tradingview_${Math.random().toString(36).substring(7)}`).current;

  // Institutional TradingView Symbol Mapper
  const getTradingViewSymbol = (sym: string): string => {
    // 1. Crypto Pairs
    if (sym.endsWith('USDT') || sym.endsWith('BTC')) {
      return `BINANCE:${sym}`;
    }

    // 2. NSE Indian Stocks & Indices
    const nseMap: Record<string, string> = {
      'NIFTY50': 'NSE:NIFTY',
      'BANKNIFTY': 'NSE:BANKNIFTY',
      'FINNIFTY': 'NSE:FINNIFTY',
      'LARSEN': 'NSE:LT',
      'RELIANCE': 'NSE:RELIANCE',
      'TCS': 'NSE:TCS',
      'INFY': 'NSE:INFY',
      'HDFCBANK': 'NSE:HDFCBANK',
      'ICICIBANK': 'NSE:ICICIBANK',
      'SBIN': 'NSE:SBIN',
      'BHARTIARTL': 'NSE:BHARTIARTL',
      'ITC': 'NSE:ITC',
      'WIPRO': 'NSE:WIPRO',
      'HCLTECH': 'NSE:HCLTECH',
      'SUNPHARMA': 'NSE:SUNPHARMA',
      'BAJFINANCE': 'NSE:BAJFINANCE',
      'MARUTI': 'NSE:MARUTI',
      'ADANIENT': 'NSE:ADANIENT',
      'TATASTEEL': 'NSE:TATASTEEL',
      'POWERGRID': 'NSE:POWERGRID',
      'NTPC': 'NSE:NTPC',
      'AXISBANK': 'NSE:AXISBANK',
      'KOTAKBANK': 'NSE:KOTAKBANK',
      'HINDUNILVR': 'NSE:HINDUNILVR',
      'TATAMOTORS': 'NSE:TATAMOTORS',
      'ASIANPAINT': 'NSE:ASIANPAINT',
      'LTIM': 'NSE:LTIM',
      'TITAN': 'NSE:TITAN'
    };
    if (nseMap[sym]) return nseMap[sym];

    // 3. Forex Majors / Minors / Indices
    const forexMap: Record<string, string> = {
      'EURUSD': 'FX:EURUSD',
      'GBPUSD': 'FX:GBPUSD',
      'USDJPY': 'FX:USDJPY',
      'AUDUSD': 'FX:AUDUSD',
      'USDCAD': 'FX:USDCAD',
      'NZDUSD': 'FX:NZDUSD',
      'USDCHF': 'FX:USDCHF',
      'EURGBP': 'FX:EURGBP',
      'EURJPY': 'FX:EURJPY',
      'GBPJPY': 'FX:GBPJPY',
      'USDINR': 'FX:USDINR',
      'XAGUSD': 'OANDA:XAGUSD',
      'DXY': 'CAPTRADER:DXY',
      'USDSGD': 'FX:USDSGD',
      'USDHKD': 'FX:USDHKD'
    };
    if (forexMap[sym]) return forexMap[sym];

    // 4. Commodities
    const commMap: Record<string, string> = {
      'XAUUSD': 'OANDA:XAUUSD',
      'USOIL': 'TVC:USOIL',
      'UKOIL': 'TVC:UKOIL',
      'NATGAS': 'TVC:NATGAS',
      'COPPER': 'COMEX:HG1!',
      'PLATINUM': 'NYMEX:PL1!',
      'PALLADIUM': 'NYMEX:PA1!',
      'WHEAT': 'CBOT:ZW1!'
    };
    if (commMap[sym]) return commMap[sym];

    // 5. US Stocks & Indices
    const usMap: Record<string, string> = {
      'SPX': 'FOREXCOM:SPXUSD',
      'NASDAQ': 'NASDAQ:IXIC',
      'DJI': 'DJI',
      'AAPL': 'NASDAQ:AAPL',
      'MSFT': 'NASDAQ:MSFT',
      'TSLA': 'NASDAQ:TSLA',
      'NVDA': 'NASDAQ:NVDA',
      'AMZN': 'NASDAQ:AMZN',
      'GOOGL': 'NASDAQ:GOOGL',
      'META': 'NASDAQ:META'
    };
    if (usMap[sym]) return usMap[sym];

    return `NSE:${sym}`;
  };

  const tvSymbol = getTradingViewSymbol(symbol);

  // Initialize Official TradingView Widget SDK
  useEffect(() => {
    let isSubscribed = true;

    const loadTradingViewScript = () => {
      if (window.TradingView) {
        initWidget();
        return;
      }

      const script = document.createElement('script');
      script.id = 'tradingview-tv-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.type = 'text/javascript';
      script.onload = () => {
        if (isSubscribed) initWidget();
      };
      script.onerror = () => {
        if (isSubscribed) setUseIframeFallback(true);
      };
      document.head.appendChild(script);
    };

    const initWidget = () => {
      const containerEl = document.getElementById(containerId);
      if (!containerEl) return;

      containerEl.innerHTML = '';

      try {
        if (window.TradingView && window.TradingView.widget) {
          new window.TradingView.widget({
            autosize: true,
            symbol: tvSymbol,
            interval: timeframe,
            timezone: 'Asia/Kolkata',
            theme: 'dark',
            style: chartStyle,
            locale: 'en',
            toolbar_bg: '#0B0E17',
            enable_publishing: false,
            hide_side_toolbar: !showSideToolbar,
            allow_symbol_change: true,
            container_id: containerId,
            withdateranges: true,
            details: true,
            hotlist: false,
            calendar: false,
            studies: []
          });
        } else {
          setUseIframeFallback(true);
        }
      } catch (err) {
        console.warn('TradingView SDK init warning:', err);
        setUseIframeFallback(true);
      }
    };

    loadTradingViewScript();

    return () => {
      isSubscribed = false;
    };
  }, [symbol, timeframe, chartStyle, showSideToolbar, key]);

  // Direct Interactive Widget Iframe Fallback URL
  const iframeUrl = `https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#${encodeURIComponent(
    JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: timeframe,
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      style: chartStyle,
      locale: 'en',
      enable_publishing: false,
      hide_side_toolbar: !showSideToolbar,
      allow_symbol_change: true,
      save_image: true,
      container_id: containerId
    })
  )}`;

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[480px] sm:min-h-[580px] bg-[#07090E] rounded-xl overflow-hidden border border-slate-800 relative flex flex-col font-mono select-none">
      {/* Professional Trading Control Bar */}
      <div className="bg-[#0B0E17] border-b border-slate-800/90 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Active Exchange Symbol & Live Status */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 bg-trade-cyan/10 border border-trade-cyan/30 px-2 py-1 rounded-md text-trade-cyan font-bold">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{tvSymbol}</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>LIVE TRADINGVIEW FEED</span>
          </div>
        </div>

        {/* Center: Timeframe Quick Switcher */}
        <div className="flex items-center space-x-1 bg-dark-800 p-1 rounded-lg border border-slate-800 text-[11px]">
          {[
            { label: '1m', val: '1' },
            { label: '5m', val: '5' },
            { label: '15m', val: '15' },
            { label: '1h', val: '60' },
            { label: '4h', val: '240' },
            { label: '1D', val: 'D' },
            { label: '1W', val: 'W' },
          ].map(tf => (
            <button
              key={tf.val}
              onClick={() => setTimeframe(tf.val)}
              className={`px-2 py-0.5 rounded font-bold transition ${
                timeframe === tf.val
                  ? 'bg-trade-cyan text-black shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Right: Chart Style, Side Toolbar Toggle, Refresh, Fullscreen */}
        <div className="flex items-center space-x-2 text-xs">
          {/* Chart Style Switcher */}
          <select
            value={chartStyle}
            onChange={(e) => setChartStyle(e.target.value)}
            className="bg-dark-800 border border-slate-800 rounded px-2 py-1 text-[11px] font-bold text-slate-300 focus:outline-none focus:border-trade-cyan cursor-pointer"
          >
            <option value="1">🕯️ Candles</option>
            <option value="8">📈 Heikin Ashi</option>
            <option value="2">📉 Line</option>
            <option value="3">⛰️ Area</option>
          </select>

          {/* Side Toolbar Toggle */}
          <button
            onClick={() => setShowSideToolbar(prev => !prev)}
            className={`px-2 py-1 rounded text-[11px] font-bold border transition flex items-center gap-1 ${
              showSideToolbar
                ? 'bg-trade-cyan/20 border-trade-cyan/40 text-trade-cyan'
                : 'bg-dark-800 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Left Drawing Tools (Trendlines, Fibonacci, Shapes)"
          >
            <Sliders className="w-3 h-3" />
            <span className="hidden md:inline">{showSideToolbar ? 'Tools ON' : 'Tools OFF'}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => {
              setUseIframeFallback(prev => !prev);
              setKey(k => k + 1);
            }}
            className="text-slate-400 hover:text-white p-1.5 bg-slate-800 rounded hover:bg-slate-700 transition"
            title="Refresh / Toggle Live Chart Mode"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={handleFullscreen}
            className="bg-trade-cyan/10 hover:bg-trade-cyan/20 border border-trade-cyan/40 text-trade-cyan p-1.5 rounded transition font-bold"
            title="Toggle Fullscreen Chart"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TradingView Display Area */}
      <div className="relative flex-1 w-full h-full min-h-[440px] sm:min-h-[520px] bg-[#07090E]">
        {!useIframeFallback ? (
          <div
            key={`widget-${containerId}-${key}`}
            id={containerId}
            className="tradingview-widget-container w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <iframe
            key={`iframe-${tvSymbol}-${timeframe}-${chartStyle}-${showSideToolbar}-${key}`}
            src={iframeUrl}
            className="w-full h-full border-0 absolute inset-0"
            allowFullScreen
            title={`TradingView Chart for ${tvSymbol}`}
          />
        )}
      </div>
    </div>
  );
};
