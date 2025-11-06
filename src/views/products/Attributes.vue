<template>
  <div>
    <div>
      <div>
        <div class="flex items-center justify-between mb-3">
          <h1 class="dark:text-white">Атрибуты товаров</h1>
          <button @click="openAddAttributeModal" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Добавить атрибут</button>
        </div>
      
      <!-- Загрузка -->
      <div v-if="loading" class="py-6 text-center">
        <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
      </div>
      
        <!-- Таблица атрибутов (Tailwind) -->
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Значения</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="attribute in attributes" :key="attribute.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ attribute.name }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">
                      <div class="flex flex-wrap gap-1">
                        <span v-for="value in attribute.values" :key="value.id" 
                              class="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-600 px-2 py-1 text-xs text-gray-800 dark:text-gray-200">
                          {{ value.value }}
                          <button @click="deleteValue(value.id, attribute.id)" 
                                  class="ml-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </span>
                        <span v-if="!attribute.values || attribute.values.length === 0" 
                              class="text-xs text-gray-500 dark:text-gray-400 italic">Нет значений</span>
                      </div>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <button @click="openEditAttributeModal(attribute)" 
                              class="inline-flex items-center rounded-md bg-gray-800 dark:bg-gray-600 px-3 py-2 text-white text-xs hover:bg-gray-700 dark:hover:bg-gray-500 mr-2">Редактировать</button>
                      <button @click="openAddValueModal(attribute)" 
                              class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-white text-xs hover:bg-green-700 mr-2">Добавить значение</button>
                      <button @click="openDeleteAttributeModal(attribute)" 
                              class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-white text-xs hover:bg-red-700">Удалить</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div v-if="attributes.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          Атрибуты не найдены
        </div>
      </div>
    </div>
    
    <!-- Модальное окно добавления атрибута -->
    <div v-if="addAttributeModal.visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeAddAttributeModal"></div>
      <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="px-4 py-3 border-b dark:border-gray-700">
          <h5 class="m-0 dark:text-white">Добавить атрибут</h5>
        </div>
        <div class="p-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Название атрибута</label>
            <input v-model="addAttributeModal.name" type="text" 
                   class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                   placeholder="Например: Цвет, Размер">
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <button @click="closeAddAttributeModal" 
                  class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">
            Отмена
          </button>
          <button @click="addAttribute" :disabled="!addAttributeModal.name.trim() || adding"
                  class="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
            <span v-if="adding" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
            Добавить
          </button>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно добавления значений -->
    <div v-if="addValueModal.visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeAddValueModal"></div>
      <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="px-4 py-3 border-b dark:border-gray-700">
          <h5 class="m-0 dark:text-white">Добавить значения для "{{ addValueModal.attribute?.name }}"</h5>
        </div>
        <div class="p-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Значения (через запятую)</label>
            <textarea v-model="addValueModal.values" 
                      class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                      rows="3"
                      placeholder="Например: S, M, L, XL"></textarea>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <button @click="closeAddValueModal" 
                  class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">
            Отмена
          </button>
          <button @click="addValues" :disabled="!addValueModal.values.trim() || adding"
                  class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-40">
            <span v-if="adding" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
            Добавить
          </button>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно подтверждения удаления атрибута -->
    <div v-if="deleteAttributeModal.visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeDeleteAttributeModal"></div>
      <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="px-4 py-3 border-b dark:border-gray-700">
          <h5 class="m-0 dark:text-white">Подтверждение</h5>
        </div>
        <div class="p-4 text-sm text-gray-700 dark:text-white">
          <p class="mb-2">Удалить атрибут "{{ deleteAttributeModal.attribute?.name }}"?</p>
          <p>Это действие удалит атрибут и все его значения. Действие необратимо.</p>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <button @click="closeDeleteAttributeModal" 
                  class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">
            Отмена
          </button>
          <button @click="confirmDeleteAttribute" :disabled="deleting"
                  class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-40">
            <span v-if="deleting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
            Удалить
          </button>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно ошибки удаления -->
    <div v-if="errorModal.visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeErrorModal"></div>
      <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="px-4 py-3 border-b border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900">
          <h5 class="m-0 text-yellow-800 dark:text-yellow-200">
            <svg class="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            Невозможно удалить
          </h5>
        </div>
        <div class="p-4 text-sm text-gray-700 dark:text-white">
          <p class="mb-2">{{ errorModal.message }}</p>
          <p class="text-gray-600 dark:text-gray-400">
            Элемент используется в вариантах товаров. Удалите его из всех вариантов перед удалением.
          </p>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <button @click="closeErrorModal" 
                  class="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm text-white hover:bg-yellow-700">
            Понятно
          </button>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно редактирования атрибута -->
    <div v-if="editAttributeModal?.visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeEditAttributeModal"></div>
      <div class="relative z-10 w-full max-w-2xl mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="px-4 py-3 border-b dark:border-gray-700">
          <h5 class="m-0 dark:text-white">Редактирование атрибута "{{ editAttributeModal?.attribute?.name }}"</h5>
        </div>
        <div class="p-4 max-h-96 overflow-y-auto">
          <!-- Tabs -->
          <div class="border-b border-gray-200 dark:border-gray-600 mb-4">
            <nav class="flex space-x-8">
              <button
                @click="editAttributeModal.activeTab = 'name'"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  editAttributeModal?.activeTab === 'name'
                    ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                Название атрибута
              </button>
              <button
                @click="switchToValuesTab"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  editAttributeModal?.activeTab === 'values'
                    ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                Значения
              </button>
            </nav>
          </div>

          <!-- Tab: Название атрибута -->
          <div v-if="editAttributeModal?.activeTab === 'name'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Название атрибута</label>
              <input v-model="editAttributeModal.name" type="text" 
                     class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                     placeholder="Например: Цвет, Размер">
            </div>
            <div class="flex justify-end">
              <button @click="saveAttributeName" :disabled="!editAttributeModal?.name?.trim() || editing"
                      class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-200">
                <span v-if="editing" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Сохранить
              </button>
            </div>
          </div>

          <!-- Tab: Значения -->
          <div v-if="editAttributeModal?.activeTab === 'values'" class="space-y-4">
            <div v-if="editAttributeModal?.loadingValues" class="text-center py-4">
              <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
            </div>
            <div v-else-if="!editAttributeModal?.values || editAttributeModal.values.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
              Нет значений
            </div>
            <div v-else class="space-y-2">
              <div v-for="value in editAttributeModal.values" :key="value.id" class="flex items-center gap-2">
                <input v-model="value.value" type="text" 
                       class="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                       placeholder="Значение">
                <button @click="saveValue(value.id, value.value, editAttributeModal?.attribute?.id)" 
                        :disabled="editingValue === value.id || !value.value.trim()"
                        class="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm">
                  <span v-if="editingValue === value.id" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <span v-else>Сохранить</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <button @click="closeEditAttributeModal" 
                  class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { store_api } from '@/api'

