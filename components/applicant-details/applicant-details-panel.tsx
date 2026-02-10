"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ApplicantDetailsProps {
  applicant: any
  onClose: () => void
}

export function ApplicantDetailsPanel({ applicant, onClose }: ApplicantDetailsProps) {
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
    <div className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl overflow-y-auto z-50 animate-in slide-in-from-right">
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
        {/* AI Match Scores */}
        <Card>
          <CardHeader>
            <CardTitle>AI Match Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Overall Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Overall Match Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(applicant.overall_match_score)}`}>
                  {applicant.overall_match_score}%
                </span>
              </div>
              <p className="text-sm text-gray-600">{applicant.overall_reasoning}</p>
            </div>

            {/* Preset Questions Score */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Preset Questions Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(applicant.preset_questions_score)}`}>
                  {applicant.preset_questions_score}%
                </span>
              </div>
              <p className="text-sm text-gray-600">{applicant.preset_reasoning}</p>
            </div>

            {/* Final Recommendation */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium">Final Recommendation</span>
                {getRecommendationBadge(applicant.final_recommendation)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Background */}
        <Card>
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
            <div>
              <span className="text-sm font-medium text-gray-600">Years of Experience</span>
              <p className="font-medium">{applicant.years_experience} years</p>
            </div>
            {applicant.contact_number && (
              <div>
                <span className="text-sm font-medium text-gray-600">Contact Number</span>
                <p className="font-medium">{applicant.contact_number}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills & Competencies</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle>Experience & Qualifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600 block mb-1">Relevant Experience</span>
              <p className="text-sm">{applicant.relevant_experience}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600 block mb-1">Qualifications</span>
              <p className="text-sm">{applicant.qualifications}</p>
            </div>
            {applicant.average_duration && (
              <div>
                <span className="text-sm font-medium text-gray-600">Average Job Duration</span>
                <p className="font-medium">{applicant.average_duration} years</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Red Flags & Green Flags */}
        {(applicant.red_flags?.length > 0 || applicant.green_flags?.length > 0) && (
          <Card>
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
                <div>
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

        {/* Detailed Reasoning */}
        {applicant.fit_notes && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 whitespace-pre-line">{applicant.fit_notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleDownloadCV} className="flex-1 bg-brand-blue hover:bg-brand-blue-dark">
            📥 Download CV
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
