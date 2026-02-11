import { apiClient } from './client'
import { Applicant, ApplicantFilters, CVProcessingResult, CVAnalysis } from '@/types'

export const applicantsApi = {
  list: async (companyId: string, params?: ApplicantFilters): Promise<Applicant[]> => {
    return apiClient.get<Applicant[]>(`/companies/${companyId}/applicants`, params)
  },

  get: async (companyId: string, applicantId: string): Promise<Applicant> => {
    return apiClient.get<Applicant>(`/companies/${companyId}/applicants/${applicantId}`)
  },

  getCVAnalyses: async (companyId: string, applicantId: string): Promise<CVProcessingResult[]> => {
    return apiClient.get<CVProcessingResult[]>(
      `/companies/${companyId}/applicants/${applicantId}/cv-analyses`
    )
  },

  updateCVAnalysis: async (
    companyId: string,
    applicantId: string,
    analysisId: string,
    data: Partial<CVAnalysis>
  ): Promise<CVProcessingResult> => {
    return apiClient.put<CVProcessingResult>(
      `/companies/${companyId}/applicants/${applicantId}/cv-analyses/${analysisId}`,
      data
    )
  },

  downloadCV: async (
    companyId: string,
    applicantId: string,
    analysisId: string,
    filename: string
  ): Promise<void> => {
    return apiClient.downloadFile(
      `/companies/${companyId}/applicants/${applicantId}/cv-analyses/${analysisId}/download`,
      filename
    )
  },

  deleteCV: async (companyId: string, applicantId: string, analysisId: string): Promise<void> => {
    return apiClient.delete(
      `/companies/${companyId}/applicants/${applicantId}/cv-analyses/${analysisId}/file`
    )
  },

  replaceCV: async (
    companyId: string,
    applicantId: string,
    analysisId: string,
    file: File
  ): Promise<void> => {
    return apiClient.uploadFile(
      `/companies/${companyId}/applicants/${applicantId}/cv-analyses/${analysisId}/file`,
      file
    )
  },

  retryAnalysis: async (
    companyId: string,
    applicantId: string,
    analysisId: string
  ): Promise<any> => {
    return apiClient.post(
      `/companies/${companyId}/applicants/${applicantId}/cv-analyses/${analysisId}/retry`
    )
  },
}
