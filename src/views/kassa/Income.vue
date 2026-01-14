<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white text-2xl font-bold">Доходы</h1>
      <button
        @click="openAddModal"
        class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Добавить доход
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="mb-3">
      <div class="grid md:grid-cols-12 gap-3">
        <!-- Total Income Today -->
        <div class="md:col-span-4 bg-white dark:bg-[#3f3f47] rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Доходы сегодня</p>
              <p class="text-xl font-bold text-green-600 dark:text-green-400 mt-1">{{ formatUSD(stats.today_amount) }}</p>
            </div>
            <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- This Month -->
        <div class="md:col-span-4 bg-white dark:bg-[#3f3f47] rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">За месяц</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">{{ formatUSD(stats.month_amount) }}</p>
            </div>
            <div class="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Transactions -->
        <div class="md:col-span-4 bg-white dark:bg-[#3f3f47] rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Транзакций</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.transaction_count || 0 }}</p>
              <p class="text-[10px] text-gray-500 dark:text-gray-400">Всего операций</p>
            </div>
            <div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Таблица доходов -->
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Категория</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Метод</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Описание</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Теги</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-if="loading" class="animate-pulse">
                <td colspan="4" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка...</td>
              </tr>
              <tr v-else-if="transactions.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет данных о доходах</td>
              </tr>
              <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(tx.date) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ tx.category?.name || '-' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div v-if="tx.payments && tx.payments.length">
                      <div v-for="p in tx.payments" :key="p.id" class="text-xs">
                          {{ p.payment_method?.name }}: {{ formatUSD(p.amount) }}
                      </div>
                  </div>
                  <span v-else>{{ tx.payment_method?.name || '-' }}</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center gap-2">
                    <div v-if="tx.images?.length > 0" class="flex-shrink-0 w-8 h-8 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img v-if="!isPdf(tx.images[0].url)" :src="tx.images[0].url" class="w-full h-full object-cover">
                      <a v-else :href="tx.images[0].url" target="_blank" class="text-red-500" @click.stop title="Открыть PDF">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                      </a>
                    </div>
                    <span>{{ tx.description || 'Без описания' }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="tag in tx.tags" 
                      :key="tag.id"
                      class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      {{ tag.name }}
                    </span>
                    <span v-if="!tx.tags?.length" class="text-gray-400 text-xs">-</span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                  +{{ formatPrice(tx.amount) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button @click="editIncome(tx)" class="inline-flex items-center rounded-md bg-orange-600 px-3 py-1.5 text-white text-xs hover:bg-orange-700">Изменить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Fullscreen Image Overlay -->
    <div v-if="fullscreenImage" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300" @click="fullscreenImage = null">
      <button class="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <img :src="fullscreenImage" class="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in duration-300" @click.stop>
    </div>

    <!-- Modal for adding/editing income -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="closeModal"></div>
        
        <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200" @click.stop>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditing ? 'Изменить доход' : 'Добавить доход' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveIncome" class="space-y-4">
            <!-- Amount -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Сумма *</label>
              <input 
                v-model.number="form.amount" 
                type="number" 
                step="0.01" 
                required
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
            </div>

            <!-- Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Дата *</label>
              <input 
                v-model="form.date" 
                type="datetime-local" 
                required
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
            </div>

            <!-- Category & Payment Method -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Категория</label>
                <select 
                  v-model="form.category_id" 
                  class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                >
                  <option :value="null">Без категории</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Методы оплаты</label>
                <div class="space-y-2">
                    <div v-for="(payment, index) in form.payments" :key="index" class="flex flex-col gap-2 p-3 border rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div class="flex gap-2">
                             <select 
                                v-model="payment.payment_method_id" 
                                class="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            >
                                <option :value="null">Выберите метод</option>
                                <option v-for="pm in paymentMethods" :key="pm.id" :value="pm.id">{{ pm.name }}</option>
                            </select>
                            <button 
                                @click.prevent="removePaymentMethod(index)" 
                                type="button"
                                class="text-red-500 hover:text-red-700 items-center justify-center px-2"
                                v-if="form.payments.length > 1"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <input 
                            v-model.number="payment.amount"
                            type="number"
                            placeholder="Сумма"
                            step="0.01"
                            class="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        >
                    </div>
                </div>
                 <button 
                    @click.prevent="addPaymentMethod"
                    type="button"
                    class="mt-1 text-xs text-blue-600 hover:text-blue-500 font-medium"
                >
                    + Добавить еще метод оплаты
                </button>
                 <div class="text-xs mt-1" :class="Math.abs(form.payments.reduce((s, p) => s + Number(p.amount), 0) - form.amount) < 0.01 ? 'text-green-600' : 'text-red-500'">
                    Всего распределено: {{ form.payments.reduce((s, p) => s + Number(p.amount), 0) }} / {{ form.amount }}
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Теги</label>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="tag in tags" 
                  :key="tag.id"
                  @click.prevent="toggleTag(tag.id)"
                  type="button"
                  class="px-3 py-1 rounded-full text-xs font-medium transition-all border"
                  :class="[
                    form.tag_ids.includes(tag.id)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                  ]"
                >
                  {{ tag.name }}
                </button>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Описание</label>
              <textarea 
                v-model="form.description" 
                rows="3"
                class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                placeholder="Источник дохода..."
              ></textarea>
            </div>

            <!-- Images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Изображения (чеки)</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <template v-for="(img, idx) in form.images" :key="idx">
                  <div class="relative w-20 h-20 group">
                    <img v-if="!isPdf(img.url)" :src="img.url" class="w-full h-full object-cover rounded-lg">
                    <a v-else :href="img.url" target="_blank" class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                    </a>
                    <button 
                      @click.prevent="removeImage(idx)" 
                      class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </template>
                <button 
                  @click.prevent="openImageUpload"
                  type="button"
                  class="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span class="text-[10px] text-gray-500 mt-1">Загрузить</span>
                </button>
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
              <button
                @click="closeModal"
                type="button"
                class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {{ saving ? 'Сохранение...' : (isEditing ? 'Обновить' : 'Сохранить') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Image Upload Modal -->
    <ImageUploadModal 
      v-if="imageModalOpen" 
      :isOpen="imageModalOpen"
      directory="income"
      @close="imageModalOpen = false"
      @uploaded="handleImageUploaded"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { kassa_api } from '@/api'
import { formatUSD, toSOM, toUSD } from '@/utils/currency'
import ImageUploadModal from '@/components/ImageUploadModal.vue'

// State
const transactions = ref([])
const categories = ref([])
const tags = ref([])
const paymentMethods = ref([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const imageModalOpen = ref(false)
const fullscreenImage = ref(null)
const isEditing = ref(false)
const editingId = ref(null)


const stats = ref({
  today_amount: 0,
  month_amount: 0,
  transaction_count: 0
})

const defaultForm = {
  type: 'income',
  amount: 0,
  description: '',
  date: new Date().toISOString().slice(0, 16),
  category_id: null,
  payments: [],
  tag_ids: [],
  payment_method_id: null,
  user_id: null,
  images: []
}

const form = ref({ ...defaultForm })

const isPdf = (url) => {
  return url?.toLowerCase().endsWith('.pdf')
}

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    const [txRes, catRes, tagRes, pmRes] = await Promise.all([
      kassa_api.get('/transactions/', { params: { type: 'income' } }),
      kassa_api.get('/categories/'),
      kassa_api.get('/tags/'),
      kassa_api.get('/payment-methods/', { params: { only_active: true } })
    ])
    
    // Transactions
    transactions.value = Array.isArray(txRes.data) ? txRes.data : (txRes.data.transactions || [])

    // Categories (filter for income or any)
    categories.value = catRes.data.filter(c => c.transaction_type === 'income' || c.transaction_type === 'any')
    
    // Tags
    tags.value = tagRes.data

    // Payment Methods
    paymentMethods.value = pmRes.data

    // Stats
    await fetchStats()
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const response = await kassa_api.get('/reports/income/')
    stats.value = response.data
  } catch (error) {
    console.error('Error fetching income stats:', error)
  }
}

const fetchIncome = async () => {
  try {
    const response = await kassa_api.get('/transactions/', {
      params: { type: 'income' }
    })
    transactions.value = Array.isArray(response.data) ? response.data : (response.data.transactions || [])
    await fetchStats()
  } catch (error) {
    console.error('Error fetching income:', error)
  }
}


const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { 
    ...defaultForm, 
    date: new Date().toISOString().slice(0, 16),
    images: [],
    tag_ids: [],
    payments: [{ payment_method_id: null, amount: 0 }] 
  }

  showModal.value = true
}

const editIncome = (tx) => {
  isEditing.value = true
  editingId.value = tx.id
  form.value = { 
    ...tx,
    payments: tx.payments && tx.payments.length > 0 
      ? tx.payments.map(p => ({ 
          payment_method_id: p.payment_method_id || (p.payment_method ? p.payment_method.id : null), 
          amount: parseFloat(p.amount)
        }))
      : (tx.payment_method_id ? [{ payment_method_id: tx.payment_method_id, amount: parseFloat(tx.amount) }] : []),
    date: tx.date ? new Date(tx.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    tag_ids: tx.tags ? tx.tags.map(t => t.id) : (tx.tag_ids || [])
  }


  // Если при редактировании массив платежей пустой
  if (form.value.payments.length === 0) {
      form.value.payments.push({ payment_method_id: null, amount: parseFloat(form.value.amount) || 0 })
  }
  
  showModal.value = true
}



const closeModal = () => {
  showModal.value = false
}

const saveIncome = async () => {
  saving.value = true
  try {
    // Validate payments sum and methods
    const totalPayments = form.value.payments.reduce((sum, p) => sum + Number(p.amount), 0)
    
    // Check if any payment method is missing
    const missingMethod = form.value.payments.find(p => !p.payment_method_id)
    if (missingMethod) {
        alert('Выберите метод оплаты для всех строк')
        saving.value = false
        return
    }

    if (Math.abs(totalPayments - form.value.amount) > 0.01) {
        alert(`Сумма платежей (${totalPayments}) не совпадает с общей суммой (${form.value.amount})`)
        saving.value = false
        return
    }
    
    const payload = { ...form.value, type: 'income' }
    
    if (isEditing.value) {
      await kassa_api.patch(`/transactions/${editingId.value}`, payload)
    } else {
      await kassa_api.post('/transactions/', payload)
    }
    
    await fetchIncome()
    closeModal()
  } catch (error) {
    console.error('Error saving income:', error)
    alert('Ошибка при сохранении')
  } finally {
    saving.value = false
  }
}

const toggleTag = (tagId) => {
  const index = form.value.tag_ids.indexOf(tagId)
  if (index === -1) {
    form.value.tag_ids.push(tagId)
  } else {
    form.value.tag_ids.splice(index, 1)
  }
}

const openImageUpload = () => {
  imageModalOpen.value = true
}

const handleImageUploaded = (data) => {
  form.value.images.push({
    url: data.url,
    alt: data.filename || 'Income proof',
    order: form.value.images.length
  })
}

const removeImage = (index) => {
  form.value.images.splice(index, 1)
}

const addPaymentMethod = () => {
    form.value.payments.push({ payment_method_id: null, amount: 0 })
}

const removePaymentMethod = (index) => {
    if (form.value.payments.length > 1) {
        form.value.payments.splice(index, 1)
    }
}

const formatPrice = (value) => {
  if (value === undefined || value === null) return '0'
  const num = Number(value)
  if (num % 1 === 0) return num.toString()
  return num.toFixed(2)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(fetchData)
</script>

