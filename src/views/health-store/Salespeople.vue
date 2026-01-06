<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="dark:text-white text-2xl font-bold">Отчет по продажникам</h1>
      
      <div class="flex items-center gap-4 bg-white dark:bg-[#3f3f47] p-2 rounded-xl shadow-sm border dark:border-gray-700">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 uppercase font-bold">От:</span>
          <input 
            v-model="dateFrom" 
            type="date" 
            class="bg-transparent border-none text-sm focus:ring-0 dark:text-white"
          >
        </div>
        <div class="w-px h-4 bg-gray-200 dark:bg-gray-600"></div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 uppercase font-bold">До:</span>
          <input 
            v-model="dateTo" 
            type="date" 
            class="bg-transparent border-none text-sm focus:ring-0 dark:text-white"
          >
        </div>
        <button 
          @click="fetchReport" 
          class="ml-2 px-4 py-1.5 bg-black text-white rounded-lg text-sm hover:bg-gray-900 transition-colors"
        >
          Обновить
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-[#3f3f47] p-6 rounded-[20px] shadow-sm border dark:border-gray-700">
        <div class="text-gray-500 text-xs font-bold uppercase mb-2">Общая сумма продаж</div>
        <div class="flex items-end gap-3">
          <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">${{ reportData?.total_amount?.toFixed(2) || '0.00' }}</span>
          <span class="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
            {{ ((reportData?.total_amount || 0) * 88).toLocaleString() }} сом
          </span>
        </div>
      </div>
      <div class="bg-white dark:bg-[#3f3f47] p-6 rounded-[20px] shadow-sm border dark:border-gray-700">
        <div class="text-gray-500 text-xs font-bold uppercase mb-2">Всего заказов</div>
        <div class="text-3xl font-bold dark:text-white">{{ reportData?.total_orders || 0 }}</div>
      </div>
    </div>

    <!-- Employee Table -->
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Продажник</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма ($)</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма (сом)</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Заказов</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-if="loading">
                <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка данных...</td>
              </tr>
              <tr v-else-if="!reportData?.data?.length">
                <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет данных за этот период</td>
              </tr>
              <tr v-for="item in (reportData?.data || [])" :key="item.employee?.id || 'null'" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium dark:text-white">
                  {{ item.employee ? `${item.employee.lastname} ${item.employee.name}` : 'Без сотрудника' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-blue-600 dark:text-blue-400">
                  ${{ item.total_sales.toFixed(2) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-emerald-600 dark:text-emerald-500">
                  {{ (item.total_sales * 88).toLocaleString() }} сом
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right dark:text-white">
                  {{ item.order_count }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right text-sm">
                  <button 
                    @click="viewEmployeeDetails(item.employee)"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
                    v-if="item.employee"
                  >
                    История
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Employee Detail Modal -->
    <div v-if="selectedEmployeeReport" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="selectedEmployeeReport = null"></div>
        
        <div class="relative transform overflow-hidden rounded-[24px] bg-white dark:bg-[#3f3f47] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-xl font-bold dark:text-white">
                {{ selectedEmployeeReport.employee.lastname }} {{ selectedEmployeeReport.employee.name }}
              </h3>
              <p class="text-sm text-gray-500">История продаж за период</p>
            </div>
            <button @click="selectedEmployeeReport = null" class="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
              <div class="text-[10px] uppercase font-bold text-blue-600 mb-1">Продано на сумму</div>
              <div class="text-xl font-bold text-blue-700 dark:text-blue-400">${{ selectedEmployeeReport.total_amount.toFixed(2) }}</div>
              <div class="text-xl font-bold text-emerald-600 dark:text-emerald-500">{{ (selectedEmployeeReport.total_amount * 88).toLocaleString() }} сом</div>
            </div>
            <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
              <div class="text-[10px] uppercase font-bold text-emerald-600 mb-1">Всего заказов</div>
              <div class="text-xl font-bold text-emerald-700 dark:text-emerald-400">{{ selectedEmployeeReport.order_count }}</div>
            </div>
          </div>

          <div class="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="order in selectedEmployeeReport.orders" :key="order.id" class="mb-4 border dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-gray-800/30">
              <div class="px-4 py-3 border-b dark:border-gray-700 flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <span class="font-bold dark:text-white">Заказ #{{ order.id }}</span>
                  <span class="text-xs text-gray-400">{{ formatDate(order.created_at) }}</span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="text-sm font-bold text-blue-600 dark:text-blue-400">${{ order.total_amount.toFixed(2) }}</span>
                  <span class="text-sm font-bold text-emerald-600 dark:text-emerald-500">{{ (order.total_amount * 88).toLocaleString() }} сом</span>
                  <span v-if="order.sale" class="text-[10px] px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                    {{ order.sale.name }} (-{{ order.sale_percent }}%)
                  </span>
                </div>
              </div>
              <div class="p-3">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="text-gray-500 border-b dark:border-gray-700">
                      <th class="text-left pb-2">Товар</th>
                      <th class="text-center pb-2">Кол-во</th>
                      <th class="text-right pb-2">Цена ($)</th>
                      <th class="text-right pb-2">Цена (сом)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in order.items" :key="item.id">
                      <td class="py-2 dark:text-gray-300">{{ getVariantName(item.variant_id) }}</td>
                      <td class="py-2 text-center dark:text-gray-300">{{ item.quantity }} шт</td>
                      <td class="py-2 text-right font-medium text-blue-600 dark:text-blue-400">${{ item.price.toFixed(2) }}</td>
                      <td class="py-2 text-right font-medium text-emerald-600 dark:text-emerald-500">{{ (item.price * 88).toLocaleString() }} сом</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { health_store, store_api } from '@/api'

const loading = ref(false)
const reportData = ref(null)
const selectedEmployeeReport = ref(null)
const productVariants = ref([])

// Default range: last 30 days
const dateFrom = ref(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
const dateTo = ref(new Date().toISOString().split('T')[0])

const fetchReport = async () => {
  loading.value = true
  try {
    const res = await health_store.get('/reports/employees', {
      params: {
        date_from: dateFrom.value,
        date_to: dateTo.value
      }
    })
    reportData.value = res.data
  } catch (e) {
    console.error('Error fetching report:', e)
  } finally {
    loading.value = false
  }
}

const fetchVariants = async () => {
  try {
    const res = await store_api.get('/products/variants', { params: { is_healthstore: true, limit: 200 } })
    productVariants.value = res.data
  } catch (e) { console.error(e) }
}

const getVariantName = (id) => {
  const v = productVariants.value.find(v => v.id === id)
  return v ? v.full_name : `ID: ${id}`
}

const viewEmployeeDetails = async (employee) => {
  try {
    const res = await health_store.get(`/reports/employees/${employee.id}`, {
      params: {
        date_from: dateFrom.value,
        date_to: dateTo.value
      }
    })
    selectedEmployeeReport.value = res.data
  } catch (e) {
    console.error('Error fetching employee details:', e)
    alert('Не удалось загрузить историю продаж')
  }
}

const calculatePercent = (amount) => {
  if (!reportData.value?.total_amount) return 0
  return Math.round((amount / reportData.value.total_amount) * 100)
}

const formatDate = (d) => d ? new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'

onMounted(() => {
  fetchReport()
  fetchVariants()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
