import React, { useState } from 'react';
import { useTradeOS } from '../../context/TradeOSContext';
import { 
  BookOpen, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  AlertCircle, 
  CheckCircle, 
  Smile, 
  Frown, 
  Flame 
} from 'lucide-react';

export const TradingJournalModule: React.FC = () => {
  const { journalEntries, addJournalEntry, selectedTicker } = useTradeOS();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [symbol, setSymbol] = useState(selectedTicker.symbol);
  const [side, setSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [entryPrice, setEntryPrice] = useState(selectedTicker.price);
  const [exitPrice, setExitPrice] = useState(Number((selectedTicker.price * 1.02).toFixed(2)));
  const [pnlUsd, setPnlUsd] = useState(1250);
  const [pnlPercent, setPnlPercent] = useState(2.1);
  const [riskReward, setRiskReward] = useState(2.5);
  const [setupName, setSetupName] = useState('Bullish Reversal on Support');
  const [emotion, setEmotion] = useState<'CALM' | 'FOMO' | 'REVENGE' | 'ANXIOUS' | 'GREEDY'>('CALM');
  const [mistakesStr, setMistakesStr] = useState('None');
  const [attachedNews, setAttachedNews] = useState('RBI VRR Liquidity Inflow Catalyst');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJournalEntry({
      symbol,
      side,
      entryPrice,
      exitPrice,
      pnlUsd,
      pnlPercent,
      riskReward,
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      setupName,
      emotion,
      mistakes: mistakesStr.split(',').map(s => s.trim()),
      attachedNews
    });
    setShowAddModal(false);
  };

  return (
    <div className="p-4 font-mono space-y-4">
      {/* Top Banner */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-800 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-trade-accent/20 border border-trade-accent/40 text-trade-cyan">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Personal AI Trading Journal & Psychology Coach
              <span className="text-[10px] bg-trade-cyan/20 text-trade-cyan border border-trade-cyan/40 px-2 py-0.5 rounded font-bold">
                AUTO-NEWS SNAPSHOT
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Mines trade executions to detect emotional flaws, revenge trading, and news blindspots.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-trade-cyan hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition shadow-lg shadow-trade-cyan/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Log New Trade Execution
        </button>
      </div>

      {/* Modal for Adding Trade */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-700 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Log Trade Execution</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Symbol</label>
                  <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="w-full bg-dark-800 border border-slate-700 rounded p-2 text-white font-bold" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Direction</label>
                  <select value={side} onChange={(e) => setSide(e.target.value as any)} className="w-full bg-dark-800 border border-slate-700 rounded p-2 text-white font-bold">
                    <option value="LONG">LONG</option>
                    <option value="SHORT">SHORT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Entry Price</label>
                  <input type="number" step="any" value={entryPrice} onChange={(e) => setEntryPrice(parseFloat(e.target.value))} className="w-full bg-dark-800 border border-slate-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Exit Price</label>
                  <input type="number" step="any" value={exitPrice} onChange={(e) => setExitPrice(parseFloat(e.target.value))} className="w-full bg-dark-800 border border-slate-700 rounded p-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">PnL ($)</label>
                  <input type="number" value={pnlUsd} onChange={(e) => setPnlUsd(parseFloat(e.target.value))} className="w-full bg-dark-800 border border-slate-700 rounded p-2 text-white font-bold" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Emotional State</label>
                  <select value={emotion} onChange={(e) => setEmotion(e.target.value as any)} className="w-full bg-dark-800 border border-slate-700 rounded p-2 text-white font-bold">
                    <option value="CALM">CALM (Disciplined)</option>
                    <option value="FOMO">FOMO (Chasing)</option>
                    <option value="REVENGE">REVENGE (Angry)</option>
                    <option value="ANXIOUS">ANXIOUS</option>
                    <option value="GREEDY">GREEDY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Trade Setup Name</label>
                <input type="text" value={setupName} onChange={(e) => setSetupName(e.target.value)} className="w-full bg-dark-800 border border-slate-700 rounded p-2 text-white" />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Attached News Snapshot</label>
                <input type="text" value={attachedNews} onChange={(e) => setAttachedNews(e.target.value)} className="w-full bg-dark-800 border border-slate-700 rounded p-2 text-slate-300" />
              </div>

              <button type="submit" className="w-full py-2.5 bg-trade-cyan text-black font-bold text-xs rounded-lg">
                SAVE TO JOURNAL & RUN PSYCHOLOGY COACH
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Journal Cards List */}
      <div className="space-y-4">
        {journalEntries.map(j => {
          const isWin = j.pnlUsd >= 0;
          return (
            <div key={j.id} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-800 gap-2">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded font-bold text-xs ${
                    j.side === 'LONG' ? 'bg-emerald-950 text-trade-bull border border-emerald-800' : 'bg-rose-950 text-trade-bear border border-rose-800'
                  }`}>
                    {j.side} {j.symbol}
                  </span>
                  <span className="text-xs text-slate-400">{j.entryTime}</span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-bold">{j.setupName}</span>
                </div>

                <div className="flex items-center space-x-3 font-bold">
                  <span className="text-xs text-slate-400">R:R {j.riskReward}</span>
                  <span className={`text-base ${isWin ? 'neon-text-bull' : 'neon-text-bear'}`}>
                    {isWin ? '+' : ''}${j.pnlUsd.toLocaleString()} ({j.pnlPercent}%)
                  </span>
                </div>
              </div>

              {/* Trade Execution Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-dark-800/60 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">Entry Price</span>
                  <span className="text-white font-bold">${j.entryPrice.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Exit Price</span>
                  <span className="text-white font-bold">${j.exitPrice.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Trader Emotion</span>
                  <span className={`font-bold ${j.emotion === 'FOMO' || j.emotion === 'REVENGE' ? 'text-rose-400' : 'text-trade-bull'}`}>
                    {j.emotion}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">News Context at Entry</span>
                  <span className="text-slate-300 truncate block text-[11px]">{j.attachedNews}</span>
                </div>
              </div>

              {/* AI Psychology Coach Feedback Box */}
              <div className="p-3 bg-dark-800/80 rounded-xl border border-trade-cyan/30 text-xs flex items-start space-x-2.5">
                <Brain className="w-4 h-4 text-trade-cyan shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-trade-cyan block text-[10px] uppercase">AI Psychology Coach Analysis</span>
                  <p className="text-slate-200 leading-relaxed font-sans">{j.aiPsychologyCoachFeedback}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
