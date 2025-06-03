'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
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
      
      <h1 className="text-4xl font-bold mb-3">Something Went Wrong</h1>
      
      <div className="game-card p-6 mb-6 max-w-md">
        <p className="text-xl mb-6">Oops! We encountered an error while rendering this page.</p>
        
        <div className="tech-terminal text-sm mb-6">
          <p className="code-text">Error: {error.message || 'Unknown error'}</p>
          {error.digest && (
            <p className="mt-2 text-xs">Error ID: {error.digest}</p>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
          
          <Link href="/" passHref>
            <Button variant="outline" className="w-full">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
