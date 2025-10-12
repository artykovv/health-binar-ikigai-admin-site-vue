<template>
  <div>
    <div>
      <div>
        <div class="flex items-center justify-between mb-3">
          <h1 class="dark:text-white">Участники</h1>
          <router-link to="/registration/new" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Добавить</router-link>
        </div>
        
        <!-- Фильтры -->
        <div class="mb-3">
          <div class="grid md:grid-cols-12 gap-3">
            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Размер страницы:</label>
              <select v-model="filters.page_size" @change="searchParticipants" class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Филиал:</label>
              <select v-model="filters.branch_id" @change="searchParticipants" class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                <option value="">Все филиалы</option>
                    <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                      {{ branch.code }} - {{ branch.name }} - {{ branch.address }}
                    </option>
              </select>
            </div>
            <div class="md:col-span-4">
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Поиск:</label>
              <input v-model="filters.search" @keyup.enter="searchParticipants" type="text" class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:placeholder-white/70 dark:focus:ring-white" placeholder="Поиск по имени, фамилии, персональному номеру...">
            </div>
            <div class="md:col-span-2 flex items-end">
              <button @click="searchParticipants" class="inline-flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Поиск</button>
            </div>
          </div>
        </div>
        
        <!-- Загрузка -->
        <div v-if="loading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        
        <!-- Таблица участников (Tailwind) -->
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Персональный номер</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ФИО</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="participant in participants" :key="participant.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ participant.branch?.name || 'Неизвестно' }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/participants/${participant.id}`" class="hover:underline">
                        {{ participant.personal_number }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ participant.lastname }} {{ participant.name }} {{ participant.patronymic }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(participant.register_at) }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <router-link :to="`/participants/${participant.id}`" class="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-white text-xs hover:bg-gray-900 mr-2">Просмотр</router-link>
                      <router-link :to="`/purchase/${participant.id}`" class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-white text-xs hover:bg-gray-900 mr-2">Покупки</router-link>
                      <router-link :to="`/structure/${participant.id}`" class="inline-flex items-center rounded-md bg-success px-3 py-2 text-white text-xs hover:bg-gray-900 mr-2">Структура</router-link>
                      <router-link :to="`/sponsored/${participant.id}`" class="inline-flex items-center rounded-md bg-slate-600 px-3 py-2 text-white text-xs hover:bg-gray-900 mr-2">Личники</router-link>
                      <router-link :to="`/registration/edit/${participant.id}`" class="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-white text-xs hover:bg-gray-900">Изменить</router-link>
                      <!-- <button class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-xs hover:bg-gray-900">Редактировать</button> -->
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
import { ref, onMounted } from 'vue'
import { api } from '@/api'

// Реактивные данные
const participants = ref([])
const branches = ref([])
const loading = ref(false)
const pagination = ref(null)

// Фильтры
const filters = ref({
  page_size: 20,
  branch_id: '',
  search: '',
  page: 1
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

// Поиск участников
const searchParticipants = async () => {
  loading.value = true
  try {
    const params = {
      registered: true,
      page: filters.value.page,
      page_size: filters.value.page_size
    }
    
    if (filters.value.branch_id) {
      params.branch_id = filters.value.branch_id
    }
    
    if (filters.value.search) {
      params.search = filters.value.search
    }
    
    const response = await api.get(`participants/`, { params })
    
    // Обновляем обработку ответа согласно новой структуре
    participants.value = response.data.participants || []
    pagination.value = {
      current_page: response.data.page || 1,
      total_pages: response.data.total_pages || 1,
      total_count: response.data.total_participants || 0
    }
  } catch (error) {
    console.error('Ошибка загрузки участников:', error)
    participants.value = []
  } finally {
    loading.value = false
  }
}

// Смена страницы
const changePage = (page) => {
  if (page >= 1) {
    filters.value.page = page
    searchParticipants()
  }
}

// Получение названия филиала по ID
const getBranchName = (branchId) => {
  const branch = branches.value.find(b => b.id === branchId)
  return branch ? `${branch.name} (${branch.code})` : 'Неизвестно'
}

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

// Загрузка при монтировании компонента
onMounted(() => {
  loadBranches()
  searchParticipants()
})
</script>
