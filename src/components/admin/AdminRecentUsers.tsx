import { Avatar } from '@/components/ui/Avatar';
import Link from 'next/link';

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

interface AdminRecentUsersProps {
  users: User[];
}

export function AdminRecentUsers({ users }: AdminRecentUsersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
      
      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No users found
          </p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <Avatar
                user={{
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  image: user.image
                }}
                size="md"
              />
              
              <div className="flex-1">
                <p className="font-medium">{user.name || 'Anonymous User'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link 
          href="/admin/users" 
          className="text-sm text-primary hover:underline"
        >
          View all users
        </Link>
      </div>
    </div>
  );
}
