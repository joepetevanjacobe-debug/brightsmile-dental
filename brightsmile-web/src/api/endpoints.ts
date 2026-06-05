import { api } from './axios'

// ── Auth ──────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post('/api/auth/register', data),
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  logout: () => api.post('/api/auth/logout'),
  verify: (token: string) => api.get(`/api/auth/verify?token=${token}`),
}

// ── Services ──────────────────────────────────────────────────────────
export const servicesApi = {
  list: () => api.get('/api/services'),
  getOne: (id: number) => api.get(`/api/services/${id}`),
}

// ── Slots ─────────────────────────────────────────────────────────────
export const slotsApi = {
  get: (date: string, doctorId: number) =>
    api.get(`/api/slots?date=${date}&doctorId=${doctorId}`),
}

// ── Appointments (public booking) ─────────────────────────────────────
export const appointmentsApi = {
  book: (data: {
    serviceId: number; doctorId: number; startDatetime: string;
    guestName?: string; guestEmail?: string; guestPhone?: string;
    guestAge?: number | null; guestAddress?: string; notes?: string;
  }) => api.post('/api/appointments', data),
}

// ── Contact ───────────────────────────────────────────────────────────
export const contactApi = {
  submit: (data: { name: string; email: string; phone?: string; message: string }) =>
    api.post('/api/contact', data),
}

// ── Patient Portal ────────────────────────────────────────────────────
export const portalApi = {
  myAppointments: () => api.get('/api/portal/appointments'),
  cancel: (id: number) => api.put(`/api/portal/appointments/${id}/cancel`),
}

// ── Admin ─────────────────────────────────────────────────────────────
export const adminApi = {
  dashboard: {
    stats: () => api.get('/api/admin/dashboard/stats'),
  },
  appointments: {
    list: (params?: Record<string, unknown>) => api.get('/api/admin/appointments', { params }),
    getOne: (id: number) => api.get(`/api/admin/appointments/${id}`),
    create: (data: unknown) => api.post('/api/admin/appointments', data),
    updateStatus: (id: number, status: string) =>
      api.put(`/api/admin/appointments/${id}/status?status=${status}`),
    delete: (id: number) => api.delete(`/api/admin/appointments/${id}`),
  },
  patients: {
    list: (params?: Record<string, unknown>) => api.get('/api/admin/patients', { params }),
    getOne: (id: number) => api.get(`/api/admin/patients/${id}`),
    delete: (id: number) => api.delete(`/api/admin/patients/${id}`),
  },
  services: {
    list: () => api.get('/api/admin/services'),
    create: (data: unknown) => api.post('/api/admin/services', data),
    update: (id: number, data: unknown) => api.put(`/api/admin/services/${id}`, data),
    delete: (id: number) => api.delete(`/api/admin/services/${id}`),
  },
  team: {
    list: () => api.get('/api/admin/team'),
    create: (data: unknown) => api.post('/api/admin/team', data),
    update: (id: number, data: unknown) => api.put(`/api/admin/team/${id}`, data),
    delete: (id: number) => api.delete(`/api/admin/team/${id}`),
  },
  schedule: {
    get: (doctorId: number) => api.get(`/api/admin/schedule/${doctorId}`),
    set: (doctorId: number, data: unknown) => api.put(`/api/admin/schedule/${doctorId}`, data),
    block: (data: unknown) => api.post('/api/admin/schedule/block', data),
    unblock: (id: number) => api.delete(`/api/admin/schedule/block/${id}`),
  },
}
