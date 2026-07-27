import React, { useEffect, useRef } from 'react';
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
  Settings,
  Tv,
  Github,
  MessageCircle,
  History,
  Globe
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule } = useTradeOS();
  const navListRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'TERMINAL', label: 'Terminal Radar', icon: LayoutDashboard, badge: null },
    { id: 'NEWS', label: 'AI News Stream', icon: Newspaper, badge: '98' },
    { id: 'LIVE_TV', label: 'Live TV Broadcasts', icon: Tv, badge: 'LIVE' },
    { id: 'COPILOT', label: 'Pre-Trade Co-Pilot', icon: Bot, badge: 'AI' },
    { id: 'SL_INVESTIGATOR', label: 'SL Investigator', icon: SearchX, badge: 'NEW' },
    { id: 'OPTION_CHAIN', label: 'Option Chain & FII', icon: LineChart, badge: 'NSE' },
    { id: 'JOURNAL', label: 'Trading Journal', icon: BookOpen, badge: null },
    { id: 'CALENDAR', label: 'Economic Calendar', icon: CalendarDays, badge: '14m' },
    { id: 'DAILY_BRIEFING', label: 'Daily / EOD Briefing', icon: FileText, badge: null },
    { id: 'AI_CHAT', label: 'AI Command Center', icon: MessageSquareCode, badge: 'LIVE' },
    { id: 'GLOBAL_MAP', label: 'Global Market Map', icon: Globe, badge: null },
    { id: 'SETTINGS', label: 'Settings & API Keys', icon: Settings, badge: null },
  ];

  // Mobile Bottom Bar Primary Shortcuts (11 Full Intelligence Modules)
  const allMobileItems = [
    { id: 'TERMINAL', label: 'Terminal', icon: LayoutDashboard },
    { id: 'NEWS', label: 'News', icon: Newspaper },
    { id: 'LIVE_TV', label: 'Live TV', icon: Tv },
    { id: 'COPILOT', label: 'Co-Pilot', icon: Bot },
    { id: 'SL_INVESTIGATOR', label: 'SL Check', icon: SearchX },
    { id: 'OPTION_CHAIN', label: 'Chain', icon: LineChart },
    { id: 'JOURNAL', label: 'Journal', icon: BookOpen },
    { id: 'CALENDAR', label: 'Calendar', icon: CalendarDays },
    { id: 'DAILY_BRIEFING', label: 'Briefing', icon: FileText },
    { id: 'AI_CHAT', label: 'AI Chat', icon: MessageSquareCode },
    { id: 'GLOBAL_MAP', label: 'Map', icon: Globe },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  // GSAP staggered entrance animation
  useEffect(() => {
    const gsap = (window as any).gsap;
    if (gsap && navListRef.current) {
      const items = navListRef.current.querySelectorAll('.nav-item');
      gsap.from(items, {
        x: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: 'power2.out',
        delay: 0.2,
      });
    }
  }, []);

  return (
    <>
      {/* Desktop & Tablet Sidebar (Hidden on Mobile <768px) */}
      <aside className="hidden md:flex w-16 md:w-64 glass-panel border-r border-slate-800/40 flex-col justify-between shrink-0 select-none min-h-[calc(100vh-56px)]">
        <div ref={navListRef} className="py-3 px-2 md:px-3 space-y-0.5 font-mono">
          <div className="px-3 py-2 text-[10px] text-slate-500 font-display font-bold uppercase tracking-widest hidden md:block">
            Intelligence Modules
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`nav-item w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-trade-cyan/15 to-trade-accent/10 border border-trade-cyan/30 text-trade-cyan font-semibold neon-glow-cyan' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-trade-cyan rounded-r-full shadow-lg shadow-trade-cyan/40" />
                )}
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 shrink-0 transition-all duration-200 group-hover:scale-110 ${
                    isActive ? 'text-trade-cyan drop-shadow-[0_0_6px_rgba(0,229,255,0.5)]' : 'text-slate-500 group-hover:text-slate-300'
                  }`} />
                  <span className="hidden md:inline truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`hidden md:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all duration-200 ${
                    item.badge === 'CRITICAL' || item.badge === '14m'
                      ? 'bg-rose-950/80 border border-rose-600/40 text-rose-400'
                      : item.badge === 'AI' || item.badge === 'LIVE'
                      ? 'bg-trade-cyan/10 text-trade-cyan border border-trade-cyan/20'
                      : item.badge === 'NEW'
                      ? 'bg-trade-accent/15 text-purple-300 border border-trade-accent/30'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-800/40 hidden md:block font-mono text-[10px] text-slate-500">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-slate-600">Security Status</span>
            <span className="text-trade-bull font-semibold tracking-wide">ENCRYPTED</span>
          </div>
          <div className="w-full bg-slate-800/50 h-1 rounded-full overflow-hidden mb-3">
            <div className="bg-gradient-to-r from-trade-bull to-trade-cyan h-full w-full rounded-full"></div>
          </div>
          <div className="space-y-1.5 text-slate-600">
            <a 
              href="https://discord.com/users/karmaa_07" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between hover:text-slate-300 transition-colors duration-200 group py-0.5"
            >
              <span className="flex items-center gap-1.5"><MessageCircle className="w-3 h-3 text-slate-600 group-hover:text-trade-cyan transition-colors" /> Discord</span>
              <span className="text-trade-cyan/70 group-hover:text-trade-cyan transition-colors">karmaa_07</span>
            </a>
            <a 
              href="https://github.com/SonyLucky7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between hover:text-slate-300 transition-colors duration-200 group py-0.5"
            >
              <span className="flex items-center gap-1.5"><Github className="w-3 h-3 text-slate-600 group-hover:text-trade-cyan transition-colors" /> GitHub</span>
              <span className="text-trade-cyan/70 group-hover:text-trade-cyan transition-colors">SonyLucky7</span>
            </a>
            <div className="pt-2 mt-1 border-t border-slate-800/40">
              <p className="text-slate-600">Bloomberg + TradingView Engine</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Fixed Bottom Navigation Bar (Visible only on <768px screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel backdrop-blur-2xl border-t border-slate-800/40 flex items-center h-14 px-2 overflow-x-auto no-scrollbar space-x-1 font-mono">
        {allMobileItems.map(item => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`flex flex-col items-center justify-center shrink-0 px-3 py-1 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-trade-cyan/10 text-trade-cyan border border-trade-cyan/30 font-bold neon-glow-cyan' 
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 transition-all duration-200 ${
                isActive ? 'text-trade-cyan scale-110 drop-shadow-[0_0_4px_rgba(0,229,255,0.5)]' : 'text-slate-400'
              }`} />
              <span className="text-[9.5px] whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
