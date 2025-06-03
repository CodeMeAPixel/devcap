import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { cleanupDatabase } from './defaults/cleanup';
import { createAdminUser } from './defaults/admin';
import { createBusinesses } from './defaults/businesses';
import { createTeamMembers } from './defaults/team-members';
import { createUpgrades } from './defaults/upgrades';
import { createAchievements } from './defaults/achievements';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    // Clean up existing data
    await cleanupDatabase(prisma);
    
    // Create admin user
    await createAdminUser(prisma);
    
    // Create game entities
    await createBusinesses(prisma);
    await createTeamMembers(prisma);
    await createUpgrades(prisma);
    await createAchievements(prisma);
    
    console.log('Database has been seeded successfully!');
    console.log('Admin credentials can be configured via ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSWORD environment variables');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
