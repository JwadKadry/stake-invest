'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, KYCStatus } from '@/types/domains'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

// Mock users for demo
const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: 'demo@example.com',
    password: 'demo123',
    user: {
      id: 'user-1',
      email: 'demo@example.com',
      firstName: 'John',
      lastName: 'Doe',
      kycStatus: KYCStatus.VERIFIED,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    },
  },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock authentication
        const mockUser = mockUsers.find((u) => u.email === email && u.password === password)
        
        if (mockUser) {
          set({ user: mockUser.user, isAuthenticated: true, isLoading: false })
        } else {
          set({ isLoading: false })
          throw new Error('Invalid email or password')
        }
      },

      register: async (email: string, password: string, firstName: string, lastName: string) => {
        set({ isLoading: true })
        
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check if user already exists
        if (mockUsers.find((u) => u.email === email)) {
          set({ isLoading: false })
          throw new Error('User with this email already exists')
        }

        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          firstName,
          lastName,
          kycStatus: KYCStatus.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        mockUsers.push({ email, password, user: newUser })
        set({ user: newUser, isAuthenticated: true, isLoading: false })
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      checkAuth: () => {
        // Check if user exists in persisted state
        const state = useAuthStore.getState()
        if (state.user) {
          set({ isAuthenticated: true })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

