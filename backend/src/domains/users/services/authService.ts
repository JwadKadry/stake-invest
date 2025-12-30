import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/userModel'
import { createError } from '@/shared/middleware/errorHandler'

export class AuthService {
  static async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) {
    // Check if user exists
    const existingUser = await UserModel.findByEmail(data.email)
    if (existingUser) {
      throw createError('User with this email already exists', 409)
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10)

    // Create user
    const user = await UserModel.create({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    })

    // Generate token
    const token = this.generateToken(user.id, user.email)

    return {
      user: this.sanitizeUser(user),
      token,
    }
  }

  static async login(email: string, password: string) {
    // Find user
    const user = await UserModel.findByEmail(email)
    if (!user) {
      throw createError('Invalid credentials', 401)
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      throw createError('Invalid credentials', 401)
    }

    // Generate token
    const token = this.generateToken(user.id, user.email)

    return {
      user: this.sanitizeUser(user),
      token,
    }
  }

  private static generateToken(userId: string, email: string): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

    return jwt.sign({ userId, email }, secret, { expiresIn })
  }

  private static sanitizeUser(user: any) {
    const { password_hash, ...sanitized } = user
    return sanitized
  }
}

