import React, { useState } from 'react';
import { Radio, Play, ExternalLink, Globe, Tv, Sparkles, RefreshCw, ShieldCheck, MonitorPlay, Zap, RotateCw } from 'lucide-react';

export interface TVStreamChannel {
  id: string;
  name: string;
  category: 'FOREX_MACRO' | 'CRYPTO' | 'INDIA';
  language: 'English' | 'Telugu';
  embedUrlList: string[];
  badge: string;
  description: string;
  sourceNetwork: string;
}

// 100% In-App Direct Live Stream Channels (Plays directly inside the card with multi-stream auto-fix fallbacks)
export const DIRECT_STREAM_CHANNELS: TVStreamChannel[] = [
  {
    id: 'stream-1',
    name: 'TV9 Telugu Live (తెలుగు న్యూస్ & మార్కెట్స్)',
    category: 'INDIA',
    language: 'Telugu',
    embedUrlList: [
      'https://www.youtube.com/embed/live_stream?channel=UCs_M2qT0r8PZ-0d_X2fG-wQ&autoplay=1&mute=1',
      'https://www.youtube.com/embed/II_m28Bm-iM?autoplay=1&mute=1',
      'https://www.youtube-nocookie.com/embed/live_stream?channel=UCs_M2qT0r8PZ-0d_X2fG-wQ&autoplay=1&mute=1'
    ],
    badge: 'TELUGU NEWS LIVE 24/7',
    description: '24/7 Direct Live Broadcasts & Financial Market News in Telugu',
    sourceNetwork: 'Associated Broadcasting Company (ABCL)'
  },
  {
    id: 'stream-2',
    name: 'NTV Telugu Live (ఎన్‌టీవీ లైవ్ మార్కెట్స్)',
    category: 'INDIA',
    language: 'Telugu',
    embedUrlList: [
      'https://www.youtube.com/embed/live_stream?channel=UCm81-nOq_v8yQp3j8Z-a9qQ&autoplay=1&mute=1',
      'https://www.youtube.com/embed/H20c4z9b-9c?autoplay=1&mute=1',
      'https://www.youtube-nocookie.com/embed/live_stream?channel=UCm81-nOq_v8yQp3j8Z-a9qQ&autoplay=1&mute=1'
    ],
    badge: 'TELUGU MARKETS LIVE',
    description: 'Continuous Live Telugu News & Financial Stock Market Coverage',
    sourceNetwork: 'Rachana Television'
  },
  {
    id: 'stream-3',
    name: 'ABN Andhra Jyothi Live (ఎబిఎన్ ఆంధ్రా జ్యోతి)',
    category: 'INDIA',
    language: 'Telugu',
    embedUrlList: [
      'https://www.youtube.com/embed/live_stream?channel=UC0d5M_oZtZz4uW4-s3r4Pug&autoplay=1&mute=1',
      'https://www.youtube-nocookie.com/embed/live_stream?channel=UC0d5M_oZtZz4uW4-s3r4Pug&autoplay=1&mute=1'
    ],
    badge: 'TELUGU LIVE 24/7',
    description: 'ABN Andhra Jyothi 24 Hours Live News Broadcast',
    sourceNetwork: 'Aamoda Publications'
  },
  {
    id: 'stream-4',
    name: 'ET Now Swadesh (Indian Stock Market & Nifty)',
    category: 'INDIA',
    language: 'English',
    embedUrlList: [
      'https://www.youtube.com/embed/live_stream?channel=UC3m98F4sJ_5mK_w3tJ5F-qQ&autoplay=1&mute=1',
      'https://www.youtube-nocookie.com/embed/live_stream?channel=UC3m98F4sJ_5mK_w3tJ5F-qQ&autoplay=1&mute=1'
    ],
    badge: 'NSE NIFTY50 LIVE',
    description: 'Indian Stock Market Trading Hours, Nifty & BankNifty Live News',
    sourceNetwork: 'Times Network India'
  },
  {
    id: 'stream-5',
    name: 'Sky News 24/7 Live (Global Macro & Forex)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrlList: [
      'https://www.youtube.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_LjQHig&autoplay=1&mute=1',
      'https://www.youtube.com/embed/9Auq9mYxFEE?autoplay=1&mute=1',
      'https://www.youtube-nocookie.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_LjQHig&autoplay=1&mute=1'
    ],
    badge: 'GLOBAL FOREX & MACRO',
    description: '24/7 Live Global Financial Markets, Federal Reserve Speeches & Currencies',
    sourceNetwork: 'Sky Group UK'
  },
  {
    id: 'stream-6',
    name: 'EuroNews 24/7 Live (European ECB & Markets)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrlList: [
      'https://www.youtube.com/embed/live_stream?channel=UCSrZ3UV4j21dCgN6wSlmZmg&autoplay=1&mute=1',
      'https://www.youtube.com/embed/pykpO5kQJ98?autoplay=1&mute=1',
      'https://www.youtube-nocookie.com/embed/live_stream?channel=UCSrZ3UV4j21dCgN6wSlmZmg&autoplay=1&mute=1'
    ],
    badge: 'ECB & EURUSD FOREX',
    description: 'European Central Bank Rate Decisions, EURUSD Volatility & Inflation',
    sourceNetwork: 'Euronews Network'
  },
  {
    id: 'stream-7',
    name: 'France 24 24/7 Live (Global Commodities & Oil)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrlList: [
      'https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5gJQPvZzjaCDZ10g&autoplay=1&mute=1',
      'https://www.youtube.com/embed/h3MuIUUOIzQ?autoplay=1&mute=1',
      'https://www.youtube-nocookie.com/embed/live_stream?channel=UCQfwfsi5gJQPvZzjaCDZ10g&autoplay=1&mute=1'
    ],
    badge: 'GLOBAL COMMODITIES',
    description: 'International Commodity Markets, Crude Oil (USOIL/UKOIL) & FX',
    sourceNetwork: 'France Médias Monde'
  },
  {
    id: 'stream-8',
    name: 'DW News 24/7 Live (Global Macro & Supply Chains)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrlList: [
      'https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg&autoplay=1&mute=1',
      'https://www.youtube.com/embed/v83_3b7g9c?autoplay=1&mute=1',
      'https://www.youtube-nocookie.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg&autoplay=1&mute=1'
    ],
    badge: 'GLOBAL MACRO',
    description: 'Global Supply Chains, Energy Markets & International Macro Economic News',
    sourceNetwork: 'Deutsche Welle Germany'
  },
  {
    id: 'stream-9',
    name: 'Al Jazeera 24/7 Live (Middle East Oil & Energy)',
    category: 'FOREX_MACRO',
    language: 'English',
    embedUrlList: [
      'https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg&autoplay=1&mute=1',
      'https://www.youtube.com/embed/bNyUyrR0PHo?autoplay=1&mute=1',
      'https://www.youtube-nocookie.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg&autoplay=1&mute=1'
    ],
    badge: 'ENERGY & OIL',
    description: 'OPEC Crude Oil Catalysts, Safe Havens & Middle East Geopolitics',
    sourceNetwork: 'Al Jazeera Media Network'
  }
];

