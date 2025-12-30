// User Domain Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  kycStatus: KYCStatus
  createdAt: string
  updatedAt: string
}

export enum KYCStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export interface UserProfile extends User {
  totalInvested: number
  totalReturns: number
  activeInvestments: number
}

// Property Domain Types
export interface Property {
  id: string
  title: string
  description: string
  address: Address
  propertyType: PropertyType
  totalValue: number
  availableShares: number
  sharePrice: number
  minInvestment: number
  expectedAnnualReturn: number
  investmentTerm: number // in months
  status: PropertyStatus
  images: string[]
  documents: Document[]
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
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

export interface Document {
  id: string
  name: string
  type: string
  url: string
  uploadedAt: string
}

// Investment Domain Types
export interface Investment {
  id: string
  userId: string
  propertyId: string
  shares: number
  amountInvested: number
  sharePrice: number
  status: InvestmentStatus
  purchaseDate: string
  expectedReturn?: number
  actualReturn?: number
  createdAt: string
  updatedAt: string
}

export enum InvestmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface InvestmentWithProperty extends Investment {
  property: Property
}

export interface InvestmentSummary {
  totalInvested: number
  totalReturns: number
  activeInvestments: number
  completedInvestments: number
  averageReturn: number
}

