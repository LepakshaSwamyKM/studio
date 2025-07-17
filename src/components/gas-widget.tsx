"use client";

import useChainStore from "@/store/use-chain-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHAINS } from "@/lib/constants.tsx";
import type { ChainId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface GasWidgetProps {
    chainId: string;
}

export function GasWidget({ chainId }: GasWidgetProps) {
  const chain = useChainStore(state => state.chains[chainId as ChainId]);
  const usdPrice = useChainStore(state => state.usdPrice);
  const chainConfig = CHAINS[chainId as ChainId];

  const { baseFee, priorityFee, status } = chain;
  const totalGas = baseFee + priorityFee;
  const costPerTx = totalGas * 21000 * 1e-9 * usdPrice;

  const statusColor = status === 'connected' ? 'bg-accent' : status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium font-headline flex items-center gap-2">
          {chainConfig.logo}
          {chainConfig.name}
        </CardTitle>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div className={cn("h-3 w-3 rounded-full animate-pulse", statusColor)} />
                </TooltipTrigger>
                <TooltipContent>
                    <p className="capitalize">{status}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">
            {totalGas.toFixed(2)} <span className="text-lg text-muted-foreground">Gwei</span>
        </div>
        <div className="text-sm text-muted-foreground space-y-1 mt-2">
            <p>Base: {baseFee.toFixed(2)} Gwei</p>
            <p>Priority: {priorityFee.toFixed(2)} Gwei</p>
        </div>
        <div className="border-t mt-4 pt-3">
            <p className="text-xs text-muted-foreground">Est. Transfer Cost</p>
            <p className="text-md font-semibold text-accent">${costPerTx.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
