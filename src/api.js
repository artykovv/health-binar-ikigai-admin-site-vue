import axios from 'axios'

const rawBase = import.meta.env.VITE_API_BASE || ''
const trimmedBase = typeof rawBase === 'string' ? rawBase.replace(/\/+$/, '') : ''

export const api = axios.create({
  baseURL: `${trimmedBase}/api`
})


