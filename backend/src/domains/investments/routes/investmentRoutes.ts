import { Router } from 'express'
import { authenticate, AuthRequest } from '@/shared/middleware/auth'
import { InvestmentService } from '../services/investmentService'

export const investmentRoutes = Router()

// All routes require authentication
investmentRoutes.use(authenticate)

investmentRoutes.post('/', async (req: AuthRequest, res, next) => {
  try {
    if (!req.userId) {
      throw new Error('User ID not found')
    }

    const { propertyId, shares } = req.body

    if (!propertyId || !shares) {
      res.status(400).json({
        success: false,
        error: 'Property ID and shares are required',
      })
      return
    }

    const investment = await InvestmentService.create({
      userId: req.userId,
      propertyId,
      shares,
    })

    res.status(201).json({
      success: true,
      data: investment,
    })
  } catch (error) {
    next(error)
  }
})

investmentRoutes.get('/', async (req: AuthRequest, res, next) => {
  try {
    if (!req.userId) {
      throw new Error('User ID not found')
    }

    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 10

    const result = await InvestmentService.getByUserId(req.userId, page, pageSize)

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
})

investmentRoutes.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const investment = await InvestmentService.getById(req.params.id)
    if (!investment) {
      res.status(404).json({
        success: false,
        error: 'Investment not found',
      })
      return
    }

    res.json({
      success: true,
      data: investment,
    })
  } catch (error) {
    next(error)
  }
})

