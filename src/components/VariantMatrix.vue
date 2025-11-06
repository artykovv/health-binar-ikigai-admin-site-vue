<template>
  <div class="variant-matrix">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <!-- Динамические колонки для атрибутов -->
                <th v-for="attribute in attributes" :key="attribute.id" 
                    class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">
                  {{ attribute.name }}
                </th>
                <!-- Статические колонки -->
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">SKU</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цена</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Остаток</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Описание</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Изображение</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-for="(variant, index) in variants" :key="getRowKey(variant.attribute_value_ids)" 
                  :class="[
                    'hover:bg-gray-50 dark:hover:bg-[#4a4a52]',
                    isVariantExists(variant.attribute_value_ids) ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                  ]">
                <!-- Значения атрибутов -->
                <td v-for="attribute in attributes" :key="attribute.id" 
                    class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <span v-if="!isVariantExists(variant.attribute_value_ids)">{{ getAttributeValueByIndex(attribute, index) }}</span>
                  <span v-else class="text-xs text-yellow-600 dark:text-yellow-400">{{ getAttributeValueByIndex(attribute, index) }}</span>
                </td>
                <!-- SKU -->
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div v-if="isVariantExists(variant.attribute_value_ids)" class="flex items-center gap-2">
                    <span class="text-xs text-yellow-600 dark:text-yellow-400 font-medium">✓ Уже существует</span>
                  </div>
                  <input v-else v-model="variants[index].sku" type="text" 
                         :disabled="isVariantExists(variant.attribute_value_ids)"
                         class="block w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                         placeholder="SKU">
                </td>
                <!-- Цена -->
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <input v-model.number="variants[index].price" type="number" min="0" step="0.01"
                         :disabled="isVariantExists(variant.attribute_value_ids)"
                         class="block w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                         placeholder="Цена">
                </td>
                <!-- Остаток -->
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <input v-model.number="variants[index].stock" type="number" min="0"
                         :disabled="isVariantExists(variant.attribute_value_ids)"
                         class="block w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                         placeholder="Остаток">
                </td>
                <!-- Описание -->
                <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  <input v-model="variants[index].description" type="text" 
                         :disabled="isVariantExists(variant.attribute_value_ids)"
                         class="block w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                         placeholder="Описание">
                </td>
                <!-- Изображение -->
                <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  <div v-if="isVariantExists(variant.attribute_value_ids)" class="text-xs text-gray-500 dark:text-gray-400">
                    -
                  </div>
                  <div v-else class="flex items-center gap-2">
                    <input 
                      :id="`image-${index}`"
                      type="file" 
                      accept="image/*"
                      @change="(e) => handleImageChange(index, e)"
                      class="hidden"
                    >
                    <label 
                      :for="`image-${index}`"
                      class="cursor-pointer text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    >
                      Выбрать
                    </label>
                    <img 
                      v-if="variants[index].imagePreview" 
                      :src="variants[index].imagePreview" 
                      class="h-10 w-10 object-cover rounded border border-gray-300 dark:border-gray-600"
                      alt="Preview"
                    />
                  </div>
                </td>
                <!-- Действия -->
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <button 
                    v-if="!isVariantExists(variant.attribute_value_ids)"
                    type="button" 
                    @click="removeVariant(index)" 
                    class="inline-flex items-center rounded-md bg-red-600 px-2 py-1 text-white text-xs hover:bg-red-700"
                    title="Удалить вариант">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                  <span v-else class="text-xs text-gray-400 dark:text-gray-500">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Сообщение если нет комбинаций -->
    <div v-if="variants.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      Выберите атрибуты для создания вариантов
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'

