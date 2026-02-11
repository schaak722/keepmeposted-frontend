"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TableSkeleton } from "@/components/ui/skeleton"
import type { Applicant, Recommendation } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

// Keep the existing pattern: mock data in-page
const MOCK_APPLICANTS: Applicant[] = [
  {
    id: "1",
    company_id: "1",
    job_id: "1",
    company_name: "Lovin Malta",
    position_title: "Senior Content Writer",
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.j@email.com",
    location: "Valletta, Malta",
    cv_url: "/uploads/sarah-johnson-cv.pdf",
    overall_match_score: 92,
    preset_questions_score: 88,
    final_recommendation: "Strong Match" as Recommendation,
    current_employer: "Times of Malta",
    current_position: "Senior Journalist",
    years_experience: 8,
    technical_skills: ["SEO", "Content Strategy", "Adobe Creative Suite"],
    soft_skills: ["Communication", "Creativity"],
    languages: ["English", "Maltese"],
  },
  {
    id: "2",
    company_id: "1",
    job_id: "1",
    company_name: "Lovin Malta",
    position_title: "Senior Content Writer",
    first_name: "Mark",
    last_name: "Borg",
    email: "mark.b@email.com",
    location: "Sliema, Malta",
    cv_url: "/uploads/mark-borg-cv.pdf",
    overall_match_score: 76,
    preset_questions_score: 72,
    final_recommendation: "Possible Fit" as Recommendation,
    current_employer: "Independent",
    current_position: "Freelance Writer",
    years_experience: 5,
    technical_skills: ["Copywriting", "Social Media"],
    soft_skills: ["Adaptability", "Time Management"],
    languages: ["English", "Maltese"],
  },
  {
    id: "3",
    company_id: "2",
    job_id: "2",
    company_name: "TechCorp Malta",
    position_title: "Full Stack Developer",
    first_name: "Elena",
    last_name: "Rossi",
    email: "elena.r@email.com",
    location: "Birkirkara, Malta",
    cv_url: "/uploads/elena-rossi-cv.pdf",
    overall_match_score: 89,
    preset_questions_score: 81,
    final_recommendation: "Strong Match" as Recommendation,
    current_employer: "Software House",
    current_position: "Developer",
    years_experience: 6,
    technical_skills: ["React", "Node.js", "PostgreSQL"],
    soft_skills: ["Problem Solving", "Teamwork"],
    languages: ["English", "Italian"],
  },
]

function recommendationBadgeVariant(rec: Recommendation) {
  switch (rec) {
    case "Strong Match":
      return "default"
    case "Possible Fit":
      return "secondary"
    case "Not Recommended":
      return "destructive"
    default:
      return "outline"
  }
}

export default function ApplicantsPage() {
  const { toast } = useToast()
  const { activeCompanyId, activeCompany, user } = useAuth()
  const searchParams = useSearchParams()

  // Local state (keeps your current repo approach flexible)
  const [applicants] = useState<Applicant[]>(MOCK_APPLICANTS)
  const [isLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Supports /applicants?companyId=<id> (e.g., from Companies “View Applicants”)
  const queryCompanyId = searchParams.get("companyId")
  const effectiveCompanyId = queryCompanyId || activeCompanyId || null

  const effectiveCompanyName = useMemo(() => {
    if (queryCompanyId) {
      const fromApplicants = applicants.find((a) => a.company_id === queryCompanyId)?.company_name
      return fromApplicants || `Company ${queryCompanyId}`
    }
    return (
      // depending on your auth context shape (some places use name vs company_name)
      // @ts-expect-error - handle either field safely
      activeCompany?.name ||
      // @ts-expect-error - handle either field safely
      activeCompany?.company_name ||
      (effectiveCompanyId ? `Company ${effectiveCompanyId}` : "All companies")
    )
  }, [activeCompany, applicants, effectiveCompanyId, queryCompanyId])

  // ✅ FIX: filter the SOURCE array (applicants), never scopedApplicants inside itself
  const scopedApplicants = useMemo<Applicant[]>(() => {
    if (!effectiveCompanyId) return applicants
    return applicants.filter((a) => a.company_id === effectiveCompanyId)
  }, [applicants, effectiveCompanyId])

  const filteredApplicants = useMemo<Applicant[]>(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return scopedApplicants
    return scopedApplicants.filter((a) => {
      const fullName = `${a.first_name} ${a.last_name}`.toLowerCase()
      return (
        fullName.includes(q) ||
        (a.company_name || "").toLowerCase().includes(q) ||
        (a.position_title || "").toLowerCase().includes(q) ||
        (a.location || "").toLowerCase().includes(q)
      )
    })
  }, [scopedApplicants, searchQuery])

  const handleDownloadCV = async (applicant: Applicant) => {
    // Mock-only: keep behaviour, but don’t break build
    toast({
      title: "Downloading CV",
      description: `Downloading CV for ${applicant.first_name} ${applicant.last_name}`,
    })
  }

  const scopeLabel =
    (queryCompanyId ? `${effectiveCompanyName} (filter)` : effectiveCompanyName) ||
    (user?.role === "CLIENT" ? "Your company" : "No company selected")

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Applicants</h1>
          <p className="text-sm text-muted-foreground">Showing applicants for: {scopeLabel}</p>
        </div>

        {queryCompanyId ? (
          <Button variant="outline" asChild>
            <Link href="/applicants">Clear filter</Link>
          </Button>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Search applicants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={8} columns={6} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Overall</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead className="text-right">CV</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    No applicants found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplicants.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.first_name} {a.last_name}
                    </TableCell>
                    <TableCell>{a.company_name}</TableCell>
                    <TableCell>{a.position_title}</TableCell>
                    <TableCell>{a.location}</TableCell>
                    <TableCell className="text-right">{a.overall_match_score}%</TableCell>
                    <TableCell>
                      <Badge variant={recommendationBadgeVariant(a.final_recommendation)}>
                        {a.final_recommendation}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleDownloadCV(a)}>
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
