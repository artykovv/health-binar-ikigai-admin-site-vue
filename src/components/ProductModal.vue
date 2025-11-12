<template>
  <!-- Модальное окно -->
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-full items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/40 transition-opacity"></div>
      
      <!-- Modal content -->
      <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ product?.name || 'Товар' }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>

          <div v-else-if="!product" class="text-center py-8 text-gray-500 dark:text-gray-400">
            Товар не найден
          </div>

          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Изображение товара -->
            <div class="space-y-4">
              <div class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  :src="getImageUrl(selectedVariant?.images?.[0]?.src || getProductImage()) || '/placeholder.jpg'" 
                  :alt="selectedVariant?.images?.[0]?.alt || product?.name || 'Товар'"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <!-- Информация о товаре -->
            <div class="space-y-6">
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ selectedVariant ? selectedVariant.variant_name : product.name }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  {{ product.description }}
                </p>
              </div>

              <!-- Атрибуты товара для переключения между вариациями -->
              <div v-if="product.facets && Object.keys(product.facets).length > 0" class="space-y-4">
                <div v-for="(facet, attrId) in product.facets" :key="attrId" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ facet.name }}:
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="val in facet.values"
                      :key="val.id"
                      @click="handleSelect(attrId, val.id)"
                      :class="[
                        'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                        selectedValues[attrId] === val.id
                          ? 'bg-black text-white dark:bg-white dark:text-black'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500',
                        !val.available
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      ]"
                    >
                      {{ val.value }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Информация о выбранном варианте -->
              <div v-if="selectedVariant" class="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div class="text-xl font-bold text-gray-900 dark:text-white">
                  <span v-if="selectedVariant.final_price && selectedVariant.final_price < selectedVariant.price" class="space-x-2">
                    <span class="text-gray-500 line-through">{{ selectedVariant.price }}</span>
                    <span class="text-red-600">{{ selectedVariant.final_price }}</span>
                  </span>
                  <span v-else>{{ selectedVariant.price }}</span>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  В наличии: <span class="font-medium">{{ selectedVariant.stock }} шт</span>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  SKU: {{ selectedVariant.sku }}
                </div>
              </div>

              <!-- Сообщение о необходимости выбора атрибутов -->
              <div v-else-if="product.facets && Object.keys(product.facets).length > 0" class="pt-4 border-t border-gray-200 dark:border-gray-600">
                <p class="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                  Выберите все атрибуты для просмотра варианта
                </p>
              </div>
            </div>
          </div>

          <!-- Существующие вариации товара (внизу) -->
          <div v-if="product && !addVariant.visible" class="mt-6 border-t border-gray-200 dark:border-gray-600 pt-6">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Вариации товара</h4>
              <button @click="openAddVariant" 
                      class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-white text-xs hover:bg-green-700 transition-colors">
                + Добавить вариацию
              </button>
            </div>
            
            <!-- Список вариаций -->
            <div v-if="product.variants && product.variants.length > 0" class="space-y-2 max-h-64 overflow-y-auto">
              <div v-for="variant in product.variants" :key="variant.id" 
                   class="border border-gray-200 dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-[#3f3f47] hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <img v-if="variant.images && variant.images.length > 0" 
                           :src="getImageUrl(variant.images[0].src)" 
                           :alt="variant.images[0].alt"
                           class="h-10 w-10 rounded object-cover" />
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">{{ variant.variant_name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">SKU: {{ variant.sku }} | Цена: {{ variant.price }} | Остаток: {{ variant.stock }}</p>
                      </div>
                    </div>
                  </div>
                  <button @click="editVariantById(variant.id)" 
                          class="ml-2 inline-flex items-center rounded-md bg-gray-800 dark:bg-gray-600 px-2 py-1 text-white text-xs hover:bg-gray-700 dark:hover:bg-gray-500">
                    Редактировать
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Кнопка добавления вариации, если вариаций нет -->
            <div v-else>
              <button @click="openAddVariant" 
                      class="w-full bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors">
                + Добавить вариацию
              </button>
            </div>
          </div>

          <!-- Форма добавления вариаций -->
          <div v-if="addVariant.visible" class="mt-6 border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-[#3f3f47]">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Новая вариация</h3>
              <button @click="closeAddVariant" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Выбор атрибутов -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-white">Атрибуты:</label>
                <div v-if="availableAttributesForProduct.length > 0" class="grid grid-cols-2 gap-2">
                  <div v-for="attr in availableAttributesForProduct" :key="attr.id" class="flex items-center">
                    <input :id="`attr-${attr.id}`" 
                          v-model="addVariant.selectedAttrs" 
                          :value="attr.id" 
                          type="checkbox"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500">
                    <label :for="`attr-${attr.id}`" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {{ attr.name }}
                    </label>
                  </div>
                </div>
                <div v-else-if="product && product.facets && Object.keys(product.facets).length === 0" 
                     class="text-sm text-gray-500 dark:text-gray-400 py-2">
                  У этого товара нет атрибутов. Невозможно добавить новые вариации.
                </div>
                <div v-else class="text-sm text-gray-500 dark:text-gray-400 py-2">
                  Загрузка доступных атрибутов...
                </div>
              </div>

            <!-- Матрица вариаций -->
            <div v-if="selectedAttributesForVariants.length > 0" class="mb-4">
              <VariantMatrix 
                :attributes="selectedAttributesForVariants"
                :existing-variants="product?.variants || []"
                :productName="product?.name || ''"
                @update:variants="updateNewVariants"
              />
            </div>

            <!-- Сообщение, если все варианты уже существуют -->
            <div v-if="selectedAttributesForVariants.length > 0 && newVariants.length === 0" 
                 class="text-center py-4 text-yellow-600 dark:text-yellow-400 text-sm">
              Все комбинации выбранных атрибутов уже существуют у этого товара
            </div>

            <!-- Кнопки сохранения -->
            <div v-if="newVariants.length > 0" class="mt-4 flex gap-2">
              <button @click="saveNewVariants" :disabled="savingVariants"
                      class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                <span v-if="savingVariants" class="inline-block mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Сохранить вариации
              </button>
              <button @click="closeAddVariant" 
                      class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500">
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно редактирования товара -->
    <div v-if="editProductModal.visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="px-4 py-3 border-b dark:border-gray-700">
          <h5 class="m-0 dark:text-white">Редактирование товара</h5>
        </div>
        <div class="p-4">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Название *</label>
              <input v-model="editProductModal.form.name" type="text" required
                     class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                     placeholder="Название товара">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Slug *</label>
              <input v-model="editProductModal.form.slug" type="text" required
                     class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                     placeholder="slug-tovara">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Описание</label>
              <textarea v-model="editProductModal.form.description" 
                        class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                        rows="3"
                        placeholder="Описание товара"></textarea>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <button @click="closeEditProductModal" 
                  class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">
            Отмена
          </button>
          <button @click="saveProduct" :disabled="!editProductModal.form.name?.trim() || !editProductModal.form.slug?.trim() || saving"
                  class="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
            <span v-if="saving" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { store_api } from '@/api'
import VariantMatrix from '@/components/VariantMatrix.vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  productId: {
    type: [String, Number],
    default: null
  },
  variantId: {
    type: [String, Number],
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'edit-variant', 'product-updated'])

