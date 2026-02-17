import type { Metadata } from "next"
import { Noto_Sans_Arabic } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers"
import { ThemeProvider } from "@/components/ThemeProvider"

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-arabic",
  display: "swap",
})

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "نظام إدارة مهام ومشاريع احترافي",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${notoArabic.variable}`}>
      <body className="font-noto-arabic antialiased">
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}