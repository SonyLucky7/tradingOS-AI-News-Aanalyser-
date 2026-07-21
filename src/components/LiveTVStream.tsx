import React, { useState } from 'react';
import { Radio, Play, ExternalLink, Globe, Tv, Sparkles } from 'lucide-react';

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

export const TOP_LIVE_CHANNELS: TVChannel[] = [
  {
    id: 'tv-1',
    name: 'Sky News Live (Global Business & Forex)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrl: 'https://www.youtube.com/embed/9Auq9mYxFEE?autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_LjQHig',
    directWatchUrl: 'https://www.youtube.com/watch?v=9Auq9mYxFEE',
    badge: 'GLOBAL FOREX & MACRO',
    description: '24/7 Global Financial Markets, Federal Reserve & Currency News'
  },
  {
    id: 'tv-2',
    name: 'EuroNews English Live (European ECB & Markets)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrl: 'https://www.youtube.com/embed/pykpO5kQJ98?autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCSrZ3UV4j21dCgN6wSlmZmg',
    directWatchUrl: 'https://www.youtube.com/watch?v=pykpO5kQJ98',
    badge: 'ECB & EURUSD FOREX',
    description: 'European Central Bank Rate Decisions, EURUSD & Inflation'
  },
  {
    id: 'tv-3',
    name: 'France 24 English Live (Global Economy)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrl: 'https://www.youtube.com/embed/h3MuIUUOIzQ?autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5gJQPvZzjaCDZ10g',
    directWatchUrl: 'https://www.youtube.com/watch?v=h3MuIUUOIzQ',
    badge: 'GLOBAL COMMODITIES',
    description: 'International Commodity Markets, Crude Oil & Forex Trading'
  },
  {
    id: 'tv-4',
    name: 'DW News Live (Global Macro & Trade)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrl: 'https://www.youtube.com/embed/v83_3b7g9c?autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg',
    directWatchUrl: 'https://www.youtube.com/watch?v=v83_3b7g9c',
    badge: 'GLOBAL TRADE',
    description: 'Global Supply Chains, Commodities & International Trade'
  },
  {
    id: 'tv-5',
    name: 'TV9 Telugu Live (తెలుగు న్యూస్ & మార్కెట్స్)',
    category: 'INDIA',
    language: 'Telugu',
    embedUrl: 'https://www.youtube.com/embed/II_m28Bm-iM?autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCs_M2qT0r8PZ-0d_X2fG-wQ',
    directWatchUrl: 'https://www.youtube.com/watch?v=II_m28Bm-iM',
    badge: 'TELUGU NEWS LIVE',
    description: '24/7 Top Live News Broadcasts & Market Updates in Telugu'
  },
  {
    id: 'tv-6',
    name: 'NTV Telugu Live (ఎన్‌టీవీ లైవ్)',
    category: 'INDIA',
    language: 'Telugu',
    embedUrl: 'https://www.youtube.com/embed/H20c4z9b-9c?autoplay=1&mute=1',
    fallbackEmbedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCm81-nOq_v8yQp3j8Z-a9qQ',
    directWatchUrl: 'https://www.youtube.com/watch?v=H20c4z9b-9c',
    badge: 'TELUGU MARKETS',
    description: 'Live Telugu News & Business Updates'
  }
];

export const LiveTVStream: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<TVChannel>(TOP_LIVE_CHANNELS[0]);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'FOREX_MACRO' | 'INDIA'>('ALL');
  const [useFallback, setUseFallback] = useState(false);

  const filteredChannels = filterCategory === 'ALL'
    ? TOP_LIVE_CHANNELS
    : TOP_LIVE_CHANNELS.filter(c => c.category === filterCategory);

  const handleSelectChannel = (ch: TVChannel) => {
    setUseFallback(false);
    setSelectedChannel(ch);
  };

  const currentEmbed = useFallback && selectedChannel.fallbackEmbedUrl 
    ? selectedChannel.fallbackEmbedUrl 
    : selectedChannel.embedUrl;

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-4 font-mono">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-rose-950 border border-rose-500/50 text-rose-400 flex items-center gap-1.5 animate-pulse">
            <Radio className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">INSTITUTIONAL LIVE BROADCAST</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Institutional Live News Streams
              <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">
                100% DIRECT EMBEDS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Watch Forex, European ECB, Global Markets & Telugu Live streams without VLC or player errors.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-2.5 py-1 rounded font-bold transition ${filterCategory === 'ALL' ? 'bg-trade-cyan text-black' : 'bg-dark-800 text-slate-400'}`}
          >
            ALL (6)
          </button>
          <button
            onClick={() => setFilterCategory('FOREX_MACRO')}
            className={`px-2.5 py-1 rounded font-bold transition ${filterCategory === 'FOREX_MACRO' ? 'bg-blue-500 text-white' : 'bg-dark-800 text-slate-400'}`}
          >
            Forex & Macro (4)
          </button>
          <button
            onClick={() => setFilterCategory('INDIA')}
            className={`px-2.5 py-1 rounded font-bold transition ${filterCategory === 'INDIA' ? 'bg-amber-400 text-black' : 'bg-dark-800 text-slate-400'}`}
          >
            తెలుగు Telugu (2)
          </button>
        </div>
      </div>

      {/* Main Video Player & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Embed Player */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            <iframe
              className="w-full h-full"
              src={currentEmbed}
              title={selectedChannel.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex flex-wrap items-center justify-between p-3 bg-dark-800/90 rounded-xl border border-slate-800 text-xs font-mono gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="font-bold text-white">{selectedChannel.name}</span>
              <span className="text-[10px] text-slate-400">({selectedChannel.language})</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedChannel.fallbackEmbedUrl && (
                <button
                  onClick={() => setUseFallback(!useFallback)}
                  className={`text-[10px] px-2 py-1 rounded font-bold border transition ${
                    useFallback 
                      ? 'bg-amber-950 text-amber-300 border-amber-800' 
                      : 'bg-dark-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {useFallback ? 'Using Backup Stream' : 'Switch to Alt Stream'}
                </button>
              )}
              <a
                href={selectedChannel.directWatchUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-trade-cyan hover:underline font-bold flex items-center gap-1 bg-trade-cyan/10 border border-trade-cyan/30 px-2 py-1 rounded"
              >
                Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar Channel Selector */}
        <div className="lg:col-span-4 space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
          <span className="text-[10px] text-slate-500 font-bold uppercase block px-1">SELECT LIVE BROADCAST</span>
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
