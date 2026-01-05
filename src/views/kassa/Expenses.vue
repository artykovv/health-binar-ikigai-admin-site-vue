<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white text-2xl font-bold">Расходы</h1>
      <button
        @click="openAddModal"
        class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Добавить расход
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="mb-3">
      <div class="grid md:grid-cols-12 gap-3">
        <!-- Total Expenses Today -->
        <div class="md:col-span-4 bg-white dark:bg-[#3f3f47] rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Расходы сегодня</p>
              <p class="text-xl font-bold text-red-600 dark:text-red-400 mt-1">${{ formatPrice(stats.today_amount) }}</p>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ formatPrice(stats.today_amount * CURRENCY_RATE) }} сом</p>
            </div>
            <div class="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- This Month -->
        <div class="md:col-span-4 bg-white dark:bg-[#3f3f47] rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">За месяц</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">${{ formatPrice(stats.month_amount) }}</p>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ formatPrice(stats.month_amount * CURRENCY_RATE) }} сом</p>
            </div>
            <div class="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

    <!-- Таблица расходов -->
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
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма ($)</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма (сом)</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-if="loading" class="animate-pulse">
                <td colspan="4" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка...</td>
              </tr>
              <tr v-else-if="transactions.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет данных о расходах</td>
              </tr>
              <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ formatDate(tx.date) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ tx.category?.name || '-' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ tx.payment_method?.name || '-' }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center gap-2">
                    <div v-if="tx.images?.length > 0" class="flex-shrink-0 w-8 h-8 rounded overflow-hidden bg-gray-100">
                      <img :src="tx.images[0].url" class="w-full h-full object-cover">
                    </div>
                    <span>{{ tx.description || 'Без описания' }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                  -${{ formatPrice(tx.amount) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-red-500 dark:text-red-300">
                  {{ formatPrice(tx.amount * CURRENCY_RATE) }} сом
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm space-x-2">
                  <button @click="viewExpense(tx)" class="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-white text-xs hover:bg-blue-700">Просмотр</button>
                  <button @click="editExpense(tx)" class="inline-flex items-center rounded-md bg-orange-600 px-3 py-1.5 text-white text-xs hover:bg-orange-700">Изменить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal for viewing transaction details -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/60 transition-opacity" @click="showDetailsModal = false"></div>
        
        <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-2xl w-full p-0 overflow-hidden animate-in fade-in zoom-in duration-200" @click.stop>
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Детали расхода</h3>
            <button @click="showDetailsModal = false" class="text-gray-400 hover:text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Сумма</p>
                <p class="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">-${{ formatPrice(selectedTransaction?.amount) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Дата и время</p>
                <p class="text-lg text-gray-900 dark:text-white mt-1">{{ formatDate(selectedTransaction?.date) }}</p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-6">
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Категория</p>
                <p class="text-lg text-gray-900 dark:text-white mt-1 font-medium">{{ selectedTransaction?.category?.name || 'Без категории' }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Метод оплаты</p>
                <p class="text-lg text-gray-900 dark:text-white mt-1 font-medium">{{ selectedTransaction?.payment_method?.name || '-' }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Теги</p>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span 
                    v-for="t in selectedTransaction?.tags" 
                    :key="t.id"
                    class="px-2 py-0.5 rounded-full text-[10px] text-white bg-blue-600"
                  >
                    {{ t.name }}
                  </span>
                  <span v-if="!selectedTransaction?.tags?.length" class="text-gray-400 text-sm">-</span>
                </div>
              </div>
            </div>

            <div>
              <p class="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Описание</p>
              <p class="text-gray-900 dark:text-white mt-1 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700">
                {{ selectedTransaction?.description || 'Описание отсутствует' }}
              </p>
            </div>

            <div v-if="selectedTransaction?.images?.length > 0">
              <p class="text-xs font-medium text-gray-500 uppercase dark:text-gray-400 mb-3">Вложения ({{ selectedTransaction.images.length }})</p>
              <div class="grid grid-cols-4 gap-4">
                <div 
                  v-for="img in selectedTransaction.images" 
                  :key="img.id"
                  @click="fullscreenImage = img.url"
                  class="relative aspect-square cursor-zoom-in group overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
                >
                  <img :src="img.url" class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110">
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <svg class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700 text-[10px] text-gray-400">
              <p>Создано: {{ formatDate(selectedTransaction?.created_at) }}</p>
              <p v-if="selectedTransaction?.updated_at">Изменено: {{ formatDate(selectedTransaction?.updated_at) }}</p>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-[#34343d] px-6 py-4 flex justify-between gap-2">
            <button
               @click="editExpense(selectedTransaction); showDetailsModal = false"
               class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
            >
              Изменить
            </button>
            <button
              @click="showDetailsModal = false"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors text-sm"
            >
              Закрыть
            </button>
          </div>
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

    <!-- Modal for adding/editing expense -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="closeModal"></div>
        
        <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200" @click.stop>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ isEditing ? 'Изменить расход' : 'Добавить расход' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveExpense" class="space-y-4">
            <!-- Amount (Dual Currency) -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Сумма (USD) *</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    v-model.number="form.amount" 
                    @input="syncSom"
                    type="number" 
                    step="0.01" 
                    required
                    class="block w-full pl-7 rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Сумма (СОМ)</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input 
                    v-model.number="somAmount" 
                    @input="syncUsd"
                    type="number" 
                    step="0.01"
                    class="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">сом</span>
                  </div>
                </div>
              </div>
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
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Метод оплаты</label>
                <select 
                  v-model="form.payment_method_id" 
                  class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                >
                  <option :value="null">Не выбрано</option>
                  <option v-for="pm in paymentMethods" :key="pm.id" :value="pm.id">{{ pm.name }}</option>
                </select>
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
                placeholder="На что потрачено..."
              ></textarea>
            </div>

            <!-- Images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Изображения (чеки)</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <div v-for="(img, idx) in form.images" :key="idx" class="relative w-20 h-20 group">
                  <img :src="img.url" class="w-full h-full object-cover rounded-lg">
                  <button 
                    @click.prevent="removeImage(idx)" 
                    class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
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
      directory="expense"
      @close="imageModalOpen = false"
      @uploaded="handleImageUploaded"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { kassa_api } from '@/api'
import ImageUploadModal from '@/components/ImageUploadModal.vue'

// State
const transactions = ref([])
const categories = ref([])
const tags = ref([])
const paymentMethods = ref([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const showDetailsModal = ref(false)
const imageModalOpen = ref(false)
const fullscreenImage = ref(null)
const isEditing = ref(false)
const editingId = ref(null)
const selectedTransaction = ref(null)
const somAmount = ref(0)
const CURRENCY_RATE = 88

const stats = ref({
  today_amount: 0,
  month_amount: 0,
  transaction_count: 0
})

const defaultForm = {
  type: 'expense',
  amount: 0,
  description: '',
  date: new Date().toISOString().slice(0, 16),
  category_id: null,
  payment_method_id: null,
  tag_ids: [],
  user_id: null,
  images: []
}

const form = ref({ ...defaultForm })

// Methods
const fetchData = async () => {
  loading.value = true
  try {
    const [txRes, catRes, tagRes, pmRes] = await Promise.all([
      kassa_api.get('/transactions/', { params: { type: 'expense' } }),
      kassa_api.get('/categories/'),
      kassa_api.get('/tags/'),
      kassa_api.get('/payment-methods/', { params: { only_active: true } })
    ])
    
    // Transactions
    transactions.value = Array.isArray(txRes.data) ? txRes.data : (txRes.data.transactions || [])

    // Categories (filter for expense or any)
    categories.value = catRes.data.filter(c => c.transaction_type === 'expense' || c.transaction_type === 'any')
    
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
    const response = await kassa_api.get('/reports/expense/')
    stats.value = response.data
  } catch (error) {
    console.error('Error fetching expense stats:', error)
  }
}

const fetchExpenses = async () => {
  try {
    const response = await kassa_api.get('/transactions/', {
      params: { type: 'expense' }
    })
    transactions.value = Array.isArray(response.data) ? response.data : (response.data.transactions || [])
    await fetchStats()
  } catch (error) {
    console.error('Error fetching expenses:', error)
  }
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { 
    ...defaultForm, 
    date: new Date().toISOString().slice(0, 16),
    images: [],
    tag_ids: []
  }
  somAmount.value = 0
  showModal.value = true
}

const editExpense = (tx) => {
  isEditing.value = true
  editingId.value = tx.id
  form.value = { 
    ...tx,
    date: tx.date ? new Date(tx.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    tag_ids: tx.tags ? tx.tags.map(t => t.id) : (tx.tag_ids || [])
  }
  somAmount.value = Number((form.value.amount * CURRENCY_RATE).toFixed(2))
  showModal.value = true
}

const syncSom = () => {
  somAmount.value = Number((form.value.amount * CURRENCY_RATE).toFixed(2))
}

const syncUsd = () => {
  form.value.amount = Number((somAmount.value / CURRENCY_RATE).toFixed(2))
}

const closeModal = () => {
  showModal.value = false
}

const saveExpense = async () => {
  saving.value = true
  try {
    const payload = { ...form.value, type: 'expense' }
    // Clean up payload for API (ensure only IDs are sent for relations if needed)
    
    if (isEditing.value) {
      await kassa_api.patch(`/transactions/${editingId.value}`, payload)
    } else {
      await kassa_api.post('/transactions/', payload)
    }
    
    await fetchExpenses()
    closeModal()
  } catch (error) {
    console.error('Error saving expense:', error)
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
    alt: data.filename || 'Expense receipt',
    order: form.value.images.length
  })
}

const removeImage = (index) => {
  form.value.images.splice(index, 1)
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

