'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { formatNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function AchievementNotification() {
  const { latestAchievement, clearLatestAchievement } = useGameStore();
  
  // Automatically clear the notification after 5 seconds
  useEffect(() => {
    if (latestAchievement) {
      const timeout = setTimeout(() => {
        clearLatestAchievement();
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [latestAchievement, clearLatestAchievement]);
  
  return (
    <AnimatePresence>
      {latestAchievement && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-amber-100 dark:bg-amber-900/70 p-4 rounded-lg shadow-lg border border-amber-300 dark:border-amber-700 max-w-md">
            <div className="flex flex-col items-center text-center">
              <Badge variant="achievement" className="mb-2">Achievement Unlocked!</Badge>
              
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">
                {latestAchievement.name}
              </h3>
              
              <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                {latestAchievement.description}
              </p>
              
              {latestAchievement.reward > 0 && (
                <p className="mt-2 font-medium text-green-700 dark:text-green-400">
                  +{formatNumber(latestAchievement.reward)} LoC Bonus!
                </p>
              )}
              
              <button
                onClick={clearLatestAchievement}
                className="mt-3 text-xs text-amber-700 dark:text-amber-400 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
