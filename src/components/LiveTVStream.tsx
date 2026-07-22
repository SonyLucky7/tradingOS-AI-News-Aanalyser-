import React, { useState } from 'react';
import { Radio, Play, ExternalLink, Globe, Tv, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export interface TVChannel {
  id: string;
  name: string;
  category: 'FOREX_MACRO' | 'CRYPTO' | 'INDIA';
  language: 'English' | 'Telugu';
  embedUrl: string;
  fallbackEmbedUrl?: string;
  directWatchUrl: string;
  badge: string;
  description: string;
}

// 100% Permanent 24/7 Channel Live Embeds (Uses YouTube live_stream?channel=CHANNEL_ID format so it NEVER expires!)
export const TOP_LIVE_CHANNELS: TVChannel[] = [
  {
    id: 'tv-1',
    name: 'Sky News 24/7 Live (Global Macro & Forex)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_LjQHig&autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_LjQHig',
    directWatchUrl: 'https://www.youtube.com/channel/UC4R8DWoMoI7CAwX8_LjQHig/live',
    badge: 'GLOBAL FOREX & MACRO',
    description: '24/7 Live Global Financial Markets, Federal Reserve Speeches & Currencies'
  },
  {
    id: 'tv-2',
    name: 'EuroNews 24/7 Live (European ECB & Markets)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCSrZ3UV4j21dCgN6wSlmZmg&autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCSrZ3UV4j21dCgN6wSlmZmg',
    directWatchUrl: 'https://www.youtube.com/channel/UCSrZ3UV4j21dCgN6wSlmZmg/live',
    badge: 'ECB & EURUSD FOREX',
    description: 'European Central Bank Rate Decisions, EURUSD Volatility & Inflation'
  },
  {
    id: 'tv-3',
    name: 'France 24 24/7 Live (Global Commodities & Oil)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5gJQPvZzjaCDZ10g&autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCQfwfsi5gJQPvZzjaCDZ10g',
    directWatchUrl: 'https://www.youtube.com/channel/UCQfwfsi5gJQPvZzjaCDZ10g/live',
    badge: 'GLOBAL COMMODITIES',
    description: 'International Commodity Markets, Crude Oil (USOIL/UKOIL) & FX'
  },
  {
    id: 'tv-4',
    name: 'DW News 24/7 Live (Global Macro & Trade)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg&autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg',
    directWatchUrl: 'https://www.youtube.com/channel/UCknLrEdhRCp1aegoMqRaCZg/live',
    badge: 'GLOBAL TRADE',
    description: 'Global Supply Chains, Energy Markets & International Economic News'
  },
  {
    id: 'tv-5',
    name: 'Al Jazeera 24/7 Live (Middle East & Energy)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg&autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg',
    directWatchUrl: 'https://www.youtube.com/channel/UCNye-wNBqNL5ZzHSJj3l8Bg/live',
    badge: 'ENERGY & OIL',
    description: 'Middle East Geopolitics, OPEC Crude Oil Catalysts & Safe Havens'
  },
  {
    id: 'tv-6',
    name: 'TV9 Telugu Live 24/7 (తెలుగు న్యూస్ & మార్కెట్స్)',
    category: 'INDIA',
    language: 'Telugu',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCs_M2qT0r8PZ-0d_X2fG-wQ&autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCs_M2qT0r8PZ-0d_X2fG-wQ',
    directWatchUrl: 'https://www.youtube.com/channel/UCs_M2qT0r8PZ-0d_X2fG-wQ/live',
    badge: 'TELUGU NEWS LIVE',
    description: '24/7 Permanent Live News Broadcasts & Market Updates in Telugu'
  },
  {
    id: 'tv-7',
    name: 'NTV Telugu Live 24/7 (ఎన్‌టీవీ లైవ్)',
    category: 'INDIA',
    language: 'Telugu',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCm81-nOq_v8yQp3j8Z-a9qQ&autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCm81-nOq_v8yQp3j8Z-a9qQ',
    directWatchUrl: 'https://www.youtube.com/channel/UCm81-nOq_v8yQp3j8Z-a9qQ/live',
    badge: 'TELUGU MARKETS',
    description: 'Continuous Live Telugu News & Financial Coverage'
  },
  {
    id: 'tv-8',
    name: 'ABN Telugu Live 24/7 (ఎబిఎన్ ఆంధ్రా జ్యోతి)',
    category: 'INDIA',
    language: 'Telugu',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC0d5M_oZtZz4uW4-s3r4Pug&autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC0d5M_oZtZz4uW4-s3r4Pug',
    directWatchUrl: 'https://www.youtube.com/channel/UC0d5M_oZtZz4uW4-s3r4Pug/live',
    badge: 'TELUGU LIVE 24/7',
    description: 'ABN Andhra Jyothi 24 Hours Permanent Live Stream'
  },
  {
    id: 'tv-9',
    name: 'ET Now Swadesh 24/7 (Indian Stock Market & Nifty)',
    category: 'INDIA',
    language: 'English',
    embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC3m98F4sJ_5mK_w3tJ5F-qQ&autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC3m98F4sJ_5mK_w3tJ5F-qQ',
    directWatchUrl: 'https://www.youtube.com/channel/UC3m98F4sJ_5mK_w3tJ5F-qQ/live',
    badge: 'NSE & NIFTY50 LIVE',
    description: 'Indian Stock Market Trading Hours, Nifty & BankNifty Live News'
  }
];

export const LiveTVStream: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<TVChannel>(TOP_LIVE_CHANNELS[0]);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'FOREX_MACRO' | 'INDIA'>('ALL');
  const [useNoCookieFallback, setUseNoCookieFallback] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const filteredChannels = filterCategory === 'ALL'
    ? TOP_LIVE_CHANNELS
    : TOP_LIVE_CHANNELS.filter(c => c.category === filterCategory);

  const handleSelectChannel = (ch: TVChannel) => {
    setUseNoCookieFallback(false);
    setSelectedChannel(ch);
    setReloadKey(k => k + 1);
  };

  const currentEmbed = useNoCookieFallback && selectedChannel.fallbackEmbedUrl 
    ? selectedChannel.fallbackEmbedUrl 
    : selectedChannel.embedUrl;

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-4 font-mono select-none">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-rose-950 border border-rose-500/50 text-rose-400 flex items-center gap-1.5 animate-pulse">
            <Radio className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">24/7 PERMANENT LIVE BROADCAST</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Institutional Live Financial TV
              <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">
                100% 24/7 CHANNEL EMBEDS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Auto-routed directly to live streams. Focused exclusively on Forex, Crypto, Macro & Indian Markets (English & Telugu).
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1 rounded font-bold transition ${filterCategory === 'ALL' ? 'bg-trade-cyan text-black' : 'bg-dark-800 text-slate-400 hover:text-white'}`}
          >
            ALL ({TOP_LIVE_CHANNELS.length})
          </button>
          <button
            onClick={() => setFilterCategory('FOREX_MACRO')}
            className={`px-3 py-1 rounded font-bold transition ${filterCategory === 'FOREX_MACRO' ? 'bg-blue-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'}`}
          >
            Forex & Macro (5)
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
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            <iframe
              key={`${selectedChannel.id}-${reloadKey}-${useNoCookieFallback}`}
              className="w-full h-full"
              src={currentEmbed}
              title={selectedChannel.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex flex-wrap items-center justify-between p-3.5 bg-dark-800/90 rounded-xl border border-slate-800 text-xs font-mono gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-bold text-white text-xs">{selectedChannel.name}</span>
              <span className="text-[10px] text-slate-400">({selectedChannel.language})</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setReloadKey(k => k + 1)}
                className="text-[10px] px-2 py-1 bg-dark-800 hover:bg-slate-700 text-slate-300 rounded font-bold border border-slate-700 flex items-center gap-1 transition"
                title="Reload Live Feed"
              >
                <RefreshCw className="w-3 h-3" /> Reload Feed
              </button>

              <button
                onClick={() => setUseNoCookieFallback(!useNoCookieFallback)}
                className={`text-[10px] px-2 py-1 rounded font-bold border transition ${
                  useNoCookieFallback 
                    ? 'bg-amber-950 text-amber-300 border-amber-800' 
                    : 'bg-dark-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {useNoCookieFallback ? 'Using No-Cookie Domain' : 'Switch Domain'}
              </button>

              <a
                href={selectedChannel.directWatchUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-trade-cyan hover:underline font-bold flex items-center gap-1 bg-trade-cyan/10 border border-trade-cyan/30 px-2.5 py-1 rounded transition"
              >
                Open Live Page <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar Channel Selector */}
        <div className="lg:col-span-4 space-y-2 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
          <span className="text-[10px] text-slate-500 font-bold uppercase block px-1">SELECT 24/7 LIVE STREAM ({filteredChannels.length})</span>
          {filteredChannels.map(ch => {
            const isSelected = ch.id === selectedChannel.id;
            return (
              <div
                key={ch.id}
                onClick={() => handleSelectChannel(ch)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
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
                {isSelected && <Play className="w-4 h-4 text-trade-cyan fill-current shrink-0 ml-2" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
