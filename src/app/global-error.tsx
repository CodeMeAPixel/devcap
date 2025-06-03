'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en" className="tech-ui">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <div className="mb-6">
            <Image
              src="/code-icon.svg"
              alt="Developer Capitalist"
              width={80}
              height={80}
              className="mx-auto"
            />
          </div>
          
          <h1 className="text-4xl font-bold mb-3">Critical Error</h1>
          
          <div className="game-card p-6 mb-6 max-w-md">
            <p className="text-xl mb-6">A critical error has occurred in the application.</p>
            
            <div className="tech-terminal text-sm mb-6">
              <p className="code-text">Fatal Error: {error.message || 'Unknown error'}</p>
              {error.digest && (
                <p className="mt-2 text-xs">Error ID: {error.digest}</p>
              )}
              <p className="mt-2">The application could not recover automatically.</p>
            </div>
            
            <Button onClick={reset} className="w-full">
              Attempt Recovery
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
