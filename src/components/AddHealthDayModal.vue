<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
    <div class="relative z-10 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
      <div class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-[#3f3f47]">
        <h5 class="m-0 dark:text-white">{{ getStepTitle() }}</h5>
        <button @click="$emit('close')" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-[#4a4a52]">✕</button>
      </div>
      <div class="p-4">
        <!-- Step 1: Participant Selection -->
        <div v-if="step === 1">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
            <p class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Поиск участника</p>
            <p class="text-xs text-blue-700 dark:text-blue-300 mb-3">Найдите участника для создания заказа Health Day</p>
            
            <!-- Search input -->
            <div class="mb-3">
              <input
                v-model="participantSearch"
                @input="searchParticipants"
                type="text"
                placeholder="Поиск по имени, фамилии, персональному номеру..."
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
              />
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loadingParticipants" class="text-center py-8">
            <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
          </div>

          <!-- Results -->
          <div v-else class="space-y-2">
            <div v-if="participants.length === 0 && participantSearch" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              Участники не найдены
            </div>
            <div
              v-for="participant in participants"
              :key="participant.id"
              @click="selectParticipant(participant)"
              class="p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#4a4a52] transition-colors"
              :class="{ 'border-gray-900 dark:border-gray-300 bg-blue-50 dark:bg-blue-900/20': selectedParticipant?.id === participant.id }"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ participant.name }} {{ participant.lastname }} {{ participant.patronymic }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ participant.personal_number }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ participant.branch?.name || '-' }}
                  </p>
                </div>
                <div v-if="participant.contracts" class="text-right">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Контракт</p>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">${{ participant.contracts.remaining_amount }}</p>
                </div>
                <div v-else class="text-right">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Без контракта</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Product Selection -->
        <div v-if="step === 2 && selectedParticipant">
          <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Выбранный участник</p>
            <p class="text-sm text-blue-700 dark:text-blue-300 font-semibold">
              {{ selectedParticipant.name }} {{ selectedParticipant.lastname }} {{ selectedParticipant.patronymic }}
            </p>
            <p class="text-sm text-blue-700 dark:text-blue-300">{{ selectedParticipant.personal_number }}</p>
          </div>



          <div v-if="loadingProducts" class="text-center py-8">
            <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white"></th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цена</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Скидка</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">%</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Кол-во</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Остаток</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                <tr 
                  v-for="product in products"
                  :key="product.id"
                  @click="toggleProduct(product.id)"
                  class="hover:bg-gray-50 dark:hover:bg-[#4a4a52] cursor-pointer"
                >
                  <td class="px-4 py-2 whitespace-nowrap" @click.stop>
                    <input
                      type="checkbox"
                      :checked="isProductSelected(product.id)"
                      :value="product.id"
                      @change.stop="toggleProduct(product.id)"
                      @click.stop
                      class="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ product.id }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ product.full_name }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span class="line-through text-gray-400 dark:text-gray-500">{{ Math.round(parseFloat(product.price)).toLocaleString() }} сом</span>
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm">
                    <span class="text-xs font-semibold text-red-500">-50%</span>
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm">
                    <span class="font-semibold text-green-600 dark:text-green-400">{{ Math.round(parseFloat(getDiscountedPrice(product.price))).toLocaleString() }} сом</span>
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap" @click.stop>
                    <input
                      v-if="isProductSelected(product.id)"
                      type="number"
                      :value="getProductQuantity(product.id)"
                      @input="updateProductQuantity(product.id, $event.target.value)"
                      @click.stop
                      min="1"
                      class="w-20 px-2 py-1 text-sm border rounded border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white"
                    />
                    <span v-else class="text-sm text-gray-500 dark:text-gray-400 inline-block w-20">-</span>
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ product.stock }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Step 3: Confirmation and Payment Method -->
        <div v-if="step === 3 && selectedParticipant">
          <div class="space-y-4">
            <!-- Participant Info -->
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Участник</p>
              <p class="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                {{ selectedParticipant.name }} {{ selectedParticipant.lastname }} {{ selectedParticipant.patronymic }}
              </p>
              <p class="text-sm text-blue-700 dark:text-blue-300">{{ selectedParticipant.personal_number }}</p>
            </div>

            <!-- Selected Products Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цена</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Кол-во</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr
                    v-for="productId in selectedProducts"
                    :key="productId"
                    class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]"
                  >
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ productId }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ getProductById(productId)?.full_name || '-' }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div class="flex flex-col">
                        <span class="line-through text-gray-400 dark:text-gray-500">{{ Math.round(parseFloat(getProductById(productId)?.price || 0)).toLocaleString() }} сом</span>
                        <span class="font-semibold text-green-600 dark:text-green-400">{{ Math.round(parseFloat(getDiscountedPrice(getProductById(productId)?.price || 0))).toLocaleString() }} сом</span>
                      </div>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ getProductQuantity(productId) }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span class="font-semibold">{{ Math.round(parseFloat(getDiscountedPrice(getProductById(productId)?.price || 0)) * getProductQuantity(productId)).toLocaleString() }} сом</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Images -->
            <div class="p-4 bg-gray-50 dark:bg-[#4a4a52] border border-gray-200 dark:border-gray-600 rounded-lg">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Изображения (чеки, подтверждения)</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <div v-for="(img, idx) in images" :key="idx" class="relative w-20 h-20 group">
                  <!-- Image Preview -->
                  <img 
                    v-if="isImage(img)"
                    :src="img.url" 
                    class="w-full h-full object-cover rounded-lg"
                  >
                  <!-- PDF Preview -->
                  <a 
                    v-else 
                    :href="img.url" 
                    target="_blank"
                    class="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Открыть PDF"
                  >
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <span class="text-[8px] text-gray-500 mt-1 truncate w-16 text-center">{{ img.filename }}</span>
                  </a>

                  <button
                    @click.prevent="removeImage(idx)"
                    class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
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

            <!-- Payment Method Selection -->
            <div class="p-4 bg-gray-50 dark:bg-[#4a4a52] border border-gray-200 dark:border-gray-600 rounded-lg">
              <p class="text-sm font-medium text-gray-900 dark:text-white mb-3">Способ оплаты *</p>
              <select 
                v-model.number="selectedPaymentMethodId" 
                required
                :disabled="loadingPaymentMethods"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white disabled:opacity-50"
              >
                <option value="">{{ loadingPaymentMethods ? 'Загрузка...' : 'Выберите способ оплаты' }}</option>
                <option 
                  v-for="method in paymentMethods" 
                  :key="method.id" 
                  :value="method.id"
                >
                  {{ method.name }}
                </option>
              </select>
            </div>

            <!-- Summary -->
            <div class="grid grid-cols-3 gap-4 p-3 bg-gray-50 dark:bg-[#4a4a52] rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Общая сумма (сом)</p>
                <p class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ Math.round(selectedProductsTotal).toLocaleString() }} сом</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Выбрано товаров</p>
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ selectedProducts.length }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 py-3 border-t dark:border-gray-700 sticky bottom-0 bg-white dark:bg-[#3f3f47]">
        <!-- Summary for Step 2 -->
        <div v-if="step === 2" class="mb-4">
          <div class="grid grid-cols-3 gap-4 p-3 bg-gray-50 dark:bg-[#4a4a52] rounded-lg border border-gray-200 dark:border-gray-600">
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Товары (сом)</p>
              <p class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ Math.round(selectedProductsTotal).toLocaleString() }} сом</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Выбрано товаров</p>
              <p class="text-sm font-bold text-gray-900 dark:text-white">{{ selectedProducts.length }}</p>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <button
            v-if="step >= 2"
            @click="step--"
            class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]"
          >
            Назад
          </button>
          <div v-else></div>
          <div class="flex gap-2">
            <button @click="$emit('close')" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Отмена</button>
            <button
              v-if="step === 1"
              @click="goToStep2"
              :disabled="!selectedParticipant"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Далее
            </button>
            <button
              v-if="step === 2"
              @click="goToStep3"
              :disabled="selectedProducts.length === 0"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Далее
            </button>
            <button
              v-if="step === 3"
              @click="createOrder"
              :disabled="creatingOrder || !selectedPaymentMethodId"
              class="inline-flex items-center gap-2 rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              <span 
                v-if="creatingOrder"
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
              ></span>
              <span>{{ creatingOrder ? 'Создание...' : 'Создать' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Upload Modal -->
    <ImageUploadModal
      v-if="imageModalOpen"
      :isOpen="imageModalOpen"
      directory="health-day"
      @close="imageModalOpen = false"
      @uploaded="handleImageUploaded"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { api } from '@/api'
import { store_api } from '@/api'
import ImageUploadModal from '@/components/ImageUploadModal.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'created'])

// Step management
const step = ref(1)

// Participant
const participantSearch = ref('')
const participants = ref([])
const loadingParticipants = ref(false)
const selectedParticipant = ref(null)

// Products
const products = ref([])
const loadingProducts = ref(false)
const selectedProducts = ref([])
const productQuantities = ref({})

// Payment Methods
const paymentMethods = ref([])
const loadingPaymentMethods = ref(false)
const selectedPaymentMethodId = ref(null)

// Creating order state
const creatingOrder = ref(false)
const images = ref([])
const imageModalOpen = ref(false)

// Exchange rate (1$ = X сом)
const exchangeRate = ref(88)

// Discount constant (50% off for Health Day)
const DISCOUNT_RATE = 0.5

// Helper function to calculate discounted price
const getDiscountedPrice = (price) => {
  // Price already in SOM, just apply discount
  return (parseFloat(price || 0) * DISCOUNT_RATE).toFixed(2)
}

// Computed
const selectedProductsTotal = computed(() => {
  return selectedProducts.value.reduce((sum, productId) => {
    const product = products.value.find(p => p.id === productId)
    const quantity = productQuantities.value[productId] || 1
    if (product) {
      // Apply 50% discount
      const discountedPrice = parseFloat(product.price || 0) * DISCOUNT_RATE
      return sum + (discountedPrice * quantity)
    }
    return sum
  }, 0)
})

// Functions
const getStepTitle = () => {
  switch(step.value) {
    case 1: return 'Шаг 1: Выбор участника'
    case 2: return 'Шаг 2: Выбор товаров'
    case 3: return 'Шаг 3: Подтверждение и оплата'
    default: return 'Создание заказа Health Day'
  }
}

// Search participants
let participantSearchTimeout = null
const searchParticipants = async () => {
  if (participantSearchTimeout) clearTimeout(participantSearchTimeout)
  
  if (!participantSearch.value.trim()) {
    participants.value = []
    return
  }
  
  participantSearchTimeout = setTimeout(async () => {
    loadingParticipants.value = true
    try {
      const response = await api.get('participants/', {
        params: {
          page: 1,
          page_size: 20,
          search: participantSearch.value
        }
      })
      participants.value = response.data.participants || []
    } catch (error) {
      console.error('Ошибка поиска участников:', error)
      participants.value = []
    } finally {
      loadingParticipants.value = false
    }
  }, 300)
}

const selectParticipant = (participant) => {
  selectedParticipant.value = participant
}

const goToStep2 = async () => {
  if (!selectedParticipant.value) return
  step.value = 2
  await loadProducts()
}

const loadProducts = async () => {
  loadingProducts.value = true
  try {
    const response = await store_api.get('products/variants?skip=0&limit=100')
    products.value = response.data.data
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
  } finally {
    loadingProducts.value = false
  }
}

const toggleProduct = (productId) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index === -1) {
    selectedProducts.value.push(productId)
    if (!productQuantities.value[productId]) {
      productQuantities.value[productId] = 1
    }
  } else {
    selectedProducts.value.splice(index, 1)
    delete productQuantities.value[productId]
  }
}

