import { apiClient } from './client'
import { JobPosting, VacancyListItem, JobFilters, PaginationParams, VacancyFavoriteValue } from '@/types'

export const jobsApi = {
  list: async (companyId: string, params?: JobFilters & PaginationParams): Promise<JobPosting[]> => {
    return apiClient.get<JobPosting[]>(`/companies/${companyId}/jobs`, params)
  },

  listVacancies: async (companyId: string, params?: JobFilters & PaginationParams): Promise<VacancyListItem[]> => {
    return apiClient.get<VacancyListItem[]>(`/companies/${companyId}/jobs/vacancies`, params)
  },

  get: async (companyId: string, jobId: string): Promise<JobPosting> => {
    return apiClient.get<JobPosting>(`/companies/${companyId}/jobs/${jobId}`)
  },

  create: async (companyId: string, data: any): Promise<JobPosting> => {
    return apiClient.post<JobPosting>(`/companies/${companyId}/jobs`, data)
  },

  update: async (companyId: string, jobId: string, data: any, autoRescore?: boolean): Promise<JobPosting> => {
    return apiClient.put<JobPosting>(
      `/companies/${companyId}/jobs/${jobId}?auto_rescore=${autoRescore || false}`,
      data
    )
  },

  setFavorite: async (companyId: string, jobId: string, value: VacancyFavoriteValue): Promise<void> => {
    return apiClient.post(`/companies/${companyId}/jobs/${jobId}/favorite`, { value })
  },

  clearFavorite: async (companyId: string, jobId: string): Promise<void> => {
    return apiClient.delete(`/companies/${companyId}/jobs/${jobId}/favorite`)
  },

  downloadJobDescription: async (companyId: string, jobId: string, filename: string): Promise<void> => {
    return apiClient.downloadFile(
      `/companies/${companyId}/jobs/${jobId}/description/download`,
      filename
    )
  },

  downloadAllCVs: async (companyId: string, jobId: string): Promise<void> => {
    return apiClient.downloadFile(
      `/companies/${companyId}/jobs/${jobId}/applicants/download-cvs`,
      `job-${jobId}-cvs.zip`
    )
  },

  uploadCV: async (companyId: string, jobId: string, file: File): Promise<any> => {
    return apiClient.uploadFile(`/companies/${companyId}/jobs/${jobId}/applicants/upload`, file)
  },

  uploadCVsBatch: async (companyId: string, jobId: string, files: File[]): Promise<any> => {
    const formData = new FormData()
    files.forEach(file => formData.append('cv_files', file))
    
    return apiClient.post(
      `/companies/${companyId}/jobs/${jobId}/applicants/upload-batch`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  },

  rescoreCVs: async (companyId: string, jobId: string): Promise<any> => {
    return apiClient.post(`/companies/${companyId}/jobs/${jobId}/applicants/rescore`)
  },
}
