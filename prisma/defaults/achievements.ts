import { PrismaClient } from '@prisma/client';

/**
 * Default achievements data for seeding the database
 */
export const defaultAchievements = [
  {
    name: 'First Line',
    description: 'Write your first line of code',
    requirement: 1,
    type: 'loC',
    reward: 10,
    imageUrl: '/images/achievements/first-line.jpg',
    iconUrl: '/images/icons/achievement-basic.svg'
  },
  {
    name: 'Code Novice',
    description: 'Accumulate 1,000 lines of code',
    requirement: 1000,
    type: 'loC',
    reward: 100,
    imageUrl: '/images/achievements/novice.jpg',
    iconUrl: '/images/icons/achievement-bronze.svg'
  },
  {
    name: 'Code Master',
    description: 'Accumulate 10,000 lines of code',
    requirement: 10000,
    type: 'loC',
    reward: 1000,
    imageUrl: '/images/achievements/master.jpg',
    iconUrl: '/images/icons/achievement-silver.svg'
  },
  {
    name: 'Business Mogul',
    description: 'Own 10 businesses',
    requirement: 10,
    type: 'business',
    reward: 500,
    imageUrl: '/images/achievements/business.jpg',
    iconUrl: '/images/icons/achievement-gold.svg'
  },
  {
    name: 'Team Leader',
    description: 'Hire 10 team members',
    requirement: 10,
    type: 'team',
    reward: 500,
    imageUrl: '/images/achievements/team.jpg',
    iconUrl: '/images/icons/achievement-platinum.svg'
  },
  {
    name: 'Offline Earner',
    description: 'Earn 5,000 lines of code while offline',
    requirement: 5000,
    type: 'offline',
    reward: 1000,
    imageUrl: '/images/achievements/offline.jpg',
    iconUrl: '/images/icons/achievement-diamond.svg'
  },
  {
    name: 'Code Legend',
    description: 'Accumulate 100,000 lines of code',
    requirement: 100000,
    type: 'loC',
    reward: 10000,
    imageUrl: '/images/achievements/legend.jpg',
    iconUrl: '/images/icons/achievement-elite.svg'
  },
  {
    name: 'Code God',
    description: 'Accumulate 1,000,000 lines of code',
    requirement: 1000000,
    type: 'loC',
    reward: 100000,
    imageUrl: '/images/achievements/god.jpg',
    iconUrl: '/images/icons/achievement-mythic.svg'
  },
  {
    name: 'Corporate Empire',
    description: 'Own 50 businesses',
    requirement: 50,
    type: 'business',
    reward: 5000,
    imageUrl: '/images/achievements/empire.jpg',
    iconUrl: '/images/icons/achievement-legendary.svg'
  },
  {
    name: 'Team Empire',
    description: 'Hire 50 team members',
    requirement: 50,
    type: 'team',
    reward: 5000,
    imageUrl: '/images/achievements/team-empire.jpg',
    iconUrl: '/images/icons/achievement-epic.svg'
  },
  {
    name: 'Upgrade Master',
    description: 'Purchase 10 upgrades',
    requirement: 10,
    type: 'upgrade',
    reward: 2000,
    imageUrl: '/images/achievements/upgrade.jpg',
    iconUrl: '/images/icons/achievement-rare.svg'
  },
  {
    name: 'Passive Income',
    description: 'Reach 1000 LoC per second',
    requirement: 1000,
    type: 'production',
    reward: 5000,
    imageUrl: '/images/achievements/passive.jpg',
    iconUrl: '/images/icons/achievement-unique.svg'
  }
];

/**
 * Create default achievements in the database
 */
export async function createAchievements(prisma: PrismaClient): Promise<void> {
  for (const achievement of defaultAchievements) {
    await prisma.achievement.create({ data: achievement });
  }
  
  console.log(`Created ${defaultAchievements.length} achievements`);
}