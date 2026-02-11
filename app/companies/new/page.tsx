"use client"

import { useRouter } from "next/navigation"
import { CompanyProfileForm } from "@/components/forms/company-profile-form"
import type { Company } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { getStoredCompanies, setStoredCompanies } from "@/lib/storage/company-store"

export default function NewCompanyPage() {
  const router = useRouter()
  const { toast } = useToast()

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create Company Profile</h1>
        <p className="text-sm text-muted-foreground">
          A company profile is required before creating a job.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <CompanyProfileForm
          submitLabel="Create Company"
          onCancel={() => router.push("/companies")}
          onSubmit={(values) => {
            const existing = getStoredCompanies()

            // Guard: unique ref_id
            const dupRef = existing.some((c) => c.ref_id.toLowerCase() === values.ref_id.toLowerCase())
            if (dupRef) {
              toast({
                title: "Ref ID already exists",
                description: "Please choose a unique Ref ID.",
                variant: "error",
              })
              return
            }

            const newCompany: Company = {
              id: String(Date.now()),
              ref_id: values.ref_id,
              name: values.name,
              logo_url: values.logo_url,
              industry: values.industry,
              description: values.description,
              website: values.website,
              job_count: 0,
              applicant_count: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }

            setStoredCompanies([newCompany, ...existing])

            toast({
              title: "Company created",
              description: "Company profile has been created successfully.",
              variant: "success",
            })

            // After create, go to Jobs filtered to this company (nice flow)
            router.push(`/jobs?companyId=${newCompany.id}`)
          }}
        />
      </div>
    </div>
  )
}