// Props
const props = defineProps({
  attributes: {
    type: Array,
    default: () => []
  },
  existingVariants: {
    type: Array,
    default: () => []
  },
  productName: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['update:variants'])

// Реактивные данные для вариантов
const variants = ref([])

// Вычисляемые комбинации атрибутов
const combinations = computed(() => {
  if (props.attributes.length === 0) return []
  
  let result = [{}]
  
  props.attributes.forEach(attr => {
    const newResult = []
    attr.values.forEach(val => {
      result.forEach(comb => {
        newResult.push({ ...comb, [attr.id]: val.id })
      })
    })
    result = newResult
  })
  
  return result
})

// Генерация названия варианта из значений атрибутов
const generateVariantName = (attributeValueIds, productName = '') => {
  if (!attributeValueIds || attributeValueIds.length === 0) return productName
  
  const attributeNames = []
  props.attributes.forEach(attr => {
    const valueId = attributeValueIds.find(id => 
      attr.values.some(val => val.id === id)
    )
    if (valueId) {
      const value = attr.values.find(val => val.id === valueId)
      if (value) {
        attributeNames.push(value.value)
      }
    }
  })
  
  // Возвращаем полное название: название товара + значения атрибутов
  if (productName) {
    return `${productName} ${attributeNames.join(' ')}`
  }
  
  return attributeNames.join(' ')
}

// Инициализация вариантов при изменении комбинаций
watch(combinations, (newCombinations) => {
  variants.value = newCombinations.map((combination, index) => {
    const attributeValueIds = Object.values(combination)
    return {
      name: generateVariantName(attributeValueIds, props.productName),
      sku: '',
      price: null,
      stock: null,
      description: '',
      imageFile: null,
      imagePreview: null,
      attribute_value_ids: attributeValueIds
    }
  })
  
  // Эмитим обновленные варианты
  emit('update:variants', variants.value)
}, { immediate: true })

// Отслеживание изменений в вариантах
watch(variants, (newVariants) => {
  // Обновляем имя варианта при изменении атрибутов
  newVariants.forEach(variant => {
    if (variant.attribute_value_ids) {
      variant.name = generateVariantName(variant.attribute_value_ids, props.productName)
    }
  })
  emit('update:variants', newVariants)
}, { deep: true })

// Отслеживание изменений названия товара
watch(() => props.productName, () => {
  variants.value.forEach(variant => {
    if (variant.attribute_value_ids) {
      variant.name = generateVariantName(variant.attribute_value_ids, props.productName)
    }
  })
  emit('update:variants', variants.value)
})

// Получение значения атрибута по ID
const getAttributeValue = (attribute, valueId) => {
  const value = attribute.values.find(v => v.id === valueId)
  return value?.value || ''
}

// Получение значения атрибута по индексу в массиве attribute_value_ids
const getAttributeValueByIndex = (attribute, variantIndex) => {
  const variant = variants.value[variantIndex]
  if (!variant || !variant.attribute_value_ids) return ''
  
  // Находим значение атрибута в массиве attribute_value_ids
  const valueId = variant.attribute_value_ids.find(id => 
    attribute.values.some(val => val.id === id)
  )
  
  return getAttributeValue(attribute, valueId)
}

// Генерация ключа для строки
const getRowKey = (attributeValueIds) => {
  return Array.isArray(attributeValueIds) 
    ? attributeValueIds.join('-') 
    : Object.values(attributeValueIds).join('-')
}

// Проверка, существует ли вариант с такой комбинацией атрибутов
const isVariantExists = (attributeValueIds) => {
  if (!props.existingVariants || !attributeValueIds || props.existingVariants.length === 0) return false
  
  // Сортируем массивы для сравнения (порядок не важен)
  const sortedNew = [...attributeValueIds].sort((a, b) => a - b)
  
  return props.existingVariants.some(existingVariant => {
    if (!existingVariant.attribute_value_ids) return false
    const sortedExisting = [...existingVariant.attribute_value_ids].sort((a, b) => a - b)
    
    // Сравниваем массивы
    if (sortedNew.length !== sortedExisting.length) return false
    
    return sortedNew.every((id, index) => id === sortedExisting[index])
  })
}

// Удаление варианта
const removeVariant = (index) => {
  variants.value.splice(index, 1)
  emit('update:variants', variants.value)
}

// Обработка загрузки изображения
const handleImageChange = (index, event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const variant = variants.value[index]
  if (!variant) return
  
  variant.imageFile = file
  
  // Создаем preview
  const reader = new FileReader()
  reader.onload = (e) => {
    variant.imagePreview = e.target.result
    // Эмитим обновленные варианты после изменения изображения
    emit('update:variants', variants.value)
  }
  reader.readAsDataURL(file)
}
</script>

<style scoped>
.variant-matrix {
  @apply w-full;
}

/* Стили для input полей в таблице */
input[type="text"], input[type="number"] {
  @apply min-w-0;
}

/* Убираем стрелки у number input */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
