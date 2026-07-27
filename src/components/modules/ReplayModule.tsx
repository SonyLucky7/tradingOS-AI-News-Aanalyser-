import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Square, FastForward, Activity, AlertCircle, ShoppingCart, Loader2, Palette } from 'lucide-react';
import { ReplayChart, ReplayChartHandle, MONOCHROME_THEME, CLASSIC_THEME, NEON_THEME, CandleColorTheme } from '../ReplayChart';
import { fetchHistoricalData, ReplayTradingEngine, ReplayCandle, ReplayAccount } from '../../services/replayEngine';
import { useTradeOS } from '../../context/TradeOSContext';

interface ReplayModuleProps {
  defaultSymbol?: string;
}

export const ReplayModule: React.FC<ReplayModuleProps> = ({ defaultSymbol = 'NIFTY50' }) => {
  const { tickers } = useTradeOS();
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [timeframe, setTimeframe] = useState('15m');
  const [colorTheme, setColorTheme] = useState<'MONOCHROME' | 'CLASSIC' | 'NEON'>('CLASSIC');
  const [data, setData] = useState<ReplayCandle[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [loadError, setLoadError] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  const [engine] = useState(() => new ReplayTradingEngine(10000));
  const [account, setAccount] = useState<ReplayAccount>(engine.getAccount());
  
  const chartRef = useRef<ReplayChartHandle>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dataRef = useRef<ReplayCandle[]>([]);

  const [orderQty, setOrderQty] = useState(1);

  // Keep dataRef in sync
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Sync account state
  useEffect(() => {
    setAccount({ ...engine.getAccount() });
  }, [currentPrice]);

  useEffect(() => {
    const gsap = (window as any).gsap;
    if (gsap) {
      gsap.fromTo('.module-card', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out', clearProps: 'all' });
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, []);

  const stopTimer = useCallback(() => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const loadHistoricalData = async () => {
    stopTimer();
    setIsLoading(true);
    setLoadError('');
    setDataLoaded(false);
    
    try {
      const fetched = await fetchHistoricalData(symbol, timeframe);
      
      if (!fetched || fetched.length < 10) {
        setLoadError(`No data found for ${symbol}. Try BTCUSDT, ETHUSDT, EURUSD, or NIFTY50.`);
        setData([]);
        setIsLoading(false);
        return;
      }

      const startIdx = Math.max(50, Math.floor(fetched.length * 0.8));
      setData(fetched);
      setCurrentIdx(startIdx);
      setCurrentPrice(fetched[startIdx - 1].close);
      setDataLoaded(true);
      setLoadError('');

    } catch (err) {
      setLoadError('Failed to fetch data. Check your internet connection.');
      setData([]);
    }
    
    setIsLoading(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopTimer();
      return;
    }

    if (data.length === 0 || currentIdx >= data.length) return;

    setIsPlaying(true);
    const delay = Math.max(50, 1000 / playbackSpeed);
    
    let idx = currentIdx;
    
    playIntervalRef.current = setInterval(() => {
      idx++;
      if (idx >= dataRef.current.length) {
        stopTimer();
        return;
      }
      const candle = dataRef.current[idx];
      if (chartRef.current) chartRef.current.updateCandle(candle);
      setCurrentPrice(candle.close);
      setCurrentIdx(idx);
      engine.updateEquity(candle.close);
      setAccount({ ...engine.getAccount() });
    }, delay);
  };

  const stopPlayback = () => {
    stopTimer();
    if (data.length > 50) {
      const startIdx = Math.max(50, Math.floor(data.length * 0.8));
      setCurrentIdx(startIdx);
      setCurrentPrice(data[startIdx - 1].close);
      if (chartRef.current) {
        chartRef.current.resetChart(data.slice(0, startIdx));
      }
    }
  };

  const handleTimeframeChange = async (newTf: string) => {
    const savedTimestamp = data.length > 0 && currentIdx > 0 ? data[Math.min(currentIdx, data.length - 1)].time : null;
    stopTimer();
    setTimeframe(newTf);
    setIsLoading(true);

    const fetched = await fetchHistoricalData(symbol, newTf);
    if (!fetched || fetched.length < 10) {
      setIsLoading(false);
      return;
    }

    setData(fetched);
    
    let newIdx = Math.max(50, Math.floor(fetched.length * 0.8));
    if (savedTimestamp) {
      const matchIdx = fetched.findIndex(c => c.time >= savedTimestamp);
      if (matchIdx > 0) newIdx = Math.max(matchIdx, newIdx);
    }
    
    setCurrentIdx(newIdx);
    setCurrentPrice(fetched[newIdx - 1].close);
    
    if (chartRef.current) {
      chartRef.current.resetChart(fetched.slice(0, newIdx));
    }

    setIsLoading(false);
  };

  const handleBuy = () => {
    if (currentPrice > 0) {
      engine.executeMarketOrder(symbol, 'LONG', orderQty, currentPrice);
      setAccount({ ...engine.getAccount() });
    }
  };

  const handleSell = () => {
    if (currentPrice > 0) {
      engine.executeMarketOrder(symbol, 'SHORT', orderQty, currentPrice);
      setAccount({ ...engine.getAccount() });
    }
  };

  const handleClose = (id: string) => {
    engine.closePosition(id, currentPrice);
    setAccount({ ...engine.getAccount() });
  };

  const progress = data.length > 0 ? Math.round((currentIdx / data.length) * 100) : 0;

  return (
    <div className="flex h-full w-full bg-dark-900 text-white gap-4 module-card">
      
      {/* Main Chart Area */}
      <div className="flex-1 flex flex-col min-h-0 glass-panel rounded-xl border border-slate-800 overflow-hidden module-card">
        
        {/* Replay Control Header */}
        <div className="bg-slate-900/50 p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-trade-cyan/10 text-trade-cyan px-2 py-1 rounded text-sm font-bold flex items-center gap-2">
              <Activity className="w-4 h-4" /> Market Replay
            </div>
            
            <input 
              type="text" 
              value={symbol} 
              onChange={e => setSymbol(e.target.value.toUpperCase())}
              className="bg-dark-900 border border-slate-700 rounded px-2 py-1 w-28 text-sm"
              placeholder="NIFTY50"
              list="replay-tickers-list"
            />
            <datalist id="replay-tickers-list">
              {tickers.map(t => (
                <option key={t.symbol} value={t.symbol}>
                  {t.name}
                </option>
              ))}
            </datalist>
            <select 
              value={timeframe} 
              onChange={e => handleTimeframeChange(e.target.value)}
              className="bg-dark-900 border border-slate-700 rounded px-2 py-1 text-sm"
            >
              <option value="1m">1m</option>
              <option value="5m">5m</option>
              <option value="10m">10m</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="1D">1D</option>
            </select>

            {/* Candle Color Theme Selector */}
            <select 
              value={colorTheme} 
              onChange={e => setColorTheme(e.target.value as any)}
              className="bg-dark-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 font-bold"
              title="Change Candle Colors (Monochrome B&W, Green/Red, Cyan/Pink)"
            >
              <option value="MONOCHROME">🔲 Monochrome (B&W)</option>
              <option value="CLASSIC">🟢🔴 Classic (Green/Red)</option>
              <option value="NEON">🩵🩷 Neon (Cyan/Pink)</option>
            </select>
            
            <button 
              onClick={loadHistoricalData}
              disabled={isLoading}
              className="btn-premium bg-trade-cyan/20 hover:bg-trade-cyan/30 border border-trade-cyan/40 text-trade-cyan px-4 py-1 rounded text-sm font-bold transition flex items-center gap-2"
            >
              {isLoading ? <><div className="shimmer-skeleton h-3 w-16" /></> : 'Load History'}
            </button>

            {dataLoaded && (
              <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded tabular-nums">
                {data.length} candles loaded • {progress}%
              </span>
            )}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2 bg-dark-900 p-1.5 rounded-lg border border-slate-700">
            <button 
              onClick={togglePlayback} 
              disabled={data.length === 0} 
              className={`p-2 rounded transition ${isPlaying ? 'bg-amber-500/20 text-amber-500' : 'hover:bg-slate-800 text-emerald-500'}`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button 
              onClick={stopPlayback} 
              disabled={data.length === 0} 
              className="p-2 rounded hover:bg-slate-800 text-rose-500 transition"
            >
              <Square className="w-4 h-4" />
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

        {/* Error Display */}
        {loadError && (
          <div className="px-4 py-2 bg-rose-950/30 border-b border-rose-800/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" /> {loadError}
          </div>
        )}

        {/* Chart View */}
        <div className="flex-1 relative min-h-[400px]">
          {!dataLoaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
              <Activity className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">Enter a symbol and click <span className="text-trade-cyan font-bold">Load History</span> to start</p>
              <p className="text-xs mt-2 text-slate-600">Try: BTCUSDT • ETHUSDT • EURUSD • NIFTY50 • RELIANCE</p>
            </div>
          ) : (
            <ReplayChart 
              ref={chartRef} 
              data={data} 
              currentIdx={currentIdx} 
              candleColors={
                colorTheme === 'MONOCHROME' ? MONOCHROME_THEME :
                colorTheme === 'NEON' ? NEON_THEME : CLASSIC_THEME
              }
            />
          )}
        </div>
      </div>

      {/* Replay Trading Panel */}
      <div className="w-72 shrink-0 flex flex-col glass-panel rounded-xl border border-slate-800 overflow-hidden module-card">
        <div className="p-3 border-b border-slate-800">
          <h3 className="text-sm font-bold flex items-center gap-2 font-display"><ShoppingCart className="w-4 h-4 text-trade-cyan" /> Chart Trader</h3>
        </div>
        
        {/* Account Info */}
        <div className="p-3 bg-slate-900/50 border-b border-slate-800">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-display">Balance</span>
            <span className="font-mono tabular-nums">${account.balance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300 font-display">Equity</span>
            <span className={`font-mono tabular-nums ${account.equity >= account.balance ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${account.equity.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Order Entry */}
        <div className="p-3 border-b border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-display">Price</span>
            <span className="font-mono font-bold text-white tabular-nums">{currentPrice > 0 ? currentPrice.toFixed(2) : '---'}</span>
          </div>
          
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Qty</label>
            <input 
              type="number" 
              value={orderQty} 
              onChange={e => setOrderQty(Number(e.target.value))}
              className="w-full bg-dark-900 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={handleBuy} disabled={!isPlaying} className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold py-1.5 rounded text-xs transition btn-premium">
              BUY
            </button>
            <button onClick={handleSell} disabled={!isPlaying} className="flex-1 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold py-1.5 rounded text-xs transition btn-premium">
              SELL
            </button>
          </div>
          {!isPlaying && data.length > 0 && <p className="text-[10px] text-amber-500/80 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Press Play to trade</p>}
        </div>

        {/* Open Positions */}
        <div className="flex-1 overflow-y-auto p-3">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 font-display">Positions ({account.positions.length})</h4>
          <div className="space-y-1.5">
            {account.positions.length === 0 ? (
              <p className="text-[10px] text-slate-600">No open positions.</p>
            ) : (
              account.positions.map(pos => (
                <div key={pos.id} className="bg-dark-900 border border-slate-700 p-2 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold ${pos.type === 'LONG' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {pos.type} {pos.quantity} {pos.symbol}
                    </span>
                    <button onClick={() => handleClose(pos.id)} className="text-[9px] bg-slate-700 hover:bg-slate-600 px-1.5 py-0.5 rounded text-white transition">
                      Close
                    </button>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400">@ {pos.entryPrice.toFixed(2)}</span>
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
