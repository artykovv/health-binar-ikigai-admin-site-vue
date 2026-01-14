<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white text-2xl font-bold">Заказы Health Store</h1>
      <button 
        @click="showAddOrderModal = true"
        class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52]"
      >
        Создать заказ
      </button>
    </div>

    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Оплата</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Акция</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сотрудник</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Прим.</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Изображения</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-if="loading">
                <td colspan="9" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка...</td>
              </tr>
              <tr v-else-if="orders.length === 0">
                <td colspan="9" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет заказов</td>
              </tr>
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold">#{{ order.id }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-emerald-600 dark:text-emerald-400">{{ Math.round(order.total_amount).toLocaleString() }} сом</td>
                <td class="px-4 py-3 text-sm">
                  <!-- Single payment method (legacy or single payment) -->
                  <span v-if="!order.payments || order.payments.length === 0" class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400">
                    {{ order.payment_method || '-' }}
                  </span>
                  <!-- Single payment from payments array -->
                  <span v-else-if="order.payments.length === 1" class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-[10px] uppercase font-bold text-gray-600 dark:text-gray-400">
                    {{ order.payments[0].payment_method }}
                  </span>
                  <!-- Multiple payments -->
                  <div v-else class="flex flex-wrap gap-1">
                    <span v-for="payment in order.payments" :key="payment.id" class="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">
                      {{ payment.payment_method }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div v-if="order.sale" class="text-xs font-medium text-green-600 dark:text-green-400">
                    {{ order.sale.name }} ({{ order.sale_percent }}%)
                  </div>
                  <div v-else class="text-xs italic opacity-30">-</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div v-if="order.employee" class="text-xs dark:text-white">
                    {{ order.employee.lastname }} {{ order.employee.name }}
                  </div>
                  <div v-else class="text-xs italic opacity-30 text-gray-400">Не указан</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                   <div v-if="order.description" class="group relative">
                      <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px] cursor-help">
                        {{ order.description }}
                      </div>
                      <!-- Tooltip -->
                      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 min-w-[200px] whitespace-normal">
                        {{ order.description }}
                      </div>
                   </div>
                   <div v-else class="text-xs italic opacity-30 text-gray-400">-</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(order.created_at) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div v-if="order.images && order.images.length > 0" class="flex -space-x-2">
                    <template v-for="(img, idx) in order.images.slice(0, 3)" :key="img.id">
                      <!-- Image -->
                      <img 
                        v-if="!isPdf(img.image_path)"
                        :src="img.image_path" 
                        @click.stop="openLightbox(img.image_path)"
                        class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 object-cover cursor-zoom-in hover:z-10 bg-white"
                      />
                      <!-- PDF Icon -->
                      <a 
                        v-else
                        :href="img.image_path"
                        target="_blank"
                        @click.stop
                        class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 bg-red-50 hover:bg-red-100 flex items-center justify-center hover:z-10 transition-colors"
                        title="Открыть PDF"
                      >
                        <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                      </a>
                    </template>
                    <div v-if="order.images.length > 3" class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
                      +{{ order.images.length - 3 }}
                    </div>
                  </div>
                  <span v-else class="text-xs text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button @click="viewOrder(order)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium">Подробнее</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="selectedOrder = null"></div>
        <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-2xl w-full p-6" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Заказ #{{ selectedOrder.id }}</h3>
            <button @click="selectedOrder = null" class="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          
          <div class="space-y-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Дата:</span>
              <span class="dark:text-white">{{ formatDate(selectedOrder.created_at) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm font-bold border-t pt-2 mt-2">
              <span class="text-gray-500">Итого:</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ Math.round(selectedOrder.total_amount).toLocaleString() }} сом</span>
            </div>

            <div v-if="selectedOrder.payments?.length > 0 || selectedOrder.sale || selectedOrder.employee || selectedOrder.payment_method" class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
              <!-- Multiple Payments -->
              <div v-if="selectedOrder.payments?.length > 0" class="border-b dark:border-gray-700 pb-2">
                <div class="text-xs font-bold text-gray-500 uppercase mb-2">Способы оплаты:</div>
                <div class="space-y-1">
                  <div v-for="payment in selectedOrder.payments" :key="payment.id" class="flex justify-between text-xs">
                    <span class="font-bold uppercase text-gray-700 dark:text-gray-300">{{ payment.payment_method }}:</span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ Math.round(payment.amount).toLocaleString() }} сом</span>
                  </div>
                </div>
              </div>
              <!-- Legacy single payment method -->
              <div v-else-if="selectedOrder.payment_method" class="flex justify-between text-xs border-b dark:border-gray-700 pb-2 border-dashed">
                <span class="text-gray-500">Способ оплаты:</span>
                <span class="dark:text-white font-bold uppercase">{{ selectedOrder.payment_method }}</span>
              </div>
              <div v-if="selectedOrder.sale" class="flex justify-between text-xs">
                <span class="text-gray-500">Акция:</span>
                <span class="text-green-600 dark:text-green-400 font-medium">{{ selectedOrder.sale.name }} ({{ selectedOrder.sale_percent }}%)</span>
              </div>
              <div v-if="selectedOrder.employee" class="flex justify-between text-xs">
                <span class="text-gray-500">Сотрудник:</span>
                <span class="dark:text-white font-medium">{{ selectedOrder.employee.lastname }} {{ selectedOrder.employee.name }}</span>
              </div>
            </div>
            
            <div v-if="selectedOrder.description" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
               <h4 class="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase mb-1">Примечание:</h4>
               <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ selectedOrder.description }}</p>
            </div>

            <div class="mt-4">
              <h4 class="text-sm font-semibold mb-2 dark:text-white">Товары:</h4>
              <div class="border rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Товар</th>
                      <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Кол-во</th>
                      <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Выдано</th>
                      <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Цена</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="item in selectedOrder.items" :key="item.id">
                      <td class="px-3 py-2 text-sm dark:text-white font-medium">{{ getVariantName(item.variant_id) }}</td>
                      <td class="px-3 py-2 text-sm text-right dark:text-white">{{ item.quantity }} шт</td>
                      <td class="px-3 py-2 text-sm text-right">
                        <span 
                          :class="{
                            'text-green-600 font-bold': item.issued_quantity >= item.quantity,
                            'text-yellow-600': (item.issued_quantity || 0) < item.quantity && (item.issued_quantity || 0) > 0,
                            'text-gray-400': !item.issued_quantity
                          }"
                        >
                          {{ item.issued_quantity || 0 }} / {{ item.quantity }}
                        </span>
                      </td>
                      <td class="px-3 py-2 text-sm text-right">
                        <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ Math.round(item.price).toLocaleString() }} сом</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="mt-4" v-if="selectedOrder.images && selectedOrder.images.length > 0">
              <h4 class="text-sm font-semibold mb-2 dark:text-white">Изображения:</h4>
              <div class="flex flex-wrap gap-2">
                <template v-for="img in selectedOrder.images" :key="img.id">
                  <!-- Image -->
                  <img 
                    v-if="!isPdf(img.image_path)"
                    :src="img.image_path" 
                    @click="openLightbox(img.image_path)"
                    class="w-20 h-20 rounded-lg border border-gray-200 dark:border-gray-700 object-cover cursor-zoom-in hover:opacity-90 transition-opacity bg-white"
                  />
                  <!-- PDF -->
                  <a 
                    v-else
                    :href="img.image_path"
                    target="_blank"
                    class="w-20 h-20 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg class="w-8 h-8 text-red-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    <span class="text-[8px] text-gray-500 uppercase font-bold">PDF</span>
                  </a>
                </template>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-2">
            <button 
              v-if="itemsToIssue.length > 0"
              @click="showIssueModal = true"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            >
              Выдать товары
            </button>
            <button @click="selectedOrder = null" class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-white">Закрыть</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Issue Items Modal -->
    <IssueItemsModal
      v-if="selectedOrder"
      :visible="showIssueModal"
      :items="itemsToIssue"
      :order-id="selectedOrder.id"
      :order-number="String(selectedOrder.id)"
      source-type="health-store"
      :total-price="totalPriceForIssue"
      @close="showIssueModal = false"
      @success="handleIssueSuccess"
      @error="handleIssueError"
    />

    <!-- Add Order Modal -->
    <AddOrderModal 
      :visible="showAddOrderModal"
      @close="showAddOrderModal = false"
      @created="handleOrderCreated"
    />
    
    <!-- Lightbox -->
    <div v-if="lightboxImage" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90" @click="lightboxImage = null">
      <button class="absolute top-4 right-4 text-white text-4xl leading-none">&times;</button>
      <img :src="lightboxImage" class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { store_api, health_store } from '@/api'
