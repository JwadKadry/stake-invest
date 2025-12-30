// User Domain Types
export interface User {
  id: string
  email: string
  password_hash: string
  first_name: string
  last_name: string
  phone?: string
  date_of_birth?: Date
  kyc_status: KYCStatus
  created_at: Date
  updated_at: Date
}

export enum KYCStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

// Property Domain Types
export interface Property {
  id: string
  title: string
  description: string
  street: string
  city: string
  state: string
  zip_code: string
  country: string
  property_type: PropertyType
  total_value: number
  available_shares: number
  share_price: number
  min_investment: number
  expected_annual_return: number
  investment_term: number // in months
  status: PropertyStatus
  images: string[]
  created_at: Date
  updated_at: Date
}

export enum PropertyType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  MIXED_USE = 'mixed_use',
  INDUSTRIAL = 'industrial',
}

export enum PropertyStatus {
  DRAFT = 'draft',
  LISTED = 'listed',
  FUNDING = 'funding',
  FUNDED = 'funded',
  CLOSED = 'closed',
}

// Investment Domain Types
export interface Investment {
  id: string
  user_id: string
  property_id: string
  shares: number
  amount_invested: number
  share_price: number
  status: InvestmentStatus
  purchase_date: Date
  expected_return?: number
  actual_return?: number
  created_at: Date
  updated_at: Date
}

export enum InvestmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

