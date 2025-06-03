import { StateCreator } from 'zustand';
import { calculatePassiveRate } from '../utils/calculations';

export interface Business {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseProduction: number;
  costMultiplier: number;
  unlockRequirement: number;
  imageUrl?: string;
  iconUrl?: string;
  level?: number;
  assignedManagers?: number;
  lastCollected?: Date;
}

export interface BusinessSlice {
  businesses: Business[];
  purchaseBusiness: (businessId: string) => void;
  loadBusinessData: (loadedBusinesses: Business[]) => void;
}

export const createBusinessSlice: StateCreator<BusinessSlice> = 
  (set, get, api) => ({
    businesses: [],
    
    purchaseBusiness: (businessId: string) => {
      const state = api.getState() as any;
      const businessIndex = state.businesses.findIndex((b: Business) => b.id === businessId);
      
      if (businessIndex === -1) return;
      
      const business = state.businesses[businessIndex];
      const level = business.level || 0;
      const cost = calculateBusinessCost(
        business.baseCost,
        business.costMultiplier,
        level
      );
      
      if (state.currentLoC < cost) return;
      
      // Update business level and LoC
      set((state: any) => {
        const updatedBusinesses = [...state.businesses];
        updatedBusinesses[businessIndex] = {
          ...updatedBusinesses[businessIndex],
          level: (updatedBusinesses[businessIndex].level || 0) + 1,
        };
        
        // Recalculate passive income rate
        const newPassiveRate = calculatePassiveRate(
          updatedBusinesses,
          state.teamMembers,
          state.upgrades
        );
        
        return {
          businesses: updatedBusinesses,
          currentLoC: state.currentLoC - cost,
          passiveLocRate: newPassiveRate,
        };
      });
      
      // Check for business-related achievements
      const fullState = api.getState() as any;
      if (fullState.checkAchievements) {
        fullState.checkAchievements();
      }
    },
    
    loadBusinessData: (loadedBusinesses: Business[]) => {
      set((state: any) => ({
        businesses: mergeBusinesses(state.businesses, loadedBusinesses),
      }));
    },
  });

// Helper functions
function calculateBusinessCost(baseCost: number, multiplier: number, level: number): number {
  return Math.floor(baseCost * Math.pow(multiplier, level));
}

// Merge loaded data with initial data
function mergeBusinesses(initialBusinesses: Business[], loadedBusinesses: Business[]): Business[] {
  return initialBusinesses.map(business => {
    const loadedBusiness = loadedBusinesses.find(b => b.id === business.id);
    return loadedBusiness
      ? { ...business, ...loadedBusiness }
      : business;
  });
}
