import { prisma } from '@/lib/prisma';
import { AdminUpgradeList } from '@/components/admin/AdminUpgradeList';

export default async function AdminUpgradesPage() {
  // Get all upgrades
  const upgrades = await prisma.upgrade.findMany({
    orderBy: {
      unlockRequirement: 'asc',
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Upgrades</h1>
      </div>
      
      <AdminUpgradeList upgrades={upgrades} />
    </div>
  );
}
