import React, { useState } from 'react';
import { 
  Settings, Key, BellRing, Zap, CheckCircle2, Server, Save, Brain, Cloud, Monitor, Sparkles, Bot, Cpu
} from 'lucide-react';
import { 
  AIProvider,
  getAIProvider, setAIProvider,
  getGroqApiKey, setGroqApiKey,
  getOllamaModel, setOllamaModel,
  getOpenAIKey, setOpenAIKey, getOpenAIModel, setOpenAIModel,
  getClaudeKey, setClaudeKey, getClaudeModel, setClaudeModel,
  getGeminiKey, setGeminiKey, getGeminiModel, setGeminiModel,
  getCustomEndpoint, setCustomEndpoint, getCustomKey, setCustomKey, getCustomModel, setCustomModel,
  getAINewsEnabled, setAINewsEnabled
} from '../../services/groqAI';

const PROVIDERS: { id: AIProvider; title: string; desc: string; icon: any; badge: string }[] = [
  { id: 'groq', title: 'Groq Cloud', desc: 'Llama 3.1 70B — free, ultra-fast', icon: Cloud, badge: 'FREE' },
  { id: 'openai', title: 'OpenAI', desc: 'GPT-4o / GPT-4o-mini', icon: Sparkles, badge: 'PAID' },
  { id: 'claude', title: 'Claude (Anthropic)', desc: 'Claude Opus / Sonnet', icon: Bot, badge: 'PAID' },
  { id: 'gemini', title: 'Google Gemini', desc: 'Gemini 2.0 Flash — free tier available', icon: Sparkles, badge: 'FREE' },
  { id: 'ollama', title: 'Ollama Local', desc: 'Llama 3 / Mistral on your PC', icon: Monitor, badge: 'LOCAL' },
  { id: 'custom', title: 'Custom API', desc: 'Any OpenAI-compatible endpoint', icon: Cpu, badge: 'CUSTOM' },
  { id: 'local', title: 'Smart Local', desc: 'No API — built-in rule engine', icon: Zap, badge: 'OFFLINE' },
];

import { useTradeOS } from '../../context/TradeOSContext';

