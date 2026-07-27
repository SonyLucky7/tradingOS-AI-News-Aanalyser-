import React, { useState, useEffect } from 'react';
import { useTradeOS } from '../../context/TradeOSContext';
import { FormattedAiText } from '../FormattedAiText';
import { 
  MessageSquareCode, 
  Send, 
  Bot, 
  User, 
  Zap, 
  Cpu, 
  Sparkles 
} from 'lucide-react';

export const AIChatModule: React.FC = () => {
  const { chatMessages, sendChatMessage } = useTradeOS();
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  useEffect(() => {
    const gsap = (window as any).gsap;
    if (gsap) {
      gsap.fromTo('.module-card', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out', clearProps: 'all' });
    }
  }, []);

  return (
    <div className="p-4 font-mono space-y-4 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="module-card glass-panel p-4 rounded-xl border border-trade-cyan/40 bg-gradient-to-r from-dark-900 via-dark-800 to-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-trade-cyan/20 border border-trade-cyan/40 text-trade-cyan">
            <MessageSquareCode className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold font-display text-white flex items-center gap-2">
              AI Command Center & Live Intelligence Co-Pilot
              <span className="text-[10px] bg-trade-cyan/20 text-trade-cyan border border-trade-cyan/40 px-2 py-0.5 rounded font-bold">
                13 AGENTS ACTIVE
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Ask any trade question ("Can I buy BTC now?", "NIFTY options bias"). AI evaluates real-time orderbook, macro news & whale streams.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="module-card glass-panel rounded-2xl border border-slate-800 flex flex-col h-[560px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatMessages.map(msg => {
            const isUser = msg.sender === 'USER';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-trade-cyan/20 border border-trade-cyan/40 text-trade-cyan flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`glass-panel max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-1.5 ${
                  isUser 
                    ? 'bg-trade-cyan/10 text-trade-cyan font-semibold rounded-tr-none shadow-md shadow-trade-cyan/10' 
                    : 'border border-slate-700/80 text-slate-100 rounded-tl-none shadow-lg'
                }`}>
                  <div className="flex items-center justify-between text-[10px] opacity-70 mb-1">
                    <span>{msg.agentName || (isUser ? 'You' : 'TradeOS Intelligence')}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <FormattedAiText text={msg.text} />
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800/80 bg-dark-900 flex items-center space-x-3">
          <input
            type="text"
            placeholder="Ask AI co-pilot: 'Can I buy BTC now?', 'What is the BankNifty PCR?'..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 glass-panel border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-trade-cyan font-mono"
          />
          <button
            type="submit"
            className="btn-premium px-5 py-2.5 bg-gradient-to-r from-trade-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-600 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-trade-cyan/20 transition flex items-center gap-1.5"
          >
            <span>Ask</span> <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
