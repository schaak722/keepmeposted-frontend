"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // This calls auth-context which has the proper role-based logic
      await login(email, password)
      // Redirect happens automatically in auth-context
    } catch (err) {
      setError("Invalid credentials")
      setLoading(false)
    }
  }

  // Quick login helper
  const quickLogin = async (testEmail: string, testPassword: string) => {
    setEmail(testEmail)
    setPassword(testPassword)
    setError("")
    setLoading(true)

    try {
      await login(testEmail, testPassword)
    } catch (err) {
      setError("Invalid credentials")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">Keepmeposted</h1>
          <p className="text-sm text-gray-500 mt-2">AI Applicant Screening Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Welcome back
          </h2>

          {/* Quick Test Login Buttons */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm font-semibold text-blue-900 mb-3">Quick Login:</p>
            <div className="space-y-2">
              <Button
                onClick={() => quickLogin("admin@test.com", "Admin123!")}
                className="w-full bg-green-600 hover:bg-green-700 text-sm justify-start"
                type="button"
                disabled={loading}
              >
                🔐 IT Admin (Full Access)
              </Button>
              <Button
                onClick={() => quickLogin("ops@test.com", "Admin123!")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-sm justify-start"
                type="button"
                disabled={loading}
              >
                🔐 Internal Ops (No User Management)
              </Button>
              <Button
                onClick={() => quickLogin("client@test.com", "Client123!")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-sm justify-start"
                type="button"
                disabled={loading}
              >
                🔐 Client (Jobs Only)
              </Button>
            </div>
          </div>

          {/* OR Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or login manually</span>
            </div>
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
                placeholder="your.email@example.com"
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
                placeholder="Enter password"
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

          {/* Test Credentials Info */}
          <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-xs font-semibold text-gray-700 mb-2">Test Credentials:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>IT Admin:</strong> admin@test.com / Admin123!</p>
              <p><strong>Internal Ops:</strong> ops@test.com / Admin123!</p>
              <p><strong>Client:</strong> client@test.com / Client123!</p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            Mock authentication for testing. Backend integration pending.
          </p>
        </div>
      </div>
    </div>
  )
}