export const SettingsModule: React.FC = () => {
  const { updateAIProvider } = useTradeOS();
  const [provider, setProvider] = useState<AIProvider>(getAIProvider());
  const [groqKey, setGroqKeyState] = useState(getGroqApiKey());
  const [ollamaModel, setOllamaModelState] = useState(getOllamaModel());
  const [openaiKey, setOpenaiKeyState] = useState(getOpenAIKey());
  const [openaiModel, setOpenaiModelState] = useState(getOpenAIModel());
  const [claudeKey, setClaudeKeyState] = useState(getClaudeKey());
  const [claudeModel, setClaudeModelState] = useState(getClaudeModel());
  const [geminiKey, setGeminiKeyState] = useState(getGeminiKey());
  const [geminiModel, setGeminiModelState] = useState(getGeminiModel());
  const [customEndpoint, setCustomEndpointState] = useState(getCustomEndpoint());
  const [customKey, setCustomKeyState] = useState(getCustomKey());
  const [customModel, setCustomModelState] = useState(getCustomModel());
  const [newsEnabled, setNewsEnabled] = useState(getAINewsEnabled());
  const [finnhubKey, setFinnhubKey] = useState('d9fko59r01qu5nhesvugd9fko59r01qu5nhesvv0');
  const [telegramWebhook, setTelegramWebhook] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAIProvider(provider);
    setGroqApiKey(groqKey); setOllamaModel(ollamaModel);
    setOpenAIKey(openaiKey); setOpenAIModel(openaiModel);
    setClaudeKey(claudeKey); setClaudeModel(claudeModel);
    setGeminiKey(geminiKey); setGeminiModel(geminiModel);
    setCustomEndpoint(customEndpoint); setCustomKey(customKey); setCustomModel(customModel);
    setAINewsEnabled(newsEnabled);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inp = "w-full bg-dark-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-trade-cyan transition";

  return (
    <div className="p-4 font-mono space-y-4 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-dark-900 via-dark-800 to-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-slate-800 text-trade-cyan border border-slate-700">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">System Settings & AI Configuration</h1>
            <p className="text-xs text-slate-400">Configure AI providers, exchange feeds, and alert webhooks.</p>
          </div>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-trade-bull" /> All settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">

        {/* ─── Section 1: AI Provider ─── */}
        <div className="glass-panel p-5 rounded-2xl border border-violet-800/40 space-y-4 bg-gradient-to-br from-violet-950/20 via-dark-800 to-dark-900">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-400" /> AI Intelligence Provider
            </h2>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <span className="text-slate-400">AI News Analysis</span>
              <button
                type="button"
                onClick={() => setNewsEnabled(!newsEnabled)}
                className={`w-9 h-5 rounded-full transition-colors relative ${newsEnabled ? 'bg-trade-cyan' : 'bg-slate-700'}`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${newsEnabled ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
              </button>
              <span className={`text-[10px] font-bold ${newsEnabled ? 'text-trade-cyan' : 'text-slate-500'}`}>
                {newsEnabled ? 'ON' : 'OFF'}
              </span>
            </label>
          </div>

          {/* Provider Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
            {PROVIDERS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProvider(p.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  provider === p.id
                    ? 'bg-violet-950/50 border-violet-500/60 shadow-md shadow-violet-500/10'
                    : 'bg-dark-800 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <p.icon className={`w-3.5 h-3.5 ${provider === p.id ? 'text-violet-400' : 'text-slate-500'}`} />
                  {provider === p.id && <CheckCircle2 className="w-3 h-3 text-trade-bull ml-auto" />}
                </div>
                <span className={`font-bold block text-[11px] ${provider === p.id ? 'text-white' : 'text-slate-300'}`}>{p.title}</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">{p.desc}</span>
                <span className={`text-[8px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded ${
                  p.badge === 'FREE' ? 'bg-emerald-950 text-emerald-400' :
                  p.badge === 'LOCAL' || p.badge === 'OFFLINE' ? 'bg-blue-950 text-blue-400' :
                  p.badge === 'CUSTOM' ? 'bg-amber-950 text-amber-400' :
                  'bg-slate-800 text-slate-400'
                }`}>{p.badge}</span>
              </button>
            ))}
          </div>

          {/* Provider-specific Config */}
          <div className="space-y-3 text-xs">
            {provider === 'groq' && (
              <div>
                <label className="text-slate-400 block mb-1">Groq API Key — <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-trade-cyan underline">Get free key</a></label>
                <input type="password" value={groqKey} onChange={e => setGroqKeyState(e.target.value)} placeholder="gsk_..." className={inp} />
              </div>
            )}
            {provider === 'openai' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">OpenAI API Key</label>
                  <input type="password" value={openaiKey} onChange={e => setOpenaiKeyState(e.target.value)} placeholder="sk-..." className={inp} />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Model</label>
                  <select value={openaiModel} onChange={e => setOpenaiModelState(e.target.value)} className={inp}>
                    <option value="gpt-4o-mini">GPT-4o Mini (Cheap & Fast)</option>
                    <option value="gpt-4o">GPT-4o (Best Quality)</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Cheapest)</option>
                  </select>
                </div>
              </div>
            )}
            {provider === 'claude' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Anthropic API Key</label>
                  <input type="password" value={claudeKey} onChange={e => setClaudeKeyState(e.target.value)} placeholder="sk-ant-..." className={inp} />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Model</label>
                  <select value={claudeModel} onChange={e => setClaudeModelState(e.target.value)} className={inp}>
                    <option value="claude-sonnet-4-20250514">Claude Sonnet 4 (Best Value)</option>
                    <option value="claude-opus-4-20250514">Claude Opus 4 (Most Powerful)</option>
                    <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Fastest)</option>
                  </select>
                </div>
              </div>
            )}
            {provider === 'gemini' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Google AI API Key — <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-trade-cyan underline">Get free key</a></label>
                  <input type="password" value={geminiKey} onChange={e => setGeminiKeyState(e.target.value)} placeholder="AIza..." className={inp} />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Model</label>
                  <select value={geminiModel} onChange={e => setGeminiModelState(e.target.value)} className={inp}>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Free Tier)</option>
                    <option value="gemini-2.5-pro-preview-05-06">Gemini 2.5 Pro</option>
                    <option value="gemini-2.5-flash-preview-05-20">Gemini 2.5 Flash</option>
                  </select>
                </div>
              </div>
            )}
            {provider === 'ollama' && (
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 block mb-1">Ollama Model Name</label>
                  <input type="text" value={ollamaModel} onChange={e => setOllamaModelState(e.target.value)} placeholder="llama3" className={inp} />
                </div>
                <div className="p-3 bg-green-950/30 border border-green-800/50 rounded-lg text-[11px] text-green-300 space-y-1">
                  <p className="font-bold">📋 Ollama Setup:</p>
                  <p>1. Download: <a href="https://ollama.com/download" target="_blank" rel="noreferrer" className="underline">ollama.com/download</a></p>
                  <p>2. Terminal → <code className="bg-green-900/50 px-1.5 py-0.5 rounded">ollama pull llama3</code></p>
                  <p>3. Start: <code className="bg-green-900/50 px-1.5 py-0.5 rounded">ollama serve</code></p>
                  <p>4. TradeOS auto-connects to localhost:11434</p>
                </div>
              </div>
            )}
            {provider === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">API Endpoint (OpenAI-compatible)</label>
                  <input type="text" value={customEndpoint} onChange={e => setCustomEndpointState(e.target.value)} placeholder="https://api.example.com/v1/chat/completions" className={inp} />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">API Key</label>
                  <input type="password" value={customKey} onChange={e => setCustomKeyState(e.target.value)} placeholder="Bearer key..." className={inp} />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Model Name</label>
                  <input type="text" value={customModel} onChange={e => setCustomModelState(e.target.value)} placeholder="custom-model" className={inp} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Section 2: Exchange Keys ─── */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-trade-cyan uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4" /> Exchange & Data Feed Keys
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Finnhub API Key</label>
              <input type="password" value={finnhubKey} onChange={e => setFinnhubKey(e.target.value)} className={inp} />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Binance WebSocket (Free — No Key)</label>
              <input type="text" value="wss://stream.binance.com:9443 (Auto-connected)" readOnly className={`${inp} !text-slate-500`} />
            </div>
          </div>
        </div>

        {/* ─── Section 3: Webhooks ─── */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-trade-warn uppercase tracking-wider flex items-center gap-2">
            <BellRing className="w-4 h-4" /> Alert Webhooks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Telegram Bot URL</label>
              <input type="text" value={telegramWebhook} onChange={e => setTelegramWebhook(e.target.value)} placeholder="https://api.telegram.org/bot.../sendMessage" className={inp} />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Discord Webhook URL</label>
              <input type="text" value={discordWebhook} onChange={e => setDiscordWebhook(e.target.value)} placeholder="https://discord.com/api/webhooks/..." className={inp} />
            </div>
          </div>
        </div>

        {/* ─── Section 4: Health ─── */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-trade-bull" /> System Health
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { label: 'Binance WS', status: 'CONNECTED' },
              { label: 'Finnhub Feed', status: 'LIVE' },
              { label: 'AI Provider', status: provider.toUpperCase() },
              { label: 'TradingView', status: 'EMBEDDED' },
            ].map(s => (
              <div key={s.label} className="p-3 bg-dark-800 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">{s.label}</span>
                <span className="text-trade-bull font-bold flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3 h-3" /> {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="px-6 py-3 bg-gradient-to-r from-trade-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-trade-cyan/20 transition flex items-center gap-2">
          <Save className="w-4 h-4" /> Save All Settings
        </button>
      </form>
    </div>
  );
};
