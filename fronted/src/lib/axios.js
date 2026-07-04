import axios from 'axios'

const getBaseURL = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5000/api'
  }

  const envUrl = import.meta.env.VITE_API_URL
  if (!envUrl) return '/api'

  // Ensure the URL ends with a single `/api` (avoid double slashes)
  return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/g, '')}/api`
}

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
})