'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/providers/ToastProvider';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });

  // Check for error and callbackUrl in search params
  const callbackUrl = searchParams?.get('callbackUrl') || '/game';
  const error = searchParams?.get('error');

  // Display error toast if there's an error param
  useState(() => {
    if (error) {
      addToast({
        title: 'Authentication Error',
        description: getErrorMessage(error),
        type: 'error',
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });

      if (!res?.error) {
        // Successful login
        addToast({
          title: 'Login Successful',
          description: 'Welcome back to Developer Capitalist!',
          type: 'success',
        });
        router.push(callbackUrl);
        router.refresh();
      } else {
        // Login failed
        addToast({
          title: 'Login Failed',
          description: getErrorMessage(res.error),
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      addToast({
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    setLoading(true);
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground">Enter your credentials to continue</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="name@example.com"
            required
            type="email"
            value={formValues.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            value={formValues.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <Button type="submit" className="w-full" isLoading={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => handleOAuthSignIn('github')}
          disabled={loading}
        >
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => handleOAuthSignIn('google')}
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path d="M12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151ZM10.03 8.8H14.97L14.97 8.8C14.986 9.238 14.884 9.673 14.673 10.064L14.97 8.8L14.673 10.064C14.462 10.454 14.149 10.784 13.764 11.02L13.764 11.02L12 12.151L10.236 11.02C9.851 10.784 9.538 10.454 9.327 10.064C9.116 9.673 9.015 9.238 9.03 8.8L10.03 8.8ZM16.5 9.75V9.75C16.5 7.679 15.482 5.771 13.8 4.567C12.117 3.364 9.983 3.068 8.05 3.772C6.117 4.476 4.602 6.099 4.019 8.122C3.437 10.144 3.858 12.316 5.151 13.975C6.443 15.633 8.451 16.579 10.577 16.526C12.703 16.473 14.655 15.427 15.856 13.704C16.272 13.100 16.499 12.404 16.513 11.691C16.521 11.365 16.446 11.044 16.297 10.76C16.149 10.476 15.932 10.239 15.667 10.074C15.403 9.908 15.099 9.820 14.787 9.816C14.476 9.813 14.17 9.895 13.902 10.055C13.67 10.193 13.472 10.385 13.331 10.618C13.189 10.85 13.109 11.114 13.097 11.387C13.079 11.842 12.87 12.265 12.522 12.559C12.174 12.852 11.718 12.987 11.264 12.931C10.81 12.876 10.4 12.635 10.127 12.262C9.855 11.889 9.742 11.416 9.814 10.955C9.907 10.312 10.233 9.727 10.736 9.303C11.239 8.879 11.885 8.641 12.555 8.632C13.225 8.623 13.877 8.843 14.392 9.252C14.906 9.661 15.248 10.237 15.36 10.875C15.455 11.405 15.648 11.91 15.928 12.362C16.209 12.814 16.57 13.205 16.992 13.514C17.841 14.106 18.43 15.007 18.645 16.026C18.86 17.045 18.683 18.105 18.149 19.009C17.615 19.912 16.762 20.594 15.754 20.92C14.746 21.246 13.65 21.193 12.682 20.772C11.713 20.35 10.943 19.59 10.523 18.632C10.103 17.674 10.063 16.584 10.408 15.593C10.752 14.602 11.454 13.78 12.376 13.278C12.727 13.091 13.016 12.807 13.209 12.461C13.403 12.115 13.493 11.722 13.47 11.329L13.47 11.329C13.436 10.891 13.652 10.472 14.025 10.233C14.398 9.994 14.874 9.968 15.272 10.164C15.669 10.36 15.931 10.751 15.948 11.188L15.948 11.187C15.93 12.221 15.594 13.224 14.984 14.058C14.375 14.892 13.521 15.52 12.536 15.85C11.552 16.18 10.485 16.197 9.489 15.898C8.494 15.599 7.621 15.000 6.986 14.186C6.351 13.372 5.986 12.381 5.939 11.350C5.893 10.318 6.166 9.300 6.722 8.429C7.278 7.558 8.091 6.876 9.052 6.473C10.013 6.070 11.072 5.965 12.093 6.172C13.113 6.379 14.045 6.888 14.774 7.637C15.502 8.386 15.993 9.339 16.185 10.377C16.285 10.944 16.5 11.475 16.5 9.75Z" fill="currentColor" />
          </svg>
          Google
        </Button>
      </div>
      
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <a
          href="/register"
          className="underline underline-offset-4 hover:text-primary"
        >
          Register
        </a>
      </p>
    </div>
  );
}

// Helper function to generate human-readable error messages
function getErrorMessage(error: string): string {
  switch (error) {
    case 'CredentialsSignin':
      return 'Invalid email or password. Please try again.';
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'OAuthCreateAccount':
      return 'Error signing in with OAuth provider. Please try again.';
    case 'EmailCreateAccount':
      return 'Error creating account with this email. Try another method.';
    case 'Callback':
      return 'Error during authentication callback. Please try again.';
    case 'OAuthAccountNotLinked':
      return 'This email is already associated with another account.';
    case 'EmailSignin':
      return 'Error sending email sign-in link. Please try again.';
    case 'SessionRequired':
      return 'Please sign in to access this page.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
}
