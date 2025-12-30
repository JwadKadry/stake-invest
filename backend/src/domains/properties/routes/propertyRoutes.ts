import { Router } from 'express'
import { PropertyService } from '../services/propertyService'

export const propertyRoutes = Router()

propertyRoutes.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 10
    const status = req.query.status as string
    const propertyType = req.query.propertyType as string

    const result = await PropertyService.getAll({
      page,
      pageSize,
      status,
      propertyType,
    })

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
})

propertyRoutes.get('/:id', async (req, res, next) => {
  try {
    const property = await PropertyService.getById(req.params.id)
    if (!property) {
      res.status(404).json({
        success: false,
        error: 'Property not found',
      })
      return
    }

    res.json({
      success: true,
      data: property,
    })
  } catch (error) {
    next(error)
  }
})

