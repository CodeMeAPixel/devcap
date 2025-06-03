import { StateCreator } from 'zustand';

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

export interface AchievementSlice {
  achievements: Achievement[];
  latestAchievement: Achievement | null;
  checkAchievements: () => void;
  clearLatestAchievement: () => void;
  loadAchievementData: (loadedAchievements: Achievement[]) => void;
}

export const createAchievementSlice: StateCreator<AchievementSlice> = 
  (set, get, api) => ({
    achievements: [],
    latestAchievement: null,
    
    checkAchievements: () => {
      const state = api.getState() as any;
      let latestAchievement: Achievement | null = null;
      
      const updatedAchievements = state.achievements.map((achievement: Achievement) => {
        if (achievement.unlocked) return achievement;
        
        let isUnlocked = false;
        
        // Check if the achievement should be unlocked
        switch (achievement.type) {
          case 'loC':
            isUnlocked = state.totalLoC >= achievement.requirement;
            break;
          case 'business':
            const businessCount = state.businesses.reduce(
              (count: number, b: any) => count + (b.level && b.level > 0 ? 1 : 0),
              0
            );
            isUnlocked = businessCount >= achievement.requirement;
            break;
          case 'team':
            const teamCount = state.teamMembers.reduce(
              (count: number, t: any) => count + (t.count || 0),
              0
            );
            isUnlocked = teamCount >= achievement.requirement;
            break;
          case 'upgrade':
            const upgradeCount = state.upgrades.filter((u: any) => u.purchased).length;
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
          set((state: any) => ({
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
    
    clearLatestAchievement: () => {
      set({ latestAchievement: null });
    },
    
    loadAchievementData: (loadedAchievements: Achievement[]) => {
      set((state: any) => ({
        achievements: mergeAchievements(state.achievements, loadedAchievements),
      }));
    },
  });

// Merge loaded data with initial data
function mergeAchievements(initialAchievements: Achievement[], loadedAchievements: Achievement[]): Achievement[] {
  return initialAchievements.map(achievement => {
    const loadedAchievement = loadedAchievements.find(a => a.id === achievement.id);
    return loadedAchievement
      ? { ...achievement, unlocked: true, unlockedAt: loadedAchievement.unlockedAt }
      : achievement;
  });
}
