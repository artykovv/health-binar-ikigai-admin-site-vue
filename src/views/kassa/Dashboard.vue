<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Финансовый Дашборд</h1>
        <p class="text-gray-500 dark:text-gray-400">Обзор финансовых показателей и транзакций</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <!-- Balance -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Баланс</span>
          </div>
          <div v-if="loadingStats">
            <div class="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
          </div>
          <div v-else>
            <p class="text-3xl font-black text-gray-900 dark:text-white">{{ formatAmount(stats?.balance_month || 0) }} сом</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Текущий счет</p>
          </div>
        </div>

        <!-- Income -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Доходы</span>
          </div>
          <div v-if="loadingStats">
            <div class="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
          </div>
          <div v-else>
            <p class="text-3xl font-black text-gray-900 dark:text-white">{{ formatAmount(stats?.income?.month_amount || 0) }} сом</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">За все время</p>
          </div>
        </div>

        <!-- Expense -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-red-50 dark:bg-red-500/10 rounded-2xl text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Расходы</span>
          </div>
          <div v-if="loadingStats">
            <div class="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
          </div>
          <div v-else>
            <p class="text-3xl font-black text-gray-900 dark:text-white">{{ formatAmount(stats?.expense?.month_amount || 0) }} сом</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">За все время</p>
          </div>
        </div>

        <!-- Transactions -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Операции</span>
          </div>
          <div v-if="loadingStats">
            <div class="h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
          </div>
          <div v-else>
            <p class="text-3xl font-black text-gray-900 dark:text-white">{{ (stats?.income?.transaction_count || 0) + (stats?.expense?.transaction_count || 0) }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Всего транзакций</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <!-- Quick Actions -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Действия</h3>
            <div class="space-y-3">
              <router-link to="/kassa/income" class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group">
                <div class="p-2 bg-white dark:bg-gray-700 rounded-xl group-hover:bg-opacity-20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span class="font-bold">Добавить доход</span>
              </router-link>
              <router-link to="/kassa/expenses" class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group">
                <div class="p-2 bg-white dark:bg-gray-700 rounded-xl group-hover:bg-opacity-20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </div>
                <span class="font-bold">Добавить расход</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Transactions Placeholder -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 h-full">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Последние операции</h3>
            </div>
            <div class="text-center py-20 text-gray-400">
              Данные загружаются...
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Methods Report -->
      <div class="bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Отчет по методам оплаты</h3>
        </div>
        
        <div v-if="loadingPaymentMethods" class="text-center py-8">
          <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        
        <div v-else-if="paymentMethodsReport" class="overflow-x-auto">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl">
              <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Общие доходы</p>
              <p class="text-2xl font-black text-emerald-700 dark:text-emerald-300">{{ formatAmount(paymentMethodsReport.total_income) }} сом</p>
            </div>
            <div class="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl">
              <p class="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Общие расходы</p>
              <p class="text-2xl font-black text-red-700 dark:text-red-300">{{ formatAmount(paymentMethodsReport.total_expense) }} сом</p>
            </div>
            <div class="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl">
              <p class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Общий оборот</p>
              <p class="text-2xl font-black text-blue-700 dark:text-blue-300">{{ formatAmount(paymentMethodsReport.total_turnover) }} сом</p>
            </div>
          </div>

          <!-- Table -->
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Метод оплаты</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Доходы</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Расходы</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Баланс</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Транзакции</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">%</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-for="pm in paymentMethodsReport.payment_methods" :key="pm.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ pm.name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-emerald-600 dark:text-emerald-400">{{ formatAmount(pm.income_amount) }} сом</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-red-600 dark:text-red-400">{{ formatAmount(pm.expense_amount) }} сом</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold" :class="pm.net_amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                  {{ formatAmount(pm.net_amount) }} сом
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span class="text-emerald-600 dark:text-emerald-400">{{ pm.income_count }}</span> / 
                  <span class="text-red-600 dark:text-red-400">{{ pm.expense_count }}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ pm.percentage }}%</td>
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
import { kassa_api } from '@/api'

const paymentMethodsReport = ref(null)
const loadingPaymentMethods = ref(false)
const stats = ref(null)
const loadingStats = ref(false)

const formatAmount = (amount) => {
  return Math.round(parseFloat(amount)).toLocaleString()
}

const fetchPaymentMethodsReport = async () => {
  loadingPaymentMethods.value = true
  try {
    const response = await kassa_api.get('/reports/payment-methods/')
    paymentMethodsReport.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки отчета:', error)
  } finally {
    loadingPaymentMethods.value = false
  }
}

const fetchQuickSummary = async () => {
  loadingStats.value = true
  try {
    const response = await kassa_api.get('/reports/quick-summary')
    stats.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  } finally {
    loadingStats.value = false
  }
}

onMounted(() => {
  fetchQuickSummary()
  fetchPaymentMethodsReport()
})
</script>