// Реактивные данные
const product = ref(null)
const loading = ref(false)
const saving = ref(false)
const savingVariants = ref(false)
const editProductModal = ref({
  visible: false,
  form: {
    name: '',
    slug: '',
    description: ''
  }
})

// Данные для добавления вариаций
const availableAttributes = ref([])
const addVariant = ref({
  visible: false,
  selectedAttrs: []
})
const newVariants = ref([])

// Данные для переключения между вариациями
const selectedValues = ref({})

// Атрибуты, которые уже используются в товаре (из product.facets)
const usedAttributeIds = computed(() => {
  if (!product.value || !product.value.facets) return []
  // Извлекаем ID атрибутов из ключей объекта facets
  // facets имеет структуру: { "3": {...}, "5": {...} }
  return Object.keys(product.value.facets).map(id => Number(id))
})

// Отфильтрованные атрибуты (только те, которые уже используются в товаре)
const availableAttributesForProduct = computed(() => {
  if (!product.value || !product.value.facets || usedAttributeIds.value.length === 0) {
    return []
  }
  
  // Фильтруем только те атрибуты, которые уже используются в товаре
  return availableAttributes.value.filter(attr => 
    usedAttributeIds.value.includes(attr.id)
  )
})

// Выбранные атрибуты для создания вариаций
const selectedAttributesForVariants = computed(() => {
  return availableAttributesForProduct.value.filter(attr => 
    addVariant.value.selectedAttrs.includes(attr.id)
  )
})

