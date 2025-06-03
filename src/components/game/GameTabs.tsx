import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import { BusinessPanel } from './BusinessPanel';
import { TeamPanel } from './TeamPanel';
import { UpgradePanel } from './UpgradePanel';
import { AchievementPanel } from './AchievementPanel';
import { StatsPanel } from './StatsPanel';
import { ManagerPanel } from './ManagerPanel';

export function GameTabs() {
  return (
    <TabsPrimitive.Root defaultValue="businesses" className="w-full">
      <TabsPrimitive.List className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        <TabsButton value="businesses">Businesses</TabsButton>
        <TabsButton value="teams">Teams</TabsButton>
        <TabsButton value="managers">Managers</TabsButton>
        <TabsButton value="upgrades">Upgrades</TabsButton>
        <TabsButton value="achievements">Achievements</TabsButton>
        <TabsButton value="stats">Stats</TabsButton>
      </TabsPrimitive.List>
      
      <div className="mt-4">
        <TabsPrimitive.Content value="businesses" className="focus:outline-none">
          <BusinessPanel />
        </TabsPrimitive.Content>
        
        <TabsPrimitive.Content value="teams" className="focus:outline-none">
          <TeamPanel />
        </TabsPrimitive.Content>
        
        <TabsPrimitive.Content value="managers" className="focus:outline-none">
          <ManagerPanel />
        </TabsPrimitive.Content>
        
        <TabsPrimitive.Content value="upgrades" className="focus:outline-none">
          <UpgradePanel />
        </TabsPrimitive.Content>
        
        <TabsPrimitive.Content value="achievements" className="focus:outline-none">
          <AchievementPanel />
        </TabsPrimitive.Content>
        
        <TabsPrimitive.Content value="stats" className="focus:outline-none">
          <StatsPanel />
        </TabsPrimitive.Content>
      </div>
    </TabsPrimitive.Root>
  );
}

interface TabsButtonProps {
  value: string;
  children: React.ReactNode;
}

function TabsButton({ value, children }: TabsButtonProps) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        "flex-1 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
        "border-b-2 border-transparent",
        "data-[state=active]:border-foreground",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-foreground"
      )}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}
