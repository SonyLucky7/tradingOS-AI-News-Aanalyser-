import React from 'react';
import { useTradeOS } from '../../context/TradeOSContext';
import { 
  CalendarDays, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  CheckCircle 
} from 'lucide-react';

export const EconomicCalendarModule: React.FC = () => {
  const { economicEvents, setActiveModule } = useTradeOS();

  return (
    <div className="p-4 font-mono space-y-4">
      {/* Top Banner */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-800 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-amber-950 border border-amber-500/50 text-amber-400">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Macroeconomic Event Calendar & Volatility Warning
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-bold">
                HIGH VOLATILITY RADAR
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Live countdowns to central bank speeches, inflation data releases, and interest rate decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Event Cards */}
      <div className="space-y-3">
        {economicEvents.map(evt => {
          const isCrit = evt.countdownMinutes < 30;
          return (
            <div 
              key={evt.id} 
              className={`glass-panel p-4 rounded-xl border transition ${
                isCrit ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/30' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-bold text-white">
                    {evt.currency}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{evt.time}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    evt.impact === 'HIGH' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {evt.impact} IMPACT
                  </span>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center space-x-2 bg-dark-800 px-3 py-1 rounded-lg border border-slate-700">
                  <Clock className={`w-4 h-4 ${isCrit ? 'text-rose-400 animate-pulse' : 'text-trade-cyan'}`} />
                  <span className="text-xs font-extrabold text-white">
                    T-{evt.countdownMinutes} MINS
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <h3 className="text-sm font-bold text-slate-100">{evt.event}</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-dark-800/60 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Forecast</span>
                    <span className="text-slate-200 font-bold">{evt.forecast}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Previous</span>
                    <span className="text-slate-200 font-bold">{evt.previous}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Actual</span>
                    <span className="text-trade-cyan font-bold">{evt.actual || 'Pending'}</span>
                  </div>
                </div>

                {evt.aiWarning && (
                  <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-200 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{evt.aiWarning}</span>
                    </span>
                    <button onClick={() => setActiveModule('COPILOT')} className="text-trade-cyan font-bold hover:underline text-[10px]">
                      Check Safety →
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
