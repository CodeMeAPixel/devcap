import { Business } from '../slices/businessSlice';
import { TeamMember } from '../slices/teamSlice';
import { Upgrade } from '../slices/upgradeSlice';

export function calculatePassiveRate(
  businesses: Business[],
  teamMembers: TeamMember[],
  upgrades: Upgrade[]
): number {
  let rate = 0;
  
  // Add business production
  businesses.forEach(business => {
    if (business.level && business.level > 0) {
      let businessRate = business.baseProduction * business.level;
      
      // Apply business-specific upgrades
      upgrades.forEach(upgrade => {
        if (
          upgrade.purchased &&
          (upgrade.type === 'business' || upgrade.type === 'all') &&
          (!upgrade.targetId || upgrade.targetId === business.id)
        ) {
          businessRate *= upgrade.multiplier;
        }
      });
      
      rate += businessRate;
    }
  });
  
  // Add team member production
  teamMembers.forEach(teamMember => {
    if (teamMember.count && teamMember.count > 0) {
      let teamRate = teamMember.baseProduction * teamMember.count;
      
      // Apply team-specific upgrades
      upgrades.forEach(upgrade => {
        if (
          upgrade.purchased &&
          (upgrade.type === 'team' || upgrade.type === 'all') &&
          (!upgrade.targetId || upgrade.targetId === teamMember.id)
        ) {
          teamRate *= upgrade.multiplier;
        }
      });
      
      rate += teamRate;
    }
  });
  
  return Math.floor(rate);
}
