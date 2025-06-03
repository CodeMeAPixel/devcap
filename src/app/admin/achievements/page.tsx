import { prisma } from '@/lib/prisma';
import { AdminAchievementList } from '@/components/admin/AdminAchievementList';

export default async function AdminAchievementsPage() {
  // Get all achievements
  const achievements = await prisma.achievement.findMany({
    orderBy: {
      requirement: 'asc',
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Achievements</h1>
      </div>
      
      <AdminAchievementList achievements={achievements} />
    </div>
  );
}
