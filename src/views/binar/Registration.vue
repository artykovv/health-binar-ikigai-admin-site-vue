<template>
  <div>
    <div>
      <div>
        <div class="flex items-center justify-between mb-3">
          <h1 class="dark:text-white">Регистрации</h1>
          <router-link to="/binar/user-registration" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Добавить</router-link>
        </div>
        
        <!-- Tailwind Notification -->
        <div v-if="notice.visible" class="fixed top-4 right-4 z-50">
          <div :class="['rounded-md px-4 py-2 text-sm shadow',
            notice.type === 'success' ? 'bg-green-100 text-green-800' :
            notice.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800',
            'dark:bg-[#3f3f47] dark:text-white']">
            {{ notice.message }}
          </div>
        </div>

        <!-- Confirm Delete Modal -->
        <div v-if="confirm.visible" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/40" @click="closeConfirm"></div>
          <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
            <div class="px-4 py-3 border-b dark:border-gray-700">
              <h5 class="m-0 dark:text-white">Подтверждение</h5>
            </div>
            <div class="p-4 text-sm text-gray-700 dark:text-white">
              <p class="mb-2">Удалить участника? Это действие необратимо.</p>
              <p>Подтвердите действие.</p>
            </div>
            <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
              <button @click="closeConfirm" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Отмена</button>
              <button @click="confirmDelete" :disabled="deleting"
                class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-white text-sm hover:bg-red-700 disabled:opacity-40 dark:hover:bg-[#4a4a52]">
                <span v-if="deleting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
                Удалить
              </button>
            </div>
          </div>
        </div>
        
        <!-- Фильтры -->
        <div class="mb-3">
          <div class="grid md:grid-cols-12 gap-3">
            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Размер страницы:</label>
              <select v-model="filters.page_size" @change="searchRegistrations" class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Филиал:</label>
              <select v-model="filters.branch_id" @change="searchRegistrations" class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                <option value="">Все филиалы</option>
                    <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                      {{ branch.code }} - {{ branch.name }} - {{ branch.address }}
                    </option>
              </select>
            </div>
            <div class="md:col-span-4">
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Поиск:</label>
              <input v-model="filters.search" @keyup.enter="searchRegistrations" type="text" class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:placeholder-white/70 dark:focus:ring-white" placeholder="Поиск по имени, фамилии, персональному номеру...">
            </div>
            <div class="md:col-span-2 flex items-end">
              <button @click="searchRegistrations" class="inline-flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Поиск</button>
            </div>
          </div>
        </div>
        
        <!-- Загрузка -->
        <div v-if="loading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        
        <!-- Таблица регистраций (Tailwind) -->
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Персональный номер</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ФИО</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Контракт</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="registration in registrations" :key="registration.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ registration.branch?.name || 'Неизвестно' }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/binar/registration/participant/${registration.id}`" class="hover:underline">
                        {{ registration.personal_number }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ registration.lastname }} {{ registration.name }} {{ registration.patronymic }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">
                      <span v-if="registration.contract_status" :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', getContractStatusColor(registration.contract_status)]">
                        {{ getContractStatusText(registration.contract_status) }}
                      </span>
                      <span v-else class="text-gray-500 text-xs">-</span>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(registration.created_at) }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <router-link :to="`/binar/registration/participant/${registration.id}`" class="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-white text-xs hover:bg-gray-900 mr-2">Просмотр</router-link>
                      <router-link :to="`/binar/add-to-structure/${registration.id}`" class="inline-flex items-center rounded-md bg-success px-3 py-2 text-white text-xs hover:bg-gray-900 mr-2">+ Cтруктуру</router-link>
                      <router-link :to="`/binar/registration/user-edit/${registration.id}`" class="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-white text-xs hover:bg-gray-900 mr-2">Изменить</router-link>
                      <button class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-white text-xs hover:bg-red-700" @click="openConfirm(registration.id)">Удалить</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Пагинация -->
        <div v-if="pagination" class="mt-3 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-white">
            <span>Страница {{ pagination.current_page }} из {{ pagination.total_pages }}</span>
            <span class="ml-3">Всего: {{ pagination.total_count }}</span>
          </div>
          <div class="flex gap-2">
            <button 
              @click="changePage(pagination.current_page - 1)" 
              :disabled="pagination.current_page <= 1"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Предыдущая
            </button>
            <button 
              @click="changePage(pagination.current_page + 1)" 
              :disabled="pagination.current_page >= pagination.total_pages"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Следующая
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'

