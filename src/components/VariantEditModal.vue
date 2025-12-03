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
