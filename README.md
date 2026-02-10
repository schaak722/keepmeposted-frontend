# Phase 6A: Core Infrastructure & App Shell

## 🎯 Overview

This is **Phase 6A** - the foundation phase that transforms the frontend into a true multi-tenant admin portal with role-based access control, persistent navigation, and proper authentication.

## 📦 What's Included

### 1. **Updated TypeScript Types** (`types/index.ts`)
- Complete type definitions for multi-company model
- User with memberships array
- Enhanced Company, Job, Applicant models
- Salary bands and job categories
- Employment basis enum
- Role-based access types

### 2. **Essential UI Components** (`components/ui/`)
- ✅ `dialog.tsx` - Modal/dialog component (Radix UI)
- ✅ `dropdown-menu.tsx` - Dropdown menus for actions
- ✅ `checkbox.tsx` - Checkbox for multi-select
- ✅ `textarea.tsx` - Large text inputs
- ✅ `select.tsx` - Dropdown select
- ✅ `toast.tsx` - Toast notification system
- ✅ `toaster.tsx` - Toast container
- ✅ `skeleton.tsx` - Loading skeletons

### 3. **Layout Components** (`components/layout/`)
- ✅ `app-shell.tsx` - Main layout wrapper (sidebar + header + content)
- ✅ `sidebar.tsx` - Persistent left sidebar with role-based navigation
- ✅ `header.tsx` - Top header with mobile menu + logout
- ✅ `company-switcher.tsx` - Company switcher for clients

### 4. **Authentication System** (`contexts/`)
- ✅ `auth-context.tsx` - User session management
  - Login/logout functionality
  - Multi-company memberships
  - Active company tracking
  - Role-based access checks
  - Route permission checks

### 5. **Hooks** (`hooks/`)
- ✅ `use-toast.ts` - Toast notification hook

### 6. **Updated Root Layout** (`app/layout.tsx`)
- Wraps app with AuthProvider
- Integrates AppShell
- Adds Toaster for notifications

---

## 🚀 How to Integrate Phase 6A

### Step 1: Upload to GitHub

1. **Download and extract** `phase6a-core-infrastructure.zip`
2. **Go to GitHub**: https://github.com/schaak722/keepmeposted-frontend
3. **Upload all folders**:
   - `types/` - Replaces existing types
   - `components/ui/` - Adds new UI components (keeps existing)
   - `components/layout/` - NEW folder
   - `contexts/` - NEW folder
   - `hooks/` - NEW folder (or adds to existing)
   - `app/layout.tsx` - Replaces existing layout
4. **Commit changes**
5. **Wait** for Koyeb to deploy

### Step 2: Update package.json Dependencies

Add these Radix UI dependencies (required for new components):

```json
"dependencies": {
  "@radix-ui/react-checkbox": "^1.0.4",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-toast": "^1.1.5"
}
```

Run `npm install` in GitHub Codespaces or locally.

### Step 3: Update Login Page

Update `app/login/page.tsx` to use real authentication:

```typescript
"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      // Redirect handled by auth context
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">Keepmeposted</h1>
          <p className="text-sm text-gray-500 mt-2">AI Applicant Screening</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6">Welcome back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-brand-blue hover:bg-brand-blue-dark"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

---

## 🎨 Key Features

### Role-Based Navigation

**IT Admin** sees:
- 🏢 Companies
- 💼 Jobs
- 👥 Applicants
- ⚙️ User Management

**Internal Ops (Business Admin)** sees:
- 🏢 Companies
- 💼 Jobs
- 👥 Applicants

**Client** sees:
- 💼 Jobs (scoped to their companies)
- Company Switcher (sidebar + header)

### Responsive Design

- **Desktop (≥1024px)**: Persistent sidebar visible
- **Tablet/Mobile (<1024px)**: Hamburger menu, sidebar slides in
- **Company Switcher**: Shows in both sidebar (client) and header

### Loading States

Use the skeleton components for better UX:

```typescript
import { TableSkeleton, PageSkeleton } from "@/components/ui/skeleton"

// While loading
if (isLoading) {
  return <TableSkeleton rows={5} />
}
```

### Toast Notifications

Use toast for user feedback:

```typescript
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()

// Success
toast({
  title: "Success!",
  description: "Company created successfully",
  variant: "success"
})

