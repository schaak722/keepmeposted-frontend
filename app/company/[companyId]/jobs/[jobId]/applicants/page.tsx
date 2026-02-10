"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ApplicantDetailsPanel } from "@/components/applicant-details/applicant-details-panel"

// Mock applicants data with full CV details
const MOCK_APPLICANTS = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    contact_number: "+356 2123 4567",
    location: "Malta",
    overall_match_score: 92,
    overall_reasoning: "Excellent fit with 8+ years of progressive HR experience in tech companies. Demonstrates strong leadership and operational excellence. Education and certifications align perfectly with role requirements.",
    preset_questions_score: 88,
    preset_reasoning: "Meets all critical requirements: CIPD qualified, extensive HRIS experience (Workday, BambooHR), proven track record managing teams of 5+, and solid employment law knowledge. Minor gap in specific industry experience.",
    final_recommendation: "Strong Match",
    current_employer: "Tech Solutions Ltd",
    current_position: "HR Manager",
    years_experience: 8,
    average_duration: 3.2,
    applied_date: "2026-02-01",
    is_starred: false,
    technical_skills: ["Workday", "BambooHR", "ATS Systems", "HRIS Management", "Data Analytics", "Payroll Systems"],
    soft_skills: ["Leadership", "Communication", "Conflict Resolution", "Strategic Planning", "Team Building"],
    languages: ["English (Native)", "Maltese (Fluent)", "Italian (Conversational)"],
    relevant_experience: "8 years in HR roles with progressive responsibility. Managed full employee lifecycle for 200+ employees. Led recruitment drives hiring 50+ positions annually. Implemented new HRIS system reducing admin time by 40%. Managed employee relations cases and disciplinary procedures.",
    qualifications: "BA in Human Resources Management (University of Malta, 2016), CIPD Level 5 Diploma (2018), Certified Workday Professional (2022)",
    green_flags: [
      "Strong cultural fit with tech industry experience",
      "Proven track record of process improvement and efficiency gains",
      "CIPD qualified with continued professional development",
      "Experience managing teams and complex employee relations",
      "Local candidate - no relocation required"
    ],
    red_flags: [],
    fit_notes: "Sarah is an exceptional candidate who brings exactly what we're looking for. Her combination of technical HR knowledge (HRIS, compliance) and soft skills (leadership, communication) makes her ideal for this role.\n\nKey strengths:\n- Extensive experience with Workday and BambooHR (our current systems)\n- Proven ability to scale HR operations (managed growth from 100 to 200+ employees)\n- Strong track record of process improvement\n- CIPD qualified showing commitment to professional standards\n- Based in Malta - immediate availability\n\nThe only minor consideration is that her experience is primarily in tech/software rather than media, but her transferable skills are highly relevant."
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    contact_number: "+65 9123 4567",
    location: "Singapore",
    overall_match_score: 78,
    overall_reasoning: "Solid mid-level HR professional with good foundation but lacks some senior-level experience. Strong technical skills but limited leadership experience. Would benefit from mentorship in strategic HR functions.",
    preset_questions_score: 82,
    preset_reasoning: "Meets most requirements with 5 years experience and HRIS knowledge. However, limited team management experience (managed 2 direct reports vs 5+ required) and no formal CIPD or equivalent certification.",
    final_recommendation: "Possible Fit",
    current_employer: "Global Corp",
    current_position: "HR Coordinator",
    years_experience: 5,
    average_duration: 2.5,
    applied_date: "2026-02-03",
    is_starred: true,
    technical_skills: ["SAP SuccessFactors", "Applicant Tracking", "HR Analytics", "MS Office Suite"],
    soft_skills: ["Detail-oriented", "Communication", "Problem-solving", "Time Management"],
    languages: ["English (Fluent)", "Mandarin (Native)", "Malay (Basic)"],
    relevant_experience: "5 years in HR coordination roles. Supported recruitment for 30+ positions annually. Managed onboarding process for new hires. Maintained employee records in HRIS. Assisted with performance review cycles and employee queries.",
    qualifications: "BA in Business Administration (National University of Singapore, 2019), HR Management Certificate (2020)",
    green_flags: [
      "Strong technical proficiency with HRIS systems",
      "Attention to detail and process-oriented approach",
      "Quick learner with growth mindset",
      "Multilingual capabilities"
    ],
    red_flags: [
      "Limited leadership/management experience",
      "No CIPD or equivalent professional certification",
      "Would require relocation from Singapore",
      "Less strategic/senior-level experience than ideal"
    ],
    fit_notes: "Michael is a capable HR professional with solid fundamentals, but may be slightly junior for this role. His technical skills are strong, and he shows potential for growth.\n\nConsiderations:\n- Currently in coordinator-level role vs manager-level position\n- Limited direct management experience\n- Would need visa/relocation support from Singapore\n- May require additional training on employment law and strategic HR\n\nCould be a good fit if we're open to developing talent and providing mentorship, but might struggle with the immediate demands of the role."
  },
  {
    id: "3",
    name: "Emma Williams",
    email: "emma.w@email.com",
    contact_number: "+44 7700 900123",
    location: "UK",
    overall_match_score: 95,
    overall_reasoning: "Outstanding candidate who exceeds all requirements. 10+ years of senior HR experience with proven track record in operational excellence and strategic people management. Perfect blend of skills, experience, and cultural fit.",
    preset_questions_score: 94,
    preset_reasoning: "Exceeds all preset requirements comprehensively: CIPD Level 7 qualified, extensive experience with multiple HRIS platforms, managed large teams (15+ direct/indirect reports), expert-level employment law knowledge, and proven change management capabilities.",
    final_recommendation: "Strong Match",
    current_employer: "Innovation Hub",
    current_position: "People Operations Lead",
    years_experience: 10,
    average_duration: 4.1,
    applied_date: "2026-02-02",
    is_starred: false,
    technical_skills: ["Workday", "SAP", "PeopleSoft", "Advanced Excel", "Power BI", "HRIS Implementation", "Process Automation"],
    soft_skills: ["Strategic Leadership", "Change Management", "Stakeholder Management", "Executive Coaching", "Organizational Development"],
    languages: ["English (Native)", "French (Fluent)", "Spanish (Intermediate)"],
    relevant_experience: "10 years in senior HR leadership roles. Led HR operations for organizations of 300-500 employees. Spearheaded digital transformation initiatives including HRIS implementations. Managed M&A integration affecting 200+ employees. Developed and implemented HR strategy aligned with business goals. Built and led teams of 15+ HR professionals.",
    qualifications: "MSc in Human Resource Management (LSE, 2014), CIPD Level 7 (Advanced Diploma), Certified Change Management Professional (2019), Employment Law Specialist Certificate (2020)",
    green_flags: [
      "Exceptional qualifications - CIPD Level 7 and MSc from top university",
      "Extensive senior leadership experience managing large HR teams",
      "Proven track record in digital transformation and process improvement",
      "Experience with M&A and organizational change",
      "Strong strategic and operational capabilities",
      "Multiple HRIS implementations completed successfully"
    ],
    red_flags: [
      "May be overqualified for the position",
      "Currently in UK - would need relocation package",
      "Salary expectations likely at upper end of budget"
    ],
    fit_notes: "Emma is an exceptional candidate who brings senior-level expertise that could transform our HR function. She represents the 'gold standard' for this role.\n\nKey differentiators:\n- CIPD Level 7 (most senior professional qualification)\n- Led multiple HRIS implementations from selection through deployment\n- Experience managing both strategic and operational HR\n- Proven ability to drive organizational change and digital transformation\n- Strong stakeholder management at C-level\n\nMain consideration is ensuring the role provides sufficient challenge and growth opportunity for someone of her caliber. Her experience level might be beyond what we need, but if budget allows, she could significantly elevate our entire HR operation."
  }
]

