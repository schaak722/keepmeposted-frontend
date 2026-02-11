"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TableSkeleton } from "@/components/ui/skeleton"
import { CompanyModal } from "@/components/modals/company-modal"
import type { Company } from "@/types"
import { useToast } from "@/hooks/use-toast"

// Mock data - replace with API call
const MOCK_COMPANIES: Company[] = [
  {
    id: "1",
    ref_id: "LM001",
    name: "Lovin Malta",
    logo_url: undefined,
    industry: "Media & Publishing",
    description: "Malta's leading digital media company",
    website: "https://lovinmalta.com",
    contact_person_name: "John Doe",
    contact_person_position: "HR Manager",
    contact_person_email: "hr@lovinmalta.com",
    job_count: 12,
    applicant_count: 48,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    ref_id: "TS002",
    name: "Tech Solutions Ltd",
    logo_url: undefined,
    industry: "Technology & IT",
    description: "Enterprise software solutions provider",
    website: "https://techsolutions.com",
    contact_person_name: "Jane Smith",
    contact_person_position: "People Operations Lead",
    contact_person_email: "jane@techsolutions.com",
    job_count: 8,
    applicant_count: 32,
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z"
  }
]

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const { toast } = useToast()

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.ref_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateCompany = () => {
    setEditingCompany(null)
    setIsModalOpen(true)
  }

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company)
    setIsModalOpen(true)
  }

  const handleSaveCompany = async (companyData: Partial<Company>) => {
    try {
      if (editingCompany) {
        // Update existing company
        setCompanies(companies.map(c => 
          c.id === editingCompany.id 
            ? { ...c, ...companyData, updated_at: new Date().toISOString() }
            : c
        ))
        toast({
          title: "Company updated",
          description: "Company profile has been updated successfully",
          variant: "success"
        })
      } else {
        // Create new company
        const newCompany: Company = {
          ...companyData as Company,
          id: String(companies.length + 1),
          job_count: 0,
          applicant_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setCompanies([...companies, newCompany])
        toast({
          title: "Company created",
          description: "New company profile has been created successfully",
          variant: "success"
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save company. Please try again.",
        variant: "error"
      })
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Companies</h1>
        <p className="text-gray-600">Manage company profiles and information</p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <Input
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button 
          onClick={handleCreateCompany}
          className="bg-brand-blue hover:bg-brand-blue/90"
        >
          Add Company
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Ref ID</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead className="text-center">Jobs</TableHead>
                <TableHead className="text-center">Applicants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchQuery ? "No companies found matching your search" : "No companies yet. Click 'Add Company' to create one."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map(company => (
                  <TableRow key={company.id}>
                    <TableCell>
                      {company.logo_url ? (
                        <img 
                          src={company.logo_url} 
                          alt={company.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-brand-blue text-white rounded flex items-center justify-center font-bold">
                          {company.name.charAt(0)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleEditCompany(company)}
                        className="font-medium text-brand-blue hover:underline text-left"
                      >
                        {company.name}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{company.ref_id}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{company.industry}</TableCell>
                    <TableCell className="text-center">{company.job_count}</TableCell>
                    <TableCell className="text-center">{company.applicant_count}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/jobs?companyId=${company.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          View Jobs
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Company Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCompany}
        company={editingCompany}
      />
    </div>
  )
}
