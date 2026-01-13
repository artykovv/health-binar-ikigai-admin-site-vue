<template>
  <div v-if="visible" class="fixed inset-0 z-[60] flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="handleClose"></div>
    <div class="relative z-10 w-full max-w-md mx-4 rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
      <div class="px-4 py-3 border-b dark:border-gray-700">
        <h5 class="m-0 dark:text-white">Выберите склад для выдачи</h5>
      </div>
      <div class="p-4">
        <div v-if="loadingWarehouses" class="text-center py-4">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        <div v-else class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Склад *</label>
            <select
              v-model="selectedWarehouseId"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
            >
              <option :value="null">Выберите склад</option>
              <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name }}
              </option>
            </select>
          </div>
          
          <!-- Items with quantities -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Товары для выдачи</label>
            <div class="space-y-2">
              <div 
                v-for="(item, index) in editableItems" 
                :key="index"
                class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                <div class="flex-1 text-sm text-gray-900 dark:text-white">
                  Вариант ID: {{ item.variant_id }}
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-xs text-gray-600 dark:text-gray-400">Количество:</label>
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    :min="1"
                    :max="item.maxQuantity"
                    class="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                  />
                  <span class="text-xs text-gray-500 dark:text-gray-400">/ {{ item.maxQuantity }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="error" class="text-sm text-red-600 dark:text-red-400">
            {{ error }}
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
        <button @click="handleClose" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Отмена</button>
        <button @click="handleIssue" :disabled="!selectedWarehouseId || issuing" class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-800">
          <span v-if="issuing" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
          Выдать
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { store_api } from '@/api'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    required: true,
    // Expected format: [{ variant_id: number, quantity: number }]
  },
  orderId: {
    type: [Number, String],
    required: true
  },
  orderNumber: {
    type: String,
    required: true
  },
  sourceType: {
    type: String,
    default: 'mlm'
  },
  totalPrice: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'success', 'error'])

const warehouses = ref([])
const selectedWarehouseId = ref(null)
const loadingWarehouses = ref(false)
const error = ref('')
const issuing = ref(false)
const editableItems = ref([])

// Load warehouses
const loadWarehouses = async () => {
  loadingWarehouses.value = true
  error.value = ''
  try {
    // Add leading slash to ensure correct path
    const response = await store_api.get('/warehouses/?skip=0&limit=100&is_active=true')
    warehouses.value = response.data
    // Auto-select if only one warehouse
    if (warehouses.value.length === 1) {
      selectedWarehouseId.value = warehouses.value[0].id
    }
  } catch (err) {
    console.error('Ошибка загрузки складов:', err)
    error.value = 'Ошибка загрузки списка складов'
  } finally {
    loadingWarehouses.value = false
  }
}

// Handle issue
const handleIssue = async () => {
  if (!selectedWarehouseId.value) {
    error.value = 'Выберите склад'
    return
  }
  
  // Validate quantities
  const invalidItems = editableItems.value.filter(item => 
    !item.quantity || item.quantity <= 0 || item.quantity > item.maxQuantity
  )
  
  if (invalidItems.length > 0) {
    error.value = 'Проверьте количество товаров'
    return
  }
  
  issuing.value = true
  error.value = ''
  
  try {
    // Prepare items with edited quantities
    const itemsToIssue = editableItems.value.map(item => ({
      variant_id: item.variant_id,
      quantity: item.quantity
    }))
    
    // Create issued items in catalog API
    const response = await store_api.post('issued-items/', {
      warehouse_id: selectedWarehouseId.value,
      order_id: props.orderId,
      order_number: props.orderNumber,
      items: itemsToIssue,
      source_type: props.sourceType,
      price: props.totalPrice
    })
    
    emit('success', response.data)
    handleClose()
  } catch (err) {
    console.error('Ошибка при выдаче товаров:', err)
    error.value = err.response?.data?.detail || 'Ошибка при выдаче товаров'
    emit('error', err)
  } finally {
    issuing.value = false
  }
}

const handleClose = () => {
  selectedWarehouseId.value = null
  error.value = ''
  emit('close')
}

const initModal = () => {
  // Initialize editable items with max quantities
  if (props.items && props.items.length) {
    editableItems.value = props.items.map(item => ({
      variant_id: item.variant_id,
      quantity: item.quantity,      // Default to full quantity
      maxQuantity: item.quantity    // Store max for validation
    }))
  }
  loadWarehouses()
}

// Load warehouses when modal opens
watch(() => props.visible, (newVal) => {
  if (newVal) {
    initModal()
  } else {
    selectedWarehouseId.value = null
    error.value = ''
    editableItems.value = []
  }
}, { immediate: true })

onMounted(() => {
  if (props.visible) {
    initModal()
  }
})
</script>
```
