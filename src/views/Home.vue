<template>
  <div>
    <h1 class="mb-6 dark:text-white">Главная</h1>
    
    <!-- Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
      <!-- Large card - spans 2 columns and 2 rows -->
      <div class="md:col-span-2 md:row-span-2 bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex flex-col">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Регистрации по дням</h3>
          <div class="flex-1 relative">
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
      
      <!-- Medium card - spans 1 column and 2 rows -->
      <div class="md:row-span-2 bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex flex-col">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Филиалы</h3>
          <div class="flex-1 overflow-y-auto">
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600 dark:text-gray-300">Всего филиалов:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ counts.branches_count || 0 }}</span>
              </div>
              <div v-for="branch in counts.participants_by_branch" :key="branch.branch_id" class="flex justify-between items-center text-sm">
                <span class="text-gray-600 dark:text-gray-300">{{ branch.branch_name }}:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ branch.participants_count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Small card -->
      <div class="bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex flex-col">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Участники</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-300">Всего:</span>
              <span class="text-lg font-bold text-gray-900 dark:text-white">{{ counts.total_participants || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-300">Зарегистрированы:</span>
              <span class="text-lg font-bold text-green-600 dark:text-green-400">{{ counts.registered || 0 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 dark:text-gray-300">Не зарегистрированы:</span>
              <span class="text-lg font-bold text-orange-600 dark:text-orange-400">{{ counts.unregistered || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Wide card - spans 2 columns -->
      <div class="md:col-span-2 bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 4</span>
        </div>
      </div>
      
      <!-- Small card -->
      <div class="bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 5</span>
        </div>
      </div>
      
      <!-- Small card -->
      <div class="bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 6</span>
        </div>
      </div>
      
      <!-- Tall card - spans 2 rows -->
      <div class="md:row-span-2 bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 7</span>
        </div>
      </div>
      
      <!-- Small card -->
      <div class="bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 8</span>
        </div>
      </div>
      
      <!-- Wide and tall card - spans 2 columns and 2 rows -->
      <div class="md:col-span-2 md:row-span-2 bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex flex-col">
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Последние бонусы</h3>
          <div class="flex-1 overflow-y-auto">
            <div v-if="bonusLogs.loading" class="flex items-center justify-center h-full">
              <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
            </div>
            <div v-else-if="bonusLogs.logs.length === 0" class="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
              <span class="text-sm">Нет данных</span>
            </div>
            <div v-else class="space-y-3">
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

const bonusLogs = ref({
  count: 0,
  logs: [],
  loading: false
})

const registrations = ref({
  daily_registrations: [],
  cumulative_growth: [],
  loading: false
})

const chartCanvas = ref(null)
let chartInstance = null

const loading = ref(false)

const fetchCounts = async () => {
  loading.value = true
  try {
    const response = await api.get('site/counts')
    counts.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  } finally {
    loading.value = false
  }
}

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
    'sponsor': 'Спонсорский',
    'structure': 'Структурный',
    'stage_closed': 'Закрытие этапа',
    'gift': 'Подарок',
    'health_day': 'Health Day',
    'multi': 'Мультибонус'
  }
  return types[type] || type
}

const getBonusTypeClass = (type) => {
  const classes = {
    'sponsor': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'structure': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'stage_closed': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'gift': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'health_day': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'multi': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
  }
  return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
}

const createChart = () => {
  if (!chartCanvas.value || registrations.value.daily_registrations.length === 0) return
  
  // Уничтожаем предыдущий график если есть
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  // Динамически импортируем Chart.js
  import('chart.js/auto').then(({ Chart }) => {
    const ctx = chartCanvas.value.getContext('2d')
    
    // Подготавливаем данные
    const labels = registrations.value.daily_registrations.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    })
    
    const dailyData = registrations.value.daily_registrations.map(item => item.count)
    const cumulativeData = registrations.value.cumulative_growth.map(item => item.total)
    
    // Определяем цвета для темной/светлой темы
    const isDark = document.documentElement.classList.contains('dark')
    const textColor = isDark ? 'rgb(209, 213, 219)' : 'rgb(75, 85, 99)'
    
    // Цвета для двух линий
    const dailyColor = isDark ? 'rgb(59, 130, 246)' : 'rgb(59, 130, 246)' // Синий для ежедневных
    const cumulativeColor = isDark ? 'rgb(16, 185, 129)' : 'rgb(16, 185, 129)' // Зеленый для кумулятивного
    
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ежедневные регистрации',
            data: dailyData,
            borderColor: dailyColor,
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: dailyColor,
            pointBorderColor: dailyColor,
            pointRadius: 3,
            pointHoverRadius: 5,
            yAxisID: 'y'
          },
          {
            label: 'Общий рост',
            data: cumulativeData,
            borderColor: cumulativeColor,
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: cumulativeColor,
            pointBorderColor: cumulativeColor,
            pointRadius: 3,
            pointHoverRadius: 5,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: textColor,
              usePointStyle: true,
              padding: 20
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColor,
              maxTicksLimit: 8
            },
            grid: {
              color: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            ticks: {
              color: textColor
            },
            grid: {
              color: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.1)'
            },
            title: {
              display: true,
              text: 'Ежедневные регистрации',
              color: textColor
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            ticks: {
              color: textColor
            },
            grid: {
              drawOnChartArea: false,
            },
            title: {
              display: true,
              text: 'Общий рост',
              color: textColor
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    })
  }).catch(error => {
    console.error('Ошибка загрузки Chart.js:', error)
  })
}

onMounted(() => {
  fetchCounts()
  fetchBonusLogs()
  fetchRegistrations()
})
</script>

<style scoped>
/* Плавные переходы для карточек */
</style>
