# KeepMePosted Frontend - Implementation Guide

This guide provides a detailed implementation plan for completing the KeepMePosted frontend application.

## Current Status

✅ **Completed:**
- Project scaffolding and configuration
- TypeScript types from API schema
- API client with authentication interceptors
- API service modules (auth, companies, jobs, applicants)
- Global styles and Tailwind configuration
- Root layout and providers
- Login page

⏳ **Remaining:**
- UI components (Input, Card, Table, Dialog, Badge, Tabs, etc.)
- Layout components (Header, Sidebar)
- Main application pages
- Custom hooks
- Table components with filtering and sorting

## Implementation Order

### Phase 1: Core UI Components (Priority: HIGH)

Create these shadcn/ui components in `components/ui/`:

#### 1. Input Component (`components/ui/input.tsx`)
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

#### 2. Card Component (`components/ui/card.tsx`)
```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
```

#### 3. Badge Component (`components/ui/badge.tsx`)
```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-match-strong text-white",
        warning: "border-transparent bg-match-possible text-white",
        error: "border-transparent bg-match-not text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

#### 4. Dialog Component (`components/ui/dialog.tsx`)
Use @radix-ui/react-dialog - implementation available in shadcn/ui docs

#### 5. Table Component (`components/ui/table.tsx`)
Simple HTML table wrapper with Tailwind styles

### Phase 2: Layout Components (Priority: HIGH)

#### 1. Header Component (`components/layout/header.tsx`)
- Logo/branding
- Company selector dropdown
- User menu
- Navigation links

```typescript
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authApi } from "@/lib/api"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await authApi.logout()
    router.push("/login")
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/companies" className="text-2xl font-bold text-brand-blue">
          Keepmeposted
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/companies" className="text-sm hover:text-brand-blue">
            Companies
          </Link>
          <Button variant="outline" onClick={handleLogout} size="sm">
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}
```

#### 2. Page Header Component (`components/layout/page-header.tsx`)
- Page title
- Breadcrumbs
- Action buttons (search, filters, etc.)

### Phase 3: Main Application Pages (Priority: HIGH)

#### 1. Companies Selector Page (`app/companies/page.tsx`)

After login, users with multiple companies see this page:

```typescript
"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { companiesApi } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { Card } from "@/components/ui/card"

