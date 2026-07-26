import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { createChart, IChartApi, ISeriesApi, Time, CandlestickSeries } from 'lightweight-charts';
import { ReplayCandle } from '../services/replayEngine';

interface ReplayChartProps {
  data: ReplayCandle[];
  currentIdx: number;
  onPriceUpdate?: (price: number) => void;
}

export interface ReplayChartHandle {
  updateCandle: (candle: ReplayCandle) => void;
  resetChart: (initialData: ReplayCandle[]) => void;
}

export const ReplayChart = forwardRef<ReplayChartHandle, ReplayChartProps>(({ data, currentIdx, onPriceUpdate }, ref) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // Initialize chart once on mount
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#07090E' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
      autoSize: true,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Load initial data whenever data array changes (e.g. after "Load History")
  useEffect(() => {
    if (seriesRef.current && data.length > 0 && currentIdx > 0) {
      const sliced = data.slice(0, currentIdx);
      seriesRef.current.setData(sliced.map(c => ({
        time: c.time as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })));
      // Auto-fit the visible range
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [data]); // Re-run when data array reference changes

  useImperativeHandle(ref, () => ({
    updateCandle: (candle: ReplayCandle) => {
      if (seriesRef.current) {
        seriesRef.current.update({
          time: candle.time as Time,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        });
        if (onPriceUpdate) onPriceUpdate(candle.close);
      }
    },
    resetChart: (initialData: ReplayCandle[]) => {
      if (seriesRef.current) {
        seriesRef.current.setData(initialData.map(c => ({
          time: c.time as Time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        })));
        if (chartRef.current) {
          chartRef.current.timeScale().fitContent();
        }
      }
    }
  }));

  return (
    <div ref={chartContainerRef} className="w-full h-full min-h-[500px]" />
  );
});