// Error
toast({
  title: "Error",
  description: "Failed to create company",
  variant: "error"
})
```

---

## 🔐 Authentication Flow

1. **User logs in** → Stores tokens in localStorage
2. **AuthContext loads** → Restores session from localStorage
3. **Redirect based on role**:
   - Client → `/company/{first-company-id}/jobs`
   - Admin/Internal Ops → `/companies`
4. **Navigation filtered** → Shows only allowed routes
5. **Company switching** → Updates active company + redirects

---

## 📋 What Changed from Previous Phases

### Removed Files
- ❌ `app/companies/page.tsx` (old card-based selector)
- ❌ Hardcoded login logic

### Updated Files
- ✅ `types/index.ts` - Complete rewrite with multi-company
- ✅ `app/layout.tsx` - Now includes AuthProvider + AppShell
- ✅ `app/login/page.tsx` - Should use real auth (see Step 3)

### New Files
- ✅ All layout components
- ✅ Auth context
- ✅ New UI components (dialogs, dropdowns, etc.)
- ✅ Toast system
- ✅ Loading skeletons

---

## 🧪 How to Test

### 1. Test Navigation (After Login)

**As IT Admin:**
- See all 4 nav items
- Click each → verify routing works
- No company switcher visible

**As Business Admin:**
- See 3 nav items (no User Management)
- Verify routing works

**As Client:**
- See only Jobs
- See Company Switcher in sidebar
- Click company switcher → see all companies
- Switch company → URL updates

### 2. Test Mobile Responsiveness

- Resize to mobile width
- Click hamburger menu → sidebar slides in
- Click backdrop or nav item → sidebar closes
- Company switcher works in mobile

### 3. Test Toast Notifications

```typescript
// Test in any component
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()

<button onClick={() => toast({ 
  title: "Test", 
  description: "It works!",
  variant: "success"
})}>
  Test Toast
</button>
```

---

## ⚠️ Important Notes

### Backend Integration Required

Phase 6A assumes your backend has these endpoints:

```
POST /auth/login
  Body: { email, password }
  Returns: { access_token, refresh_token, user }

GET /me
  Headers: Authorization: Bearer {token}
  Returns: User with memberships
```

User response should match this structure:

```typescript
{
  id: string
  email: string
  full_name: string
  role: "it_admin" | "business_admin" | "client"
  memberships: [
    {
      company_id: string
      company_name: string
      company_logo_url?: string
      role: string
      is_active: boolean
    }
  ]
}
```

### Temporary Mock Data

If backend isn't ready, you can keep hardcoded login temporarily:

```typescript
// In auth-context.tsx login function
if (email === "admin@test.com" && password === "Admin123!") {
  const mockUser: User = {
    id: "1",
    email: email,
    full_name: "Admin User",
    role: Role.IT_ADMIN,
    memberships: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  // Continue with mock flow...
}
```

---

## 🎯 What's Next: Phase 6B

After Phase 6A is deployed and tested:

**Phase 6B: Internal Ops Platform** will add:
- Companies Management page (table + CRUD)
- Logo upload functionality
- Global Jobs page with Create Job modal
- Global Applicants page
- User Management page (admin only)

**Phase 6C: Client Experience** will add:
- Enhanced client jobs page
- 3-dots actions menu
- Job Details modal
- Updated applicants table

---

## ✅ Phase 6A Checklist

- [ ] Upload all folders to GitHub
- [ ] Update package.json dependencies
- [ ] Run `npm install`
- [ ] Update login page to use real auth
- [ ] Test navigation for all roles
- [ ] Test mobile responsiveness
- [ ] Test company switcher (client role)
- [ ] Test toast notifications
- [ ] Verify backend endpoints exist
- [ ] Report: "Phase 6A deployed ✅" or share errors

---

## 🆘 Troubleshooting

**Sidebar not showing:**
- Check AuthProvider is wrapping app
- Verify user is logged in
- Check browser width (hidden on mobile)

**Navigation not filtering:**
- Verify user role is set correctly
- Check Role enum matches backend values

**Company Switcher not showing:**
- Only visible for client users
- Requires memberships array with data

**Toast not appearing:**
- Check Toaster is in root layout
- Verify useToast is called correctly
- Check z-index isn't blocked

**Build errors:**
- Install Radix UI dependencies
- Check all import paths use `@/`
- Verify TypeScript types are correct

---

## 📞 Support

After deployment, report status:
- **Success**: "Phase 6A deployed ✅ - Navigation working!"
- **Issues**: Share error messages from Koyeb logs or browser console
