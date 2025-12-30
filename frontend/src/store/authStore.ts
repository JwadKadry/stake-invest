import { create } from 'zustand'
import { User } from '@/types/domains'
import { authApi } from '@/lib/api/endpoints'
import { apiClient } from '@/lib/api/client'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const response = await authApi.login({ email, password })
      if (response.success && response.data) {
        apiClient.setToken(response.data.token)
        set({ user: response.data.user, isAuthenticated: true, isLoading: false })
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    set({ isLoading: true })
    try {
      const response = await authApi.register({ email, password, firstName, lastName })
      if (response.success && response.data) {
        apiClient.setToken(response.data.token)
        set({ user: response.data.user, isAuthenticated: true, isLoading: false })
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    apiClient.setToken('')
    set({ user: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      // Check if token exists and validate it
      const response = await authApi.refresh()
      if (response.success && response.data) {
        apiClient.setToken(response.data.token)
        set({ isAuthenticated: true, isLoading: false })
      } else {
        set({ isAuthenticated: false, isLoading: false })
      }
    } catch (error) {
      set({ isAuthenticated: false, isLoading: false })
    }
  },
}))

