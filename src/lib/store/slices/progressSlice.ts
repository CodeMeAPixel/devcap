import { StateCreator } from 'zustand';
import { GameState } from '../gameStore';

export interface UserProgress {
  userId: string;
  linesOfCode: number;
  currency: number;
  totalEarned: number;
  clickPower: number;
  lastActive: Date;
  offlineBonus?: number;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressSlice {
  currentLoC: number;
  totalLoC: number;
  locPerClick: number;
  passiveLocRate: number;
  offlineEarnings: number;
  addLoC: () => void;
  calculateOfflineProgress: () => void;
  collectOfflineEarnings: () => void;
  loadProgressData: (progress: UserProgress) => void;
}

export const createProgressSlice: StateCreator<GameState> = 
  (set, get, api) => ({
    currentLoC: 0,
    totalLoC: 0,
    locPerClick: 1,
    passiveLocRate: 0,
    offlineEarnings: 0,
    
    addLoC: () => {
      set((state: GameState) => ({
        currentLoC: state.currentLoC + state.locPerClick,
        totalLoC: state.totalLoC + state.locPerClick,
      }));
      
      // Check for new achievements
      const state = get() as GameState;
      if (state.checkAchievements) {
        state.checkAchievements();
      }
    },
    
    calculateOfflineProgress: () => {
      const state = get() as GameState;
      const now = new Date();
      const lastOnline = state.lastOnline || now;
      
      // Calculate time difference in seconds
      const timeDiff = Math.floor((now.getTime() - lastOnline.getTime()) / 1000);
      
      // Only calculate if we've been away for at least 10 seconds
      if (timeDiff < 10) return;
      
      // Calculate earnings based on passive rate and time
      const earnings = Math.floor(state.passiveLocRate * timeDiff * 0.5); // 50% efficiency when offline
      
      if (earnings > 0) {
        set({ 
          offlineEarnings: earnings,
          lastOnline: now
        });
      }
    },
    
    collectOfflineEarnings: () => {
      const state = get() as GameState;
      if (state.offlineEarnings <= 0) return;
      
      set((state: GameState) => ({
        currentLoC: state.currentLoC + state.offlineEarnings,
        totalLoC: state.totalLoC + state.offlineEarnings,
        offlineEarnings: 0,
      }));
      
      // Check for new achievements
      const fullState = get() as GameState;
      if (fullState.checkAchievements) {
        fullState.checkAchievements();
      }
    },
    
    loadProgressData: (progress: UserProgress) => {
      set({
        currentLoC: progress?.currency || 0,
        totalLoC: progress?.totalEarned || 0,
        locPerClick: progress?.clickPower || 1,
      });
    },
  });
