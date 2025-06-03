'use client';

import { useRef, useEffect } from 'react';
import { useGameStore } from './gameStore';

export function StoreInitializer() {
  const initialized = useRef(false);
  
  useEffect(() => {
    // This runs only on the client after hydration
    if (!initialized.current) {
      initialized.current = true;
      
      // Any client-only initialization logic for the store
      const { isInitialized } = useGameStore.getState();
      
      if (!isInitialized) {
        useGameStore.setState({ isInitialized: true });
      }
    }
  }, []);
  
  return null;
}
