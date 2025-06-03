'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/lib/store/gameStore';

export function PassiveIncomeProcessor() {
  const { 
    passiveLocRate, 
    currentLoC, 
    totalLoC, 
    businesses,
    addPassiveIncome
  } = useGameStore();
  
  const lastUpdateTimeRef = useRef<number>(Date.now());
  
  // Update lines of code based on passive income rate
  useEffect(() => {
    if (passiveLocRate <= 0) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateTimeRef.current) / 1000; // in seconds
      lastUpdateTimeRef.current = now;
      
      const income = Math.floor(passiveLocRate * deltaTime);
      
      if (income > 0) {
        useGameStore.setState((state) => ({
          currentLoC: state.currentLoC + income,
          totalLoC: state.totalLoC + income,
        }));
      }
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [passiveLocRate]);
  
  // Check for new achievements based on total LoC
  useEffect(() => {
    const checkAchievements = useGameStore.getState().checkAchievements;
    
    const interval = setInterval(() => {
      checkAchievements();
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Return null as this is a utility component with no UI
  return null;
}
