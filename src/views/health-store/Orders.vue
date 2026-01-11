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
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">USD</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">СОМ</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Оплата</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Акция</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сотрудник</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Изображения</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-if="loading">
                <td colspan="8" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка...</td>
              </tr>
              <tr v-else-if="orders.length === 0">
                <td colspan="8" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет заказов</td>
              </tr>
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold">#{{ order.id }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-blue-600 dark:text-blue-400">{{ formatUSD(order.total_amount) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-emerald-600 dark:text-emerald-400">{{ toSOM(order.total_amount).toLocaleString() }}</td>
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
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(order.created_at) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div v-if="order.images && order.images.length > 0" class="flex -space-x-2">
                    <img 
                      v-for="(img, idx) in order.images.slice(0, 3)" 
                      :key="img.id"
                      :src="img.image_path" 
                      @click.stop="openLightbox(img.image_path)"
                      class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 object-cover cursor-zoom-in hover:z-10"
                    />
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
              <div class="flex gap-3">
                <span class="text-blue-600 dark:text-blue-400 font-bold">{{ formatUSD(selectedOrder.total_amount) }}</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ toSOM(selectedOrder.total_amount).toLocaleString() }}</span>
              </div>
            </div>

            <div v-if="selectedOrder.payments?.length > 0 || selectedOrder.sale || selectedOrder.employee || selectedOrder.payment_method" class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
              <!-- Multiple Payments -->
              <div v-if="selectedOrder.payments?.length > 0" class="border-b dark:border-gray-700 pb-2">
                <div class="text-xs font-bold text-gray-500 uppercase mb-2">Способы оплаты:</div>
                <div class="space-y-1">
                  <div v-for="payment in selectedOrder.payments" :key="payment.id" class="flex justify-between text-xs">
                    <span class="font-bold uppercase text-gray-700 dark:text-gray-300">{{ payment.payment_method }}:</span>
                    <div class="flex gap-2 font-bold">
                      <span class="text-blue-600 dark:text-blue-400">{{ formatUSD(payment.amount) }}</span>
                      <span class="text-emerald-600 dark:text-emerald-400">{{ toSOM(payment.amount).toLocaleString() }}</span>
                    </div>
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

            <div class="mt-4">
              <h4 class="text-sm font-semibold mb-2 dark:text-white">Товары:</h4>
              <div class="border rounded-lg overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Товар</th>
                      <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Кол-во</th>
                      <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Цена</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="item in selectedOrder.items" :key="item.id">
                      <td class="px-3 py-2 text-sm dark:text-white font-medium">{{ getVariantName(item.variant_id) }}</td>
                      <td class="px-3 py-2 text-sm text-right dark:text-white">{{ item.quantity }} шт</td>
                      <td class="px-3 py-2 text-sm text-right">
                        <div class="flex flex-col">
                          <span class="text-blue-600 dark:text-blue-400 font-bold text-xs">{{ formatUSD(item.price) }}</span>
                          <span class="text-emerald-600 dark:text-emerald-400 text-[10px]">{{ toSOM(item.price).toLocaleString() }}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="mt-4" v-if="selectedOrder.images && selectedOrder.images.length > 0">
              <h4 class="text-sm font-semibold mb-2 dark:text-white">Изображения:</h4>
              <div class="flex flex-wrap gap-2">
                <img 
                  v-for="img in selectedOrder.images" 
                  :key="img.id"
                  :src="img.image_path" 
                  @click="openLightbox(img.image_path)"
                  class="w-20 h-20 rounded-lg border border-gray-200 dark:border-gray-700 object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                />
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button @click="selectedOrder = null" class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-white">Закрыть</button>
          </div>
        </div>
      </div>
    </div>

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
import { ref, onMounted } from 'vue'
import { store_api, health_store } from '@/api'
import { formatUSD, toSOM } from '@/utils/currency'
import AddOrderModal from './AddOrderModal.vue'

const loading = ref(false)
const orders = ref([])
const selectedOrder = ref(null)
const showAddOrderModal = ref(false)
const productVariants = ref([])
const lightboxImage = ref(null)

const openLightbox = (url) => {
  lightboxImage.value = url
}

const fetchInitialData = async () => {
  try {
    const res = await store_api.get('/products/variants', { params: { is_healthstore: true, limit: 100 } })
    productVariants.value = res.data
  } catch (e) { console.error(e) }
}

const getVariantName = (id) => {
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

onMounted(() => {
  fetchOrders()
  fetchInitialData()
})
</script>
