import { apiClient } from './client'
import { LoginRequest, TokenPair, User } from '@/types'

export const authApi = {
  login: async (credentials: LoginRequest): Promise<TokenPair> => {
    const response = await apiClient.post<TokenPair>('/auth/login', credentials)
    apiClient.setTokens(response.access_token, response.refresh_token)
    return response
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout')
    } finally {
      apiClient.clearTokens()
    }
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/me')
  },
}
