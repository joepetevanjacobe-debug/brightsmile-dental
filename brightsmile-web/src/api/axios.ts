import axios from 'axios'
import toast from 'react-hot-toast'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor — show toast on error
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Something went wrong. Please try again.'

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_user')
      delete api.defaults.headers.common['Authorization']
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    } else if (error.response?.status !== 400) {
      // Don't toast validation errors — forms handle those inline
      toast.error(msg)
    }
    return Promise.reject(error)
  },
)
