'use client';

import { useState } from 'react';
import { formatNumber } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/providers/ToastProvider';
import { Avatar } from '@/components/ui/Avatar';

interface UserWithProgress {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  userProgress: {
    linesOfCode: number;
    currency: number;
    totalEarned: number;
    clickPower: number;
  } | null;
}

interface AdminUserListProps {
  users: UserWithProgress[];
}

export function AdminUserList({ users: initialUsers }: AdminUserListProps) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  const filteredUsers = searchTerm
    ? users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  async function handleToggleAdmin(userId: string, currentIsAdmin: boolean) {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          isAdmin: !currentIsAdmin,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: !currentIsAdmin } : user
      ));

      addToast({
        title: 'User Updated',
        description: `Admin status toggled successfully`,
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: 'Error',
        description: 'Failed to update user',
        type: 'error',
      });
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Update local state
      setUsers(users.filter(user => user.id !== userId));

      addToast({
        title: 'User Deleted',
        description: 'User has been deleted successfully',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      addToast({
        title: 'Error',
        description: 'Failed to delete user',
        type: 'error',
      });
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-lg font-semibold">Users ({users.length})</h2>
          <input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-left">
              <th className="p-3 font-medium">User</th>
              <th className="p-3 font-medium">Lines of Code</th>
              <th className="p-3 font-medium">Current Currency</th>
              <th className="p-3 font-medium">Admin</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        user={{
                          id: user.id,
                          name: user.name,
                          email: user.email,
                          image: user.image
                        }}
                        size="md"
                      />
                      <div>
                        <p className="font-medium">{user.name || 'Anonymous User'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {user.userProgress ? formatNumber(user.userProgress.totalEarned) : '0'}
                  </td>
                  <td className="p-3">
                    {user.userProgress ? formatNumber(user.userProgress.currency) : '0'}
                  </td>
                  <td className="p-3">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs ${
                      user.isAdmin 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={user.isAdmin ? "destructive" : "outline"}
                        onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                      >
                        {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
