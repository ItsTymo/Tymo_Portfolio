import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Tymo's Portfolio",
  description: "A modern portfolio site blending Pacific Northwest adventure with tech and strategy",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ background: "#d5c8b5" }}>
      <body className="font-sans antialiased m-0 p-0">{children}</body>
    </html>
  )
}
