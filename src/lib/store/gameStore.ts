import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

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

export interface TeamMember {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseProduction: number;
  costMultiplier: number;
  unlockRequirement: number;
  imageUrl?: string;
  iconUrl?: string;
  count?: number;
  availableCount?: number;
}

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

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  type: string;
  reward: number;
  imageUrl?: string;
  iconUrl?: string;
  unlocked?: boolean;
  unlockedAt?: Date;
}

export interface GameState {
  userId: string | null;
  isLoading: boolean;
  isLoaded: boolean;
  isInitialized: boolean;
  loadError: string | null;
  lastSaved: Date | null;
  lastOnline: Date | null;
  currentLoC: number;
  totalLoC: number;
  locPerClick: number;
  passiveLocRate: number;
  offlineEarnings: number;
  businesses: Business[];
  teamMembers: TeamMember[];
  upgrades: Upgrade[];
  achievements: Achievement[];
  latestAchievement: Achievement | null;
}

// Add the missing GameActions interface
export interface GameActions {
  setUserId: (userId: string) => void;
  initializeGame: () => Promise<void>;
  loadGame: () => Promise<void>;
  saveGame: () => Promise<boolean>;
  calculateOfflineProgress: () => void;
  collectOfflineEarnings: () => void;
  addLoC: () => void;
  purchaseBusiness: (businessId: string) => void;
  hireTeamMember: (teamId: string) => void;
  assignManager: (businessId: string, teamMemberId: string) => void;
  unassignManager: (businessId: string, teamMemberId: string) => void;
  purchaseUpgrade: (upgradeId: string) => void;
  checkAchievements: () => void;
  clearLatestAchievement: () => void;
}

const defaultProgress = {
  linesOfCode: 0,
  currency: 0,
  totalEarned: 0,
  clickPower: 1,
};

