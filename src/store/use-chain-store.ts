import { create } from 'zustand';
import type { ChainId, ChainState, ChainWatcherState, GasDataPoint, AggregatedGasData } from '@/lib/types';
import { produce } from 'immer';

const initialChainState: ChainState = {
  baseFee: 0,
  priorityFee: 0,
  history: [],
  aggregatedHistory: [],
  status: 'connecting',
};

const useChainStore = create<ChainWatcherState>((set, get) => ({
  isInitialized: false,
  mode: 'live',
  chains: {
    ethereum: { ...initialChainState },
    polygon: { ...initialChainState },
    arbitrum: { ...initialChainState },
  },
  usdPrice: 0,
  usdPriceHistory: [],
  setInitialized: (isInitialized) => set({ isInitialized }),
  setMode: (mode) => set({ mode }),
  setChainStatus: (chainId, status) => {
    set(produce((state: ChainWatcherState) => {
      state.chains[chainId].status = status;
    }));
  },
  updateGasPrice: (chainId, baseFee, priorityFee) => {
    set(produce((state: ChainWatcherState) => {
      state.chains[chainId].baseFee = baseFee;
      state.chains[chainId].priorityFee = priorityFee;
      state.chains[chainId].history.push({
        timestamp: Date.now(),
        baseFee,
        priorityFee,
      });
      // Trim history to a reasonable length, e.g., last 24 hours
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      state.chains[chainId].history = state.chains[chainId].history.filter(p => p.timestamp > oneDayAgo);
    }));
  },
  updateUsdPrice: (price) => {
    set(produce((state: ChainWatcherState) => {
      state.usdPrice = price;
      state.usdPriceHistory.push({ time: Date.now() / 1000, value: price });
       const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
       state.usdPriceHistory = state.usdPriceHistory.filter(p => p.time * 1000 > oneDayAgo);
    }));
  },
  aggregateHistory: () => {
    set(produce((state: ChainWatcherState) => {
      for (const chainId in state.chains) {
        const history = state.chains[chainId as ChainId].history;
        if (history.length === 0) continue;

        const fifteenMinutes = 15 * 60 * 1000;
        const buckets = new Map<number, GasDataPoint[]>();

        history.forEach(point => {
          const bucketTimestamp = Math.floor(point.timestamp / fifteenMinutes) * fifteenMinutes;
          if (!buckets.has(bucketTimestamp)) {
            buckets.set(bucketTimestamp, []);
          }
          buckets.get(bucketTimestamp)!.push(point);
        });

        const aggregated: AggregatedGasData[] = [];
        buckets.forEach((points, timestamp) => {
          if (points.length === 0) return;
          const prices = points.map(p => p.baseFee + p.priorityFee);
          aggregated.push({
            time: timestamp / 1000,
            open: prices[0],
            high: Math.max(...prices),
            low: Math.min(...prices),
            close: prices[prices.length - 1],
          });
        });
        
        aggregated.sort((a, b) => (a.time as number) - (b.time as number));
        state.chains[chainId as ChainId].aggregatedHistory = aggregated;
      }
    }));
  },
}));

export default useChainStore;
