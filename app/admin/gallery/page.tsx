"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminAuth } from "@/components/admin/admin-auth"
import { PhotoUpload } from "@/components/admin/photo-upload"
import { PhotoForm } from "@/components/admin/photo-form"
import { PhotoTable } from "@/components/admin/photo-table"
import { BatchUpload } from "@/components/admin/batch-upload"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Plus, ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import type { Photo, PhotoFormData } from "@/lib/photos"

interface FileWithMetadata {
  file: File
  preview: string
  title: string
  location: string
  date: string
  description: string
}

export default function AdminGalleryPage() {
  const [adminKey, setAdminKey] = useState("")
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<PhotoFormData>({
    title: "",
    location: "",
    date: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await fetch("/api/photos")
      if (response.ok) {
        const data = await response.json()
        setPhotos(data)
      }
    } catch (error) {
      console.error("Failed to fetch photos:", error)
      toast.error("Failed to load photos")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!selectedFile) {
      errors.image = "Please select an image"
    }
    if (!formData.title.trim()) {
      errors.title = "Title is required"
    }
    if (!formData.location.trim()) {
      errors.location = "Location is required"
    }
    if (!formData.date.trim()) {
      errors.date = "Date is required"
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddPhoto = async () => {
    if (!validateForm() || !selectedFile) return

    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("image", selectedFile)
      formDataToSend.append("title", formData.title)
      formDataToSend.append("location", formData.location)
      formDataToSend.append("date", formData.date)
      formDataToSend.append("description", formData.description)

      const response = await fetch("/api/photos", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey,
        },
        body: formDataToSend,
      })

      if (response.status === 401) {
        toast.error("Invalid admin key. Please log out and try again.")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to add photo")
      }

      const newPhotos = await response.json()
      const photosArray = Array.isArray(newPhotos) ? newPhotos : [newPhotos]
      setPhotos([...photosArray, ...photos])
      setIsAddOpen(false)
      resetForm()
      toast.success("Photo added successfully")
    } catch (error) {
      console.error("Failed to add photo:", error)
      toast.error("Failed to add photo")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBatchUpload = async (files: FileWithMetadata[]) => {
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()

      files.forEach((f) => {
        formDataToSend.append("images", f.file)
        formDataToSend.append("titles", f.title)
        formDataToSend.append("locations", f.location)
        formDataToSend.append("dates", f.date)
        formDataToSend.append("descriptions", f.description)
      })

      const response = await fetch("/api/photos", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey,
        },
        body: formDataToSend,
      })

      if (response.status === 401) {
        toast.error("Invalid admin key. Please log out and try again.")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to upload photos")
      }

      const newPhotos = await response.json()
      const photosArray = Array.isArray(newPhotos) ? newPhotos : [newPhotos]
      setPhotos([...photosArray, ...photos])
      setIsAddOpen(false)
      toast.success(`${photosArray.length} photo(s) uploaded successfully`)
    } catch (error) {
      console.error("Failed to upload photos:", error)
      toast.error("Failed to upload photos")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdatePhoto = async (id: string, data: PhotoFormData) => {
    try {
      const response = await fetch("/api/photos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ id, ...data }),
      })

      if (response.status === 401) {
        toast.error("Invalid admin key. Please log out and try again.")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to update photo")
      }

      const updatedPhoto = await response.json()
      setPhotos(photos.map((p) => (p.id === id ? updatedPhoto : p)))
      toast.success("Photo updated successfully")
    } catch (error) {
      console.error("Failed to update photo:", error)
      toast.error("Failed to update photo")
    }
  }

  const handleDeletePhoto = async (id: string) => {
    try {
      const response = await fetch(`/api/photos?id=${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": adminKey,
        },
      })

      if (response.status === 401) {
        toast.error("Invalid admin key. Please log out and try again.")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to delete photo")
      }

      setPhotos(photos.filter((p) => p.id !== id))
      toast.success("Photo deleted successfully")
    } catch (error) {
      console.error("Failed to delete photo:", error)
      toast.error("Failed to delete photo")
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setFormData({
      title: "",
      location: "",
      date: "",
      description: "",
    })
    setFormErrors({})
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Gallery Admin</h1>
        </div>

        <AdminAuth onAdminKey={setAdminKey}>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Manage photos for the Scenic Lookout gallery
              </p>
              <Dialog
                open={isAddOpen}
                onOpenChange={(open) => {
                  setIsAddOpen(open)
                  if (!open) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Photos
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add Photos</DialogTitle>
                    <DialogDescription>
                      Upload one or multiple images to the gallery.
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="batch" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="batch">
                        <Upload className="w-4 h-4 mr-2" />
                        Batch Upload
                      </TabsTrigger>
                      <TabsTrigger value="single">
                        <Plus className="w-4 h-4 mr-2" />
                        Single Photo
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="batch" className="mt-4">
                      <BatchUpload
                        onUpload={handleBatchUpload}
                        isUploading={isSubmitting}
                      />
                    </TabsContent>

                    <TabsContent value="single" className="mt-4 space-y-4">
                      <PhotoUpload onFileSelect={setSelectedFile} />
                      {formErrors.image && (
                        <p className="text-sm text-destructive">
                          {formErrors.image}
                        </p>
                      )}
                      <PhotoForm
                        data={formData}
                        onChange={setFormData}
                        errors={formErrors}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddOpen(false)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddPhoto}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Adding..." : "Add Photo"}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border rounded-lg">
              <PhotoTable
                photos={photos}
                onUpdate={handleUpdatePhoto}
                onDelete={handleDeletePhoto}
                isLoading={isLoading}
              />
            </div>
          </div>
        </AdminAuth>
      </div>
    </div>
  )
}
