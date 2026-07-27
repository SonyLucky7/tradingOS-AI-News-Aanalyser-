import React, { useState, useEffect, useRef } from 'react';
import { useTradeOS } from '../context/TradeOSContext';
import { 
  ShieldAlert, 
  Activity, 
  Clock, 
  Zap, 
  Bell, 
  ChevronRight, 
  Cpu, 
  X 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { tickers, systemAlert, dismissSystemAlert, setActiveModule, activeWatchlist, setSelectedTicker } = useTradeOS();
  const [timeUtc, setTimeUtc] = useState('');
  const [timeIst, setTimeIst] = useState('');
  const [timeEst, setTimeEst] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().slice(17, 25) + ' UTC');
      const ist24 = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
      const ist12 = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: true });
      setTimeIst(`${ist24} (${ist12}) IST`);
      setTimeEst(now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false }) + ' EST');
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    const gsap = (window as any).gsap;
    if (gsap && headerRef.current) {
      gsap.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'all' });
    }
  }, []);

  const sortedTickers = [...tickers].sort((a, b) => {
    const aStarred = activeWatchlist.includes(a.symbol);
    const bStarred = activeWatchlist.includes(b.symbol);
    if (aStarred && !bStarred) return -1;
    if (!aStarred && bStarred) return 1;
    return 0;
  });

  // Duplicate tickers for seamless infinite marquee
  const marqueeItems = [...sortedTickers, ...sortedTickers];

  return (
    <header ref={headerRef} className="terminal-header sticky top-0 z-50 flex flex-col w-full select-none">
      {/* Critical System Alert Ticker (Bloomberg Style Warning Bar) */}
      {systemAlert && (
        <div className="bg-gradient-to-r from-red-950/90 via-rose-900/80 to-amber-950/90 backdrop-blur-lg text-rose-100 px-4 py-1.5 flex items-center justify-between text-xs font-mono border-b border-rose-500/20 animate-pulse-fast">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <span className="bg-rose-600/90 text-white font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase flex items-center gap-1 neon-glow-bear">
              <ShieldAlert className="w-3 h-3" /> HIGH IMPACT WARNING
            </span>
            <span className="truncate font-medium">{systemAlert}</span>
          </div>
          <div className="flex items-center space-x-3 shrink-0 ml-4">
            <button 
              onClick={() => setActiveModule('NEWS')} 
              className="underline text-amber-300 hover:text-white font-semibold flex items-center text-[11px] btn-premium"
            >
              Analyze News <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
            <button onClick={dismissSystemAlert} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Navigation & System Health */}
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5 cursor-pointer group" onClick={() => setActiveModule('TERMINAL')}>
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-trade-cyan/15 to-trade-accent/30 border border-trade-cyan/30 transition-all duration-300 group-hover:border-trade-cyan/60 group-hover:shadow-lg group-hover:shadow-trade-cyan/10">
              <Zap className="w-5 h-5 text-trade-cyan transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-trade-bull animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-base tracking-wider text-gradient-cyan">
                  TradeOS <span className="text-trade-cyan">AI</span>
                </span>
                <span className="text-[9px] font-mono bg-trade-cyan/10 border border-trade-cyan/25 text-trade-cyan px-1.5 py-0.5 rounded-md font-semibold animate-glow-pulse" style={{ animationDuration: '3s' }}>
                  v2.5 PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono hidden sm:block tracking-wide">
                Know the Market Before the Market Moves
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Clocks & AI Agent Mesh Status */}
        <div className="hidden lg:flex items-center space-x-5 text-xs font-mono text-slate-400 glass-panel px-4 py-1.5 rounded-xl">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-trade-cyan" />
            <span className="text-slate-200 tabular-nums">{timeUtc}</span>
          </div>
          <span className="text-slate-700/50">|</span>
          <div>NY: <span className="text-slate-300 tabular-nums">{timeEst}</span></div>
          <span className="text-slate-700/50">|</span>
          <div>IST: <span className="text-slate-300 tabular-nums">{timeIst}</span></div>
          <span className="text-slate-700/50">|</span>
          <div className="flex items-center space-x-1.5 text-trade-bull">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-semibold">13/13 Agents Online</span>
          </div>
        </div>

        {/* Right: Action Items */}
        <div className="flex items-center space-x-2.5 font-mono text-xs">
          <button 
            onClick={() => setShowAlertModal(!showAlertModal)} 
            className="relative p-2 rounded-xl glass-panel border border-slate-800/60 hover:border-trade-warn/40 text-slate-300 hover:text-white transition-all duration-200 btn-premium"
            title="Real-time Alert Engine"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-trade-warn animate-pulse"></span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl glass-panel border border-emerald-800/30 text-emerald-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[11px] font-semibold">Feed: 12ms</span>
          </div>

          <a
            href="https://github.com/SonyLucky7/tradingOS-AI-News-Aanalyser-/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center space-x-1.5 bg-gradient-to-r from-trade-cyan/15 to-trade-accent/15 hover:from-trade-cyan/25 hover:to-trade-accent/25 px-3 py-1.5 rounded-xl border border-trade-cyan/30 text-trade-cyan font-bold transition-all duration-200 text-[11px] btn-premium"
            title="Download TradeOS Desktop App (.exe) for 100% smooth Replay & zero CORS blocks"
          >
            <span>🖥️</span>
            <span>Desktop App</span>
          </a>

          <div className="flex items-center space-x-2 bg-gradient-to-r from-trade-accent/20 to-blue-900/20 px-3 py-1.5 rounded-xl border border-trade-accent/30 text-white font-semibold glass-panel">
            <span className="w-2 h-2 rounded-full bg-trade-cyan animate-pulse"></span>
            <span className="text-xs tracking-wide">INSTITUTIONAL</span>
          </div>
        </div>
      </div>

      {/* Live Market Ticker Tape — GSAP Marquee */}
      <div className="h-7 bg-[#080B13]/90 border-t border-slate-800/40 flex items-center overflow-hidden px-0 text-[11px] font-mono relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#080B13] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#080B13] to-transparent z-10 pointer-events-none" />
        
        <div className="ticker-marquee">
          {marqueeItems.map((ticker, i) => {
            const isPos = ticker.change24h >= 0;
            const isRupee = ticker.category === 'INDIAN_STOCKS';
            const isStarred = activeWatchlist.includes(ticker.symbol);
            return (
              <div 
                key={`${ticker.symbol}-${i}`}
                onClick={() => {
                  setSelectedTicker(ticker);
                  setActiveModule('TERMINAL');
                }}
                className={`flex items-center space-x-1.5 shrink-0 cursor-pointer hover:bg-slate-800/40 px-3 py-0.5 rounded transition-all duration-200 mx-0.5 ${
                  isStarred ? 'bg-trade-cyan/5' : ''
                }`}
              >
                {isStarred && <span className="text-[10px] text-amber-400">★</span>}
                <span className="text-slate-400 font-medium">{ticker.symbol}</span>
                <span className="text-white font-semibold tabular-nums">
                  {isRupee ? `₹${ticker.price.toLocaleString()}` : `$${ticker.price.toLocaleString()}`}
                </span>
                <span className={`font-bold text-[10px] tabular-nums ${isPos ? 'text-trade-bull' : 'text-trade-bear'}`}>
                  {isPos ? '▲' : '▼'}{isPos ? '+' : ''}{ticker.change24h}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};
