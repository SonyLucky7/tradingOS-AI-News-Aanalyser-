import React, { useRef, useState, useEffect } from 'react';
import { Maximize2, RefreshCw, Activity, ShoppingCart } from 'lucide-react';
import { ReplayModule } from './modules/ReplayModule';
import { LivePaperTrader } from './LivePaperTrader';

interface TradingViewChartProps {
  symbol: string;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReplayMode, setIsReplayMode] = useState<boolean>(false);
  const [isPaperTraderOpen, setIsPaperTraderOpen] = useState<boolean>(false);
  const [key, setKey] = useState(0);
  const containerId = useRef(`tradingview_${Math.random().toString(36).substring(7)}`).current;

  // Comprehensive, institutional TradingView Symbol Mapper
  const getTradingViewSymbol = (sym: string): string => {
    // Clean up Yahoo Finance suffixes if user types them manually
    const cleanSym = sym.replace(/\.NS$/, '').replace(/\.BO$/, '').replace(/=X$/, '').replace(/\.NYB$/, '');

    // 1. Crypto Pairs
    if (cleanSym.endsWith('USDT') || cleanSym.endsWith('BTC')) {
      return `BINANCE:${cleanSym}`;
    }

    // 2. NSE Indian Stocks & Indices
    // Indices use continuous futures to bypass index licensing popups in embeds.
    // Equity stocks use NSE:SYMBOL for full intraday (1m, 5m, 15m, 1h) data.
    const nseMap: Record<string, string> = {
      'NIFTY50': 'NSE:NIFTY1!',
      'NIFTY': 'NSE:NIFTY1!',
      'BANKNIFTY': 'NSE:BANKNIFTY1!',
      'FINNIFTY': 'NSE:FINNIFTY1!',
      'SENSEX': 'BSE:SENSEX',
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
    if (nseMap[cleanSym]) return nseMap[cleanSym];

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
    if (forexMap[cleanSym]) return forexMap[cleanSym];

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
    if (commMap[cleanSym]) return commMap[cleanSym];

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
    if (usMap[cleanSym]) return usMap[cleanSym];

    if (cleanSym.includes(':')) return cleanSym;

    // Default fallback (NSE equity stocks have full intraday data)
    return `NSE:${cleanSym}`;
  };

  const tvSymbol = getTradingViewSymbol(symbol);

  // Dynamically load tv.js and initialize full TradingView Advanced Charting Widget
  useEffect(() => {
    if (isReplayMode) return;

    let isMounted = true;
    const scriptId = 'tradingview-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initWidget = () => {
      if (!isMounted) return;
      const tv = (window as any).TradingView;
      if (tv && tv.widget) {
        // Clear previous container content before re-initializing widget
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = '';

        new tv.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: '15',
          timezone: 'Asia/Kolkata',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#07090E',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId,
          withdateranges: true,
          hide_side_toolbar: false,
          details: true,
          hotlist: true,
          calendar: true,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          backgroundColor: 'rgba(7, 9, 14, 1)',
          gridColor: 'rgba(255, 255, 255, 0.05)',
          enabled_features: [
            'header_widget',
            'header_symbol_search',
            'header_resolutions',
            'header_chart_type',
            'header_settings',
            'header_indicators',
            'header_compare',
            'header_undo_redo',
            'header_screenshot',
            'use_localstorage_for_settings',
            'save_chart_properties_to_localstorage',
            'side_toolbar_in_fullscreen_mode',
            'header_in_fullscreen_mode',
            'create_volume_indicator_by_default',
            'study_templates'
          ]
        });
      }
    };

    if (!(window as any).TradingView) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = initWidget;
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', initWidget);
      }
    } else {
      initWidget();
    }

    return () => {
      isMounted = false;
    };
  }, [tvSymbol, isReplayMode, key, containerId]);

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

      {/* Chart Area — takes 100% height, no duplicate header bar */}
      <div className="relative flex-1 w-full h-full flex">
        {isReplayMode ? (
          <ReplayModule defaultSymbol={symbol} />
        ) : (
          <>
            <div className="flex-1 relative h-full">
              <div
                id={containerId}
                key={`tv-container-${tvSymbol}-${key}`}
                className="w-full h-full absolute inset-0"
              />
            </div>
            {isPaperTraderOpen && (
              <div className="h-full shrink-0">
                <LivePaperTrader symbol={symbol} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Mini-Toolbar — only shows our custom buttons that TradingView doesn't have */}
      <div className="absolute top-2 right-2 z-[10] flex items-center gap-1.5">
        {/* Refresh Button */}
        <button
          onClick={() => setKey(k => k + 1)}
          className="bg-dark-900/80 backdrop-blur-sm text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/90 transition border border-slate-700/50"
          title="Refresh Chart"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Replay Mode Toggle */}
        <button
          onClick={() => {
            setIsReplayMode(!isReplayMode);
            if (!isReplayMode) setIsPaperTraderOpen(false);
          }}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition flex items-center gap-1.5 backdrop-blur-sm ${
            isReplayMode
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
              : 'bg-dark-900/80 border-slate-700/50 text-slate-300 hover:text-trade-cyan hover:border-trade-cyan/40'
          }`}
          title="Toggle Market Replay Simulator"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{isReplayMode ? 'Live Mode' : 'Replay'}</span>
        </button>

        {/* Paper Trading Toggle */}
        {!isReplayMode && (
          <button
            onClick={() => setIsPaperTraderOpen(!isPaperTraderOpen)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition flex items-center gap-1.5 backdrop-blur-sm ${
              isPaperTraderOpen
                ? 'bg-trade-cyan/20 border-trade-cyan/50 text-trade-cyan'
                : 'bg-dark-900/80 border-slate-700/50 text-slate-300 hover:text-trade-bull hover:border-trade-bull/40'
            }`}
            title="Toggle Live Paper Trading"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isPaperTraderOpen ? 'Close' : 'Paper Trade'}</span>
          </button>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={handleFullscreen}
          className="bg-trade-cyan/10 hover:bg-trade-cyan/20 border border-trade-cyan/40 text-trade-cyan p-1.5 rounded-lg transition font-bold backdrop-blur-sm"
          title="Toggle Fullscreen Chart"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
