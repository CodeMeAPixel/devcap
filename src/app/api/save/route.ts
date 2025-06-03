import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const data = await request.json();
    
    // Ensure the user can only save their own data
    if (data.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update user progress
    await prisma.userProgress.upsert({
      where: { userId },
      update: {
        currency: data.currentLoC,
        totalEarned: data.totalLoC,
        clickPower: data.locPerClick,
        lastActive: new Date(),
      },
      create: {
        userId,
        currency: data.currentLoC,
        totalEarned: data.totalLoC,
        clickPower: data.locPerClick,
        lastActive: new Date(),
      },
    });

    // Update businesses
    for (const business of data.businesses) {
      if (business.level && business.level > 0) {
        await prisma.userBusiness.upsert({
          where: {
            userId_businessId: {
              userId,
              businessId: business.id,
            },
          },
          update: {
            level: business.level,
          },
          create: {
            userId,
            businessId: business.id,
            level: business.level,
          },
        });
      }
    }

    // Update team members
    for (const team of data.teamMembers) {
      if (team.count && team.count > 0) {
        await prisma.userTeam.upsert({
          where: {
            userId_teamMemberId: {
              userId,
              teamMemberId: team.id,
            },
          },
          update: {
            count: team.count,
          },
          create: {
            userId,
            teamMemberId: team.id,
            count: team.count,
          },
        });
      }
    }

    // Update upgrades
    for (const upgrade of data.upgrades) {
      if (upgrade.purchased) {
        await prisma.userUpgrade.upsert({
          where: {
            userId_upgradeId: {
              userId,
              upgradeId: upgrade.id,
            },
          },
          update: {},
          create: {
            userId,
            upgradeId: upgrade.id,
          },
        });
      }
    }

    // Update achievements
    for (const achievement of data.achievements) {
      if (achievement.unlocked) {
        await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: achievement.id,
            },
          },
          update: {},
          create: {
            userId,
            achievementId: achievement.id,
            unlockedAt: achievement.unlockedAt || new Date(),
          },
        });
      }
    }

    return NextResponse.json({ success: true, savedAt: new Date() });
  } catch (error) {
    console.error('Error saving game data:', error);
    return NextResponse.json({ error: 'Failed to save game data' }, { status: 500 });
  }
}
