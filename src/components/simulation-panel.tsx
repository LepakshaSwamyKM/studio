"use client";

import { useState } from 'react';
import useChainStore from "@/store/use-chain-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CHAINS, STANDARD_TX_GAS_LIMIT } from '@/lib/constants.tsx';
import type { ChainId } from '@/lib/types';
import { Button } from './ui/button';

export function SimulationPanel() {
  const { chains, usdPrice } = useChainStore();
  const [txValue, setTxValue] = useState('0.1');

  const calculateCost = (chainId: ChainId) => {
    const chain = chains[chainId];
    const totalGasGwei = chain.baseFee + chain.priorityFee;
    const gasCostETH = totalGasGwei * STANDARD_TX_GAS_LIMIT * 1e-9;
    const gasCostUSD = gasCostETH * usdPrice;
    return { gasCostUSD };
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Transaction Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="tx-value" className="text-muted-foreground">Transaction Value (ETH)</Label>
          <Input
            id="tx-value"
            type="number"
            value={txValue}
            onChange={(e) => setTxValue(e.target.value)}
            placeholder="e.g., 0.1"
            className="mt-1"
          />
        </div>
        <div>
          <h4 className="font-medium mb-2">Estimated Costs</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chain</TableHead>
                <TableHead className="text-right">Tx Fee (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(CHAINS).map(([id, config]) => {
                const { gasCostUSD } = calculateCost(id as ChainId);
                const totalCost = gasCostUSD + parseFloat(txValue || '0') * usdPrice;
                return (
                  <TableRow key={id}>
                    <TableCell className="font-medium flex items-center gap-2">
                        {config.logo} {config.name}
                    </TableCell>
                    <TableCell className="text-right font-mono text-accent">${gasCostUSD.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="text-center text-xs text-muted-foreground pt-2">
          Based on a standard transfer ({STANDARD_TX_GAS_LIMIT} gas).
        </div>
      </CardContent>
    </Card>
  );
}