// Реактивные данные
const attributes = ref([])
const loading = ref(false)
const adding = ref(false)
const deleting = ref(false)
const editing = ref(false)
const editingValue = ref(null)

// Модальные окна
const addAttributeModal = ref({ visible: false, name: '' })
const addValueModal = ref({ visible: false, attribute: null, values: '' })
const deleteAttributeModal = ref({ visible: false, attribute: null })
const editAttributeModal = ref({ 
  visible: false, 
  attribute: null, 
  name: '', 
  activeTab: 'name',
  values: [],
  loadingValues: false
})

// Загрузка атрибутов
const loadAttributes = async () => {
  loading.value = true
  try {
    const response = await store_api.get('attributes/?skip=0&limit=100')
    attributes.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки атрибутов:', error)
  } finally {
    loading.value = false
  }
}

// Добавление атрибута
const openAddAttributeModal = () => {
  addAttributeModal.value = { visible: true, name: '' }
}

const closeAddAttributeModal = () => {
  addAttributeModal.value = { visible: false, name: '' }
}

const addAttribute = async () => {
  if (!addAttributeModal.value.name.trim()) return
  
  adding.value = true
  try {
    await store_api.post('attributes/', {
      name: addAttributeModal.value.name.trim()
    })
    await loadAttributes()
    closeAddAttributeModal()
  } catch (error) {
    console.error('Ошибка добавления атрибута:', error)
  } finally {
    adding.value = false
  }
}

// Добавление значений
const openAddValueModal = (attribute) => {
  addValueModal.value = { visible: true, attribute, values: '' }
}

const closeAddValueModal = () => {
  addValueModal.value = { visible: false, attribute: null, values: '' }
}

