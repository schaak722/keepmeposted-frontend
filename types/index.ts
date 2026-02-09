// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface User {
  id: string
  email: string
  full_name: string | null
  company_id: string
  roles: Role[]
  is_active: boolean
  created_at: string | null
}

export type Role = 'client' | 'business_admin' | 'it_admin'

// Company types
export type Industry = 
  | 'Accounting & Audit'
  | 'Advertising, Marketing & PR'
  | 'Aviation'
  | 'Architecture & Design'
  | 'Arts, Entertainment & Creative Media'
  | 'Mechanical & Motors'
  | 'Banking & Finance'
  | 'Customer Support'
  | 'Charity, NGO & Not-for-Profit'
  | 'Construction & Civil Engineering'
  | 'Consultancy & Professional Services'
  | 'Consumer Goods (FMCG)'
  | 'Creative & Design Agencies'
  | 'Safety & Security'
  | 'E-Commerce & Retail Stores'
  | 'Education & Training'
  | 'Energy, Environment & Renewables'
  | 'Engineering'
  | 'Events, Leisure & Entertainment'
  | 'Food, Beverage & Catering'
  | 'Gaming & iGaming'
  | 'Government & Public Sector'
  | 'Healthcare & Medical'
  | 'Hospitality, Hotels & Accommodation'
  | 'HR, Recruitment & Talent Acquisition'
  | 'Industrial & Manufacturing'
  | 'Information Technology & Software'
  | 'Insurance'
  | 'Internet, Media & Telecommunications'
  | 'Legal, Risk & Compliance'
  | 'Logistics, Transport & Distribution'
  | 'Marine, Shipping & Yachting'
  | 'Pharmaceuticals'
  | 'Property, Real Estate & Facilities'
  | 'Sales & Business Development'
  | 'Sports, Fitness & Recreation'
  | 'Travel, Tourism & Airlines'

export interface Company {
  id: string
  ref_id: string
  name: string
  domain: string | null
  website_url: string | null
  logo_url: string | null
  industry: Industry | null
  description: string | null
  is_active: boolean
  created_at: string | null
}

export interface CompanyCreate {
  name: string
  domain?: string | null
  website_url?: string | null
  logo_url?: string | null
  industry?: Industry | null
  description?: string | null
}

export interface CompanyUpdate extends Partial<CompanyCreate> {
  is_active?: boolean
}

// Job types
export type JobStatus = 'DRAFT' | 'OPEN' | 'CLOSED'
export type EmploymentType = 'full_time' | 'part_time' | 'contract'
export type Seniority = 'Entry Level' | 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Executive'

export interface SalaryRange {
  min: number | null
  max: number | null
}

export interface JobPosting {
  id: string
  company_id: string
  title: string
  raw_description: string
  created_at: string | null
  must_have_skills: string[]
  nice_to_have: string[]
  salary: SalaryRange | null
  location: string | null
  employment_type: EmploymentType | null
  status: JobStatus
  tags: string[]
  date_posted: string | null
  closing_date: string | null
  vacancy_url: string | null
  seniority: Seniority | null
  hiring_manager_id: string | null
  position_category_id: number | null
}

export interface VacancyStats {
  total_applicants: number
  new_applicants_since_last_login: number
}

export type VacancyFavoriteValue = '+' | '0' | '-'

export interface VacancyListItem extends JobPosting {
  company_name: string
  company_logo_url: string | null
  position_category: string | null
  position_subcategory: string | null
  hiring_manager_name: string | null
  favorite_status: VacancyFavoriteValue
  stats: VacancyStats
}

// Applicant types
export type FinalRecommendation = 'Not Recommended' | 'Possible Fit' | 'Strong Match'

export interface Applicant {
  id: string
  job_posting_id: string | null
  company_id: string
  last_scored_at: string | null
  last_analysis_id: string | null
  created_at: string | null
  updated_at: string | null
}

export interface CVAnalysis {
  // Scoring fields
  overall_match_score: number
  overall_match_score_reason: string
  overall_match_score_preset_questions: number
  overall_match_score_preset_questions_reason: string
  final_recommendation: FinalRecommendation
  match_summary: string
  reasoning: string
  match_summary_preset_questions: string
  reasoning_preset_questions: string
  red_flags: string
  green_flags: string
  fit_notes: string
  counter_reasoning: string
  
  // Metadata
  file_name: string
  id: string
  
  // Candidate info
  candidate_name: string | null
  email_address: string | null
  contact_number: string | null
  current_location_country: string | null
  current_employer: string | null
  current_position: string | null
  
  // Skills and experience
  technical_skills: string
  soft_skills: string
  relevant_qualification: string
  relevant_experience: string
  years_of_experience_within_role: number | null
  average_duration_in_job: number | null
  spoken_languages: string
  cv_grammar_and_legibility: string
  
  // Additional info
  gender: string | null
  place_of_birth: string | null
  date_of_birth: string | null
  linkedin_profile_link: string | null
}

export type CVProcessingStatus = 'pending' | 'processing' | 'complete' | 'failed'

export interface ProcessingStep {
  step_name: string
  status: string
  message: string
  started_at: string | null
  completed_at: string | null
  duration_seconds: number | null
}

export interface ProcessingProgress {
  applicant_id: string
  status: string
  steps: ProcessingStep[]
  started_at: string
  current_message: string
}

export interface CVProcessingResult {
  id: string | null
  applicant_id: string
  job_posting_id: string | null
  cv_text: string
  cv_analysis: CVAnalysis | null
  processed_at: string
  processing_progress: ProcessingProgress | null
  processing_status: string | null
  last_completed_step: number | null
  failed_at_step: number | null
  failure_reason: string | null
}

export interface ApplicantWithAnalysis {
  applicant: Applicant
  cv_analysis: CVAnalysis | null
  processing_status: CVProcessingStatus | null
}

// Filter and sort types
export interface JobFilters {
  status?: JobStatus
  employment_type?: EmploymentType
  location?: string
  search?: string
  seniority?: Seniority
  hiring_manager_id?: string
  position_category?: string
  position_subcategory?: string
  closing_before?: string
  closing_after?: string
}

export interface ApplicantFilters {
  filter?: 'all' | 'strong' | 'possible' | 'not_recommended' | 'starred'
  search?: string
  sort?: string
  page?: number
  pageSize?: number
}

export interface PaginationParams {
  limit?: number
  offset?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}
