import React, { useState, useEffect, useMemo } from 'react';
import { useTradeOS } from '../../context/TradeOSContext';
import { MarketCategory, MarketTicker } from '../../types/tradeos';
import { TradingViewChart } from '../TradingViewChart';
import { checkMarketStatus } from '../../utils/marketHours';
import { getContextualAnalysis, AIAnalysis } from '../../services/groqAI';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  ShieldAlert, 
  Layers, 
  Activity, 
  Zap, 
  CheckCircle, 
  Star,
  Search,
  Clock,
  AlertTriangle,
  Brain,
  Newspaper,
  Calendar,
  Loader2,
  ChevronRight
} from 'lucide-react';

export const TerminalModule: React.FC = () => {
  const { tickers, selectedTicker, setSelectedTicker, activeWatchlist, toggleWatchlist, setActiveModule, newsEvents, economicEvents } = useTradeOS();
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // ─── Starred items float to top ───
  const sortedAndFiltered = useMemo(() => {
    const filtered = tickers.filter(t => {
      const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
      const matchesSearch = t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
    // Starred assets always appear first
    return filtered.sort((a, b) => {
      const aStarred = activeWatchlist.includes(a.symbol) ? 0 : 1;
      const bStarred = activeWatchlist.includes(b.symbol) ? 0 : 1;
      return aStarred - bStarred;
    });
  }, [tickers, selectedCategory, searchQuery, activeWatchlist]);

  // ─── Contextual News & Events for selected ticker ───
  const relatedNews = useMemo(() => {
    return newsEvents.filter(n => 
      n.affectedSymbols?.includes(selectedTicker.symbol) ||
      n.category === selectedTicker.category ||
      n.headline?.toLowerCase().includes(selectedTicker.symbol.toLowerCase())
    ).slice(0, 5);
  }, [newsEvents, selectedTicker.symbol, selectedTicker.category]);

  const relatedEconomicEvents = useMemo(() => {
    const catCurrencyMap: Record<string, string[]> = {
      'CRYPTO': ['USD', 'BTC'],
      'INDIAN_STOCKS': ['INR'],
      'FOREX': ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'],
      'COMMODITIES': ['USD'],
      'US_STOCKS': ['USD'],
    };
    const currencies = catCurrencyMap[selectedTicker.category] || ['USD'];
    return economicEvents.filter(e => currencies.includes(e.currency)).slice(0, 4);
  }, [economicEvents, selectedTicker.category]);

  // ─── AI Analysis on ticker selection ───
  useEffect(() => {
    setAiLoading(true);
    const newsHeadlines = relatedNews.map(n => n.headline);
    const eventNames = relatedEconomicEvents.map(e => `${e.event} (${e.time})`);
    
    getContextualAnalysis(
      selectedTicker.symbol,
      selectedTicker.name,
      selectedTicker.category,
      selectedTicker.price,
      selectedTicker.change24h,
      newsHeadlines,
      eventNames
    ).then(analysis => {
      setAiAnalysis(analysis);
      setAiLoading(false);
    }).catch(() => setAiLoading(false));
  }, [selectedTicker.symbol]);

  const isPos = selectedTicker.change24h >= 0;
  const isRupee = selectedTicker.category === 'INDIAN_STOCKS';
  const cur = isRupee ? '₹' : '$';
  const marketStatus = checkMarketStatus(selectedTicker.category);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 font-mono">
      {/* ════════ LEFT: Watchlist Radar (3 cols) ════════ */}
      <div className="lg:col-span-3 flex flex-col space-y-3">
        <div className="glass-panel p-3 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-trade-cyan" /> Watchlist Radar
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
              {sortedAndFiltered.length} / {tickers.length}
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search any pair (BTC, RELIANCE, EUR...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-trade-cyan font-mono transition"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 text-[10px]">
            {(['ALL', 'CRYPTO', 'INDIAN_STOCKS', 'FOREX', 'COMMODITIES', 'US_STOCKS'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-2 py-1 rounded transition ${
                  selectedCategory === cat
                    ? 'bg-trade-cyan/20 border border-trade-cyan/40 text-trade-cyan font-bold'
                    : 'bg-dark-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'INDIAN_STOCKS' ? 'NSE ₹' : cat === 'US_STOCKS' ? 'US' : cat}
              </button>
            ))}
          </div>

          {/* Ticker List — Starred float to top */}
          <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
            {sortedAndFiltered.map(t => {
              const isSelected = t.symbol === selectedTicker.symbol;
              const isWatch = activeWatchlist.includes(t.symbol);
              const tPos = t.change24h >= 0;
              const tRupee = t.category === 'INDIAN_STOCKS';
              return (
                <div
                  key={t.symbol}
                  onClick={() => setSelectedTicker(t)}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-800/90 border-trade-cyan/50 shadow-md shadow-trade-cyan/5'
                      : isWatch
                      ? 'bg-dark-800/80 border-amber-900/40 hover:border-amber-700/60'
                      : 'bg-dark-800/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWatchlist(t.symbol); }}
                      className={`shrink-0 ${isWatch ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400'}`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isWatch ? 'fill-current' : ''}`} />
                    </button>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-100 text-[11px]">{t.symbol}</div>
                      <div className="text-[9px] text-slate-500 truncate max-w-[85px]">{t.name}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-slate-100 text-[11px]">
                      {tRupee ? `₹${t.price.toLocaleString()}` : `$${t.price.toLocaleString()}`}
                    </div>
                    <div className={`text-[9px] font-bold ${tPos ? 'text-trade-bull' : 'text-trade-bear'}`}>
                      {tPos ? '+' : ''}{t.change24h}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Pre-Trade Callout */}
        <div className="glass-panel p-3.5 rounded-xl border border-trade-cyan/30 bg-gradient-to-br from-trade-cyan/10 via-dark-800 to-dark-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-trade-cyan flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> AI Pre-Trade Assistant
            </span>
            <span className="text-[9px] bg-trade-cyan/20 border border-trade-cyan/40 text-trade-cyan px-1.5 py-0.5 rounded font-bold">
              ACTIVE
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mb-3">
            Planning to enter <span className="font-bold text-white">{selectedTicker.symbol}</span>? Run AI cross-analysis against live news, whale movements, & OI heatmaps.
          </p>
          <button
            onClick={() => setActiveModule('COPILOT')}
            className="w-full py-2 bg-gradient-to-r from-trade-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-lg transition shadow-lg shadow-trade-cyan/20 flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Evaluate Trade Safety Now
          </button>
        </div>
      </div>

      {/* ════════ MIDDLE: Chart + AI Intelligence (6 cols) ════════ */}
      <div className="lg:col-span-6 flex flex-col space-y-4">
        {/* Chart Card */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col min-h-[420px]">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-wide">{selectedTicker.symbol}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                  {selectedTicker.category === 'INDIAN_STOCKS' ? 'NSE' : selectedTicker.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                  marketStatus.isOpen 
                    ? 'bg-emerald-950 text-trade-bull border border-emerald-800' 
                    : 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                }`}>
                  <Clock className="w-3 h-3" /> {marketStatus.statusText}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span>{selectedTicker.name}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500">{marketStatus.tradingHours}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-white tracking-tight">
                {cur}{selectedTicker.price.toLocaleString()}
              </div>
              <div className={`flex items-center justify-end text-sm font-bold ${isPos ? 'neon-text-bull' : 'neon-text-bear'}`}>
                {isPos ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {isPos ? '+' : ''}{selectedTicker.change24h}%
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-[11px] font-mono bg-dark-800/60 p-2.5 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-500 block">24h High</span>
              <span className="text-slate-200 font-bold">{cur}{selectedTicker.high24h.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block">24h Low</span>
              <span className="text-slate-200 font-bold">{cur}{selectedTicker.low24h.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Volume</span>
              <span className="text-slate-200 font-bold">{selectedTicker.volume24h}</span>
            </div>
            {selectedTicker.fundingRate !== undefined && (
              <div>
                <span className="text-slate-500 block">Funding Rate</span>
                <span className="text-trade-cyan font-bold">{(selectedTicker.fundingRate * 100).toFixed(4)}%</span>
              </div>
            )}
          </div>

          {/* TradingView Chart */}
          <div className="relative w-full h-[380px] bg-[#090C14] rounded-lg border border-slate-800/80 overflow-hidden">
            <TradingViewChart symbol={selectedTicker.symbol} />
          </div>
        </div>

        {/* ─── AI Contextual Intelligence Panel ─── */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-violet-400" /> 
              AI Intelligence for {selectedTicker.symbol}
            </span>
            {aiAnalysis && (
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                aiAnalysis.provider === 'groq' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                aiAnalysis.provider === 'ollama' ? 'bg-green-950 text-green-300 border-green-800' :
                'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {aiAnalysis.provider === 'groq' ? '⚡ GROQ LLAMA 3.1' : aiAnalysis.provider === 'ollama' ? '🖥️ OLLAMA LOCAL' : '🧠 LOCAL ENGINE'}
              </span>
            )}
          </div>

          {aiLoading ? (
            <div className="flex items-center justify-center py-6 text-slate-400 text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing {selectedTicker.symbol} with AI...
            </div>
          ) : aiAnalysis ? (
            <div className="space-y-3">
              {/* Sentiment + Risk + Confidence */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                  aiAnalysis.sentiment === 'BULLISH' ? 'bg-emerald-950 text-trade-bull border border-emerald-800' :
                  aiAnalysis.sentiment === 'BEARISH' ? 'bg-rose-950 text-trade-bear border border-rose-800' :
                  'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {aiAnalysis.sentiment === 'BULLISH' ? '🟢' : aiAnalysis.sentiment === 'BEARISH' ? '🔴' : '🟡'} {aiAnalysis.sentiment}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded border ${
                  aiAnalysis.riskLevel === 'EXTREME' ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse' :
                  aiAnalysis.riskLevel === 'HIGH' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                  aiAnalysis.riskLevel === 'MEDIUM' ? 'bg-yellow-950 text-yellow-300 border-yellow-800' :
                  'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  ⚠️ {aiAnalysis.riskLevel} RISK
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Confidence: <strong className="text-white">{aiAnalysis.confidence}%</strong>
                </span>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-300 leading-relaxed bg-dark-800/60 p-3 rounded-lg border border-slate-800">
                {aiAnalysis.summary}
              </p>

              {/* Key Drivers */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Key Drivers</span>
                {aiAnalysis.keyDrivers.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                    <ChevronRight className="w-3 h-3 text-trade-cyan mt-0.5 shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              {/* Action Advice */}
              <div className="p-3 rounded-lg border border-violet-800/50 bg-violet-950/30 text-xs text-violet-200">
                <strong className="text-violet-300">AI Recommendation:</strong> {aiAnalysis.actionAdvice}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ════════ RIGHT: Related News + Events + Orderbook (3 cols) ════════ */}
      <div className="lg:col-span-3 flex flex-col space-y-4">

        {/* Related News for Selected Ticker */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5 text-amber-400" /> News for {selectedTicker.symbol}
            </span>
            <span className="text-[9px] bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded font-bold border border-amber-800">
              {relatedNews.length} EVENTS
            </span>
          </div>
          <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
            {relatedNews.length > 0 ? relatedNews.map(n => (
              <div key={n.id} className="p-2 rounded-lg bg-dark-800/80 border border-slate-800 text-[10px] cursor-pointer hover:border-slate-700 transition">
                <div className="flex items-start gap-1.5">
                  <span className={`shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full ${
                    n.urgency === 'CRITICAL' ? 'bg-rose-500 animate-ping' : 
                    n.urgency === 'HIGH' ? 'bg-amber-500' : 'bg-slate-500'
                  }`}></span>
                  <div>
                    <p className="text-slate-200 font-medium leading-tight">{n.headline}</p>
                    <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-500">
                      <span>{n.source?.split('/')[0]}</span>
                      <span>•</span>
                      <span>{n.timeAgo}</span>
                      <span className={`font-bold ${n.sentiment === 'BULLISH' ? 'text-trade-bull' : n.sentiment === 'BEARISH' ? 'text-trade-bear' : 'text-slate-400'}`}>
                        {n.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-[10px] text-slate-500 text-center py-4">
                No specific news for {selectedTicker.symbol} right now.
              </div>
            )}
          </div>
        </div>

        {/* Related Economic Events */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> Events
            </span>
          </div>
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
            {relatedEconomicEvents.map(e => (
              <div key={e.id} className="p-2 rounded-lg bg-dark-800/80 border border-slate-800 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-medium truncate mr-2">{e.event}</span>
                  <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    e.impact === 'HIGH' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    e.impact === 'MEDIUM' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {e.impact}
                  </span>
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5 flex gap-2">
                  <span>{e.time}</span>
                  <span>•</span>
                  <span>{e.currency}</span>
                  {e.countdownMinutes < 60 && (
                    <span className="text-rose-400 font-bold animate-pulse">⏱ {e.countdownMinutes}m</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orderbook Depth */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-trade-cyan" /> Orderbook Depth
            </span>
            <span className="text-[10px] text-trade-bull font-bold">Spread: {isRupee ? '₹0.50' : '$0.50'}</span>
          </div>

          <div className="space-y-1 text-[11px] mb-2 font-mono">
            {[
              { price: (selectedTicker.price * 1.002).toFixed(isRupee ? 2 : selectedTicker.price < 1 ? 5 : 2), pct: 85 },
              { price: (selectedTicker.price * 1.001).toFixed(isRupee ? 2 : selectedTicker.price < 1 ? 5 : 2), pct: 50 },
              { price: (selectedTicker.price * 1.0005).toFixed(isRupee ? 2 : selectedTicker.price < 1 ? 5 : 2), pct: 25 },
            ].map((ask, i) => (
              <div key={i} className="relative flex justify-between px-2 py-1 rounded bg-rose-950/20 text-rose-400">
                <div className="absolute right-0 top-0 bottom-0 bg-rose-900/30 rounded pointer-events-none" style={{ width: `${ask.pct}%` }}></div>
                <span className="font-bold z-10">{cur}{ask.price}</span>
                <span className="text-slate-400 z-10">ASK</span>
              </div>
            ))}
          </div>

          <div className="text-center font-bold text-xs py-1.5 bg-dark-800 my-1 text-slate-100 rounded border border-slate-700/60">
            {cur}{selectedTicker.price.toLocaleString()}
          </div>

          <div className="space-y-1 text-[11px] font-mono">
            {[
              { price: (selectedTicker.price * 0.9995).toFixed(isRupee ? 2 : selectedTicker.price < 1 ? 5 : 2), pct: 40 },
              { price: (selectedTicker.price * 0.999).toFixed(isRupee ? 2 : selectedTicker.price < 1 ? 5 : 2), pct: 75 },
              { price: (selectedTicker.price * 0.998).toFixed(isRupee ? 2 : selectedTicker.price < 1 ? 5 : 2), pct: 95 },
            ].map((bid, i) => (
              <div key={i} className="relative flex justify-between px-2 py-1 rounded bg-emerald-950/20 text-emerald-400">
                <div className="absolute left-0 top-0 bottom-0 bg-emerald-900/30 rounded pointer-events-none" style={{ width: `${bid.pct}%` }}></div>
                <span className="font-bold z-10">{cur}{bid.price}</span>
                <span className="text-slate-400 z-10">BID</span>
              </div>
            ))}
          </div>
        </div>

        {/* Whale Radar */}
        <div className="glass-panel p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-trade-warn" /> Whale Radar
            </span>
            <span className="text-[9px] bg-trade-warn/20 text-trade-warn px-1.5 py-0.5 rounded font-bold">LIVE</span>
          </div>
          <div className="space-y-1.5 text-[10px] font-mono">
            <div className="p-2 rounded bg-dark-800/80 border border-slate-800 border-l-2 border-l-trade-bear">
              <div className="flex justify-between text-slate-400">
                <span>{new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})} IST</span>
                <span className="text-trade-bear font-bold">LIQUIDATION</span>
              </div>
              <p className="text-slate-200 font-medium mt-0.5">$4.2M Longs Liquidated @ {cur}{(selectedTicker.price * 0.99).toFixed(2)}</p>
            </div>
            <div className="p-2 rounded bg-dark-800/80 border border-slate-800 border-l-2 border-l-trade-cyan">
              <div className="flex justify-between text-slate-400">
                <span>Earlier</span>
                <span className="text-trade-cyan font-bold">WHALE TRANSFER</span>
              </div>
              <p className="text-slate-200 font-medium mt-0.5">Large institutional flow detected on {selectedTicker.symbol}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
