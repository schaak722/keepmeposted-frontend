# Phase 6B: Internal Ops Platform

## 🎯 Overview

**Phase 6B** builds the core internal operations management pages for the KeepMePosted platform. This phase enables internal ops and admin users to manage companies, jobs, applicants, and users across the entire platform.

## 📦 What's Included

### 1. **Companies Management Page** (`app/companies/page.tsx`)
- Full company listing with search
- Create/Edit company modal
- Logo upload functionality
- Company contact information management
- Job and applicant counts per company

### 2. **Company Modal** (`components/modals/company-modal.tsx`)
- Create/Edit company profiles
- Logo file upload with validation
- Industry selection
- Contact person details
- Form validation

### 3. **Global Jobs Page** (`app/jobs/page.tsx`)
- All jobs across all companies
- Create/Edit job modal
- Search and filter jobs
- Job status management
- Applicant counts

### 4. **Job Modal** (`components/modals/job-modal.tsx`)
- Company selection
- Multi-select employment basis (Full-Time, Part-Time, etc.)
- Salary band dropdown
- Multi-select job categories
- Up to 3 preset questions
- Job description and company about
- Status and closing date

### 5. **Global Applicants Page** (`app/applicants/page.tsx`)
- All applicants across platform
- CV download functionality
- Search by name, company, position
- Overall scores and recommendations
- Stats dashboard

### 6. **User Management Page** (`app/users/page.tsx`)
- User listing (Admin only)
- Role badges
- Company access display
- User stats
- Placeholder for future edit/invite features

---

## 🚀 How to Integrate Phase 6B

### Step 1: Upload to GitHub

1. **Download and extract** `phase6b-internal-ops.zip`
2. **Upload all folders** to GitHub:
   - `app/companies/`
   - `app/jobs/`
   - `app/applicants/`
   - `app/users/`
   - `components/modals/`
3. **Commit changes**
4. **Wait** for Koyeb to deploy

### Step 2: Test the Pages

After deployment, navigate to each page:

**Companies Page** - `/companies`
- ✅ IT Admin and Internal Ops can access
- ✅ Client users cannot access (blocked by AppShell)
- ✅ Click "Add Company" to test modal
- ✅ Click company name to edit
- ✅ Upload logo (file validation works)

**Jobs Page** - `/jobs`
- ✅ IT Admin and Internal Ops can access
- ✅ Click "Create Job" to test modal
- ✅ Multi-select basis checkboxes work
- ✅ Salary band dropdown populates
- ✅ Categories multi-select works
- ✅ Up to 3 preset questions

**Applicants Page** - `/applicants`
- ✅ IT Admin and Internal Ops can access
- ✅ Stats cards show counts
- ✅ Click "Download CV" triggers download

**User Management** - `/users`
- ✅ IT Admin ONLY can access
- ✅ Internal Ops blocked (403 route check)
- ✅ Shows user listing with roles
- ✅ Displays company memberships

---

## 🎨 Key Features

### Companies Management

**Table Columns:**
- Logo (thumbnail or initial)
- Company Name (clickable to edit)
- Ref ID (badge)
- Industry
- Job Count
- Applicant Count
- Contact Person
- Edit button

**Create/Edit Modal:**
- Logo upload (PNG, JPG, WEBP, max 5MB)
- Ref ID (required, unique)
- Company Name (required)
- Industry dropdown (required)
- Website URL
- Company Description
- Contact Person Name
- Contact Person Position
- Contact Person Email (validated)

### Jobs Management

**Table Columns:**
- Job ID
- Company (logo + name)
- Position Title
- Date Posted
- Closing Date
- Applicant Count
- Status (Draft/Open/Closed)
- Edit button

**Create/Edit Modal:**
- Company selection (dropdown)
- Position Title
- Employment Basis (multi-select checkboxes)
  - Full-Time
  - Part-Time
  - Freelance
  - Hybrid
  - Temporary
- Location
- Seniority
- Salary Band (dropdown from predefined EUR bands)
- Job Categories (multi-select checkboxes)
- Job Description (textarea)
- About the Company (textarea)
- Preset Questions (3 optional text inputs)
- Closing Date (date picker)
- Status (Draft/Open/Closed)

### Applicants Management

**Table Columns:**
- Name (with email below)
- Company Applied For
- Position Applied For
- Date Applied
- Overall Score (color-coded)
- Recommendation badge
- Download CV button

**Stats Dashboard:**
- Total Applicants
- Strong Matches (green)
- Possible Fits (yellow)
- Not Recommended (red)

### User Management

**Table Columns:**
- Full Name
- Email
- Role (badge: IT Admin/Internal Ops/Client)
- Company Access (badges for each company)
- Edit button (placeholder)

**Stats:**
- Total Users
- Internal Staff
- Client Users

---

## 🔄 Current State: Mock Data

All pages currently use **mock data**. Here's what needs backend integration:

### Companies Page
```typescript
// Replace MOCK_COMPANIES with:
const { data: companies } = await apiClient.get("/companies")
```

### Jobs Page
```typescript
// Replace MOCK_JOBS with:
const { data: jobs } = await apiClient.get("/jobs") // Platform-wide jobs
```

### Applicants Page
```typescript
// Replace MOCK_APPLICANTS with:
const { data: applicants } = await apiClient.get("/applicants") // Platform-wide
```

