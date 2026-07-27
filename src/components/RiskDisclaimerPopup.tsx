import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Check } from 'lucide-react';

export const RiskDisclaimerPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('tradeos_risk_accepted');
    if (!hasAccepted) {
      // Small delay for dramatic effect after app loads
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      setScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    localStorage.setItem('tradeos_risk_accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xl" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="glass-panel max-w-2xl w-full border border-red-500/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" style={{ animation: 'moduleSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 0 60px rgba(239, 68, 68, 0.1), 0 20px 60px rgba(0,0,0,0.5)' }}>
        
        {/* Header */}
        <div className="p-6 border-b border-red-500/15 bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent flex items-center gap-4">
          <div className="p-3 bg-red-500/15 rounded-xl border border-red-500/20 neon-glow-bear">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">CRITICAL RISK DISCLAIMER</h2>
            <p className="text-red-400/80 font-medium text-sm">Please read carefully before using TradeOS AI</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div 
          className="p-6 overflow-y-auto space-y-6 text-slate-300 leading-relaxed custom-scrollbar"
          onScroll={handleScroll}
        >
          <div className="flex items-start gap-3 glass-panel p-4 rounded-xl border border-white/5">
            <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
            <p>
              <strong className="text-white block mb-1">Trading involves substantial risk of loss.</strong>
              TradeOS AI is an intelligence and analysis platform, NOT a registered financial advisor. The AI insights, technical indicators, and automated analysis provided by this platform are for educational and research purposes only.
            </p>
          </div>

          <p>
            You must be aware of the risks and be willing to accept them in order to invest in the financial markets. Don't trade with money you can't afford to lose.
          </p>

          <p>
            No representation is being made that any account will or is likely to achieve profits or losses similar to those discussed on this platform. The past performance of any trading system or methodology is not necessarily indicative of future results.
          </p>

          <h3 className="text-white font-bold text-lg mt-6">Assumption of Risk</h3>
          <p>
            By using TradeOS AI, you acknowledge that you are trading at your own risk. Do not trade blindly based on AI signals or news sentiment. We are not responsible for any financial losses you may incur. You are solely responsible for your own trading decisions.
          </p>
          
          <p className="text-sm text-slate-500 italic text-center mt-8 pb-4">
            Scroll to the bottom to accept these terms.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 glass-panel flex justify-end">
          <button
            onClick={handleAccept}
            disabled={!scrolledToBottom}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-display font-bold transition-all duration-300 ${
              scrolledToBottom 
                ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-lg shadow-red-500/25 cursor-pointer btn-premium' 
                : 'bg-dark-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {scrolledToBottom ? <Check className="w-5 h-5" /> : null}
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
