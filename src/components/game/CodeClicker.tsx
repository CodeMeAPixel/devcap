'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/lib/store/gameStore';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export function CodeClicker() {
  const { data: session } = useSession();
  const { locPerClick, addLoC, tick } = useGameStore();
  const [isClicking, setIsClicking] = useState(false);
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  const [nextId, setNextId] = useState(0);
  const clickerRef = useRef<HTMLDivElement>(null);

  // Handle game tick for passive income
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 100); // Update 10 times per second for smooth UI

    return () => clearInterval(interval);
  }, [tick]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Get click position relative to the button
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add a click effect at this position
    const id = Date.now();
    setClickEffects(prev => [...prev, { id, x, y }]);

    // Remove the effect after animation completes
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== id));
    }, 1000);

    // Add lines of code
    addLoC();
    setIsClicking(true);

    setTimeout(() => setIsClicking(false), 100);
  };

  // Generate typing effect text based on click count
  const getTypingText = () => {
    const texts = [
      'console.log("Hello, world!");',
      'const app = express();',
      'function calculateTotal() {',
      'useEffect(() => {',
      'import React from "react";',
      'return <Component />;',
      'await prisma.user.findMany();',
      'git commit -m "fix: bug"',
      'if (isValid) {',
      'class UserService {'
    ];

    return texts[nextId % texts.length];
  };

  return (
    <div className="flex flex-col items-center justify-center" ref={clickerRef}>
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">
          Developer Capitalist
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {session?.user?.name ? `Welcome, ${session.user.name}!` : 'Write code, build your empire'}
        </p>
      </div>
      
      <div className="relative w-full">
        <div className="relative">
          <Button
            onClick={handleClick}
            className={`${
              isClicking ? 'scale-95' : ''
            } transition-all duration-150 rounded-2xl bg-gradient-to-b from-primary/90 to-primary shadow-lg hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 active:shadow-inner w-44 h-44 md:w-56 md:h-56 flex flex-col items-center justify-center gap-3 p-0 mx-auto`}
          >
            <Image
              src="/code-button-icon.svg"
              alt="Write Code"
              width={64}
              height={64}
              className="drop-shadow-md"
            />
            <div className="flex flex-col items-center">
              <span className="text-lg md:text-xl font-semibold text-white">Write Code</span>
              <span className="text-sm mt-1 text-white/80">+{formatNumber(locPerClick)} LoC/click</span>
            </div>
          </Button>
          
          {/* Click effects */}
          <AnimatePresence>
            {clickEffects.map(effect => (
              <motion.div
                key={effect.id}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute bg-white rounded-full w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: effect.x, top: effect.y }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="tech-terminal w-full h-32 mb-6 flex items-center justify-center overflow-hidden relative">
        <div className="code-text">{getTypingText()}</div>
      </div>
      
      <style jsx global>{`
        @keyframes float-text {
          0% {
            transform: translateY(0) translateX(-50%);
            opacity: 1;
          }
          70% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-40px) translateX(-50%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
