import React, { useState, useEffect } from 'react';
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

  const sortedTickers = [...tickers].sort((a, b) => {
    const aStarred = activeWatchlist.includes(a.symbol);
    const bStarred = activeWatchlist.includes(b.symbol);
    if (aStarred && !bStarred) return -1;
    if (!aStarred && bStarred) return 1;
    return 0;
  });

  return (
    <header className="terminal-header sticky top-0 z-50 flex flex-col w-full bg-[#07090E]/95 backdrop-blur-md border-b border-slate-800/80 select-none">
      {/* Critical System Alert Ticker (Bloomberg Style Warning Bar) */}
      {systemAlert && (
        <div className="bg-gradient-to-r from-red-950 via-rose-900 to-amber-950 text-rose-100 px-4 py-1.5 flex items-center justify-between text-xs font-mono border-b border-rose-500/30 animate-pulse-fast">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <span className="bg-rose-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> HIGH IMPACT WARNING
            </span>
            <span className="truncate font-medium">{systemAlert}</span>
          </div>
          <div className="flex items-center space-x-3 shrink-0 ml-4">
            <button 
              onClick={() => setActiveModule('NEWS')} 
              className="underline text-amber-300 hover:text-white font-semibold flex items-center text-[11px]"
            >
              Analyze News <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
            <button onClick={dismissSystemAlert} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Navigation & System Health */}
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveModule('TERMINAL')}>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-trade-cyan/20 to-trade-accent/40 border border-trade-cyan/40">
              <Zap className="w-5 h-5 text-trade-cyan" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-trade-bull animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold font-mono text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-trade-cyan">
                  TradeOS <span className="text-trade-cyan">AI</span>
                </span>
                <span className="text-[9px] font-mono bg-trade-cyan/10 border border-trade-cyan/30 text-trade-cyan px-1 py-0.2 rounded font-semibold">
                  v2.5 PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Know the Market Before the Market Moves
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Clocks & AI Agent Mesh Status */}
        <div className="hidden lg:flex items-center space-x-6 text-xs font-mono text-slate-400 bg-dark-800/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-trade-cyan" />
            <span className="text-slate-200">{timeUtc}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div>NY: <span className="text-slate-300">{timeEst}</span></div>
          <span className="text-slate-700">|</span>
          <div>IST: <span className="text-slate-300">{timeIst}</span></div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1 text-trade-bull">
            <Cpu className="w-3.5 h-3.5" />
            <span className="font-semibold">13/13 Agents Online</span>
          </div>
        </div>

        {/* Right: Ticker Tape & Action Items */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          <button 
            onClick={() => setShowAlertModal(!showAlertModal)} 
            className="relative p-2 rounded-lg bg-dark-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
            title="Real-time Alert Engine"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-trade-warn"></span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[11px] font-semibold">Feed: 12ms Latency</span>
          </div>

          <div className="flex items-center space-x-2 bg-gradient-to-r from-trade-accent/30 to-blue-900/30 px-3 py-1 rounded-lg border border-trade-accent/50 text-white font-semibold">
            <span className="w-2 h-2 rounded-full bg-trade-cyan"></span>
            <span className="text-xs">INSTITUTIONAL</span>
          </div>
        </div>
      </div>

      {/* Live Market Ticker Tape Banner */}
      <div className="h-7 bg-[#090C14] border-t border-slate-800/60 flex items-center overflow-x-auto scrollbar-none px-4 space-x-5 text-[11px] font-mono">
        <span className="text-slate-500 font-bold tracking-wider shrink-0 flex items-center gap-1.5 border-r border-slate-800 pr-3">
          <span className="w-1.5 h-1.5 rounded-full bg-trade-bull animate-ping"></span> LIVE RADAR ({tickers.length}):
        </span>
        {sortedTickers.map(ticker => {
          const isRupee = ticker.category === 'INDIAN_STOCKS';
          const isStarred = activeWatchlist.includes(ticker.symbol);
          const safeChange = isFinite(ticker.change24h) && !isNaN(ticker.change24h) ? ticker.change24h : 0.00;
          const isPos = safeChange >= 0;
          return (
            <div 
              key={ticker.symbol} 
              onClick={() => {
                setSelectedTicker(ticker);
                setActiveModule('TERMINAL');
              }}
              className={`flex items-center space-x-1.5 shrink-0 cursor-pointer hover:bg-slate-800/60 px-2 py-0.5 rounded transition border ${
                isStarred ? 'border-trade-cyan/40 bg-trade-cyan/5' : 'border-transparent'
              }`}
            >
              {isStarred && <span className="text-[10px] text-amber-400">★</span>}
              <span className="text-slate-300 font-medium">{ticker.symbol}</span>
              <span className="text-white font-semibold">
                {isRupee ? `₹${ticker.price.toLocaleString()}` : `$${ticker.price.toLocaleString()}`}
              </span>
              <span className={`font-bold text-[10px] ${isPos ? 'text-trade-bull' : 'text-trade-bear'}`}>
                {isPos ? '+' : ''}{safeChange.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </header>
  );
};
