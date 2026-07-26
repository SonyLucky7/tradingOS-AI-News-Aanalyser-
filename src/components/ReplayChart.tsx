import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
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

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize chart
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

    // Initial data load
    if (data.length > 0) {
      const initialData = data.slice(0, currentIdx).map(c => ({
        time: c.time as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));
      candlestickSeries.setData(initialData);
    }

    return () => {
      chart.remove();
    };
  }, []);

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
      }
    }
  }));

  return (
    <div ref={chartContainerRef} className="w-full h-full min-h-[500px]" />
  );
});
