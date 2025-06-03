import { useGameStore, Business } from '@/lib/store/gameStore';
import { Button } from '@/components/ui/Button';
import { formatNumber, calculateBusinessCost } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function BusinessPanel() {
  const { businesses, currentLoC, totalLoC, purchaseBusiness, teamMembers } = useGameStore();

  const handlePurchase = (businessId: string) => {
    purchaseBusiness(businessId);
  };

  // Show all businesses sorted by unlock requirement
  const allBusinesses = businesses.sort((a, b) => a.unlockRequirement - b.unlockRequirement);

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">Your Businesses</h2>
      
      {allBusinesses.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">No businesses available yet.</div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {allBusinesses.map((business, index) => {
            const isLocked = business.unlockRequirement > totalLoC;
            const level = business.level || 0;
            const cost = calculateBusinessCost(
              business.baseCost,
              business.costMultiplier,
              level
            );
            const canAfford = currentLoC >= cost;
            
            return (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BusinessCard
                  business={business}
                  canAfford={canAfford}
                  onPurchase={handlePurchase}
                  isLocked={isLocked}
                  cost={cost}
                  availableTeamMembers={teamMembers.filter(tm => tm.availableCount && tm.availableCount > 0)}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface BusinessCardProps {
  business: Business;
  canAfford: boolean;
  onPurchase: (id: string) => void;
  isLocked: boolean;
  cost: number;
  availableTeamMembers: any[];
}

function BusinessCard({ business, canAfford, onPurchase, isLocked, cost, availableTeamMembers }: BusinessCardProps) {
  const level = business.level || 0;
  const production = level > 0 ? business.baseProduction * level : business.baseProduction;
  const assignedManagers = business.assignedManagers || 0;
  
  return (
    <div className="game-card business-card p-4 h-full flex flex-col">
      <div className="relative mb-3">
        {/* Business Image */}
        <div className="w-full h-32 rounded-md overflow-hidden mb-2 relative">
          <Image 
            src={business.imageUrl || '/images/businesses/default.jpg'} 
            alt={business.name}
            fill
            className="object-cover"
          />
          
          {/* Level indicator for owned businesses */}
          {level > 0 && (
            <div className="absolute top-2 right-2 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full font-semibold">
              Level {level}
            </div>
          )}
        </div>
        
        {/* Business info */}
        <div>
          <h3 className="font-bold text-blue-700 dark:text-blue-300 flex justify-between items-center">
            {business.name}
            {isLocked && (
              <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded">
                Locked
              </span>
            )}
          </h3>
          <p className="text-xs text-muted-foreground">
            {business.description}
          </p>
        </div>
      </div>
      
      <div className="mt-auto space-y-3">
        {/* Production info for owned businesses */}
        {level > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-background/40 p-2 rounded">
                <div className="text-muted-foreground text-xs">Production</div>
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {formatNumber(production)} LoC/s
                </div>
              </div>
              <div className="bg-background/40 p-2 rounded">
                <div className="text-muted-foreground text-xs">Managers</div>
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {assignedManagers} assigned
                </div>
              </div>
            </div>
            
            {/* Progress bar for next production cycle */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-2 animate-pulse"
                style={{ width: '65%' }} // Would be dynamic based on time until next collection
              ></div>
            </div>
          </>
        ) : isLocked ? (
          <div className="relative">
            <div className="blur-sm select-none">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-background/40 p-2 rounded">
                  <div className="text-muted-foreground text-xs">Production</div>
                  <div className="font-semibold text-blue-600 dark:text-blue-400">
                    ?? LoC/s
                  </div>
                </div>
                <div className="bg-background/40 p-2 rounded">
                  <div className="text-muted-foreground text-xs">Managers</div>
                  <div className="font-semibold text-blue-600 dark:text-blue-400">
                    ?? assigned
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-3">
                <div className="bg-blue-500 h-2 w-0"></div>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-900/70 px-3 py-1.5 rounded text-white text-xs">
                Unlock at {formatNumber(business.unlockRequirement)} LoC
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 font-medium text-sm">
            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              Available to purchase
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {level === 0 ? 'Purchase cost:' : 'Next level:'}
          </span>
          <span className={`font-mono font-medium ${canAfford ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatNumber(cost)} LoC
          </span>
        </div>
        
        <Button
          variant="business"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!canAfford || isLocked}
          onClick={() => onPurchase(business.id)}
        >
          {level === 0 ? 'Purchase' : 'Upgrade'}
        </Button>
      </div>
    </div>
  );
}
