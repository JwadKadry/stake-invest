import { apiClient } from './client'
import {
  User,
  UserProfile,
  Property,
  Investment,
  InvestmentWithProperty,
  InvestmentSummary,
  PaginatedResponse,
} from '@/types/domains'
import {
  LoginRequest,
  RegisterRequest,
  CreateInvestmentRequest,
  UpdateUserProfileRequest,
} from '@/types/api'

// Auth endpoints
export const authApi = {
  login: (data: LoginRequest) => apiClient.post<{ user: User; token: string }>('/auth/login', data),
  register: (data: RegisterRequest) => apiClient.post<{ user: User; token: string }>('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  refresh: () => apiClient.post<{ token: string }>('/auth/refresh'),
}

// User endpoints
export const userApi = {
  getProfile: () => apiClient.get<UserProfile>('/users/me'),
  updateProfile: (data: UpdateUserProfileRequest) => apiClient.put<UserProfile>('/users/me', data),
  getInvestments: (page = 1, pageSize = 10) =>
    apiClient.get<PaginatedResponse<InvestmentWithProperty>>(`/users/me/investments?page=${page}&pageSize=${pageSize}`),
  getInvestmentSummary: () => apiClient.get<InvestmentSummary>('/users/me/investments/summary'),
}

// Property endpoints
export const propertyApi = {
  getAll: (page = 1, pageSize = 10, filters?: Record<string, unknown>) => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value))
      })
    }
    return apiClient.get<PaginatedResponse<Property>>(`/properties?${params.toString()}`)
  },
  getById: (id: string) => apiClient.get<Property>(`/properties/${id}`),
  search: (query: string) => apiClient.get<Property[]>(`/properties/search?q=${encodeURIComponent(query)}`),
}

// Investment endpoints
export const investmentApi = {
  create: (data: CreateInvestmentRequest) => apiClient.post<Investment>('/investments', data),
  getById: (id: string) => apiClient.get<InvestmentWithProperty>(`/investments/${id}`),
  getAll: (page = 1, pageSize = 10) =>
    apiClient.get<PaginatedResponse<InvestmentWithProperty>>(`/investments?page=${page}&pageSize=${pageSize}`),
}

