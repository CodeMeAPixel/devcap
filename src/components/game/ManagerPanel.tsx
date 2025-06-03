import { useState } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function ManagerPanel() {
  const { businesses, teamMembers, assignManager, unassignManager } = useGameStore();
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  // Filter only owned businesses
  const ownedBusinesses = businesses.filter(b => (b.level || 0) > 0);
  
  // Get available team members that can be assigned
  const availableManagers = teamMembers.filter(tm => (tm.availableCount || 0) > 0);
  
  const handleAssignManager = (teamMemberId: string) => {
    if (!selectedBusiness) return;
    assignManager(selectedBusiness, teamMemberId);
  };
  
  const handleUnassignManager = (businessId: string, teamMemberId: string) => {
    unassignManager(businessId, teamMemberId);
  };
  
  // Find assigned managers for each business
  const getAssignedManagerCount = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId);
    return business?.assignedManagers || 0;
  };

  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400">Manage Your Team</h2>
      
      {ownedBusinesses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Purchase businesses to assign managers to them
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1">
            <h3 className="text-lg font-semibold">Your Businesses</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ownedBusinesses.map(business => (
                <div 
                  key={business.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedBusiness === business.id 
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30' 
                      : 'border-gray-200 dark:border-gray-800 hover:border-amber-400'
                  }`}
                  onClick={() => setSelectedBusiness(business.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                      <Image 
                        src={business.imageUrl || '/images/businesses/default.jpg'} 
                        alt={business.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{business.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Level {business.level} • {getAssignedManagerCount(business.id)} managers
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedBusiness && (
            <>
              <div className="my-2 border-t border-gray-200 dark:border-gray-800"></div>
              
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Assign Managers</h3>
                
                {availableManagers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No available managers. Hire more team members!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableManagers.map(manager => (
                      <motion.div
                        key={manager.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 dark:border-gray-800 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <Image 
                                src={manager.imageUrl || '/images/team/default.jpg'} 
                                alt={manager.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{manager.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                +{formatNumber(manager.baseProduction * 1.2)} LoC/s boost
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleAssignManager(manager.id)}
                            className="px-3 py-1 text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                          >
                            Assign ({manager.availableCount} available)
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Show currently assigned managers for selected business */}
              {getAssignedManagerCount(selectedBusiness) > 0 && (
                <div className="mt-4 grid gap-3">
                  <h3 className="text-lg font-semibold">Current Managers</h3>
                  
                  {/* This would need to track which specific managers are assigned to which business */}
                  {/* For now, just show a placeholder */}
                  <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <p className="text-center text-muted-foreground">
                      {getAssignedManagerCount(selectedBusiness)} managers assigned to this business
                    </p>
                    <button
                      className="mt-2 w-full px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full hover:bg-red-200 transition-colors"
                      onClick={() => {
                        // This is simplified - in a real implementation you'd remove a specific manager
                        if (teamMembers.length > 0) {
                          unassignManager(selectedBusiness, teamMembers[0].id);
                        }
                      }}
                    >
                      Unassign Manager
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
