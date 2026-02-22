"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useTaskStore } from "@/lib/taskStore"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://taskflow-backend-production-ea5d.up.railway.app";

interface User {
  id: number
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { setCurrentUserId } = useTaskStore()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchUser(storedToken)
    }
    setIsLoading(false)
  }, [])

  const fetchUser = async (tok: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${tok}`,
        },
      })
      if (!res.ok) {
        throw new Error("فشل جلب بيانات المستخدم")
      }
      const data = await res.json()
      setUser(data)
      setCurrentUserId(data.id.toString())
    } catch (error) {
      console.error("فشل جلب بيانات اليوزر", error)
      logout()
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const data = await api.login({ email, password })
      localStorage.setItem("token", data.access_token)
      setToken(data.access_token)

      await fetchUser(data.access_token)

      toast.success("تم تسجيل الدخول بنجاح")
      router.replace("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "خطأ في تسجيل الدخول")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    toast.info("تم تسجيل الخروج")
    router.replace("/login")
  }


  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}