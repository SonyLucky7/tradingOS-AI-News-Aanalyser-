import React, { Suspense } from 'react';
import { useTradeOS } from './context/TradeOSContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TerminalModule } from './components/modules/TerminalModule';
import { NewsToastPopup } from './components/NewsToastPopup';
import { UpdatePopup } from './components/UpdatePopup';
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

// Premium loading skeleton for lazy loaded modules
const ModuleLoader = () => (
  <div className="w-full h-full flex flex-col items-center justify-center min-h-[500px]">
    <div className="bg-dark-800 p-8 rounded-2xl border border-slate-800 flex flex-col items-center shadow-xl">
      <Loader2 className="w-10 h-10 text-trade-cyan animate-spin mb-4" />
      <h3 className="text-white font-bold tracking-wide">Loading Intelligence Module...</h3>
      <p className="text-xs text-slate-500 mt-2">Initializing AI Core</p>
    </div>
  </div>
);

export const App: React.FC = () => {
  const { activeModule } = useTradeOS();

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
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 bg-[#07090E] bg-gradient-to-br from-[#07090E] via-[#0B0E17] to-[#0E121E]">
          <div key={activeModule} className="module-enter min-h-full">
            <Suspense fallback={<ModuleLoader />}>
              {renderModule()}
            </Suspense>
          </div>
        </main>
      </div>
      <NewsToastPopup />
      <UpdatePopup />
    </div>
  );
};

export default App;
