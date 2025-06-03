'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { formatNumber, formatTimeAgo } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function OfflineEarningsModal() {
  const { offlineEarnings, lastOnline, collectOfflineEarnings } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);

  // Show modal when offlineEarnings are available
  useEffect(() => {
    if (offlineEarnings && offlineEarnings > 0) {
      setIsOpen(true);
    }
  }, [offlineEarnings]);

  // No earnings, don't show the modal
  if (!offlineEarnings || offlineEarnings <= 0) {
    return null;
  }

  // Handle collection and close the modal
  const handleCollect = () => {
    collectOfflineEarnings();
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="game-card max-w-md w-full p-6 text-center relative overflow-hidden"
          >
            {/* Shiny effect at the top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30"></div>
            
            <div className="animate-float mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
            
            {lastOnline && (
              <p className="text-muted-foreground mb-4">
                You've been away for {formatTimeAgo(lastOnline)}
              </p>
            )}
            
            <div className="tech-terminal mb-6 py-3">
              <p>Your businesses have generated:</p>
              <p className="text-2xl font-bold text-primary mt-2">
                {formatNumber(offlineEarnings)} LoC
              </p>
            </div>
            
            <Button 
              onClick={handleCollect} 
              size="lg" 
              className="w-full mb-2 clicker-button"
            >
              Collect Earnings
            </Button>
            
            <p className="text-xs text-muted-foreground mt-2">
              Tip: Hire team members and assign them as managers to earn more while away!
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
