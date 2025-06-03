import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get user session for authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be logged in' },
        { status: 401 }
      );
    }
    
    // Get userId from query or session
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || session.user.id;
    
    // Security check: only allow loading your own data
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden - Cannot load data for another user' },
        { status: 403 }
      );
    }
    
    // First verify that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Fetch user progress
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId }
    });
    
    // Create default progress if it doesn't exist
    let progress = userProgress;
    if (!progress) {
      console.log('Creating default progress for user:', userId);
      try {
        // Create default progress for new users
        progress = await prisma.userProgress.create({
          data: {
            userId,
            linesOfCode: 0,
            currency: 0,
            totalEarned: 0,
            clickPower: 1,
            offlineBonus: 0.5
          }
        });
        console.log('Default progress created successfully');
      } catch (error) {
        console.error('Error creating user progress:', error);
        // Continue without creating progress - we'll return defaults
        progress = {
          userId,
          linesOfCode: 0,
          currency: 0,
          totalEarned: 0,
          clickPower: 1,
          lastActive: new Date(),
          offlineBonus: 0.5,
          id: 'default',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
    }
    
    // Fetch game data with proper error handling
    try {
      // Fetch businesses
      const userBusinesses = await prisma.userBusiness.findMany({
        where: { userId },
        include: { business: true }
      });
      
      // Fetch team members
      const userTeam = await prisma.userTeam.findMany({
        where: { userId },
        include: { teamMember: true }
      });
      
      // Fetch upgrades
      const userUpgrades = await prisma.userUpgrade.findMany({
        where: { userId },
        include: { upgrade: true }
      });
      
      // Fetch achievements
      const userAchievements = await prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true }
      });
      
      // Return formatted game data
      return NextResponse.json({
        progress: progress,
        businesses: userBusinesses.map(ub => ({
          id: ub.businessId,
          level: ub.level,
          assignedManagers: ub.assignedManagers || 0,
          lastCollected: ub.lastCollected || new Date(),
          ...ub.business
        })),
        team: userTeam.map(ut => ({
          id: ut.teamMemberId,
          count: ut.count || 0,
          availableCount: ut.availableCount || 0,
          ...ut.teamMember
        })),
        upgrades: userUpgrades.map(uu => ({
          id: uu.upgradeId,
          purchased: true,
          ...uu.upgrade
        })),
        achievements: userAchievements.map(ua => ({
          id: ua.achievementId,
          unlocked: true,
          unlockedAt: ua.unlockedAt,
          ...ua.achievement
        }))
      });
    } catch (dbError) {
      console.error('Database error when fetching game data:', dbError);
      return NextResponse.json(
        { 
          error: 'Database error when loading game data', 
          details: (dbError as Error).message
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error loading game data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load game data', 
        details: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
}
