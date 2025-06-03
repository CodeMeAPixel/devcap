'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CodeClicker } from '@/components/game/CodeClicker';
import { GameTabs } from '@/components/game/GameTabs';
import { BusinessPanel } from '@/components/game/BusinessPanel';
import { useGameStore } from '@/lib/store/gameStore';
import { formatNumber } from '@/lib/utils';
import { useToast } from '@/components/providers/ToastProvider';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { OfflineEarningsModal } from '@/components/game/OfflineEarningsModal';
import { StoreInitializer } from '@/lib/store/StoreProvider';

export default function GamePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { 
    setUserId, 
    loadGame, 
    saveGame, 
    currentLoC, 
    totalLoC,
    passiveLocRate, 
    latestAchievement, 
    clearLatestAchievement,
    isLoading: gameLoading,
    calculateOfflineProgress,
  } = useGameStore();
  const { addToast } = useToast();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isMobileBusinessView, setIsMobileBusinessView] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Load game data when authenticated
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }
    
    if (session.user?.id) {
      console.log('Setting user ID and loading game');
      setUserId(session.user.id);
      loadGame().catch(err => {
        console.error('Error in game loading effect:', err);
        addToast({
          title: 'Error Loading Game',
          description: 'There was a problem loading your game data. Some features may be limited.',
          type: 'error'
        });
      });
    }
  }, [session, status, router, setUserId, loadGame, addToast]);

  // Auto-save game every minute
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const saveInterval = setInterval(() => {
        saveGame();
      }, 60000); // Every minute
      
      // Calculate offline progress when returning to the tab
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          calculateOfflineProgress();
        } else {
          // Save when tab becomes hidden
          saveGame();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        clearInterval(saveInterval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [status, session, saveGame, calculateOfflineProgress]);

  // Show achievement notification
  useEffect(() => {
    if (latestAchievement) {
      addToast({
        title: `Achievement Unlocked: ${latestAchievement.name}`,
        description: `${latestAchievement.description} - Reward: ${formatNumber(latestAchievement.reward)} LoC`,
        type: 'success',
      });
      
      clearLatestAchievement();
    }
  }, [latestAchievement, addToast, clearLatestAchievement]);

  // Handle manual save
  const handleSave = async () => {
    setSaveStatus('saving');
    await saveGame();
    setSaveStatus('saved');
    
    addToast({
      title: 'Game Saved',
      description: 'Your progress has been saved successfully',
      type: 'success',
    });
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setSaveStatus('idle');
    }, 3000);
  };

  // Show loading or error screen
  if (status === 'loading' || gameLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="game-card p-8 rounded-lg text-center shadow-lg">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Loading your empire</h1>
          <p className="text-muted-foreground">Preparing your coding adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <StoreInitializer />
      <div className="container mx-auto px-4 py-4 max-w-7xl relative z-10">
        {/* Top stats bar */}
        <div className="game-card p-4 mb-6 sticky top-0 z-20 bg-card/95 backdrop-blur-sm">
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
            <div className="flex items-center gap-6 flex-grow">
              <div>
                <div className="text-sm text-muted-foreground">Current LoC</div>
                <div className="text-xl font-mono font-semibold">{formatNumber(currentLoC)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total LoC</div>
                <div className="text-xl font-mono font-semibold">{formatNumber(totalLoC)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Per Second</div>
                <div className="text-xl font-mono font-semibold text-green-600 dark:text-green-400">{formatNumber(passiveLocRate)}</div>
              </div>
            </div>
            
            {/* Player info and save button */}
            <div className="flex gap-3 items-center">
              {session?.user?.name && (
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hidden md:block">
                  {session.user.name}
                </div>
              )}
              
              <Button 
                onClick={handleSave}
                size="sm"
                variant={saveStatus === 'saved' ? 'success' : 'default'}
                className="flex items-center gap-1"
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' && (
                  <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                )}
                {saveStatus === 'saved' ? 'Saved' : (saveStatus === 'saving' ? 'Saving' : 'Save')}
              </Button>
              
              {/* Mobile toggle for business view */}
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileBusinessView(!isMobileBusinessView)}
              >
                {isMobileBusinessView ? 'Hide' : 'Show'} Businesses
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column with clicker */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Code clicker section */}
            <div className="game-card p-6">
              <CodeClicker />
            </div>
            
            {/* Mobile business view (togglable) */}
            <div className={`md:hidden game-card p-4 ${isMobileBusinessView ? 'block' : 'hidden'}`}>
              <BusinessPanel />
            </div>
          </div>
          
          {/* Right column with tabs and always-visible businesses on desktop */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Always visible businesses section on desktop */}
            <div className="hidden md:block game-card p-6">
              <BusinessPanel />
            </div>
            
            {/* Tabs for other game elements */}
            <div className="game-card p-6">
              <GameTabs />
            </div>
          </div>
        </div>
        
        {/* Subtle background elements */}
        <div className="fixed top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 opacity-75"></div>
        <div className="fixed bottom-1/4 right-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -z-10 opacity-75"></div>
        
        {/* Offline earnings modal */}
        <OfflineEarningsModal />
      </div>
    </>
  );
}
