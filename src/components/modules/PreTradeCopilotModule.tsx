import React, { useState } from 'react';
import { useTradeOS } from '../../context/TradeOSContext';
import { PreTradeInput, PreTradeEvaluation } from '../../types/tradeos';
import { 
  Bot, 
  ShieldAlert, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Zap, 
  Sliders 
} from 'lucide-react';

export const PreTradeCopilotModule: React.FC = () => {
  const { runPreTradeEvaluation, selectedTicker, tickers } = useTradeOS();

  const [input, setInput] = useState<PreTradeInput>({
    symbol: selectedTicker.symbol,
    side: 'LONG',
    entryPrice: selectedTicker.price,
    stopLoss: Number((selectedTicker.price * 0.985).toFixed(2)),
    targetPrice: Number((selectedTicker.price * 1.04).toFixed(2)),
    timeframe: '15m'
  });

  const [evaluation, setEvaluation] = useState<PreTradeEvaluation | null>(() => 
    runPreTradeEvaluation({
      symbol: selectedTicker.symbol,
      side: 'LONG',
      entryPrice: selectedTicker.price,
      stopLoss: Number((selectedTicker.price * 0.985).toFixed(2)),
      targetPrice: Number((selectedTicker.price * 1.04).toFixed(2)),
      timeframe: '15m'
    })
  );

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = runPreTradeEvaluation(input);
    setEvaluation(result);
  };

  return (
    <div className="p-4 font-mono space-y-4">
      {/* Module Title Banner */}
      <div className="glass-panel p-4 rounded-xl border border-trade-cyan/40 bg-gradient-to-r from-dark-900 via-dark-800 to-slate-900 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-trade-cyan/20 border border-trade-cyan/50 text-trade-cyan">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              AI Pre-Trade Safety Assistant
              <span className="text-[10px] bg-trade-cyan/20 text-trade-cyan border border-trade-cyan/40 px-2 py-0.5 rounded font-bold">
                MULTI-AGENT CO-PILOT
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Never get caught by surprise news again. Evaluates news, funding, whales, OI & economic calendar before you execute.
            </p>
          </div>
        </div>
      </div>

      {/* Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Trade Input Form (4 Cols) */}
        <div className="lg:col-span-4">
          <form onSubmit={handleEvaluate} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-trade-cyan" /> Proposed Trade Inputs
              </span>
              <span className="text-[10px] text-slate-500 font-bold">Realtime Evaluation</span>
            </div>

            {/* Asset Selector */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Asset Symbol</label>
              <select
                value={input.symbol}
                onChange={(e) => {
                  const s = e.target.value;
                  const t = tickers.find(x => x.symbol === s);
                  const price = t ? t.price : 67000;
                  setInput(prev => ({
                    ...prev,
                    symbol: s,
                    entryPrice: price,
                    stopLoss: Number((price * (prev.side === 'LONG' ? 0.985 : 1.015)).toFixed(2)),
                    targetPrice: Number((price * (prev.side === 'LONG' ? 1.04 : 0.96)).toFixed(2))
                  }));
                }}
                className="w-full bg-dark-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-trade-cyan"
              >
                {tickers.map(t => (
                  <option key={t.symbol} value={t.symbol}>{t.symbol} — {t.name}</option>
                ))}
              </select>
            </div>

            {/* Trade Side (LONG / SHORT) */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Trade Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInput(prev => ({ ...prev, side: 'LONG' }))}
                  className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    input.side === 'LONG'
                      ? 'bg-emerald-950 border border-emerald-500 text-trade-bull shadow-md shadow-emerald-900/30'
                      : 'bg-dark-800 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" /> LONG
                </button>
                <button
                  type="button"
                  onClick={() => setInput(prev => ({ ...prev, side: 'SHORT' }))}
                  className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    input.side === 'SHORT'
                      ? 'bg-rose-950 border border-rose-500 text-trade-bear shadow-md shadow-rose-900/30'
                      : 'bg-dark-800 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" /> SHORT
                </button>
              </div>
            </div>

            {/* Entry Price & SL / TP */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Entry Price ($)</label>
                <input
                  type="number"
                  step="any"
                  value={input.entryPrice}
                  onChange={(e) => setInput(prev => ({ ...prev, entryPrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-dark-800 border border-slate-700 rounded px-2.5 py-1.5 font-bold text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Planned SL ($)</label>
                <input
                  type="number"
                  step="any"
                  value={input.stopLoss}
                  onChange={(e) => setInput(prev => ({ ...prev, stopLoss: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-dark-800 border border-slate-700 rounded px-2.5 py-1.5 font-bold text-rose-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-trade-cyan via-blue-500 to-trade-accent text-black font-extrabold text-xs rounded-lg shadow-lg shadow-trade-cyan/20 hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" /> RUN AI MULTI-AGENT VERIFICATION
            </button>
          </form>
        </div>

        {/* Right Column: AI Co-Pilot Evaluation Report (8 Cols) */}
        {evaluation && (
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-5">
              {/* Verdict Header Badge */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center space-x-3">
                  {evaluation.verdict === 'SAFE_ENTRY' ? (
                    <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xl text-trade-bull flex items-center space-x-2">
                      <CheckCircle2 className="w-7 h-7" />
                      <div>
                        <span className="text-xs text-slate-400 block font-mono">RECOMMENDATION</span>
                        <span className="text-base font-extrabold tracking-wider">SAFE ENTRY RECOMMENDED</span>
                      </div>
                    </div>
                  ) : evaluation.verdict === 'WAIT' ? (
                    <div className="p-3 bg-amber-950 border border-amber-500 rounded-xl text-amber-400 flex items-center space-x-2">
                      <Clock className="w-7 h-7" />
                      <div>
                        <span className="text-xs text-slate-400 block font-mono">RECOMMENDATION</span>
                        <span className="text-base font-extrabold tracking-wider">PAUSE & WAIT BEFORE ENTRY</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-950 border border-rose-500 rounded-xl text-rose-400 flex items-center space-x-2">
                      <AlertOctagon className="w-7 h-7" />
                      <div>
                        <span className="text-xs text-slate-400 block font-mono">RECOMMENDATION</span>
                        <span className="text-base font-extrabold tracking-wider">HIGH RISK — AVOID TRADE</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Score Gauges */}
                <div className="flex items-center space-x-4 font-mono">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block uppercase">Trade Score</span>
                    <span className={`text-xl font-extrabold ${evaluation.tradeScore > 75 ? 'text-trade-bull' : 'text-amber-400'}`}>
                      {evaluation.tradeScore}/100
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 block uppercase">Risk Score</span>
                    <span className={`text-xl font-extrabold ${evaluation.riskScore > 60 ? 'text-rose-400' : 'text-trade-bull'}`}>
                      {evaluation.riskScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Warnings & Upcoming Events */}
              {evaluation.upcomingEventsWarning.length > 0 && (
                <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-200 text-xs space-y-1.5">
                  <span className="font-bold flex items-center gap-1.5 text-rose-400">
                    <ShieldAlert className="w-4 h-4" /> ACTIVE RISK FACTORS DETECTED:
                  </span>
                  {evaluation.upcomingEventsWarning.map((warn, i) => (
                    <p key={i} className="pl-5 font-medium">{warn}</p>
                  ))}
                </div>
              )}

              {/* AI Reasoning Summary */}
              <div>
                <h3 className="text-xs font-bold text-trade-cyan uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Bot className="w-4 h-4" /> Master Agent Reasoning & Position Directive
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed bg-dark-800/80 p-4 rounded-xl border border-slate-800">
                  {evaluation.reasoningSummary}
                </p>
              </div>

              {/* Suggested Trade Execution Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-dark-800/90 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block font-mono">Safe Entry Time</span>
                  <span className="text-slate-100 font-bold">{evaluation.safeEntryTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block font-mono">Suggested SL</span>
                  <span className="text-rose-400 font-bold">${evaluation.suggestedStopLoss.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block font-mono">Max Position Size</span>
                  <span className="text-trade-cyan font-bold">{evaluation.suggestedPositionSizePct}% of Equity</span>
                </div>
              </div>

              {/* Multi-Agent Breakdown Cards */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Specialized Agent Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {evaluation.agentBreakdowns.map((agent, i) => (
                    <div key={i} className="p-3 bg-dark-800/50 rounded-lg border border-slate-800/80 flex items-start justify-between">
                      <div>
                        <span className="font-bold text-slate-200 block text-[11px]">{agent.agentName}</span>
                        <span className="text-slate-400 text-[10px]">{agent.keyPoint}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        agent.verdict === 'BULLISH' ? 'bg-emerald-950 text-trade-bull' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {agent.verdict}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
