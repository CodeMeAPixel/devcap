import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { FileUpload } from '@/components/ui/FileUpload';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/profile');
  }
  
  // Get the latest user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
        <div className="space-y-6">
          <FileUpload
            userId={user.id}
            userName={user.name}
            userEmail={user.email}
            currentImage={user.image}
          />
          
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Account Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <div className="font-medium">{user.name || 'Not set'}</div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <div className="font-medium">{user.email}</div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Member Since</label>
                <div className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
