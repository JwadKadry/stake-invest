import { UserModel } from '../models/userModel'
import { pool } from '@/shared/database/connection'

export class UserService {
  static async getProfile(userId: string) {
    const user = await UserModel.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Get investment summary
    const investmentSummary = await this.getInvestmentSummary(userId)

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      dateOfBirth: user.date_of_birth,
      kycStatus: user.kyc_status,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      ...investmentSummary,
    }
  }

  static async updateProfile(userId: string, data: {
    firstName?: string
    lastName?: string
    phone?: string
    dateOfBirth?: string
  }) {
    const updateData: any = {}
    if (data.firstName) updateData.first_name = data.firstName
    if (data.lastName) updateData.last_name = data.lastName
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.dateOfBirth) updateData.date_of_birth = new Date(data.dateOfBirth)

    const user = await UserModel.update(userId, updateData)
    return this.getProfile(userId)
  }

  private static async getInvestmentSummary(userId: string) {
    const query = `
      SELECT 
        COALESCE(SUM(amount_invested), 0) as total_invested,
        COALESCE(SUM(CASE WHEN status = 'active' THEN amount_invested ELSE 0 END), 0) as active_investments,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
      FROM investments
      WHERE user_id = $1
    `

    const result = await pool.query(query, [userId])
    const row = result.rows[0]

    return {
      totalInvested: parseFloat(row.total_invested) || 0,
      totalReturns: 0, // TODO: Calculate from completed investments
      activeInvestments: parseInt(row.active_count) || 0,
      completedInvestments: parseInt(row.completed_count) || 0,
    }
  }
}

