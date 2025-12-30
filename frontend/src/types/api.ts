// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// API Request Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface CreateInvestmentRequest {
  propertyId: string
  shares: number
}

export interface UpdateUserProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
}

