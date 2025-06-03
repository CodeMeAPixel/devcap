import { prisma } from '@/lib/prisma';
import { AdminTeamMemberList } from '@/components/admin/AdminTeamMemberList';

export default async function AdminTeamMembersPage() {
  // Get all team members
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: {
      unlockRequirement: 'asc',
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Team Members</h1>
      </div>
      
      <AdminTeamMemberList teamMembers={teamMembers} />
    </div>
  );
}
