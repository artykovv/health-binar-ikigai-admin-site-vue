<template>
  <!-- Модальное окно редактирования варианта -->
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click="closeModal">
    <div class="flex min-h-full items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/40 transition-opacity" @click="closeModal"></div>
      
      <!-- Modal content -->
      <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Редактирование варианта
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

          <div v-else class="space-y-6">
            <!-- Tabs -->
            <div class="border-b border-gray-200 dark:border-gray-600">
              <nav class="flex space-x-8">
                <button
                  @click="activeTab = 'details'"
                  :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'details'
                      ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  ]"
                >
                  Данные варианта
                </button>
                <button
                  @click="activeTab = 'images'"
                  :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === 'images'
                      ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  ]"
                >
                  Изображения
                </button>
              </nav>
            </div>

            <!-- Tab Content: Details -->
            <div v-if="activeTab === 'details'" class="space-y-4">
              <!-- SKU -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SKU
                </label>
                <input
                  v-model="form.sku"
                  type="text"
                  class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                  placeholder="TSH-1"
                />
              </div>

              <!-- Price -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Цена
                </label>
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                  placeholder="1990"
                />
              </div>

              <!-- Stock -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Остаток
                </label>
                <input
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                  placeholder="10"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Описание
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                  placeholder="Описание варианта"
                ></textarea>
              </div>

              <!-- Save button -->
              <div class="flex justify-end">
                <button
                  @click="saveDetails"
                  :disabled="submitting"
                  class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  <span v-if="submitting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Сохранить изменения
                </button>
              </div>
            </div>

            <!-- Tab Content: Images -->
            <div v-if="activeTab === 'images'" class="space-y-4">
              <!-- Upload new image -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Загрузить новое изображение
                </label>
                <input
                  @change="handleFileSelect"
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                />
                <button
                  @click="$refs.fileInput.click()"
                  class="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Выбрать файл
                </button>
                <span v-if="selectedFile" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {{ selectedFile.name }}
                </span>
              </div>

              <!-- Upload button -->
              <div v-if="selectedFile" class="flex justify-end">
                <button
                  @click="uploadImage"
                  :disabled="uploading"
                  class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  <span v-if="uploading" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Загрузить изображение
                </button>
              </div>

              <!-- Images list -->
              <div v-if="images.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div v-for="image in images" :key="image.id" class="relative group">
                  <img :src="getImageUrl(image.src)" :alt="image.alt" class="w-full h-32 object-cover rounded-lg" />
                  <button
                    @click="deleteImage(image.id)"
                    class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
                Нет изображений
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { store_api } from '@/api'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  variantId: {
    type: [String, Number],
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'variant-updated'])

// Реактивные данные
const loading = ref(false)
const submitting = ref(false)
const uploading = ref(false)
const activeTab = ref('details')
const images = ref([])
const selectedFile = ref(null)
const fileInput = ref(null)

const form = ref({
  sku: '',
  price: 0,
  stock: 0,
  description: ''
})

// Методы
const loadVariantData = async () => {
  if (!props.variantId) return
  
  try {
    loading.value = true
    const response = await store_api.get(`variants/${props.variantId}/`)
    
    // Заполняем форму
    form.value = {
      sku: response.data.sku || '',
      price: response.data.price || 0,
      stock: response.data.stock || 0,
      description: response.data.description || ''
    }
    
    // Загружаем изображения
    images.value = response.data.images || []
  } catch (error) {
    console.error('Ошибка загрузки данных варианта:', error)
  } finally {
    loading.value = false
  }
}

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0]
}

const uploadImage = async () => {
  if (!selectedFile.value) return
  
  try {
    uploading.value = true
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    const response = await store_api.post(`variants/${props.variantId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    // Добавляем новое изображение в список
    images.value.push(response.data)
    selectedFile.value = null
    fileInput.value.value = ''
    
    // Показываем уведомление
    alert('Изображение загружено!')
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error)
    alert('Ошибка загрузки изображения')
  } finally {
    uploading.value = false
  }
}

const deleteImage = async (imageId) => {
  if (!confirm('Вы уверены, что хотите удалить это изображение?')) return
  
  try {
    await store_api.delete(`variants/images/${imageId}`)
    images.value = images.value.filter(img => img.id !== imageId)
    alert('Изображение удалено!')
  } catch (error) {
    console.error('Ошибка удаления изображения:', error)
    alert('Ошибка удаления изображения')
  }
}

const saveDetails = async () => {
  try {
    submitting.value = true
    await store_api.patch(`variants/${props.variantId}`, form.value)
    alert('Изменения сохранены!')
    emit('variant-updated')
    emit('close')
  } catch (error) {
    console.error('Ошибка сохранения:', error)
    alert('Ошибка сохранения изменений')
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  emit('close')
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  const baseUrl = import.meta.env.VITE_STORE_API_URL || 'http://127.0.0.1:8000'
  return `${baseUrl}${imagePath}`
}

// Отслеживание открытия модального окна
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.variantId) {
    activeTab.value = 'details'
    selectedFile.value = null
    loadVariantData()
  }
})

watch(() => props.variantId, (newValue) => {
  if (props.isOpen && newValue) {
    loadVariantData()
  }
})
</script>

<style scoped>
.max-h-\[90vh\] {
  max-height: 90vh;
}
</style>
