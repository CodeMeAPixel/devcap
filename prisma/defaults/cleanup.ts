import { PrismaClient } from '@prisma/client';

/**
 * Clean up all existing data in the database
 */
export async function cleanupDatabase(prisma: PrismaClient): Promise<void> {
  console.log('Cleaning up existing data...');
  
  // Delete data in reverse order of dependencies
  await prisma.userAchievement.deleteMany({});
  await prisma.userUpgrade.deleteMany({});
  await prisma.userTeam.deleteMany({});
  await prisma.userBusiness.deleteMany({});
  await prisma.userProgress.deleteMany({});
  await prisma.gameStats.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.upgrade.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.business.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  
  console.log('Database cleanup complete');
}
