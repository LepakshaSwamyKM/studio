"use client";

import { useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import useChainStore from '@/store/use-chain-store';
import { CHAINS, UNISWAP_V3_POOL_ADDRESS, UNISWAP_V3_POOL_ABI } from '@/lib/constants.tsx';
import type { ChainId } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function useRealtimeData() {
  const { toast } = useToast();
  const store = useChainStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const providers: Record<string, ethers.providers.WebSocketProvider> = {};
    const timers: NodeJS.Timeout[] = [];

    const connectToChain = (chainId: ChainId) => {
      try {
        const { rpcUrl, name } = CHAINS[chainId];
        const provider = new ethers.providers.WebSocketProvider(rpcUrl);
        providers[chainId] = provider;
        
        store.setChainStatus(chainId, 'connecting');

        provider.on('block', async (blockNumber: number) => {
          try {
            const block = await provider.getBlock(blockNumber);
            const baseFeeGwei = block.baseFeePerGas ? parseFloat(ethers.utils.formatUnits(block.baseFeePerGas, 'gwei')) : 0;
            const feeData = await provider.getFeeData();
            const priorityFeeGwei = feeData.maxPriorityFeePerGas ? parseFloat(ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, 'gwei')) : 0;
            store.updateGasPrice(chainId, baseFeeGwei, priorityFeeGwei);
            store.setChainStatus(chainId, 'connected');
          } catch (error) {
             console.error(`Error fetching block data for ${name}:`, error);
          }
        });
        
        provider._websocket.on('open', () => {
            console.log(`${name} WebSocket connected.`);
            store.setChainStatus(chainId, 'connected');
        });

        provider._websocket.on('error', (err: any) => {
          console.error(`${name} WebSocket error:`, err);
          store.setChainStatus(chainId, 'error');
          toast({
            variant: "destructive",
            title: `Connection Error: ${name}`,
            description: "Could not connect to the blockchain network.",
          });
        });

      } catch (e) {
        console.error(`Failed to initialize provider for ${CHAINS[chainId].name}:`, e);
        store.setChainStatus(chainId, 'error');
      }
    };
    
    // Connect to Uniswap for price feed
    try {
        const ethProvider = new ethers.providers.WebSocketProvider(CHAINS.ethereum.rpcUrl);
        const poolContract = new ethers.Contract(UNISWAP_V3_POOL_ADDRESS, UNISWAP_V3_POOL_ABI, ethProvider);

        poolContract.on('Swap', (sender, recipient, amount0, amount1, sqrtPriceX96, liquidity, tick) => {
            const price = sqrtPriceX96.pow(2).mul(ethers.BigNumber.from(10).pow(12)).div(ethers.BigNumber.from(2).pow(192));
            store.updateUsdPrice(parseFloat(ethers.utils.formatUnits(price, 6)));
        });
        providers['uniswap'] = ethProvider;
    } catch(e) {
        console.error('Failed to initialize Uniswap price feed:', e);
        toast({
            variant: "destructive",
            title: "Price Feed Error",
            description: "Could not connect to Uniswap V3 for price data.",
          });
    }


    Object.keys(CHAINS).forEach(id => connectToChain(id as ChainId));
    
    const aggregationTimer = setInterval(() => {
        store.aggregateHistory();
    }, 60 * 1000); // Aggregate every minute
    timers.push(aggregationTimer);

    setTimeout(() => {
        store.setInitialized(true);
    }, 3000);

    return () => {
      console.log('Cleaning up WebSocket providers.');
      initialized.current = false;
      Object.values(providers).forEach(p => p.destroy());
      timers.forEach(t => clearInterval(t));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
