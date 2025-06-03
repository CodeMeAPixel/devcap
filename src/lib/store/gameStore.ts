import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createBusinessSlice, BusinessSlice } from './slices/businessSlice';
import { createTeamSlice, TeamSlice } from './slices/teamSlice';
import { createUpgradeSlice, UpgradeSlice } from './slices/upgradeSlice';
import { createAchievementSlice, AchievementSlice } from './slices/achievementSlice';
import { createProgressSlice, ProgressSlice } from './slices/progressSlice';

// Define base state interface
export interface GameState extends 
  BusinessSlice,
  TeamSlice,
  UpgradeSlice,
  AchievementSlice,
  ProgressSlice {
  userId: string | null;
  isLoading: boolean;
  isLoaded: boolean;
  isInitialized: boolean;
  loadError: string | null;
  lastSaved: Date | null;
  lastOnline: Date | null;
}

// Define base actions interface
export interface CoreActions {
  setUserId: (userId: string) => void;
  initializeGame: () => Promise<void>;
  loadGame: () => Promise<void>;
  saveGame: () => Promise<boolean>;
}

// Create the game store with domain-specific slices
export const useGameStore = create<GameState>()(
  persist(
    (set, get, api) => ({
      // Core state
      userId: null,
      isLoading: true,
      isLoaded: false,
      isInitialized: false,
      loadError: null,
      lastSaved: null,
      lastOnline: null,
      
      // Include slices
      ...createBusinessSlice(set, get, api),
      ...createTeamSlice(set, get, api),
      ...createUpgradeSlice(set, get, api),
      ...createAchievementSlice(set, get, api),
      ...createProgressSlice(set, get, api),
      
      // Core actions
      setUserId: (userId: string) => {
        set({ userId });
      },
      
      initializeGame: async () => {
        try {
          const response = await fetch('/api/game/data');
          if (!response.ok) {
            throw new Error('Failed to fetch game data');
          }
          
          const data = await response.json();
          
          set({
            businesses: data.businesses.map((b: any) => ({
              ...b,
              level: 0,
            })),
            teamMembers: data.teamMembers.map((t: any) => ({
              ...t,
              count: 0,
              availableCount: 0,
            })),
            upgrades: data.upgrades.map((u: any) => ({
              ...u,
              purchased: false,
            })),
            achievements: data.achievements.map((a: any) => ({
              ...a,
              unlocked: false,
            })),
            isInitialized: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error initializing game:', error);
          set({ isLoading: false, loadError: (error as Error).message });
        }
      },
      
      loadGame: async () => {
        try {
          const userId = get().userId;
          
          if (!userId) {
            console.warn('No user ID found, cannot load game data');
            return;
          }
          
          console.log('Loading game data for user:', userId);
          
          // Initialize game data first if not already initialized
          if (!get().isInitialized) {
            await get().initializeGame();
          }
          
          const response = await fetch(`/api/game/load?userId=${userId}`);
          
          console.log('Load response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error loading game data:', errorText);
            throw new Error(`Failed to load game data: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Game data loaded successfully');
          
          // Update game state with loaded data
          get().loadBusinessData(data.businesses || []);
          get().loadTeamData(data.team || []);
          get().loadUpgradeData(data.upgrades || []);
          get().loadAchievementData(data.achievements || []);
          get().loadProgressData(data.progress || {});
          
          set({
            lastSaved: data.progress?.updatedAt ? new Date(data.progress.updatedAt) : new Date(),
            lastOnline: data.progress?.lastActive ? new Date(data.progress.lastActive) : new Date(),
            isLoaded: true,
            isLoading: false,
            loadError: null
          });
          
          // Calculate offline earnings if we've been away
          get().calculateOfflineProgress();
        } catch (error) {
          console.error('Error loading game data:', error);
          
          // Set loaded but with error flag
          set({ 
            isLoaded: true, 
            isLoading: false,
            loadError: (error as Error).message 
          });
          
          // Initialize the game with default data if we failed to load but haven't initialized yet
          if (!get().isInitialized) {
            console.log('Initializing game with default data due to load failure');
            get().initializeGame();
          }
        }
      },
      
      saveGame: async () => {
        try {
          const state = get();
          
          if (!state.userId) {
            console.warn('No user ID found, cannot save game data');
            return false;
          }
          
          const gameData = {
            userId: state.userId,
            currentLoC: state.currentLoC,
            totalLoC: state.totalLoC,
            locPerClick: state.locPerClick,
            businesses: state.businesses,
            teamMembers: state.teamMembers,
            upgrades: state.upgrades,
            achievements: state.achievements,
          };
          
          const response = await fetch('/api/game/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameData),
          });
          
          if (!response.ok) {
            throw new Error('Failed to save game data');
          }
          
          const result = await response.json();
          set({ lastSaved: new Date(result.savedAt) });
          return true;
        } catch (error) {
          console.error('Error saving game data:', error);
          return false;
        }
      },
    }),
    {
      name: 'dev-cap-game-state',
      partialize: (state) => ({
        businesses: state.businesses,
        teamMembers: state.teamMembers,
        upgrades: state.upgrades,
        achievements: state.achievements,
        currentLoC: state.currentLoC,
        totalLoC: state.totalLoC,
        locPerClick: state.locPerClick,
        lastOnline: state.lastOnline,
      }),
    }
  )
);

// Selector functions for performance
export const useBusinesses = () => useGameStore(state => state.businesses);
export const useTeamMembers = () => useGameStore(state => state.teamMembers);
export const useUpgrades = () => useGameStore(state => state.upgrades);
export const useAchievements = () => useGameStore(state => state.achievements);
export const useProgress = () => useGameStore(state => ({
  currentLoC: state.currentLoC,
  totalLoC: state.totalLoC,
  locPerClick: state.locPerClick,
  passiveLocRate: state.passiveLocRate,
}));
export const useGameActions = () => useGameStore(state => ({
  addLoC: state.addLoC,
  purchaseBusiness: state.purchaseBusiness,
  hireTeamMember: state.hireTeamMember,
  purchaseUpgrade: state.purchaseUpgrade,
  saveGame: state.saveGame,
}));
