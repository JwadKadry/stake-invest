import { z } from 'zod'

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Property validation schemas
export const propertyFilterSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  status: z.enum(['draft', 'listed', 'funding', 'funded', 'closed']).optional(),
  propertyType: z.enum(['residential', 'commercial', 'mixed_use', 'industrial']).optional(),
})

// Investment validation schemas
export const createInvestmentSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  shares: z.number().int().positive('Shares must be a positive integer'),
})

export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
})