const isProductSelected = (productId) => {
  return selectedProducts.value.includes(productId)
}

const getProductQuantity = (productId) => {
  return productQuantities.value[productId] || 1
}

const updateProductQuantity = (productId, value) => {
  const numValue = value === '' ? 1 : Number(value)
  if (numValue >= 1) {
    productQuantities.value[productId] = numValue
  }
}

const getProductById = (productId) => {
  return products.value.find(p => p.id === productId)
}

const goToStep3 = async () => {
  if (selectedProducts.value.length === 0) return
  step.value = 3
  // Load payment methods if not loaded
  if (paymentMethods.value.length === 0) {
    await loadPaymentMethods()
  }
}

const loadPaymentMethods = async () => {
  loadingPaymentMethods.value = true
  try {
    const response = await api.get('enums/payment-methods?limit=100&offset=0')
    const methods = response.data.filter(m => m.active)
    paymentMethods.value = methods
  } catch (error) {
    console.error('Ошибка загрузки методов оплаты:', error)
  } finally {
    loadingPaymentMethods.value = false
  }
}

// Image handling
const openImageUpload = () => {
  imageModalOpen.value = true
}

const handleImageUploaded = (data) => {
  images.value.push({
    url: data.url,
    alt: data.filename || 'HealthDay order document',
    order: images.value.length,
    content_type: data.content_type,
    filename: data.filename
  })
}

