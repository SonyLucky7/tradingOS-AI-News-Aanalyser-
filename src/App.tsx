import React, { Suspense, useEffect, useRef } from 'react';
import { useTradeOS } from './context/TradeOSContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TerminalModule } from './components/modules/TerminalModule';
import { NewsToastPopup } from './components/NewsToastPopup';
import { UpdatePopup } from './components/UpdatePopup';
import { RiskDisclaimerPopup } from './components/RiskDisclaimerPopup';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy load all secondary modules for massive performance & initial load time optimization
const AINewsModule = React.lazy(() => import('./components/modules/AINewsModule').then(m => ({ default: m.AINewsModule })));
const PreTradeCopilotModule = React.lazy(() => import('./components/modules/PreTradeCopilotModule').then(m => ({ default: m.PreTradeCopilotModule })));
const SLInvestigatorModule = React.lazy(() => import('./components/modules/SLInvestigatorModule').then(m => ({ default: m.SLInvestigatorModule })));
const OptionChainModule = React.lazy(() => import('./components/modules/OptionChainModule').then(m => ({ default: m.OptionChainModule })));
const TradingJournalModule = React.lazy(() => import('./components/modules/TradingJournalModule').then(m => ({ default: m.TradingJournalModule })));
const EconomicCalendarModule = React.lazy(() => import('./components/modules/EconomicCalendarModule').then(m => ({ default: m.EconomicCalendarModule })));
const DailyBriefingModule = React.lazy(() => import('./components/modules/DailyBriefingModule').then(m => ({ default: m.DailyBriefingModule })));
const AIChatModule = React.lazy(() => import('./components/modules/AIChatModule').then(m => ({ default: m.AIChatModule })));
const SettingsModule = React.lazy(() => import('./components/modules/SettingsModule').then(m => ({ default: m.SettingsModule })));
const ReplayModule = React.lazy(() => import('./components/modules/ReplayModule').then(m => ({ default: m.ReplayModule })));
const LiveTVStream = React.lazy(() => import('./components/LiveTVStream').then(m => ({ default: m.LiveTVStream })));

// Premium shimmer loading skeleton for lazy loaded modules
const ModuleLoader = () => (
  <div className="w-full h-full flex flex-col items-center justify-center min-h-[500px]">
    <div className="glass-panel p-10 rounded-2xl border border-slate-800/60 flex flex-col items-center neon-glow-cyan">
      <div className="relative mb-5">
        <Loader2 className="w-10 h-10 text-trade-cyan animate-spin" />
        <div className="absolute inset-0 w-10 h-10 rounded-full bg-trade-cyan/10 animate-ping" />
      </div>
      <h3 className="text-white font-display font-bold tracking-wide text-lg">Loading Module</h3>
      <p className="text-xs text-slate-500 mt-2 font-mono">Initializing AI Core...</p>
      <div className="mt-4 flex gap-1.5">
        <div className="w-16 h-1.5 shimmer-skeleton rounded-full" />
        <div className="w-10 h-1.5 shimmer-skeleton rounded-full" />
        <div className="w-12 h-1.5 shimmer-skeleton rounded-full" />
      </div>
    </div>
  </div>
);

export const App: React.FC = () => {
  const { activeModule } = useTradeOS();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // Initialize Vanta.js 3D animated wave background
  useEffect(() => {
    const initVanta = () => {
      const VANTA = (window as any).VANTA;
      if (VANTA && VANTA.WAVES && vantaRef.current && !vantaEffect.current) {
        try {
          vantaEffect.current = VANTA.WAVES({
            el: vantaRef.current,
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x070a12,
            shininess: 15,
            waveHeight: 12,
            waveSpeed: 0.6,
            zoom: 0.85,
          });
        } catch (e) {
          console.warn('Vanta.js init skipped:', e);
        }
      }
    };

    // Vanta scripts are deferred, wait for them
    if ((window as any).VANTA) {
      initVanta();
    } else {
      const timer = setTimeout(initVanta, 1500);
      return () => clearTimeout(timer);
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case 'TERMINAL':
        return <TerminalModule />;
      case 'REPLAY':
        return <div className="p-4 h-full w-full"><ReplayModule /></div>;
      case 'NEWS':
        return <AINewsModule />;
      case 'LIVE_TV':
        return <div className="p-4"><LiveTVStream /></div>;
      case 'COPILOT':
        return <PreTradeCopilotModule />;
      case 'SL_INVESTIGATOR':
        return <SLInvestigatorModule />;
      case 'OPTION_CHAIN':
        return <OptionChainModule />;
      case 'JOURNAL':
        return <TradingJournalModule />;
      case 'CALENDAR':
        return <EconomicCalendarModule />;
      case 'DAILY_BRIEFING':
        return <DailyBriefingModule />;
      case 'AI_CHAT':
        return <AIChatModule />;
      case 'SETTINGS':
        return <SettingsModule />;
      default:
        return <TerminalModule />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#07090E] text-slate-100 font-sans antialiased selection:bg-trade-cyan selection:text-black overflow-hidden">
      {/* Vanta.js 3D Animated Wave Background */}
      <div 
        ref={vantaRef} 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{ opacity: 0.4 }}
      />
      
      {/* App Content (above Vanta background) */}
      <div className="relative z-10 h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            <div key={activeModule} className="module-enter min-h-full">
              <ErrorBoundary>
                <Suspense fallback={<ModuleLoader />}>
                  {renderModule()}
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>
        </div>
        <NewsToastPopup />
        <UpdatePopup />
        <RiskDisclaimerPopup />
      </div>
    </div>
  );
};

export default App;
