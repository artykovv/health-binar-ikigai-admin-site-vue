<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Аналитика кассы</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Отчет по доходам и расходам за период</p>
      </div>
      
      <!-- Date Filters -->
      <div class="flex items-center gap-2 bg-white dark:bg-[#3f3f47] p-2 rounded-xl shadow-sm border dark:border-gray-700">
        <input 
          v-model="filters.date_from" 
          type="date" 
          @change="fetchAnalysis"
          class="bg-transparent border-0 text-sm dark:text-white focus:ring-0"
        >
        <span class="text-gray-400">—</span>
        <input 
          v-model="filters.date_to" 
          type="date" 
          @change="fetchAnalysis"
          class="bg-transparent border-0 text-sm dark:text-white focus:ring-0"
        >
        <button @click="fetchAnalysis" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Balance -->
      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <p class="text-3xl font-bold mt-2">${{ formatPrice(analysis.balance) }}</p>
        <p class="text-blue-100 text-sm opacity-80 mt-1">{{ formatPrice(analysis.balance * CURRENCY_RATE) }} сом</p>
        <div class="mt-4 flex items-center gap-2 text-xs text-blue-100">
          <span class="px-2 py-0.5 bg-white/20 rounded-full">{{ analysis.transaction_count }} опер.</span>
          <span>за период</span>
        </div>
      </div>

      <!-- Income -->
      <div class="bg-white dark:bg-[#3f3f47] rounded-2xl p-6 border dark:border-gray-700 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Всего доходов</p>
          <div class="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ formatPrice(analysis.total_income) }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatPrice(analysis.total_income * CURRENCY_RATE) }} сом</p>
        <div class="mt-2 text-xs text-green-500 font-medium">Положительная динамика</div>
      </div>

      <!-- Expense -->
      <div class="bg-white dark:bg-[#3f3f47] rounded-2xl p-6 border dark:border-gray-700 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Всего расходов</p>
          <div class="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path>
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ formatPrice(analysis.total_expense) }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatPrice(analysis.total_expense * CURRENCY_RATE) }} сом</p>
        <div class="mt-2 text-xs text-red-500 font-medium">Контролируйте траты</div>
      </div>

      <!-- Count -->
      <div class="bg-white dark:bg-[#3f3f47] rounded-2xl p-6 border dark:border-gray-700 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">Транзакции</p>
          <div class="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ analysis.transaction_count }}</p>
        <div class="mt-2 text-xs text-purple-500 font-medium">Операций проведено</div>
      </div>
    </div>

    <!-- Breakdown Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- By Categories -->
      <div class="bg-white dark:bg-[#3f3f47] rounded-2xl p-6 border dark:border-gray-700 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Распределение по категориям</h3>
        <div v-if="loading" class="space-y-4 animate-pulse">
           <div v-for="i in 3" :key="i" class="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        </div>
        <div v-else-if="analysis.by_categories?.length" class="space-y-6">
          <div v-for="cat in analysis.by_categories" :key="cat.id">
            <div class="flex justify-between text-sm mb-2">
              <span class="font-medium dark:text-white">{{ cat.name }}</span>
              <span class="text-gray-500">${{ formatPrice(cat.total_amount) }} / {{ formatPrice(cat.total_amount * CURRENCY_RATE) }} сом ({{ cat.percentage }}%)</span>
            </div>
            <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                :style="{ width: cat.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-400">Нет данных за этот период</div>
      </div>

      <!-- By Payment Methods -->
      <div class="bg-white dark:bg-[#3f3f47] rounded-2xl p-6 border dark:border-gray-700 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Методы оплаты</h3>
        <div v-if="loading" class="space-y-4 animate-pulse">
           <div v-for="i in 2" :key="i" class="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        </div>
        <div v-else-if="analysis.by_payment_methods?.length" class="space-y-6">
          <div v-for="pm in analysis.by_payment_methods" :key="pm.id">
            <div class="flex justify-between text-sm mb-2">
              <span class="font-medium dark:text-white">{{ pm.name }}</span>
              <span class="text-gray-500">${{ formatPrice(pm.total_amount) }} / {{ formatPrice(pm.total_amount * CURRENCY_RATE) }} сом ({{ pm.percentage }}%)</span>
            </div>
            <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div 
                class="bg-indigo-500 h-2 rounded-full transition-all duration-1000" 
                :style="{ width: pm.percentage + '%' }"
              ></div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-400">Нет данных за этот период</div>
      </div>

      <!-- By Tags -->
      <div class="bg-white dark:bg-[#3f3f47] rounded-2xl p-6 border dark:border-gray-700 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Анализ по тегам</h3>
        <div v-if="analysis.by_tags?.length" class="space-y-4">
          <div 
            v-for="tag in analysis.by_tags" 
            :key="tag.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-blue-500"></div>
              <span class="text-sm font-medium dark:text-white">{{ tag.name }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm font-bold dark:text-white">${{ formatPrice(tag.total_amount) }}</div>
              <div class="text-[10px] text-gray-500">{{ formatPrice(tag.total_amount * CURRENCY_RATE) }} сом • {{ tag.percentage }}%</div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-400">Теги не использовались</div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-[#3f3f47] rounded-2xl p-6 border dark:border-gray-700 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Быстрые действия</h3>
        <div class="grid grid-cols-2 gap-4">
          <router-link to="/kassa/pos" class="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group">
            <svg class="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span class="text-xs font-bold uppercase tracking-tighter">Терминал</span>
          </router-link>
          
          <router-link to="/kassa/income" class="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all group">
            <svg class="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path>
            </svg>
            <span class="text-xs font-bold uppercase tracking-tighter">Доход</span>
          </router-link>

          <router-link to="/kassa/expenses" class="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all group">
            <svg class="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"></path>
            </svg>
            <span class="text-xs font-bold uppercase tracking-tighter">Расход</span>
          </router-link>

          <router-link to="/kassa/settings" class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group">
            <svg class="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
            <span class="text-xs font-bold uppercase tracking-tighter">Настройки</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { kassa_api } from '@/api'

const loading = ref(false)
const analysis = ref({
  total_income: "0.00",
  total_expense: "0.00",
  balance: "0.00",
  transaction_count: 0,
  by_categories: [],
  by_payment_methods: [],
  by_tags: [],
  by_types: []
})

const filters = ref({
  date_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  date_to: new Date().toISOString().split('T')[0]
})

const fetchAnalysis = async () => {
  loading.value = true
  try {
    const response = await kassa_api.get('/reports/analysis/', {
      params: {
        date_from: filters.value.date_from,
        date_to: filters.value.date_to
      }
    })
    analysis.value = response.data
  } catch (error) {
    console.error('Error fetching analysis:', error)
  } finally {
    loading.value = false
  }
}

const CURRENCY_RATE = 88

const formatPrice = (value) => {
  if (value === undefined || value === null) return '0'
  const num = Number(value)
  if (num % 1 === 0) return num.toString()
  return num.toFixed(2)
}

onMounted(fetchAnalysis)
</script>