const isImage = (file) => {
  return file.content_type?.startsWith('image/') || 
         file.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
}

const removeImage = (index) => {
  images.value.splice(index, 1)
}

const createOrder = async () => {
  if (!selectedParticipant.value || selectedProducts.value.length === 0 || !selectedPaymentMethodId.value || creatingOrder.value) return
  
  creatingOrder.value = true
  try {
    const payload = {
      participant_id: selectedParticipant.value.id,
      payment_method_id: selectedPaymentMethodId.value,
      items: selectedProducts.value.map(productId => {
        const product = getProductById(productId)
        const quantity = productQuantities.value[productId] || 1
        return {
          variant_id: productId,
          quantity: quantity,
          original_price: Math.round(parseFloat(product?.price || 0))
        }
      }),
      images: images.value.map(img => ({
          url: img.url,
          alt: img.alt,
          order: img.order
      }))
    }
    
    await api.post('health-day/orders', payload)
    
    emit('created')
    emit('close')
  } catch (error) {
    console.error('Ошибка создания заказа Health Day:', error)
    alert(error.response?.data?.detail || 'Ошибка создания заказа')
  } finally {
    creatingOrder.value = false
  }
}

// Reset on close
watch(() => props.visible, (newVal) => {
  if (newVal) {
    step.value = 1
    participantSearch.value = ''
    participants.value = []
    selectedParticipant.value = null
    selectedProducts.value = []
    productQuantities.value = {}
    selectedPaymentMethodId.value = null
    creatingOrder.value = false
    exchangeRate.value = 88
    images.value = []
  }
})
</script>

