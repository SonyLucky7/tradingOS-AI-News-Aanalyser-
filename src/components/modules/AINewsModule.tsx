import React, { useState } from 'react';
import { useTradeOS } from '../../context/TradeOSContext';
import { MarketCategory, NewsEvent } from '../../types/tradeos';
import { LiveTVStream } from '../LiveTVStream';
import { 
  Newspaper, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Brain, 
  History, 
  Zap, 
  Search, 
  Clock, 
  Tv 
} from 'lucide-react';

export const AINewsModule: React.FC = () => {
  const { newsEvents, setActiveModule } = useTradeOS();
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'AI_RADAR' | 'LIVE_TV'>('AI_RADAR');

  const activeEvent = newsEvents.find(e => e.id === selectedEventId) || newsEvents[0] || ({} as NewsEvent);

  const filteredEvents = newsEvents.filter(e => {
    const matchesCat = selectedCategory === 'ALL' || e.category === selectedCategory;
    const matchesSearch = e.headline.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-4 font-mono space-y-4">
      {/* Top Banner: News Intelligence Status */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-dark-800 via-dark-900 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-trade-cyan/10 border border-trade-cyan/30 text-trade-cyan">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              AI Event Processing & Market Impact Engine
              <span className="text-[10px] bg-trade-bull/20 text-trade-bull border border-trade-bull/30 px-2 py-0.5 rounded font-bold">
                REALTIME DEDUPED
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Aggregating Reuters, Bloomberg, Trading Economics, CoinGlass, Glassnode & Central Banks. Evaluates 1-100 Impact & Trade Safety.
            </p>
          </div>
        </div>

        {/* Search & Mode Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center space-x-1 bg-dark-800 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('AI_RADAR')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'AI_RADAR' ? 'bg-trade-cyan text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" /> AI Event Radar
            </button>
            <button
              onClick={() => setViewMode('LIVE_TV')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'LIVE_TV' ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" /> Live TV Broadcasts (Telugu + Global)
            </button>
          </div>

          {viewMode === 'AI_RADAR' && (
            <div className="relative flex-1 lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search news, Powell, CPI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-800 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-trade-cyan"
              />
            </div>
          )}
        </div>
      </div>

      {/* Render selected view */}
      {viewMode === 'LIVE_TV' ? (
        <LiveTVStream />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Event Cards List */}
          <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
            <span>LIVE EVENT RADAR ({filteredEvents.length})</span>
            <span className="text-slate-500 text-[10px]">Sorted by Importance</span>
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredEvents.map(event => {
              const isSelected = event.id === activeEvent.id;
              const isCrit = event.urgency === 'CRITICAL';
              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEventId(event.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-slate-800/90 border-trade-cyan/60 shadow-lg shadow-trade-cyan/5' 
                      : 'bg-dark-800/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                        isCrit ? 'bg-rose-950 border border-rose-600 text-rose-300 animate-pulse' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {event.urgency}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" /> {event.timeAgo}
                      </span>
                    </div>

                    {/* Importance Score Badge */}
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-slate-500 font-bold">IMPACT</span>
                      <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded ${
                        event.importanceScore > 90 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-trade-cyan/20 text-trade-cyan'
                      }`}>
                        {event.importanceScore}/100
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-slate-100 mb-1.5 line-clamp-2 leading-relaxed">
                    {event.headline}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span className="truncate max-w-[150px]">{event.source}</span>
                    <span className={`font-bold ${
                      event.sentiment === 'BULLISH' ? 'text-trade-bull' : event.sentiment === 'BEARISH' ? 'text-trade-bear' : 'text-slate-400'
                    }`}>
                      {event.sentiment}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep AI Event Inspector Dossier */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            {/* Header section of dossier */}
            <div className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-dark-800 border border-slate-700 text-trade-cyan">
                    {activeEvent.category}
                  </span>
                  <span className="text-xs text-slate-400">{activeEvent.source}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-500">Confidence:</span>
                  <span className="text-trade-bull font-bold">{activeEvent.confidencePercent}%</span>
                </div>
              </div>

              <h2 className="text-base font-bold text-white leading-snug mb-3">
                {activeEvent.headline}
              </h2>

              {/* Critical Warning Box */}
              {activeEvent.warningAlert && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-rose-200 text-xs font-medium flex items-start space-x-2.5 mb-3">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{activeEvent.warningAlert}</span>
                </div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-dark-800/80 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">Importance Score</span>
                  <span className="text-base font-bold text-trade-warn">{activeEvent.importanceScore} / 100</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Expected Volatility</span>
                  <span className="text-base font-bold text-rose-400">{activeEvent.expectedVolatility}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Large Move Prob.</span>
                  <span className="text-base font-bold text-trade-cyan">{activeEvent.probabilityLargeMove}%</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Effect Timeframe</span>
                  <span className="text-slate-200 font-bold">{activeEvent.effectTimeframe}</span>
                </div>
              </div>
            </div>

            {/* AI Explanation & Analysis */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-trade-cyan uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-trade-cyan" /> AI Event Breakdown & Impact Reasoning
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed bg-dark-800/50 p-3 rounded-lg border border-slate-800">
                  {activeEvent.aiExplanation}
                </p>
              </div>

              {/* Historical Comparison */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-amber-400" /> Historical Event Similarity Analysis
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-dark-800/50 p-3 rounded-lg border border-slate-800">
                  {activeEvent.historicalComparison}
                </p>
              </div>

              {/* Affected Markets */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Affected Markets & Tickers
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeEvent?.affectedSymbols?.map(sym => (
                    <span key={sym} className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200">
                      {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trade Recommendation & Call to Action */}
              <div className="p-3.5 bg-gradient-to-r from-dark-800 via-slate-800 to-dark-900 border border-trade-cyan/40 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-trade-cyan font-bold uppercase tracking-wider">AI Co-Pilot Directive</div>
                  <div className="text-xs font-bold text-white">{activeEvent.tradeRecommendation}</div>
                </div>
                <button
                  onClick={() => setActiveModule('COPILOT')}
                  className="px-4 py-2 bg-trade-cyan hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition shadow-md shadow-trade-cyan/20 flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" /> Evaluate My Trade Safety
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
