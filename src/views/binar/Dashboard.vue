<template>
  <div class="container mx-auto px-4 py-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold dark:text-white">Бинарная система</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Управление бинарной структурой и участниками</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Всего участников</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ counts.total_participants || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Зарегистрированы</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ counts.registered || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Филиалы</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ counts.branches_count || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Общий оборот</p>
              <p class="text-2xl font-semibold text-gray-500 dark:text-gray-300">—</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Быстрые действия</h3>
          <div class="space-y-3">
            <router-link to="/binar/participants" class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#4a4a52] transition-colors">
              <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Управление участниками</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Просмотр и редактирование участников</p>
              </div>
            </router-link>

            <router-link to="/binar/structure" class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#4a4a52] transition-colors">
              <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Структура</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Просмотр бинарной структуры</p>
              </div>
            </router-link>

            <router-link to="/binar/registration" class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#4a4a52] transition-colors">
              <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg mr-3">
                <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Регистрации</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Управление регистрациями</p>
              </div>
            </router-link>
          </div>
        </div>

        <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Последние бонусы</h3>
          <div class="flex-1 overflow-y-auto">
            <div v-if="bonusLogs.loading" class="flex items-center justify-center h-40">
              <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
            </div>
            <div v-else-if="bonusLogs.logs.length === 0" class="flex items-center justify-center h-40 text-gray-400 dark:text-gray-500">
              <span class="text-sm">Нет данных</span>
            </div>
            <div v-else class="space-y-3 max-h-64 overflow-y-auto">
              <div v-for="log in bonusLogs.logs" :key="log.id" class="border-l-4 border-blue-500 pl-3 py-2">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ log.participant }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-300 mt-1">{{ log.description }}</div>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                    {{ formatLogTime(log.timestamp) }}
                  </div>
                </div>
                <div class="mt-1">
                  <span :class="getBonusTypeClass(log.bonus_type)" class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                    {{ getBonusTypeText(log.bonus_type) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Registrations by day (chart) -->
      <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Активность за последние 7 дней</h3>
        <div class="h-64 relative">
          <div v-if="registrations.loading" class="flex items-center justify-center h-full">
            <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
          </div>
          <div v-else-if="registrations.daily_registrations.length === 0" class="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <span class="text-sm">Нет данных</span>
          </div>
          <canvas v-else ref="chartCanvas" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { api } from '@/api'

const counts = ref({
  total_participants: 0,
  registered: 0,
  unregistered: 0,
  branches_count: 0,
  participants_by_branch: []
})

const loading = ref(false)
const errorMessage = ref('')

const fetchCounts = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await api.get('site/counts')
    counts.value = response.data
  } catch (e) {
    console.error('Ошибка загрузки статистики:', e)
    errorMessage.value = 'Не удалось загрузить статистику'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCounts()
  fetchRegistrations()
  fetchBonusLogs()
})

// Registrations chart data (same as Home.vue)
const registrations = ref({
  daily_registrations: [],
  cumulative_growth: [],
  loading: false
})
const chartCanvas = ref(null)
let chartInstance = null

const fetchRegistrations = async () => {
  registrations.value.loading = true
  try {
    const response = await api.get('site/registrations')
    registrations.value = response.data
    await nextTick()
    createChart()
  } catch (error) {
    console.error('Ошибка загрузки регистраций:', error)
    registrations.value.daily_registrations = []
    registrations.value.cumulative_growth = []
  } finally {
    registrations.value.loading = false
  }
}

const createChart = () => {
  if (!chartCanvas.value || registrations.value.daily_registrations.length === 0) return
  if (chartInstance) chartInstance.destroy()
  import('chart.js/auto').then(({ Chart }) => {
    const ctx = chartCanvas.value.getContext('2d')
    const labels = registrations.value.daily_registrations.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    })
    const dailyData = registrations.value.daily_registrations.map(item => item.count)
    const cumulativeData = registrations.value.cumulative_growth.map(item => item.total)
    const isDark = document.documentElement.classList.contains('dark')
    const textColor = isDark ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'
    const dailyColor = 'rgb(59, 130, 246)'
    const cumulativeColor = 'rgb(16, 185, 129)'
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Ежедневные регистрации', data: dailyData, borderColor: dailyColor, backgroundColor: 'rgba(59,130,246,0.1)', borderWidth: 2, fill: false, tension: 0.4, pointBackgroundColor: dailyColor, pointBorderColor: dailyColor, pointRadius: 3, pointHoverRadius: 5, yAxisID: 'y' },
          { label: 'Общий рост', data: cumulativeData, borderColor: cumulativeColor, backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: 2, fill: false, tension: 0.4, pointBackgroundColor: cumulativeColor, pointBorderColor: cumulativeColor, pointRadius: 3, pointHoverRadius: 5, yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top', labels: { color: textColor, usePointStyle: true, padding: 20 } } },
        scales: {
          x: { ticks: { color: textColor, maxTicksLimit: 8 }, grid: { color: isDark ? 'rgba(75,85,99,0.3)' : 'rgba(0,0,0,0.1)' } },
          y: { type: 'linear', display: true, position: 'left', beginAtZero: true, ticks: { color: textColor }, grid: { color: isDark ? 'rgba(75,85,99,0.3)' : 'rgba(0,0,0,0.1)' }, title: { display: true, text: 'Ежедневные регистрации', color: textColor } },
          y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, ticks: { color: textColor }, grid: { drawOnChartArea: false }, title: { display: true, text: 'Общий рост', color: textColor } }
        },
        interaction: { intersect: false, mode: 'index' }
      }
    })
  }).catch(() => {})
}

// Last bonuses list (same helpers as Home.vue)
const bonusLogs = ref({
  count: 0,
  logs: [],
  loading: false
})

const fetchBonusLogs = async () => {
  bonusLogs.value.loading = true
  try {
    const response = await api.get('site/bonus_logs/last')
    bonusLogs.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки логов бонусов:', error)
    bonusLogs.value.logs = []
  } finally {
    bonusLogs.value.loading = false
  }
}

const formatLogTime = (timestamp) => {
  try {
    const date = new Date(timestamp)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return timestamp
  }
}

const getBonusTypeText = (type) => {
  const types = {
    sponsor: 'Спонсорский',
    structure: 'Структурный',
    stage_closed: 'Закрытие этапа',
    gift: 'Подарок',
    health_day: 'Health Day',
    multi: 'Мультибонус'
  }
  return types[type] || type
}

const getBonusTypeClass = (type) => {
  const classes = {
    sponsor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    structure: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    stage_closed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    gift: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    health_day: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    multi: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
  }
  return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
}
</script>
