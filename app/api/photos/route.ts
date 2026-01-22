import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { PhotosArraySchema, type Photo } from "@/lib/photos"

const PHOTOS_FILE = path.join(process.cwd(), "public", "data", "photos.json")
const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gallery")

async function readPhotos(): Promise<Photo[]> {
  try {
    const data = await fs.readFile(PHOTOS_FILE, "utf-8")
    const parsed = JSON.parse(data)
    return PhotosArraySchema.parse(parsed)
  } catch {
    return []
  }
}

async function writePhotos(photos: Photo[]): Promise<void> {
  await fs.writeFile(PHOTOS_FILE, JSON.stringify(photos, null, 2))
}

function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("x-admin-key")
  const adminKey = process.env.ADMIN_KEY
  if (!adminKey) return false
  return authHeader === adminKey
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
    const file = formData.get("image") as File | null
    const title = formData.get("title") as string
    const location = formData.get("location") as string
    const date = formData.get("date") as string
    const description = formData.get("description") as string

    if (!file || !title || !location || !date || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate unique filename
    const ext = path.extname(file.name)
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`
    const filepath = path.join(GALLERY_DIR, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await fs.writeFile(filepath, buffer)

    // Create photo entry
    const photos = await readPhotos()
    const newPhoto: Photo = {
      id: Date.now().toString(),
      src: `/images/gallery/${filename}`,
      title,
      location,
      date,
      description,
    }

    photos.unshift(newPhoto)
    await writePhotos(photos)

    return NextResponse.json(newPhoto, { status: 201 })
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

    // Delete file if it's a local gallery image
    if (photo.src.startsWith("/images/gallery/")) {
      const filename = path.basename(photo.src)
      const filepath = path.join(GALLERY_DIR, filename)
      try {
        await fs.unlink(filepath)
      } catch {
        // File may not exist, continue anyway
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
