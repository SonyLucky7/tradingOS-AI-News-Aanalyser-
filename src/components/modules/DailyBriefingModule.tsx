import React, { useState } from 'react';
import { useTradeOS } from '../../context/TradeOSContext';
import { 
  FileText, 
  Sun, 
  Moon, 
  CheckSquare, 
  AlertOctagon, 
  TrendingUp, 
  Brain, 
  Award, 
  Download 
} from 'lucide-react';

export const DailyBriefingModule: React.FC = () => {
  const [briefingType, setBriefingType] = useState<'MORNING' | 'EOD'>('MORNING');

  return (
    <div className="p-4 font-mono space-y-4 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-800 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-amber-950 border border-amber-500/50 text-amber-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              AI Morning Briefing & End-of-Day Performance Report
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-bold">
                AUTOMATED BRIEFINGS
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Generates institutional daily trading checklists, macroeconomic bias, high-risk danger zones, and post-session trade coaching.
            </p>
          </div>
        </div>

        {/* Toggle Briefing Type */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setBriefingType('MORNING')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
              briefingType === 'MORNING'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-dark-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sun className="w-4 h-4" /> Morning Market Briefing
          </button>
          <button
            onClick={() => setBriefingType('EOD')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
              briefingType === 'EOD'
                ? 'bg-trade-accent text-white shadow-lg shadow-trade-accent/20'
                : 'bg-dark-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Moon className="w-4 h-4" /> End-of-Day Report
          </button>
        </div>
      </div>

      {briefingType === 'MORNING' ? (
        /* MORNING BRIEFING DOCUMENT */
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">INSTITUTIONAL MORNING CHECKLIST</span>
              <h2 className="text-lg font-extrabold text-white">Daily Pre-Market Trading Dossier — July 21, 2026</h2>
            </div>
            <button className="px-3 py-1.5 bg-dark-800 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>

          {/* Core Bias Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 bg-dark-800/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-bold uppercase">Overall Market Bias</span>
              <span className="text-sm font-extrabold text-amber-400">CAUTIOUSLY BULLISH</span>
              <p className="text-[10px] text-slate-400 mt-1">Dip buying favored after 18:30 IST Fed speech</p>
            </div>
            <div className="p-3.5 bg-dark-800/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-bold uppercase">Expected Volatility Index</span>
              <span className="text-sm font-extrabold text-rose-400">EXTREME (VIX 19.4)</span>
              <p className="text-[10px] text-slate-400 mt-1">High whip-saw risk during US open</p>
            </div>
            <div className="p-3.5 bg-dark-800/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block font-bold uppercase">Primary Catalyst</span>
              <span className="text-sm font-extrabold text-trade-cyan">FED POWELL SPEECH & CPI</span>
              <p className="text-[10px] text-slate-400 mt-1">Scheduled at 18:30 IST today</p>
            </div>
          </div>

          {/* Today's Checklist */}
          <div>
            <h3 className="text-xs font-bold text-trade-cyan uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-trade-cyan" /> Pre-Market Trader Action Checklist
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { task: 'Close or tighten stop losses on open BTC longs prior to 18:15 IST Fed speech', checked: true },
                { task: 'Monitor BankNifty 52,250 dip support following RBI ₹50,000 Cr VRR liquidity injection', checked: true },
                { task: 'Check Coinbase-to-Binance whale deposit stream ($983M inflow detected)', checked: false },
                { task: 'Review Option Chain Max Pain at 24,500 for Nifty 50 expiry', checked: false }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-2.5 bg-dark-800/50 rounded-lg border border-slate-800">
                  <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4 rounded text-trade-cyan bg-slate-900 border-slate-700" />
                  <span className={`text-slate-200 ${item.checked ? 'line-through text-slate-400' : 'font-medium'}`}>{item.task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* END OF DAY REPORT */
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-trade-accent font-bold uppercase tracking-wider block">POST-SESSION PERFORMANCE REVIEW</span>
              <h2 className="text-lg font-extrabold text-white">End-of-Day AI Performance Audit — July 21, 2026</h2>
            </div>
            <button className="px-3 py-1.5 bg-dark-800 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-dark-800/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Net Realized PnL</span>
              <span className="text-lg font-extrabold text-trade-bull">+$1,200.00</span>
            </div>
            <div className="p-3 bg-dark-800/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Win Rate</span>
              <span className="text-lg font-extrabold text-trade-cyan">66.7% (2/3 Wins)</span>
            </div>
            <div className="p-3 bg-dark-800/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Psychology Score</span>
              <span className="text-lg font-extrabold text-amber-400">78 / 100</span>
            </div>
            <div className="p-3 bg-dark-800/80 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">News Discipline</span>
              <span className="text-lg font-extrabold text-trade-bull">EXCELLENT</span>
            </div>
          </div>

          {/* AI Coaching Lessons */}
          <div className="p-4 bg-dark-800/80 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-trade-cyan uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-trade-cyan" /> End-of-Day AI Psychology & Strategy Takeaways
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              Overall session performance was profitable (+$1,200). Your best trade was entering BankNifty long following the RBI liquidity news (+₹2,500 PnL). However, your morning BTC trade suffered a -$1,300 loss because you entered 10 minutes before the scheduled Fed Powell speech, ignoring TradeOS AI warnings. Next session goal: Zero entries within 15 minutes of CRITICAL urgency news releases.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
