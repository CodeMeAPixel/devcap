import { prisma } from '@/lib/prisma';
import { AdminUserList } from '@/components/admin/AdminUserList';

export default async function AdminUsersPage() {
  // Get all users with some game stats
  const users = await prisma.user.findMany({
    include: {
      userProgress: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Users</h1>
      </div>
      
      <AdminUserList users={users} />
    </div>
  );
}
