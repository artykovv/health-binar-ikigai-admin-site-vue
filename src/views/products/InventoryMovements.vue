<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white">Движение товаров</h1>
      <button @click="openAddModal" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52]">
        Создать движение
      </button>
    </div>

    <!-- Filters -->
    <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-white">Склад</label>
        <select v-model="filters.warehouse_id" @change="loadMovements"
          class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
          <option :value="null">Все склады</option>
          <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-white">Тип движения</label>
        <select v-model="filters.movement_type" @change="loadMovements"
          class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
          <option :value="null">Все типы</option>
          <option value="transfer">Перемещение</option>
          <option value="receipt">Приход</option>
          <option value="issue">Выдача</option>
          <option value="adjustment">Корректировка</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-6 text-center">
      <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Откуда</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Куда</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Товар</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Кол-во</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Тип</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Примечание</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-for="movement in movements" :key="movement.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ movement.id }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ movement.from_warehouse_name || '—' }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ movement.to_warehouse_name || '—' }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">ID: {{ movement.variant_id }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ movement.quantity }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm">
                  <span class="inline-flex items-center rounded-full px-2 py-1 text-xs" :class="getMovementTypeClass(movement.movement_type)">
                    {{ getMovementTypeText(movement.movement_type) }}
                  </span>
                </td>
                <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ movement.notes || '—' }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(movement.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="movements.length === 0 && !loading" class="text-center py-8 text-gray-500 dark:text-gray-400">
      Движения не найдены
    </div>

    <!-- Add Movement Modal -->
    <div v-if="modal.visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>
      <div class="relative z-10 w-full max-w-4xl mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 flex flex-col max-h-[90vh]">
        <div class="px-4 py-3 border-b dark:border-gray-700 bg-white dark:bg-[#3f3f47] shrink-0">
          <h5 class="m-0 dark:text-white">Создать движение товаров</h5>
        </div>
        
        <div class="p-4 overflow-y-auto flex-1">
          <div class="space-y-6">
            <!-- Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Тип движения *</label>
                <select v-model="modal.form.movement_type" required
                  class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
                  <option value="">Выберите тип</option>
                  <option value="transfer">Перемещение</option>
                  <option value="receipt">Приход</option>
                  <option value="issue">Выдача</option>
                  <option value="adjustment">Корректировка</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Откуда (склад)</label>
                <select v-model="modal.form.from_warehouse_id"
                  class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
                  <option :value="null">—</option>
                  <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Куда (склад)</label>
                <select v-model="modal.form.to_warehouse_id"
                  class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
                  <option :value="null">—</option>
                  <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
                </select>
              </div>
            </div>

            <!-- Products Table -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-white">Товары * (Выбрано: {{ selectedProducts.length }})</label>
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Поиск товара..." 
                  class="w-64 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white"
                >
              </div>

              <div class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden h-[400px] overflow-y-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-[#3f3f47] sticky top-0 z-10">
                    <tr>
                      <th class="px-4 py-2 w-10"></th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Товар</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">SKU</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Кол-во</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Склад</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                    <tr 
                      v-for="product in filteredVariants" 
                      :key="product.id"
                      class="hover:bg-gray-50 dark:hover:bg-[#4a4a52] cursor-pointer"
                      @click="toggleProduct(product.id)"
                    >
                      <td class="px-4 py-2" @click.stop>
                        <input
                          type="checkbox"
                          :checked="isProductSelected(product.id)"
                          @change="toggleProduct(product.id)"
                          class="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        {{ product.id }}
                      </td>
                      <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        <div class="flex items-center gap-2">
                           <img v-if="product.images && product.images.length > 0" 
                            :src="getImageUrl(product.images[0].src)" 
                            class="w-8 h-8 rounded object-cover"
                            @error="$event.target.style.display='none'">
                          <span>{{ product.full_name }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        {{ product.sku || '-' }}
                      </td>
                       <td class="px-4 py-2 whitespace-nowrap" @click.stop>
                        <input
                          v-if="isProductSelected(product.id)"
                          type="number"
                          :value="getProductQuantity(product.id)"
                          @input="updateProductQuantity(product.id, $event.target.value)"
                          min="1"
                          class="w-20 px-2 py-1 text-sm border rounded border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-[#3f3f47] dark:border-white dark:text-white"
                        />
                        <span v-else class="text-sm text-gray-400 inline-block w-20 text-center">-</span>
                      </td>
                       <td class="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        {{ product.stock }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Примечание</label>
              <textarea v-model="modal.form.notes" rows="2"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                placeholder="Примечание к движению"></textarea>
            </div>

            <div v-if="modal.error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
              {{ modal.error }}
            </div>
          </div>
        </div>
        
        <div class="px-4 py-3 border-t dark:border-gray-700 bg-white dark:bg-[#3f3f47] shrink-0 flex justify-end gap-2">
          <button @click="closeModal" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Отмена</button>
          <button @click="saveMovement" :disabled="!canSubmit || submitting"
            class="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52]">
            <span v-if="submitting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
            Создать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { store_api } from '@/api'

const movements = ref([])
const warehouses = ref([])
const allVariants = ref([])
const loading = ref(false)
const submitting = ref(false)

const filters = ref({
  warehouse_id: null,
  movement_type: null
})

// Modal & Selection State
const modal = ref({
  visible: false,
  form: {
    from_warehouse_id: null,
    to_warehouse_id: null,
    movement_type: '',
    notes: ''
  },
  error: ''
})

const searchQuery = ref('')
const selectedProducts = ref([])
const productQuantities = ref({})

const canSubmit = computed(() => {
  return modal.value.form.movement_type && 
         selectedProducts.value.length > 0 &&
         // Basic validation for movement types
         (modal.value.form.movement_type === 'receipt' ? modal.value.form.to_warehouse_id : 
          modal.value.form.movement_type === 'issue' ? modal.value.form.from_warehouse_id :
          modal.value.form.movement_type === 'transfer' ? (modal.value.form.from_warehouse_id && modal.value.form.to_warehouse_id) :
          true)
})

const filteredVariants = computed(() => {
  if (!searchQuery.value) return allVariants.value
  const q = searchQuery.value.toLowerCase()
  return allVariants.value.filter(v => 
    v.full_name?.toLowerCase().includes(q) || 
    v.sku?.toLowerCase().includes(q) ||
    String(v.id).includes(q)
  )
})

const loadWarehouses = async () => {
  try {
    const response = await store_api.get('warehouses/?is_active=true')
    warehouses.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки складов:', error)
  }
}

const loadVariants = async () => {
  try {
    const response = await store_api.get('products/variants?skip=0&limit=1000')
    if (response.data && response.data.data) {
      allVariants.value = response.data.data
    } else {
      allVariants.value = response.data || []
    }
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
    allVariants.value = []
  }
}

const loadMovements = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({ skip: '0', limit: '100' })
    if (filters.value.warehouse_id) params.append('warehouse_id', filters.value.warehouse_id)
    if (filters.value.movement_type) params.append('movement_type', filters.value.movement_type)
    
    const response = await store_api.get(`inventory/movements?${params.toString()}`)
    movements.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки движений:', error)
  } finally {
    loading.value = false
  }
}

// Selection Logic
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

const openAddModal = () => {
  selectedProducts.value = []
  productQuantities.value = {}
  searchQuery.value = ''
  
  modal.value = {
    visible: true,
    form: {
      from_warehouse_id: null,
      to_warehouse_id: null,
      movement_type: '',
      notes: ''
    },
    error: ''
  }
}

const closeModal = () => {
  modal.value.visible = false
  selectedProducts.value = []
  productQuantities.value = {}
}

const saveMovement = async () => {
  if (!canSubmit.value) {
    modal.value.error = 'Заполните обязательные поля и выберите товары'
    return
  }

  submitting.value = true
  modal.value.error = ''

  try {
    const items = selectedProducts.value.map(id => ({
      variant_id: id,
      quantity: productQuantities.value[id] || 1
    }))

    const data = {
      from_warehouse_id: modal.value.form.from_warehouse_id,
      to_warehouse_id: modal.value.form.to_warehouse_id,
      movement_type: modal.value.form.movement_type,
      items: items,
      notes: modal.value.form.notes?.trim() || null
    }

    await store_api.post('inventory/movements', data)
    await loadMovements()
    closeModal()
  } catch (error) {
    console.error('Ошибка создания движения:', error)
    modal.value.error = error.response?.data?.detail || 'Ошибка при создании движения'
  } finally {
    submitting.value = false
  }
}

const getMovementTypeClass = (type) => {
  const classes = {
    transfer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    receipt: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    issue: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    adjustment: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
  }
  return classes[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getMovementTypeText = (type) => {
  const texts = {
    transfer: 'Перемещение',
    receipt: 'Приход',
    issue: 'Выдача',
    adjustment: 'Корректировка'
  }
  return texts[type] || type
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  const baseUrl = 'https://catalog-api-production-a903.up.railway.app'
  return `${baseUrl}${imagePath}`
}

onMounted(() => {
  loadWarehouses()
  loadMovements()
  loadVariants()
})
</script>
