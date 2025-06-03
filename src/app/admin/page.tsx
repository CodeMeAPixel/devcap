import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { AdminRecentUsers } from '@/components/admin/AdminRecentUsers';
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  // Get some basic stats for the dashboard
  const userCount = await prisma.user.count();
  const businessCount = await prisma.business.count();
  const teamMemberCount = await prisma.teamMember.count();
  const upgradeCount = await prisma.upgrade.count();
  const achievementCount = await prisma.achievement.count();
  
  // Get recent users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {session?.user.name || 'Admin'}
        </div>
      </div>
      
      <AdminStatsCards 
        userCount={userCount}
        businessCount={businessCount}
        teamMemberCount={teamMemberCount}
        upgradeCount={upgradeCount}
        achievementCount={achievementCount}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminRecentUsers users={recentUsers} />
        <AdminRecentActivity />
      </div>
    </div>
  );
}
