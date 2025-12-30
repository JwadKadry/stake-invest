import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createError } from './errorHandler'

export interface AuthRequest extends Request {
  userId?: string
  user?: {
    id: string
    email: string
  }
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Authentication required', 401)
    }

    const token = authHeader.substring(7)
    const secret = process.env.JWT_SECRET || 'your-secret-key'

    const decoded = jwt.verify(token, secret) as { userId: string; email: string }

    req.userId = decoded.userId
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    }

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError('Invalid token', 401))
    } else {
      next(error)
    }
  }
}