export default function CompaniesPage() {
  const router = useRouter()
  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: () => companiesApi.list(),
  })

  const handleSelectCompany = (companyId: string) => {
    router.push(`/company/${companyId}/jobs`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Select Company</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies?.map((company) => (
            <Card
              key={company.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSelectCompany(company.id)}
            >
              {company.logo_url && (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="h-12 mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
              <p className="text-gray-600 text-sm">{company.industry}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
```

#### 2. Jobs List Page (`app/company/[companyId]/jobs/page.tsx`)

Main jobs listing with filtering, sorting, and search:

```typescript
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { jobsApi } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { JobStatus } from "@/types"

export default function JobsPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.companyId as string

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<JobStatus | undefined>()

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", companyId, search, status],
    queryFn: () => jobsApi.listVacancies(companyId, { search, status }),
  })

  const handleJobClick = (jobId: string) => {
    router.push(`/company/${companyId}/jobs/${jobId}/applicants`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Jobs You're Hiring For</h1>
          
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search for job"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => setStatus(undefined)}
                className={`px-4 py-2 rounded-md ${!status ? 'bg-brand-blue text-white' : 'bg-white'}`}
              >
                All
              </button>
              <button
                onClick={() => setStatus('OPEN')}
                className={`px-4 py-2 rounded-md ${status === 'OPEN' ? 'bg-brand-blue text-white' : 'bg-white'}`}
              >
                Active
              </button>
              <button
                onClick={() => setStatus('CLOSED')}
                className={`px-4 py-2 rounded-md ${status === 'CLOSED' ? 'bg-brand-blue text-white' : 'bg-white'}`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Position Title</th>
                <th className="text-left p-4">Date Posted</th>
                <th className="text-left p-4">Closing Date</th>
                <th className="text-left p-4">Applicants</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs?.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => handleJobClick(job.id)}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4">{job.title}</td>
                  <td className="p-4">
                    {job.date_posted && new Date(job.date_posted).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {job.closing_date && new Date(job.closing_date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {job.stats.total_applicants}
                    {job.stats.new_applicants_since_last_login > 0 && (
                      <span className="ml-2 text-green-600">
                        +{job.stats.new_applicants_since_last_login}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant={job.status === 'OPEN' ? 'success' : 'secondary'}>
                      {job.status === 'OPEN' ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

#### 3. Applicants List Page (`app/company/[companyId]/jobs/[jobId]/applicants/page.tsx`)

Applicants list with filtering by recommendation and detailed view:

```typescript
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { applicantsApi } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ApplicantDetailsPanel } from "@/components/applicant-details-panel"

export default function ApplicantsPage() {
  const params = useParams()
  const companyId = params.companyId as string
  const jobId = params.jobId as string

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<string>("all")
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null)

  const { data: applicants } = useQuery({
    queryKey: ["applicants", companyId, jobId, search, filter],
    queryFn: () => applicantsApi.list(companyId, { 
      job_posting_id: jobId, 
      search, 
      filter: filter as any 
    }),
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">HR Operations Manager</h1>

        <div className="mb-6 flex gap-4">
          <Input
            placeholder="Search for applicant"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />

          <div className="flex gap-2">
            {["all", "strong", "possible", "not_recommended", "starred"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md ${filter === f ? 'bg-brand-blue text-white' : 'bg-white'}`}
              >
                {f.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Applicant</th>
                  <th className="text-left p-4">Location</th>
                  <th className="text-left p-4">Match Score</th>
                  <th className="text-left p-4">Recommendation</th>
                  <th className="text-left p-4">Current Employer</th>
                </tr>
              </thead>
              <tbody>
                {applicants?.map((applicant) => (
                  <tr
                    key={applicant.id}
                    onClick={() => setSelectedApplicant(applicant.id)}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">{/* Applicant name from CV analysis */}</td>
                    <td className="p-4">{/* Location */}</td>
                    <td className="p-4">{/* Match score */}</td>
                    <td className="p-4">{/* Recommendation badge */}</td>
                    <td className="p-4">{/* Current employer */}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedApplicant && (
            <ApplicantDetailsPanel
              companyId={companyId}
              applicantId={selectedApplicant}
              onClose={() => setSelectedApplicant(null)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
```

### Phase 4: Custom Hooks (Priority: MEDIUM)

Create React hooks for common operations:

#### 1. `hooks/use-auth.ts`
```typescript
import { useQuery, useMutation } from "@tanstack/react-query"
import { authApi } from "@/lib/api"
import { useRouter } from "next/navigation"

export function useAuth() {
  const router = useRouter()

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
  })

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      router.push("/login")
    },
  })

  return { user, isLoading, logout: logout.mutate }
}
```

#### 2. `hooks/use-companies.ts`
Query hook for companies

#### 3. `hooks/use-jobs.ts`
Query hooks for jobs with filters

#### 4. `hooks/use-applicants.ts`
Query hooks for applicants with filters

### Phase 5: Advanced Features (Priority: LOW)

1. **Company Profile Page** - Create/edit company info
2. **Job Description Overlay** - Modal showing full JD
3. **Applicant Details Panel** - Right sidebar with full CV analysis
4. **File Upload Components** - CV upload with progress
5. **Pagination Components** - Table pagination controls
6. **Column Chooser** - Show/hide table columns
7. **Export Features** - Download CSV, PDFs

## Testing Checklist

- [ ] Login flow works
- [ ] Company selector shows companies
- [ ] Jobs list displays and filters work
- [ ] Applicants list displays and filters work
- [ ] Applicant details panel shows full analysis
- [ ] File downloads work (CVs, JDs)
- [ ] Sorting and pagination work
- [ ] API errors are handled gracefully
- [ ] Loading states display correctly
- [ ] Responsive design works on mobile

## Performance Optimization

1. Use `React.memo()` for expensive components
2. Implement virtual scrolling for long lists
3. Add debounce to search inputs
4. Use proper React Query cache configuration
5. Lazy load heavy components

## Security

1. Keep tokens in httpOnly cookies (if possible)
2. Implement CSRF protection
3. Sanitize user inputs
4. Use proper CORS configuration
5. Implement rate limiting on frontend

## Next Steps

1. Complete remaining UI components
2. Build all application pages
3. Implement custom hooks
4. Add error boundaries
5. Set up testing (Jest, React Testing Library)
6. Add E2E tests (Playwright/Cypress)
7. Performance monitoring (Web Vitals)
8. Add accessibility features (ARIA labels, keyboard navigation)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Table](https://tanstack.com/table)
- [Tailwind CSS](https://tailwindcss.com/)
