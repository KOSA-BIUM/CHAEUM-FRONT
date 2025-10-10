import axios from 'axios'

// Base URL from Vite env (e.g., http://localhost:3000)
const baseURL = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({
  baseURL,
  withCredentials: true, // if you use cookies/sessions, keep true; else set false
  timeout: 15000,
})

// Token storage helpers (adjust to your auth strategy)
export const tokenKey = 'access_token'
export const getToken = () => localStorage.getItem(tokenKey)
export const setToken = token => localStorage.setItem(tokenKey, token)
export const clearToken = () => localStorage.removeItem(tokenKey)

// Request interceptor: attach Authorization header when token exists
api.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: basic error normalization and 401 handling
api.interceptors.response.use(
  res => res,
  error => {
    const status = error?.response?.status
    if (status === 401) {
      // Unauthorized: optionally clear token and redirect to /signin
      // clearToken()
      // location.href = '/signin'
    }
    // Normalize error shape
    return Promise.reject({
      message: error?.response?.data?.message || error.message || 'Request failed',
      status,
      data: error?.response?.data,
    })
  },
)

export default api
