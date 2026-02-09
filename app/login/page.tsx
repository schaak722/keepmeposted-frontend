"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // TEMPORARY HARDCODED CREDENTIALS FOR TESTING
  const TEMP_EMAIL = "admin@test.com"
  const TEMP_PASSWORD = "Admin123!"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Check hardcoded credentials
    if (email === TEMP_EMAIL && password === TEMP_PASSWORD) {
      // Set fake token for testing
      localStorage.setItem('access_token', 'fake-token-for-testing')
      localStorage.setItem('refresh_token', 'fake-refresh-token')
      
      // Redirect to companies page
      router.push("/companies")
    } else {
      setError("Invalid credentials. Use: admin@test.com / Admin123!")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">Keepmeposted</h1>
          <p className="text-sm text-gray-500 mt-2">Development Mode - Hardcoded Login</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Welcome back
          </h2>

          {/* Test Credentials Notice */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 font-semibold">Test Credentials:</p>
            <p className="text-xs text-blue-600 mt-1">Email: admin@test.com</p>
            <p className="text-xs text-blue-600">Password: Admin123!</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@test.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin123!"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-blue hover:bg-brand-blue-dark"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            This is a temporary hardcoded login for frontend testing.
            Backend authentication will be integrated later.
          </p>
        </div>
      </div>
    </div>
  )
}
