import { 
  Users, 
  Briefcase, 
  Users2, 
  Zap, 
  Award 
} from 'lucide-react';

interface AdminStatsCardsProps {
  userCount: number;
  businessCount: number;
  teamMemberCount: number;
  upgradeCount: number;
  achievementCount: number;
}

export function AdminStatsCards({
  userCount,
  businessCount,
  teamMemberCount,
  upgradeCount,
  achievementCount
}: AdminStatsCardsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: userCount,
      icon: <Users className="text-blue-500" />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      title: 'Businesses',
      value: businessCount,
      icon: <Briefcase className="text-green-500" />,
      color: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
    },
    {
      title: 'Team Members',
      value: teamMemberCount,
      icon: <Users2 className="text-amber-500" />,
      color: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-700 dark:text-amber-300',
    },
    {
      title: 'Upgrades',
      value: upgradeCount,
      icon: <Zap className="text-purple-500" />,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
    },
    {
      title: 'Achievements',
      value: achievementCount,
      icon: <Award className="text-red-500" />,
      color: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`p-4 rounded-lg border ${stat.color}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className={`text-2xl font-semibold ${stat.textColor}`}>{stat.value}</p>
            </div>
            <div className="p-2 rounded-full bg-white dark:bg-gray-800">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
