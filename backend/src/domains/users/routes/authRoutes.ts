import { Router } from 'express'
import { AuthService } from '../services/authService'
import { createError } from '@/shared/middleware/errorHandler'

export const authRoutes = Router()

authRoutes.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body

    if (!email || !password || !firstName || !lastName) {
      throw createError('Missing required fields', 400)
    }

    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
      phone,
    })

    res.status(201).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
})

authRoutes.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw createError('Email and password are required', 400)
    }

    const result = await AuthService.login(email, password)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
})

authRoutes.post('/refresh', async (req, res, next) => {
  try {
    // TODO: Implement token refresh logic
    res.json({
      success: true,
      data: { token: 'new-token' },
    })
  } catch (error) {
    next(error)
  }
})

