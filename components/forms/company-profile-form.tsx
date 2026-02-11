"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Company } from "@/types"
import { LogoUpload } from "@/components/upload/logo-upload"

export interface CompanyProfileFormValues {
  ref_id: string
  name: string
  logo_url?: string
  description?: string
  industry: string
  website?: string
}

interface CompanyProfileFormProps {
  initial?: Partial<Company>
  submitLabel?: string
  onSubmit: (values: CompanyProfileFormValues) => Promise<void> | void
  onCancel?: () => void
}

export function CompanyProfileForm({
  initial,
  submitLabel = "Save Company Profile",
  onSubmit,
  onCancel,
}: CompanyProfileFormProps) {
  const [values, setValues] = useState<CompanyProfileFormValues>({
    ref_id: initial?.ref_id || "",
    name: initial?.name || "",
    logo_url: initial?.logo_url,
    description: initial?.description || "",
    industry: initial?.industry || "",
    website: initial?.website || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = values.ref_id.trim() && values.name.trim() && values.industry.trim()

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!canSubmit) return
        setIsSubmitting(true)
        try {
          await onSubmit({
            ref_id: values.ref_id.trim(),
            name: values.name.trim(),
            logo_url: values.logo_url,
            description: values.description?.trim() || "",
            industry: values.industry.trim(),
            website: values.website?.trim() || "",
          })
        } finally {
          setIsSubmitting(false)
        }
      }}
    >
      <div className="space-y-2">
        <Label>Logo</Label>
        <LogoUpload
          value={values.logo_url}
          onChange={(logo_url) => setValues((v) => ({ ...v, logo_url }))}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ref_id">Ref ID *</Label>
          <Input
            id="ref_id"
            value={values.ref_id}
            onChange={(e) => setValues((v) => ({ ...v, ref_id: e.target.value }))}
            placeholder="Unique reference (e.g., LM001)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            placeholder="Company name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry *</Label>
        <Input
          id="industry"
          value={values.industry}
          onChange={(e) => setValues((v) => ({ ...v, industry: e.target.value }))}
          placeholder="e.g., Technology & IT"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={values.website}
          onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))}
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          placeholder="Short description of the company"
          rows={4}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
