"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("كلمة المرور غير متطابقة")
      return
    }

    if (password.length < 6) {
      toast.error("كلمة المرور لازم تكون 6 أحرف على الأقل")
      return
    }

    setLoading(true)

    try {
      await api.register({ email, password, name })
      toast.success("تم إنشاء الحساب بنجاح، جاري تسجيل الدخول...")

      // تسجيل دخول تلقائي بعد التسجيل
      await api.login({ email, password })
      toast.success("تم تسجيل الدخول تلقائيًا")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl border shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">إنشاء حساب جديد في TaskFlow</h1>
          <p className="mt-2 text-muted-foreground">ابدأ تنظيم مهامك الآن</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              id="name"
              placeholder="عبد الرحمن خضر"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="khadr@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="******"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full py-6" disabled={loading}>
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  )
}