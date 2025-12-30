import { pool } from '@/shared/database/connection'
import { Property, PropertyStatus } from '@/shared/types/domains'

export class PropertyModel {
  static async findAll(filters: {
    page?: number
    pageSize?: number
    status?: PropertyStatus
    propertyType?: string
  }): Promise<{ properties: Property[]; total: number }> {
    const page = filters.page || 1
    const pageSize = filters.pageSize || 10
    const offset = (page - 1) * pageSize

    let whereClause = 'WHERE 1=1'
    const values: unknown[] = []
    let paramCount = 1

    if (filters.status) {
      whereClause += ` AND status = $${paramCount++}`
      values.push(filters.status)
    }

    if (filters.propertyType) {
      whereClause += ` AND property_type = $${paramCount++}`
      values.push(filters.propertyType)
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM properties ${whereClause}`
    const countResult = await pool.query(countQuery, values)
    const total = parseInt(countResult.rows[0].count, 10)

    // Get properties
    const query = `
      SELECT * FROM properties
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `
    values.push(pageSize, offset)

    const result = await pool.query(query, values)
    const properties = result.rows.map((row) => this.mapRowToProperty(row))

    return { properties, total }
  }

  static async findById(id: string): Promise<Property | null> {
    const query = 'SELECT * FROM properties WHERE id = $1'
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return null
    }

    return this.mapRowToProperty(result.rows[0])
  }

  private static mapRowToProperty(row: any): Property {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      street: row.street,
      city: row.city,
      state: row.state,
      zip_code: row.zip_code,
      country: row.country,
      property_type: row.property_type,
      total_value: parseFloat(row.total_value),
      available_shares: parseInt(row.available_shares, 10),
      share_price: parseFloat(row.share_price),
      min_investment: parseFloat(row.min_investment),
      expected_annual_return: parseFloat(row.expected_annual_return),
      investment_term: parseInt(row.investment_term, 10),
      status: row.status,
      images: row.images || [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  }
}

