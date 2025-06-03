import { StateCreator } from 'zustand';
import { calculatePassiveRate } from '../utils/calculations';

export interface TeamMember {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseProduction: number;
  costMultiplier: number;
  unlockRequirement: number;
  imageUrl?: string;
  iconUrl?: string;
  count?: number;
  availableCount?: number;
}

export interface TeamSlice {
  teamMembers: TeamMember[];
  hireTeamMember: (teamId: string) => void;
  assignManager: (businessId: string, teamMemberId: string) => void;
  unassignManager: (businessId: string, teamMemberId: string) => void;
  loadTeamData: (loadedTeam: TeamMember[]) => void;
}

export const createTeamSlice: StateCreator<TeamSlice> = 
  (set, get, api) => ({
    teamMembers: [],
    
    hireTeamMember: (teamId: string) => {
      const state = api.getState() as any;
      const teamIndex = state.teamMembers.findIndex((t: TeamMember) => t.id === teamId);
      
      if (teamIndex === -1) return;
      
      const teamMember = state.teamMembers[teamIndex];
      const count = teamMember.count || 0;
      const cost = calculateTeamCost(
        teamMember.baseCost,
        teamMember.costMultiplier,
        count
      );
      
      if (state.currentLoC < cost) return;
      
      // Update team member count and LoC
      set((state: any) => {
        const updatedTeamMembers = [...state.teamMembers];
        updatedTeamMembers[teamIndex] = {
          ...updatedTeamMembers[teamIndex],
          count: (updatedTeamMembers[teamIndex].count || 0) + 1,
          availableCount: (updatedTeamMembers[teamIndex].availableCount || 0) + 1,
        };
        
        // Recalculate passive income rate
        const newPassiveRate = calculatePassiveRate(
          state.businesses,
          updatedTeamMembers,
          state.upgrades
        );
        
        return {
          teamMembers: updatedTeamMembers,
          currentLoC: state.currentLoC - cost,
          passiveLocRate: newPassiveRate,
        };
      });
      
      // Check for team-related achievements
      const fullState = api.getState() as any;
      if (fullState.checkAchievements) {
        fullState.checkAchievements();
      }
    },
    
    assignManager: (businessId: string, teamMemberId: string) => {
      const state = api.getState() as any;
      const businessIndex = state.businesses.findIndex((b: any) => b.id === businessId);
      const teamIndex = state.teamMembers.findIndex((t: TeamMember) => t.id === teamMemberId);
      
      if (businessIndex === -1 || teamIndex === -1) return;
      
      const teamMember = state.teamMembers[teamIndex];
      
      if (!teamMember.availableCount || teamMember.availableCount <= 0) return;
      
      // Update business and team member
      set((state: any) => {
        const updatedBusinesses = [...state.businesses];
        const updatedTeamMembers = [...state.teamMembers];
        
        // Increment assigned managers for the business
        updatedBusinesses[businessIndex] = {
          ...updatedBusinesses[businessIndex],
          assignedManagers: (updatedBusinesses[businessIndex].assignedManagers || 0) + 1,
        };
        
        // Decrement available team members
        updatedTeamMembers[teamIndex] = {
          ...updatedTeamMembers[teamIndex],
          availableCount: (updatedTeamMembers[teamIndex].availableCount || 1) - 1,
        };
        
        return {
          businesses: updatedBusinesses,
          teamMembers: updatedTeamMembers,
        };
      });
    },
    
    unassignManager: (businessId: string, teamMemberId: string) => {
      const state = api.getState() as any;
      const businessIndex = state.businesses.findIndex((b: any) => b.id === businessId);
      const teamIndex = state.teamMembers.findIndex((t: TeamMember) => t.id === teamMemberId);
      
      if (businessIndex === -1 || teamIndex === -1) return;
      
      const business = state.businesses[businessIndex];
      
      if (!business.assignedManagers || business.assignedManagers <= 0) return;
      
      // Update business and team member
      set((state: any) => {
        const updatedBusinesses = [...state.businesses];
        const updatedTeamMembers = [...state.teamMembers];
        
        // Decrement assigned managers for the business
        updatedBusinesses[businessIndex] = {
          ...updatedBusinesses[businessIndex],
          assignedManagers: (updatedBusinesses[businessIndex].assignedManagers || 1) - 1,
        };
        
        // Increment available team members
        updatedTeamMembers[teamIndex] = {
          ...updatedTeamMembers[teamIndex],
          availableCount: (updatedTeamMembers[teamIndex].availableCount || 0) + 1,
        };
        
        return {
          businesses: updatedBusinesses,
          teamMembers: updatedTeamMembers,
        };
      });
    },
    
    loadTeamData: (loadedTeam: TeamMember[]) => {
      set((state: any) => ({
        teamMembers: mergeTeamMembers(state.teamMembers, loadedTeam),
      }));
    },
  });

// Helper functions
function calculateTeamCost(baseCost: number, multiplier: number, count: number): number {
  return Math.floor(baseCost * Math.pow(multiplier, count));
}

// Merge loaded data with initial data
function mergeTeamMembers(initialTeam: TeamMember[], loadedTeam: TeamMember[]): TeamMember[] {
  return initialTeam.map(teamMember => {
    const loadedMember = loadedTeam.find(t => t.id === teamMember.id);
    return loadedMember
      ? { ...teamMember, ...loadedMember }
      : teamMember;
  });
}
