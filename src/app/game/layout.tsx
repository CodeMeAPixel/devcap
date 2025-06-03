import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Developer Capitalist - Game',
  description: 'Click your way to becoming a coding mogul',
}

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/game');
  }

  return (
    <div className="game-container">
      {/* Game header */}
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent pb-2">
          Developer Capitalist
        </h1>
        <p className="text-muted-foreground">Welcome, {session.user?.name || 'Coder'}!</p>
      </header>
      
      {children}
    </div>
  );
}
