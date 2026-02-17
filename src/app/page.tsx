"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ArrowRight, LogIn, UserPlus, CheckCircle, BarChart3, Moon } from "lucide-react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // تحويل تلقائي لو مسجل دخول
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        جاري التحميل...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">TaskFlow</h1>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                إنشاء حساب
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            نظّم مهامك ومشاريعك بذكاء
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            TaskFlow نظام إدارة مهام بسيط وقوي، مصمم خصيصًا للأشخاص الطموحين اللي عايزين يحققوا أهدافهم بدون فوضى أو تشتت.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/register">
              <Button size="lg" className="text-lg px-10 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all">
                ابدأ مجانًا الآن
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-10 py-7 rounded-xl">
                تسجيل الدخول
              </Button>
            </Link>
          </div>
        </div>

        {/* مميزات سريعة */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-10 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold">مهام منظمة</h3>
              <p className="text-muted-foreground leading-relaxed">
                تصنيف ذكي حسب الحالة، الأولوية، والموعد النهائي – كل حاجة في مكانها.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-10 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <BarChart3 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold">لوحة تحكم واضحة</h3>
              <p className="text-muted-foreground leading-relaxed">
                شوف تقدمك في ثواني مع إحصائيات مرئية واضحة وسهلة القراءة.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-10 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Moon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold">Dark Mode + RTL كامل</h3>
              <p className="text-muted-foreground leading-relaxed">
                تصميم مريح للعين، دعم عربي 100% من اليمين لليسار بدون أي مشاكل.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-32 py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} عبد الرحمن خضر – TaskFlow Portfolio Project
          <br />
          Built with Next.js 15 • Tailwind • shadcn/ui • Zustand • Lucide Icons
        </div>
      </footer>
    </div>
  )
}