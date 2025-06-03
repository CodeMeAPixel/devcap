import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all game entities for the game store initialization
    const businesses = await prisma.business.findMany({
      orderBy: { unlockRequirement: 'asc' }
    });
    
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { unlockRequirement: 'asc' }
    });
    
    const upgrades = await prisma.upgrade.findMany({
      orderBy: { unlockRequirement: 'asc' }
    });
    
    const achievements = await prisma.achievement.findMany({
      orderBy: { requirement: 'asc' }
    });
    
    return NextResponse.json({
      businesses,
      teamMembers,
      upgrades,
      achievements
    });
  } catch (error) {
    console.error('Error fetching game data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game data' },
      { status: 500 }
    );
  }
}
