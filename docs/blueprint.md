# **App Name**: Chain Watcher

## Core Features:

- Real-Time Gas Prices: Display real-time gas prices from Ethereum, Polygon, and Arbitrum.
- Wallet Interaction Simulation: Simulate wallet interactions by allowing users to input transaction value and calculating the USD cost of gas + transaction across chains using live ETH/USD prices from Uniswap V3's ETH/USDC pool.
- Gas Price Volatility Chart: Visualize gas price volatility over 15-minute intervals using an interactive candlestick chart (using `lightweight-charts`).
- Real-Time Gas Engine: Fetch real-time gas prices from Ethereum, Polygon, and Arbitrum using their native RPC endpoints.
- USD Pricing: Read Uniswap V3's `Swap` events at `0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640` and calculate ETH/USD price from raw `sqrtPriceX96` values.  Handle USDC decimal conversion (6 decimals).
- State Management with Zustand: Manage the state using Zustand, switching between 'live' and 'simulation' modes, tracking gas prices, fees, and USD prices.

## Style Guidelines:

- Primary color: Electric Blue (#7DF9FF) to represent the speed and dynamism of real-time data.
- Background color: Dark gray (#282C34) to provide a high contrast for the data visualizations and improve readability.
- Accent color: Neon Green (#39FF14) for highlights, interactive elements, and important data points.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text, for a modern and technical feel.
- Use clear, minimalist icons to represent different blockchains and transaction types. Icons should be high-contrast against the dark background.
- Responsive layout to ensure the dashboard is accessible and usable on different devices. Prioritize key information and interactive elements on smaller screens.
- Subtle transitions and animations when updating data or switching between modes to enhance user experience without being distracting.