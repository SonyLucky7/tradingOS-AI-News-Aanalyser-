import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, RefreshCw, BarChart2 } from 'lucide-react';

interface TradingViewChartProps {
  symbol: string;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  // Map symbols to official TradingView symbol formats
  const getTradingViewSymbol = (sym: string): string => {
    switch (sym) {
      case 'BTCUSDT': return 'BINANCE:BTCUSDT';
      case 'ETHUSDT': return 'BINANCE:ETHUSDT';
      case 'SOLUSDT': return 'BINANCE:SOLUSDT';
      case 'XRPUSDT': return 'BINANCE:XRPUSDT';
      case 'BNBUSDT': return 'BINANCE:BNBUSDT';
      case 'NIFTY50': return 'NSE:NIFTY';
      case 'BANKNIFTY': return 'NSE:BANKNIFTY';
      case 'RELIANCE': return 'NSE:RELIANCE';
      case 'TCS': return 'NSE:TCS';
      case 'INFY': return 'NSE:INFY';
      case 'HDFCBANK': return 'NSE:HDFCBANK';
      case 'ICICIBANK': return 'NSE:ICICIBANK';
      case 'SBIN': return 'NSE:SBIN';
      case 'TATAMOTORS': return 'NSE:TATAMOTORS';
      case 'XAUUSD': return 'OANDA:XAUUSD';
      case 'USOIL': return 'TVC:USOIL';
      case 'EURUSD': return 'FX:EURUSD';
      case 'GBPUSD': return 'FX:GBPUSD';
      case 'USDJPY': return 'FX:USDJPY';
      case 'DXY': return 'CAPTRADER:DXY';
      case 'SPX': return 'FOREXCOM:SPXUSD';
      default: return sym.includes('USDT') ? `BINANCE:${sym}` : `NSE:${sym}`;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const tvSymbol = getTradingViewSymbol(symbol);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: "1",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1", // Candlestick
      locale: "en",
      enable_publishing: false,
      backgroundColor: "rgba(7, 9, 14, 1)",
      gridColor: "rgba(255, 255, 255, 0.05)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: true,
      calendar: false,
      hide_volume: false,
      withdateranges: true,
      details: true,
      hotlist: false,
      support_host: "https://www.tradingview.com"
    });

    containerRef.current.appendChild(script);
  }, [symbol, key]);

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
    <div className="w-full h-full min-h-[350px] sm:min-h-[460px] bg-[#07090E] rounded-xl overflow-hidden border border-slate-800 relative flex flex-col">
      {/* Top Chart Toolbar Controls */}
      <div className="h-8 bg-dark-800 border-b border-slate-800 px-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-3.5 h-3.5 text-trade-cyan" />
          <span className="text-white font-bold">{getTradingViewSymbol(symbol)}</span>
          <span className="text-[10px] text-slate-400 font-mono">(TradingView Advanced Live Engine)</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setKey(k => k + 1)}
            className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] hover:bg-slate-800 px-2 py-0.5 rounded transition"
            title="Refresh Chart Feed"
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
          <button
            onClick={handleFullscreen}
            className="text-trade-cyan hover:text-cyan-300 flex items-center gap-1 text-[11px] hover:bg-slate-800 px-2 py-0.5 rounded font-bold transition"
            title="Toggle Fullscreen Chart"
          >
            <Maximize2 className="w-3 h-3" /> Fullscreen
          </button>
        </div>
      </div>

      {/* TradingView Widget Container */}
      <div ref={containerRef} className="tradingview-widget-container flex-1 w-full h-full">
        <div className="tradingview-widget-container__widget h-full w-full"></div>
      </div>
    </div>
  );
};
