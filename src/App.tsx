import React from 'react';
import { useTradeOS } from './context/TradeOSContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TerminalModule } from './components/modules/TerminalModule';
import { AINewsModule } from './components/modules/AINewsModule';
import { PreTradeCopilotModule } from './components/modules/PreTradeCopilotModule';
import { SLInvestigatorModule } from './components/modules/SLInvestigatorModule';
import { OptionChainModule } from './components/modules/OptionChainModule';
import { TradingJournalModule } from './components/modules/TradingJournalModule';
import { EconomicCalendarModule } from './components/modules/EconomicCalendarModule';
import { DailyBriefingModule } from './components/modules/DailyBriefingModule';
import { AIChatModule } from './components/modules/AIChatModule';
import { SettingsModule } from './components/modules/SettingsModule';

import { NewsToastPopup } from './components/NewsToastPopup';

export const App: React.FC = () => {
  const { activeModule } = useTradeOS();

  const renderModule = () => {
    switch (activeModule) {
      case 'TERMINAL':
        return <TerminalModule />;
      case 'NEWS':
        return <AINewsModule />;
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
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 font-sans antialiased selection:bg-trade-cyan selection:text-black">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-56px)] pb-16 md:pb-0 bg-[#07090E] bg-gradient-to-br from-[#07090E] via-[#0B0E17] to-[#0E121E]">
          {renderModule()}
        </main>
      </div>
      <NewsToastPopup />
    </div>
  );
};

export default App;