### User Management
```typescript
// Replace MOCK_USERS with:
const { data: users } = await apiClient.get("/users") // Admin only
```

---

## 🔐 Access Control

Phase 6B pages automatically enforce role-based access via the AppShell:

| Page | IT Admin | Internal Ops | Client |
|------|----------|--------------|--------|
| `/companies` | ✅ | ✅ | ❌ |
| `/jobs` | ✅ | ✅ | ❌ |
| `/applicants` | ✅ | ✅ | ❌ |
| `/users` | ✅ | ❌ | ❌ |

Users attempting to access restricted pages will:
1. Not see the route in navigation (sidebar hides it)
2. Be blocked by `canAccessRoute()` check if they manually navigate

---

## 📋 Backend API Requirements

Phase 6B expects these endpoints to exist:

### Companies
```
GET    /companies
POST   /companies
PUT    /companies/:id
POST   /companies/:id/logo (multipart/form-data)
```

### Jobs
```
GET    /jobs (platform-wide)
POST   /companies/:companyId/jobs
PUT    /companies/:companyId/jobs/:jobId
```

### Applicants
```
GET    /applicants (platform-wide)
GET    /companies/:companyId/applicants/:applicantId/cv/download
```

### Users
```
GET    /users (admin only)
PUT    /users/:userId (admin only)
POST   /users/invite (admin only, future)
```

---

## 🧪 How to Test

### 1. Test Companies Page

```
1. Login as IT Admin or Internal Ops
2. Navigate to /companies
3. Click "+ Add Company"
4. Fill form:
   - Ref ID: TEST001
   - Name: Test Company
   - Industry: Technology & IT
   - Upload a logo (test file validation)
   - Fill contact person details
5. Click "Create Company"
6. Verify toast notification appears
7. Verify company appears in table
8. Click company name to edit
9. Update details and save
```

### 2. Test Jobs Page

```
1. Navigate to /jobs
2. Click "+ Create Job"
3. Select company from dropdown
4. Fill position title
5. Select multiple employment basis (e.g., Full-Time + Hybrid)
6. Select salary band
7. Select categories
8. Add 2-3 preset questions
9. Fill description
10. Set closing date
11. Set status to "Open"
12. Click "Create Job"
13. Verify job appears in table
```

### 3. Test Applicants Page

```
1. Navigate to /applicants
2. Verify stats cards show correct counts
3. Use search to filter
4. Click "Download CV" button
5. Verify toast notification
```

### 4. Test User Management (Admin Only)

```
1. Login as IT Admin
2. Navigate to /users
3. Verify page loads
4. Search for users
5. View company memberships
6. Logout and login as Internal Ops
7. Try to navigate to /users
8. Verify access blocked (sidebar doesn't show it)
```

---

## ✅ Phase 6B Checklist

- [ ] Upload all files to GitHub
- [ ] Commit and push
- [ ] Wait for Koyeb deployment
- [ ] Test Companies page (create, edit, logo upload)
- [ ] Test Jobs page (create with all fields)
- [ ] Test Applicants page (search, CV download)
- [ ] Test User Management (admin only access)
- [ ] Verify role-based access control works
- [ ] Report: "Phase 6B deployed ✅" or share errors

---

## 🆘 Troubleshooting

**"Page not found" errors:**
- Ensure all files are in correct directories
- Check AppShell is rendering pages
- Verify routes are accessible for your role

**Modal not opening:**
- Check browser console for errors
- Verify Dialog component imported correctly
- Test with simple button click

**Logo upload not working:**
- File validation requires image/* types
- Max size is 5MB
- Preview uses FileReader API

**Access denied to pages:**
- Check user role in session
- Verify canAccessRoute() logic in auth-context
- IT Admin has full access
- Internal Ops has Companies/Jobs/Applicants
- Client has none of these pages

---

## 🎯 What's Next: Phase 6C

After Phase 6B is deployed and tested:

**Phase 6C: Client Experience** will add:
- Enhanced client jobs page
- 3-dots actions menu on job rows
- Job Details modal (view full job info)
- Updated applicants table with new columns
- Polish and final tweaks

---

## 📞 Support

After deployment, report status:
- **Success**: "Phase 6B deployed ✅ - All pages working!"
- **Issues**: Share error messages or screenshots

---

## 💡 Implementation Notes

### Logo Upload
Currently stores base64 preview. In production:
```typescript
const formData = new FormData()
formData.append('logo_file', logoFile)
const response = await apiClient.post(
  `/companies/${companyId}/logo`, 
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
)
// response.data.logo_url
```

### Multi-Select Basis
Stores as array: `["Full-Time", "Hybrid"]`

Backend should expect:
```json
{
  "basis": ["Full-Time", "Hybrid"]
}
```

### Preset Questions
Stores as array, max 3, empty strings filtered out:
```json
{
  "preset_questions": [
    "What's your experience with React?",
    "Can you work remotely?"
  ]
}
```

### CV Download
Currently simulated. In production:
```typescript
const response = await apiClient.get(
  `/companies/${companyId}/applicants/${applicantId}/cv/download`,
  { responseType: 'blob' }
)
const url = window.URL.createObjectURL(response.data)
const link = document.createElement('a')
link.href = url
link.download = `${applicantName}-CV.pdf`
link.click()
```

---

**Phase 6B Ready to Deploy!** 🚀
