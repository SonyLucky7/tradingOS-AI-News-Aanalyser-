import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, FastForward, Activity, AlertCircle, ShoppingCart } from 'lucide-react';
import { ReplayChart, ReplayChartHandle } from '../ReplayChart';
import { fetchHistoricalData, ReplayTradingEngine, ReplayCandle, ReplayAccount } from '../../services/replayEngine';

export const ReplayModule: React.FC = () => {
  const [symbol, setSymbol] = useState('NIFTY50');
  const [timeframe, setTimeframe] = useState('15m');
  const [data, setData] = useState<ReplayCandle[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1 = 1 candle per second
  const [currentIdx, setCurrentIdx] = useState(50); // Start with 50 candles context
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);

  const [engine] = useState(() => new ReplayTradingEngine(10000));
  const [account, setAccount] = useState<ReplayAccount>(engine.getAccount());
  
  const chartRef = useRef<ReplayChartHandle>(null);
  const playInterval = useRef<NodeJS.Timeout | null>(null);

  const [orderQty, setOrderQty] = useState(1);

  // Sync account state
  useEffect(() => {
    const syncAccount = () => setAccount({ ...engine.getAccount() });
    syncAccount();
  }, [currentPrice, engine]);

  const loadHistoricalData = async () => {
    setIsLoading(true);
    setIsPlaying(false);
    if (playInterval.current) clearInterval(playInterval.current);
    
    // Fetch 1000 candles
    const fetched = await fetchHistoricalData(symbol, timeframe);
    setData(fetched);
    setCurrentIdx(50);
    
    if (fetched.length > 50) {
      setCurrentPrice(fetched[49].close);
      if (chartRef.current) {
        chartRef.current.resetChart(fetched.slice(0, 50));
      }
    }
    
    setIsLoading(false);
  };

  const handleTimeframeChange = async (newTimeframe: string) => {
    // 1. Remember the exact timestamp we are currently looking at
    const currentTimestamp = data.length > 0 && currentIdx > 0 ? data[currentIdx - 1].time : null;
    
    setTimeframe(newTimeframe);
    
    const wasPlaying = isPlaying;
    setIsPlaying(false);
    if (playInterval.current) clearInterval(playInterval.current);
    setIsLoading(true);
    
    // 2. Fetch new timeframe data
    const fetched = await fetchHistoricalData(symbol, newTimeframe);
    setData(fetched);
    
    // 3. Find the exact matching candle in the new timeframe
    let newIdx = 50; 
    if (currentTimestamp && fetched.length > 0) {
      const matchIdx = fetched.findIndex(c => c.time >= currentTimestamp);
      if (matchIdx !== -1) {
        newIdx = Math.max(matchIdx + 1, 50); // Ensure at least 50 context candles
      } else {
        newIdx = fetched.length; // If timestamp is past the end
      }
    }
    
    setCurrentIdx(newIdx);
    
    // 4. Update the chart seamlessly
    if (fetched.length > 50 && newIdx <= fetched.length) {
      setCurrentPrice(fetched[newIdx - 1].close);
      if (chartRef.current) {
        chartRef.current.resetChart(fetched.slice(0, newIdx));
      }
    }
    
    setIsLoading(false);
    
    // 5. Automatically resume playback if it was playing
    if (wasPlaying && newIdx < fetched.length) {
      setIsPlaying(true);
      const delay = 1000 / playbackSpeed;
      playInterval.current = setInterval(() => {
        setCurrentIdx(prev => {
          const next = prev + 1;
          if (next >= fetched.length) {
            clearInterval(playInterval.current!);
            setIsPlaying(false);
            return prev;
          }
          if (chartRef.current) chartRef.current.updateCandle(fetched[next]);
          setCurrentPrice(fetched[next].close);
          engine.updateEquity(fetched[next].close);
          return next;
        });
      }, delay);
    }
  };

  const togglePlayback = () => {
    if (!isPlaying && data.length > currentIdx) {
      setIsPlaying(true);
      const delay = 1000 / playbackSpeed;
      playInterval.current = setInterval(() => {
        setCurrentIdx(prev => {
          const next = prev + 1;
          if (next >= data.length) {
            clearInterval(playInterval.current!);
            setIsPlaying(false);
            return prev;
          }
          if (chartRef.current) chartRef.current.updateCandle(data[next]);
          setCurrentPrice(data[next].close);
          engine.updateEquity(data[next].close);
          return next;
        });
      }, delay);
    } else {
      setIsPlaying(false);
      if (playInterval.current) clearInterval(playInterval.current);
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (playInterval.current) clearInterval(playInterval.current);
    if (data.length > 50) {
      setCurrentIdx(50);
      setCurrentPrice(data[49].close);
      if (chartRef.current) {
        chartRef.current.resetChart(data.slice(0, 50));
      }
    }
  };

  const handleBuy = () => {
    if (currentPrice > 0) engine.executeMarketOrder(symbol, 'LONG', orderQty, currentPrice);
  };

  const handleSell = () => {
    if (currentPrice > 0) engine.executeMarketOrder(symbol, 'SHORT', orderQty, currentPrice);
  };

  const handleClose = (id: string) => {
    engine.closePosition(id, currentPrice);
  };

  return (
    <div className="flex h-full w-full bg-dark-900 text-white gap-4">
      
      {/* Main Chart Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-dark-800 rounded-xl border border-slate-800 overflow-hidden">
        
        {/* Replay Control Header */}
        <div className="bg-slate-900/50 p-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-trade-cyan/10 text-trade-cyan px-2 py-1 rounded text-sm font-bold flex items-center gap-2">
              <Activity className="w-4 h-4" /> Market Replay
            </div>
            
            <input 
              type="text" 
              value={symbol} 
              onChange={e => setSymbol(e.target.value.toUpperCase())}
              className="bg-dark-900 border border-slate-700 rounded px-2 py-1 w-24 text-sm"
              placeholder="NIFTY50 / EURUSD"
            />
            <select 
              value={timeframe} 
              onChange={e => handleTimeframeChange(e.target.value)}
              className="bg-dark-900 border border-slate-700 rounded px-2 py-1 text-sm"
            >
              <option value="1m">1m</option>
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
            </select>
            
            <button 
              onClick={loadHistoricalData}
              disabled={isLoading}
              className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm font-medium transition"
            >
              {isLoading ? 'Loading...' : 'Load History'}
            </button>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2 bg-dark-900 p-1.5 rounded-lg border border-slate-700">
            <button onClick={togglePlayback} disabled={data.length === 0} className={`p-2 rounded transition ${isPlaying ? 'bg-amber-500/20 text-amber-500' : 'hover:bg-slate-800 text-emerald-500'}`}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-emerald-500" />}
            </button>
            <button onClick={stopPlayback} disabled={data.length === 0} className="p-2 rounded hover:bg-slate-800 text-rose-500 transition">
              <Square className="w-4 h-4 fill-rose-500" />
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1"></div>
            <div className="flex items-center gap-2 px-2">
              <FastForward className="w-3.5 h-3.5 text-slate-400" />
              <input 
                type="range" 
                min="1" max="20" 
                value={playbackSpeed} 
                onChange={e => setPlaybackSpeed(Number(e.target.value))}
                className="w-24 accent-trade-cyan"
              />
              <span className="text-xs text-slate-400 w-6">{playbackSpeed}x</span>
            </div>
          </div>
        </div>

        {/* Chart View */}
        <div className="flex-1 relative">
          {data.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
              <Activity className="w-12 h-12 mb-3 opacity-20" />
              <p>Load history to start Replay Mode</p>
            </div>
          ) : (
            <ReplayChart ref={chartRef} data={data} currentIdx={currentIdx} />
          )}
        </div>
      </div>

      {/* Replay Trading Panel */}
      <div className="w-80 flex flex-col bg-dark-800 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-bold flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-trade-cyan" /> Replay Chart Trader</h3>
        </div>
        
        {/* Account Info */}
        <div className="p-4 bg-slate-900/50 border-b border-slate-800">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Replay Balance</span>
            <span className="font-mono">${account.balance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-300">Equity</span>
            <span className={`font-mono ${account.equity >= account.balance ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${account.equity.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Order Entry */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Current Price</span>
            <span className="font-mono font-bold text-white">{currentPrice > 0 ? currentPrice.toFixed(2) : '---'}</span>
          </div>
          
          <div>
            <label className="text-xs text-slate-400 block mb-1">Quantity</label>
            <input 
              type="number" 
              value={orderQty} 
              onChange={e => setOrderQty(Number(e.target.value))}
              className="w-full bg-dark-900 border border-slate-700 rounded px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleBuy} disabled={!isPlaying} className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2 rounded transition">
              BUY MKT
            </button>
            <button onClick={handleSell} disabled={!isPlaying} className="flex-1 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold py-2 rounded transition">
              SELL MKT
            </button>
          </div>
          {!isPlaying && <p className="text-[10px] text-amber-500/80 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Play replay to trade</p>}
        </div>

        {/* Open Positions */}
        <div className="flex-1 overflow-y-auto p-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Open Positions ({account.positions.length})</h4>
          <div className="space-y-2">
            {account.positions.length === 0 ? (
              <p className="text-xs text-slate-600">No open positions.</p>
            ) : (
              account.positions.map(pos => (
                <div key={pos.id} className="bg-dark-900 border border-slate-700 p-2.5 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-bold ${pos.type === 'LONG' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {pos.type} {pos.quantity} {pos.symbol}
                    </span>
                    <button onClick={() => handleClose(pos.id)} className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded text-white transition">
                      Close
                    </button>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Entry: {pos.entryPrice.toFixed(2)}</span>
                    <span className={pos.pnl! >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {pos.pnl! > 0 ? '+' : ''}{pos.pnl?.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};
