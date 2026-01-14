<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Дашборд Магазина</h1>
        <p class="text-gray-500 dark:text-gray-400">Обзор заказов и продаж магазина здоровья</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <!-- Revenue -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Выручка</span>
          </div>
          <div v-if="loadingStats">
            <div class="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
          </div>
          <div v-else>
            <p class="text-3xl font-black text-gray-900 dark:text-white">{{ formatAmount(stats?.monthly_revenue || 0) }} сом</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">За текущий месяц</p>
          </div>
        </div>

        <!-- Orders -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Заказы</span>
          </div>
          <div v-if="loadingStats">
            <div class="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
          </div>
          <div v-else>
            <p class="text-3xl font-black text-gray-900 dark:text-white">{{ stats?.monthly_orders || 0 }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">За текущий месяц</p>
          </div>
        </div>

        <!-- Employees -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Сотрудники</span>
          </div>
          <div v-if="loadingStats">
            <div class="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
          </div>
          <div v-else>
            <p class="text-3xl font-black text-gray-900 dark:text-white">{{ stats?.total_employees || 0 }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Всего сотрудников</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <!-- Quick Actions -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Действия</h3>
            <div class="space-y-3">
              <router-link to="/health-store/orders" class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group">
                <div class="p-2 bg-white dark:bg-gray-700 rounded-xl group-hover:bg-opacity-20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span class="font-bold">Все заказы</span>
              </router-link>
              <router-link to="/health-store/products" class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group">
                <div class="p-2 bg-white dark:bg-gray-700 rounded-xl group-hover:bg-opacity-20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <span class="font-bold">Каталог товаров</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Orders Placeholder -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 h-full">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Последние заказы</h3>
            </div>
            <div class="text-center py-20 text-gray-400">
              Данные загружаются...
            </div>
          </div>
        </div>
      </div>

      <!-- Employee Performance -->
      <div class="bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Производительность сотрудников</h3>
        
        <div v-if="loadingEmployeeStats" class="text-center py-8">
          <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        
        <div v-else-if="employeeStats?.length" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сотрудник</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Количество заказов</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Общая сумма</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-for="emp in employeeStats" :key="emp.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ emp.lastname }} {{ emp.name }} {{ emp.patronymic }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-bold">
                    {{ emp.order_count }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {{ formatAmount(emp.total_amount) }} сом
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-else class="text-center py-8 text-gray-400">
          Нет данных
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { health_store } from '@/api'

const stats = ref(null)
const loadingStats = ref(false)
const employeeStats = ref(null)
const loadingEmployeeStats = ref(false)

const formatAmount = (amount) => {
  return Math.round(parseFloat(amount)).toLocaleString()
}

const fetchStats = async () => {
  loadingStats.value = true
  try {
    const response = await health_store.get('/orders/summary')
    stats.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  } finally {
    loadingStats.value = false
  }
}

const fetchEmployeeStats = async () => {
  loadingEmployeeStats.value = true
  try {
    const response = await health_store.get('/employees/stats')
    employeeStats.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки статистики сотрудников:', error)
  } finally {
    loadingEmployeeStats.value = false
  }
}

onMounted(() => {
  fetchStats()
  fetchEmployeeStats()
})
</script>
