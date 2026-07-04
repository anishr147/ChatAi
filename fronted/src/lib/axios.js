import axios from 'axios'

const getApiBaseURL = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5000/api'
  }

  let envUrl = import.meta.env.VITE_API_URL
  if (!envUrl) return '/api'

  envUrl = envUrl.trim()
  if (!/^https?:\/\//i.test(envUrl)) {
    envUrl = `https://${envUrl}`
  }

  return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/g, '')}/api`
}

const getBackendURL = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5000'
  }

  const envUrl = import.meta.env.VITE_API_URL
  if (!envUrl) return ''

  return envUrl.replace(/\/api\/?$/, '')
}

export const BACKEND_URL = getBackendURL()

export const axiosInstance = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: true,
})