import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get user session for authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const data = await request.json();
    const userId = session.user.id;
    
    // Security check: only allow saving your own data
    if (data.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden - Cannot save data for another user' },
        { status: 403 }
      );
    }
    
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update or create user progress
    const now = new Date();
    await prisma.userProgress.upsert({
      where: { userId },
      create: {
        userId,
        currency: data.currentLoC || 0,
        totalEarned: data.totalLoC || 0,
        linesOfCode: data.totalLoC || 0,
        clickPower: data.locPerClick || 1,
        lastActive: now,
        offlineBonus: 0.5
      },
      update: {
        currency: data.currentLoC || 0,
        totalEarned: data.totalLoC || 0,
        linesOfCode: data.totalLoC || 0,
        clickPower: data.locPerClick || 1,
        lastActive: now
      }
    });
    
    // Save businesses
    if (data.businesses && Array.isArray(data.businesses)) {
      for (const business of data.businesses) {
        if (business.level && business.level > 0) {
          await prisma.userBusiness.upsert({
            where: {
              userId_businessId: {
                userId,
                businessId: business.id
              }
            },
            create: {
              userId,
              businessId: business.id,
              level: business.level || 1,
              assignedManagers: business.assignedManagers || 0,
              lastCollected: business.lastCollected || now
            },
            update: {
              level: business.level,
              assignedManagers: business.assignedManagers || 0,
              lastCollected: business.lastCollected || now
            }
          });
        }
      }
    }
    
    // Save team members
    if (data.teamMembers && Array.isArray(data.teamMembers)) {
      for (const teamMember of data.teamMembers) {
        if (teamMember.count && teamMember.count > 0) {
          await prisma.userTeam.upsert({
            where: {
              userId_teamMemberId: {
                userId,
                teamMemberId: teamMember.id
              }
            },
            create: {
              userId,
              teamMemberId: teamMember.id,
              count: teamMember.count || 0,
              availableCount: teamMember.availableCount || 0
            },
            update: {
              count: teamMember.count,
              availableCount: teamMember.availableCount || 0
            }
          });
        }
      }
    }
    
    // Save upgrades
    if (data.upgrades && Array.isArray(data.upgrades)) {
      for (const upgrade of data.upgrades) {
        if (upgrade.purchased) {
          await prisma.userUpgrade.upsert({
            where: {
              userId_upgradeId: {
                userId,
                upgradeId: upgrade.id
              }
            },
            create: {
              userId,
              upgradeId: upgrade.id
            },
            update: {}
          });
        }
      }
    }
    
    // Save achievements
    if (data.achievements && Array.isArray(data.achievements)) {
      for (const achievement of data.achievements) {
        if (achievement.unlocked) {
          await prisma.userAchievement.upsert({
            where: {
              userId_achievementId: {
                userId,
                achievementId: achievement.id
              }
            },
            create: {
              userId,
              achievementId: achievement.id,
              unlockedAt: achievement.unlockedAt || now
            },
            update: {}
          });
        }
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      savedAt: now.toISOString() 
    });
    
  } catch (error) {
    console.error('Error saving game data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save game data', 
        details: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
}
