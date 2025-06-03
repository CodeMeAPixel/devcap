import { PrismaClient } from '@prisma/client';

/**
 * Default businesses data for seeding the database
 */
export const defaultBusinesses = [
  {
    name: 'Freelance Gig',
    description: 'Take on small coding projects for clients',
    baseCost: 10,
    baseProduction: 1,
    costMultiplier: 1.15,
    unlockRequirement: 0,
    imageUrl: '/images/businesses/freelance.jpg',
    iconUrl: '/images/icons/freelance.svg'
  },
  {
    name: 'SaaS Tool',
    description: 'A subscription-based software product',
    baseCost: 100,
    baseProduction: 5,
    costMultiplier: 1.15,
    unlockRequirement: 200,
    imageUrl: '/images/businesses/saas.jpg',
    iconUrl: '/images/icons/saas.svg'
  },
  {
    name: 'Startup Inc.',
    description: 'Your very own tech startup',
    baseCost: 1000,
    baseProduction: 20,
    costMultiplier: 1.15,
    unlockRequirement: 1000,
    imageUrl: '/images/businesses/startup.jpg',
    iconUrl: '/images/icons/startup.svg'
  },
  {
    name: 'Dev Agency',
    description: 'A team of developers working on client projects',
    baseCost: 10000,
    baseProduction: 100,
    costMultiplier: 1.15,
    unlockRequirement: 5000,
    imageUrl: '/images/businesses/agency.jpg',
    iconUrl: '/images/icons/agency.svg'
  },
  {
    name: 'Code Empire',
    description: 'A global tech conglomerate',
    baseCost: 100000,
    baseProduction: 500,
    costMultiplier: 1.15,
    unlockRequirement: 50000,
    imageUrl: '/images/businesses/empire.jpg',
    iconUrl: '/images/icons/empire.svg'
  },
  {
    name: 'Mobile App Studio',
    description: 'Develop and publish mobile applications',
    baseCost: 250000,
    baseProduction: 1000,
    costMultiplier: 1.2,
    unlockRequirement: 100000,
    imageUrl: '/images/businesses/mobile.jpg',
    iconUrl: '/images/icons/mobile.svg'
  },
  {
    name: 'Game Development Studio',
    description: 'Create and sell video games',
    baseCost: 500000,
    baseProduction: 2000,
    costMultiplier: 1.2,
    unlockRequirement: 250000,
    imageUrl: '/images/businesses/games.jpg',
    iconUrl: '/images/icons/games.svg'
  },
  {
    name: 'AI Research Lab',
    description: 'Advanced AI solutions for enterprises',
    baseCost: 1000000,
    baseProduction: 5000,
    costMultiplier: 1.25,
    unlockRequirement: 500000,
    imageUrl: '/images/businesses/ai.jpg',
    iconUrl: '/images/icons/ai-lab.svg'
  },
  {
    name: 'Blockchain Venture',
    description: 'Cutting-edge blockchain applications',
    baseCost: 5000000,
    baseProduction: 10000,
    costMultiplier: 1.25,
    unlockRequirement: 1000000,
    imageUrl: '/images/businesses/blockchain.jpg',
    iconUrl: '/images/icons/blockchain.svg'
  },
  {
    name: 'Global Tech Corp',
    description: 'Multinational technology corporation',
    baseCost: 10000000,
    baseProduction: 25000,
    costMultiplier: 1.3,
    unlockRequirement: 5000000,
    imageUrl: '/images/businesses/corp.jpg',
    iconUrl: '/images/icons/corp.svg'
  },
  {
    name: 'Space Tech Enterprise',
    description: 'Software for space exploration',
    baseCost: 50000000,
    baseProduction: 100000,
    costMultiplier: 1.3,
    unlockRequirement: 10000000,
    imageUrl: '/images/businesses/space.jpg',
    iconUrl: '/images/icons/space.svg'
  },
  {
    name: 'Quantum Computing Division',
    description: 'Next-generation quantum algorithms',
    baseCost: 100000000,
    baseProduction: 500000,
    costMultiplier: 1.35,
    unlockRequirement: 50000000,
    imageUrl: '/images/businesses/quantum.jpg',
    iconUrl: '/images/icons/quantum.svg'
  }
];

/**
 * Create default businesses in the database
 */
export async function createBusinesses(prisma: PrismaClient): Promise<void> {
  for (const business of defaultBusinesses) {
    await prisma.business.create({ data: business });
  }
  
  console.log(`Created ${defaultBusinesses.length} businesses`);
}