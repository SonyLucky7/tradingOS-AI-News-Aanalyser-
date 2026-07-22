import React, { useEffect, useRef, useState } from 'react';
import { MarketTicker } from '../types/tradeos';

interface NativeChartProps {
  symbol: string;
  ticker?: MarketTicker;
  timeframe: string;
}

export const NativeCandlestickChart: React.FC<NativeChartProps> = ({ symbol, ticker, timeframe }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverData, setHoverData] = useState<{ open: number; high: number; low: number; close: number; time: string } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas internal resolution based on DPR
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Generate realistic OHLC candle data based on current price
    const basePrice = ticker?.price || (symbol.includes('BTC') ? 67845.50 : symbol.includes('NIFTY') ? 24580.25 : 1.0885);
    const count = 45;
    const candles = [];
    let current = basePrice * 0.96;

    for (let i = 0; i < count; i++) {
      const volatility = basePrice * (symbol.includes('BTC') ? 0.008 : 0.003);
      const open = current;
      const change = (Math.random() - 0.48) * volatility;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      const volume = Math.floor(Math.random() * 5000) + 1200;
      candles.push({ open, high, low, close, volume, index: i });
      current = close;
    }

    // Force the final candle to match active live price
    if (candles.length > 0) {
      candles[candles.length - 1].close = basePrice;
      candles[candles.length - 1].high = Math.max(candles[candles.length - 1].high, basePrice);
      candles[candles.length - 1].low = Math.min(candles[candles.length - 1].low, basePrice);
    }

    // Clear Canvas
    ctx.fillStyle = '#07090E';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridRows = 6;
    for (let i = 1; i < gridRows; i++) {
      const y = (height / gridRows) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width - 60, y);
      ctx.stroke();
    }

    // Price scaling bounds
    const minPrice = Math.min(...candles.map(c => c.low)) * 0.998;
    const maxPrice = Math.max(...candles.map(c => c.high)) * 1.002;
    const priceRange = maxPrice - minPrice || 1;

    const chartPaddingTop = 20;
    const chartHeight = height - 60;
    const chartWidth = width - 65;
    const candleWidth = Math.max(4, (chartWidth / count) - 4);

    // Draw Price Axis Right Scale
    ctx.fillStyle = '#64748B';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    for (let i = 0; i <= 5; i++) {
      const priceVal = maxPrice - (priceRange / 5) * i;
      const y = chartPaddingTop + (chartHeight / 5) * i;
      ctx.fillText(priceVal > 100 ? priceVal.toFixed(2) : priceVal.toFixed(4), width - 58, y + 3);
    }

    // Render Candlesticks & Volume Bars
    const getX = (idx: number) => (chartWidth / count) * idx + candleWidth / 2;
    const getY = (price: number) => chartPaddingTop + (1 - (price - minPrice) / priceRange) * chartHeight;

    const maPeriod = 9;
    const maPoints: { x: number; y: number }[] = [];

    candles.forEach((c, idx) => {
      const x = getX(idx);
      const openY = getY(c.open);
      const closeY = getY(c.close);
      const highY = getY(c.high);
      const lowY = getY(c.low);

      const isBull = c.close >= c.open;
      const color = isBull ? '#10B981' : '#F43F5E';

      // Draw Wick Line
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Draw Candle Body
      ctx.fillStyle = color;
      const bodyY = Math.min(openY, closeY);
      const bodyH = Math.max(2, Math.abs(closeY - openY));
      ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyH);

      // Volume Bar at Bottom
      const maxVol = Math.max(...candles.map(k => k.volume)) || 1;
      const volH = (c.volume / maxVol) * 35;
      ctx.fillStyle = isBull ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)';
      ctx.fillRect(x - candleWidth / 2, height - volH - 15, candleWidth, volH);

      // Moving Average (MA9)
      if (idx >= maPeriod - 1) {
        const slice = candles.slice(idx - maPeriod + 1, idx + 1);
        const avg = slice.reduce((acc, k) => acc + k.close, 0) / maPeriod;
        maPoints.push({ x, y: getY(avg) });
      }
    });

    // Draw MA Line
    if (maPoints.length > 1) {
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(maPoints[0].x, maPoints[0].y);
      for (let i = 1; i < maPoints.length; i++) {
        ctx.lineTo(maPoints[i].x, maPoints[i].y);
      }
      ctx.stroke();
    }

    // Set Default Top Hover Bar Data
    const last = candles[candles.length - 1];
    setHoverData({
      open: Number(last.open.toFixed(2)),
      high: Number(last.high.toFixed(2)),
      low: Number(last.low.toFixed(2)),
      close: Number(last.close.toFixed(2)),
      time: 'Live WebSocket'
    });

  }, [symbol, ticker, timeframe]);

  return (
    <div className="w-full h-full relative bg-[#07090E] flex flex-col font-mono">
      {/* Top Hover Bar */}
      {hoverData && (
        <div className="px-3 py-1.5 bg-[#0B0E17]/90 border-b border-slate-800 text-[11px] flex items-center space-x-3 text-slate-300">
          <span className="font-bold text-white">{symbol}</span>
          <span>O <strong className="text-white">{hoverData.open}</strong></span>
          <span>H <strong className="text-emerald-400">{hoverData.high}</strong></span>
          <span>L <strong className="text-rose-400">{hoverData.low}</strong></span>
          <span>C <strong className={hoverData.close >= hoverData.open ? 'text-emerald-400' : 'text-rose-400'}>{hoverData.close}</strong></span>
          <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 rounded">MA(9)</span>
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full flex-1 cursor-crosshair" />
    </div>
  );
};
