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

            <!-- Image Upload Section -->
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Изображения товара
              </label>
              
              <!-- Existing Images -->
              <div v-if="images.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div v-for="(image, index) in images" :key="image.id" class="relative group">
                  <img 
                    :src="getImageUrl(image.src)" 
                    :alt="image.alt || 'Product image'"
                    class="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                  />
                  <!-- Delete button -->
                  <button
                    @click="deleteImage(image.id)"
                    type="button"
                    class="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    :disabled="deletingImageId === image.id"
                  >
                    <svg v-if="deletingImageId !== image.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <div v-else class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  </button>
                  
                  <!-- Image alt text -->
                  <div class="mt-1">
                    <input
                      v-model="image.alt"
                      @blur="updateImageAlt(image)"
                      type="text"
                      placeholder="Alt текст"
                      class="w-full text-xs rounded border border-gray-300 bg-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Upload Area -->
              <div
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                :class="[
                  'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                ]"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleFileSelect"
                  class="hidden"
                />
                
                <div class="space-y-2">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    <button @click="$refs.fileInput.click()" type="button" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                      Выберите файлы
                    </button>
                    или перетащите их сюда
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF до 10MB
                  </p>
                </div>
                
                <!-- Upload Progress -->
                <div v-if="uploadingFiles.length > 0" class="mt-4 space-y-2">
                  <div v-for="(file, index) in uploadingFiles" :key="index" class="flex items-center gap-2 text-sm">
                    <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full transition-all" :style="{ width: file.progress + '%' }"></div>
                    </div>
                    <span class="text-xs text-gray-600 dark:text-gray-400">{{ file.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Fields -->
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

              <!-- Boolean Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- is_binar -->
                <div class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Binar
                  </label>
                  <button
                    @click="form.is_binar = !form.is_binar"
                    type="button"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      form.is_binar ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        form.is_binar ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    ></span>
                  </button>
                </div>

                <!-- is_healthstore -->
                <div class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    HealthStore
                  </label>
                  <button
                    @click="form.is_healthstore = !form.is_healthstore"
                    type="button"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      form.is_healthstore ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        form.is_healthstore ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    ></span>
                  </button>
                </div>

                <!-- is_healthday -->
                <div class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    HealthDay
                  </label>
                  <button
                    @click="form.is_healthday = !form.is_healthday"
                    type="button"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      form.is_healthday ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        form.is_healthday ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    ></span>
                  </button>
                </div>

                <!-- is_active -->
                <div class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Активен
                  </label>
                  <button
                    @click="form.is_active = !form.is_active"
                    type="button"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      form.is_active ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    ]"
                  >
                    <span
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        form.is_active ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    ></span>
                  </button>
                </div>
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

const form = ref({
  sku: '',
  price: 0,
  stock: 0,
  is_binar: false,
  is_healthstore: false,
  is_healthday: false,
  is_active: false
})

// Image upload state
const images = ref([])
const isDragging = ref(false)
const uploadingFiles = ref([])
const deletingImageId = ref(null)
const fileInput = ref(null)

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
      is_binar: response.data.is_binar ?? false,
      is_healthstore: response.data.is_healthstore ?? false,
      is_healthday: response.data.is_healthday ?? false,
      is_active: response.data.is_active ?? false
    }
    
    // Load images
    images.value = response.data.images || []
  } catch (error) {
    console.error('Ошибка загрузки данных варианта:', error)
  } finally {
    loading.value = false
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

// Image handling methods
const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  // Если путь уже содержит полный URL, возвращаем как есть
  if (imagePath.startsWith('http')) return imagePath
  // Добавляем базовый URL API
  const baseUrl = import.meta.env.VITE_STORE_API_URL || 'http://127.0.0.1:8001'
  return `${baseUrl}${imagePath}`
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  uploadFiles(files)
  // Reset input
  event.target.value = ''
}

const handleDrop = (event) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'))
  uploadFiles(files)
}

const uploadFiles = async (files) => {
  for (const file of files) {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert(`Файл ${file.name} слишком большой. Максимальный размер: 10MB`)
      continue
    }
    
    // Add to uploading list
    const uploadingFile = {
      name: file.name,
      progress: 0
    }
    uploadingFiles.value.push(uploadingFile)
    
    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', file.name.split('.')[0]) // Use filename without extension as alt text
      
      // Upload with progress tracking
      const response = await store_api.post(
        `variants/${props.variantId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            uploadingFile.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          }
        }
      )
      
      // Add new image to the list
      images.value.push(response.data)
      
      // Emit update event
      emit('variant-updated')
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error)
      alert(`Ошибка загрузки ${file.name}`)
    } finally {
      // Remove from uploading list
      const index = uploadingFiles.value.indexOf(uploadingFile)
      if (index > -1) {
        uploadingFiles.value.splice(index, 1)
      }
    }
  }
}

const deleteImage = async (imageId) => {
  if (!confirm('Удалить это изображение?')) return
  
  try {
    deletingImageId.value = imageId
    await store_api.delete(`variants/${props.variantId}/images/${imageId}`)
    
    // Remove from local list
    const index = images.value.findIndex(img => img.id === imageId)
    if (index > -1) {
      images.value.splice(index, 1)
    }
    
    // Emit update event
    emit('variant-updated')
  } catch (error) {
    console.error('Ошибка удаления изображения:', error)
    alert('Ошибка удаления изображения')
  } finally {
    deletingImageId.value = null
  }
}

const updateImageAlt = async (image) => {
  try {
    await store_api.patch(
      `variants/${props.variantId}/images/${image.id}`,
      { alt: image.alt }
    )
  } catch (error) {
    console.error('Ошибка обновления alt текста:', error)
  }
}

// Отслеживание открытия модального окна
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.variantId) {
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
