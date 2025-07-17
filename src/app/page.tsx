"use client";

import { useRealtimeData } from "@/hooks/use-realtime-data";
import useChainStore from "@/store/use-chain-store";
import { GasWidget } from "@/components/gas-widget";
import { SimulationPanel } from "@/components/simulation-panel";
import { GasChart } from "@/components/gas-chart";
import { DashboardHeader } from "@/components/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHAINS } from "@/lib/constants.tsx";

export default function Home() {
  useRealtimeData();
  const { mode, chains, isInitialized } = useChainStore();

  const chainEntries = Object.entries(CHAINS);

  const renderContent = () => {
    if (!isInitialized) {
      return (
        <div className="grid grid-cols-1 gap-6 p-4 pt-0 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-40" />
              </CardContent>
            </Card>
          ))}
          <div className="lg:col-span-3">
            <Card className="h-[400px] lg:h-[500px]">
              <CardContent className="p-6">
                <Skeleton className="h-full w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid flex-1 grid-cols-1 gap-6 p-4 pt-0 md:grid-cols-2 lg:grid-cols-3">
        {chainEntries.map(([key, chainConfig]) => (
          <GasWidget key={key} chainId={key} />
        ))}

        {mode === 'simulation' && <SimulationPanel />}

        <div className="md:col-span-2 lg:col-span-3">
          <GasChart />
        </div>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <div className="w-full max-w-7xl">
        <DashboardHeader />
        <div className="flex-1 space-y-4">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
