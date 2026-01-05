<template>
  <!-- Universal Image Upload Modal -->
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click="closeModal">
    <div class="flex min-h-full items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/40 transition-opacity" @click="closeModal"></div>
      
      <!-- Modal content -->
      <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ title || 'Загрузка изображения' }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="space-y-6">
            
            <!-- Uploaded Image Preview (if exists) -->
            <div v-if="uploadedImage" class="space-y-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Загруженное изображение
              </label>
              
              <div class="relative group max-w-md mx-auto">
                <img 
                  :src="uploadedImage.url" 
                  :alt="uploadedImage.filename"
                  class="w-full h-64 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                />
                
                <!-- Delete button -->
                <button
                  @click="removeUploadedImage"
                  type="button"
                  class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                
                <!-- Image info -->
                <div class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Имя файла:</strong> {{ uploadedImage.filename }}
                  </p>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Размер:</strong> {{ formatFileSize(uploadedImage.size) }}
                  </p>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Тип:</strong> {{ uploadedImage.content_type }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 break-all">
                    <strong>URL:</strong> {{ uploadedImage.url }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <strong>ID:</strong> {{ uploadedImage.id }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Upload Area (shown when no image uploaded) -->
            <div v-else>
              <div
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                :class="[
                  'border-2 border-dashed rounded-lg p-12 text-center transition-colors',
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                ]">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileSelect"
                  class="hidden"
                />
                
                <div class="space-y-3">
                  <svg class="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <p class="text-base text-gray-600 dark:text-gray-300">
                    <button @click="$refs.fileInput.click()" type="button" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                      Выберите файл
                    </button>
                    или перетащите его сюда
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF до 10MB
                  </p>
                </div>
                
                <!-- Upload Progress -->
                <div v-if="uploading" class="mt-6">
                  <div class="flex items-center justify-center gap-3">
                    <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">Загрузка... {{ uploadProgress }}%</span>
                  </div>
                  <div class="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all" :style="{ width: uploadProgress + '%' }"></div>
                  </div>
                </div>
              </div>
              
              <!-- Error message -->
              <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
            {{ uploadedImage ? 'Закрыть' : 'Отмена' }}
          </button>
          <button
            v-if="uploadedImage"
            @click="confirmUpload"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Использовать изображение
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storage_api } from '@/api'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Загрузка изображения'
  },
  directory: {
    type: String,
    default: 'documents'
  }
})

// Emits
const emit = defineEmits(['close', 'uploaded'])

// Реактивные данные
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadedImage = ref(null)
const errorMessage = ref('')
const fileInput = ref(null)

// Методы
const closeModal = () => {
  if (!uploading.value) {
    resetState()
    emit('close')
  }
}

const resetState = () => {
  isDragging.value = false
  uploading.value = false
  uploadProgress.value = 0
  uploadedImage.value = null
  errorMessage.value = ''
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    uploadFile(file)
  }
  // Reset input
  event.target.value = ''
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    uploadFile(file)
  } else {
    errorMessage.value = 'Пожалуйста, выберите файл изображения'
  }
}

const uploadFile = async (file) => {
  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = 'Файл слишком большой. Максимальный размер: 10MB'
    return
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Пожалуйста, выберите файл изображения'
    return
  }
  
  errorMessage.value = ''
  uploading.value = true
  uploadProgress.value = 0
  
  try {
    // Create FormData
    const formData = new FormData()
    formData.append('file', file)
    
    // Upload with progress tracking
    const response = await storage_api.post(
      `/files/upload?directory=${props.directory}&use_multipart=false`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'accept': 'application/json'
        },
        onUploadProgress: (progressEvent) => {
          uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      }
    )
    
    // Store uploaded image data
    uploadedImage.value = {
      id: response.data.id,
      url: response.data.url,
      filename: response.data.filename,
      size: response.data.size,
      content_type: response.data.content_type
    }
    
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error)
    errorMessage.value = error.response?.data?.detail || 'Ошибка загрузки изображения'
  } finally {
    uploading.value = false
  }
}

const removeUploadedImage = () => {
  uploadedImage.value = null
  uploadProgress.value = 0
}

const confirmUpload = () => {
  if (uploadedImage.value) {
    emit('uploaded', {
      id: uploadedImage.value.id,
      url: uploadedImage.value.url,
      filename: uploadedImage.value.filename,
      size: uploadedImage.value.size,
      content_type: uploadedImage.value.content_type
    })
    resetState()
    emit('close')
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>

<style scoped>
.max-h-\[90vh\] {
  max-height: 90vh;
}
</style>
