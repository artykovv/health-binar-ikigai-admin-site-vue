<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white text-2xl font-bold">Доплаты по заказам</h1>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID Заказа</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Метод оплаты</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Описание</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Изображения</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата создания</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-if="loading" class="animate-pulse">
                <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка...</td>
              </tr>
              <tr v-else-if="payments.length === 0">
                <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет данных о доплатах</td>
              </tr>
              <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ payment.id }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span class="font-medium">#{{ payment.order_id }}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ Math.round(payment.amount).toLocaleString() }} сом</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ payment.payment_method?.name || '-' }}</td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" :title="payment.description">{{ payment.description || '-' }}</td>
                <td class="px-4 py-3 text-sm">
                  <div v-if="payment.images && payment.images.length > 0" class="flex gap-1">
                    <template v-for="img in payment.images.slice(0, 3)" :key="img.url">
                      <img 
                        v-if="!isPdf(img.url)"
                        :src="img.url" 
                        :alt="img.alt"
                        class="w-8 h-8 object-cover rounded cursor-pointer hover:scale-110 transition-transform"
                        @click="openImagePreview(img.url)"
                      >
                      <a 
                        v-else 
                        :href="img.url" 
                        target="_blank" 
                        class="w-8 h-8 rounded border-2 border-white dark:border-gray-700 bg-red-50 hover:bg-red-100 flex items-center justify-center hover:z-10 transition-colors"
                        title="Открыть PDF"
                      >
                        <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                      </a>
                    </template>
                    <span v-if="payment.images.length > 3" class="text-xs text-gray-500 dark:text-gray-400 self-center">
                      +{{ payment.images.length - 3 }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatDate(payment.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && payments.length > 0" class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Показано {{ payments.length }} доплат
      </div>
      <div class="flex gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
        >
          Назад
        </button>
        <button
          @click="nextPage"
          :disabled="payments.length < pageSize"
          class="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
        >
          Вперед
        </button>
      </div>
    </div>

    <!-- Fullscreen Image -->
    <div v-if="fullscreenImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 cursor-zoom-out" @click="fullscreenImage = null">
      <img :src="fullscreenImage" class="max-w-full max-h-full object-contain">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { binar_api } from '@/api' // Using binar_api as context suggests

const payments = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const fullscreenImage = ref(null)

const isPdf = (url) => {
  return url?.toLowerCase().endsWith('.pdf')
}

const fetchPayments = async () => {
    loading.value = true
    try {
        const response = await binar_api.get('/orders/extra-payments/', {
            params: {
                page: currentPage.value,
                limit: pageSize.value
            }
        })
        payments.value = response.data.items
    } catch (e) {
        console.error("Error fetching extra payments", e)
    } finally {
        loading.value = false
    }
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        fetchPayments()
    }
}
const nextPage = () => {
    currentPage.value++
    fetchPayments()
}

const openImagePreview = (url) => {
    previewImage.value = url
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
    fetchPayments()
})

</script>
