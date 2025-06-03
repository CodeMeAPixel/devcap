'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { formatNumber } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/providers/ToastProvider';

export function GameHeader() {
  const { currentLoC, passiveLocRate, locPerClick, saveGame } = useGameStore();
  const { data: session } = useSession();
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);

  // Save progress when leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session?.user) {
        saveGame();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveGame, session?.user]);

  // Autosave every 2 minutes
  useEffect(() => {
    if (!isAutoSaveEnabled || !session?.user) return;

    const interval = setInterval(() => {
      handleSave(true);
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAutoSaveEnabled, session?.user]);

  const handleSave = async (isAuto = false) => {
    if (!session?.user) {
      addToast({
        title: 'Cannot Save',
        description: 'You need to be logged in to save your progress',
        type: 'warning'
      });
      return;
    }

    setIsSaving(true);
    
    try {
      await saveGame();
      setLastSaveTime(new Date());
      
      if (!isAuto) {
        addToast({
          title: 'Game Saved',
          description: 'Your progress has been saved successfully',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error saving game:', error);
      addToast({
        title: 'Save Error',
        description: 'Failed to save your progress. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-8 w-full sm:w-auto">
          <div>
            <h2 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lines of Code</h2>
            <p className="text-xl font-mono font-bold">{formatNumber(currentLoC)}</p>
          </div>
          
          <div>
            <h2 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Per Click</h2>
            <p className="text-sm font-mono">+{formatNumber(locPerClick)}</p>
          </div>
          
          <div>
            <h2 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Per Second</h2>
            <p className="text-sm font-mono">+{formatNumber(passiveLocRate)}/s</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSave()}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Game'}
          </Button>
          
          {lastSaveTime && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last saved: {lastSaveTime.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
