import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="animate-pulse-glow mb-8">
          <Image
            src="/code-icon.svg"
            alt="Developer Capitalist"
            width={96}
            height={96}
            className="mx-auto"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">
          Developer Capitalist
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-2xl text-muted-foreground">
          Click your way to becoming a coding mogul in this idle game for
          developers
        </p>

        <div className="w-full max-w-md game-card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">How to Play</h2>
          <ol className="text-left space-y-3">
            <li className="flex items-start">
              <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                1
              </span>
              <span>Click to write code and earn Lines of Code (LoC)</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                2
              </span>
              <span>Purchase businesses to generate passive LoC</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                3
              </span>
              <span>Hire team members to boost your production</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary/20 text-primary font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                4
              </span>
              <span>Unlock upgrades and achievements</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/login" passHref>
            <Button variant="secondary" size="lg" className="min-w-[150px]">
              Sign In
            </Button>
          </Link>
          
          <Link href="/register" passHref>
            <Button variant="default" size="lg" className="min-w-[150px]">
              Register
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 text-muted-foreground">
          <p>Already signed in? <Link href="/game" className="text-primary hover:underline">Play Now</Link></p>
        </div>
      </main>

      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Developer Capitalist - An idle game for coders</p>
          <p className="mt-1">Sign in to save your progress automatically</p>
        </div>
      </footer>
    </div>
  );
}
