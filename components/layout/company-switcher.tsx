"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

interface CompanySwitcherProps {
  location: "sidebar" | "header"
}

export function CompanySwitcher({ location }: CompanySwitcherProps) {
  const { memberships, activeCompany, setActiveCompany } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!activeCompany || memberships.length === 0) {
    return null
  }

  const handleSelect = (companyId: string) => {
    setActiveCompany(companyId)
    setIsOpen(false)
  }

  const getInitial = (name: string) => name.charAt(0).toUpperCase()

  return (
    <div className="relative">
      {location === "sidebar" && (
        <label className="text-xs font-medium text-gray-600 block mb-2">
          Active Company
        </label>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between rounded-md transition-colors",
          location === "sidebar" 
            ? "w-full px-3 py-2 bg-white border hover:bg-gray-50"
            : "px-3 py-2 bg-gray-50 hover:bg-gray-100"
        )}
      >
        <div className="flex items-center gap-2">
          {activeCompany.company_logo_url ? (
            <img 
              src={activeCompany.company_logo_url} 
              alt={activeCompany.company_name}
              className="w-6 h-6 rounded object-cover"
            />
          ) : (
            <div className="w-6 h-6 bg-brand-blue text-white rounded flex items-center justify-center text-xs font-bold">
              {getInitial(activeCompany.company_name)}
            </div>
          )}
          <span className="text-sm font-medium">{activeCompany.company_name}</span>
        </div>
        <svg 
          className={cn(
            "w-4 h-4 transition-transform",
            isOpen && "rotate-180"
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className={cn(
            "absolute z-20 mt-1 bg-white border rounded-md shadow-lg overflow-hidden",
            location === "sidebar" ? "left-0 right-0" : "right-0 min-w-[200px]"
          )}>
            {memberships.map(membership => (
              <button
                key={membership.company_id}
                onClick={() => handleSelect(membership.company_id)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {membership.company_logo_url ? (
                    <img 
                      src={membership.company_logo_url} 
                      alt={membership.company_name}
                      className="w-6 h-6 rounded object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-brand-blue text-white rounded flex items-center justify-center text-xs font-bold">
                      {getInitial(membership.company_name)}
                    </div>
                  )}
                  <span className="text-sm">{membership.company_name}</span>
                </div>
                {membership.company_id === activeCompany.company_id && (
                  <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
