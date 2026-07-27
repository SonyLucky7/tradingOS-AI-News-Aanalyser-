import React, { useState, useEffect } from 'react';
import { useTradeOS } from '../../context/TradeOSContext';
import { StoplossInvestigation } from '../../types/tradeos';
import { 
  SearchX, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  Brain, 
  RotateCcw, 
  Zap, 
  CheckCircle 
} from 'lucide-react';

export const SLInvestigatorModule: React.FC = () => {
  const { runSLInvestigation, selectedTicker } = useTradeOS();

  const [symbol, setSymbol] = useState(selectedTicker.symbol);
  const [slPrice, setSlPrice] = useState(Number((selectedTicker.price * 0.982).toFixed(2)));
  const [tradeSide, setTradeSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [timeStr, setTimeStr] = useState('14:18 IST (12 mins ago)');

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<StoplossInvestigation | null>(() => 
    runSLInvestigation(selectedTicker.symbol, Number((selectedTicker.price * 0.982).toFixed(2)), '14:18 IST', 'LONG')
  );

  const handleInvestigate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { investigateSLWithAI } = await import('../../services/groqAI');
      const aiResult = await investigateSLWithAI(symbol, slPrice, timeStr, tradeSide);
      setReport(aiResult);
    } catch {
      setReport(runSLInvestigation(symbol, slPrice, timeStr, tradeSide));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const gsap = (window as any).gsap;
    if (gsap) {
      gsap.from('.module-card', { y: 16, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' });
    }
  }, []);

  return (
    <div className="p-4 font-mono space-y-4">
      {/* Banner */}
      <div className="glass-panel module-card p-4 rounded-xl border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-dark-900 to-dark-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-rose-950 border border-rose-500 text-rose-400">
            <SearchX className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-white flex items-center gap-2">
              Stoploss Post-Mortem Investigation Engine
              <span className="text-[10px] bg-rose-950 border border-rose-600 text-rose-300 px-2 py-0.5 rounded font-bold">
                FORENSIC ANOMALY RADAR
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              When your stoploss hits, AI immediately scans orderbook logs, whale alerts & news to determine if it was a liquidity hunt or real trend reversal.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Form Column (4 Cols) */}
        <div className="lg:col-span-4 module-card">
          <form onSubmit={handleInvestigate} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <SearchX className="w-4 h-4 text-rose-400" /> Investigate Stopped Trade
              </span>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Asset Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full glass-panel border border-slate-700 rounded px-3 py-2 text-xs font-bold text-white uppercase focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTradeSide('LONG')}
                className={`py-1.5 rounded font-bold text-xs glass-card-hover transition ${tradeSide === 'LONG' ? 'bg-emerald-950 border border-emerald-500 text-trade-bull' : 'glass-panel text-slate-400 border border-slate-700 hover:text-white'}`}
              >
                LONG Trade
              </button>
              <button
                type="button"
                onClick={() => setTradeSide('SHORT')}
                className={`py-1.5 rounded font-bold text-xs glass-card-hover transition ${tradeSide === 'SHORT' ? 'bg-rose-950 border border-rose-500 text-trade-bear' : 'glass-panel text-slate-400 border border-slate-700 hover:text-white'}`}
              >
                SHORT Trade
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Stop Loss Hit Price ($)</label>
              <input
                type="number"
                step="any"
                value={slPrice}
                onChange={(e) => setSlPrice(parseFloat(e.target.value) || 0)}
                className="w-full glass-panel tabular-nums border border-slate-700 rounded px-3 py-2 text-xs font-bold text-rose-400 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Stop Timestamp</label>
              <input
                type="text"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="w-full glass-panel border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 btn-premium bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs rounded-lg shadow-lg shadow-rose-900/30 hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="shimmer-skeleton h-4 w-40" />
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" /> LAUNCH FORENSIC DIAGNOSTIC
                </>
              )}
            </button>
          </form>
        </div>

        {/* Diagnostic Report Column (8 Cols) */}
        {report && (
          <div className="lg:col-span-8 space-y-4 module-card">
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block font-display">DIAGNOSTIC REPORT FOR {report.symbol}</span>
                  <h2 className="font-display text-base font-bold text-white">{report.title}</h2>
                </div>
                {report.wasManipulation ? (
                  <span className="px-3 py-1 bg-rose-950 border border-rose-500 text-rose-300 font-bold text-xs rounded-lg flex items-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-4 h-4" /> LIQUIDITY HUNT CONFIRMED
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg">
                    FUNDAMENTAL REVERSAL
                  </span>
                )}
              </div>

              {/* Forensic Report Text */}
              <div className="p-4 glass-panel rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-display text-xs font-bold text-trade-cyan uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> Anomaly Sequence Findings
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {report.detailedReport}
                </p>
              </div>

              {/* Detected Anomalies Breakdown */}
              <div>
                <h4 className="font-display text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Market Anomalies Detected at Timestamp ({report.stoppedAtTime})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {report.anomaliesDetected.map((anom, idx) => (
                    <div key={idx} className="p-3 glass-panel rounded-lg border border-slate-800 text-xs glass-card-hover">
                      <span className="text-[10px] text-rose-400 font-bold block">{anom.type}</span>
                      <span className="font-bold text-white">{anom.metric}</span>
                      <span className="text-[9px] block text-slate-500 mt-1">Severity: {anom.severity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recovery Guidance */}
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-trade-bull shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white mb-0.5">AI Coach Recovery Advice:</span>
                  <p className="leading-relaxed text-slate-300">{report.recoveryAdvice}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
