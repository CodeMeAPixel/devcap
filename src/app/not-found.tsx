import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="animate-pulse-glow mb-6">
        <Image
          src="/code-icon.svg"
          alt="Developer Capitalist"
          width={80}
          height={80}
          className="mx-auto"
        />
      </div>
      
      <h1 className="text-4xl font-bold mb-3">404 - Page Not Found</h1>
      
      <div className="game-card p-6 mb-6 max-w-md">
        <p className="text-xl mb-6">Oops! Looks like this page is missing from our codebase.</p>
        
        <div className="tech-terminal text-sm mb-6">
          <p className="code-text">Error: Route_Not_Found</p>
          <p className="mt-2">The requested route does not exist in this application.</p>
          <p className="mt-2">Suggestion: Return to a known route.</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <Link href="/" passHref>
            <Button className="w-full">Return to Home</Button>
          </Link>
          
          <Link href="/game" passHref>
            <Button variant="outline" className="w-full">Go to Game</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
