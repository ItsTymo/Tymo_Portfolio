"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, Trash2 } from "lucide-react"

interface FileWithMetadata {
  file: File
  preview: string
  title: string
  location: string
  date: string
  description: string
}

interface BatchUploadProps {
  onUpload: (files: FileWithMetadata[]) => Promise<void>
  isUploading: boolean
}

export function BatchUpload({ onUpload, isUploading }: BatchUploadProps) {
  const [files, setFiles] = useState<FileWithMetadata[]>([])
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return

    const imageFiles = Array.from(newFiles).filter((f) =>
      f.type.startsWith("image/")
    )

    const filesWithMetadata: FileWithMetadata[] = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      location: "",
      date: new Date().getFullYear().toString(),
      description: "",
    }))

    setFiles((prev) => [...prev, ...filesWithMetadata])
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const updateMetadata = (
    index: number,
    field: keyof FileWithMetadata,
    value: string
  ) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    )
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    await onUpload(files)
    // Clean up previews
    files.forEach((f) => URL.revokeObjectURL(f.preview))
    setFiles([])
  }

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview))
    setFiles([])
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag & drop images or click to browse
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Select multiple files for batch upload
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </span>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {files.map((f, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 border rounded-lg bg-card"
              >
                <div className="relative w-20 h-20 flex-shrink-0">
                  <img
                    src={f.preview}
                    alt={f.title}
                    className="w-full h-full object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    className="absolute -top-2 -right-2 w-6 h-6"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Title"
                    value={f.title}
                    onChange={(e) =>
                      updateMetadata(index, "title", e.target.value)
                    }
                    className="h-8 text-sm"
                  />
                  <Input
                    placeholder="Location"
                    value={f.location}
                    onChange={(e) =>
                      updateMetadata(index, "location", e.target.value)
                    }
                    className="h-8 text-sm"
                  />
                  <Input
                    placeholder="Date (e.g., 2024)"
                    value={f.date}
                    onChange={(e) =>
                      updateMetadata(index, "date", e.target.value)
                    }
                    className="h-8 text-sm"
                  />
                  <Input
                    placeholder="Description"
                    value={f.description}
                    onChange={(e) =>
                      updateMetadata(index, "description", e.target.value)
                    }
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="w-full"
          >
            {isUploading
              ? "Uploading..."
              : `Upload ${files.length} photo${files.length !== 1 ? "s" : ""}`}
          </Button>
        </div>
      )}
    </div>
  )
}
