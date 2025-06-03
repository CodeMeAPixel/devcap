import { StateCreator } from 'zustand';

export interface ProgressSlice {
  currentLoC: number;
  totalLoC: number;
  locPerClick: number;
  passiveLocRate: number;
  offlineEarnings: number;
  addLoC: () => void;
  calculateOfflineProgress: () => void;
  collectOfflineEarnings: () => void;
  loadProgressData: (progress: any) => void;
}

export const createProgressSlice: StateCreator<ProgressSlice> = 
  (set, get, api) => ({
    currentLoC: 0,
    totalLoC: 0,
    locPerClick: 1,
    passiveLocRate: 0,
    offlineEarnings: 0,
    
    addLoC: () => {
      set((state: any) => ({
        currentLoC: state.currentLoC + state.locPerClick,
        totalLoC: state.totalLoC + state.locPerClick,
      }));
      
      // Check for new achievements
      const state = api.getState() as any;
      if (state.checkAchievements) {
        state.checkAchievements();
      }
    },
    
    calculateOfflineProgress: () => {
      const state = api.getState() as any;
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
      const state = api.getState() as any;
      if (state.offlineEarnings <= 0) return;
      
      set((state: any) => ({
        currentLoC: state.currentLoC + state.offlineEarnings,
        totalLoC: state.totalLoC + state.offlineEarnings,
        offlineEarnings: 0,
      }));
      
      // Check for new achievements
      if (state.checkAchievements) {
        state.checkAchievements();
      }
    },
    
    loadProgressData: (progress: any) => {
      set({
        currentLoC: progress?.currency || 0,
        totalLoC: progress?.totalEarned || 0,
        locPerClick: progress?.clickPower || 1,
      });
    },
  });
