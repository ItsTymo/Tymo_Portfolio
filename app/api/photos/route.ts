import { NextRequest, NextResponse } from "next/server"
import { put, del, list } from "@vercel/blob"
import { PhotosArraySchema, type Photo } from "@/lib/photos"

async function readPhotos(): Promise<Photo[]> {
  try {
    // List all blobs with the metadata prefix
    const result = await list({ prefix: "photos-metadata" })
    console.log("Listed blobs:", result.blobs.length, result.blobs.map(b => b.pathname))

    if (result.blobs.length === 0) {
      console.log("No metadata blobs found")
      return []
    }

    // Sort by upload date and get the most recent
    const sortedBlobs = result.blobs.sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )

    console.log("Fetching metadata from:", sortedBlobs[0].url)

    // Fetch with no-cache to ensure fresh data
    const response = await fetch(sortedBlobs[0].url, {
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Failed to fetch metadata:", response.status, response.statusText)
      return []
    }

    const data = await response.json()
    console.log("Parsed photos count:", data.length)
    return PhotosArraySchema.parse(data)
  } catch (error) {
    console.error("Error reading photos:", error)
    return []
  }
}

async function writePhotos(photos: Photo[]): Promise<void> {
  // Get existing blobs BEFORE writing new one
  let oldBlobs: { url: string }[] = []
  try {
    const result = await list({ prefix: "photos-metadata" })
    oldBlobs = result.blobs
    console.log("Found", oldBlobs.length, "existing metadata blobs")
  } catch (error) {
    console.error("Error listing old metadata:", error)
  }

  // Write new metadata FIRST
  const newBlob = await put(
    `photos-metadata-${Date.now()}.json`,
    JSON.stringify(photos, null, 2),
    {
      access: "public",
      contentType: "application/json",
    }
  )
  console.log("Wrote metadata to:", newBlob.url, "with", photos.length, "photos")

  // Only delete old blobs AFTER new one is successfully written
  if (oldBlobs.length > 0) {
    try {
      await Promise.all(oldBlobs.map((blob) => del(blob.url)))
      console.log(`Deleted ${oldBlobs.length} old metadata files`)
    } catch (error) {
      console.error("Error deleting old metadata:", error)
    }
  }
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
  console.log("GET /api/photos called")
  const photos = await readPhotos()
  console.log("Returning", photos.length, "photos")
  return NextResponse.json(photos, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  })
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
      console.log(`Batch uploading ${files.length} files`)

      const uploadPromises = files.map(async (f, i) => {
        if (!f || !titles[i]) return null

        const id = generateId()
        const blob = await put(`gallery/${id}-${f.name}`, f, {
          access: "public",
        })

        console.log(`Uploaded file ${i}: ${blob.url}`)

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
    console.log(`Existing photos: ${existingPhotos.length}, New photos: ${newPhotos.length}`)

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

    if (!id || !title || !location || !date || description === undefined) {
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
    if (photo.src.includes("blob.vercel-storage.com")) {
      try {
        await del(photo.src)
        console.log(`Deleted image: ${photo.src}`)
      } catch (error) {
        console.error("Error deleting image:", error)
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
