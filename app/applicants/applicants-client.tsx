"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Applicant } from "@/types"
import { ApplicantStatus, Recommendation } from "@/types"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

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
    final_recommendation: Recommendation.STRONG_MATCH,
    current_employer: "Times of Malta",
    current_position: "Senior Journalist",
    years_experience: 8,
    technical_skills: ["SEO", "Content Strategy", "Adobe Creative Suite"],
    soft_skills: ["Communication", "Creativity"],
    languages: ["English", "Maltese"],
    status: ApplicantStatus.NEW,
    applied_date: "2026-02-10",
    created_at: "2026-02-10T10:00:00Z",
    updated_at: "2026-02-10T10:00:00Z",
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
    final_recommendation: Recommendation.POSSIBLE_FIT,
    current_employer: "Independent",
    current_position: "Freelance Writer",
    years_experience: 5,
    technical_skills: ["Copywriting", "Social Media"],
    soft_skills: ["Adaptability", "Time Management"],
    languages: ["English", "Maltese"],
    status: ApplicantStatus.SCREENING,
    applied_date: "2026-02-09",
    created_at: "2026-02-09T10:00:00Z",
    updated_at: "2026-02-09T10:00:00Z",
  },
]

function badgeVariant(rec: Applicant["final_recommendation"]) {
  switch (rec) {
    case Recommendation.STRONG_MATCH:
      return "default"
    case Recommendation.POSSIBLE_FIT:
      return "secondary"
    case Recommendation.NOT_RECOMMENDED:
      return "destructive"
    default:
      return "outline"
  }
}

export default function ApplicantsClient() {
  const { toast } = useToast()
  const { activeCompanyId, activeCompany } = useAuth()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")

  const queryCompanyId = searchParams.get("companyId")
  const effectiveCompanyId = queryCompanyId || activeCompanyId || null

  const scoped = useMemo<Applicant[]>(() => {
    if (!effectiveCompanyId) return MOCK_APPLICANTS
    return MOCK_APPLICANTS.filter((a) => a.company_id === effectiveCompanyId)
  }, [effectiveCompanyId])

  const filtered = useMemo<Applicant[]>(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return scoped
    return scoped.filter((a) => {
      const full = `${a.first_name} ${a.last_name}`.toLowerCase()
      return (
        full.includes(q) ||
        (a.position_title || "").toLowerCase().includes(q) ||
        (a.location || "").toLowerCase().includes(q) ||
        (a.company_name || "").toLowerCase().includes(q)
      )
    })
  }, [scoped, searchQuery])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Applicants</h1>
          <p className="text-sm text-muted-foreground">
            Showing applicants for: {activeCompany?.name || "All companies"}
          </p>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Overall</TableHead>
              <TableHead className="text-right">PreQ</TableHead>
              <TableHead>Recommendation</TableHead>
              <TableHead className="text-right">CV</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No applicants found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.first_name} {a.last_name}</TableCell>
                  <TableCell>{a.location}</TableCell>
                  <TableCell className="text-right">{a.overall_match_score}%</TableCell>
                  <TableCell className="text-right">{a.preset_questions_score}%</TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant(a.final_recommendation)}>{a.final_recommendation}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast({ title: "Downloading CV", description: `${a.first_name} ${a.last_name}` })}
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
