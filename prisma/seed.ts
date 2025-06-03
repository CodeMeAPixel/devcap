import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.userAchievement.deleteMany({});
  await prisma.userUpgrade.deleteMany({});
  await prisma.userTeam.deleteMany({});
  await prisma.userBusiness.deleteMany({});
  await prisma.userProgress.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.upgrade.deleteMany({});
  await prisma.teamMember.deleteMany({});
  await prisma.business.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.verificationToken.deleteMany({});

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Generate default avatar URL for admin
  const adminEmail = 'admin@capitalist.dev';
  const adminName = 'Admin User';
  const initials = adminName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // Create a hash from the email for consistent color generation
  const emailHash = adminEmail
    .split('')
    .reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0);
  const hue = Math.abs(emailHash % 360);
  
  // Default avatar URL using UI Avatars or similar service
  const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=hsl(${hue},70%,60%)&color=fff&size=200`;
  
  await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      isAdmin: true,
      image: defaultAvatarUrl, // Set the default avatar URL
    }
  });

  // Create businesses
  const businesses = [
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

  for (const business of businesses) {
    await prisma.business.create({ data: business });
  }

  // Create team members
  const teamMembers = [
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

  for (const teamMember of teamMembers) {
    await prisma.teamMember.create({ data: teamMember });
  }

  // Create upgrades
  const upgrades = [
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

  for (const upgrade of upgrades) {
    await prisma.upgrade.create({ data: upgrade });
  }

  // Create achievements
  const achievements = [
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

  for (const achievement of achievements) {
    await prisma.achievement.create({ data: achievement });
  }

  console.log('Database has been seeded with expanded game data!');
  console.log('Admin user created with email: admin@devcap.com and password: admin123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
