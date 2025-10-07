<template>
  <div>
    <div>
      <div>
        <div class="flex items-center justify-between mb-3">
          <h1 class="dark:text-white">Личники</h1>
        </div>

        <!-- Загрузка -->
        <div v-if="loading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>

        <!-- Таблица участников (как в Participants.vue) -->
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Персональный номер</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ФИО</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">В структуре</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="participant in participants" :key="participant.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ getBranchName(participant.branch_id, participant.branch) }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/participants/${participant.id}`" class="hover:underline">
                        {{ participant.personal_number }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ participant.lastname }} {{ participant.name }} {{ participant.patronymic }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ participant.registered ? 'Да' : 'Нет' }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(participant.register_at) }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <router-link :to="`/participants/${participant.id}`" class="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-white text-xs hover:bg-gray-900 mr-2">Просмотр</router-link>
                      <router-link :to="`/purchase/${participant.id}`" class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-white text-xs hover:bg-gray-900 mr-2">Покупки</router-link>
                      <router-link :to="`/structure/${participant.id}`" class="inline-flex items-center rounded-md bg-success px-3 py-2 text-white text-xs hover:bg-gray-900">Структура</router-link>
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
import { useRoute } from 'vue-router'
import { api } from '@/api'

const route = useRoute()
const sponsorId = route.params.id

const participants = ref([])
const branches = ref([])
const loading = ref(false)
const pagination = ref(null)

const page = ref(1)
const pageSize = ref(20)

const loadBranches = async () => {
  try {
    const response = await api.get(`branches/`)
    branches.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки филиалов:', error)
  }
}

const getBranchName = (branchId, branchObj) => {
  if (branchObj && branchObj.name) return branchObj.name
  const b = branches.value.find(x => x.id === branchId)
  return b ? b.name : 'Неизвестно'
}

const loadSponsored = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      page_size: pageSize.value,
      sponsor_id: sponsorId
    }
    const response = await api.get(`participants/`, { params })
    participants.value = response.data.participants || []
    pagination.value = {
      current_page: response.data.page || 1,
      total_pages: response.data.total_pages || 1,
      total_count: response.data.total_participants || 0
    }
  } catch (error) {
    console.error('Ошибка загрузки личников:', error)
    participants.value = []
  } finally {
    loading.value = false
  }
}

const changePage = (nextPage) => {
  if (nextPage >= 1) {
    page.value = nextPage
    loadSponsored()
  }
}

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

onMounted(async () => {
  await loadBranches()
  await loadSponsored()
})
</script>


