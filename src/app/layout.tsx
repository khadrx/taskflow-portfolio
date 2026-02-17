import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers" // ← أضف ده

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "نظام إدارة مهام ومشاريع احترافي",
}

import { Noto_Sans_Arabic } from "next/font/google"

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-arabic",
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={`${notoArabic.variable}`}>
      <body className="font-noto-arabic antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}