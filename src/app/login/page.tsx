import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image 
              src="/code-icon.svg" 
              alt="Developer Capitalist" 
              width={64} 
              height={64} 
              className="mx-auto mb-4" 
            />
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to continue your coding empire
            </p>
          </div>
          
          <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
            <LoginForm />
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