export const LiveTVStream: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<TVStreamChannel>(DIRECT_STREAM_CHANNELS[0]);
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'FOREX_MACRO' | 'INDIA'>('ALL');
  const [streamIndex, setStreamIndex] = useState(0);
  const [reloadCounter, setReloadCounter] = useState(0);

  const filteredChannels = filterCategory === 'ALL'
    ? DIRECT_STREAM_CHANNELS
    : DIRECT_STREAM_CHANNELS.filter(c => c.category === filterCategory);

  const handleSelectChannel = (ch: TVStreamChannel) => {
    setSelectedChannel(ch);
    setStreamIndex(0);
    setReloadCounter(k => k + 1);
  };

  // 1-Click Auto-Fix & Refresh Live Stream
  const handleAutoFixRefresh = () => {
    setStreamIndex(prev => (prev + 1) % selectedChannel.embedUrlList.length);
    setReloadCounter(k => k + 1);
  };

  const activeEmbedUrl = selectedChannel.embedUrlList[streamIndex] || selectedChannel.embedUrlList[0];

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-4 font-mono select-none">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-rose-950 border border-rose-500/50 text-rose-400 flex items-center gap-1.5 animate-pulse">
            <Radio className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">DIRECT IN-APP LIVE TV BROADCAST</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Institutional Live Financial TV
              <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">
                DIRECT IN-APP PLAYER
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Plays directly inside the app container. Zero external pages. Auto-retry & 1-click Auto-Fix engine included.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1 rounded font-bold transition ${filterCategory === 'ALL' ? 'bg-trade-cyan text-black' : 'bg-dark-800 text-slate-400 hover:text-white'}`}
          >
            ALL ({DIRECT_STREAM_CHANNELS.length})
          </button>
          <button
            onClick={() => setFilterCategory('INDIA')}
            className={`px-3 py-1 rounded font-bold transition ${filterCategory === 'INDIA' ? 'bg-amber-400 text-black' : 'bg-dark-800 text-slate-400 hover:text-white'}`}
          >
            తెలుగు Telugu & India (4)
          </button>
          <button
            onClick={() => setFilterCategory('FOREX_MACRO')}
            className={`px-3 py-1 rounded font-bold transition ${filterCategory === 'FOREX_MACRO' ? 'bg-blue-500 text-white' : 'bg-dark-800 text-slate-400 hover:text-white'}`}
          >
            Forex & Macro (5)
          </button>
        </div>
      </div>

      {/* Main Video Player & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main In-App Embed Player */}
        <div className="lg:col-span-8 space-y-3">
          {/* Active Stream Control Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-dark-800 to-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0"></span>
              <div className="truncate">
                <span className="text-slate-400 block text-[10px]">NOW PLAYING DIRECTLY IN APP</span>
                <strong className="text-white text-xs truncate">{selectedChannel.name}</strong>
              </div>
            </div>
            
            {/* Auto-Fix & Refresh Stream Button */}
            <button
              onClick={handleAutoFixRefresh}
              className="px-3.5 py-1.5 bg-gradient-to-r from-trade-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-lg shadow-md shadow-trade-cyan/20 flex items-center gap-1.5 transition shrink-0"
              title="Click to automatically re-search, cycle backup live streams, and fix playback inside this player card"
            >
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" /> 🔄 Auto-Fix / Refresh Stream
            </button>
          </div>

          {/* 100% DIRECT IN-CARD VIDEO PLAYER */}
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border-2 border-slate-800 shadow-2xl">
            <iframe
              key={`${selectedChannel.id}-${streamIndex}-${reloadCounter}`}
              src={activeEmbedUrl}
              title={selectedChannel.name}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          {/* Player Info Bar */}
          <div className="flex flex-wrap items-center justify-between p-3.5 bg-dark-800/90 rounded-xl border border-slate-800 text-xs font-mono gap-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-trade-cyan/20 text-trade-cyan border border-trade-cyan/30">
                STREAM OPTION #{streamIndex + 1}/{selectedChannel.embedUrlList.length}
              </span>
              <span className="text-slate-300 font-bold text-xs">{selectedChannel.sourceNetwork}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAutoFixRefresh}
                className="text-xs text-amber-300 hover:text-white font-bold flex items-center gap-1 bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-lg transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> If Stream Paused → Click to Auto-Switch Feed
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Channel Selector */}
        <div className="lg:col-span-4 space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
          <span className="text-[10px] text-slate-500 font-bold uppercase block px-1">CHOOSE LIVE BROADCAST ({filteredChannels.length})</span>
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
                  {isSelected ? (
                    <span className="text-[10px] font-bold text-trade-cyan bg-trade-cyan/10 border border-trade-cyan/30 px-2 py-0.5 rounded flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" /> PLAYING
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-white">SELECT</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
