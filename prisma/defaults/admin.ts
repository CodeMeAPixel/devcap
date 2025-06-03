import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

/**
 * Creates the admin user using environment variables or default values
 */
export async function createAdminUser(prisma: PrismaClient): Promise<void> {
  // Get admin credentials from environment variables or use defaults
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@capitalist.dev';
  const adminName = process.env.ADMIN_NAME || 'Admin User';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  // Generate default avatar URL for admin
  const initials = adminName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // Create a hash from the email for consistent color generation
  const emailHash = adminEmail
    .split('')
    .reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0);
  const hue = Math.abs(emailHash % 360);
  
  // Default avatar URL using UI Avatars or similar service
  const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${initials}&background=hsl(${hue},70%,60%)&color=fff&size=200`;
  
  await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      isAdmin: true,
      image: defaultAvatarUrl,
    }
  });
  
  console.log(`Admin user created with email: ${adminEmail}`);
}
