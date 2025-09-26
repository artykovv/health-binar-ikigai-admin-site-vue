<template>
  <div>
    <div>
      <div>
        <div class="flex items-center justify-between mb-3">
          <h1 class="dark:text-white">Филиалы</h1>
          <button @click="openAddModal" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Добавить филиал</button>
        </div>
        
        <!-- Загрузка -->
        <div v-if="loading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        
        <!-- Таблица филиалов (Tailwind) -->
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Код</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Адрес</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Телефон</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="branch in branches" :key="branch.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ branch.code }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ branch.name }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ branch.address }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ branch.phone_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div class="flex items-center">
                        <button
                          type="button"
                          @click="toggleBranchStatus(branch)"
                          role="switch"
                          :aria-checked="branch.is_active ? 'true' : 'false'"
                          :class="[
                            'relative inline-flex h-6 w-11 items-center rounded-full transition',
                            branch.is_active ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'
                          ]"
                        >
                          <span
                            :class="[
                              'inline-block h-5 w-5 transform rounded-full bg-white transition dark:bg-white',
                              branch.is_active ? 'translate-x-5' : 'translate-x-1'
                            ]"
                          />
                        </button>
                      </div>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <button @click="openEditModal(branch)" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-xs hover:bg-gray-900 mr-2 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Редактировать</button>
                      <button @click="deleteBranch(branch.id)" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-xs hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Удалить</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно добавления/редактирования (Tailwind) -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>
      <div class="relative z-10 w-full max-w-lg mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <h5 class="m-0 dark:text-white">{{ isEditing ? 'Редактировать филиал' : 'Добавить филиал' }}</h5>
          <button @click="closeModal" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-[#4a4a52]">✕</button>
        </div>
        <div class="p-4">
          <form @submit.prevent="submitForm" class="space-y-3">
            <div>
              <label for="code" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Код *</label>
              <input v-model="form.code" type="text" id="code" required
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
            </div>
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Название *</label>
              <input v-model="form.name" type="text" id="name" required
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
            </div>
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Адрес *</label>
              <input v-model="form.address" type="text" id="address" required
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
            </div>
            <div>
              <label for="phone_number" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Телефон *</label>
              <input v-model="form.phone_number" type="text" id="phone_number" required
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
            </div>
            <div>
              <span class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Статус</span>
              <div class="flex items-center">
                <button
                  type="button"
                  @click="form.is_active = !form.is_active"
                  role="switch"
                  :aria-checked="form.is_active ? 'true' : 'false'"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition',
                    form.is_active ? 'bg-black' : 'bg-gray-300 dark:bg-gray-600'
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-5 w-5 transform rounded-full bg-white transition dark:bg-white',
                      form.is_active ? 'translate-x-5' : 'translate-x-1'
                    ]"
                  />
                </button>
              </div>
            </div>
            <div v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-[#3f3f47] dark:border-gray-700 dark:text-white">
              {{ errorMessage }}
            </div>
          </form>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <button type="button" @click="closeModal" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Закрыть</button>
          <button @click="submitForm" type="button" :disabled="submitting"
            class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
            <span v-if="submitting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
            {{ isEditing ? 'Сохранить' : 'Добавить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api'

// Реактивные данные
const branches = ref([])
const loading = ref(false)
const submitting = ref(false)
const isEditing = ref(false)
const errorMessage = ref('')
const modalOpen = ref(false)

// Форма филиала
const form = ref({
  code: '',
  name: '',
  address: '',
  phone_number: '',
  is_active: true
})

// ID редактируемого филиала
const editingId = ref(null)

// API базовый URL
// centralized API client is used

// Загрузка филиалов
const loadBranches = async () => {
  loading.value = true
  try {
    const response = await api.get(`branches/`)
    branches.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки филиалов:', error)
  } finally {
    loading.value = false
  }
}

// Открытие модального окна для добавления
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  resetForm()
  errorMessage.value = ''
  modalOpen.value = true
}

// Открытие модального окна для редактирования
const openEditModal = (branch) => {
  isEditing.value = true
  editingId.value = branch.id
  form.value = {
    code: branch.code,
    name: branch.name,
    address: branch.address,
    phone_number: branch.phone_number,
    is_active: branch.is_active
  }
  errorMessage.value = ''
  modalOpen.value = true
}

// Отправка формы
const submitForm = async () => {
  submitting.value = true
  errorMessage.value = ''
  
  try {
    if (isEditing.value) {
      await api.patch(`branches/${editingId.value}/`, form.value)
    } else {
      await api.post(`branches/`, form.value)
    }
    closeModal()
    await loadBranches()
  } catch (error) {
    console.error('Ошибка сохранения филиала:', error)
    if (error.response?.data?.detail) {
      errorMessage.value = error.response.data.detail
    } else {
      errorMessage.value = 'Ошибка при сохранении филиала'
    }
  } finally {
    submitting.value = false
  }
}

// Переключение статуса филиала
const toggleBranchStatus = async (branch) => {
  try {
    await api.patch(`branches/${branch.id}/`, {
      is_active: !branch.is_active
    })
    branch.is_active = !branch.is_active
  } catch (error) {
    console.error('Ошибка изменения статуса:', error)
    branch.is_active = !branch.is_active
  }
}

// Удаление филиала
const deleteBranch = async (branchId) => {
  if (confirm('Вы уверены, что хотите удалить этот филиал?')) {
    try {
      await api.delete(`branches/${branchId}/`)
      await loadBranches()
    } catch (error) {
      console.error('Ошибка удаления филиала:', error)
      alert('Ошибка при удалении филиала')
    }
  }
}

// Закрытие модального окна
const closeModal = () => {
  modalOpen.value = false
}

// Очистка формы
const resetForm = () => {
  form.value = {
    code: '',
    name: '',
    address: '',
    phone_number: '',
    is_active: true
  }
}

// Загрузка при монтировании компонента
onMounted(() => {
  loadBranches()
})
</script>