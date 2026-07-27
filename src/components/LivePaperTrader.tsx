import React, { useState, useEffect } from 'react';
import { liveEngine, LiveAccount } from '../services/liveTradingEngine';
import { ShoppingCart } from 'lucide-react';
import { useTradeOS } from '../context/TradeOSContext';

interface LivePaperTraderProps {
  symbol: string;
}

export const LivePaperTrader: React.FC<LivePaperTraderProps> = ({ symbol }) => {
  const { tickers } = useTradeOS();
  const [account, setAccount] = useState<LiveAccount>({ ...liveEngine.getAccount() });
  const [orderQty, setOrderQty] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const currentPrice = tickers.find(t => t.symbol === symbol)?.price || 0;

  // Update engine equity when live price changes
  useEffect(() => {
    if (currentPrice > 0) {
      liveEngine.updateEquity(currentPrice);
      setAccount({ ...liveEngine.getAccount() });
    }
  }, [currentPrice]);

  const handleBuy = () => {
    if (currentPrice > 0) {
      try {
        liveEngine.openPosition(symbol, 'LONG', currentPrice, orderQty);
        setAccount({ ...liveEngine.getAccount() });
        setError('');
      } catch (e: any) {
        setError(e.message);
      }
    }
  };

  const handleSell = () => {
    if (currentPrice > 0) {
      try {
        liveEngine.openPosition(symbol, 'SHORT', currentPrice, orderQty);
        setAccount({ ...liveEngine.getAccount() });
        setError('');
      } catch (e: any) {
        setError(e.message);
      }
    }
  };

  const closePosition = (id: string) => {
    if (currentPrice > 0) {
      liveEngine.closePosition(id, currentPrice);
      setAccount({ ...liveEngine.getAccount() });
    }
  };

  return (
    <div className="w-full md:w-64 lg:w-72 glass-panel border-l border-slate-800/40 flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/40 flex items-center space-x-2 terminal-header">
        <ShoppingCart className="w-4 h-4 text-trade-cyan drop-shadow-[0_0_4px_rgba(0,229,255,0.5)]" />
        <h3 className="font-bold text-white text-sm tracking-wide font-display">Live Paper Trading</h3>
      </div>

      {/* Account Info */}
      <div className="p-3 border-b border-slate-800/40 space-y-1.5 font-mono text-[11px]">
        <div className="flex justify-between text-slate-300">
          <span>Balance</span>
          <span className="font-bold text-white tabular-nums">${account.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Equity</span>
          <span className={`font-bold tabular-nums ${account.equity >= account.balance ? 'neon-text-bull' : 'neon-text-bear'}`}>
            ${account.equity.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </span>
        </div>
        {error && <div className="text-trade-bear mt-1 text-[10px]">{error}</div>}
      </div>

      {/* Order Entry */}
      <div className="p-3 border-b border-slate-800/90">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
          <span>Price</span>
          <span className="text-white font-bold">{currentPrice > 0 ? currentPrice : '---'}</span>
        </div>
        <div className="mb-3">
          <label className="text-[10px] text-slate-500 font-mono mb-1 block uppercase">Qty</label>
          <input 
            type="number" 
            value={orderQty} 
            onChange={e => setOrderQty(Math.max(0.1, Number(e.target.value)))}
            className="w-full bg-dark-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-trade-cyan transition-colors"
            min="0.1"
            step="0.1"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={handleBuy}
            disabled={currentPrice === 0}
            className="bg-trade-bull/15 hover:bg-trade-bull/25 text-trade-bull border border-trade-bull/30 py-2 rounded-lg font-bold text-xs btn-premium disabled:opacity-50 disabled:cursor-not-allowed neon-glow-bull"
          >
            BUY
          </button>
          <button 
            onClick={handleSell}
            disabled={currentPrice === 0}
            className="bg-trade-bear/15 hover:bg-trade-bear/25 text-trade-bear border border-trade-bear/30 py-2 rounded-lg font-bold text-xs btn-premium disabled:opacity-50 disabled:cursor-not-allowed neon-glow-bear"
          >
            SELL
          </button>
        </div>
      </div>

      {/* Open Positions */}
      <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
        <h4 className="text-[10px] text-slate-500 font-mono uppercase mb-2">Positions ({account.positions.length})</h4>
        {account.positions.length === 0 ? (
          <div className="text-[10px] text-slate-600 font-mono text-center mt-4">No open positions.</div>
        ) : (
          <div className="space-y-2">
            {account.positions.map(pos => (
              <div key={pos.id} className="glass-panel border border-slate-800/40 rounded-xl p-2.5 text-[10px] font-mono glass-card-hover">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${pos.type === 'LONG' ? 'bg-trade-bull' : 'bg-trade-bear'}`}></span>
                    {pos.symbol}
                  </span>
                  <button onClick={() => closePosition(pos.id)} className="text-slate-500 hover:text-white transition">✕</button>
                </div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>{pos.type} {pos.quantity}</span>
                  <span>@ {pos.entryPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PnL</span>
                  <span className={`font-bold tabular-nums ${pos.pnl && pos.pnl >= 0 ? 'neon-text-bull' : 'neon-text-bear'}`}>
                    ${(pos.pnl || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
