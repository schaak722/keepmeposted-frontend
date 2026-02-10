"use client"

import { useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ApplicantDetailsProps {
  applicant: any
  onClose: () => void
}

const navigationSections = [
  { id: "match-score", label: "AI Match Score" },
  { id: "preset-questions", label: "Preset Questions" },
  { id: "match-summary", label: "Match Summary" },
  { id: "professional", label: "Professional Background" },
  { id: "skills", label: "Skills & Qualifications" },
  { id: "experience", label: "Experience & Education" },
  { id: "assessment", label: "Assessment Highlights" },
  { id: "detailed", label: "Detailed Assessment" },
]

export function ApplicantDetailsPanel({ applicant, onClose }: ApplicantDetailsProps) {
  const [activeSection, setActiveSection] = useState("match-score")
  const contentRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element && contentRef.current) {
      const offset = element.offsetTop - contentRef.current.offsetTop - 80 // Account for sticky header
      contentRef.current.scrollTo({
        top: offset,
        behavior: "smooth"
      })
      setActiveSection(sectionId)
    }
  }

  const handleDownloadCV = () => {
    alert(`Downloading CV for ${applicant.name}... (Backend integration coming soon)`)
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getRecommendationBadge = (recommendation: string) => {
    if (recommendation === "Strong Match") {
      return <Badge variant="success" className="text-base px-3 py-1">Strong Match</Badge>
    } else if (recommendation === "Possible Fit") {
      return <Badge variant="warning" className="text-base px-3 py-1">Possible Fit</Badge>
    } else {
      return <Badge variant="error" className="text-base px-3 py-1">Not Recommended</Badge>
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full lg:w-2/3 bg-white shadow-2xl z-50 flex animate-in slide-in-from-right">
      {/* Navigation Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block w-64 border-r bg-gray-50 overflow-y-auto">
        <div className="sticky top-0 bg-gray-50 border-b px-4 py-4">
          <h3 className="font-semibold text-sm text-gray-700">Navigation</h3>
        </div>
        <nav className="p-4 space-y-1">
          {navigationSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                activeSection === section.id
                  ? "bg-brand-blue text-white font-medium"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto" ref={contentRef}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">{applicant.name}</h2>
            <p className="text-sm text-gray-600">{applicant.email}</p>
          </div>
          <Button variant="ghost" onClick={onClose} size="sm">
            ✕ Close
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Match Score */}
          <Card id="match-score">
            <CardHeader>
              <CardTitle>AI Match Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Match</span>
                  <span className={`text-3xl font-bold ${getScoreColor(applicant.overall_match_score)}`}>
                    {applicant.overall_match_score}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">{applicant.overall_reasoning}</p>
              </div>
            </CardContent>
          </Card>

          {/* Preset Questions Score */}
          <Card id="preset-questions">
            <CardHeader>
              <CardTitle>Preset Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Score</span>
                  <span className={`text-3xl font-bold ${getScoreColor(applicant.preset_questions_score)}`}>
                    {applicant.preset_questions_score}%
                  </span>
                </div>
                <p className="text-sm text-gray-600">{applicant.preset_reasoning}</p>
              </div>
            </CardContent>
          </Card>

          {/* Match Summary */}
          <Card id="match-summary">
            <CardHeader>
              <CardTitle>Match Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-2">Before Questions</span>
                <p className="text-sm text-gray-700">{applicant.fit_notes?.split('\n\n')[0] || "Candidate shows strong alignment with role requirements."}</p>
              </div>
              <div className="pt-4 border-t">
                <span className="text-sm font-medium text-gray-600 block mb-2">After Preset Questions</span>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">Final Recommendation:</span>
                  {getRecommendationBadge(applicant.final_recommendation)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Background */}
          <Card id="professional">
            <CardHeader>
              <CardTitle>Professional Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Current Position</span>
                <p className="font-medium">{applicant.current_position}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Current Employer</span>
                <p className="font-medium">{applicant.current_employer}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Location</span>
                <p className="font-medium">{applicant.location}</p>
              </div>
              <div className="flex gap-8">
                <div>
                  <span className="text-sm font-medium text-gray-600 block">Years of Experience</span>
                  <p className="text-2xl font-bold text-brand-blue">{applicant.years_experience}</p>
                </div>
                {applicant.average_duration && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 block">Average Job Duration</span>
                    <p className="text-2xl font-bold text-brand-blue">{applicant.average_duration} yrs</p>
                  </div>
                )}
              </div>
              {applicant.contact_number && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Contact Number</span>
                  <p className="font-medium">{applicant.contact_number}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Qualifications */}
          <Card id="skills">
            <CardHeader>
              <CardTitle>Skills & Qualifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-2">Technical Skills</span>
                <div className="flex flex-wrap gap-2">
                  {applicant.technical_skills.map((skill: string, i: number) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-2">Soft Skills</span>
                <div className="flex flex-wrap gap-2">
                  {applicant.soft_skills.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
              {applicant.languages && applicant.languages.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-600 block mb-2">Languages</span>
                  <div className="flex flex-wrap gap-2">
                    {applicant.languages.map((lang: string, i: number) => (
                      <Badge key={i} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience & Qualifications */}
          <Card id="experience">
            <CardHeader>
              <CardTitle>Experience & Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-2">Relevant Qualification</span>
                <div className="text-sm text-gray-700 whitespace-pre-line">{applicant.qualifications}</div>
              </div>
              <div className="pt-4 border-t">
                <span className="text-sm font-medium text-gray-600 block mb-2">Relevant Experience</span>
                <div className="text-sm text-gray-700 whitespace-pre-line">{applicant.relevant_experience}</div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Highlights */}
          {(applicant.red_flags?.length > 0 || applicant.green_flags?.length > 0) && (
            <Card id="assessment">
              <CardHeader>
                <CardTitle>Assessment Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {applicant.green_flags && applicant.green_flags.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-green-600 block mb-2">✓ Green Flags</span>
                    <ul className="space-y-1">
                      {applicant.green_flags.map((flag: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {applicant.red_flags && applicant.red_flags.length > 0 && (
                  <div className="pt-4 border-t">
                    <span className="text-sm font-medium text-red-600 block mb-2">⚠ Red Flags</span>
                    <ul className="space-y-1">
                      {applicant.red_flags.map((flag: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Detailed Assessment */}
          {applicant.fit_notes && (
            <Card id="detailed">
              <CardHeader>
                <CardTitle>Detailed Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-line">{applicant.fit_notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t py-4">
            <Button onClick={handleDownloadCV} className="flex-1 bg-brand-blue hover:bg-brand-blue-dark">
              📥 Download CV
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
