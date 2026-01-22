import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { passphrase } = await request.json()
    const adminKey = process.env.ADMIN_KEY

    if (!adminKey) {
      return NextResponse.json({ error: "Server not configured" }, { status: 500 })
    }

    if (passphrase === adminKey) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid passphrase" }, { status: 401 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
