"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { PhotoFormData } from "@/lib/photos"

interface PhotoFormProps {
  data: PhotoFormData
  onChange: (data: PhotoFormData) => void
  errors?: Record<string, string>
}

export function PhotoForm({ data, onChange, errors }: PhotoFormProps) {
  const handleChange = (field: keyof PhotoFormData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Mountain Vista"
        />
        {errors?.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="location" className="text-sm font-medium">
          Location
        </label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="Pacific Northwest"
        />
        {errors?.location && (
          <p className="text-sm text-destructive">{errors.location}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium">
          Date
        </label>
        <Input
          id="date"
          value={data.date}
          onChange={(e) => handleChange("date", e.target.value)}
          placeholder="2024"
        />
        {errors?.date && (
          <p className="text-sm text-destructive">{errors.date}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="A breathtaking view from the alpine trails..."
          rows={3}
        />
        {errors?.description && (
          <p className="text-sm text-destructive">{errors.description}</p>
        )}
      </div>
    </div>
  )
}
