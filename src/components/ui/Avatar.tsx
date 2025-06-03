"use client";

import Image from 'next/image';
import { useState } from 'react';
import { getAvatarColor } from '@/lib/avatar';

interface AvatarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ user, size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  // Get the display name for the avatar
  const displayName = user.name || user.email || '';
  const initial = displayName.charAt(0).toUpperCase();
  
  // Get the background color based on user ID
  const bgColorClass = getAvatarColor(user.id);
  
  // Determine dimensions based on size
  const dimensions = {
    sm: { size: 'w-8 h-8', text: 'text-xs' },
    md: { size: 'w-10 h-10', text: 'text-sm' },
    lg: { size: 'w-12 h-12', text: 'text-base' },
    xl: { size: 'w-16 h-16', text: 'text-lg' },
  }[size];
  
  // Render the avatar
  if (user.image && !imageError) {
    return (
      <div className={`relative ${dimensions.size} rounded-full overflow-hidden ${className}`}>
        <Image
          src={user.image}
          alt={displayName}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }
  
  // Render default avatar with initial
  return (
    <div className={`${dimensions.size} rounded-full flex items-center justify-center ${bgColorClass} text-white font-medium ${dimensions.text} ${className}`}>
      {initial}
    </div>
  );
}