const route = useRoute()
const router = useRouter()

// Реактивные данные
const registrations = ref([])
const branches = ref([])
const loading = ref(false)
const pagination = ref(null)

// Уведомления (Tailwind)
const notice = ref({ visible: false, type: 'info', message: '' })
const showNotice = (message, type = 'info') => {
  notice.value = { visible: true, type, message }
  setTimeout(() => { notice.value.visible = false }, 2500)
}

// Подтверждение удаления
const confirm = ref({ visible: false, id: null })
const deleting = ref(false)
const openConfirm = (id) => { confirm.value = { visible: true, id } }
const closeConfirm = () => { confirm.value = { visible: false, id: null } }
const confirmDelete = async () => {
  if (!confirm.value.id) return
  deleting.value = true
  await deleteParticipant(confirm.value.id)
  deleting.value = false
  closeConfirm()
}

// Фильтры
const filters = ref({
  page_size: parseInt(route.query.page_size) || 20,
  branch_id: route.query.branch_id || '',
  search: route.query.search || '',
  page: parseInt(route.query.page) || 1
})

// API базовый URL
// centralized API client is used

// Загрузка филиалов
const loadBranches = async () => {
  try {
    const response = await api.get(`branches/`)
    branches.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки филиалов:', error)
  }
}

// Обновление URL с текущими фильтрами
const updateURL = () => {
  const query = {}
  if (filters.value.page_size !== 20) query.page_size = filters.value.page_size
  if (filters.value.branch_id) query.branch_id = filters.value.branch_id
  if (filters.value.search) query.search = filters.value.search
  if (filters.value.page !== 1) query.page = filters.value.page
  
  router.replace({ query })
}

// Поиск регистраций
const searchRegistrations = async () => {
  loading.value = true
  try {
    const params = {
      page: filters.value.page,
      page_size: filters.value.page_size
    }
    
    if (filters.value.branch_id) {
      params.branch_id = filters.value.branch_id
    }
    
    if (filters.value.search) {
      params.search = filters.value.search
    }
    
    const response = await api.get(`participants/`, { params: { ...params, registered: false } })
    
    // Обновляем обработку ответа согласно новой структуре
    registrations.value = response.data.participants || []
    pagination.value = {
      current_page: response.data.page || 1,
      total_pages: response.data.total_pages || 1,
      total_count: response.data.total_participants || 0
    }
    
    // Обновляем URL
    updateURL()
  } catch (error) {
    console.error('Ошибка загрузки регистраций:', error)
    registrations.value = []
    showNotice('Ошибка загрузки регистраций', 'error')
  } finally {
    loading.value = false
  }
}

// Смена страницы
const changePage = (page) => {
  if (page >= 1) {
    filters.value.page = page
    searchRegistrations()
  }
}

// Отслеживание изменений фильтров для обновления URL
watch(filters, () => {
  updateURL()
}, { deep: true })

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

const getContractStatusColor = (statusObj) => {
    const status = statusObj?.status
    if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    switch(status) {
        case 'not_used': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        case 'partially_used': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
        case 'fully_used': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
}

const getContractStatusText = (statusObj) => {
    const status = statusObj?.status
    if (!status) return 'Нет контракта'
     switch(status) {
        case 'not_used': return 'Не использован'
        case 'partially_used': return 'Частично'
        case 'fully_used': return 'Использован'
        default: return 'Неизвестно'
    }
}

// Загрузка при монтировании компонента
onMounted(() => {
  loadBranches()
  searchRegistrations()
})

// Удаление участника (регистрации)
const deleteParticipant = async (id) => {
  if (!id) return
  try {
    await api.delete(`participants/${id}`, {
      headers: { 'accept': 'application/json' }
    })
    registrations.value = registrations.value.filter(r => r.id !== id)
    if (pagination.value && pagination.value.total_count > 0) {
      pagination.value.total_count -= 1
    }
    showNotice('Участник удалён', 'success')
  } catch (error) {
    console.error('Ошибка удаления участника:', error)
    showNotice('Не удалось удалить участника', 'error')
  }
}
</script>
