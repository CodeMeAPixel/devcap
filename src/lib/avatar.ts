// Color palette for default avatars - using tailwind-like colors
const AVATAR_COLORS = [
  'bg-red-500',
  'bg-pink-500',
  'bg-purple-500',
  'bg-indigo-500',
  'bg-blue-500',
  'bg-cyan-500',
  'bg-teal-500',
  'bg-green-500',
  'bg-lime-500',
  'bg-yellow-500',
  'bg-amber-500',
  'bg-orange-500',
];

/**
 * Deterministically generates a color based on user ID
 * This ensures a user always gets the same color
 */
export function getAvatarColor(userId: string): string {
  // Simple hash function to get a consistent number from a string
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Use the hash to get a color from our palette
  const colorIndex = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[colorIndex];
}

/**
 * Generates a data URL for a default avatar
 */
export function generateDefaultAvatar(userId: string, name: string | null): string {
  // Get first letter of name or email (this should be done in the component)
  // This function focuses on just providing the color
  return getAvatarColor(userId);
}

/**
 * Gets the avatar URL for a user
 * Returns either the stored image URL or null (default avatar will be rendered by component)
 */
export function getAvatarUrl(user: { id: string, image: string | null }): string | null {
  return user.image;
}