const addValues = async () => {
  if (!addValueModal.value.values.trim() || !addValueModal.value.attribute) return
  
  adding.value = true
  try {
    const values = addValueModal.value.values.split(',').map(v => v.trim()).filter(v => v)
    await store_api.post(`attributes/${addValueModal.value.attribute.id}/values/`, {
      values
    })
    await loadAttributes()
    closeAddValueModal()
  } catch (error) {
    console.error('Ошибка добавления значений:', error)
  } finally {
    adding.value = false
  }
}

// Модальное окно ошибки удаления
const errorModal = ref({ visible: false, message: '' })

// Удаление значения
const deleteValue = async (valueId, attributeId) => {
  try {
    await store_api.delete(`attributes/${attributeId}/values/${valueId}`)
    await loadAttributes()
  } catch (error) {
    console.error('Ошибка удаления значения:', error)
    // Показываем ошибку если значение используется
    if (error.response?.data?.detail) {
      errorModal.value = {
        visible: true,
        message: error.response.data.detail
      }
    } else {
      errorModal.value = {
        visible: true,
        message: 'Ошибка при удалении значения'
      }
    }
  }
}

// Закрытие модального окна ошибки
const closeErrorModal = () => {
  errorModal.value = { visible: false, message: '' }
}

// Удаление атрибута
const openDeleteAttributeModal = (attribute) => {
  deleteAttributeModal.value = { visible: true, attribute }
}

const closeDeleteAttributeModal = () => {
  deleteAttributeModal.value = { visible: false, attribute: null }
}

const confirmDeleteAttribute = async () => {
  if (!deleteAttributeModal.value.attribute) return
  
  deleting.value = true
  try {
    await store_api.delete(`attributes/${deleteAttributeModal.value.attribute.id}`)
    await loadAttributes()
    closeDeleteAttributeModal()
  } catch (error) {
    console.error('Ошибка удаления атрибута:', error)
    // Показываем ошибку если атрибут используется
    if (error.response?.data?.detail) {
      closeDeleteAttributeModal()
      errorModal.value = {
        visible: true,
        message: error.response.data.detail
      }
    } else {
      errorModal.value = {
        visible: true,
        message: 'Ошибка при удалении атрибута'
      }
    }
  } finally {
    deleting.value = false
  }
}

// Редактирование атрибута
const openEditAttributeModal = (attribute) => {
  editAttributeModal.value = {
    visible: true,
    attribute,
    name: attribute.name,
    activeTab: 'name',
    values: [],
    loadingValues: false
  }
}

// Переключение на таб "Значения"
const switchToValuesTab = async () => {
  editAttributeModal.value.activeTab = 'values'
  // Загружаем значения только если они еще не загружены
  if (editAttributeModal.value.values.length === 0 && editAttributeModal.value.attribute) {
    await loadAttributeValues(editAttributeModal.value.attribute.id)
  }
}

const closeEditAttributeModal = () => {
  editAttributeModal.value = {
    visible: false,
    attribute: null,
    name: '',
    activeTab: 'name',
    values: [],
    loadingValues: false
  }
  editing.value = false
  editingValue.value = null
}

// Загрузка значений атрибута
const loadAttributeValues = async (attributeId) => {
  editAttributeModal.value.loadingValues = true
  try {
    const response = await store_api.get(`attributes/${attributeId}/values/`)
    editAttributeModal.value.values = response.data
  } catch (error) {
    console.error('Ошибка загрузки значений:', error)
  } finally {
    editAttributeModal.value.loadingValues = false
  }
}

// Сохранение названия атрибута
const saveAttributeName = async () => {
  if (!editAttributeModal.value.name.trim() || !editAttributeModal.value.attribute) return
  
  editing.value = true
  try {
    await store_api.patch(`attributes/${editAttributeModal.value.attribute.id}`, {
      name: editAttributeModal.value.name.trim()
    })
    await loadAttributes()
    closeEditAttributeModal()
  } catch (error) {
    console.error('Ошибка сохранения названия:', error)
  } finally {
    editing.value = false
  }
}

// Сохранение значения
const saveValue = async (valueId, newValue, attributeId) => {
  if (!newValue.trim()) return
  
  editingValue.value = valueId
  try {
    await store_api.patch(`attributes/${attributeId}/values/${valueId}`, {
      value: newValue.trim()
    })
    await loadAttributeValues(attributeId)
    await loadAttributes() // Обновляем основной список тоже
  } catch (error) {
    console.error('Ошибка сохранения значения:', error)
  } finally {
    editingValue.value = null
  }
}

// Загрузка при монтировании
onMounted(() => {
  loadAttributes()
})
</script>
