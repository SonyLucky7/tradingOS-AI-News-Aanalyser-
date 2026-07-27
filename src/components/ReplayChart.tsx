import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { createChart, IChartApi, ISeriesApi, Time, CandlestickSeries } from 'lightweight-charts';
import { ReplayCandle } from '../services/replayEngine';

export interface CandleColorTheme {
  upColor: string;
  downColor: string;
  wickUpColor: string;
  wickDownColor: string;
  borderUpColor?: string;
  borderDownColor?: string;
}

export const MONOCHROME_THEME: CandleColorTheme = {
  upColor: '#ffffff',
  downColor: '#000000',
  wickUpColor: '#ffffff',
  wickDownColor: '#ffffff',
  borderUpColor: '#ffffff',
  borderDownColor: '#ffffff',
};

export const CLASSIC_THEME: CandleColorTheme = {
  upColor: '#10b981',
  downColor: '#ef4444',
  wickUpColor: '#10b981',
  wickDownColor: '#ef4444',
  borderUpColor: '#10b981',
  borderDownColor: '#ef4444',
};

export const NEON_THEME: CandleColorTheme = {
  upColor: '#00f0ff',
  downColor: '#ff0055',
  wickUpColor: '#00f0ff',
  wickDownColor: '#ff0055',
  borderUpColor: '#00f0ff',
  borderDownColor: '#ff0055',
};

interface ReplayChartProps {
  data: ReplayCandle[];
  currentIdx: number;
  onPriceUpdate?: (price: number) => void;
  candleColors?: CandleColorTheme;
}

export interface ReplayChartHandle {
  updateCandle: (candle: ReplayCandle) => void;
  resetChart: (initialData: ReplayCandle[]) => void;
}

export const ReplayChart = forwardRef<ReplayChartHandle, ReplayChartProps>(({ data, currentIdx, onPriceUpdate, candleColors }, ref) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // Default to Monochrome B&W theme (White Bull / Black Bear) as requested by user
  const colors = candleColors || MONOCHROME_THEME;

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
      upColor: colors.upColor,
      downColor: colors.downColor,
      borderVisible: true,
      wickUpColor: colors.wickUpColor,
      wickDownColor: colors.wickDownColor,
      borderUpColor: colors.borderUpColor || colors.upColor,
      borderDownColor: colors.borderDownColor || colors.downColor,
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Apply color changes dynamically when candleColors prop changes
  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.applyOptions({
        upColor: colors.upColor,
        downColor: colors.downColor,
        wickUpColor: colors.wickUpColor,
        wickDownColor: colors.wickDownColor,
        borderVisible: true,
        borderUpColor: colors.borderUpColor || colors.upColor,
        borderDownColor: colors.borderDownColor || colors.downColor,
      });
    }
  }, [colors.upColor, colors.downColor, colors.wickUpColor, colors.wickDownColor, colors.borderUpColor, colors.borderDownColor]);

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
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [data]);

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
    <div ref={chartContainerRef} className="w-full h-full min-h-[550px]" />
  );
});
