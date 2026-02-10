"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TableSkeleton } from "@/components/ui/skeleton"
import type { User, Role } from "@/types"
import { useToast } from "@/hooks/use-toast"

// Mock data
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@keepmeposted.com",
    full_name: "Admin User",
    role: "it_admin",
    memberships: [],
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z"
  },
  {
    id: "2",
    email: "ops@keepmeposted.com",
    full_name: "Operations Manager",
    role: "business_admin",
    memberships: [],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "3",
    email: "hr@lovinmalta.com",
    full_name: "John Doe",
    role: "client",
    memberships: [
      {
        company_id: "1",
        company_name: "Lovin Malta",
        role: "client",
        is_active: true
      }
    ],
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z"
  },
  {
    id: "4",
    email: "jane@techsolutions.com",
    full_name: "Jane Smith",
    role: "client",
    memberships: [
      {
        company_id: "2",
        company_name: "Tech Solutions Ltd",
        role: "client",
        is_active: true
      }
    ],
    created_at: "2024-02-05T10:00:00Z",
    updated_at: "2024-02-05T10:00:00Z"
  }
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleBadge = (role: Role) => {
    const variants: Record<Role, "default" | "success" | "warning"> = {
      it_admin: "success",
      business_admin: "warning",
      client: "default"
    }
    const labels: Record<Role, string> = {
      it_admin: "IT Admin",
      business_admin: "Internal Ops",
      client: "Client"
    }
    return <Badge variant={variants[role]}>{labels[role]}</Badge>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-gray-600">Manage user accounts and permissions (Admin only)</p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button 
          className="bg-brand-blue hover:bg-brand-blue/90"
          onClick={() => {
            toast({
              title: "Coming soon",
              description: "User invitation feature will be added in a future update",
              variant: "default"
            })
          }}
        >
          + Invite User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-2xl font-bold">{users.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Internal Staff</div>
          <div className="text-2xl font-bold">
            {users.filter(u => u.role !== "client").length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Client Users</div>
          <div className="text-2xl font-bold">
            {users.filter(u => u.role === "client").length}
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company Access</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchQuery ? "No users found matching your search" : "No users yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.memberships.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.memberships.map((membership, idx) => (
                            <Badge key={idx} variant="outline">
                              {membership.company_name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Coming soon",
                            description: "User editing feature will be added in a future update",
                            variant: "default"
                          })
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Full user management features (edit roles, manage company access, invite users) 
          will be implemented when the backend APIs are ready.
        </p>
      </div>
    </div>
  )
}
