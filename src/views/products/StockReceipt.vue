<template>
  <div class="container mx-auto px-4 py-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Приход товара</h1>
            <p class="text-gray-600 dark:text-gray-400">Добавление товаров на склад</p>
          </div>
          <div class="flex gap-3">
            <button
              @click="reset"
              class="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-[10px] hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
            >
              Очистить
            </button>
            <button
              @click="submit"
              :disabled="saving || !isValid"
              class="px-6 py-3 bg-[#015C3B] text-white rounded-[10px] hover:bg-[#014a2f] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                v-if="saving"
                class="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ saving ? 'Сохранение...' : 'Принять приход' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Warehouse Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Склад *
        </label>
        <select
          v-model="selectedWarehouseId"
          required
          class="w-full max-w-md px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#015C3B] focus:border-transparent transition-all"
        >
          <option :value="null" disabled>Выберите склад</option>
          <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
            {{ warehouse.name }}
          </option>
        </select>
      </div>

      <!-- Note Field -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Примечание
        </label>
        <textarea
          v-model="note"
          placeholder="Введите примечание к приходу товара..."
          class="w-full max-w-2xl px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#015C3B] focus:border-transparent transition-all"
          rows="2"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Search Panel -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-[#3f3f47] rounded-[20px] shadow-lg border dark:border-gray-600 p-6 sticky top-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Поиск товаров</h2>
            
            <!-- Search Input -->
            <div class="mb-4">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Поиск по названию, SKU, ID..."
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#015C3B] focus:border-transparent"
                @input="performSearch"
              />
            </div>

            <!-- Loading Search -->
            <div v-if="searching" class="py-4 text-center">
              <div class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#015C3B]"></div>
            </div>

            <!-- Search Results -->
            <div v-else-if="searchQuery && searchResults.length > 0" class="max-h-96 overflow-y-auto space-y-2">
              <div
                v-for="variant in searchResults"
                :key="variant.id"
                class="p-3 bg-gray-50 dark:bg-gray-800 rounded-[10px] border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ variant.full_name }}
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      ID: {{ variant.id }} | SKU: {{ variant.sku }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Остаток: {{ variant.stock }} | Цена: {{ variant.price }}
                    </div>
                  </div>
                  <button
                    @click="addToTable(variant)"
                    :disabled="isInTable(variant.id)"
                    class="px-3 py-1.5 bg-[#015C3B] text-white rounded-[8px] hover:bg-[#014a2f] transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {{ isInTable(variant.id) ? 'Добавлено' : '+' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- No Results -->
            <div v-else-if="searchQuery && !searching" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              Ничего не найдено
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              Введите запрос для поиска
            </div>
          </div>
        </div>

        <!-- Variants Table -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-[#3f3f47] rounded-[20px] shadow-lg border dark:border-gray-600 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Варианты товаров</h2>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                В списке: {{ selectedVariants.length }} | К заполнению: {{ itemsToFill }}
              </div>
            </div>

            <!-- Empty Table State -->
            <div v-if="selectedVariants.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p class="text-lg font-medium mb-2">Список пуст</p>
              <p class="text-sm">Найдите товары в поиске и добавьте их в список</p>
            </div>

            <!-- Table -->
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">SKU</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цена</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Текущий остаток</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">
                      Приход (количество)
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">
                      Себестоимость
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-[#3f3f47] divide-y divide-gray-200 dark:divide-gray-700">
                  <tr
                    v-for="variant in selectedVariants"
                    :key="variant.id"
                    class="hover:bg-gray-50 dark:hover:bg-[#4a4a52] transition-colors"
                    :class="{ 'bg-red-50 dark:bg-red-900/10': hasError(variant.id) }"
                  >
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{{ variant.id }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ variant.full_name }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ variant.sku }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ variant.price }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ variant.stock }}</td>
                    <td class="px-4 py-3">
                      <input
                        :value="getQuantity(variant.id)"
                        @input="updateQuantity(variant.id, $event.target.value)"
                        type="number"
                        min="0"
                        placeholder="0"
                        class="w-24 px-2 py-1.5 text-sm border rounded-[8px] focus:ring-2 focus:ring-[#015C3B] focus:border-transparent transition-all"
                        :class="hasError(variant.id) 
                          ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300' 
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'"
                      />
                      <div v-if="hasError(variant.id)" class="mt-1 text-xs text-red-600 dark:text-red-400">
                        Добавьте остаток или удалите строку
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <input
                        :value="getCostPrice(variant.id)"
                        @input="updateCostPrice(variant.id, $event.target.value)"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        class="w-28 px-2 py-1.5 text-sm border rounded-[8px] focus:ring-2 focus:ring-[#015C3B] focus:border-transparent transition-all border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </td>
                    <td class="px-4 py-3">
                      <button
                        @click="removeVariant(variant.id)"
                        class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[8px] transition-colors"
                        title="Удалить строку"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Warning Message -->
      <div
        v-if="hasZeroQuantity"
        class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-[10px] text-yellow-800 dark:text-yellow-400"
      >
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <div>
            <p class="font-medium">Внимание: есть товары с остатком 0</p>
            <p class="text-sm mt-1">Пожалуйста, добавьте количество прихода или удалите строки с нулевым остатком.</p>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[10px] text-green-800 dark:text-green-400"
      >
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[10px] text-red-800 dark:text-red-400"
      >
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store_api } from '@/api'

const router = useRouter()

