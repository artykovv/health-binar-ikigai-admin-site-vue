<template>
  <div>
    <div>
      <div>
        <div class="flex items-center justify-between mb-3">
          <h1 class="dark:text-white">Покупки</h1>
          <button @click="openModal" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
            Пополнить
          </button>
        </div>
        
        <!-- Уведомление об успехе -->
        <div v-if="successVisible" class="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div class="rounded-md bg-green-100 px-4 py-2 text-green-800 shadow dark:bg-[#3f3f47] dark:text-white">
            Пополнение успешно выполнено!
          </div>
        </div>
        
        <!-- Карточки -->
        <div class="grid md:grid-cols-12 gap-4 mb-4">
          <div class="md:col-span-6">
            <div class="bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
              <div class="p-4 text-center">
                <p class="text-gray-500 mb-2 text-base dark:text-white">Общий</p>
                <h3 class="m-0 text-2xl dark:text-white" id="total-amount">{{ totalAmount.toFixed(2) }}</h3>
              </div>
            </div>
          </div>
          <div class="md:col-span-6">
            <div class="bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
              <div class="p-4 text-center">
                <p class="text-gray-500 mb-2 text-base dark:text-white">Пополнить</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- История покупок -->
        <div class="bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
          <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
            <h5 class="m-0 dark:text-white">История покупок</h5>
          </div>
          <div class="p-4">
            <div v-if="loading" class="py-6 text-center">
              <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
            </div>
            <div v-else class="overflow-x-auto">
              <div class="inline-block min-w-full align-middle">
                <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
                  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                      <tr>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">#</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата покупки</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                      <tr v-for="(purchase, index) in purchases" :key="purchase.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ index + 1 }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ purchase.amount }}</td>
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(purchase.purchase_date) }}</td>
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

    <!-- Tailwind Modal -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>
      <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <h5 class="m-0 dark:text-white">Пополнить баланс</h5>
          <button @click="closeModal" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-[#4a4a52]">✕</button>
        </div>
        <div class="p-4">
          <form @submit.prevent="submitPurchase" class="space-y-3">
            <div>
              <label for="amount" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Сумма</label>
              <input v-model="purchaseForm.amount" type="number" id="amount" step="0.01" required
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
            </div>
            <div v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-[#3f3f47] dark:text-white dark:border-gray-700">
              {{ errorMessage }}
            </div>
          </form>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <button type="button" @click="closeModal" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Закрыть</button>
          <button @click="submitPurchase" type="button" :disabled="submitting"
            class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52]">
            <span v-if="submitting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
            {{ submitting ? 'Отправка...' : 'Отправить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'

// Реактивные данные
const purchases = ref([])
const totalAmount = ref(0)
const loading = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const modalOpen = ref(false)
const successVisible = ref(false)

// Форма покупки
const purchaseForm = ref({
  amount: ''
})

// API базовый URL
// centralized API client is used

// Получение ID участника из маршрута
const route = useRoute()
const participantId = route.params.id

// Загрузка покупок
const loadPurchases = async () => {
  loading.value = true
  try {
    const response = await api.get(`purchases/participant/${participantId}`)
    purchases.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки покупок:', error)
    purchases.value = []
  } finally {
    loading.value = false
  }
}

// Загрузка общей суммы
const loadTotalAmount = async () => {
  try {
    const response = await api.get(`purchases/participant/${participantId}/count`)
    totalAmount.value = response.data.total_amount || 0
  } catch (error) {
    console.error('Ошибка загрузки общей суммы:', error)
    totalAmount.value = 0
  }
}

const openModal = () => {
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  // очистка
  purchaseForm.value.amount = ''
  errorMessage.value = ''
}

// Отправка покупки
const submitPurchase = async () => {
  if (!purchaseForm.value.amount) {
    errorMessage.value = 'Введите сумму'
    return
  }

  submitting.value = true
  errorMessage.value = ''

  try {
    const response = await api.post(`purchases/`, {
      participant_id: participantId,
      amount: parseFloat(purchaseForm.value.amount)
    })

    if (response.status === 200 || response.status === 201) {
      // Показываем уведомление об успехе
      successVisible.value = true
      setTimeout(() => { successVisible.value = false }, 2000)
      
      // Закрываем модалку и обновляем данные
      closeModal()
      await Promise.all([loadPurchases(), loadTotalAmount()])
    }
  } catch (error) {
    console.error('Ошибка при пополнении:', error)
    errorMessage.value = error.response?.data?.detail || 'Ошибка при пополнении'
  } finally {
    submitting.value = false
  }
}

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return 'Не указано'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU')
  } catch (error) {
    return dateString
  }
}

onMounted(() => {
  loadPurchases()
  loadTotalAmount()
})
</script>
