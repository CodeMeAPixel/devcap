import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Image from 'next/image';

export default function RegisterPage() {
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
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground mt-2">
              Start your journey to becoming a coding mogul
            </p>
          </div>
          
          <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
            <RegisterForm />
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Sign in
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