// Выбранный вариант на основе выбранных значений атрибутов
const selectedVariant = computed(() => {
  if (!product.value || !product.value.variants || Object.keys(selectedValues.value).length === 0) return null
  
  // Ищем вариант с выбранными атрибутами
  return product.value.variants.find(variant => {
    if (!variant.attribute_value_ids) return false
    return variant.attribute_value_ids.every(id => 
      Object.values(selectedValues.value).includes(id)
    )
  })
})

// Автоматическая очистка недоступных выбранных атрибутов
watch(availableAttributesForProduct, (newAttrs) => {
  if (addVariant.value.visible && addVariant.value.selectedAttrs.length > 0) {
    const availableIds = newAttrs.map(attr => attr.id)
    addVariant.value.selectedAttrs = addVariant.value.selectedAttrs.filter(id => 
      availableIds.includes(id)
    )
  }
})

// Методы
const loadProduct = async (productId) => {
  if (!productId) return
  
  try {
    loading.value = true
    const response = await store_api.get(`products/${productId}`)
    product.value = response.data
    
    // Инициализируем выбранные значения
    selectedValues.value = {}
    
    // Если передан variantId, выбираем соответствующий вариант
    if (props.variantId) {
      const variantId = Number(props.variantId)
      const variant = product.value.variants.find(v => v.id === variantId)
      if (variant && variant.attribute_value_ids) {
        // Устанавливаем значения для выбранного варианта
        variant.attribute_value_ids.forEach(valueId => {
          Object.keys(product.value.facets || {}).forEach(attrId => {
            const facet = product.value.facets[attrId]
            if (facet && facet.values && facet.values.some(val => val.id === valueId)) {
              selectedValues.value[attrId] = valueId
            }
          })
        })
      }
    } else if (product.value.variants && product.value.variants.length > 0) {
      // Если передан только productId, выбираем вариант с минимальным ID
      const minVariant = product.value.variants.reduce((min, variant) => 
        variant.id < min.id ? variant : min
      )
      if (minVariant && minVariant.attribute_value_ids) {
        minVariant.attribute_value_ids.forEach(valueId => {
          Object.keys(product.value.facets || {}).forEach(attrId => {
            const facet = product.value.facets[attrId]
            if (facet && facet.values && facet.values.some(val => val.id === valueId)) {
              selectedValues.value[attrId] = valueId
            }
          })
        })
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки товара:', error)
    product.value = null
  } finally {
    loading.value = false
  }
}

// Обработка выбора значения атрибута
const handleSelect = (attrId, valueId) => {
  selectedValues.value[attrId] = valueId
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  // Если путь уже содержит полный URL, возвращаем как есть
  if (imagePath.startsWith('http')) return imagePath
  // Добавляем базовый URL API
  const baseUrl = 'https://catalog-api-production-a903.up.railway.app'
  return `${baseUrl}${imagePath}`
}

// Получение изображения товара (из первого варианта)
const getProductImage = () => {
  if (!product.value || !product.value.variants || product.value.variants.length === 0) return null
  
  const firstVariant = product.value.variants[0]
  if (firstVariant.images && firstVariant.images.length > 0) {
    return firstVariant.images[0].src
  }
  return null
}

// Получение названия варианта из атрибутов для отображения в ошибках
const getVariantDisplayName = (variant) => {
  if (!variant.attribute_value_ids || !selectedAttributesForVariants.value) return 'Вариант'
  
  const valueNames = variant.attribute_value_ids.map(valueId => {
    for (const attr of selectedAttributesForVariants.value) {
      const value = attr.values.find(v => v.id === valueId)
      if (value) return value.value
    }
    return ''
  }).filter(v => v)
  
  if (valueNames.length > 0) {
    return valueNames.join(' / ')
  }
  
  return `Вариант #${variant.attribute_value_ids.join(',')}`
}

const editVariantById = (variantId) => {
  // Закрываем текущее модальное окно
  emit('close')
  
  // Открываем модальное окно редактирования
  emit('edit-variant', variantId)
}

const openEditProductModal = () => {
  if (!product.value) return
  editProductModal.value = {
    visible: true,
    form: {
      name: product.value.name || '',
      slug: product.value.slug || '',
      description: product.value.description || ''
    }
  }
}

const closeEditProductModal = () => {
  editProductModal.value = {
    visible: false,
    form: {
      name: '',
      slug: '',
      description: ''
    }
  }
}

const saveProduct = async () => {
  if (!product.value || !editProductModal.value.form.name?.trim() || !editProductModal.value.form.slug?.trim()) return
  
  saving.value = true
  try {
    await store_api.patch(`products/${product.value.id}`, {
      name: editProductModal.value.form.name.trim(),
      slug: editProductModal.value.form.slug.trim(),
      description: editProductModal.value.form.description?.trim() || null
    })
    
    // Перезагружаем товар
    await loadProduct(product.value.id)
    
    // Уведомляем родительский компонент
    emit('product-updated')
    
    // Закрываем модальное окно редактирования
    closeEditProductModal()
    
    // Показываем уведомление
    alert('Товар успешно обновлен!')
  } catch (error) {
    console.error('Ошибка сохранения товара:', error)
    alert('Ошибка при сохранении товара')
  } finally {
    saving.value = false
  }
}

const closeModal = () => {
  emit('close')
}

// Загрузка атрибутов
const loadAttributes = async () => {
  try {
    const response = await store_api.get('attributes/?skip=0&limit=100')
    availableAttributes.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки атрибутов:', error)
  }
}

// Функции для работы с добавлением вариаций
const openAddVariant = async () => {
  addVariant.value = {
    visible: true,
    selectedAttrs: []
  }
  newVariants.value = []
  
  // Загружаем атрибуты если еще не загружены
  if (availableAttributes.value.length === 0) {
    await loadAttributes()
  }
}

const closeAddVariant = () => {
  addVariant.value = {
    visible: false,
    selectedAttrs: []
  }
  newVariants.value = []
}

// Проверка, существует ли комбинация атрибутов в товаре
const isVariantExists = (attributeValueIds) => {
  if (!product.value || !product.value.variants || !attributeValueIds) return false
  
  // Сортируем массивы для сравнения (порядок не важен)
  const sortedNew = [...attributeValueIds].sort((a, b) => a - b)
  
  return product.value.variants.some(existingVariant => {
    if (!existingVariant.attribute_value_ids) return false
    const sortedExisting = [...existingVariant.attribute_value_ids].sort((a, b) => a - b)
    
    // Сравниваем массивы
    if (sortedNew.length !== sortedExisting.length) return false
    
    return sortedNew.every((id, index) => id === sortedExisting[index])
  })
}

// Обновление вариантов из VariantMatrix
const updateNewVariants = (variants) => {
  // Получаем список существующих комбинаций из товара
  const existingKeys = new Set()
  if (product.value && product.value.variants) {
    product.value.variants.forEach(v => {
      if (v.attribute_value_ids) {
        const key = [...v.attribute_value_ids].sort((a, b) => a - b).join('-')
        existingKeys.add(key)
      }
    })
  }
  
  // Создаем ключ для поиска существующих данных по комбинации атрибутов (из отредактированных)
  const existingDataMap = new Map()
  newVariants.value.forEach(v => {
    if (v.attribute_value_ids) {
      const key = [...v.attribute_value_ids].sort((a, b) => a - b).join('-')
      existingDataMap.set(key, v)
    }
  })
  
  // Фильтруем варианты - исключаем те, которые уже существуют
  const filteredVariants = variants.filter(variant => {
    if (!variant.attribute_value_ids) return false
    const key = [...variant.attribute_value_ids].sort((a, b) => a - b).join('-')
    return !existingKeys.has(key)
  })
  
  // Обновляем варианты, сохраняя отредактированные данные
  newVariants.value = filteredVariants.map(variant => {
    const key = [...variant.attribute_value_ids].sort((a, b) => a - b).join('-')
    const existing = existingDataMap.get(key)
    
    if (existing) {
      // Сохраняем отредактированные значения
      // Для цены: если в existing уже есть валидная цена, используем её, иначе берем из variant если она валидна
      let finalPrice = existing.price
      if ((finalPrice === null || finalPrice === undefined || finalPrice === '') && variant.price !== null && variant.price !== undefined && variant.price !== '') {
        const variantPriceNum = Number(variant.price)
        if (!isNaN(variantPriceNum) && variantPriceNum > 0) {
          finalPrice = variantPriceNum
        }
      }
      
      return {
        ...variant,
        sku: existing.sku || variant.sku,
        price: finalPrice,
        stock: existing.stock !== null && existing.stock !== undefined ? existing.stock : (variant.stock !== null && variant.stock !== undefined ? variant.stock : null),
        description: existing.description || variant.description || '',
        imageFile: existing.imageFile || variant.imageFile || null,
        imagePreview: existing.imagePreview || variant.imagePreview || null
      }
    }
    
    // Новый вариант - используем значения из VariantMatrix, но проверяем валидность цены
    const variantPriceNum = variant.price !== null && variant.price !== undefined && variant.price !== '' 
      ? Number(variant.price) 
      : null
    
    return {
      ...variant,
      price: (!isNaN(variantPriceNum) && variantPriceNum > 0) ? variantPriceNum : null,
      description: variant.description || '',
      imageFile: variant.imageFile || null,
      imagePreview: variant.imagePreview || null
    }
  })
}

// Сохранение новых вариаций
const saveNewVariants = async () => {
  if (!product.value || newVariants.value.length === 0) return
  
  // Дополнительная фильтрация существующих вариантов перед сохранением
  const existingKeys = new Set()
  if (product.value && product.value.variants) {
    product.value.variants.forEach(v => {
      if (v.attribute_value_ids) {
        const key = [...v.attribute_value_ids].sort((a, b) => a - b).join('-')
        existingKeys.add(key)
      }
    })
  }
  
  // Фильтруем только новые варианты (исключаем существующие)
  const variantsToSave = newVariants.value.filter(variant => {
    if (!variant.attribute_value_ids) return false
    const key = [...variant.attribute_value_ids].sort((a, b) => a - b).join('-')
    return !existingKeys.has(key)
  })
  
  if (variantsToSave.length === 0) {
    alert('Все выбранные варианты уже существуют')
    return
  }
  
  // Проверяем обязательные поля только для новых вариантов
  for (const variant of variantsToSave) {
    const sku = variant.sku?.trim() || ''
    const price = variant.price
    const variantName = getVariantDisplayName(variant)
    const missingFields = []
    
    // Проверка SKU
    if (!sku) {
      missingFields.push('SKU')
    }
    
    // Проверка цены (должна быть положительным числом)
    // Обрабатываем все возможные варианты: null, undefined, пустая строка, строка с числом, число
    let priceNum = null
    if (price !== null && price !== undefined && price !== '') {
      priceNum = Number(price)
      // Если преобразование не удалось (NaN) или цена <= 0, поле не заполнено
      if (isNaN(priceNum) || priceNum <= 0) {
        missingFields.push('Цена')
      }
    } else {
      // Если price равен null, undefined или пустой строке
      missingFields.push('Цена')
    }
    
    // Если есть незаполненные поля, показываем конкретную ошибку
    if (missingFields.length > 0) {
      const fieldsText = missingFields.join(' и ')
      alert(`Заполните обязательные поля (${fieldsText}) для варианта:\n${variantName}`)
      return
    }
  }
  
  savingVariants.value = true
  try {
    // Создаем вариации последовательно (только новые)
    for (const variant of variantsToSave) {
      // Финальная проверка - убеждаемся что вариант еще не существует (гарантированная защита)
      if (variant.attribute_value_ids) {
        const variantKey = [...variant.attribute_value_ids].sort((a, b) => a - b).join('-')
        if (existingKeys.has(variantKey)) {
          continue // Пропускаем существующий вариант, не отправляем в payload
        }
      }
      
      // Подготовка данных для отправки
      const variantData = {
        name: variant.name || getVariantDisplayName(variant), // Имя варианта (сгенерированное из атрибутов)
        sku: variant.sku.trim(),
        price: Number(variant.price), // Убеждаемся что это число
        stock: variant.stock !== null && variant.stock !== undefined ? Number(variant.stock) : 0,
        description: variant.description?.trim() || null,
        attribute_value_ids: variant.attribute_value_ids
      }
      
      // Создаем вариацию (только если она действительно новая)
      const response = await store_api.post(`products/${product.value.id}/variants`, variantData)
      
      // Если есть изображение, загружаем его
      if (variant.imageFile) {
        const formData = new FormData()
        formData.append('file', variant.imageFile)
        
        await store_api.post(`variants/${response.data.id}/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }
    }
    
    // Перезагружаем товар для обновления списка вариаций
    await loadProduct(product.value.id)
    
    // Закрываем форму
    closeAddVariant()
    
    // Уведомляем родительский компонент
    emit('product-updated')
    
    alert('Вариации успешно добавлены!')
  } catch (error) {
    console.error('Ошибка сохранения вариаций:', error)
    alert('Ошибка при сохранении вариаций')
  } finally {
    savingVariants.value = false
  }
}

// Отслеживание изменений
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.productId) {
    loadProduct(props.productId)
  } else if (!newValue) {
    // Сбрасываем выбранные значения при закрытии
    selectedValues.value = {}
  }
})

watch(() => props.productId, (newValue) => {
  if (props.isOpen && newValue) {
    loadProduct(newValue)
  }
})

watch(() => props.variantId, (newValue) => {
  if (props.isOpen && props.productId && newValue && product.value) {
    // Переинициализируем выбранные значения при изменении variantId
    const variantId = Number(newValue)
    const variant = product.value.variants.find(v => v.id === variantId)
    if (variant && variant.attribute_value_ids) {
      selectedValues.value = {}
      variant.attribute_value_ids.forEach(valueId => {
        Object.keys(product.value.facets || {}).forEach(attrId => {
          const facet = product.value.facets[attrId]
          if (facet && facet.values && facet.values.some(val => val.id === valueId)) {
            selectedValues.value[attrId] = valueId
          }
        })
      })
    }
  }
})
</script>

<style scoped>
/* Дополнительные стили для модального окна */
.max-h-\[90vh\] {
  max-height: 90vh;
}
</style>
