import React, { useRef, useState, useEffect } from 'react';
import { Maximize2, RefreshCw, Activity, ShoppingCart, Sliders } from 'lucide-react';
import { ReplayModule } from './modules/ReplayModule';
import { LivePaperTrader } from './LivePaperTrader';

interface TradingViewChartProps {
  symbol: string;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<string>('15');
  const [chartStyle, setChartStyle] = useState<string>('1'); // '1' = Candles, '0' = Bars, '9' = Hollow Candles, '8' = Heikin Ashi, '2' = Line, '3' = Area
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

    // Default fallback
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
          interval: timeframe,
          timezone: 'Asia/Kolkata',
          theme: 'dark',
          style: chartStyle,
          locale: 'en',
          toolbar_bg: '#131722',
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
          backgroundColor: '#131722',
          gridColor: 'rgba(255, 255, 255, 0.05)',
          overrides: {
            "mainSeriesProperties.candleStyle.upColor": "#ffffff",
            "mainSeriesProperties.candleStyle.downColor": "#000000",
            "mainSeriesProperties.candleStyle.drawWick": true,
            "mainSeriesProperties.candleStyle.drawBorder": true,
            "mainSeriesProperties.candleStyle.borderColor": "#ffffff",
            "mainSeriesProperties.candleStyle.borderUpColor": "#ffffff",
            "mainSeriesProperties.candleStyle.borderDownColor": "#ffffff",
            "mainSeriesProperties.candleStyle.wickColor": "#ffffff",
            "mainSeriesProperties.candleStyle.wickUpColor": "#ffffff",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ffffff",
            "mainSeriesProperties.barStyle.upColor": "#ffffff",
            "mainSeriesProperties.barStyle.downColor": "#ffffff",
            "mainSeriesProperties.hollowCandleStyle.upColor": "#ffffff",
            "mainSeriesProperties.hollowCandleStyle.downColor": "#000000",
            "mainSeriesProperties.hollowCandleStyle.borderColor": "#ffffff",
            "mainSeriesProperties.hollowCandleStyle.borderUpColor": "#ffffff",
            "mainSeriesProperties.hollowCandleStyle.borderDownColor": "#ffffff",
            "mainSeriesProperties.hollowCandleStyle.wickColor": "#ffffff",
            "mainSeriesProperties.haStyle.upColor": "#ffffff",
            "mainSeriesProperties.haStyle.downColor": "#000000",
            "mainSeriesProperties.haStyle.borderColor": "#ffffff",
            "mainSeriesProperties.haStyle.borderUpColor": "#ffffff",
            "mainSeriesProperties.haStyle.borderDownColor": "#ffffff",
            "mainSeriesProperties.haStyle.wickColor": "#ffffff"
          },
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
  }, [tvSymbol, timeframe, chartStyle, isReplayMode, key, containerId]);

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
    <div ref={containerRef} className="w-full h-full min-h-[600px] sm:min-h-[700px] bg-[#131722] rounded-xl overflow-hidden border border-slate-800 relative flex flex-col font-mono select-none">

      {/* Timeframe & Chart Style Bar — TradingView-style slim top bar */}
      <div className="bg-[#131722] border-b border-slate-800/80 px-2 py-1 flex items-center justify-between gap-1 text-xs shrink-0 z-10">
        {/* Left: Timeframe Quick Switcher */}
        <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
          {[
            { label: '1m', val: '1' },
            { label: '3m', val: '3' },
            { label: '5m', val: '5' },
            { label: '10m', val: '10' },
            { label: '15m', val: '15' },
            { label: '30m', val: '30' },
            { label: '1H', val: '60' },
            { label: '2H', val: '120' },
            { label: '4H', val: '240' },
            { label: '1D', val: 'D' },
            { label: '1W', val: 'W' },
            { label: '1M', val: 'M' },
          ].map(tf => (
            <button
              key={tf.val}
              onClick={() => setTimeframe(tf.val)}
              className={`px-2 py-0.5 rounded font-bold transition whitespace-nowrap text-[11px] ${
                timeframe === tf.val
                  ? 'bg-trade-cyan text-black shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Right: Chart Style Selector, Replay, Paper Trade, Fullscreen */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {/* Chart Style Switcher (Candles, Bars, Hollow Candles, Heikin Ashi, Line, Area) */}
          <select
            value={chartStyle}
            onChange={(e) => setChartStyle(e.target.value)}
            className="bg-dark-900 border border-slate-700/80 rounded px-1.5 py-0.5 text-[11px] font-bold text-slate-300 focus:outline-none focus:border-trade-cyan cursor-pointer"
            title="Switch Chart Type (Candles, Bars, Line, Heikin Ashi)"
          >
            <option value="1">🕯️ Candles</option>
            <option value="0">📊 Bars</option>
            <option value="9">🕯️ Hollow</option>
            <option value="8">📈 Heikin Ashi</option>
            <option value="2">📉 Line</option>
            <option value="3">⛰️ Area</option>
          </select>

          <button
            onClick={() => setKey(k => k + 1)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/60 transition"
            title="Refresh Chart"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsReplayMode(!isReplayMode);
              if (!isReplayMode) setIsPaperTraderOpen(false);
            }}
            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition flex items-center gap-1 ${
              isReplayMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'border-slate-700/50 text-slate-400 hover:text-trade-cyan hover:border-trade-cyan/40'
            }`}
            title="Toggle Market Replay Simulator"
          >
            <Activity className="w-3 h-3" />
            <span>{isReplayMode ? 'Live' : 'Replay'}</span>
          </button>

          {!isReplayMode && (
            <button
              onClick={() => setIsPaperTraderOpen(!isPaperTraderOpen)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition flex items-center gap-1 ${
                isPaperTraderOpen
                  ? 'bg-trade-cyan/20 border-trade-cyan/50 text-trade-cyan'
                  : 'border-slate-700/50 text-slate-400 hover:text-trade-bull hover:border-trade-bull/40'
              }`}
              title="Toggle Live Paper Trading"
            >
              <ShoppingCart className="w-3 h-3" />
              <span>{isPaperTraderOpen ? 'Close' : 'Paper Trade'}</span>
            </button>
          )}

          <button
            onClick={handleFullscreen}
            className="bg-trade-cyan/10 hover:bg-trade-cyan/20 border border-trade-cyan/40 text-trade-cyan p-1 rounded transition"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chart Area — 100% height without empty gaps */}
      <div className="relative flex-1 w-full h-full flex min-h-[560px] sm:min-h-[660px]">
        {isReplayMode ? (
          <ReplayModule defaultSymbol={symbol} />
        ) : (
          <>
            <div className="flex-1 relative w-full h-full">
              <div
                id={containerId}
                key={`tv-container-${tvSymbol}-${timeframe}-${chartStyle}-${key}`}
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
    </div>
  );
};