import { formatUSD, toSOM } from '@/utils/currency'
import AddOrderModal from './AddOrderModal.vue'
import IssueItemsModal from '@/components/IssueItemsModal.vue'

const loading = ref(false)
const orders = ref([])
const selectedOrder = ref(null)
const showAddOrderModal = ref(false)
const productVariants = ref([])
const lightboxImage = ref(null)

// Issue Items Modal State
const showIssueModal = ref(false)
const itemsToIssue = computed(() => {
  if (!selectedOrder.value || !selectedOrder.value.items) return []
  return selectedOrder.value.items.map(item => {
    const remaining = item.quantity - (item.issued_quantity || 0)
    if (remaining <= 0) return null
    return {
      variant_id: item.variant_id,
      quantity: remaining,
      itemId: item.id // Keep track for updating later
    }
  }).filter(item => item !== null)
})

const totalPriceForIssue = computed(() => {
  if (!selectedOrder.value) return 0
  return selectedOrder.value.total_amount
})

const openLightbox = (url) => {
  lightboxImage.value = url
}

const isPdf = (url) => {
  return url?.toLowerCase().endsWith('.pdf')
}

const fetchInitialData = async () => {
  try {
    const res = await store_api.get('/products/variants', { params: { is_healthstore: true, limit: 100 } })
    productVariants.value = res.data.data || []
  } catch (e) { console.error(e) }
}

