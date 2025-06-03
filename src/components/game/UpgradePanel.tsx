import { useGameStore, Upgrade } from '@/lib/store/gameStore';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function UpgradePanel() {
  const { upgrades, currentLoC, totalLoC, purchaseUpgrade } = useGameStore();

  const handlePurchase = (upgradeId: string) => {
    purchaseUpgrade(upgradeId);
  };

  // Filter upgrades that are visible (not purchased and unlocked based on LoC)
  const availableUpgrades = upgrades.filter(
    upgrade => !upgrade.purchased && upgrade.unlockRequirement <= totalLoC
  );

  // Filter purchased upgrades
  const purchasedUpgrades = upgrades.filter(
    upgrade => upgrade.purchased
  );

  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400">Upgrades</h2>
      
      {availableUpgrades.length === 0 && purchasedUpgrades.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">No upgrades available yet.</div>
          <div className="text-sm text-muted-foreground">
            Keep coding to unlock upgrades!
          </div>
        </div>
      ) : (
        <>
          {availableUpgrades.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Available Upgrades</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {availableUpgrades.map((upgrade, index) => (
                  <motion.div
                    key={upgrade.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <UpgradeCard
                      upgrade={upgrade}
                      canAfford={currentLoC >= upgrade.cost}
                      onPurchase={handlePurchase}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {purchasedUpgrades.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Purchased Upgrades</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {purchasedUpgrades.map((upgrade, index) => (
                  <motion.div
                    key={upgrade.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PurchasedUpgradeCard upgrade={upgrade} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface UpgradeCardProps {
  upgrade: Upgrade;
  canAfford: boolean;
  onPurchase: (id: string) => void;
}

function UpgradeCard({ upgrade, canAfford, onPurchase }: UpgradeCardProps) {
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'click': return 'Click Power';
      case 'business': return 'Business Boost';
      case 'team': return 'Team Boost';
      case 'offline': return 'Offline Earnings';
      case 'all': return 'All Production';
      default: return type;
    }
  };
  
  return (
    <div className="game-card upgrade-card p-4 h-full flex flex-col">
      <div className="relative mb-3">
        {/* Upgrade Image */}
        <div className="w-full h-24 rounded-md overflow-hidden mb-2 relative">
          <Image 
            src={upgrade.imageUrl || `/images/upgrades/${upgrade.id}.jpg`} 
            alt={upgrade.name}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to default image if the upgrade image fails to load
              (e.target as any).src = '/images/upgrades/default.jpg';
            }}
          />
          
          <div className="absolute top-2 right-2 bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 text-xs px-3 py-1 rounded-full font-semibold">
            {getTypeLabel(upgrade.type)}
          </div>
        </div>
        
        {/* Upgrade info */}
        <div>
          <h3 className="font-bold text-purple-600 dark:text-purple-400">{upgrade.name}</h3>
          <p className="text-xs text-muted-foreground">
            {upgrade.description}
          </p>
        </div>
      </div>
      
      <div className="mt-auto space-y-3">
        <div className="text-sm">
          <div className="bg-background/40 p-2 rounded">
            <div className="text-muted-foreground text-xs">Effect</div>
            <div className="font-medium">
              {upgrade.type === 'click' && `+${formatNumber((upgrade.multiplier - 1) * 100)}% click power`}
              {upgrade.type === 'business' && `+${formatNumber((upgrade.multiplier - 1) * 100)}% business production`}
              {upgrade.type === 'team' && `+${formatNumber((upgrade.multiplier - 1) * 100)}% team production`}
              {upgrade.type === 'offline' && `+${formatNumber((upgrade.multiplier - 1) * 100)}% offline earnings`}
              {upgrade.type === 'all' && `+${formatNumber((upgrade.multiplier - 1) * 100)}% all production`}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Cost:
          </span>
          <span className={`font-mono font-medium ${canAfford ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatNumber(upgrade.cost)} LoC
          </span>
        </div>
        
        <Button
          variant="upgrade"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={!canAfford}
          onClick={() => onPurchase(upgrade.id)}
        >
          Purchase
        </Button>
      </div>
    </div>
  );
}

function PurchasedUpgradeCard({ upgrade }: { upgrade: Upgrade }) {
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'click': return 'Click Power';
      case 'business': return 'Business Boost';
      case 'team': return 'Team Boost';
      case 'offline': return 'Offline Earnings';
      case 'all': return 'All Production';
      default: return type;
    }
  };
  
  return (
    <div className="game-card upgrade-card opacity-80 p-4 h-full flex flex-col">
      <div className="relative mb-3">
        {/* Upgrade Image */}
        <div className="w-full h-24 rounded-md overflow-hidden mb-2 relative">
          <Image 
            src={upgrade.imageUrl || `/images/upgrades/${upgrade.id}.jpg`} 
            alt={upgrade.name}
            fill
            className="object-cover grayscale"
            onError={(e) => {
              // Fallback to default image if the upgrade image fails to load
              (e.target as any).src = '/images/upgrades/default.jpg';
            }}
          />
          
          <div className="absolute top-2 right-2 bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 text-xs px-3 py-1 rounded-full font-semibold">
            {getTypeLabel(upgrade.type)}
          </div>
          
          <div className="absolute inset-0 bg-background/30 flex items-center justify-center">
            <div className="bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 text-xs px-3 py-1 rounded-full font-semibold">
              Purchased
            </div>
          </div>
        </div>
        
        {/* Upgrade info */}
        <div>
          <h3 className="font-bold text-purple-600 dark:text-purple-400">{upgrade.name}</h3>
          <p className="text-xs text-muted-foreground">
            {upgrade.description}
          </p>
        </div>
      </div>
      
      <div className="mt-auto space-y-3">
        <div className="text-sm">
          <div className="bg-background/40 p-2 rounded">
            <div className="text-muted-foreground text-xs">Active Effect</div>
            <div className="font-medium text-green-600 dark:text-green-400">
              {upgrade.type === 'click' && `+${formatNumber((upgrade.multiplier - 1) * 100)}% click power`}
              {upgrade.type === 'business' && `+${formatNumber((upgrade.multiplier - 1) * 100)}% business production`}
              {upgrade.type === 'team' && `+${formatNumber((upgrade.multiplier - 1) * 100)}% team production`}
              {upgrade.type === 'offline' && `+${formatNumber((upgrade.multiplier - 1) * 100)}% offline earnings`}
              {upgrade.type === 'all' && `+${formatNumber((upgrade.multiplier - 1) * 100)}% all production`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
