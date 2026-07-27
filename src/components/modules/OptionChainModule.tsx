import React, { useState, useEffect } from 'react';
import { useTradeOS } from '../../context/TradeOSContext';
import { 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Brain, 
  DollarSign, 
  Layers 
} from 'lucide-react';

export const OptionChainModule: React.FC = () => {
  const { optionChain } = useTradeOS();
  const [selectedAsset, setSelectedAsset] = useState('NIFTY50');
  const [aiAnalysisText, setAiAnalysisText] = useState(optionChain.interpretation);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setLoading(true);
    import('../../services/groqAI').then(({ analyzeOptionChainWithAI }) => {
      analyzeOptionChainWithAI(selectedAsset, optionChain.pcrRatio, optionChain.maxPain, optionChain.underlyingPrice)
        .then(res => setAiAnalysisText(res))
        .finally(() => setLoading(false));
    });
  }, [selectedAsset, optionChain]);

  useEffect(() => {
    const gsap = (window as any).gsap;
    if (gsap) {
      gsap.fromTo('.module-card', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out', clearProps: 'all' });
    }
  }, []);

  return (
    <div className="p-4 font-mono space-y-4">
      {/* Top Banner */}
      <div className="glass-panel module-card p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-800 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-trade-bull/20 border border-trade-bull/40 text-trade-bull">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-white flex items-center gap-2">
              Institutional Option Chain & FII/DII Intelligence
              <span className="text-[10px] bg-emerald-950 text-trade-bull border border-emerald-800 px-2 py-0.5 rounded font-bold">
                NSE / BSE / CRYPTO
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Analyzes Open Interest (OI) build-up, Put-Call Ratio (PCR), Max Pain level, and FII/DII institutional cash flow.
            </p>
          </div>
        </div>

        {/* Asset Switcher */}
        <div className="flex items-center space-x-2 text-xs">
          {['NIFTY50', 'BANKNIFTY', 'BTCUSDT'].map(sym => (
            <button
              key={sym}
              onClick={() => setSelectedAsset(sym)}
              className={`px-3 py-1.5 rounded-lg font-bold transition glass-card-hover btn-premium ${
                selectedAsset === sym
                  ? 'bg-trade-cyan text-black font-bold shadow-md shadow-trade-cyan/20'
                  : 'glass-panel text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Institutional Overview Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs module-card">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 glass-card-hover">
          <span className="text-[10px] text-slate-500 font-bold block uppercase font-display">Underlying Spot Price</span>
          <span className="text-lg font-extrabold tabular-nums text-white">${optionChain.underlyingPrice.toLocaleString()}</span>
          <span className="text-[10px] text-trade-bull block mt-0.5">+0.85% Today</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 glass-card-hover">
          <span className="text-[10px] text-slate-500 font-bold block uppercase font-display">Put-Call Ratio (PCR)</span>
          <span className="text-lg font-extrabold tabular-nums text-trade-bull">{optionChain.pcrRatio}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Bullish Sentiment (&gt; 1.0)</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 glass-card-hover">
          <span className="text-[10px] text-slate-500 font-bold uppercase block font-display">Max Pain Level</span>
          <span className="text-lg font-extrabold tabular-nums text-trade-warn">{optionChain.maxPain}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Expiry Gravitational Anchor</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 glass-card-hover">
          <span className="text-[10px] text-slate-500 font-bold uppercase block font-display">FII Net Cash Flow</span>
          <span className="text-lg font-extrabold tabular-nums text-trade-bull">+₹{optionChain.fiiNetFlowCr} Cr</span>
          <span className="text-[10px] text-rose-400 block mt-0.5">DII Net: -₹{Math.abs(optionChain.diiNetFlowCr)} Cr</span>
        </div>
      </div>

      {/* AI Option Interpretation Note */}
      <div className="p-4 glass-panel rounded-xl border border-trade-cyan/30 flex items-start space-x-3 text-xs module-card">
        <Brain className={`w-5 h-5 text-trade-cyan shrink-0 mt-0.5 ${loading ? 'animate-spin' : ''}`} />
        <div>
          <span className="font-bold text-trade-cyan block mb-0.5">AI Option Chain Structure Analysis:</span>
          <div className="text-slate-200 leading-relaxed font-sans">
            {loading ? <div className="space-y-2"><div className="shimmer-skeleton h-3 w-3/4" /><div className="shimmer-skeleton h-3 w-1/2" /></div> : aiAnalysisText}
          </div>
        </div>
      </div>

      {/* Option Chain Data Table */}
      <div className="glass-panel module-card p-4 rounded-xl border border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-300">
          <span className="text-rose-400">CALL OPTIONS (BEARISH BUILD-UP)</span>
          <span className="text-trade-cyan uppercase">STRIKE PRICE</span>
          <span className="text-emerald-400">PUT OPTIONS (BULLISH SUPPORT)</span>
        </div>

        <table className="w-full text-xs text-left border-collapse font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] text-slate-500 uppercase bg-dark-800/60">
              <th className="py-2 px-2 text-right">Call OI</th>
              <th className="py-2 px-2 text-right">OI Chg</th>
              <th className="py-2 px-2 text-right">IV %</th>
              <th className="py-2 px-2 text-right">LTP</th>
              <th className="py-2 px-4 text-center text-white bg-slate-800/80">STRIKE</th>
              <th className="py-2 px-2 text-left">LTP</th>
              <th className="py-2 px-2 text-left">IV %</th>
              <th className="py-2 px-2 text-left">OI Chg</th>
              <th className="py-2 px-2 text-left">Put OI</th>
            </tr>
          </thead>
          <tbody>
            {optionChain.rows.map(row => {
              const isAtm = Math.abs(row.strikePrice - optionChain.underlyingPrice) < 60;
              const callOIPct = Math.min(row.callOI / 3000000, 1);
              const putOIPct = Math.min(row.putOI / 3000000, 1);
              return (
                <tr 
                  key={row.strikePrice} 
                  className={`border-b border-slate-800/60 transition hover:bg-slate-800/40 ${
                    isAtm ? 'bg-trade-cyan/10 font-bold border-trade-cyan/40' : ''
                  }`}
                >
                  <th className="py-2 px-2 text-right font-medium text-slate-200 tabular-nums" style={{ background: `linear-gradient(90deg, transparent ${100 - callOIPct * 100}%, rgba(225, 29, 72, 0.15) ${100 - callOIPct * 100}%)` }}>
                    {row.callOI.toLocaleString()}
                  </th>
                  <td className={`py-2 px-2 text-right tabular-nums text-[11px] ${row.callOIChange >= 0 ? 'text-trade-bull' : 'text-trade-bear'}`}>
                    {row.callOIChange >= 0 ? '+' : ''}{row.callOIChange}
                  </td>
                  <td className="py-2 px-2 text-right text-slate-400 tabular-nums">{row.callIV}%</td>
                  <td className="py-2 px-2 text-right font-bold tabular-nums text-rose-400">₹{row.callLTP}</td>
                  <td className="py-2 px-4 text-center font-extrabold tabular-nums text-white bg-dark-800 border-x border-slate-800 relative">
                    {row.strikePrice} {isAtm && <span className="absolute right-1 top-1 text-[9px] text-trade-cyan font-bold bg-trade-cyan/20 px-1 rounded">ATM</span>}
                  </td>
                  <td className="py-2 px-2 text-left font-bold tabular-nums text-emerald-400">₹{row.putLTP}</td>
                  <td className="py-2 px-2 text-left text-slate-400 tabular-nums">{row.putIV}%</td>
                  <td className={`py-2 px-2 text-left tabular-nums text-[11px] ${row.putOIChange >= 0 ? 'text-trade-bull' : 'text-trade-bear'}`}>
                    {row.putOIChange >= 0 ? '+' : ''}{row.putOIChange}
                  </td>
                  <td className="py-2 px-2 text-left font-medium tabular-nums text-slate-200" style={{ background: `linear-gradient(270deg, transparent ${100 - putOIPct * 100}%, rgba(16, 185, 129, 0.15) ${100 - putOIPct * 100}%)` }}>
                    {row.putOI.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
