import { Router } from 'express'
import { authenticate, AuthRequest } from '@/shared/middleware/auth'
import { UserService } from '../services/userService'

export const userRoutes = Router()

// All routes require authentication
userRoutes.use(authenticate)

userRoutes.get('/me', async (req: AuthRequest, res, next) => {
  try {
    if (!req.userId) {
      throw new Error('User ID not found')
    }

    const user = await UserService.getProfile(req.userId)
    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
})

userRoutes.put('/me', async (req: AuthRequest, res, next) => {
  try {
    if (!req.userId) {
      throw new Error('User ID not found')
    }

    const user = await UserService.updateProfile(req.userId, req.body)
    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
})

