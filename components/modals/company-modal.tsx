"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Company, CompanyCreate } from "@/types"

const INDUSTRIES = [
  "Technology & IT",
  "Media & Publishing",
  "Finance & Banking",
  "Healthcare & Medical",
  "Retail & E-commerce",
  "Hospitality & Tourism",
  "Education & Training",
  "Manufacturing",
  "Real Estate",
  "Professional Services",
  "Other"
]

interface CompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (company: Partial<Company>) => Promise<void>
  company?: Company | null
}

export function CompanyModal({ isOpen, onClose, onSave, company }: CompanyModalProps) {
  const [formData, setFormData] = useState<Partial<CompanyCreate>>({
    ref_id: "",
    name: "",
    industry: "",
    description: "",
    website: "",
    contact_person_name: "",
    contact_person_position: "",
    contact_person_email: ""
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (company) {
      setFormData({
        ref_id: company.ref_id,
        name: company.name,
        industry: company.industry,
        description: company.description,
        website: company.website,
        contact_person_name: company.contact_person_name,
        contact_person_position: company.contact_person_position,
        contact_person_email: company.contact_person_email
      })
      setLogoPreview(company.logo_url || null)
    } else {
      resetForm()
    }
  }, [company, isOpen])

  const resetForm = () => {
    setFormData({
      ref_id: "",
      name: "",
      industry: "",
      description: "",
      website: "",
      contact_person_name: "",
      contact_person_position: "",
      contact_person_email: ""
    })
    setLogoFile(null)
    setLogoPreview(null)
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (PNG, JPG, WEBP)",
          variant: "error"
        })
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo must be smaller than 5MB",
          variant: "error"
        })
        return
      }

      setLogoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = (): boolean => {
    if (!formData.ref_id || !formData.name || !formData.industry) {
      toast({
        title: "Missing required fields",
        description: "Ref ID, Company Name, and Industry are required",
        variant: "error"
      })
      return false
    }

    if (formData.contact_person_email && !formData.contact_person_email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "error"
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // In production, upload logo first if file exists
      let logo_url = company?.logo_url
      if (logoFile) {
        // TODO: Upload logo to server
        // const uploadResponse = await uploadLogo(company?.id, logoFile)
        // logo_url = uploadResponse.logo_url
        logo_url = logoPreview // For now, use preview
      }

      await onSave({
        ...formData,
        logo_url
      })

      resetForm()
    } catch (error) {
      console.error("Failed to save company:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {company ? "Edit Company" : "Create New Company"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Company Logo</label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="w-20 h-20 rounded object-cover border"
                />
              ) : (
                <div className="w-20 h-20 rounded bg-gray-100 border flex items-center justify-center text-gray-400">
                  No logo
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Ref ID */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Ref ID <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.ref_id}
              onChange={(e) => setFormData({ ...formData, ref_id: e.target.value })}
              placeholder="e.g., LM001"
              disabled={!!company} // Can't change ref_id after creation
            />
            <p className="text-xs text-gray-500 mt-1">
              Unique identifier for the company
            </p>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Lovin Malta"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Industry <span className="text-red-500">*</span>
            </label>
            <Select 
              value={formData.industry} 
              onValueChange={(value) => setFormData({ ...formData, industry: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          {/* Company Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Company Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the company..."
              rows={3}
            />
          </div>

          {/* Contact Person Details */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Contact Person</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={formData.contact_person_name}
                  onChange={(e) => setFormData({ ...formData, contact_person_name: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <Input
                  value={formData.contact_person_position}
                  onChange={(e) => setFormData({ ...formData, contact_person_position: e.target.value })}
                  placeholder="e.g., HR Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.contact_person_email}
                  onChange={(e) => setFormData({ ...formData, contact_person_email: e.target.value })}
                  placeholder="e.g., hr@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            {isSubmitting ? "Saving..." : company ? "Update Company" : "Create Company"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
