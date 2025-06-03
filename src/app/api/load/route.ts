import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;
    const requestedUserId = searchParams.get('userId');
    
    // Ensure the user can only load their own data
    if (requestedUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user progress
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!userProgress) {
      // Create new user progress if it doesn't exist
      const newUserProgress = await prisma.userProgress.create({
        data: {
          userId,
          linesOfCode: 0,
          currency: 0,
          totalEarned: 0,
          clickPower: 1,
        },
      });
      
      return NextResponse.json({
        totalLoC: 0,
        currentLoC: 0,
        locPerClick: 1,
        passiveLocRate: 0,
        businesses: [],
        teamMembers: [],
        upgrades: [],
        achievements: [],
        lastSaved: new Date(),
      });
    }

    // Get businesses
    const userBusinesses = await prisma.userBusiness.findMany({
      where: { userId },
      include: { business: true },
    });

    // Get team members
    const userTeams = await prisma.userTeam.findMany({
      where: { userId },
      include: { teamMember: true },
    });

    // Get upgrades
    const userUpgrades = await prisma.userUpgrade.findMany({
      where: { userId },
      include: { upgrade: true },
    });

    // Get achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    // Format businesses
    const businesses = userBusinesses.map(ub => ({
      id: ub.business.id,
      name: ub.business.name,
      description: ub.business.description,
      baseCost: ub.business.baseCost,
      baseProduction: ub.business.baseProduction,
      costMultiplier: ub.business.costMultiplier,
      unlockRequirement: ub.business.unlockRequirement,
      level: ub.level,
    }));

    // Format team members
    const teamMembers = userTeams.map(ut => ({
      id: ut.teamMember.id,
      name: ut.teamMember.name,
      description: ut.teamMember.description,
      baseCost: ut.teamMember.baseCost,
      baseProduction: ut.teamMember.baseProduction,
      costMultiplier: ut.teamMember.costMultiplier,
      unlockRequirement: ut.teamMember.unlockRequirement,
      count: ut.count,
    }));

    // Format upgrades
    const upgrades = userUpgrades.map(uu => ({
      id: uu.upgrade.id,
      name: uu.upgrade.name,
      description: uu.upgrade.description,
      cost: uu.upgrade.cost,
      type: uu.upgrade.type,
      multiplier: uu.upgrade.multiplier,
      targetId: uu.upgrade.targetId,
      unlockRequirement: uu.upgrade.unlockRequirement,
      purchased: true,
    }));

    // Format achievements
    const achievements = userAchievements.map(ua => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
      requirement: ua.achievement.requirement,
      type: ua.achievement.type,
      reward: ua.achievement.reward,
      unlocked: true,
      unlockedAt: ua.unlockedAt,
    }));

    // Calculate passive income (simplified version)
    let passiveLocRate = 0;
    businesses.forEach(business => {
      if (business.level > 0) {
        passiveLocRate += business.baseProduction * business.level;
      }
    });

    teamMembers.forEach(team => {
      if (team.count > 0) {
        passiveLocRate += team.baseProduction * team.count;
      }
    });

    // Apply upgrade effects (simplified)
    upgrades.forEach(upgrade => {
      if (upgrade.type === 'all') {
        passiveLocRate *= upgrade.multiplier;
      }
    });

    return NextResponse.json({
      totalLoC: userProgress.totalEarned,
      currentLoC: userProgress.currency,
      locPerClick: userProgress.clickPower,
      passiveLocRate,
      businesses,
      teamMembers,
      upgrades,
      achievements,
      lastSaved: userProgress.updatedAt,
    });
  } catch (error) {
    console.error('Error loading game data:', error);
    return NextResponse.json({ error: 'Failed to load game data' }, { status: 500 });
  }
}
