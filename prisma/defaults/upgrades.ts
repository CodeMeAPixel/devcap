import { PrismaClient } from '@prisma/client';

/**
 * Default upgrades data for seeding the database
 */
export const defaultUpgrades = [
  {
    name: 'Mechanical Keyboard',
    description: 'Doubles your clicking efficiency',
    cost: 500,
    type: 'click',
    multiplier: 2,
    unlockRequirement: 100,
    imageUrl: '/images/upgrades/keyboard.jpg',
    iconUrl: '/images/icons/keyboard.svg'
  },
  {
    name: 'TypeScript Mastery',
    description: 'Increases all business production by 50%',
    cost: 2000,
    type: 'business',
    multiplier: 1.5,
    unlockRequirement: 1000,
    imageUrl: '/images/upgrades/typescript.jpg',
    iconUrl: '/images/icons/typescript.svg'
  },
  {
    name: 'Cloud IDE',
    description: 'Increases team productivity by 75%',
    cost: 5000,
    type: 'team',
    multiplier: 1.75,
    unlockRequirement: 2500,
    imageUrl: '/images/upgrades/cloud-ide.jpg',
    iconUrl: '/images/icons/cloud.svg'
  },
  {
    name: 'CI/CD Automation',
    description: 'Doubles all production rates',
    cost: 10000,
    type: 'all',
    multiplier: 2,
    unlockRequirement: 5000,
    imageUrl: '/images/upgrades/cicd.jpg',
    iconUrl: '/images/icons/automation.svg'
  },
  {
    name: 'Offline Income Booster',
    description: 'Increases offline income by 25%',
    cost: 7500,
    type: 'offline',
    multiplier: 1.25,
    unlockRequirement: 3000,
    imageUrl: '/images/upgrades/offline.jpg',
    iconUrl: '/images/icons/offline.svg'
  },
  {
    name: 'Ergonomic Chair',
    description: 'Triple your clicking efficiency',
    cost: 25000,
    type: 'click',
    multiplier: 3,
    unlockRequirement: 15000,
    imageUrl: '/images/upgrades/chair.jpg',
    iconUrl: '/images/icons/chair.svg'
  },
  {
    name: 'React Expertise',
    description: 'Increases frontend business production by 100%',
    cost: 50000,
    type: 'business',
    multiplier: 2,
    targetId: 'frontend', // This would need to be updated to match business ID
    unlockRequirement: 20000,
    imageUrl: '/images/upgrades/react.jpg',
    iconUrl: '/images/icons/react.svg'
  },
  {
    name: 'Team Management Course',
    description: 'Increases team productivity by 150%',
    cost: 100000,
    type: 'team',
    multiplier: 2.5,
    unlockRequirement: 50000,
    imageUrl: '/images/upgrades/management.jpg',
    iconUrl: '/images/icons/management.svg'
  },
  {
    name: 'Microservices Architecture',
    description: 'Triples all production rates',
    cost: 500000,
    type: 'all',
    multiplier: 3,
    unlockRequirement: 100000,
    imageUrl: '/images/upgrades/microservices.jpg',
    iconUrl: '/images/icons/microservices.svg'
  },
  {
    name: 'Server-side Caching',
    description: 'Increases backend business production by 200%',
    cost: 75000,
    type: 'business',
    multiplier: 3,
    targetId: 'backend', // This would need to be updated to match business ID
    unlockRequirement: 30000,
    imageUrl: '/images/upgrades/caching.jpg',
    iconUrl: '/images/icons/caching.svg'
  },
  {
    name: 'Multiple Monitors',
    description: 'Quadruples your clicking efficiency',
    cost: 150000,
    type: 'click',
    multiplier: 4,
    unlockRequirement: 75000,
    imageUrl: '/images/upgrades/monitors.jpg',
    iconUrl: '/images/icons/monitors.svg'
  },
  {
    name: 'Offshore Team',
    description: 'Doubles offline income',
    cost: 200000,
    type: 'offline',
    multiplier: 2,
    unlockRequirement: 100000,
    imageUrl: '/images/upgrades/offshore.jpg',
    iconUrl: '/images/icons/offshore.svg'
  }
];

/**
 * Create default upgrades in the database
 */
export async function createUpgrades(prisma: PrismaClient): Promise<void> {
  for (const upgrade of defaultUpgrades) {
    await prisma.upgrade.create({ data: upgrade });
  }
  
  console.log(`Created ${defaultUpgrades.length} upgrades`);
}