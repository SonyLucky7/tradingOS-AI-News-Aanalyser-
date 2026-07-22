import React, { useState } from 'react';
import { Radio, Play, ExternalLink, Globe, Tv, Sparkles, RefreshCw, ShieldCheck, MonitorPlay, Zap } from 'lucide-react';

export interface WebTVChannel {
  id: string;
  name: string;
  category: 'FOREX_MACRO' | 'CRYPTO' | 'INDIA';
  language: 'English' | 'Telugu';
  officialWebStreamUrl: string;
  badge: string;
  description: string;
  sourceNetwork: string;
}

// 100% Non-YouTube Direct Official 24/7 Web TV Broadcast Portals
export const DIRECT_WEB_CHANNELS: WebTVChannel[] = [
  {
    id: 'web-1',
    name: 'Euronews 24/7 Live Web TV (ECB & EURUSD Forex)',
    category: 'FOREX_MACRO',
    language: 'English',
    officialWebStreamUrl: 'https://www.euronews.com/live',
    badge: 'ECB & EURUSD FOREX',
    description: '24/7 European Central Bank Rate Decisions, EURUSD Volatility & Global Markets',
    sourceNetwork: 'Euronews Official Network'
  },
  {
    id: 'web-2',
    name: 'France 24 24/7 Live Web TV (Global Commodities & Oil)',
    category: 'FOREX_MACRO',
    language: 'English',
    officialWebStreamUrl: 'https://www.france24.com/en/live',
    badge: 'GLOBAL COMMODITIES',
    description: 'International Commodity Markets, Crude Oil (USOIL/UKOIL) & Forex Trading',
    sourceNetwork: 'France Media Monde'
  },
  {
    id: 'web-3',
    name: 'DW News 24/7 Live Web TV (Global Macro & Supply Chains)',
    category: 'FOREX_MACRO',
    language: 'English',
    officialWebStreamUrl: 'https://www.dw.com/en/live-tv/s-100817',
    badge: 'GLOBAL MACRO',
    description: 'Global Supply Chains, Energy Markets & International Macro Economic News',
    sourceNetwork: 'Deutsche Welle Germany'
  },
  {
    id: 'web-4',
    name: 'Al Jazeera 24/7 Live Web TV (Middle East Oil & Energy)',
    category: 'FOREX_MACRO',
    language: 'English',
    officialWebStreamUrl: 'https://www.aljazeera.com/live',
    badge: 'ENERGY & OIL',
    description: 'OPEC Crude Oil Catalysts, Safe Havens & Middle East Geopolitics',
    sourceNetwork: 'Al Jazeera Media Network'
  },
  {
    id: 'web-5',
    name: 'TV9 Telugu 24/7 Live Web TV (తెలుగు న్యూస్ & మార్కెట్స్)',
    category: 'INDIA',
    language: 'Telugu',
    officialWebStreamUrl: 'https://tv9telugu.com/live-tv',
    badge: 'TELUGU NEWS LIVE 24/7',
    description: '24/7 Direct Live Broadcasts & Financial Market News in Telugu',
    sourceNetwork: 'Associated Broadcasting Company (ABCL)'
  },
  {
    id: 'web-6',
    name: 'NTV Telugu 24/7 Live Web TV (ఎన్‌టీవీ లైవ్ మార్కెట్స్)',
    category: 'INDIA',
    language: 'Telugu',
    officialWebStreamUrl: 'https://ntvtelugu.com/live',
    badge: 'TELUGU MARKETS LIVE',
    description: 'Continuous Live Telugu News & Financial Stock Market Coverage',
    sourceNetwork: 'Rachana Television'
  },
  {
    id: 'web-7',
    name: 'ABN Andhra Jyothi 24/7 Live Web TV (ఎబిఎన్ ఆంధ్రా జ్యోతి)',
    category: 'INDIA',
    language: 'Telugu',
    officialWebStreamUrl: 'https://www.andhrajyothy.com/livetv',
    badge: 'TELUGU LIVE 24/7',
    description: 'ABN Andhra Jyothi 24 Hours Official Web TV Portal',
    sourceNetwork: 'Aamoda Publications'
  },
  {
    id: 'web-8',
    name: 'ET Now Swadesh 24/7 Live Web TV (Indian Markets & Nifty)',
    category: 'INDIA',
    language: 'English',
    officialWebStreamUrl: 'https://www.etnowswadesh.com/live-tv',
    badge: 'NSE NIFTY50 LIVE',
    description: 'Indian Stock Market Trading Hours, Nifty & BankNifty Live News',
    sourceNetwork: 'Times Network India'
  }
];

