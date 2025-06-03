import { StateCreator } from 'zustand';
import { calculatePassiveRate } from '../utils/calculations';
import { GameState } from '../gameStore';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: string;
  multiplier: number;
  targetId?: string;
  unlockRequirement: number;
  imageUrl?: string;
  iconUrl?: string;
  purchased?: boolean;
}

export interface UpgradeSlice {
  upgrades: Upgrade[];
  purchaseUpgrade: (upgradeId: string) => void;
  loadUpgradeData: (loadedUpgrades: Upgrade[]) => void;
}

export const createUpgradeSlice: StateCreator<GameState> = 
  (set, get, api) => ({
    upgrades: [],
    
    purchaseUpgrade: (upgradeId: string) => {
      const state = get() as GameState;
      const upgradeIndex = state.upgrades.findIndex((u: Upgrade) => u.id === upgradeId);
      
      if (upgradeIndex === -1) return;
      
      const upgrade = state.upgrades[upgradeIndex];
      
      if (upgrade.purchased || state.currentLoC < upgrade.cost) return;
      
      // Update upgrade and LoC
      set((state: GameState) => {
        const updatedUpgrades = [...state.upgrades];
        updatedUpgrades[upgradeIndex] = {
          ...updatedUpgrades[upgradeIndex],
          purchased: true,
        };
        
        // Apply upgrade effects
        let newLocPerClick = state.locPerClick;
        
        if (upgrade.type === 'click') {
          newLocPerClick *= upgrade.multiplier;
        }
        
        // Recalculate passive income rate
        const newPassiveRate = calculatePassiveRate(
          state.businesses,
          state.teamMembers,
          updatedUpgrades
        );
        
        return {
          upgrades: updatedUpgrades,
          currentLoC: state.currentLoC - upgrade.cost,
          locPerClick: newLocPerClick,
          passiveLocRate: newPassiveRate,
        };
      });
      
      // Check for upgrade-related achievements
      const fullState = get() as GameState;
      if (fullState.checkAchievements) {
        fullState.checkAchievements();
      }
    },
    
    loadUpgradeData: (loadedUpgrades: Upgrade[]) => {
      set((state: GameState) => ({
        upgrades: mergeUpgrades(state.upgrades, loadedUpgrades),
      }));
    },
  });

// Merge loaded data with initial data
function mergeUpgrades(initialUpgrades: Upgrade[], loadedUpgrades: Upgrade[]): Upgrade[] {
  return initialUpgrades.map(upgrade => {
    const loadedUpgrade = loadedUpgrades.find(u => u.id === upgrade.id);
    return loadedUpgrade
      ? { ...upgrade, purchased: true }
      : upgrade;
  });
}
