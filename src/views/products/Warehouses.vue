<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white">Склады</h1>
      <button @click="openAddModal" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52]">
        Добавить склад
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-6 text-center">
      <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Адрес</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Описание</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-for="warehouse in warehouses" :key="warehouse.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ warehouse.name }}</td>
                <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ warehouse.address || '—' }}</td>
                <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ warehouse.description || '—' }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm">
                  <span v-if="warehouse.is_active" class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/50 dark:text-green-300">Активен</span>
                  <span v-else class="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs text-red-800 dark:bg-red-900/50 dark:text-red-300">Неактивен</span>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm">
                  <button @click="openEditModal(warehouse)" class="inline-flex items-center rounded-md bg-gray-800 dark:bg-gray-600 px-3 py-2 text-white text-xs mr-2 hover:bg-gray-700 dark:hover:bg-gray-500">Редактировать</button>
                  <button @click="toggleStatus(warehouse)" class="inline-flex items-center rounded-md px-3 py-2 text-white text-xs" :class="warehouse.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'">
                    {{ warehouse.is_active ? 'Деактивировать' : 'Активировать' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="warehouses.length === 0 && !loading" class="text-center py-8 text-gray-500 dark:text-gray-400">
      Склады не найдены
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="modal.visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>
      <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="px-4 py-3 border-b dark:border-gray-700">
          <h5 class="m-0 dark:text-white">{{ modal.isEdit ? 'Редактировать склад' : 'Добавить склад' }}</h5>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Название *</label>
              <input v-model="modal.form.name" type="text" required
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                placeholder="Название склада">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Адрес</label>
              <input v-model="modal.form.address" type="text"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                placeholder="Адрес склада">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Описание</label>
              <textarea v-model="modal.form.description" rows="3"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                placeholder="Описание склада"></textarea>
            </div>
            <div v-if="modal.error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
              {{ modal.error }}
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <button @click="closeModal" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Отмена</button>
          <button @click="saveWarehouse" :disabled="!modal.form.name?.trim() || submitting"
            class="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52]">
            <span v-if="submitting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
            {{ modal.isEdit ? 'Сохранить' : 'Создать' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { store_api } from '@/api'

const warehouses = ref([])
const loading = ref(false)
const submitting = ref(false)

const modal = ref({
  visible: false,
  isEdit: false,
  warehouseId: null,
  form: {
    name: '',
    address: '',
    description: ''
  },
  error: ''
})

const loadWarehouses = async () => {
  loading.value = true
  try {
    const response = await store_api.get('warehouses/?skip=0&limit=100')
    warehouses.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки складов:', error)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  modal.value = {
    visible: true,
    isEdit: false,
    warehouseId: null,
    form: {
      name: '',
      address: '',
      description: ''
    },
    error: ''
  }
}

const openEditModal = (warehouse) => {
  modal.value = {
    visible: true,
    isEdit: true,
    warehouseId: warehouse.id,
    form: {
      name: warehouse.name,
      address: warehouse.address || '',
      description: warehouse.description || ''
    },
    error: ''
  }
}

const closeModal = () => {
  modal.value = {
    visible: false,
    isEdit: false,
    warehouseId: null,
    form: {
      name: '',
      address: '',
      description: ''
    },
    error: ''
  }
}

const saveWarehouse = async () => {
  if (!modal.value.form.name?.trim()) {
    modal.value.error = 'Название обязательно'
    return
  }

  submitting.value = true
  modal.value.error = ''

  try {
    const data = {
      name: modal.value.form.name.trim(),
      address: modal.value.form.address?.trim() || null,
      description: modal.value.form.description?.trim() || null
    }

    if (modal.value.isEdit) {
      await store_api.put(`warehouses/${modal.value.warehouseId}`, data)
    } else {
      await store_api.post('warehouses/', data)
    }

    await loadWarehouses()
    closeModal()
  } catch (error) {
    console.error('Ошибка сохранения склада:', error)
    modal.value.error = error.response?.data?.detail || 'Ошибка при сохранении'
  } finally {
    submitting.value = false
  }
}

const toggleStatus = async (warehouse) => {
  try {
    await store_api.put(`warehouses/${warehouse.id}`, {
      is_active: !warehouse.is_active
    })
    await loadWarehouses()
  } catch (error) {
    console.error('Ошибка изменения статуса:', error)
  }
}

onMounted(() => {
  loadWarehouses()
})
</script>
