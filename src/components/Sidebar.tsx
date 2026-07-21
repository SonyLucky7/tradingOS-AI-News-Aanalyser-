import React from 'react';
import { useTradeOS } from '../context/TradeOSContext';
import { 
  LayoutDashboard, 
  Newspaper, 
  Bot, 
  SearchX, 
  LineChart, 
  BookOpen, 
  CalendarDays, 
  FileText, 
  MessageSquareCode, 
  Settings 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule } = useTradeOS();

  const navItems = [
    { id: 'TERMINAL', label: 'Terminal Radar', icon: LayoutDashboard, badge: null },
    { id: 'NEWS', label: 'AI News Stream', icon: Newspaper, badge: '98' },
    { id: 'COPILOT', label: 'Pre-Trade Co-Pilot', icon: Bot, badge: 'AI' },
    { id: 'SL_INVESTIGATOR', label: 'SL Investigator', icon: SearchX, badge: 'NEW' },
    { id: 'OPTION_CHAIN', label: 'Option Chain & FII', icon: LineChart, badge: 'NSE' },
    { id: 'JOURNAL', label: 'Trading Journal', icon: BookOpen, badge: null },
    { id: 'CALENDAR', label: 'Economic Calendar', icon: CalendarDays, badge: '14m' },
    { id: 'DAILY_BRIEFING', label: 'Daily / EOD Briefing', icon: FileText, badge: null },
    { id: 'AI_CHAT', label: 'AI Command Center', icon: MessageSquareCode, badge: 'LIVE' },
    { id: 'SETTINGS', label: 'Settings & API Keys', icon: Settings, badge: null },
  ];

  // Mobile Bottom Bar Primary Shortcuts
  const mobileBarItems = [
    { id: 'TERMINAL', label: 'Terminal', icon: LayoutDashboard },
    { id: 'NEWS', label: 'News', icon: Newspaper },
    { id: 'COPILOT', label: 'Co-Pilot', icon: Bot },
    { id: 'OPTION_CHAIN', label: 'Chain', icon: LineChart },
    { id: 'AI_CHAT', label: 'AI Chat', icon: MessageSquareCode },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar (Hidden on Mobile <768px) */}
      <aside className="hidden md:flex w-16 md:w-64 bg-[#090C14] border-r border-slate-800/80 flex-col justify-between shrink-0 select-none min-h-[calc(100vh-56px)]">
        <div className="py-3 px-2 md:px-3 space-y-1 font-mono">
          <div className="px-3 py-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider hidden md:block">
            Intelligence Modules
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive 
                    ? 'bg-gradient-to-r from-trade-cyan/20 to-trade-accent/20 border border-trade-cyan/40 text-trade-cyan shadow-lg shadow-trade-cyan/5 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-trade-cyan' : 'text-slate-400'}`} />
                  <span className="hidden md:inline truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`hidden md:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    item.badge === 'CRITICAL' || item.badge === '14m'
                      ? 'bg-rose-950 border border-rose-600/50 text-rose-400'
                      : item.badge === 'AI' || item.badge === 'LIVE'
                      ? 'bg-trade-cyan/20 text-trade-cyan border border-trade-cyan/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-800/80 hidden md:block font-mono text-[10px] text-slate-500">
          <div className="flex items-center justify-between mb-1">
            <span>Security Status</span>
            <span className="text-trade-bull">ENCRYPTED</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="bg-trade-bull h-full w-full"></div>
          </div>
          <p className="mt-2 text-slate-600">Bloomberg + TradingView Engine</p>
        </div>
      </aside>

      {/* Mobile Fixed Bottom Navigation Bar (Visible only on <768px screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090C14]/95 backdrop-blur-md border-t border-slate-800/90 flex justify-around items-center h-14 px-1 font-mono">
        {mobileBarItems.map(item => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition ${
                isActive ? 'text-trade-cyan font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-trade-cyan scale-110' : 'text-slate-400'}`} />
              <span className="text-[9px] truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
