const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  register: async (data: { email: string; password: string; name: string }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "خطأ في التسجيل");
    }
    return res.json();
  },

  login: async (data: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email: data.email, password: data.password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "خطأ في تسجيل الدخول");
    }
    const json = await res.json();
    localStorage.setItem("token", json.access_token);
    return json;
  },

  getTasks: async () => {
    const res = await fetch(`${API_BASE}/tasks`, { headers: getHeaders() });
    if (!res.ok) throw new Error("خطأ في جلب المهام");
    return res.json();
  },

  createTask: async (task: any) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("خطأ في إضافة المهمة");
    return res.json();
  },

  updateTask: async (id: number, task: any) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("خطأ في التعديل");
    return res.json();
  },

  deleteTask: async (id: number) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("خطأ في الحذف");
    return res.json();
  },
};