import React, { useState } from 'react';
import { useTradeOS } from '../../context/TradeOSContext';
import { RiskMarker } from '../../types/tradeos';
import { 
  Globe2, 
  ShieldAlert, 
  Flame, 
  Radio, 
  MapPin, 
  Zap, 
  Crosshair, 
  Layers 
} from 'lucide-react';

export const GlobalMapModule: React.FC = () => {
  const { riskMarkers, setActiveModule } = useTradeOS();
  const [selectedMarker, setSelectedMarker] = useState<RiskMarker>(riskMarkers[0]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'MILITARY' | 'CYBER' | 'WEATHER'>('ALL');

  const filteredMarkers = activeFilter === 'ALL'
    ? riskMarkers
    : riskMarkers.filter(m => m.category === activeFilter);

  return (
    <div className="p-4 font-mono space-y-4">
      {/* Top Banner */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-800 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-trade-accent/20 border border-trade-accent/40 text-trade-cyan">
            <Globe2 className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Global Spatial Risk & Geopolitical Radar
              <span className="text-[10px] bg-trade-accent/30 text-trade-cyan border border-trade-accent/50 px-2 py-0.5 rounded font-bold">
                SPATIAL INTEL
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Live spatial tracking of military conflicts, cyber outages, shipping chokepoints, and weather disasters affecting asset prices.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 text-xs">
          {['ALL', 'MILITARY', 'CYBER', 'WEATHER'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                activeFilter === cat 
                  ? 'bg-trade-cyan text-black shadow-md shadow-trade-cyan/20' 
                  : 'bg-dark-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Interactive Spatial Map Canvas (8 Cols) */}
        <div className="lg:col-span-8">
          <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between min-h-[540px] relative overflow-hidden bg-[#05070C]">
            {/* World Map Grid Lines Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

            {/* Simulated Vector World Map Outline */}
            <div className="relative w-full h-[460px] rounded-lg border border-slate-800/80 bg-dark-900/60 p-4 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full text-slate-800 opacity-60 pointer-events-none" viewBox="0 0 1000 500" fill="currentColor">
                {/* Simplified Continent Paths */}
                {/* North America */}
                <path d="M 150 100 Q 250 80 320 160 Q 280 250 180 280 Q 100 200 150 100 Z" />
                {/* South America */}
                <path d="M 280 300 Q 350 320 320 440 Q 260 480 240 380 Z" />
                {/* Europe & Africa */}
                <path d="M 460 100 Q 560 90 580 180 Q 540 220 480 180 Z" />
                <path d="M 480 220 Q 590 240 560 380 Q 480 420 450 300 Z" />
                {/* Asia */}
                <path d="M 600 80 Q 850 70 880 220 Q 750 300 620 220 Z" />
                {/* Australia */}
                <path d="M 780 340 Q 880 350 860 440 Q 760 450 780 340 Z" />
              </svg>

              {/* Positioned Marker Nodes */}
              {filteredMarkers.map(m => {
                // Map Lat/Lng to SVG Coordinate %
                const x = ((m.lng + 180) / 360) * 100;
                const y = ((90 - m.lat) / 180) * 100;
                const isSelected = selectedMarker.id === m.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMarker(m)}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`absolute w-8 h-8 rounded-full animate-ping opacity-75 ${
                        m.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}></span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform group-hover:scale-125 ${
                        isSelected ? 'bg-trade-cyan border-white scale-125 shadow-trade-cyan/50' : m.severity === 'CRITICAL' ? 'bg-rose-600 border-rose-300' : 'bg-amber-500 border-amber-200'
                      }`}>
                        <Radio className="w-3 h-3 text-black" />
                      </div>
                    </div>

                    {/* Hover Tooltip */}
                    <div className="absolute left-1/2 bottom-7 -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                      <div className="bg-dark-900 border border-slate-700 text-[10px] px-2 py-1 rounded shadow-xl text-white whitespace-nowrap font-bold">
                        {m.title}
                      </div>
                      <div className="w-2 h-2 bg-dark-900 border-r border-b border-slate-700 rotate-45 -mt-1"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800">
              <span className="flex items-center gap-1.5"><Crosshair className="w-3.5 h-3.5 text-trade-cyan" /> Click any marker for AI Intelligence Dossier</span>
              <div className="flex items-center space-x-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-600"></span> Critical Hazard</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> High Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Risk Dossier (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-4 min-h-[540px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-trade-cyan uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-trade-cyan" /> Risk Intelligence Dossier
              </span>
              <span className="text-[10px] bg-rose-950 text-rose-400 font-bold px-1.5 py-0.5 rounded border border-rose-800">
                {selectedMarker.severity}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">{selectedMarker.category} INCIDENT</span>
              <h3 className="text-sm font-bold text-white mb-1">{selectedMarker.title}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-trade-cyan" /> {selectedMarker.locationName}
              </p>
            </div>

            {/* AI Dossier Breakdown */}
            <div className="p-3 bg-dark-800/80 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">AI Assessment</h4>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {selectedMarker.aiDossier}
              </p>
            </div>

            {/* Impacted Asset Badges */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                High Exposure Assets
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedMarker.affectedMarkets.map(mkt => (
                  <span key={mkt} className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-bold text-trade-cyan">
                    {mkt}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveModule('COPILOT')}
              className="w-full py-2.5 bg-gradient-to-r from-trade-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-lg transition shadow-lg shadow-trade-cyan/20 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> Evaluate Asset Safety Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
