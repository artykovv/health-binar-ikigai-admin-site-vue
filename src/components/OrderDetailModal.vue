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
                    @click="handleIssueSelected"
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
                      <td class="px-4 py-2 whitespace-nowrap text-sm" @click.stop>
                        <div v-if="editingIssuedQuantity === item.id" class="flex items-center gap-2">
                          <input
                            ref="issuedQuantityInput"
                            type="number"
                            v-model.number="editingIssuedQuantityValue"
                            :max="item.quantity"
                            :min="0"
                            @input="validateIssuedQuantity(item.quantity)"
                            @keyup.enter="saveIssuedQuantity(item.id)"
                            @keyup.esc="cancelEditIssuedQuantity"
                            class="issued-quantity-input w-20 rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#4a4a52] dark:border-gray-600 dark:text-white dark:focus:ring-white"
                          />
                          <button
                            @click="saveIssuedQuantity(item.id)"
                            class="inline-flex items-center rounded-md bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                          >
                            ✓
                          </button>
                          <button
                            @click="cancelEditIssuedQuantity"
                            class="inline-flex items-center rounded-md bg-gray-600 px-2 py-1 text-xs text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800"
                          >
                            ✕
                          </button>
                        </div>
                        <span v-else class="text-gray-900 dark:text-white">{{ item.issued_quantity || 0 }}</span>
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ (item.price * item.quantity).toFixed(2) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm" @click.stop>
                        <button
                          v-if="editingIssuedQuantity !== item.id && (item.issued_quantity || 0) < item.quantity"
                          @click="handleIssueItem(item.id)"
                          class="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                        >
                          Выдать
                        </button>
                        <span v-else-if="editingIssuedQuantity === item.id" class="text-xs text-gray-500 dark:text-gray-400">Редактирование...</span>
                        <span v-else-if="(item.issued_quantity || 0) >= item.quantity" class="text-xs text-gray-500 dark:text-gray-400"></span>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { api } from '@/api'
import { store_api } from '@/api'
import OrderDetailsModal from './OrderDetailsModal.vue'

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
const editingIssuedQuantity = ref(null) // ID товара, который редактируется
const editingIssuedQuantityValue = ref(0) // Временное значение выданного количества
const issuedQuantityInput = ref(null) // Ref для input выданного количества

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

// Выдача одного товара - начинаем редактирование
const handleIssueItem = (itemId) => {
  const item = orderDetail.value.items.find(i => i.id === itemId)
  if (!item) return
  
  editingIssuedQuantity.value = itemId
  editingIssuedQuantityValue.value = item.issued_quantity || 0
}

// Валидация выданного количества
const validateIssuedQuantity = (maxQuantity) => {
  if (editingIssuedQuantityValue.value > maxQuantity) {
    editingIssuedQuantityValue.value = maxQuantity
  }
  if (editingIssuedQuantityValue.value < 0) {
    editingIssuedQuantityValue.value = 0
  }
}

// Сохранение выданного количества
const saveIssuedQuantity = async (itemId) => {
  const item = orderDetail.value.items.find(i => i.id === itemId)
  if (!item || !orderDetail.value) return
  
  // Валидация перед сохранением
  if (editingIssuedQuantityValue.value > item.quantity) {
    editingIssuedQuantityValue.value = item.quantity
  }
  if (editingIssuedQuantityValue.value < 0) {
    editingIssuedQuantityValue.value = 0
  }
  
  const oldIssuedQuantity = item.issued_quantity || 0
  const newIssuedQuantity = editingIssuedQuantityValue.value
  const quantityToIssue = newIssuedQuantity - oldIssuedQuantity
  
  // Если количество не изменилось, просто закрываем редактирование
  if (quantityToIssue === 0) {
    editingIssuedQuantity.value = null
    editingIssuedQuantityValue.value = 0
    return
  }
  
  // Нельзя выдавать отрицательное количество
  if (quantityToIssue <= 0) {
    alert('Невозможно уменьшить выданное количество')
    return
  }
  
  try {
    // Первый запрос: PATCH на /api/orders/{item_id}/issue?order_id={order_id}
    const orderId = orderDetail.value.id
    const itemId = item.id
    const issueResponse = await api.patch(
      `orders/${itemId}/issue?order_id=${orderId}`,
      { quantity: quantityToIssue }
    )
    
    // Проверяем, что ответ успешен (200)
    if (issueResponse.status === 200) {
      // Второй запрос: POST на store_api /api/issued-items/
      await store_api.post('issued-items/', {
        order_id: orderId,
        order_number: String(orderId),
        variant_id: item.variant_id,
        quantity: quantityToIssue,
        source_type: 'mlm',
        price: item.price
      })
      
      // Обновляем значение в локальном состоянии только после успешных запросов
      item.issued_quantity = newIssuedQuantity
    }
    
    // Завершаем редактирование
    editingIssuedQuantity.value = null
    editingIssuedQuantityValue.value = 0
  } catch (error) {
    console.error('Ошибка при выдаче товара:', error)
    alert(error.response?.data?.detail || 'Ошибка при выдаче товара. Попробуйте еще раз.')
  }
}

// Отмена редактирования
const cancelEditIssuedQuantity = () => {
  editingIssuedQuantity.value = null
  editingIssuedQuantityValue.value = 0
}

// Выдача выбранных товаров
const handleIssueSelected = () => {
  if (selectedItems.value.length === 0) {
    alert('Выберите товары для выдачи')
    return
  }
  console.log('Выдача выбранных товаров:', selectedItems.value)
  // TODO: Реализовать выдачу выбранных товаров
  alert(`Выдача товаров: ${selectedItems.value.join(', ')}`)
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
    editingIssuedQuantity.value = null
    editingIssuedQuantityValue.value = 0
  } else if (!newVal) {
    orderDetail.value = null
    extraPayments.value = []
    variantsMap.value = {}
    detailsVisible.value = false
    selectedItems.value = []
    editingIssuedQuantity.value = null
    editingIssuedQuantityValue.value = 0
  }
})

watch(() => props.orderId, (newId) => {
  if (props.visible && newId) {
    selectedItems.value = []
    editingIssuedQuantity.value = null
    editingIssuedQuantityValue.value = 0
    loadOrderDetail(newId)
  }
})

// Автофокус на input при начале редактирования
watch(editingIssuedQuantity, (newVal) => {
  if (newVal) {
    nextTick(() => {
      // Используем querySelector для поиска активного input по классу
      const input = document.querySelector('.issued-quantity-input')
      if (input) {
        input.focus()
        input.select()
      }
    })
  }
})
</script>

