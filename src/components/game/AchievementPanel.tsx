import { useGameStore, Achievement } from '@/lib/store/gameStore';
import { formatNumber } from '@/lib/utils';

export function AchievementPanel() {
  const { achievements, totalLoC } = useGameStore();

  // Get unlocked achievements
  const unlockedAchievements = achievements.filter(achievement => achievement.unlocked);
  
  // Get locked but visible achievements (show next few to unlock)
  const visibleLockedAchievements = achievements
    .filter(achievement => !achievement.unlocked)
    .filter(achievement => {
      // Show achievement if it's within reasonable reach
      if (achievement.type === 'loC') {
        return achievement.requirement <= totalLoC * 5;
      }
      return true; // Show all non-LoC achievements
    })
    .slice(0, 3); // Show at most 3 upcoming achievements

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-bold">Achievements</h2>
      
      {unlockedAchievements.length === 0 && visibleLockedAchievements.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Keep coding to unlock achievements!
        </p>
      ) : (
        <div className="space-y-4">
          {unlockedAchievements.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Unlocked</h3>
              <div className="space-y-2">
                {unlockedAchievements.map(achievement => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={true}
                  />
                ))}
              </div>
            </div>
          )}
          
          {visibleLockedAchievements.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Coming Soon</h3>
              <div className="space-y-2">
                {visibleLockedAchievements.map(achievement => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
}

function AchievementCard({ achievement, unlocked }: AchievementCardProps) {
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'loC': return 'Code Written';
      case 'business': return 'Business';
      case 'team': return 'Team';
      default: return type;
    }
  };
  
  return (
    <div className={`border rounded-lg p-3 ${
      unlocked 
        ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20' 
        : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-semibold ${unlocked ? 'text-green-700 dark:text-green-400' : ''}`}>
            {achievement.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {achievement.description}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
            {getTypeLabel(achievement.type)}
          </span>
          {unlocked && achievement.reward > 0 && (
            <span className="text-xs text-green-600 dark:text-green-400 mt-1">
              +{formatNumber(achievement.reward)} LoC
            </span>
          )}
        </div>
      </div>
      
      {!unlocked && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Goal: {formatNumber(achievement.requirement)} {achievement.type === 'loC' ? 'LoC' : ''}</span>
          {achievement.reward > 0 && (
            <span className="ml-2">Reward: {formatNumber(achievement.reward)} LoC</span>
          )}
        </div>
      )}
    </div>
  );
}
