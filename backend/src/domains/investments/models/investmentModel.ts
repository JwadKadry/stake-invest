import { pool } from '@/shared/database/connection'
import { Investment, InvestmentStatus } from '@/shared/types/domains'

export class InvestmentModel {
  static async create(data: {
    userId: string
    propertyId: string
    shares: number
    amountInvested: number
    sharePrice: number
  }): Promise<Investment> {
    const query = `
      INSERT INTO investments (user_id, property_id, shares, amount_invested, share_price, status, purchase_date)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `
    const values = [
      data.userId,
      data.propertyId,
      data.shares,
      data.amountInvested,
      data.sharePrice,
      InvestmentStatus.PENDING,
    ]

    const result = await pool.query(query, values)
    return this.mapRowToInvestment(result.rows[0])
  }

  static async findByUserId(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ investments: Investment[]; total: number }> {
    const offset = (page - 1) * pageSize

    const countQuery = 'SELECT COUNT(*) FROM investments WHERE user_id = $1'
    const countResult = await pool.query(countQuery, [userId])
    const total = parseInt(countResult.rows[0].count, 10)

    const query = `
      SELECT * FROM investments
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `
    const result = await pool.query(query, [userId, pageSize, offset])
    const investments = result.rows.map((row) => this.mapRowToInvestment(row))

    return { investments, total }
  }

  static async findById(id: string): Promise<Investment | null> {
    const query = 'SELECT * FROM investments WHERE id = $1'
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return null
    }

    return this.mapRowToInvestment(result.rows[0])
  }

  private static mapRowToInvestment(row: any): Investment {
    return {
      id: row.id,
      user_id: row.user_id,
      property_id: row.property_id,
      shares: parseInt(row.shares, 10),
      amount_invested: parseFloat(row.amount_invested),
      share_price: parseFloat(row.share_price),
      status: row.status,
      purchase_date: row.purchase_date,
      expected_return: row.expected_return ? parseFloat(row.expected_return) : undefined,
      actual_return: row.actual_return ? parseFloat(row.actual_return) : undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  }
}

