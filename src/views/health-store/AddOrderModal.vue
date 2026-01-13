<template>
  <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/40 transition-opacity" @click="$emit('close')"></div>
      
      <div class="relative bg-white dark:bg-[#3f3f47] rounded-[20px] shadow-xl max-w-7xl w-full p-6 animate-in fade-in zoom-in duration-200" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Новый заказ Health Store</h3>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left: Product Selection -->
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Выберите товары</label>
              <div class="relative">
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Поиск товара..." 
                  class="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                >
              </div>
              
              <div class="mt-4 max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                <div v-if="loadingProducts" class="text-center py-4 text-gray-500">Загрузка товаров...</div>
                <div 
                  v-for="variant in filteredVariants" 
                  :key="variant.id"
                  class="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div class="flex-1">
                    <div class="text-sm font-semibold dark:text-white">{{ variant.full_name }}</div>
                    <div class="flex items-center gap-4 mt-1">
                      <div class="flex gap-2 text-sm font-bold">
                        <span class="text-blue-600 dark:text-blue-400">{{ formatUSD(variant.price) }}</span>
                        <span class="text-emerald-600 dark:text-emerald-400">{{ toSOM(variant.price).toLocaleString() }} сом</span>
                      </div>
                      <div class="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        Склад: {{ variant.stock }} шт
                      </div>
                    </div>
                  </div>
                  <button 
                    @click="addToCart(variant)"
                    class="ml-4 p-2 rounded-lg bg-gray-900 text-white hover:bg-black dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Cart and Order Info -->
          <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-800/50 rounded-[20px] p-6 border border-gray-100 dark:border-gray-700">
            <h4 class="text-lg font-bold mb-4 dark:text-white">Корзина</h4>
            
            <div class="flex-1 space-y-4 overflow-y-auto mb-6 pr-2 custom-scrollbar">
              <div v-if="cart.length === 0" class="text-center py-8 text-gray-500 italic">Корзина пуста</div>
              <div 
                v-for="item in cart" 
                :key="item.id"
                class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm"
              >
                <div class="flex-1 min-w-0 mr-3">
                  <div class="text-xs font-bold truncate dark:text-white">{{ item.full_name }}</div>
                  <div class="flex flex-col mt-0.5">
                    <div class="flex gap-2 text-[10px] text-gray-400 line-through" v-if="totalDiscountPercent > 0">
                      <span>{{ formatUSD(item.price) }}</span>
                      <span>{{ toSOM(item.price).toLocaleString() }}</span>
                    </div>
                    <div class="flex gap-2 text-xs font-bold">
                      <span class="text-blue-600 dark:text-blue-400">{{ formatUSD(calculateDiscountedPrice(item.price)) }}</span>
                      <span class="text-emerald-600 dark:text-emerald-400">{{ toSOM(calculateDiscountedPrice(item.price)).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-2">
                  <button @click="updateQty(item, -1)" class="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">-</button>
                  <span class="text-sm font-bold w-6 text-center dark:text-white">{{ item.quantity }}</span>
                  <button @click="updateQty(item, 1)" class="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">+</button>
                  <button @click="removeFromCart(item)" class="ml-2 text-red-500 hover:text-red-700">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Settings (Sale, Employee, Payment) -->
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Выберите акцию</label>
                  <select v-model="selectedSaleId" class="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    <option :value="null">Без акции</option>
                    <option v-for="sale in sales" :key="sale.id" :value="sale.id">
                      {{ sale.name }} ({{ sale.sale }}%)
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Выберите сотрудника</label>
                  <select v-model="selectedEmployeeId" class="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    <option :value="null">Не выбрано</option>
                    <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                      {{ emp.lastname }} {{ emp.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Способы оплаты</label>
                  
                  <!-- Added Payments List -->
                  <div v-if="payments.length > 0" class="space-y-2 mb-3">
                    <div v-for="(payment, index) in payments" :key="index" class="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                      <span class="text-xs font-bold dark:text-white flex-1">{{ payment.payment_method }}</span>
                      <div class="flex gap-1 text-[10px] font-bold">
                        <span class="text-blue-600">{{ formatUSD(payment.amount) }}</span>
                        <span class="text-emerald-600">{{ toSOM(payment.amount).toLocaleString() }}</span>
                      </div>
                      <button @click="removePayment(index)" class="text-red-500 hover:text-red-700">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Images Section -->
                  <div class="space-y-2 mb-4">
                    <label class="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Изображения (Чеки)</label>
                    <div class="flex flex-wrap gap-2 mb-2">
                      <div v-for="(img, idx) in images" :key="idx" class="relative group">
                        <img :src="img.url" class="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600" />
                        <button @click="removeImage(idx)" class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      <button @click="openImageModal" class="w-16 h-16 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 text-gray-400 hover:text-gray-500 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </div>

                  <!-- Add Payment Form -->
                  <div class="space-y-2">
                    <select v-model="newPaymentMethod" class="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">Выбрать способ оплаты...</option>
                      <option v-for="pm in paymentMethods" :key="pm.id" :value="pm.name">
                        {{ pm.name }}
                      </option>
                    </select>
                    <div class="flex gap-2">
                      <div class="flex-1">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">USD</label>
                        <input 
                          v-model.number="newPaymentAmountUSD" 
                          @input="syncFromUSD"
                          type="number" 
                          step="0.01" 
                          min="0"
                          placeholder="0.00"
                          class="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div class="flex-1">
                        <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">СОМ</label>
                        <input 
                          v-model.number="newPaymentAmountSOM" 
                          @input="syncFromSOM"
                          type="number" 
                          step="1" 
                          min="0"
                          placeholder="0"
                          class="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <button 
                        @click="addPayment" 
                        :disabled="!newPaymentMethod || !newPaymentAmountUSD || newPaymentAmountUSD <= 0"
                        class="self-end px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Payment Summary -->
                  <div v-if="payments.length > 0" class="mt-2 text-xs">
                    <div class="flex justify-between" :class="paymentDifference === 0 ? 'text-green-600' : 'text-red-600'">
                      <span>Оплачено:</span>
                      <span class="font-bold">{{ formatUSD(totalPaid) }} / {{ formatUSD(total) }}</span>
                    </div>
                    <div v-if="paymentDifference !== 0" class="text-red-600 font-bold">
                      {{ paymentDifference > 0 ? 'Недостаточно:' : 'Переплата:' }} {{ formatUSD(Math.abs(paymentDifference)) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Description Input -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Примечание к заказу</label>
                <textarea 
                  v-model="description" 
                  rows="2" 
                  class="w-full py-2 px-3 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Дополнительная информация..."
                ></textarea>
              </div>

              <!-- Summary -->
              <div class="space-y-2 pt-4">
                <div class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>Подытог:</span>
                  <div class="flex gap-2 font-bold">
                    <span class="text-blue-600 dark:text-blue-400">{{ formatUSD(subtotal) }}</span>
                    <span class="text-emerald-600 dark:text-emerald-400">{{ toSOM(subtotal).toLocaleString() }}</span>
                  </div>
                </div>
                <div v-if="discountAmount > 0" class="flex justify-between items-center text-sm text-green-600 dark:text-green-400">
                  <span>Скидка ({{ totalDiscountPercent }}%):</span>
                  <div class="flex gap-2 font-bold text-red-500">
                    <span>-{{ formatUSD(discountAmount) }}</span>
                    <span>-{{ toSOM(discountAmount).toLocaleString() }}</span>
                  </div>
                </div>
                <div class="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Итого:</span>
                  <div class="flex gap-3">
                    <span class="text-blue-600 dark:text-blue-400">{{ formatUSD(total) }}</span>
                    <span class="text-emerald-600 dark:text-emerald-400">{{ toSOM(total).toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <button 
                @click="submitOrder"
                :disabled="cart.length === 0 || submitting"
                class="w-full mt-4 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-all transform active:scale-95"
              >
                {{ submitting ? 'Оформление...' : 'Создать заказ' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <!-- Image Upload Modal -->
    <ImageUploadModal
      :is-open="imageModalOpen"
      title="Загрузка изображений"
      directory="health-store-orders"
      :multiple="true"
      @close="imageModalOpen = false"
      @uploaded="handleImageUploaded"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import { health_store, store_api, kassa_api } from '@/api'
import { formatUSD, toSOM, toUSD } from '@/utils/currency'
import ImageUploadModal from '@/components/ImageUploadModal.vue'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['close', 'created'])

// Data
const searchQuery = ref('')
const variants = ref([])
const sales = ref([])
const employees = ref([])
const paymentMethods = ref([])
const cart = ref([])
const loadingProducts = ref(false)
const submitting = ref(false)

const selectedSaleId = ref(null)
const selectedEmployeeId = ref(null)
const payments = ref([])
const newPaymentMethod = ref('')
const newPaymentAmountUSD = ref(null)
const newPaymentAmountSOM = ref(null)

const description = ref('')

const isUpdatingPayment = ref(false) // Flag to prevent circular updates
const images = ref([])
const imageModalOpen = ref(false)

// Computed
const filteredVariants = computed(() => {
  if (!searchQuery.value) return variants.value
  const q = searchQuery.value.toLowerCase()
  return variants.value.filter(v => v.full_name.toLowerCase().includes(q) || v.sku.toLowerCase().includes(q))
})

const currentSale = computed(() => sales.value.find(s => s.id === selectedSaleId.value))
const currentEmployee = computed(() => employees.value.find(e => e.id === selectedEmployeeId.value))

const totalDiscountPercent = computed(() => {
  let percent = 0
  if (currentSale.value) percent += currentSale.value.sale
  // Employee sale excluded for now as requested
  return percent
})

const subtotal = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0))

const discountAmount = computed(() => {
  return subtotal.value * (totalDiscountPercent.value / 100)
})

const total = computed(() => Math.max(0, subtotal.value - discountAmount.value))

const totalPaid = computed(() => payments.value.reduce((sum, p) => sum + p.amount, 0))

const paymentDifference = computed(() => total.value - totalPaid.value)

// Methods
const calculateDiscountedPrice = (price) => {
  return price * (1 - totalDiscountPercent.value / 100)
}

const fetchInitialData = async () => {
  loadingProducts.value = true
  try {
    const [prodRes, saleRes, empRes, kassaRes] = await Promise.all([
      store_api.get('/products/variants', { params: { skip: 0, limit: 100, is_healthstore: true, sort_order: 'asc' } }),
      health_store.get('/sales/'),
      health_store.get('/employees/'),
      kassa_api.get('/payment-methods/', { params: { only_active: true } })
    ])
    variants.value = prodRes.data
    sales.value = saleRes.data.filter(s => s.active)
    employees.value = empRes.data
    paymentMethods.value = kassaRes.data
  } catch (e) {
    console.error('Error fetching order data:', e)
  } finally {
    loadingProducts.value = false
  }
}

const addToCart = (variant) => {
  const existing = cart.value.find(item => item.id === variant.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({
      ...variant,
      quantity: 1
    })
  }
}

const updateQty = (item, delta) => {
  item.quantity = Math.max(1, item.quantity + delta)
}

const removeFromCart = (item) => {
  cart.value = cart.value.filter(i => i.id !== item.id)
}

const calculateItemPrice = (item) => {
  // We show base price but the total reflects the global discount
  return item.price
}

const addPayment = () => {
  if (!newPaymentMethod.value || !newPaymentAmountUSD.value || newPaymentAmountUSD.value <= 0) return
  
  payments.value.push({
    payment_method: newPaymentMethod.value,
    amount: newPaymentAmountUSD.value
  })
  
  newPaymentMethod.value = ''
  newPaymentAmountUSD.value = null
  newPaymentAmountSOM.value = null
}

const syncFromUSD = () => {
  if (isUpdatingPayment.value) return
  isUpdatingPayment.value = true
  if (newPaymentAmountUSD.value !== null && newPaymentAmountUSD.value !== '') {
    newPaymentAmountSOM.value = toSOM(newPaymentAmountUSD.value)
  } else {
    newPaymentAmountSOM.value = null
  }
  isUpdatingPayment.value = false
}

const syncFromSOM = () => {
  if (isUpdatingPayment.value) return
  isUpdatingPayment.value = true
  if (newPaymentAmountSOM.value !== null && newPaymentAmountSOM.value !== '') {
    newPaymentAmountUSD.value = toUSD(newPaymentAmountSOM.value)
  } else {
    newPaymentAmountUSD.value = null
  }
  isUpdatingPayment.value = false
}

const removePayment = (index) => {
  payments.value.splice(index, 1)
}

const openImageModal = () => {
  imageModalOpen.value = true
}

const handleImageUploaded = (data) => {
  if (Array.isArray(data)) {
    images.value.push(...data)
  } else {
    images.value.push(data)
  }
}

const removeImage = (index) => {
  images.value.splice(index, 1)
}

const submitOrder = async () => {
  // Validate payments
  if (payments.value.length === 0) {
    alert('Добавьте хотя бы один способ оплаты')
    return
  }
  
  if (Math.abs(paymentDifference.value) > 0.01) {
    alert('Сумма оплат должна равняться итоговой сумме заказа')
    return
  }
  
  submitting.value = true
  try {
    const orderData = {
      total_amount: total.value,
      sale_id: selectedSaleId.value,
      employee_id: selectedEmployeeId.value,
      sale_percent: totalDiscountPercent.value,
      payment_method: null, // Deprecated field
      payments: payments.value,
      images: images.value.map(img => ({ image_path: img.url })),
      description: description.value,
      items: cart.value.map(item => ({
        variant_id: item.id,
        quantity: item.quantity,
        price: calculateDiscountedPrice(item.price),
        issued_quantity: item.quantity
      }))
    }
    
    await health_store.post('/orders/', orderData)
    emit('created')
    cart.value = []
    selectedSaleId.value = null
    selectedEmployeeId.value = null

    payments.value = []
    images.value = []
    description.value = ''
    newPaymentMethod.value = ''
    newPaymentAmountUSD.value = null
    newPaymentAmountSOM.value = null
  } catch (e) {
    alert('Ошибка при создании заказа')
    console.error(e)
  } finally {
    submitting.value = false
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal && variants.value.length === 0) {
    fetchInitialData()
  }
})

onMounted(() => {
  if (props.visible) fetchInitialData()
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
