<template>
  <div class="container mx-auto px-4 py-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Приход товара</h1>
            <p class="text-gray-600 dark:text-gray-400">История приходов товаров на склад</p>
          </div>
          <router-link
            to="/products/receipt/new"
            class="px-6 py-3 bg-[#015C3B] text-white rounded-[10px] hover:bg-[#014a2f] transition-colors font-medium flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Новый приход
          </router-link>
        </div>
      </div>

      <!-- Selector Card -->
      <div class="bg-white dark:bg-[#3f3f47] rounded-[20px] shadow-lg border dark:border-gray-600 p-6 mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Выберите приход:
        </label>
        
        <!-- Loading -->
        <div v-if="loading" class="py-4 text-center">
          <div class="inline-block h-6 w-6 animate-spin rounded-full border-3 border-gray-300 border-t-[#015C3B]"></div>
        </div>

        <!-- Select -->
        <select
          v-else
          v-model="selectedId"
          @change="loadDetail"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#015C3B] focus:border-transparent"
        >
          <option value="">— выберите —</option>
          <option v-for="r in receipts" :key="r.id" :value="r.id">
            {{ r.label }}
          </option>
        </select>
      </div>

      <!-- Detail Card -->
      <div v-if="detail" class="bg-white dark:bg-[#3f3f47] rounded-[20px] shadow-lg border dark:border-gray-600 p-6">
        <div class="mb-4">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Приход #{{ detail.id }} — {{ formatDate(detail.created_at) }}
          </h3>
          <p v-if="detail.note" class="italic text-gray-600 dark:text-gray-400 mb-2">
            {{ detail.note }}
          </p>
          <div class="flex gap-4 text-gray-700 dark:text-gray-300 font-medium">
            <p>
              Всего: <span class="text-[#015C3B] dark:text-[#4ade80]">{{ detail.total_quantity }} шт.</span>
            </p>
            <p v-if="detail.total_cost !== undefined && detail.total_cost !== null">
              Общая стоимость: <span class="text-[#015C3B] dark:text-[#4ade80]">{{ detail.total_cost.toFixed(2) }}</span>
            </p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">SKU</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Количество</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Себестоимость (за шт.)</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Итого</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-[#3f3f47] divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="item in detail.items"
                :key="item.variant_id"
                class="hover:bg-gray-50 dark:hover:bg-[#4a4a52] transition-colors"
              >
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{{ item.sku }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.variant_name }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">{{ item.quantity }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                  {{ item.cost_price !== undefined && item.cost_price !== null ? item.cost_price.toFixed(2) : '0.00' }}
                </td>
                <td class="px-4 py-3 text-sm text-[#015C3B] dark:text-[#4ade80] font-semibold text-right">
                  {{ ((item.cost_price || 0) * (item.quantity || 0)).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && receipts.length === 0" class="bg-white dark:bg-[#3f3f47] rounded-[20px] shadow-lg border dark:border-gray-600 p-12 text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">Нет приходов</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Создайте первый приход товара</p>
        <router-link
          to="/products/receipt/new"
          class="inline-flex items-center px-4 py-2 bg-[#015C3B] text-white rounded-[10px] hover:bg-[#014a2f] transition-colors"
        >
          Создать приход
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { store_api } from '@/api'

const receipts = ref([])
const selectedId = ref('')
const detail = ref(null)
const loading = ref(false)

// Загрузка списка приходов
const loadReceipts = async () => {
  loading.value = true
  try {
    const response = await store_api.get('/stock/receipts?skip=0&limit=100')
    receipts.value = response.data || []
  } catch (error) {
    console.error('Ошибка загрузки приходов:', error)
    receipts.value = []
  } finally {
    loading.value = false
  }
}

// Загрузка деталей прихода
const loadDetail = async () => {
  if (!selectedId.value) {
    detail.value = null
    return
  }

  loading.value = true
  try {
    const response = await store_api.get(`/stock/receipts/${selectedId.value}`)
    detail.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки деталей прихода:', error)
    detail.value = null
  } finally {
    loading.value = false
  }
}

// Форматирование даты
const formatDate = (iso) => {
  if (!iso) return '-'
  try {
    return new Date(iso).toLocaleString('ru-RU')
  } catch {
    return iso
  }
}

// Загрузка при монтировании
onMounted(() => {
  loadReceipts()
})
</script>
