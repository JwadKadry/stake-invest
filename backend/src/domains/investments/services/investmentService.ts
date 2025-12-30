import { InvestmentModel } from '../models/investmentModel'
import { PropertyModel } from '../../properties/models/propertyModel'
import { pool } from '@/shared/database/connection'
import { createError } from '@/shared/middleware/errorHandler'
import { InvestmentStatus } from '@/shared/types/domains'

export class InvestmentService {
  static async create(data: {
    userId: string
    propertyId: string
    shares: number
  }) {
    // Get property
    const property = await PropertyModel.findById(data.propertyId)
    if (!property) {
      throw createError('Property not found', 404)
    }

    // Validate shares
    if (data.shares > property.available_shares) {
      throw createError('Not enough shares available', 400)
    }

    if (data.shares * property.share_price < property.min_investment) {
      throw createError(`Minimum investment is ${property.min_investment}`, 400)
    }

    // Create investment
    const investment = await InvestmentModel.create({
      userId: data.userId,
      propertyId: data.propertyId,
      shares: data.shares,
      amountInvested: data.shares * property.share_price,
      sharePrice: property.share_price,
    })

    // Update property available shares
    await pool.query(
      'UPDATE properties SET available_shares = available_shares - $1 WHERE id = $2',
      [data.shares, data.propertyId]
    )

    return this.transformInvestment(investment, property)
  }

  static async getByUserId(userId: string, page: number = 1, pageSize: number = 10) {
    const result = await InvestmentModel.findByUserId(userId, page, pageSize)

    // Get properties for each investment
    const investmentsWithProperties = await Promise.all(
      result.investments.map(async (investment) => {
        const property = await PropertyModel.findById(investment.property_id)
        return this.transformInvestment(investment, property)
      })
    )

    const totalPages = Math.ceil(result.total / pageSize)

    return {
      items: investmentsWithProperties,
      total: result.total,
      page,
      pageSize,
      totalPages,
    }
  }

  static async getById(id: string) {
    const investment = await InvestmentModel.findById(id)
    if (!investment) {
      return null
    }

    const property = await PropertyModel.findById(investment.property_id)
    return this.transformInvestment(investment, property)
  }

  private static transformInvestment(investment: any, property: any) {
    return {
      id: investment.id,
      userId: investment.user_id,
      propertyId: investment.property_id,
      shares: investment.shares,
      amountInvested: investment.amount_invested,
      sharePrice: investment.share_price,
      status: investment.status,
      purchaseDate: investment.purchase_date,
      expectedReturn: investment.expected_return,
      actualReturn: investment.actual_return,
      createdAt: investment.created_at,
      updatedAt: investment.updated_at,
      property: property ? {
        id: property.id,
        title: property.title,
        description: property.description,
        address: {
          street: property.street,
          city: property.city,
          state: property.state,
          zipCode: property.zip_code,
          country: property.country,
        },
        propertyType: property.property_type,
        totalValue: property.total_value,
        availableShares: property.available_shares,
        sharePrice: property.share_price,
        minInvestment: property.min_investment,
        expectedAnnualReturn: property.expected_annual_return,
        investmentTerm: property.investment_term,
        status: property.status,
        images: property.images,
      } : null,
    }
  }
}

