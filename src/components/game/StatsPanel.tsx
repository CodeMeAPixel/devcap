import { useGameStore } from '@/lib/store/gameStore';
import { formatNumber } from '@/lib/utils';

export function StatsPanel() {
  const { 
    totalLoC, 
    currentLoC,
    locPerClick,
    passiveLocRate,
    businesses,
    teamMembers,
    upgrades,
    achievements,
    lastSaved
  } = useGameStore();

  // Calculate stats
  const totalBusinesses = businesses.reduce((sum, b) => sum + (b.level || 0), 0);
  const totalTeamMembers = teamMembers.reduce((sum, t) => sum + (t.count || 0), 0);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const purchasedUpgrades = upgrades.filter(u => u.purchased).length;

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-bold">Stats</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard title="Code Production">
          <StatItem label="Total Lines Written" value={formatNumber(totalLoC)} />
          <StatItem label="Current Lines" value={formatNumber(currentLoC)} />
          <StatItem label="Per Click" value={formatNumber(locPerClick)} />
          <StatItem label="Per Second" value={formatNumber(passiveLocRate)} />
        </StatsCard>
        
        <StatsCard title="Assets">
          <StatItem label="Businesses Owned" value={totalBusinesses.toString()} />
          <StatItem label="Team Members" value={totalTeamMembers.toString()} />
          <StatItem label="Upgrades Purchased" value={purchasedUpgrades.toString()} />
          <StatItem label="Achievements Unlocked" value={`${unlockedAchievements}/${achievements.length}`} />
        </StatsCard>
      </div>
      
      {lastSaved && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-2">
          Last saved: {new Date(lastSaved).toLocaleString()}
        </p>
      )}
    </div>
  );
}

interface StatsCardProps {
  title: string;
  children: React.ReactNode;
}

function StatsCard({ title, children }: StatsCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900 shadow-sm">
      <h3 className="font-semibold mb-3 pb-2 border-b border-gray-200 dark:border-gray-800">{title}</h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