// Create the game store
export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      // Initial state
      userId: null,
      isLoading: true,
      isLoaded: false,
      isInitialized: false,
      loadError: null,
      lastSaved: null,
      lastOnline: null,
      currentLoC: 0,
      totalLoC: 0,
      locPerClick: 1,
      passiveLocRate: 0,
      offlineEarnings: 0,
      businesses: [],
      teamMembers: [],
      upgrades: [],
      achievements: [],
      latestAchievement: null,
      
      // Set user ID
      setUserId: (userId: string) => {
        set({ userId });
      },
      
      // Initialize game data
      initializeGame: async () => {
        try {
          const response = await fetch('/api/game/data');
          if (!response.ok) {
            throw new Error('Failed to fetch game data');
          }
          
          const data = await response.json();
          
          set((state) => ({
            businesses: data.businesses.map((b: Business) => ({
              ...b,
              level: 0,
            })),
            teamMembers: data.teamMembers.map((t: TeamMember) => ({
              ...t,
              count: 0,
              availableCount: 0,
            })),
            upgrades: data.upgrades.map((u: Upgrade) => ({
              ...u,
              purchased: false,
            })),
            achievements: data.achievements.map((a: Achievement) => ({
              ...a,
              unlocked: false,
            })),
            isInitialized: true,
            isLoading: false,
          }));
        } catch (error) {
          console.error('Error initializing game:', error);
          set({ isLoading: false, loadError: (error as Error).message });
        }
      },
      
      // Load game data from server
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
          set((state) => ({
            currentLoC: data.progress?.currency || 0,
            totalLoC: data.progress?.totalEarned || 0,
            locPerClick: data.progress?.clickPower || 1,
            passiveLocRate: calculatePassiveRate(
              data.businesses || [], 
              data.team || [], 
              data.upgrades || []
            ),
            businesses: mergeBusinesses(state.businesses, data.businesses || []),
            teamMembers: mergeTeamMembers(state.teamMembers, data.team || []),
            upgrades: mergeUpgrades(state.upgrades, data.upgrades || []),
            achievements: mergeAchievements(state.achievements, data.achievements || []),
            lastSaved: data.progress?.updatedAt ? new Date(data.progress.updatedAt) : new Date(),
            lastOnline: data.progress?.lastActive ? new Date(data.progress.lastActive) : new Date(),
            isLoaded: true,
            isLoading: false,
            loadError: null
          }));
          
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
      
      // Save game data to server
      saveGame: async () => {
        try {
          const state = get();
          
          if (!state.userId) {
            console.warn('No user ID found, cannot save game data');
            return;
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
      
      // Calculate offline progress
      calculateOfflineProgress: () => {
        const state = get();
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
      
      // Collect offline earnings
      collectOfflineEarnings: () => {
        const state = get();
        if (state.offlineEarnings <= 0) return;
        
        set((state) => ({
          currentLoC: state.currentLoC + state.offlineEarnings,
          totalLoC: state.totalLoC + state.offlineEarnings,
          offlineEarnings: 0,
        }));
        
        // Check for new achievements
        get().checkAchievements();
      },
      
      // Add lines of code by clicking
      addLoC: () => {
        set((state) => ({
          currentLoC: state.currentLoC + state.locPerClick,
          totalLoC: state.totalLoC + state.locPerClick,
        }));
        
        // Check for new achievements
        get().checkAchievements();
      },
      
      // Purchase a business
      purchaseBusiness: (businessId: string) => {
        const state = get();
        const businessIndex = state.businesses.findIndex(b => b.id === businessId);
        
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
        set((state) => {
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
        get().checkAchievements();
      },
      
      // Hire a team member
      hireTeamMember: (teamId: string) => {
        const state = get();
        const teamIndex = state.teamMembers.findIndex(t => t.id === teamId);
        
        if (teamIndex === -1) return;
        
        const teamMember = state.teamMembers[teamIndex];
        const count = teamMember.count || 0;
        const cost = calculateTeamCost(
          teamMember.baseCost,
          teamMember.costMultiplier,
          count
        );
        
        if (state.currentLoC < cost) return;
        
        // Update team member count and LoC
        set((state) => {
          const updatedTeamMembers = [...state.teamMembers];
          updatedTeamMembers[teamIndex] = {
            ...updatedTeamMembers[teamIndex],
            count: (updatedTeamMembers[teamIndex].count || 0) + 1,
            availableCount: (updatedTeamMembers[teamIndex].availableCount || 0) + 1,
          };
          
          // Recalculate passive income rate
          const newPassiveRate = calculatePassiveRate(
            state.businesses,
            updatedTeamMembers,
            state.upgrades
          );
          
          return {
            teamMembers: updatedTeamMembers,
            currentLoC: state.currentLoC - cost,
            passiveLocRate: newPassiveRate,
          };
        });
        
        // Check for team-related achievements
        get().checkAchievements();
      },
      
      // Assign a manager to a business
      assignManager: (businessId: string, teamMemberId: string) => {
        const state = get();
        const businessIndex = state.businesses.findIndex(b => b.id === businessId);
        const teamIndex = state.teamMembers.findIndex(t => t.id === teamMemberId);
        
        if (businessIndex === -1 || teamIndex === -1) return;
        
        const teamMember = state.teamMembers[teamIndex];
        
        if (!teamMember.availableCount || teamMember.availableCount <= 0) return;
        
        // Update business and team member
        set((state) => {
          const updatedBusinesses = [...state.businesses];
          const updatedTeamMembers = [...state.teamMembers];
          
          // Increment assigned managers for the business
          updatedBusinesses[businessIndex] = {
            ...updatedBusinesses[businessIndex],
            assignedManagers: (updatedBusinesses[businessIndex].assignedManagers || 0) + 1,
          };
          
          // Decrement available team members
          updatedTeamMembers[teamIndex] = {
            ...updatedTeamMembers[teamIndex],
            availableCount: (updatedTeamMembers[teamIndex].availableCount || 1) - 1,
          };
          
          return {
            businesses: updatedBusinesses,
            teamMembers: updatedTeamMembers,
          };
        });
      },
      
      // Unassign a manager from a business
      unassignManager: (businessId: string, teamMemberId: string) => {
        const state = get();
        const businessIndex = state.businesses.findIndex(b => b.id === businessId);
        const teamIndex = state.teamMembers.findIndex(t => t.id === teamMemberId);
        
        if (businessIndex === -1 || teamIndex === -1) return;
        
        const business = state.businesses[businessIndex];
        
        if (!business.assignedManagers || business.assignedManagers <= 0) return;
        
        // Update business and team member
        set((state) => {
          const updatedBusinesses = [...state.businesses];
          const updatedTeamMembers = [...state.teamMembers];
          
          // Decrement assigned managers for the business
          updatedBusinesses[businessIndex] = {
            ...updatedBusinesses[businessIndex],
            assignedManagers: (updatedBusinesses[businessIndex].assignedManagers || 1) - 1,
          };
          
          // Increment available team members
          updatedTeamMembers[teamIndex] = {
            ...updatedTeamMembers[teamIndex],
            availableCount: (updatedTeamMembers[teamIndex].availableCount || 0) + 1,
          };
          
          return {
            businesses: updatedBusinesses,
            teamMembers: updatedTeamMembers,
          };
        });
      },
      
      // Purchase an upgrade
      purchaseUpgrade: (upgradeId: string) => {
        const state = get();
        const upgradeIndex = state.upgrades.findIndex(u => u.id === upgradeId);
        
        if (upgradeIndex === -1) return;
        
        const upgrade = state.upgrades[upgradeIndex];
        
        if (upgrade.purchased || state.currentLoC < upgrade.cost) return;
        
        // Update upgrade and LoC
        set((state) => {
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
        get().checkAchievements();
      },
      
      // Check for new achievements
      checkAchievements: () => {
        const state = get();
        let latestAchievement: Achievement | null = null;
        
        const updatedAchievements = state.achievements.map(achievement => {
          if (achievement.unlocked) return achievement;
          
          let isUnlocked = false;
          
          // Check if the achievement should be unlocked
          switch (achievement.type) {
            case 'loC':
              isUnlocked = state.totalLoC >= achievement.requirement;
              break;
            case 'business':
              const businessCount = state.businesses.reduce(
                (count, b) => count + (b.level && b.level > 0 ? 1 : 0),
                0
              );
              isUnlocked = businessCount >= achievement.requirement;
              break;
            case 'team':
              const teamCount = state.teamMembers.reduce(
                (count, t) => count + (t.count || 0),
                0
              );
              isUnlocked = teamCount >= achievement.requirement;
              break;
            case 'upgrade':
              const upgradeCount = state.upgrades.filter(u => u.purchased).length;
              isUnlocked = upgradeCount >= achievement.requirement;
              break;
            case 'production':
              isUnlocked = state.passiveLocRate >= achievement.requirement;
              break;
          }
          
          if (isUnlocked) {
            // Save the latest achievement for notification
            latestAchievement = {
              ...achievement,
              unlocked: true,
              unlockedAt: new Date(),
            };
            
            // Add the reward to currency
            set((state) => ({
              currentLoC: state.currentLoC + achievement.reward,
              totalLoC: state.totalLoC + achievement.reward,
            }));
            
            return latestAchievement;
          }
          
          return achievement;
        });
        
        if (latestAchievement) {
          set({
            achievements: updatedAchievements,
            latestAchievement,
          });
        }
      },
      
      // Clear latest achievement after showing notification
      clearLatestAchievement: () => {
        set({ latestAchievement: null });
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

// Helper functions
function calculateBusinessCost(baseCost: number, multiplier: number, level: number): number {
  return Math.floor(baseCost * Math.pow(multiplier, level));
}

function calculateTeamCost(baseCost: number, multiplier: number, count: number): number {
  return Math.floor(baseCost * Math.pow(multiplier, count));
}

function calculatePassiveRate(
  businesses: Business[],
  teamMembers: TeamMember[],
  upgrades: Upgrade[]
): number {
  let rate = 0;
  
  // Add business production
  businesses.forEach(business => {
    if (business.level && business.level > 0) {
      let businessRate = business.baseProduction * business.level;
      
      // Apply business-specific upgrades
      upgrades.forEach(upgrade => {
        if (
          upgrade.purchased &&
          (upgrade.type === 'business' || upgrade.type === 'all') &&
          (!upgrade.targetId || upgrade.targetId === business.id)
        ) {
          businessRate *= upgrade.multiplier;
        }
      });
      
      rate += businessRate;
    }
  });
  
  // Add team member production
  teamMembers.forEach(teamMember => {
    if (teamMember.count && teamMember.count > 0) {
      let teamRate = teamMember.baseProduction * teamMember.count;
      
      // Apply team-specific upgrades
      upgrades.forEach(upgrade => {
        if (
          upgrade.purchased &&
          (upgrade.type === 'team' || upgrade.type === 'all') &&
          (!upgrade.targetId || upgrade.targetId === teamMember.id)
        ) {
          teamRate *= upgrade.multiplier;
        }
      });
      
      rate += teamRate;
    }
  });
  
  return Math.floor(rate);
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

function mergeTeamMembers(initialTeam: TeamMember[], loadedTeam: TeamMember[]): TeamMember[] {
  return initialTeam.map(teamMember => {
    const loadedMember = loadedTeam.find(t => t.id === teamMember.id);
    return loadedMember
      ? { ...teamMember, ...loadedMember }
      : teamMember;
  });
}

function mergeUpgrades(initialUpgrades: Upgrade[], loadedUpgrades: Upgrade[]): Upgrade[] {
  return initialUpgrades.map(upgrade => {
    const loadedUpgrade = loadedUpgrades.find(u => u.id === upgrade.id);
    return loadedUpgrade
      ? { ...upgrade, purchased: true }
      : upgrade;
  });
}

function mergeAchievements(initialAchievements: Achievement[], loadedAchievements: Achievement[]): Achievement[] {
  return initialAchievements.map(achievement => {
    const loadedAchievement = loadedAchievements.find(a => a.id === achievement.id);
    return loadedAchievement
      ? { ...achievement, unlocked: true, unlockedAt: loadedAchievement.unlockedAt }
      : achievement;
  });
}
