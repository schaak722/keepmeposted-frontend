"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock company data for testing
const MOCK_COMPANIES = [
  {
    id: "1",
    name: "Lovin Malta",
    logo_url: null,
    industry: "Internet, Media & Telecommunications",
    description: "Leading digital media company in Malta"
  },
  {
    id: "2",
    name: "Tech Solutions Ltd",
    logo_url: null,
    industry: "Information Technology & Software",
    description: "Software development and consulting"
  }
]

export default function CompaniesPage() {
  const router = useRouter()

  const handleSelectCompany = (companyId: string) => {
    router.push(`/company/${companyId}/jobs`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Select Company</h1>
        <p className="text-gray-600 mb-8">Choose a company to view job postings</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COMPANIES.map((company) => (
            <Card
              key={company.id}
              className="cursor-pointer hover:shadow-lg transition-shadow hover:border-brand-blue"
              onClick={() => handleSelectCompany(company.id)}
            >
              <CardHeader>
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="h-12 mb-4 object-contain"
                  />
                ) : (
                  <div className="h-12 mb-4 flex items-center justify-center bg-brand-blue text-white rounded text-2xl font-bold">
                    {company.name.charAt(0)}
                  </div>
                )}
                <CardTitle>{company.name}</CardTitle>
                <CardDescription>{company.industry}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{company.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Using mock company data for testing. Backend integration coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}
