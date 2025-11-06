<template>
  <div class="product-page">
    <div v-if="loading" class="flex justify-center items-center min-h-96">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
    </div>

    <div v-else-if="!product" class="text-center py-8 text-gray-500 dark:text-gray-400">
      Товар не найден
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Изображение товара -->
        <div class="space-y-4">
          <div class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img 
              :src="getImageUrl(selectedVariant?.images?.[0]?.src) || '/placeholder.jpg'" 
              :alt="selectedVariant?.images?.[0]?.alt || product.name"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Информация о товаре -->
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ selectedVariant ? selectedVariant.variant_name : product.name }}
            </h1>
            <p class="text-gray-600 dark:text-gray-300 text-lg">
              {{ product.description }}
            </p>
          </div>

          <!-- Атрибуты товара -->
          <div v-for="(facet, attrId) in product.facets" :key="attrId" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ facet.name }}:
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="val in facet.values"
                  :key="val.id"
                  @click="handleSelect(attrId, val.id)"
                  :disabled="!val.available"
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

          <!-- Цена и остаток -->
          <div v-if="selectedVariant" class="space-y-4">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
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

            <!-- Кнопка добавления в корзину -->
            <button 
              @click="addToCart"
              :disabled="selectedVariant.stock === 0"
              class="w-full bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {{ selectedVariant.stock === 0 ? 'Нет в наличии' : 'В корзину' }}
            </button>
          </div>

          <!-- Сообщение о необходимости выбора атрибутов -->
          <div v-else class="text-gray-500 dark:text-gray-400 text-center py-4">
            Выберите все атрибуты для просмотра цены и добавления в корзину
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { store_api } from '../../api'

// Реактивные данные
const product = ref(null)
const loading = ref(true)
const selectedValues = ref({})

// Получение параметров маршрута
const route = useRoute()

// Вычисляемые свойства
const selectedVariant = computed(() => {
  if (!product.value || Object.keys(selectedValues.value).length === 0) return null
  
  // Ищем вариант с выбранными атрибутами
  return product.value.variants.find(variant => {
    return variant.attribute_value_ids.every(id => 
      Object.values(selectedValues.value).includes(id)
    )
  })
})

// Методы
const loadProduct = async (productId) => {
  try {
    loading.value = true
    const response = await store_api.get(`/products/${productId}`)
    product.value = response.data
    
    // Инициализируем выбранные значения
    selectedValues.value = {}
    
    // Если передан variant_id, выбираем соответствующий вариант
    if (route.query.variant_id) {
      const variantId = parseInt(route.query.variant_id)
      const variant = product.value.variants.find(v => v.id === variantId)
      if (variant) {
        // Устанавливаем значения для выбранного варианта
        variant.attribute_value_ids.forEach(valueId => {
          Object.keys(product.value.facets).forEach(attrId => {
            const facet = product.value.facets[attrId]
            if (facet.values.some(val => val.id === valueId)) {
              selectedValues.value[attrId] = valueId
            }
          })
        })
      }
    } else {
      // Если передан только product_id, выбираем вариант с минимальным ID
      const minVariant = product.value.variants.reduce((min, variant) => 
        variant.id < min.id ? variant : min
      )
      if (minVariant) {
        minVariant.attribute_value_ids.forEach(valueId => {
          Object.keys(product.value.facets).forEach(attrId => {
            const facet = product.value.facets[attrId]
            if (facet.values.some(val => val.id === valueId)) {
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

const handleSelect = (attrId, valueId) => {
  selectedValues.value[attrId] = valueId
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  // Если путь уже содержит полный URL, возвращаем как есть
  if (imagePath.startsWith('http')) return imagePath
  // Добавляем базовый URL API
  const baseUrl = import.meta.env.VITE_STORE_API_URL || 'http://127.0.0.1:8000'
  return `${baseUrl}${imagePath}`
}

const addToCart = () => {
  if (!selectedVariant.value) return
  
  // Здесь можно добавить логику добавления в корзину
  console.log('Добавлено в корзину:', {
    id: selectedVariant.value.id,
    sku: selectedVariant.value.sku,
    variant_name: selectedVariant.value.variant_name,
    price: selectedVariant.value.final_price || selectedVariant.value.price,
  })
  
  // Показываем уведомление (можно заменить на toast)
  alert('Товар добавлен в корзину!')
}

// Инициализация
onMounted(() => {
  const productId = route.params.id
  if (productId) {
    loadProduct(productId)
  }
})

// Отслеживание изменений параметров маршрута
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadProduct(newId)
  }
})
</script>

<style scoped>
.product-page {
  min-height: calc(100vh - 200px);
}

/* Стили для select */
select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.dark select:focus {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}
</style>
