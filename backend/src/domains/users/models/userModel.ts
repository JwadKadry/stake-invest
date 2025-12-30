import { pool } from '@/shared/database/connection'
import { User, KYCStatus } from '@/shared/types/domains'

export class UserModel {
  static async create(data: {
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    phone?: string
  }): Promise<User> {
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, phone, kyc_status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `
    const values = [
      data.email,
      data.passwordHash,
      data.firstName,
      data.lastName,
      data.phone || null,
      KYCStatus.PENDING,
    ]

    const result = await pool.query(query, values)
    return this.mapRowToUser(result.rows[0])
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1'
    const result = await pool.query(query, [email])

    if (result.rows.length === 0) {
      return null
    }

    return this.mapRowToUser(result.rows[0])
  }

  static async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1'
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return null
    }

    return this.mapRowToUser(result.rows[0])
  }

  static async update(id: string, data: Partial<User>): Promise<User> {
    const updates: string[] = []
    const values: unknown[] = []
    let paramCount = 1

    if (data.first_name) {
      updates.push(`first_name = $${paramCount++}`)
      values.push(data.first_name)
    }
    if (data.last_name) {
      updates.push(`last_name = $${paramCount++}`)
      values.push(data.last_name)
    }
    if (data.phone !== undefined) {
      updates.push(`phone = $${paramCount++}`)
      values.push(data.phone)
    }
    if (data.date_of_birth) {
      updates.push(`date_of_birth = $${paramCount++}`)
      values.push(data.date_of_birth)
    }
    if (data.kyc_status) {
      updates.push(`kyc_status = $${paramCount++}`)
      values.push(data.kyc_status)
    }

    updates.push(`updated_at = NOW()`)
    values.push(id)

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await pool.query(query, values)
    return this.mapRowToUser(result.rows[0])
  }

  private static mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      password_hash: row.password_hash,
      first_name: row.first_name,
      last_name: row.last_name,
      phone: row.phone,
      date_of_birth: row.date_of_birth,
      kyc_status: row.kyc_status,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  }
}

