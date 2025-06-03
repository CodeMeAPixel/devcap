import { z } from 'zod';

/**
 * Base DTOs for user operations
 */
export const UserLoginDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const UserRegistrationDto = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type UserLoginRequest = z.infer<typeof UserLoginDto>;
export type UserRegistrationRequest = z.infer<typeof UserRegistrationDto>;

/**
 * Game data DTOs
 */
export const GameDataDto = z.object({
  userId: z.string().uuid().optional(),
  businesses: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      level: z.number().int().min(0),
      cost: z.number(),
      revenue: z.number(),
      interval: z.number(),
      description: z.string().optional(),
    })
  ),
  teamMembers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      count: z.number().int().min(0),
      availableCount: z.number().int().min(0),
      cost: z.number(),
      output: z.number(),
      description: z.string().optional(),
    })
  ),
  upgrades: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      purchased: z.boolean(),
      cost: z.number(),
      multiplier: z.number(),
      description: z.string().optional(),
      requiredLevel: z.number().int().min(0).optional(),
    })
  ),
  achievements: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      unlocked: z.boolean(),
      description: z.string(),
      reward: z.number().optional(),
    })
  ),
  currentLoC: z.number().min(0),
  totalLoC: z.number().min(0),
  locPerClick: z.number().min(1),
  lastOnline: z.string().datetime().nullable().optional(),
  lastSaved: z.string().datetime().nullable().optional(),
});

export type GameData = z.infer<typeof GameDataDto>;

export const GameSaveRequestDto = z.object({
  userId: z.string().uuid(),
  gameData: GameDataDto,
});

export type GameSaveRequest = z.infer<typeof GameSaveRequestDto>;

export const GameLoadRequestDto = z.object({
  userId: z.string().uuid(),
});

export type GameLoadRequest = z.infer<typeof GameLoadRequestDto>;

/**
 * Admin operation DTOs
 */
export const AdminUserListDto = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(['createdAt', 'username', 'email']).optional().default('createdAt'),
  sortDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional(),
});

export type AdminUserListRequest = z.infer<typeof AdminUserListDto>;

export const AdminBusinessUpdateDto = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  cost: z.number().min(0).optional(),
  revenue: z.number().min(0).optional(),
  interval: z.number().min(1).optional(),
  description: z.string().optional(),
});

export type AdminBusinessUpdateRequest = z.infer<typeof AdminBusinessUpdateDto>;
