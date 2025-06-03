import { prisma } from '@/lib/prisma';
import { AdminBusinessList } from '@/components/admin/AdminBusinessList';

export default async function AdminBusinessesPage() {
  // Get all businesses
  const businesses = await prisma.business.findMany({
    orderBy: {
      unlockRequirement: 'asc',
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Businesses</h1>
      </div>
      
      <AdminBusinessList businesses={businesses} />
    </div>
  );
}
