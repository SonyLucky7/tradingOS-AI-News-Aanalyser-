import React, { useState, useEffect } from 'react';
import { useTradeOS } from '../context/TradeOSContext';
import { NewsEvent } from '../types/tradeos';
import { 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  X, 
  ChevronRight, 
  Brain, 
  Globe, 
  Coins, 
  Building2,
  BellRing
} from 'lucide-react';

export const NewsToastPopup: React.FC = () => {
  const { newsEvents, setActiveModule, selectedTicker } = useTradeOS();
  const [currentNews, setCurrentNews] = useState<NewsEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);

  // Auto-show high-impact breaking news popup
  useEffect(() => {
    if (newsEvents && newsEvents.length > 0) {
      // Find critical news or related to selected ticker
      const critical = newsEvents.find(n => n.urgency === 'CRITICAL') || newsEvents[0];
      setCurrentNews(critical);
      setVisible(true);
    }
  }, [newsEvents]);

  // When selected ticker changes, update popup to show news relevant to that specific ticker
  useEffect(() => {
    if (newsEvents && newsEvents.length > 0 && selectedTicker) {
      const relevant = newsEvents.find(n => 
        n.affectedSymbols?.includes(selectedTicker.symbol) || 
        n.category === selectedTicker.category
      ) || newsEvents[0];
      setCurrentNews(relevant);
      setVisible(true);
    }
  }, [selectedTicker?.symbol]);

  if (!visible || !currentNews) return null;

  const handleNextNews = () => {
    const nextIdx = (newsIndex + 1) % newsEvents.length;
    setNewsIndex(nextIdx);
    setCurrentNews(newsEvents[nextIdx]);
  };

  const isBull = currentNews.sentiment === 'BULLISH';
  const isBear = currentNews.sentiment === 'BEARISH';

  // Category Icon & Label
  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'CRYPTO':
        return { label: 'CRYPTO MARKETS', icon: Coins, color: 'text-violet-400 bg-violet-950 border-violet-800' };
      case 'INDIAN_STOCKS':
        return { label: 'INDIAN MARKETS (NSE/BSE)', icon: Building2, color: 'text-emerald-400 bg-emerald-950 border-emerald-800' };
      default:
        return { label: 'FOREX & GLOBAL MACRO', icon: Globe, color: 'text-blue-400 bg-blue-950 border-blue-800' };
    }
  };

  const catMeta = getCategoryMeta(currentNews.category);
  const CatIcon = catMeta.icon;

  return (
    <div className="fixed bottom-16 sm:bottom-5 right-3 sm:right-5 left-3 sm:left-auto max-w-md w-full sm:w-auto z-50 font-mono animate-in slide-in-from-bottom-5 duration-300">
      <div className="glass-panel p-4 rounded-2xl border-2 border-rose-500/60 bg-[#0B0E17]/95 shadow-2xl shadow-rose-950/40 space-y-3">
        
        {/* Header Alert Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-[11px] font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <BellRing className="w-3.5 h-3.5" /> LIVE BREAKING NEWS FLASH
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border flex items-center gap-1 ${catMeta.color}`}>
              <CatIcon className="w-3 h-3" /> {catMeta.label}
            </span>
            <button 
              onClick={() => setVisible(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Headline */}
        <h4 className="text-xs font-bold text-white leading-snug">
          {currentNews.headline}
        </h4>

        {/* WHICH MARKETS ARE AFFECTED */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            🎯 WHICH MARKETS THIS NEWS IMPACTS:
          </span>
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            {currentNews.affectedSymbols?.map(sym => (
              <span 
                key={sym} 
                className={`px-2 py-0.5 rounded font-bold border ${
                  sym === selectedTicker.symbol 
                    ? 'bg-trade-cyan text-black border-trade-cyan shadow-sm shadow-trade-cyan/40 animate-pulse' 
                    : 'bg-dark-800 text-trade-cyan border-slate-700'
                }`}
              >
                {sym} {sym === selectedTicker.symbol ? '(ACTIVE)' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* WHY IT MOVES THE MARKET (AI Summary Breakdown) */}
        <div className="p-3 bg-dark-800/90 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300 flex items-center gap-1 text-[10px] uppercase">
              <Brain className="w-3.5 h-3.5 text-amber-400" /> WHY THIS NEWS MOVES THE MARKET:
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              isBull ? 'bg-emerald-950 text-trade-bull' : isBear ? 'bg-rose-950 text-trade-bear' : 'bg-slate-800 text-slate-300'
            }`}>
              {isBull ? '🟢 BULLISH IMPACT' : isBear ? '🔴 BEARISH IMPACT' : '🟡 VOLATILE'}
            </span>
          </div>

          <p className="text-slate-200 leading-relaxed font-sans text-[11px]">
            {currentNews.summary || currentNews.aiExplanation}
          </p>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 flex justify-between">
            <span>Expected Volatility: <strong className="text-rose-400">{currentNews.expectedVolatility}</strong></span>
            <span>Duration: <strong className="text-slate-200">{currentNews.effectTimeframe}</strong></span>
          </div>
        </div>

        {/* Action Directives & Navigation */}
        <div className="flex items-center justify-between pt-1 gap-2">
          <button
            onClick={handleNextNews}
            className="text-[10px] text-slate-400 hover:text-slate-200 font-bold underline"
          >
            Next Flash ({newsEvents.length}) →
          </button>

          <button
            onClick={() => {
              setActiveModule('NEWS');
              setVisible(false);
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-trade-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-[11px] rounded-lg shadow-md shadow-trade-cyan/20 transition flex items-center gap-1"
          >
            Inspect Full AI Dossier <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
