"use client";

import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, ColorType, UTCTimestamp } from 'lightweight-charts';
import useChainStore from '@/store/use-chain-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CHAINS } from '@/lib/constants.tsx';
import type { ChainId } from '@/lib/types';

export function GasChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const [activeChain, setActiveChain] = useState<ChainId>('ethereum');
  const aggregatedHistory = useChainStore(state => state.chains[activeChain].aggregatedHistory);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#D1D5DB',
      },
      grid: {
        vertLines: { color: 'rgba(75, 85, 99, 0.5)' },
        horzLines: { color: 'rgba(75, 85, 99, 0.5)' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(75, 85, 99, 0.8)',
      },
    });

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#39FF14', // Neon Green
      downColor: '#EF4444', // Red
      borderDownColor: '#EF4444',
      borderUpColor: '#39FF14',
      wickDownColor: '#EF4444',
      wickUpColor: '#39FF14',
    });

    const handleResize = () => {
      if (chartContainerRef.current) {
        chartRef.current?.applyOptions({
            width: chartContainerRef.current.clientWidth
        });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && aggregatedHistory) {
      // lightweight-charts requires time to be a number (UTCTimestamp)
      const formattedData = aggregatedHistory.map(d => ({
        ...d,
        time: d.time as UTCTimestamp
      }));
      seriesRef.current.setData(formattedData);
      chartRef.current?.timeScale().fitContent();
    }
  }, [aggregatedHistory]);

  return (
    <Card className="h-[400px] lg:h-[500px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-xl">Gas Price Volatility (15m)</CardTitle>
        <Tabs value={activeChain} onValueChange={(value) => setActiveChain(value as ChainId)}>
            <TabsList>
                {Object.entries(CHAINS).map(([id, {name}]) => (
                    <TabsTrigger key={id} value={id}>{name}</TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div ref={chartContainerRef} className="w-full h-full" />
      </CardContent>
    </Card>
  );
}