const getVariantName = (id) => {
  if (!Array.isArray(productVariants.value)) return `ID: ${id}`
  const v = productVariants.value.find(v => v.id === id)
  return v ? v.full_name : `ID: ${id}`
}

const handleOrderCreated = () => {
  showAddOrderModal.value = false
  fetchOrders()
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await health_store.get('/orders/')
    orders.value = res.data
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const viewOrder = async (order) => {
  try {
    const res = await health_store.get(`/orders/${order.id}`)
    selectedOrder.value = res.data
  } catch (e) { console.error(e) }
}

const formatDate = (d) => d ? new Date(d).toLocaleString() : '-'

// Handle Issue Success
const handleIssueSuccess = async (response) => {
  console.log('Items issued successfully:', response)
  
  const issuedItems = response.issued_items || []
  const issuedQuantities = {} // Map variant_id to quantity
  
  issuedItems.forEach(item => {
    issuedQuantities[item.variant_id] = item.quantity
  })
  
  // Update issued_quantity in health_store API for each item
  for (const item of selectedOrder.value.items) {
    const qty = issuedQuantities[item.variant_id]
    if (qty) {
      try {
        await health_store.patch(`/orders/${item.id}/issue?order_id=${selectedOrder.value.id}`, {
          quantity: qty
        })
        
        // Update local state
        item.issued_quantity = (item.issued_quantity || 0) + qty
      } catch (e) {
        console.error(`Failed to update issue status for item ${item.id}`, e)
      }
    }
  }
  
  // Close modal
  showIssueModal.value = false
}

const handleIssueError = (error) => {
  console.error('Issue error:', error)
}

onMounted(() => {
  fetchOrders()
  fetchInitialData()
})
</script>
