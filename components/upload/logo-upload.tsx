"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"

interface LogoUploadProps {
  value?: string
  onChange: (dataUrl?: string) => void
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handlePick = () => inputRef.current?.click()

  const handleFile = async (file: File) => {
    // Convert to data URL for mock persistence (works without backend)
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : undefined
      onChange(result)
    }
    reader.onerror = () => onChange(undefined)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Company logo" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground">Logo</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void handleFile(f)
          }}
        />
        <Button type="button" variant="outline" onClick={handlePick}>
          Upload
        </Button>
        {value ? (
          <Button type="button" variant="ghost" onClick={() => onChange(undefined)}>
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  )
}
