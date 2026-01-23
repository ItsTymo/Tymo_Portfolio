"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PhotoForm } from "./photo-form"
import { Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import type { Photo, PhotoFormData } from "@/lib/photos"

type SortField = "title" | "location" | "date"
type SortDirection = "asc" | "desc"

interface PhotoTableProps {
  photos: Photo[]
  onUpdate: (id: string, data: PhotoFormData) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isLoading?: boolean
}

export function PhotoTable({ photos, onUpdate, onDelete, isLoading }: PhotoTableProps) {
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)
  const [deletingPhoto, setDeletingPhoto] = useState<Photo | null>(null)
  const [formData, setFormData] = useState<PhotoFormData>({
    title: "",
    location: "",
    date: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const sortedPhotos = useMemo(() => {
    if (!sortField) return photos

    return [...photos].sort((a, b) => {
      let comparison = 0
      if (sortField === "title") {
        comparison = a.title.localeCompare(b.title)
      } else if (sortField === "location") {
        comparison = a.location.localeCompare(b.location)
      } else if (sortField === "date") {
        comparison = a.date.localeCompare(b.date)
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [photos, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else {
        setSortField(null)
        setSortDirection("asc")
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />
    return sortDirection === "asc"
      ? <ArrowUp className="w-4 h-4 ml-1" />
      : <ArrowDown className="w-4 h-4 ml-1" />
  }

  const handleEditClick = (photo: Photo) => {
    setEditingPhoto(photo)
    setFormData({
      title: photo.title,
      location: photo.location,
      date: photo.date,
      description: photo.description,
    })
  }

  const handleEditSubmit = async () => {
    if (!editingPhoto) return

    setIsSubmitting(true)
    try {
      await onUpdate(editingPhoto.id, formData)
      setEditingPhoto(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingPhoto) return

    setIsSubmitting(true)
    try {
      await onDelete(deletingPhoto.id)
      setDeletingPhoto(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading photos...
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No photos yet. Add your first photo above.
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>
              <button
                className="flex items-center hover:text-foreground transition-colors"
                onClick={() => handleSort("title")}
              >
                Title
                <SortIcon field="title" />
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <button
                className="flex items-center hover:text-foreground transition-colors"
                onClick={() => handleSort("location")}
              >
                Location
                <SortIcon field="location" />
              </button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <button
                className="flex items-center hover:text-foreground transition-colors"
                onClick={() => handleSort("date")}
              >
                Date
                <SortIcon field="date" />
              </button>
            </TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPhotos.map((photo) => (
            <TableRow key={photo.id}>
              <TableCell>
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-16 h-12 object-cover rounded"
                />
              </TableCell>
              <TableCell className="font-medium">{photo.title}</TableCell>
              <TableCell className="hidden md:table-cell">{photo.location}</TableCell>
              <TableCell className="hidden md:table-cell">{photo.date}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleEditClick(photo)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeletingPhoto(photo)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog open={!!editingPhoto} onOpenChange={() => setEditingPhoto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
            <DialogDescription>
              Update the metadata for this photo.
            </DialogDescription>
          </DialogHeader>

          {editingPhoto && (
            <div className="space-y-4">
              <img
                src={editingPhoto.src}
                alt={editingPhoto.title}
                className="w-full h-32 object-cover rounded"
              />
              <PhotoForm data={formData} onChange={setFormData} />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingPhoto(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingPhoto} onOpenChange={() => setDeletingPhoto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Photo</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingPhoto?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deletingPhoto && (
            <img
              src={deletingPhoto.src}
              alt={deletingPhoto.title}
              className="w-full h-32 object-cover rounded"
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingPhoto(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
