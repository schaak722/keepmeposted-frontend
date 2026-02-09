import { apiClient } from './client'
import { Company, CompanyCreate, CompanyUpdate, PaginationParams } from '@/types'

export const companiesApi = {
  list: async (params?: PaginationParams & { search?: string; industry?: string; is_active?: boolean }): Promise<Company[]> => {
    return apiClient.get<Company[]>('/companies', params)
  },

  get: async (companyId: string): Promise<Company> => {
    return apiClient.get<Company>(`/companies/${companyId}`)
  },

  create: async (data: CompanyCreate): Promise<Company> => {
    return apiClient.post<Company>('/companies', data)
  },

  update: async (companyId: string, data: CompanyUpdate): Promise<Company> => {
    return apiClient.put<Company>(`/companies/${companyId}`, data)
  },

  delete: async (companyId: string): Promise<void> => {
    return apiClient.delete(`/companies/${companyId}`)
  },
}
