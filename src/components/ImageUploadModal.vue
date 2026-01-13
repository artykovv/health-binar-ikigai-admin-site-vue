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
            
                <!-- Uploaded Image/File Preview (if exists) -->
            <div v-if="uploadedImage" class="space-y-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Загруженный файл
              </label>
              
              <div class="relative group max-w-md mx-auto">
                <!-- Image Preview -->
                <img 
                  v-if="isImage(uploadedImage)"
                  :src="uploadedImage.url" 
                  :alt="uploadedImage.filename"
                  class="w-full h-64 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                />
                
                <!-- PDF Preview/Icon -->
                <div v-else class="w-full h-64 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                  <svg class="w-16 h-16 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ uploadedImage.filename }}</p>
                  <a :href="uploadedImage.url" target="_blank" class="text-xs text-blue-600 hover:underline mt-1">Открыть PDF</a>
                </div>
                
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
                  <!-- URL Input for copying -->
                  <div class="mb-2">
                    <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">URL (src)</label>
                    <div class="flex gap-2">
                      <input 
                        type="text" 
                        readonly 
                        :value="uploadedImage.url" 
                        class="flex-1 text-xs p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 pointer-events-none select-all"
                      >
                      <button 
                        @click="copyUrl(uploadedImage.url)" 
                        class="px-3 py-1 bg-black text-white text-xs rounded hover:bg-gray-800"
                      >
                        Копировать
                      </button>
                    </div>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Размер:</strong> {{ formatFileSize(uploadedImage.size) }}
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
                  'border-2 border-dashed rounded-[24px] p-12 text-center transition-colors',
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white'
                ]">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*,application/pdf"
                  @change="handleFileSelect"
                  class="hidden"
                />
                
                <div class="space-y-3">
                  <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="text-base text-gray-600 dark:text-gray-300">
                    <button @click="$refs.fileInput.click()" type="button" class="font-bold text-black dark:text-white underline">
                      Выберите файл
                    </button>
                    или перетащите его сюда
                  </p>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    PNG, JPG, PDF до 10MB
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
              <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
                <p class="text-sm text-red-800 dark:text-red-200 font-medium">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">
            {{ uploadedImage ? 'Закрыть' : 'Отмена' }}
          </button>
          <button
            v-if="uploadedImage"
            @click="confirmUpload"
            class="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-xl text-sm font-bold hover:scale-105 transition-transform active:scale-95">
            Использовать URL
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
    default: 'Загрузка файла'
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

const copyUrl = (url) => {
  navigator.clipboard.writeText(url)
  alert('URL скопирован!')
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
  if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
    uploadFile(file)
  } else {
    errorMessage.value = 'Пожалуйста, выберите файл изображения или PDF'
  }
}

const uploadFile = async (file) => {
  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = 'Файл слишком большой. Максимальный размер: 10MB'
    return
  }
  
  // Validate file type
  if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
    errorMessage.value = 'Пожалуйста, выберите файл изображения или PDF'
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
      content_type: response.data.content_type || file.type
    }
    
  } catch (error) {
    console.error('Ошибка загрузки файла:', error)
    errorMessage.value = error.response?.data?.detail || 'Ошибка загрузки файла'
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
      url: uploadedImage.value.url,
      filename: uploadedImage.value.filename,
      content_type: uploadedImage.value.content_type
      // We pass the URL back to the parent to fill the "src" field
    })
    resetState()
    emit('close')
  }
}

const isImage = (file) => {
  return file.content_type?.startsWith('image/') || 
         file.filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
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