const allVariants = ref([]) // Все загруженные варианты для поиска
const selectedVariants = ref([]) // Варианты, добавленные в таблицу
const warehouses = ref([]) // Список складов
const selectedWarehouseId = ref(null) // Выбранный склад
const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const quantities = ref({}) // { variant_id: quantity }
const costPrices = ref({}) // { variant_id: cost_price }
const note = ref('')
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Загрузка складов
const loadWarehouses = async () => {
  try {
    const response = await store_api.get('warehouses/?is_active=true')
    warehouses.value = response.data
    // Автоматически выбираем первый склад, если он один
    if (warehouses.value.length === 1) {
      selectedWarehouseId.value = warehouses.value[0].id
    }
  } catch (error) {
    console.error('Ошибка загрузки складов:', error)
    errorMessage.value = 'Ошибка загрузки списка складов'
  }
}

// Загрузка всех вариантов товаров для поиска
const loadAllVariants = async () => {
  searching.value = true
  try {
    const response = await store_api.get('products/variants?skip=0&limit=1000')
    allVariants.value = response.data.data || []
  } catch (error) {
    console.error('Ошибка загрузки вариантов:', error)
    errorMessage.value = 'Ошибка загрузки вариантов товаров'
  } finally {
    searching.value = false
  }
}

// Поиск по вариантам
const performSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase().trim()
  searchResults.value = allVariants.value.filter(variant => {
    const searchText = `${variant.id} ${variant.full_name || ''} ${variant.sku || ''} ${variant.product_name || ''}`.toLowerCase()
    return searchText.includes(query)
  }).slice(0, 50) // Ограничиваем 50 результатами
}

// Проверка: находится ли вариант в таблице
const isInTable = (variantId) => {
  return selectedVariants.value.some(v => v.id === variantId)
}

// Добавление варианта в таблицу
const addToTable = (variant) => {
  if (!isInTable(variant.id)) {
    selectedVariants.value.push(variant)
    // Инициализируем количество пустым
    if (!quantities.value[variant.id]) {
      quantities.value[variant.id] = ''
    }
    // Инициализируем себестоимость пустой
    if (!costPrices.value[variant.id]) {
      costPrices.value[variant.id] = ''
    }
    // Очищаем поиск после добавления (опционально)
    // searchQuery.value = ''
  }
}

// Получить количество для варианта
const getQuantity = (variantId) => {
  return quantities.value[variantId] || ''
}

// Обновить количество для варианта
const updateQuantity = (variantId, value) => {
  const numValue = value === '' ? '' : Number(value)
  if (numValue === '' || numValue >= 0) {
    quantities.value[variantId] = numValue
  }
}

// Получить себестоимость для варианта
const getCostPrice = (variantId) => {
  return costPrices.value[variantId] || ''
}

// Обновить себестоимость для варианта
const updateCostPrice = (variantId, value) => {
  const numValue = value === '' ? '' : Number(value)
  if (numValue === '' || numValue >= 0) {
    costPrices.value[variantId] = numValue
  }
}

// Проверка ошибки (количество равно 0)
const hasError = (variantId) => {
  const qty = quantities.value[variantId]
  return qty !== undefined && qty !== '' && Number(qty) === 0
}

// Количество строк с ошибками
const itemsToFill = computed(() => {
  return selectedVariants.value.filter(v => hasError(v.id)).length
})

// Есть ли нулевые количества
const hasZeroQuantity = computed(() => {
  return Object.values(quantities.value).some(qty => qty === 0 || qty === null)
})

// Удаление варианта из списка (удаление строки)
const removeVariant = (variantId) => {
  const index = selectedVariants.value.findIndex(v => v.id === variantId)
  if (index > -1) {
    selectedVariants.value.splice(index, 1)
    delete quantities.value[variantId]
    delete costPrices.value[variantId]
  }
}

// Очистить форму
const reset = () => {
  selectedVariants.value = []
  quantities.value = {}
  costPrices.value = {}
  note.value = ''
  searchQuery.value = ''
  searchResults.value = []
  successMessage.value = ''
  errorMessage.value = ''
  // Не сбрасываем selectedWarehouseId, чтобы пользователь не выбирал заново
}

// Валидация формы
const isValid = computed(() => {
  const items = getItemsForSubmit()
  return selectedWarehouseId.value && items.length > 0 && items.every(item => item.quantity > 0)
})

// Получить элементы для отправки
const getItemsForSubmit = () => {
  return Object.entries(quantities.value)
    .filter(([variantId, quantity]) => {
      const qty = Number(quantity)
      return quantity !== '' && quantity !== null && qty > 0
    })
    .map(([variantId, quantity]) => {
      const costPrice = costPrices.value[variantId]
      return {
        variant_id: Number(variantId),
        quantity: Number(quantity),
        cost_price: costPrice !== '' && costPrice !== null && costPrice !== undefined 
          ? Number(costPrice) 
          : 0
      }
    })
}

// Отправка формы
const submit = async () => {
  if (!selectedWarehouseId.value) {
    errorMessage.value = 'Выберите склад для прихода товара'
    return
  }
  
  if (!isValid.value) {
    errorMessage.value = 'Заполните количество для всех выбранных товаров (больше 0)'
    return
  }

  saving.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const items = getItemsForSubmit()
    
    const payload = {
      warehouse_id: selectedWarehouseId.value,
      items: items,
      note: note.value || null
    }

    await store_api.post('/stock/receipts', payload)
    
    successMessage.value = `Приход товара успешно принят! Обработано ${items.length} позиций.`
    
    // Возврат на список приходов через 1.5 секунды
    setTimeout(() => {
      router.push('/products/receipt')
    }, 1500)
  } catch (e) {
    console.error('Ошибка при создании прихода:', e)
    errorMessage.value = e.response?.data?.detail || 'Произошла ошибка при сохранении прихода'
  } finally {
    saving.value = false
  }
}

// Загрузка при монтировании
onMounted(() => {
  loadWarehouses()
  loadAllVariants()
})
</script>
