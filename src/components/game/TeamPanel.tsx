import { useGameStore, TeamMember } from '@/lib/store/gameStore';
import { Button } from '@/components/ui/Button';
import { formatNumber, calculateTeamCost } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function TeamPanel() {
  const { teamMembers, currentLoC, totalLoC, hireTeamMember } = useGameStore();

  const handleHire = (teamId: string) => {
    hireTeamMember(teamId);
  };

  // Filter team members that should be visible based on totalLoC
  const visibleTeams = teamMembers.filter(
    team => team.unlockRequirement <= totalLoC
  );

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400">Your Team</h2>
      
      {visibleTeams.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">No team members available yet.</div>
          <div className="text-sm text-muted-foreground">
            Keep coding to unlock team members!
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visibleTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TeamCard
                team={team}
                canAfford={currentLoC >= calculateTeamCost(
                  team.baseCost,
                  team.costMultiplier,
                  team.count || 0
                )}
                onHire={handleHire}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

interface TeamCardProps {
  team: TeamMember;
  canAfford: boolean;
  onHire: (id: string) => void;
}

function TeamCard({ team, canAfford, onHire }: TeamCardProps) {
  const count = team.count || 0;
  const cost = calculateTeamCost(
    team.baseCost,
    team.costMultiplier,
    count
  );
  const production = count > 0 ? team.baseProduction * count : team.baseProduction;
  
  return (
    <div className="game-card team-card p-4 h-full flex flex-col">
      <div className="relative mb-3">
        {/* Team Member Image */}
        <div className="w-full h-32 rounded-md overflow-hidden mb-2 relative">
          <Image 
            src={team.imageUrl || `/images/team/${team.id}.jpg`} 
            alt={team.name}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to default image if the team member image fails to load
              (e.target as any).src = '/images/team/default.jpg';
            }}
          />
          
          {/* Icon for hired team members */}
          {count > 0 && (
            <div className="absolute top-2 right-2 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs px-3 py-1 rounded-full font-semibold">
              Hired: {count}
            </div>
          )}
        </div>
        
        {/* Team Member info */}
        <div>
          <h3 className="font-bold text-amber-600 dark:text-amber-400">{team.name}</h3>
          <p className="text-xs text-muted-foreground">
            {team.description}
          </p>
        </div>
      </div>
      
      <div className="mt-auto space-y-3">
        {count > 0 ? (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-background/40 p-2 rounded">
              <div className="text-muted-foreground text-xs">Production</div>
              <div className="font-semibold text-amber-600 dark:text-amber-400">
                {formatNumber(production)} LoC/s
              </div>
            </div>
            <div className="bg-background/40 p-2 rounded">
              <div className="text-muted-foreground text-xs">Available</div>
              <div className="font-semibold text-amber-600 dark:text-amber-400">
                {team.availableCount || 0} / {count}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-muted-foreground text-sm">
            Not hired yet
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Hiring cost:
          </span>
          <span className={`font-mono font-medium ${canAfford ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatNumber(cost)} LoC
          </span>
        </div>
        
        <Button
          variant="team"
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          disabled={!canAfford}
          onClick={() => onHire(team.id)}
        >
          {count === 0 ? 'Hire' : 'Hire Another'}
        </Button>
      </div>
    </div>
  );
}
