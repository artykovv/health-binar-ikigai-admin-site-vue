// Currency utilities for USD and SOM conversion

const EXCHANGE_RATE = 88 // 1 USD = 88 SOM

/**
 * Format USD amount - show as integer if no cents, otherwise with 2 decimals
 * @param {number} amount - USD amount
 * @returns {string} Formatted USD amount
 */
export const formatUSD = (amount) => {
  if (amount === null || amount === undefined || amount === '') return '0'
  const num = Number(amount)
  if (isNaN(num)) return '0'
  return num % 1 === 0 ? num.toString() : num.toFixed(2)
}

/**
 * Convert USD to SOM (always returns integer, no tyiyn)
 * @param {number} usdAmount - Amount in USD
 * @returns {number} Amount in SOM (integer)
 */
export const toSOM = (usdAmount) => {
  if (usdAmount === null || usdAmount === undefined || usdAmount === '') return 0
  const num = Number(usdAmount)
  if (isNaN(num)) return 0
  // Always floor to discard tyiyn - no one uses them anymore
  return Math.floor(num * EXCHANGE_RATE)
}

/**
 * Convert SOM to USD
 * @param {number} somAmount - Amount in SOM
 * @returns {number} Amount in USD (with 2 decimal places)
 */
export const toUSD = (somAmount) => {
  if (somAmount === null || somAmount === undefined || somAmount === '') return 0
  const num = Number(somAmount)
  if (isNaN(num)) return 0
  return parseFloat((num / EXCHANGE_RATE).toFixed(2))
}

/**
 * Format SOM amount with locale string (thousands separator)
 * @param {number} amount - SOM amount
 * @returns {string} Formatted SOM amount
 */
export const formatSOM = (amount) => {
  if (amount === null || amount === undefined) return '0'
  return Math.floor(amount).toLocaleString()
}