type FilterType = "all" | "strong" | "possible" | "not_recommended" | "starred"

export default function ApplicantsPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.companyId as string
  const jobId = params.jobId as string

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS)
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null)

  // Filter applicants based on search and filter tabs
  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(search.toLowerCase())
    
    let matchesFilter = true
    if (filter === "strong") {
      matchesFilter = applicant.final_recommendation === "Strong Match"
    } else if (filter === "possible") {
      matchesFilter = applicant.final_recommendation === "Possible Fit"
    } else if (filter === "not_recommended") {
      matchesFilter = applicant.final_recommendation === "Not Recommended"
    } else if (filter === "starred") {
      matchesFilter = applicant.is_starred
    }
    
    return matchesSearch && matchesFilter
  })

  const handleApplicantClick = (applicantId: string) => {
    const applicant = applicants.find(a => a.id === applicantId)
    setSelectedApplicant(applicant)
  }

  const toggleStar = (applicantId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setApplicants(prev => prev.map(app => 
      app.id === applicantId ? { ...app, is_starred: !app.is_starred } : app
    ))
  }

  const getRecommendationBadge = (recommendation: string) => {
    if (recommendation === "Strong Match") {
      return <Badge variant="success">Strong Match</Badge>
    } else if (recommendation === "Possible Fit") {
      return <Badge variant="warning">Possible Fit</Badge>
    } else {
      return <Badge variant="error">Not Recommended</Badge>
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 font-semibold"
    if (score >= 70) return "text-yellow-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  // Count for each filter
  const counts = {
    all: applicants.length,
    strong: applicants.filter(a => a.final_recommendation === "Strong Match").length,
    possible: applicants.filter(a => a.final_recommendation === "Possible Fit").length,
    not_recommended: applicants.filter(a => a.final_recommendation === "Not Recommended").length,
    starred: applicants.filter(a => a.is_starred).length
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-8 px-4">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(`/company/${companyId}/jobs`)}
              >
                ← Back to Jobs
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-4">HR Operations Manager</h1>
            
            {/* Search and Filters */}
            <div className="flex flex-col gap-4">
              {/* Search */}
              <Input
                placeholder="Search for applicant"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
              />
              
              {/* Filter Tabs */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    filter === "all"
                      ? "bg-brand-blue text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All ({counts.all})
                </button>
                <button
                  onClick={() => setFilter("strong")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    filter === "strong"
                      ? "bg-brand-blue text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Strong Fit ({counts.strong})
                </button>
                <button
                  onClick={() => setFilter("possible")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    filter === "possible"
                      ? "bg-brand-blue text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Possible Fit ({counts.possible})
                </button>
                <button
                  onClick={() => setFilter("not_recommended")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    filter === "not_recommended"
                      ? "bg-brand-blue text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Not Recommended ({counts.not_recommended})
                </button>
                <button
                  onClick={() => setFilter("starred")}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    filter === "starred"
                      ? "bg-brand-blue text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ⭐ Starred ({counts.starred})
                </button>
              </div>
            </div>
          </div>

          {/* Applicants Table */}
          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead>Preset Q Score</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Current Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No applicants found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplicants.map((applicant) => (
                    <TableRow
                      key={applicant.id}
                      onClick={() => handleApplicantClick(applicant.id)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell>
                        <button
                          onClick={(e) => toggleStar(applicant.id, e)}
                          className="text-2xl hover:scale-110 transition-transform"
                        >
                          {applicant.is_starred ? "⭐" : "☆"}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{applicant.name}</div>
                          <div className="text-sm text-gray-500">{applicant.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{applicant.location}</TableCell>
                      <TableCell>
                        <span className={getScoreColor(applicant.overall_match_score)}>
                          {applicant.overall_match_score}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={getScoreColor(applicant.preset_questions_score)}>
                          {applicant.preset_questions_score}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {getRecommendationBadge(applicant.final_recommendation)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{applicant.current_position}</div>
                          <div className="text-xs text-gray-500">{applicant.current_employer}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Info Banner */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Using mock applicant data with full CV analysis. Click any applicant to view detailed profile.
              Click ⭐ to star/unstar applicants.
            </p>
          </div>
        </div>
      </div>

      {/* Applicant Details Panel */}
      {selectedApplicant && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSelectedApplicant(null)}
          />
          
          {/* Details Panel */}
          <ApplicantDetailsPanel
            applicant={selectedApplicant}
            onClose={() => setSelectedApplicant(null)}
          />
        </>
      )}
    </>
  )
}
