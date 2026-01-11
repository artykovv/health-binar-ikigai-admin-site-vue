import axios from 'axios'


const BINAR_API_URL = import.meta.env.VITE_BINAR_API_URL || 'https://health-binar-ikigai-api-production.up.railway.app/api'
const STORE_API_URL = import.meta.env.VITE_STORE_API_URL || 'https://catalog-api-production-a903.up.railway.app/api'
const STORAGE_API_URL = import.meta.env.VITE_STORAGE_API_URL || 'https://health-storage-production.up.railway.app'
const KASSA_API_URL = import.meta.env.VITE_KASSA_API_URL || 'https://health-kassa-production.up.railway.app/api'
const HEALTH_STORE = import.meta.env.VITE_HEALTH_STORE || 'https://health-health-store-production.up.railway.app/api'

// const BINAR_API_URL = import.meta.env.VITE_BINAR_API_URL || 'http://127.0.0.1:8000/api'
// const STORE_API_URL = import.meta.env.VITE_STORE_API_URL || 'http://127.0.0.1:8001/api'
// const STORAGE_API_URL = import.meta.env.VITE_STORAGE_API_URL || 'http://127.0.0.1:8002'
// const KASSA_API_URL = import.meta.env.VITE_KASSA_API_URL || 'http://127.0.0.1:8003/api'
// const HEALTH_STORE = import.meta.env.VITE_HEALTH_STORE || 'http://127.0.0.1:8004/api'

// binar_api for all pages except Products.vue
export const binar_api = axios.create({
  baseURL: BINAR_API_URL
})

// store_api for Products.vue
export const store_api = axios.create({
  baseURL: STORE_API_URL
})

export const storage_api = axios.create({
  baseURL: STORAGE_API_URL
})

export const kassa_api = axios.create({
  baseURL: KASSA_API_URL
})

export const health_store = axios.create({
  baseURL: HEALTH_STORE
})

// For backwards compatibility
export const api = binar_api


