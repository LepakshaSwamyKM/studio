"use client";

import useChainStore from "@/store/use-chain-store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function DashboardHeader() {
  const { mode, setMode } = useChainStore();

  const handleModeChange = (checked: boolean) => {
    setMode(checked ? 'simulation' : 'live');
  };

  return (
    <header className="p-4 py-6 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tighter font-headline text-primary sm:text-3xl md:text-4xl">
          Chain Watcher
        </h1>
        <p className="text-muted-foreground mt-1">
          Real-Time Cross-Chain Gas & Transaction Cost Tracker
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <Label htmlFor="mode-switch" className="font-medium">Live</Label>
        <Switch
          id="mode-switch"
          checked={mode === 'simulation'}
          onCheckedChange={handleModeChange}
          aria-label="Toggle simulation mode"
        />
        <Label htmlFor="mode-switch" className="font-medium text-primary">Simulation</Label>
      </div>
    </header>
  );
}
