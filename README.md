# KeepMePosted Frontend

AI-powered applicant CV screening dashboard built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Project Overview

This is the frontend application for KeepMePosted, a multi-tenant AI CV screening system that helps companies manage job postings and evaluate applicants using AI-powered analysis.

### Key Features

- 🔐 **Authentication**: Email/password and Google OAuth login
- 🏢 **Multi-Company Support**: Users can belong to multiple companies
- 📋 **Job Management**: Create, edit, and manage job postings
- 👥 **Applicant Screening**: AI-powered CV analysis with match scores
- 📊 **Detailed Analytics**: Comprehensive applicant profiles with scores
- 📥 **File Management**: Upload CVs, download reports
- 🎯 **Filtering & Sorting**: Advanced table controls
- ⭐ **Favorites**: Star important jobs and applicants

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Tables**: TanStack Table
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios

## Project Structure

```
keepmeposted-frontend/
├── app/                          # Next.js app directory
│   ├── login/                    # Login page
│   ├── companies/                # Company selector
│   ├── company/                  # Company-specific routes
│   │   └── [companyId]/
│   │       ├── profile/          # Company profile
│   │       └── jobs/             # Jobs list
│   │           └── [jobId]/
│   │               └── applicants/  # Applicants list
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   └── layout/                   # Layout components
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── page-header.tsx
│
├── lib/                          # Utilities and helpers
│   ├── api/                      # API client and services
│   │   ├── client.ts             # Axios client with interceptors
│   │   ├── auth.ts               # Auth API
│   │   ├── companies.ts          # Companies API
│   │   ├── jobs.ts               # Jobs API
│   │   ├── applicants.ts         # Applicants API
│   │   └── index.ts
│   └── utils.ts                  # Utility functions (cn, formatters)
│
├── types/                        # TypeScript type definitions
│   └── index.ts                  # All types from API schema
│
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts
│   ├── use-companies.ts
│   └── ...
│
├── public/                       # Static assets
│
├── .env.local.example            # Environment variables example
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies

```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend documentation)

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd keepmeposted-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and set:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME=KeepMePosted
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## User Flow

1. **Login** → `/login`
   - Email/password or Google OAuth

2. **Company Selector** → `/companies`
   - Select active company (if user has multiple)

3. **Company Profile** → `/company/[id]/profile`
   - Create/edit company profile (required before creating jobs)

4. **Jobs List** → `/company/[id]/jobs`
   - View, filter, sort job postings
   - Click job to view applicants

5. **Applicants List** → `/company/[id]/jobs/[jobId]/applicants`
   - View applicants with match scores
   - Filter by recommendation (Strong Fit, Possible Fit, Not Recommended)
   - Click applicant to view details

6. **Applicant Details** → Right panel overlay
   - AI match score (Overall + Preset Questions)
   - Professional background
   - Skills & qualifications
   - Detailed reasoning
   - Download CV

## Key Components

### Authentication
- JWT-based authentication with refresh token
- Automatic token refresh on 401 errors
- Protected routes with role-based access

### Multi-Company Architecture
- Company context stored in URL: `/company/[companyId]/...`
- All API calls scoped to active company
- Strict tenant isolation

### Data Tables
- TanStack Table for high-performance tables
- Server-side filtering, sorting, pagination
- Column chooser, search, status filters

### AI Match Scores
- **Overall Match Score**: Holistic candidate fit (0-100%)
- **Preset Questions Score**: Must-have requirements coverage (0-100%)
- **Final Recommendation**: Strong Match / Possible Fit / Not Recommended

### File Management
- CV upload (single and batch)
- Download CVs and job descriptions
- Progress tracking for batch uploads

## API Integration

All API calls go through the centralized `apiClient` in `lib/api/client.ts`:

```typescript
import { authApi, companiesApi, jobsApi, applicantsApi } from '@/lib/api'

// Login
const tokens = await authApi.login({ email, password })

// Get companies
const companies = await companiesApi.list()

// Get jobs for company
const jobs = await jobsApi.listVacancies(companyId, { status: 'OPEN' })

// Get applicants for job
const applicants = await applicantsApi.list(companyId, { job_posting_id: jobId })
```

## Development

### Code Organization
- **Pages**: In `app/` directory using Next.js App Router
- **Components**: Reusable UI in `components/`
- **API Logic**: Centralized in `lib/api/`
- **Types**: All TypeScript types in `types/`
- **Hooks**: Custom hooks in `hooks/`

### Styling
- Tailwind CSS utility classes
- Custom brand colors in `tailwind.config.ts`
- shadcn/ui components for consistency
- CSS variables for theming

### State Management
- TanStack Query for server state
- Local state with React hooks
- URL state for filters/pagination

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `KeepMePosted` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Issue: API connection failed
**Solution**: Verify `NEXT_PUBLIC_API_BASE_URL` in `.env.local` matches your backend URL

### Issue: Authentication errors
**Solution**: Clear browser localStorage and log in again

### Issue: Styling issues
**Solution**: Delete `.next` folder and restart dev server

## Contributing

This project follows the specifications in the Master Build Document v1.1.

## License

Proprietary - KeepMePosted