export const LiveTVStream: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<WebTVChannel>(DIRECT_WEB_CHANNELS[0]);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'FOREX_MACRO' | 'INDIA'>('ALL');
  const [iframeKey, setIframeKey] = useState(0);

  const filteredChannels = filterCategory === 'ALL'
    ? DIRECT_WEB_CHANNELS
    : DIRECT_WEB_CHANNELS.filter(c => c.category === filterCategory);

  const handleSelectChannel = (ch: WebTVChannel) => {
    setSelectedChannel(ch);
    setIframeKey(k => k + 1);
  };

  const handleLaunchWebTV = (url: string) => {
    window.open(url, '_blank', 'width=1080,height=680,location=yes,toolbar=no,menubar=no');
  };

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-4 font-mono select-none">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-rose-950 border border-rose-500/50 text-rose-400 flex items-center gap-1.5 animate-pulse">
            <Radio className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">NON-YOUTUBE DIRECT 24/7 WEB TV</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Official 24/7 Live Financial News Networks
              <span className="text-[9px] bg-trade-cyan/20 text-trade-cyan border border-trade-cyan/40 px-1.5 py-0.5 rounded font-bold">
                DIRECT OFFICIAL PORTALS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              100% Non-YouTube Direct Live Web TV Streams for Forex, Commodities, Macro & Indian Markets (English & Telugu).
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1 rounded font-bold transition ${filterCategory === 'ALL' ? 'bg-trade-cyan text-black' : 'bg-dark-800 text-slate-400 hover:text-white'}`}
          >
            ALL ({DIRECT_WEB_CHANNELS.length})
          </button>
          <button
            onClick={() => setFilterCategory('FOREX_MACRO')}
            className={`px-3 py-1 rounded font-bold transition ${filterCategory === 'FOREX_MACRO' ? 'bg-blue-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'}`}
          >
            Forex & Macro (4)
          </button>
          <button
            onClick={() => setFilterCategory('INDIA')}
            className={`px-3 py-1 rounded font-bold transition ${filterCategory === 'INDIA' ? 'bg-amber-400 text-black' : 'bg-dark-800 text-slate-400 hover:text-white'}`}
          >
            తెలుగు Telugu & India (4)
          </button>
        </div>
      </div>

      {/* Main Video Player & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Embed Player */}
        <div className="lg:col-span-8 space-y-3">
          {/* Top Embedded Player Banner & Popout Launcher */}
          <div className="bg-gradient-to-r from-slate-900 via-dark-800 to-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <div>
                <span className="text-slate-400 block text-[10px]">ACTIVE NETWORK STREAM</span>
                <strong className="text-white text-xs">{selectedChannel.name}</strong>
              </div>
            </div>
            
            <button
              onClick={() => handleLaunchWebTV(selectedChannel.officialWebStreamUrl)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs rounded-lg shadow-lg shadow-rose-950/50 flex items-center gap-1.5 transition"
              title="Launch Official 24/7 Direct Live Web TV Window"
            >
              <MonitorPlay className="w-4 h-4" /> 🔴 Launch 24/7 Web TV Stream
            </button>
          </div>

          {/* Web TV Player Frame Container */}
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between p-6 bg-gradient-to-br from-[#090C14] via-[#0E1320] to-black">
            <div className="flex items-center justify-between text-xs">
              <span className="text-trade-cyan font-bold flex items-center gap-1.5 bg-trade-cyan/10 border border-trade-cyan/30 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-4 h-4" /> {selectedChannel.sourceNetwork}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                ● 24/7 LIVE STREAM
              </span>
            </div>

            <div className="my-auto text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-600/20 border border-rose-500/50 mx-auto flex items-center justify-center text-rose-400 animate-pulse">
                <Radio className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white max-w-md mx-auto leading-snug">
                {selectedChannel.name}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {selectedChannel.description}
              </p>
              <button
                onClick={() => handleLaunchWebTV(selectedChannel.officialWebStreamUrl)}
                className="px-5 py-2.5 bg-gradient-to-r from-trade-cyan via-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-xl shadow-trade-cyan/20 inline-flex items-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-current" /> Watch Official 24/7 Stream Now
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-3">
              <span>Language: <strong className="text-slate-300">{selectedChannel.language}</strong></span>
              <span>Category: <strong className="text-trade-cyan">{selectedChannel.badge}</strong></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between p-3.5 bg-dark-800/90 rounded-xl border border-slate-800 text-xs font-mono gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold text-white text-xs">{selectedChannel.name}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleLaunchWebTV(selectedChannel.officialWebStreamUrl)}
                className="text-xs text-trade-cyan hover:underline font-bold flex items-center gap-1 bg-trade-cyan/10 border border-trade-cyan/30 px-3 py-1.5 rounded-lg transition"
              >
                Open Official 24/7 Portal <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Channel Selector */}
        <div className="lg:col-span-4 space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
          <span className="text-[10px] text-slate-500 font-bold uppercase block px-1">SELECT 24/7 WEB TV NETWORK ({filteredChannels.length})</span>
          {filteredChannels.map(ch => {
            const isSelected = ch.id === selectedChannel.id;
            return (
              <div
                key={ch.id}
                onClick={() => handleSelectChannel(ch)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
                  isSelected
                    ? 'bg-slate-800 border-trade-cyan/60 text-white shadow-md shadow-trade-cyan/5'
                    : 'bg-dark-800/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-100 flex items-center space-x-1.5">
                    <span>{ch.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{ch.language} • {ch.description}</div>
                </div>
                <div className="flex items-center space-x-1 shrink-0 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchWebTV(ch.officialWebStreamUrl);
                    }}
                    className="p-1.5 text-slate-400 hover:text-trade-cyan hover:bg-slate-700 rounded transition"
                    title="Launch 24/7 Live Stream Web TV"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  {isSelected && <Play className="w-4 h-4 text-trade-cyan fill-current shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
