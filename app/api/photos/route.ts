import { NextRequest, NextResponse } from "next/server"
import { put, del, list } from "@vercel/blob"
import { PhotosArraySchema, type Photo } from "@/lib/photos"

const PHOTOS_METADATA_KEY = "photos-metadata.json"

async function readPhotos(): Promise<Photo[]> {
  try {
    const { blobs } = await list({ prefix: PHOTOS_METADATA_KEY })
    if (blobs.length === 0) {
      return []
    }
    // Get the most recent blob
    const sortedBlobs = blobs.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )
    const response = await fetch(sortedBlobs[0].url, { cache: "no-store" })
    const data = await response.json()
    return PhotosArraySchema.parse(data)
  } catch (error) {
    console.error("Error reading photos:", error)
    return []
  }
}

async function writePhotos(photos: Photo[]): Promise<void> {
  // Write new metadata first
  await put(PHOTOS_METADATA_KEY, JSON.stringify(photos, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  })
}

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("x-admin-key")
  const adminKey = process.env.ADMIN_KEY
  if (!adminKey) return false
  return authHeader === adminKey
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

export async function GET() {
  const photos = await readPhotos()
  return NextResponse.json(photos)
}

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll("images") as File[]
    const file = formData.get("image") as File | null
    const titles = formData.getAll("titles") as string[]
    const locations = formData.getAll("locations") as string[]
    const dates = formData.getAll("dates") as string[]
    const descriptions = formData.getAll("descriptions") as string[]

    // Support both single and batch upload
    const title = formData.get("title") as string
    const location = formData.get("location") as string
    const date = formData.get("date") as string
    const description = formData.get("description") as string

    const newPhotos: Photo[] = []

    // Batch upload - upload all images in parallel
    if (files.length > 0 && titles.length > 0) {
      const uploadPromises = files.map(async (f, i) => {
        if (!f || !titles[i]) return null

        const id = generateId()
        const blob = await put(`gallery/${id}-${f.name}`, f, {
          access: "public",
        })

        return {
          id,
          src: blob.url,
          title: titles[i] || f.name.replace(/\.[^/.]+$/, ""),
          location: locations[i] || "Unknown",
          date: dates[i] || new Date().getFullYear().toString(),
          description: descriptions[i] || "",
        } as Photo
      })

      const results = await Promise.all(uploadPromises)
      newPhotos.push(...results.filter((p): p is Photo => p !== null))
    }
    // Single upload (backward compatible)
    else if (file && title) {
      const id = generateId()
      const blob = await put(`gallery/${id}-${file.name}`, file, {
        access: "public",
      })

      newPhotos.push({
        id,
        src: blob.url,
        title,
        location: location || "Unknown",
        date: date || new Date().getFullYear().toString(),
        description: description || "",
      })
    } else {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Read existing photos and add new ones
    const existingPhotos = await readPhotos()
    const allPhotos = [...newPhotos, ...existingPhotos]
    await writePhotos(allPhotos)

    return NextResponse.json(newPhotos, { status: 201 })
  } catch (error) {
    console.error("Error creating photo:", error)
    return NextResponse.json({ error: "Failed to create photo" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, title, location, date, description } = body

    if (!id || !title || !location || !date || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const photos = await readPhotos()
    const index = photos.findIndex((p) => p.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    photos[index] = {
      ...photos[index],
      title,
      location,
      date,
      description,
    }

    await writePhotos(photos)

    return NextResponse.json(photos[index])
  } catch (error) {
    console.error("Error updating photo:", error)
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing photo ID" }, { status: 400 })
    }

    const photos = await readPhotos()
    const photo = photos.find((p) => p.id === id)

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    // Delete image blob if it's a Vercel Blob URL
    if (photo.src.includes("vercel-storage.com") || photo.src.includes("blob.vercel-storage.com")) {
      try {
        await del(photo.src)
      } catch {
        // Ignore delete errors for image
      }
    }

    const updatedPhotos = photos.filter((p) => p.id !== id)
    await writePhotos(updatedPhotos)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting photo:", error)
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 })
  }
}
