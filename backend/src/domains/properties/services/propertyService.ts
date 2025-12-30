import { PropertyModel } from '../models/propertyModel'
import { PropertyStatus } from '@/shared/types/domains'

export class PropertyService {
  static async getAll(filters: {
    page?: number
    pageSize?: number
    status?: string
    propertyType?: string
  }) {
    const result = await PropertyModel.findAll({
      page: filters.page,
      pageSize: filters.pageSize,
      status: filters.status as PropertyStatus,
      propertyType: filters.propertyType,
    })

    const totalPages = Math.ceil(result.total / (filters.pageSize || 10))

    return {
      items: result.properties.map((p) => this.transformProperty(p)),
      total: result.total,
      page: filters.page || 1,
      pageSize: filters.pageSize || 10,
      totalPages,
    }
  }

  static async getById(id: string) {
    const property = await PropertyModel.findById(id)
    if (!property) {
      return null
    }

    return this.transformProperty(property)
  }

  private static transformProperty(property: any) {
    return {
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
      createdAt: property.created_at,
      updatedAt: property.updated_at,
    }
  }
}

