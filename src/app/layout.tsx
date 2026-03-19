import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "StreakMaster — Build unbreakable daily habits with visual streak tracking",
  description: "StreakMaster helps busy professionals and students build consistent daily habits through visual streak tracking, smart reminders, and detailed progres",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  )
}