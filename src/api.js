import axios from 'axios'

const BINAR_API_URL = import.meta.env.VITE_BINAR_API_URL || 'https://health-binar-ikigai-api-production.up.railway.app/api'
const STORE_API_URL = import.meta.env.VITE_STORE_API_URL || 'https://catalog-api-production-a903.up.railway.app/api'

// binar_api for all pages except Products.vue
export const binar_api = axios.create({
  baseURL: BINAR_API_URL
})

// store_api for Products.vue
export const store_api = axios.create({
  baseURL: STORE_API_URL
})

// For backwards compatibility
export const api = binar_api


