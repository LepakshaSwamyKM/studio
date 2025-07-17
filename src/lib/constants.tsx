import type { ReactNode } from 'react';
import { EthereumLogo } from '@/components/icons/ethereum-logo';
import { PolygonLogo } from '@/components/icons/polygon-logo';
import { ArbitrumLogo } from '@/components/icons/arbitrum-logo';
import type { ChainId } from './types';

export type ChainConfig = {
  name: string;
  symbol: string;
  rpcUrl: string;
  logo: ReactNode;
};

export const CHAINS: Record<ChainId, ChainConfig> = {
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'wss://ethereum-rpc.publicnode.com',
    logo: <EthereumLogo className="h-6 w-6" />,
  },
  polygon: {
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'wss://polygon-rpc.publicnode.com',
    logo: <PolygonLogo className="h-6 w-6" />,
  },
  arbitrum: {
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'wss://arbitrum-one-rpc.publicnode.com',
    logo: <ArbitrumLogo className="h-6 w-6" />,
  },
};

export const UNISWAP_V3_POOL_ADDRESS = '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640';
export const UNISWAP_V3_POOL_ABI = [
  'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
];

export const STANDARD_TX_GAS_LIMIT = 21000;
