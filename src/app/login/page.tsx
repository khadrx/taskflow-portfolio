"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return toast.error("البريد الإلكتروني مطلوب")
    if (!password.trim()) return toast.error("كلمة المرور مطلوبة")

    try {
      await login(email, password)
      // الـredirect والـtoast بيحصل داخل login function
    } catch (error) {
      // toast بيطلع داخل login
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl border shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">تسجيل الدخول إلى TaskFlow</h1>
          <p className="mt-2 text-muted-foreground">ادخل بياناتك للوصول للوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="test@khadr.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full py-6" disabled={isLoading}>
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-primary hover:underline">
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  )
}