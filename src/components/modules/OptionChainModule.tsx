import React, { useState } from 'react';
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

  return (
    <div className="p-4 font-mono space-y-4">
      {/* Top Banner */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-800 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-trade-bull/20 border border-trade-bull/40 text-trade-bull">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
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
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedAsset === sym
                  ? 'bg-trade-cyan text-black font-bold shadow-md shadow-trade-cyan/20'
                  : 'bg-dark-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Institutional Overview Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold block uppercase">Underlying Spot Price</span>
          <span className="text-lg font-extrabold text-white">${optionChain.underlyingPrice.toLocaleString()}</span>
          <span className="text-[10px] text-trade-bull block mt-0.5">+0.85% Today</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold block uppercase">Put-Call Ratio (PCR)</span>
          <span className="text-lg font-extrabold text-trade-bull">{optionChain.pcrRatio}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Bullish Sentiment (&gt; 1.0)</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Max Pain Level</span>
          <span className="text-lg font-extrabold text-trade-warn">{optionChain.maxPain}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Expiry Gravitational Anchor</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">FII Net Cash Flow</span>
          <span className="text-lg font-extrabold text-trade-bull">+₹{optionChain.fiiNetFlowCr} Cr</span>
          <span className="text-[10px] text-rose-400 block mt-0.5">DII Net: -₹{Math.abs(optionChain.diiNetFlowCr)} Cr</span>
        </div>
      </div>

      {/* AI Option Interpretation Note */}
      <div className="p-4 bg-dark-800/80 rounded-xl border border-trade-cyan/30 flex items-start space-x-3 text-xs">
        <Brain className="w-5 h-5 text-trade-cyan shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-trade-cyan block mb-0.5">AI Option Chain Structure Analysis:</span>
          <p className="text-slate-200 leading-relaxed font-sans">{optionChain.interpretation}</p>
        </div>
      </div>

      {/* Option Chain Data Table */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 overflow-x-auto">
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
              return (
                <tr 
                  key={row.strikePrice} 
                  className={`border-b border-slate-800/60 transition hover:bg-slate-800/40 ${
                    isAtm ? 'bg-trade-cyan/10 font-bold border-trade-cyan/40' : ''
                  }`}
                >
                  <th className="py-2 px-2 text-right font-medium text-slate-200">{row.callOI.toLocaleString()}</th>
                  <td className={`py-2 px-2 text-right text-[11px] ${row.callOIChange >= 0 ? 'text-trade-bull' : 'text-trade-bear'}`}>
                    {row.callOIChange >= 0 ? '+' : ''}{row.callOIChange}
                  </td>
                  <td className="py-2 px-2 text-right text-slate-400">{row.callIV}%</td>
                  <td className="py-2 px-2 text-right font-bold text-rose-400">₹{row.callLTP}</td>
                  <td className="py-2 px-4 text-center font-extrabold text-white bg-dark-800 border-x border-slate-800">
                    {row.strikePrice} {isAtm && <span className="text-[9px] text-trade-cyan block">ATM</span>}
                  </td>
                  <td className="py-2 px-2 text-left font-bold text-emerald-400">₹{row.putLTP}</td>
                  <td className="py-2 px-2 text-left text-slate-400">{row.putIV}%</td>
                  <td className={`py-2 px-2 text-left text-[11px] ${row.putOIChange >= 0 ? 'text-trade-bull' : 'text-trade-bear'}`}>
                    {row.putOIChange >= 0 ? '+' : ''}{row.putOIChange}
                  </td>
                  <td className="py-2 px-2 text-left font-medium text-slate-200">{row.putOI.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
