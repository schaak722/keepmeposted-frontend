// ============================================
// ENUMS
// ============================================

export enum Role {
  IT_ADMIN = "it_admin",
  BUSINESS_ADMIN = "business_admin",
  CLIENT = "client"
}

export enum JobStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CLOSED = "CLOSED"
}

export enum EmploymentBasis {
  FULL_TIME = "Full-Time",
  PART_TIME = "Part-Time",
  FREELANCE = "Freelance",
  HYBRID = "Hybrid",
  TEMPORARY = "Temporary"
}

export enum ApplicantStatus {
  NEW = "NEW",
  SCREENING = "SCREENING",
  INTERVIEWING = "INTERVIEWING",
  OFFERED = "OFFERED",
  REJECTED = "REJECTED",
  HIRED = "HIRED"
}

export enum Recommendation {
  STRONG_MATCH = "Strong Match",
  POSSIBLE_FIT = "Possible Fit",
  NOT_RECOMMENDED = "Not Recommended"
}

// ============================================
// SALARY BANDS
// ============================================

export interface SalaryBand {
  id: string
  label: string
  min: number
  max: number
  currency: string
}

export const SALARY_BANDS: SalaryBand[] = [
  { id: "1", label: "€10,000 - €20,000", min: 10000, max: 20000, currency: "EUR" },
  { id: "2", label: "€20,000 - €30,000", min: 20000, max: 30000, currency: "EUR" },
  { id: "3", label: "€30,000 - €40,000", min: 30000, max: 40000, currency: "EUR" },
  { id: "4", label: "€40,000 - €50,000", min: 40000, max: 50000, currency: "EUR" },
  { id: "5", label: "€50,000 - €75,000", min: 50000, max: 75000, currency: "EUR" },
  { id: "6", label: "€75,000 - €100,000", min: 75000, max: 100000, currency: "EUR" },
  { id: "7", label: "€100,000+", min: 100000, max: null, currency: "EUR" },
]

// ============================================
// JOB CATEGORIES (Temporary stub)
// ============================================

export interface JobCategory {
  id: string
  name: string
}

export const JOB_CATEGORIES: JobCategory[] = [
  { id: "1", name: "Technology & IT" },
  { id: "2", name: "Marketing & Communications" },
  { id: "3", name: "Sales & Business Development" },
  { id: "4", name: "Human Resources" },
  { id: "5", name: "Finance & Accounting" },
  { id: "6", name: "Operations & Logistics" },
  { id: "7", name: "Design & Creative" },
  { id: "8", name: "Customer Service" },
  { id: "9", name: "Healthcare & Medical" },
  { id: "10", name: "Education & Training" },
]

// ============================================
// USER & MEMBERSHIP
// ============================================

export interface CompanyMembership {
  company_id: string
  company_name: string
  company_logo_url?: string
  role: Role
  is_active: boolean
}

export interface User {
  id: string
  email: string
  full_name: string
  role: Role // Global role
  memberships: CompanyMembership[] // Multi-company access
  created_at: string
  updated_at: string
}

export interface UserSession {
  user: User
  access_token: string
  refresh_token: string
  active_company_id?: string // For client users
}

// ============================================
// COMPANY
// ============================================

export interface Company {
  id: string
  ref_id: string // Unique reference ID
  name: string
  logo_url?: string
  industry: string
  description?: string
  website?: string
  contact_person_name?: string
  contact_person_position?: string
  contact_person_email?: string
  job_count?: number
  applicant_count?: number
  created_at: string
  updated_at: string
}

export interface CompanyCreate {
  ref_id: string
  name: string
  industry: string
  description?: string
  website?: string
  contact_person_name?: string
  contact_person_position?: string
  contact_person_email?: string
}

export interface CompanyUpdate extends Partial<CompanyCreate> {}

// ============================================
// JOB
// ============================================

export interface Job {
  id: string
  company_id: string
  company_name?: string
  company_logo_url?: string
  position_title: string
  basis: EmploymentBasis[] // Multi-select
  location: string
  salary_band_id?: string
  seniority?: string
  description: string
  about_company?: string
  industry?: string
  category_ids: string[] // Multi-select
  preset_questions: string[] // Max 3
  status: JobStatus
  date_posted: string
  closing_date?: string
  applicant_count?: number
  created_at: string
  updated_at: string
}

export interface JobCreate {
  company_id: string
  position_title: string
  basis: EmploymentBasis[]
  location: string
  salary_band_id?: string
  seniority?: string
  description: string
  about_company?: string
  category_ids: string[]
  preset_questions?: string[] // Max 3
  closing_date?: string
  status?: JobStatus
}

export interface JobUpdate extends Partial<Omit<JobCreate, 'company_id'>> {}

export interface JobStats {
  total_applicants: number
  new_applicants_since_last_login: number
  strong_matches: number
  possible_fits: number
  not_recommended: number
}

// ============================================
// APPLICANT
// ============================================

export interface Applicant {
  id: string
  company_id: string
  job_id: string
  company_name?: string
  position_title?: string
  first_name: string
  last_name: string
  email: string
  contact_number?: string
  location: string
  cv_url: string // Original uploaded CV
  overall_match_score: number
  preset_questions_score: number
  final_recommendation: Recommendation
  current_employer?: string
  current_position?: string
  years_experience?: number
  average_duration?: number
  technical_skills: string[]
  soft_skills: string[]
  languages?: string[]
  relevant_experience?: string
  qualifications?: string
  green_flags?: string[]
  red_flags?: string[]
  overall_reasoning?: string
  preset_reasoning?: string
  fit_notes?: string
  status: ApplicantStatus
  applied_date: string
  is_starred?: boolean
  created_at: string
  updated_at: string
}

// ============================================
// API RESPONSES
// ============================================

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status_code: number
}

// ============================================
// FORM STATES
// ============================================

export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface FormState<T> extends LoadingState {
  data?: T
  isDirty: boolean
}
