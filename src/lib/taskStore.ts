"use client"

import { create } from "zustand"

export type TaskStatus = "todo" | "in-progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: string
  owner_id: string          // ← إضافة مهمة
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date | null
  created_at: Date
  updated_at: Date
}

interface TaskStore {
  tasks: Task[]
  currentUserId: string | null
  setCurrentUserId: (id: string | null) => void
  addTask: (task: Omit<Task, "id" | "created_at" | "updated_at">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  getUserTasksByStatus: (status: TaskStatus) => Task[]
  getUserTasks: () => Task[]
  setTasks: (newTasks: Task[]) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  currentUserId: null,

  setCurrentUserId: (id) => set({ currentUserId: id }),
  setTasks: (newTasks: any) => set({ tasks: newTasks }), // ← أضف ده

  addTask: (task) => set((state) => {
    if (!state.currentUserId) return state
    return {
      tasks: [
        ...state.tasks,
        {
          ...task,
          owner_id: state.currentUserId,  // ← غيّر userId لـowner_id
          id: crypto.randomUUID(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
    }
  }),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updated_at: new Date() } : t
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  getUserTasksByStatus: (status) =>
    get().tasks.filter(
      (t) => t.status === status && Number(t.owner_id) === Number(get().currentUserId)
    ),

  getUserTasks: () =>
    get().tasks.filter((t) => Number(t.owner_id) === Number(get().currentUserId)),
}))