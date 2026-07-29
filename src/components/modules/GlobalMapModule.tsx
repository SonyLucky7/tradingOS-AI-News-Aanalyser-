import React, { useState, useEffect, useRef } from 'react';
import { useTradeOS } from '../../context/TradeOSContext';
import { RiskMarker } from '../../types/tradeos';
import Globe from 'react-globe.gl';
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

  const globeEl = useRef<any>(null);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 1;
      // Start camera closer
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 });
    }
  }, []);

  useEffect(() => {
    const gsap = (window as any).gsap;
    if (gsap) {
      gsap.fromTo('.module-card', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out', clearProps: 'all' });
    }
  }, []);

  return (
    <div className="p-4 font-mono space-y-4">
      {/* Top Banner */}
      <div className="module-card glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-800 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-trade-accent/20 border border-trade-accent/40 text-trade-cyan">
            <Globe2 className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-base font-bold font-display text-white flex items-center gap-2">
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
              className={`btn-premium px-3 py-1.5 rounded-lg font-bold transition ${
                activeFilter === cat 
                  ? 'bg-trade-cyan text-black shadow-md shadow-trade-cyan/20' 
                  : 'glass-panel text-slate-400 hover:text-white border border-slate-800'
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
          <div className="module-card glass-panel p-4 rounded-xl border border-slate-800 flex flex-col justify-between min-h-[540px] relative overflow-hidden bg-[#05070C]">
            {/* World Map Grid Lines Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

            {/* 3D WebGL Real World Globe */}
            <div className="relative w-full h-[460px] rounded-lg border border-slate-800/80 bg-dark-900/60 flex items-center justify-center overflow-hidden cursor-move">
              <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundColor="rgba(0,0,0,0)"
                width={800}
                height={460}
                pointsData={filteredMarkers}
                pointLat="lat"
                pointLng="lng"
                pointColor={(d: any) => d.severity === 'CRITICAL' ? '#e11d48' : '#f59e0b'}
                pointAltitude={0.05}
                pointRadius={0.4}
                ringsData={filteredMarkers}
                ringLat="lat"
                ringLng="lng"
                ringColor={(d: any) => d.severity === 'CRITICAL' ? 'rgba(225, 29, 72, 0.9)' : 'rgba(245, 158, 11, 0.9)'}
                ringMaxRadius={5}
                ringPropagationSpeed={2}
                ringRepeatPeriod={1000}
                htmlElementsData={filteredMarkers}
                htmlLat="lat"
                htmlLng="lng"
                htmlElement={(d: any) => {
                  const el = document.createElement('div');
                  const isSelected = selectedMarker.id === d.id;
                  el.innerHTML = `
                    <div class="relative flex flex-col items-center justify-center pointer-events-auto group" style="transform: translate(-50%, -50%);">
                      <div class="w-4 h-4 rounded-full flex items-center justify-center border shadow-lg transition-transform group-hover:scale-125 cursor-pointer ${isSelected ? 'bg-trade-cyan border-white scale-125 shadow-trade-cyan/50' : d.severity === 'CRITICAL' ? 'bg-rose-600 border-rose-300' : 'bg-amber-500 border-amber-200'}">
                        <div class="w-1.5 h-1.5 bg-black rounded-full"></div>
                      </div>
                      <div class="absolute top-5 bg-dark-900 border border-slate-700 text-[10px] px-2 py-0.5 rounded shadow-xl text-white whitespace-nowrap font-bold opacity-0 transition-opacity group-hover:opacity-100 z-50">
                        ${d.title}
                      </div>
                    </div>
                  `;
                  el.onclick = () => setSelectedMarker(d);
                  return el;
                }}
              />
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
          <div className="module-card glass-panel glass-card-hover p-4 rounded-xl border border-slate-800 space-y-4 min-h-[540px]">
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
              <h3 className="text-sm font-bold font-display text-white mb-1">{selectedMarker.title}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-trade-cyan" /> {selectedMarker.locationName}
              </p>
            </div>

            {/* AI Dossier Breakdown */}
            <div className="p-3 glass-panel rounded-xl border border-slate-800 space-y-2">
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
              className="btn-premium w-full py-2.5 bg-gradient-to-r from-trade-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-lg transition shadow-lg shadow-trade-cyan/20 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" /> Evaluate Asset Safety Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
