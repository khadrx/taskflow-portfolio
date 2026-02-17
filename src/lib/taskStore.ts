"use client"

import { create } from "zustand"

export type TaskStatus = "todo" | "in-progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: string
  userId: string          // ← إضافة مهمة
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date | null
  createdAt: Date
  updatedAt: Date
}

interface TaskStore {
  tasks: Task[]
  currentUserId: string | null
  setCurrentUserId: (id: string | null) => void
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  getUserTasksByStatus: (status: TaskStatus) => Task[]
  getUserTasks: () => Task[]
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  currentUserId: null,

  setCurrentUserId: (id) => set({ currentUserId: id }),

  addTask: (task) =>
    set((state) => {
      if (!state.currentUserId) return state // ما تضيفش لو مفيش يوزر
      return {
        tasks: [
          ...state.tasks,
          {
            ...task,
            userId: state.currentUserId,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      }
    }),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  getUserTasksByStatus: (status) =>
    get().tasks.filter(
      (t) => t.status === status && t.userId === get().currentUserId
    ),

  getUserTasks: () =>
    get().tasks.filter((t) => t.userId === get().currentUserId),
}))