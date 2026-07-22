import React, { useState } from 'react';
import { useTradeOS } from '../../context/TradeOSContext';
import { 
  CalendarDays, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  CheckCircle,
  Filter,
  Flame,
  Globe
} from 'lucide-react';

export const EconomicCalendarModule: React.FC = () => {
  const { economicEvents, setActiveModule } = useTradeOS();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [impactFilter, setImpactFilter] = useState<'ALL' | 'HIGH'>('ALL');

  const filteredEvents = economicEvents.filter(evt => {
    const matchesCurr = selectedCurrency === 'ALL' || evt.currency === selectedCurrency;
    const matchesImpact = impactFilter === 'ALL' || evt.impact === 'HIGH';
    return matchesCurr && matchesImpact;
  });

  const getCurrencyFlag = (curr: string) => {
    switch (curr) {
      case 'USD': return '🇺🇸';
      case 'INR': return '🇮🇳';
      case 'EUR': return '🇪🇺';
      case 'GBP': return '🇬🇧';
      default: return '🌐';
    }
  };

  const getAffectedAssets = (eventTitle: string, curr: string) => {
    const title = eventTitle.toLowerCase();
    const assets: string[] = [];
    if (curr === 'USD') assets.push('DXY', 'SPX', 'XAUUSD', 'BTCUSDT');
    if (curr === 'INR') assets.push('NIFTY50', 'BANKNIFTY', 'RELIANCE');
    if (curr === 'EUR') assets.push('EURUSD', 'DXY');
    if (curr === 'GBP') assets.push('GBPUSD', 'EURUSD');
    if (title.includes('oil') || title.includes('crude')) assets.push('USOIL', 'UKOIL');
    if (title.includes('nfp') || title.includes('cpi')) assets.push('XAUUSD', 'SPX');
    return Array.from(new Set(assets)).slice(0, 4);
  };

  return (
    <div className="p-4 font-mono space-y-4 select-none">
      {/* Top Header Banner */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-800 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-amber-950 border border-amber-500/50 text-amber-400">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Macroeconomic Event Calendar & Volatility Warning
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-bold animate-pulse">
                HIGH IMPACT RADAR
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Live countdowns to Federal Reserve, RBI, ECB, CPI, NFP & Oil Inventory announcements.
            </p>
          </div>
        </div>

        {/* Currency & Impact Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1 bg-dark-800 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedCurrency('ALL')}
              className={`px-2.5 py-1 rounded font-bold transition ${selectedCurrency === 'ALL' ? 'bg-trade-cyan text-black' : 'text-slate-400 hover:text-white'}`}
            >
              ALL ({economicEvents.length})
            </button>
            <button
              onClick={() => setSelectedCurrency('USD')}
              className={`px-2.5 py-1 rounded font-bold transition ${selectedCurrency === 'USD' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🇺🇸 USD
            </button>
            <button
              onClick={() => setSelectedCurrency('INR')}
              className={`px-2.5 py-1 rounded font-bold transition ${selectedCurrency === 'INR' ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'}`}
            >
              🇮🇳 INR
            </button>
            <button
              onClick={() => setSelectedCurrency('EUR')}
              className={`px-2.5 py-1 rounded font-bold transition ${selectedCurrency === 'EUR' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🇪🇺 EUR
            </button>
            <button
              onClick={() => setSelectedCurrency('GBP')}
              className={`px-2.5 py-1 rounded font-bold transition ${selectedCurrency === 'GBP' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🇬🇧 GBP
            </button>
          </div>

          <button
            onClick={() => setImpactFilter(prev => prev === 'ALL' ? 'HIGH' : 'ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold border transition flex items-center gap-1.5 ${
              impactFilter === 'HIGH'
                ? 'bg-rose-950 text-rose-300 border-rose-600'
                : 'bg-dark-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            {impactFilter === 'HIGH' ? '🔴 HIGH IMPACT ONLY' : 'SHOW ALL IMPACTS'}
          </button>
        </div>
      </div>

      {/* Calendar Event Cards Grid */}
      <div className="space-y-3">
        {filteredEvents.map(evt => {
          const isCrit = evt.countdownMinutes < 30;
          const affectedAssets = getAffectedAssets(evt.event, evt.currency);

          return (
            <div 
              key={evt.id} 
              className={`glass-panel p-4 rounded-xl border transition ${
                isCrit ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/30' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-1">
                    <span>{getCurrencyFlag(evt.currency)}</span> {evt.currency}
                  </span>
                  <span className="text-xs text-slate-300 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {evt.time}
                  </span>
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded ${
                    evt.impact === 'HIGH' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {evt.impact} IMPACT
                  </span>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center space-x-2 bg-dark-800 px-3.5 py-1.5 rounded-lg border border-slate-700 shadow-inner">
                  <Clock className={`w-4 h-4 ${isCrit ? 'text-rose-400 animate-pulse' : 'text-trade-cyan'}`} />
                  <span className="text-xs font-extrabold text-white">
                    T-{evt.countdownMinutes} MINS
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-white leading-snug">{evt.event}</h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Impacts:</span>
                    {affectedAssets.map(asset => (
                      <span key={asset} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-trade-cyan">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Forecast / Previous / Actual Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-dark-800/80 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">Forecast</span>
                    <span className="text-sm font-bold text-slate-200">{evt.forecast}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">Previous</span>
                    <span className="text-sm font-bold text-slate-300">{evt.previous}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-bold uppercase">Actual Result</span>
                    <span className="text-sm font-bold text-trade-cyan">{evt.actual || '⏳ Pending Release'}</span>
                  </div>
                </div>

                {/* AI Volatility Directive & Co-Pilot CTA */}
                {evt.aiWarning && (
                  <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-200 text-xs flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="font-medium">{evt.aiWarning}</span>
                    </span>
                    <button 
                      onClick={() => setActiveModule('COPILOT')} 
                      className="px-3 py-1 bg-trade-cyan hover:bg-cyan-400 text-black font-extrabold text-[10px] rounded-lg transition shadow-md shadow-trade-cyan/20 shrink-0"
                    >
                      Evaluate Trade Safety →
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
