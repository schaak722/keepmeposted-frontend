"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

// Mock applicants data with AI scores
const MOCK_APPLICANTS = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    location: "Malta",
    overall_match_score: 92,
    preset_questions_score: 88,
    final_recommendation: "Strong Match",
    current_employer: "Tech Solutions Ltd",
    current_position: "HR Manager",
    years_experience: 8,
    applied_date: "2026-02-01",
    is_starred: false
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    location: "Singapore",
    overall_match_score: 78,
    preset_questions_score: 82,
    final_recommendation: "Possible Fit",
    current_employer: "Global Corp",
    current_position: "HR Coordinator",
    years_experience: 5,
    applied_date: "2026-02-03",
    is_starred: true
  },
  {
    id: "3",
    name: "Emma Williams",
    email: "emma.w@email.com",
    location: "UK",
    overall_match_score: 95,
    preset_questions_score: 94,
    final_recommendation: "Strong Match",
    current_employer: "Innovation Hub",
    current_position: "People Operations Lead",
    years_experience: 10,
    applied_date: "2026-02-02",
    is_starred: false
  },
  {
    id: "4",
    name: "James Brown",
    email: "j.brown@email.com",
    location: "Malta",
    overall_match_score: 58,
    preset_questions_score: 62,
    final_recommendation: "Not Recommended",
    current_employer: "Retail Inc",
    current_position: "Assistant Manager",
    years_experience: 3,
    applied_date: "2026-02-04",
    is_starred: false
  },
  {
    id: "5",
    name: "Lisa Martinez",
    email: "lisa.m@email.com",
    location: "Spain",
    overall_match_score: 85,
    preset_questions_score: 80,
    final_recommendation: "Strong Match",
    current_employer: "People First Co",
    current_position: "HR Business Partner",
    years_experience: 7,
    applied_date: "2026-02-05",
    is_starred: true
  },
  {
    id: "6",
    name: "David Wilson",
    email: "d.wilson@email.com",
    location: "Ireland",
    overall_match_score: 72,
    preset_questions_score: 75,
    final_recommendation: "Possible Fit",
    current_employer: "Startup Labs",
    current_position: "Talent Acquisition Specialist",
    years_experience: 4,
    applied_date: "2026-02-06",
    is_starred: false
  },
  {
    id: "7",
    name: "Sophia Anderson",
    email: "sophia.a@email.com",
    location: "Malta",
    overall_match_score: 88,
    preset_questions_score: 90,
    final_recommendation: "Strong Match",
    current_employer: "Enterprise Solutions",
    current_position: "Senior HR Manager",
    years_experience: 9,
    applied_date: "2026-02-07",
    is_starred: false
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
    // Phase 5 will show applicant details panel
    alert(`Applicant details panel coming in Phase 5! Applicant ID: ${applicantId}`)
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
            <strong>Note:</strong> Using mock applicant data with AI scores. Click any applicant to view details (Phase 5).
            Click ⭐ to star/unstar applicants.
          </p>
        </div>
      </div>
    </div>
  )
}
