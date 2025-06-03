'use client';

import { useRef, useEffect } from 'react';
import { useGameStore } from './gameStore';

export function StoreInitializer() {
  const initialized = useRef(false);
  
  useEffect(() => {
    // This runs only on the client after hydration
    if (!initialized.current) {
      initialized.current = true;
      
      // Fix for hydration issues with Zustand persist
      try {
        // Force rehydration of persisted state
        const state = useGameStore.getState();
        useGameStore.setState({
          ...state,
          isInitialized: state.isInitialized || false,
          isLoading: state.isLoading !== undefined ? state.isLoading : true,
          isLoaded: state.isLoaded || false,
        });
        
        console.log('Store initialized on client');
      } catch (error) {
        console.error('Error initializing store on client:', error);
      }
    }
  }, []);
  
  return null;
}
