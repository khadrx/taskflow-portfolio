"use client"

import { useTaskStore } from "@/lib/taskStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { CalendarIcon, Plus, Trash2, Edit2, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

const COLORS = ["#3b82f6", "#f59e0b", "#10b981"]

export default function DashboardPage() {
  const { tasks, addTask, updateTask, deleteTask, getUserTasksByStatus, getUserTasks } = useTaskStore()

  const { data: session } = useSession()
  const setCurrentUserId = useTaskStore(state => state.setCurrentUserId)

  useEffect(() => {
    if (session?.user?.id) {
      setCurrentUserId(session.user.id)
    }
  }, [session, setCurrentUserId])

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as const,
    priority: "medium" as const,
    dueDate: undefined as Date | undefined,
  })

  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return toast.error("العنوان مطلوب")

    if (editingTask) {
      updateTask(editingTask.id, newTask)
      toast.success("تم تعديل المهمة بنجاح")
      setEditingTask(null)
    } else {
      addTask(newTask)
      toast.success("تم إضافة المهمة")
    }

    setNewTask({ title: "", description: "", status: "todo", priority: "medium", dueDate: undefined })
  }

  const startEdit = (task: Task) => {
    setNewTask({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || undefined,
    })
    setEditingTask(task)
  }

  const getPriorityIcon = (priority: TaskPriority) => {
    if (priority === "high") return <AlertCircle className="h-4 w-4 text-red-500" />
    if (priority === "medium") return <Clock className="h-4 w-4 text-yellow-500" />
    return <CheckCircle2 className="h-4 w-4 text-green-500" />
  }

  const priorityColor = (priority: TaskPriority) => {
    if (priority === "high") return "bg-red-500 text-white"
    if (priority === "medium") return "bg-yellow-500 text-black"
    return "bg-green-500 text-white"
  }

  const statuses = [
    { key: "todo", label: "قيد الانتظار", icon: <Clock className="h-5 w-5 text-blue-500" /> },
    { key: "in-progress", label: "جاري العمل", icon: <Edit2 className="h-5 w-5 text-orange-500" /> },
    { key: "done", label: "منتهية", icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> },
  ] as const

  // إحصائيات (بعد الربط باليوزر)
  const userTasks = getUserTasks()
  const todoCount = getUserTasksByStatus("todo").length
  const inProgressCount = getUserTasksByStatus("in-progress").length
  const doneCount = getUserTasksByStatus("done").length
  const total = userTasks.length
  const completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0

  const pieData = [
    { name: "قيد الانتظار", value: todoCount, color: "#3b82f6" },
    { name: "جاري العمل", value: inProgressCount, color: "#f59e0b" },
    { name: "منتهية", value: doneCount, color: "#10b981" },
  ]

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl" dir="rtl">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold">TaskFlow – لوحة التحكم</h1>
        <div className="text-sm text-muted-foreground">
          إجمالي مهامك: <span className="font-medium">{total}</span>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">قيد الانتظار</p>
            <p className="text-3xl font-bold mt-2 text-blue-600">{todoCount}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">جاري العمل</p>
            <p className="text-3xl font-bold mt-2 text-yellow-600">{inProgressCount}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">منتهية</p>
            <p className="text-3xl font-bold mt-2 text-green-600">{doneCount}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">نسبة الإنجاز</p>
            <p className="text-3xl font-bold mt-2">{completionRate}%</p>
            <Progress value={completionRate} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* رسم بياني دائري */}
      {total > 0 && (
        <Card className="mb-12 border-none shadow-lg">
          <CardHeader>
            <CardTitle>توزيع مهامك</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* نموذج إضافة / تعديل */}
      <Card className="mb-16 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {editingTask ? <Edit2 className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            {editingTask ? "تعديل المهمة" : "إضافة مهمة جديدة"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">العنوان *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="اكتب عنوان المهمة هنا..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>الأولوية</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={v => setNewTask({ ...newTask, priority: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">منخفضة</SelectItem>
                    <SelectItem value="medium">متوسطة</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>الحالة</Label>
                <Select
                  value={newTask.status}
                  onValueChange={v => setNewTask({ ...newTask, status: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">قيد الانتظار</SelectItem>
                    <SelectItem value="in-progress">جاري العمل</SelectItem>
                    <SelectItem value="done">منتهية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>موعد الاستحقاق</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newTask.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTask.dueDate ? format(newTask.dueDate, "PPP", { locale: ar }) : "اختر تاريخ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTask.dueDate}
                      onSelect={date => setNewTask({ ...newTask, dueDate: date })}
                      initialFocus
                      locale={ar}
                      dir="rtl"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف (اختياري)</Label>
              <Input
                id="description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="تفاصيل إضافية عن المهمة..."
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              {editingTask ? "حفظ التعديلات" : "إضافة المهمة"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* الأعمدة الثلاثة */}
      <div className="grid md:grid-cols-3 gap-8">
        {statuses.map(({ key, label, icon }) => (
          <Card key={key} className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              {icon}
              <CardTitle>{label}</CardTitle>
              <Badge variant="secondary" className="ml-auto">
                {getUserTasksByStatus(key as any).length}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 min-h-[400px]">
              {getUserTasksByStatus(key as any).length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  لا توجد مهام هنا حاليًا
                </div>
              ) : (
                getUserTasksByStatus(key as any).map(task => (
                  <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium leading-tight">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        {task.dueDate && (
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(task.dueDate, "PPP", { locale: ar })}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Badge className={cn("px-2 py-0.5", priorityColor(task.priority))}>
                          {getPriorityIcon(task.priority)}
                          <span className="ml-1 capitalize">
                            {task.priority === "high" ? "عالية" : task.priority === "medium" ? "متوسطة" : "منخفضة"}
                          </span>
                        </Badge>

                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(task)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteTask(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}