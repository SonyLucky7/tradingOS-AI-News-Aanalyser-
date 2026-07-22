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

import { formatTimeAgo } from '../utils/timeAgo';
import { stripHtmlTags } from '../services/unifiedLiveData';

// Persistent global set that survives component unmounting/remounting across all page & tab switches
const globalDismissedNewsIds = new Set<string>();

export const NewsToastPopup: React.FC = () => {
  const { newsEvents, setActiveModule } = useTradeOS();
  const [currentNews, setCurrentNews] = useState<NewsEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [newsIndex, setNewsIndex] = useState(0);

  // Auto-show ONLY when a BRAND NEW breaking news story arrives (never re-triggers on page/tab navigation)
  useEffect(() => {
    if (newsEvents && newsEvents.length > 0) {
      const topNews = newsEvents[0];
      
      // Only trigger toast if this news story ID has NEVER been seen/dismissed globally in this session
      if (topNews && !globalDismissedNewsIds.has(topNews.id)) {
        globalDismissedNewsIds.add(topNews.id);
        setCurrentNews(topNews);
        setVisible(true);
      }
    }
  }, [newsEvents]);

  if (!visible || !currentNews) return null;

  const handleNextNews = () => {
    const nextIdx = (newsIndex + 1) % newsEvents.length;
    const nextItem = newsEvents[nextIdx];
    if (nextItem) {
      globalDismissedNewsIds.add(nextItem.id);
    }
    setNewsIndex(nextIdx);
    setCurrentNews(nextItem);
  };

  const handleClose = () => {
    if (currentNews) {
      globalDismissedNewsIds.add(currentNews.id);
    }
    setVisible(false);
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
              <BellRing className="w-3.5 h-3.5" /> LIVE BREAKING FLASH
            </span>
            <span className="text-[10px] text-amber-300 font-extrabold bg-amber-950/80 border border-amber-500/50 px-1.5 py-0.5 rounded shadow-sm">
              {formatTimeAgo(currentNews.timestamp) || currentNews.timeAgo}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border flex items-center gap-1 ${catMeta.color}`}>
              <CatIcon className="w-3 h-3" /> {catMeta.label}
            </span>
            <button 
              onClick={handleClose}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
              title="Close Popup (Will only show again when brand new breaking news arrives)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Headline */}
        <h4 className="text-xs font-bold text-white leading-snug">
          {stripHtmlTags(currentNews.headline)}
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
                  isBull 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700' 
                    : isBear 
                    ? 'bg-rose-950/80 text-rose-300 border-rose-700' 
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                {sym} {isBull ? '▲ BULLISH' : isBear ? '▼ BEARISH' : '● NEUTRAL'}
              </span>
            ))}
          </div>
        </div>

        {/* Short Summary */}
        <p className="text-[11px] text-slate-300 leading-relaxed bg-dark-800/80 p-2.5 rounded-lg border border-slate-800/80">
          {stripHtmlTags(currentNews.summary)}
        </p>

        {/* AI Directive Bar & Navigation Controls */}
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <button 
            onClick={() => {
              setActiveModule('NEWS');
              handleClose();
            }}
            className="text-trade-cyan hover:underline font-bold flex items-center gap-1 bg-trade-cyan/10 border border-trade-cyan/30 px-2.5 py-1 rounded-lg transition"
          >
            <Brain className="w-3.5 h-3.5" /> Full AI Dossier <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center space-x-2">
            {newsEvents.length > 1 && (
              <button
                onClick={handleNextNews}
                className="text-slate-400 hover:text-white text-[10px] underline font-bold"
              >
                Next Story ({newsIndex + 1}/{newsEvents.length})
              </button>
            )}
            <button
              onClick={handleClose}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold border border-slate-700 transition"
            >
              Dismiss
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
