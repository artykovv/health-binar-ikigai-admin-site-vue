<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="handleClose"></div>
    <div class="flex gap-2 items-start justify-center w-full px-4">
      <div 
        class="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300"
        :class="{ 'max-w-2xl': detailsVisible }"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-[#3f3f47]">
          <h5 class="m-0 dark:text-white">Заказ #{{ orderDetail?.id }}</h5>
          <button @click="handleClose" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-[#4a4a52]">✕</button>
        </div>
        <div class="p-4">
          <div v-if="loading" class="text-center py-8">
            <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
          </div>
          <div v-else-if="orderDetail">
            <!-- Items Table -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold dark:text-white">Товары</h3>
                <div v-if="selectedItems.length > 0" class="flex items-center gap-2">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Выбрано: {{ selectedItems.length }}</span>
                  <button
                    @click="openWarehouseModal"
                    class="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                  >
                    Выдать выбранные
                  </button>
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">
                        <input
                          type="checkbox"
                          :checked="allItemsSelected"
                          @change="toggleSelectAll"
                          class="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                      </th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID варианта</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цена</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Количество</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Выдано</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                    <tr v-if="!orderDetail.items || orderDetail.items.length === 0">
                      <td colspan="8" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Нет товаров
                      </td>
                    </tr>
                    <tr 
                      v-for="item in orderDetail.items" 
                      :key="item.id"
                      class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]"
                    >
                      <td class="px-4 py-2 whitespace-nowrap" @click.stop>
                        <input
                          type="checkbox"
                          :checked="isItemSelected(item.id)"
                          @change="toggleItemSelection(item.id)"
                          class="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.variant_id }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {{ getVariantName(item.variant_id) }}
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ item.price }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.quantity }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.issued_quantity || 0 }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ (item.price * item.quantity).toFixed(2) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm" @click.stop>
                        <button
                          v-if="(item.issued_quantity || 0) < item.quantity"
                          @click="handleIssueSingleItem(item.id)"
                          class="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                        >
                          Выдать
                        </button>
                        <span v-else class="text-xs text-gray-500 dark:text-gray-400"></span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Order Summary Info -->
            <div class="flex items-center justify-between gap-4 py-4 border-t dark:border-gray-700">
              <div class="text-sm dark:text-white">
                <span class="text-gray-600 dark:text-gray-400">Дата создания:</span>
                <span class="font-semibold ml-2">{{ formatDate(orderDetail.created_at) }}</span>
              </div>
              <div class="text-sm dark:text-white">
                <span class="text-gray-600 dark:text-gray-400">Общая сумма:</span>
                <span class="font-semibold ml-2">${{ orderDetail.total_amount }}</span>
              </div>
              <div v-if="totalExtraPaymentAmount > 0" class="text-sm dark:text-white">
                <span class="text-gray-600 dark:text-gray-400">Доплата:</span>
                <span class="font-semibold ml-2">${{ totalExtraPaymentAmount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <a :href="`/binar/orders/${orderDetail?.id}/print-act`" target="_blank" class="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Печать АКТ
          </a>
          <button @click="handleOpenDetails" class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">Детали</button>
          <button @click="handleClose" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Закрыть</button>
        </div>
      </div>
      
      <!-- Order Details Modal Component -->
      <OrderDetailsModal
        v-if="detailsVisible"
        :visible="detailsVisible"
        :order-id="orderDetail?.id"
        @close="detailsVisible = false"
      />
      
      <!-- Issue Items Modal -->
      <IssueItemsModal
        :visible="issueModalVisible"
        :items="itemsToIssue"
        :order-id="orderDetail?.id || 0"
        :order-number="String(orderDetail?.id || '')"
        :source-type="'mlm'"
        :total-price="totalPriceForIssue"
        @close="closeIssueModal"
        @success="handleIssueSuccess"
        @error="handleIssueError"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { api } from '@/api'
import { store_api } from '@/api'
import OrderDetailsModal from './OrderDetailsModal.vue'
import IssueItemsModal from './IssueItemsModal.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['close'])

const orderDetail = ref(null)
const loading = ref(false)
const variantsMap = ref({})
const extraPayments = ref([])
const detailsVisible = ref(false)
const selectedItems = ref([]) // Массив ID выбранных товаров

// Issue modal state
const issueModalVisible = ref(false)

// Computed: items to issue
const itemsToIssue = computed(() => {
  if (!orderDetail.value || !selectedItems.value.length) return []
  
  return selectedItems.value.map(itemId => {
    const item = orderDetail.value.items.find(i => i.id === itemId)
    if (!item) return null
    
    const remainingQuantity = item.quantity - (item.issued_quantity || 0)
    return {
      variant_id: item.variant_id,
      quantity: remainingQuantity,
      itemId: item.id // Keep track for updating later
    }
  }).filter(item => item !== null && item.quantity > 0)
})

// Computed: total price for issue
const totalPriceForIssue = computed(() => {
  if (!orderDetail.value || !selectedItems.value.length) return 0
  
  return selectedItems.value.reduce((sum, itemId) => {
    const item = orderDetail.value.items.find(i => i.id === itemId)
    return sum + (item ? item.price * item.quantity : 0)
  }, 0)
})

const totalExtraPaymentAmount = computed(() => {
  return extraPayments.value.reduce((sum, payment) => {
    return sum + parseFloat(payment.amount || 0)
  }, 0)
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getVariantName = (variantId) => {
  return variantsMap.value[variantId] || `Вариант ${variantId}`
}

// Проверка, выбраны ли все товары
const allItemsSelected = computed(() => {
  if (!orderDetail.value || !orderDetail.value.items || orderDetail.value.items.length === 0) {
    return false
  }
  return orderDetail.value.items.every(item => selectedItems.value.includes(item.id))
})

// Проверка, выбран ли конкретный товар
const isItemSelected = (itemId) => {
  return selectedItems.value.includes(itemId)
}

// Переключение выбора товара
const toggleItemSelection = (itemId) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index === -1) {
    selectedItems.value.push(itemId)
  } else {
    selectedItems.value.splice(index, 1)
  }
}

// Выбрать/снять выбор всех товаров
const toggleSelectAll = () => {
  if (!orderDetail.value || !orderDetail.value.items) return
  
  if (allItemsSelected.value) {
    // Снимаем выбор со всех
    selectedItems.value = []
  } else {
    // Выбираем все
    selectedItems.value = orderDetail.value.items.map(item => item.id)
  }
}

// Open issue modal
const openWarehouseModal = () => {
  if (selectedItems.value.length === 0) {
    alert('Выберите товары для выдачи')
    return
  }
  
  if (itemsToIssue.value.length === 0) {
    alert('Все выбранные товары уже выданы')
    return
  }
  
  issueModalVisible.value = true
}

// Close issue modal
const closeIssueModal = () => {
  issueModalVisible.value = false
}

// Handle successful issue
const handleIssueSuccess = async (response) => {
  console.log('Товары успешно выданы:', response)
  
  // Get issued items from response
  const issuedItems = response.issued_items || []
  
  // Create a map of variant_id to issued quantity
  const issuedQuantities = {}
  issuedItems.forEach(issued => {
    issuedQuantities[issued.variant_id] = issued.quantity
  })
  
  // First request: Update issued quantities in MLM API
  for (const itemId of selectedItems.value) {
    const item = orderDetail.value.items.find(i => i.id === itemId)
    if (!item) continue
    
    // Find the issued quantity for this variant
    const issuedQty = issuedQuantities[item.variant_id] || 0
    if (issuedQty <= 0) continue
    
    try {
      await api.patch(
        `orders/${itemId}/issue?order_id=${orderDetail.value.id}`,
        { quantity: issuedQty }
      )
      
      // Update local state with actual issued quantity
      item.issued_quantity = (item.issued_quantity || 0) + issuedQty
    } catch (error) {
      console.error('Ошибка обновления выданного количества:', error)
    }
  }
  
  // Clear selection
  selectedItems.value = []
  
  alert('Товары успешно выданы!')
}

// Handle issue error
const handleIssueError = (error) => {
  console.error('Ошибка при выдаче товаров:', error)
}

// Выдача одного товара - открываем модальное окно выбора склада
const handleIssueSingleItem = (itemId) => {
  // Выбираем только этот товар
  selectedItems.value = [itemId]
  
  // Проверяем, что товар можно выдать
  if (itemsToIssue.value.length === 0) {
    alert('Товар уже полностью выдан')
    selectedItems.value = []
    return
  }
  
  // Открываем модальное окно
  issueModalVisible.value = true
}

const handleClose = () => {
  emit('close')
}

const handleOpenDetails = () => {
  detailsVisible.value = true
}

const loadOrderDetail = async (orderId) => {
  if (!orderId) return
  
  loading.value = true
  try {
    const [orderResponse, extraPaymentsResponse] = await Promise.all([
      api.get(`orders/${orderId}`),
      api.get(`orders/extra-payment/${orderId}`).catch(() => ({ data: [] }))
    ])
    
    const orderData = Array.isArray(orderResponse.data) ? orderResponse.data[0] : orderResponse.data
    orderDetail.value = orderData
    
    if (Array.isArray(extraPaymentsResponse.data)) {
      extraPayments.value = extraPaymentsResponse.data
    } else if (extraPaymentsResponse.data && extraPaymentsResponse.data.id) {
      extraPayments.value = [extraPaymentsResponse.data]
    } else {
      extraPayments.value = []
    }
    
    if (orderData.items && orderData.items.length > 0) {
      const variantIds = orderData.items.map(item => item.variant_id)
      await loadVariantsNames(variantIds)
    }
  } catch (error) {
    console.error('Ошибка загрузки деталей заказа:', error)
    extraPayments.value = []
  } finally {
    loading.value = false
  }
}

const loadVariantsNames = async (variantIds) => {
  try {
    const response = await store_api.get('products/variants?skip=0&limit=1000')
    const variants = response.data
    const map = {}
    variants.forEach(variant => {
      if (variantIds.includes(variant.id)) {
        map[variant.id] = variant.full_name || variant.variant_name || `Вариант ${variant.id}`
      }
    })
    variantsMap.value = { ...variantsMap.value, ...map }
  } catch (error) {
    console.error('Ошибка загрузки вариантов товаров:', error)
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal && props.orderId) {
    loadOrderDetail(props.orderId)
    detailsVisible.value = false
    selectedItems.value = []
  } else if (!newVal) {
    orderDetail.value = null
    extraPayments.value = []
    variantsMap.value = {}
    detailsVisible.value = false
    selectedItems.value = []
  }
})

watch(() => props.orderId, (newId) => {
  if (props.visible && newId) {
    selectedItems.value = []
    loadOrderDetail(newId)
  }
})
</script>


