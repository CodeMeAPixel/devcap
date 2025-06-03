import { PrismaClient } from '@prisma/client';

/**
 * Default team members data for seeding the database
 */
export const defaultTeamMembers = [
  {
    name: 'Frontend Dev',
    description: 'Specializes in user interfaces and experience',
    baseCost: 50,
    baseProduction: 2,
    costMultiplier: 1.15,
    unlockRequirement: 100,
    imageUrl: '/images/team/frontend.jpg',
    iconUrl: '/images/icons/frontend.svg'
  },
  {
    name: 'Backend Dev',
    description: 'Works on server-side logic and databases',
    baseCost: 200,
    baseProduction: 5,
    costMultiplier: 1.15,
    unlockRequirement: 500,
    imageUrl: '/images/team/backend.jpg',
    iconUrl: '/images/icons/backend.svg'
  },
  {
    name: 'QA Tester',
    description: 'Ensures code quality and finds bugs',
    baseCost: 100,
    baseProduction: 3,
    costMultiplier: 1.15,
    unlockRequirement: 300,
    imageUrl: '/images/team/qa.jpg',
    iconUrl: '/images/icons/qa.svg'
  },
  {
    name: 'AI Assistant',
    description: 'Uses AI to help with coding tasks',
    baseCost: 500,
    baseProduction: 10,
    costMultiplier: 1.15,
    unlockRequirement: 1000,
    imageUrl: '/images/team/ai.jpg',
    iconUrl: '/images/icons/ai.svg'
  },
  {
    name: 'DevOps Engineer',
    description: 'Manages deployment pipelines and infrastructure',
    baseCost: 800,
    baseProduction: 15,
    costMultiplier: 1.15,
    unlockRequirement: 2000,
    imageUrl: '/images/team/devops.jpg',
    iconUrl: '/images/icons/devops.svg'
  },
  {
    name: 'UX Designer',
    description: 'Creates intuitive user experiences',
    baseCost: 300,
    baseProduction: 7,
    costMultiplier: 1.15,
    unlockRequirement: 1500,
    imageUrl: '/images/team/ux.jpg',
    iconUrl: '/images/icons/ux.svg'
  },
  {
    name: 'Mobile Developer',
    description: 'Builds native mobile applications',
    baseCost: 1000,
    baseProduction: 20,
    costMultiplier: 1.2,
    unlockRequirement: 3000,
    imageUrl: '/images/team/mobile.jpg',
    iconUrl: '/images/icons/mobile-dev.svg'
  },
  {
    name: 'Data Scientist',
    description: 'Analyzes data to extract valuable insights',
    baseCost: 1500,
    baseProduction: 30,
    costMultiplier: 1.2,
    unlockRequirement: 5000,
    imageUrl: '/images/team/data.jpg',
    iconUrl: '/images/icons/data.svg'
  },
  {
    name: 'Security Specialist',
    description: 'Protects systems from vulnerabilities',
    baseCost: 2000,
    baseProduction: 40,
    costMultiplier: 1.2,
    unlockRequirement: 7500,
    imageUrl: '/images/team/security.jpg',
    iconUrl: '/images/icons/security.svg'
  },
  {
    name: 'Technical Lead',
    description: 'Manages and guides development teams',
    baseCost: 5000,
    baseProduction: 75,
    costMultiplier: 1.25,
    unlockRequirement: 10000,
    imageUrl: '/images/team/lead.jpg',
    iconUrl: '/images/icons/lead.svg'
  },
  {
    name: 'Cloud Architect',
    description: 'Designs scalable cloud infrastructures',
    baseCost: 10000,
    baseProduction: 150,
    costMultiplier: 1.25,
    unlockRequirement: 25000,
    imageUrl: '/images/team/cloud.jpg',
    iconUrl: '/images/icons/cloud-arch.svg'
  },
  {
    name: 'CTO',
    description: 'Chief Technology Officer directing tech strategy',
    baseCost: 50000,
    baseProduction: 500,
    costMultiplier: 1.3,
    unlockRequirement: 100000,
    imageUrl: '/images/team/cto.jpg',
    iconUrl: '/images/icons/cto.svg'
  }
];

/**
 * Create default team members in the database
 */
export async function createTeamMembers(prisma: PrismaClient): Promise<void> {
  for (const teamMember of defaultTeamMembers) {
    await prisma.teamMember.create({ data: teamMember });
  }
  
  console.log(`Created ${defaultTeamMembers.length} team members`);
}