import type { CandlestickData, LineData } from "lightweight-charts";

export type ChainId = 'ethereum' | 'polygon' | 'arbitrum';

export interface GasDataPoint {
  timestamp: number;
  baseFee: number;
  priorityFee: number;
}

export type AggregatedGasData = CandlestickData;

export interface ChainState {
  baseFee: number;
  priorityFee: number;
  history: GasDataPoint[];
  aggregatedHistory: AggregatedGasData[];
  status: 'connecting' | 'connected' | 'error';
}

export interface ChainWatcherState {
  isInitialized: boolean;
  mode: 'live' | 'simulation';
  chains: Record<ChainId, ChainState>;
  usdPrice: number;
  usdPriceHistory: LineData[];
  setMode: (mode: 'live' | 'simulation') => void;
  updateGasPrice: (chainId: ChainId, baseFee: number, priorityFee: number) => void;
  updateUsdPrice: (price: number) => void;
  setChainStatus: (chainId: ChainId, status: 'connecting' | 'connected' | 'error') => void;
  aggregateHistory: () => void;
  setInitialized: (isInitialized: boolean) => void;
}
