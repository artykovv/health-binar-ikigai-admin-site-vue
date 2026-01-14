<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-start justify-center w-full px-4 py-4">
    <div class="absolute inset-0 bg-black/40" @click="handleClose"></div>
    <div class="flex gap-2 items-start justify-center w-full">
      <div 
        class="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300"
        :class="{ 'max-w-2xl': detailsVisible }"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-[#3f3f47]">
          <h5 class="m-0 dark:text-white">Заказ Health Day #{{ orderDetail?.id }}</h5>
          <button @click="handleClose" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-[#4a4a52]">✕</button>
        </div>
      <div class="p-4">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-8">
          <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>

        <!-- Order Details -->
        <div v-else-if="orderDetail" class="space-y-4">
          <!-- Participant Info -->
          <div v-if="orderDetail.participant" class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Участник</p>
            <p class="text-sm text-blue-700 dark:text-blue-300 font-semibold">
              {{ orderDetail.participant.name }} {{ orderDetail.participant.lastname }} {{ orderDetail.participant.patronymic }}
            </p>
            <p class="text-sm text-blue-700 dark:text-blue-300">{{ orderDetail.participant.personal_number }}</p>
          </div>

          <!-- Order Info -->
          <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-[#4a4a52] rounded-lg border border-gray-200 dark:border-gray-600">
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Филиал</p>
              <p class="text-sm font-bold text-gray-900 dark:text-white">{{ orderDetail.branch?.name || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Способ оплаты</p>
              <p class="text-sm font-bold text-gray-900 dark:text-white">{{ orderDetail.payment_method?.name || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Статус</p>
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': orderDetail.status === 'paid',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': orderDetail.status === 'pending',
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': orderDetail.status === 'cancelled'
                }"
              >
                {{ getStatusName(orderDetail.status) }}
              </span>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Дата создания</p>
              <p class="text-sm font-bold text-gray-900 dark:text-white">{{ formatDate(orderDetail.created_at) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Общая сумма (сом)</p>
              <p class="text-sm font-bold text-gray-900 dark:text-white">{{ Math.round(orderDetail.total_amount).toLocaleString() }} сом</p>
            </div>

          </div>

          <!-- Images -->
          <div v-if="orderDetail.images && orderDetail.images.length > 0" class="p-4 bg-gray-50 dark:bg-[#4a4a52] rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Изображения</h3>
            <div class="flex flex-wrap gap-2">
              <img 
                v-for="img in orderDetail.images" 
                :key="img.url" 
                :src="img.url" 
                :alt="img.alt"
                class="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                @click="openImagePreview(img.url)"
              >
            </div>
          </div>


          <!-- Items Table -->
          <div>
            <h3 class="text-lg font-semibold mb-3 dark:text-white">Товары</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Оригинальная цена</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цена со скидкой</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Количество</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Выдано</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                    <!-- <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th> -->
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr
                    v-for="item in orderDetail.items"
                    :key="item.id"
                    class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]"
                  >
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.id }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ getVariantName(item.variant_id) }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span class="line-through text-gray-400 dark:text-gray-500">{{ Math.round(item.original_price).toLocaleString() }} сом</span>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span class="font-semibold text-green-600 dark:text-green-400">{{ Math.round(item.discounted_price).toLocaleString() }} сом</span>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.quantity }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">
                      <span 
                        :class="{
                          'text-green-600 font-bold': (item.issued_quantity || 0) >= item.quantity,
                          'text-yellow-600': (item.issued_quantity || 0) < item.quantity && (item.issued_quantity || 0) > 0,
                          'text-gray-400': !(item.issued_quantity || 0)
                        }"
                      >
                        {{ item.issued_quantity || 0 }} / {{ item.quantity }}
                      </span>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <span class="font-semibold">{{ Math.round(item.subtotal).toLocaleString() }} сом</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
        <button 
          v-if="itemsToIssue.length > 0"
          @click="showIssueModal = true"
          class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
        >
          Выдать товары
        </button>
        <a :href="`/binar/orders/${orderDetail?.id}/print-act?type=healthday`" target="_blank" class="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-700">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Печать АКТ
        </a>
        <button @click="handleOpenDetails" class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">Детали</button>
        <button @click="handleClose" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Закрыть</button>
      </div>
    </div>
      
      <!-- TODO надо поработать -->
      <!-- Health Day Order Details Modal Component
      <HealthDayOrderDetailsModal
        v-if="detailsVisible"
        :visible="detailsVisible"
        :order-id="props.orderId || orderDetail?.id"
        @close="detailsVisible = false"
      /> -->

      <!-- Issue Items Modal -->
      <IssueItemsModal
        v-if="orderDetail"
        :visible="showIssueModal"
        :items="itemsToIssue"
        :order-id="orderDetail.id"
        :order-number="String(orderDetail.id)"
        source-type="health-day"
        :total-price="totalPriceForIssue"
        @close="showIssueModal = false"
        @success="handleIssueSuccess"
        @error="handleIssueError"
      />
    </div>

    <!-- Image Preview (Simple implementation inside modal) -->
    <div v-if="previewImage" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" @click="previewImage = null">
      <button class="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <img :src="previewImage" class="max-w-full max-h-full object-contain" @click.stop>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { api, store_api } from '@/api'
import HealthDayOrderDetailsModal from './HealthDayOrderDetailsModal.vue'
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
const detailsVisible = ref(false)
// const editingIssuedQuantity = ref(null)
// const editingIssuedQuantityValue = ref(0)
const variantsMap = ref({})
const previewImage = ref(null)

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

const getStatusName = (status) => {
  const statusMap = {
    'paid': 'Оплачен',
    'pending': 'Ожидание',
    'cancelled': 'Отменен'
  }
  return statusMap[status] || status
}

const getVariantName = (variantId) => {
  return variantsMap.value[variantId] || `Вариант ${variantId}`
}

const handleClose = () => {
  detailsVisible.value = false
  emit('close')
}

const handleOpenDetails = () => {
  console.log('Открытие модального окна деталей, orderId:', props.orderId)
  detailsVisible.value = true
}

const loadOrderDetail = async (orderId) => {
  if (!orderId) return
  
  loading.value = true
  try {
    const response = await api.get(`health-day/orders/${orderId}`)
    orderDetail.value = response.data
    
    // Загружаем названия вариантов товаров
    if (response.data.items && response.data.items.length > 0) {
      const variantIds = response.data.items.map(item => item.variant_id)
      await loadVariantsNames(variantIds)
    }
  } catch (error) {
    console.error('Ошибка загрузки деталей заказа Health Day:', error)
    orderDetail.value = null
  } finally {
    loading.value = false
  }
}

const loadVariantsNames = async (variantIds) => {
  try {
    const response = await store_api.post('variants/names', { ids: variantIds })
    const variants = response.data
    const map = {}
    variants.forEach(variant => {
      map[variant.id] = variant.name || `Вариант ${variant.id}`
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
    // editingIssuedQuantity.value = null
    // editingIssuedQuantityValue.value = 0
  } else if (!newVal) {
    orderDetail.value = null
    detailsVisible.value = false
    // editingIssuedQuantity.value = null
    // editingIssuedQuantityValue.value = 0
    variantsMap.value = {}
  }
})

watch(() => props.orderId, (newId) => {
  if (props.visible && newId) {
    loadOrderDetail(newId)
  }
})

const openImagePreview = (url) => {
  previewImage.value = url
}

// === ISSUE ITEMS LOGIC ===
const showIssueModal = ref(false)

const itemsToIssue = computed(() => {
  if (!orderDetail.value || !orderDetail.value.items) return []
  return orderDetail.value.items.map(item => {
    const remaining = item.quantity - (item.issued_quantity || 0)
    if (remaining <= 0) return null
    return {
      variant_id: item.variant_id,
      quantity: remaining,
      maxQuantity: remaining, // important for validation
      itemId: item.id
    }
  }).filter(item => item !== null)
})

const totalPriceForIssue = computed(() => {
  return orderDetail.value ? Number(orderDetail.value.total_amount) : 0
})

const handleIssueSuccess = async (response) => {
  console.log('Items issued successfully:', response)
  const issuedItems = response.issued_items || []
  const issuedQuantities = {} // Map variant_id to quantity
  
  issuedItems.forEach(item => {
    issuedQuantities[item.variant_id] = item.quantity
  })
  
  // Update issued_quantity in health-day API for each item
  for (const item of orderDetail.value.items) {
    const qty = issuedQuantities[item.variant_id]
    if (qty) {
      try {
        await api.patch(`health-day/${item.id}/issue`, {
          quantity: qty
        })
        
        // Update local state
        item.issued_quantity = (item.issued_quantity || 0) + qty
        
        // Update order status locally if needed
        // (Logic is duplicated from backend, but good for UI responsiveness)
        const allDelivered = orderDetail.value.items.every(
          i => (i.issued_quantity || 0) >= i.quantity
        )
        if (allDelivered) {
          orderDetail.value.status = 'delivered'
        } else {
          orderDetail.value.status = 'issued'
        }
        
      } catch (e) {
        console.error(`Failed to update issue status for item ${item.id}`, e)
      }
    }
  }
  
  showIssueModal.value = false
}

const handleIssueError = (error) => {
  console.error('Issue error:', error)
}
</script>

