<template>
  <div class="participant-view">
    <div>
      <div>
        <div class="flex items-center justify-between mb-3">
          <h1 class="dark:text-white">Просмотр участника</h1>
          <button @click="$router.go(-1)" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Назад</button>
        </div>
        
        <!-- Загрузка -->
        <div v-if="loading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        
        <!-- Данные участника -->
        <div v-else-if="participant" class="grid md:grid-cols-12 gap-4">
          <div class="md:col-span-8">
            <div class="mb-3 bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                <h5 class="m-0 dark:text-white">Информация об участнике</h5>
              </div>
              <div class="p-4">
                <div class="grid md:grid-cols-12 gap-4">
                  <div class="md:col-span-6">
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">ID:</label>
                      <p class="text-sm text-gray-900">{{ participant.id }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Персональный номер:</label>
                      <p class="text-sm text-gray-900">{{ participant.personal_number }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Имя:</label>
                      <p class="text-sm text-gray-900">{{ participant.name }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Фамилия:</label>
                      <p class="text-sm text-gray-900">{{ participant.lastname }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Отчество:</label>
                      <p class="text-sm text-gray-900">{{ participant.patronymic }}</p>
                    </div>
                  </div>
                  <div class="md:col-span-6">
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                      <p class="text-sm text-gray-900">{{ participant.email }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Код:</label>
                      <p class="text-sm text-gray-900">{{ participant.code }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Филиал:</label>
                      <p class="text-sm text-gray-900">{{ participant.branch?.name || 'Неизвестно' }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Статус регистрации:</label>
                      <p class="text-sm text-gray-900">{{ participant.registered ? 'Зарегистрирован' : 'Ожидает' }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Активен:</label>
                      <p class="text-sm text-gray-900">{{ participant.is_active ? 'Да' : 'Нет' }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="grid md:grid-cols-12 gap-4">
                  <div class="md:col-span-6">
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Дата создания:</label>
                      <p class="text-sm text-gray-900">{{ formatDate(participant.created_at) }}</p>
                    </div>
                  </div>
                  <div class="md:col-span-6">
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Дата регистрации:</label>
                      <p class="text-sm text-gray-900">{{ formatDate(participant.register_at) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Бонусы участника -->
            <div class="mb-3 bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                <h5 class="m-0 dark:text-white">Бонусы участника</h5>
              </div>
              <div class="p-4">
                <div class="grid md:grid-cols-12 gap-3">
                  <div class="md:col-span-4">
                    <div class="text-center p-3 rounded border">
                      <h6 class="text-gray-500">Структурный бонус</h6>
                      <h4 class="text-black">{{ bonusData?.total_structure || 0 }}</h4>
                    </div>
                  </div>
                  <div class="md:col-span-4">
                    <div class="text-center p-3 rounded border">
                      <h6 class="text-gray-500">Спонсорский бонус</h6>
                      <h4 class="text-black">{{ bonusData?.total_sponsor || 0 }}</h4>
                    </div>
                  </div>
                  <div class="md:col-span-4">
                    <div class="text-center p-3 rounded border">
                      <h6 class="text-gray-500">Мультибонус</h6>
                      <h4 class="text-black">{{ bonusData?.total_multi || 0 }}</h4>
                    </div>
                  </div>
                </div>
                <div v-if="bonusData?.last_updated" class="mt-3 text-center">
                  <small class="text-gray-500">Последнее обновление: {{ formatDate(bonusData.last_updated) }}</small>
                </div>
              </div>
            </div>

            <!-- Данные структуры -->
            <div class="mb-3 bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                <h5 class="m-0 dark:text-white">Данные структуры</h5>
              </div>
              <div class="p-4">
                <div class="grid md:grid-cols-12 gap-4">
                  <div class="md:col-span-6">
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Цикл:</label>
                      <p class="text-sm text-gray-900">{{ structureData?.cycle_number || 'Не указано' }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Этап:</label>
                      <p class="text-sm text-gray-900">{{ structureData?.stage_number || 'Не указано' }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Дата начала этапа:</label>
                      <p class="text-sm text-gray-900">{{ formatDate(structureData?.stage_start_date) }}</p>
                    </div>
                  </div>
                  <div class="md:col-span-6">
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Базовая левая:</label>
                      <p class="text-sm text-gray-900">{{ structureData?.base_left || 0 }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Базовая правая:</label>
                      <p class="text-sm text-gray-900">{{ structureData?.base_right || 0 }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Общее количество:</label>
                      <p class="text-sm text-gray-900">{{ structureData?.total_count || 0 }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="grid md:grid-cols-12 gap-4">
                  <div class="md:col-span-6">
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Всего слева:</label>
                      <p class="text-sm text-gray-900">{{ structureData?.total_left || 0 }}</p>
                    </div>
                  </div>
                  <div class="md:col-span-6">
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Всего справа:</label>
                      <p class="text-sm text-gray-900">{{ structureData?.total_right || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- История закрытия этапов (Tailwind) -->
            <div class="bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                <h5 class="m-0 dark:text-white">История закрытия этапов</h5>
              </div>
              <div class="p-4">
                <div v-if="stageHistory.length > 0" class="overflow-x-auto">
                  <div class="inline-block min-w-full align-middle">
                    <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
                      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                          <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата закрытия</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата открытия</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Время ушло</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Левая</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Правая</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                          <tr v-for="stage in stageHistory" :key="stage.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ stage.cycle_number }}</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ stage.stage_number }}</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(stage.closed_at) }}</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(stage.start_at) }}</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDuration(stage.start_at, stage.closed_at) }}</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ stage.participants_left }}</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ stage.participants_right }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-gray-500">
                  <p>История закрытия этапов отсутствует</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="md:col-span-4">
            <div class="bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                <h5 class="m-0 dark:text-white">Действия</h5>
              </div>
              <div class="p-4">
                <div class="grid gap-2">
                  <router-link :to="`/purchase/${participant.id}`" class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-white text-sm hover:bg-gray-900">Покупки</router-link>
                  <router-link :to="`/structure/${participant.id}`" class="inline-flex items-center rounded-md bg-success px-3 py-2 text-white text-sm hover:bg-gray-900 ">Структура</router-link>
                  <router-link :to="`/sponsored/${participant.id}`" class="inline-flex items-center rounded-md bg-slate-600 px-3 py-2 text-white text-sm hover:bg-gray-900">Личники</router-link>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg ring-1 ring-gray-200 mt-3 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                <h5 class="m-0 dark:text-white">Спонсор</h5>
              </div>
              <div class="p-4">
                <p class="text-sm text-gray-900 dark:text-white">{{ participant.sponsor?.lastname }} {{ participant.sponsor?.name }} {{ participant.sponsor?.patronymic }}</p>
                <p class="text-sm text-gray-900 dark:text-white"><a :href="`/participants/${participant.sponsor?.id}`" class="text-blue-600 hover:underline dark:text-blue-300">{{ participant.sponsor?.personal_number }}</a></p>
              </div>
            </div>
            <div class="bg-white rounded-lg ring-1 ring-gray-200 mt-3 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                <h5 class="m-0 dark:text-white">Ментор</h5>
              </div>
              <div class="p-4">
                <p class="text-sm text-gray-900 dark:text-white">{{ participant.mentor?.lastname }} {{ participant.mentor?.name }} {{ participant.mentor?.patronymic }}</p>
                <p class="text-sm text-gray-900 dark:text-white"><a :href="`/participants/${participant.mentor?.id}`" class="text-blue-600 hover:underline dark:text-blue-300">{{ participant.mentor?.personal_number }}</a></p>
              </div>
            </div>

          </div>
        </div>
        
        <!-- Ошибка -->
        <div v-else class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-[#3f3f47] dark:border-gray-700 dark:text-white">
          Участник не найден
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api'

// Реактивные данные
const participant = ref(null)
const loading = ref(false)
const bonusData = ref(null)
const structureData = ref(null)
const stageHistory = ref([])

// API базовый URL
// centralized API client is used

// Получение ID из маршрута
const route = useRoute()
const participantId = route.params.id

// Загрузка данных участника
const loadParticipant = async () => {
  loading.value = true
  try {
    const response = await api.get(`participants/${participantId}`)
    participant.value = response.data
    if (typeof window !== 'undefined') {
      window.__navActiveKey = response.data?.registered ? 'participants' : 'registration'
      try { window.dispatchEvent(new Event('nav-active-key-changed')) } catch {}
    }
  } catch (error) {
    console.error('Ошибка загрузки участника:', error)
    participant.value = null
  } finally {
    loading.value = false
  }
}

// Загрузка данных о бонусах
const loadBonusData = async () => {
  try {
    const response = await api.get(`data/participants_bonus/${participantId}`)
    bonusData.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки данных о бонусах:', error)
    bonusData.value = null
  }
}

// Загрузка данных структуры
const loadStructureData = async () => {
  try {
    const response = await api.get(`data/participant_bonus_data/${participantId}`)
    structureData.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки данных структуры:', error)
    structureData.value = null
  }
}

// Загрузка истории закрытия этапов
const loadStageHistory = async () => {
  try {
    const response = await api.get(`data/stage_closure_history/${participantId}`)
    stageHistory.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки истории этапов:', error)
    stageHistory.value = []
  }
}

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return 'Не указано'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

// Форматирование длительности между датами (start -> end)
const formatDuration = (start, end) => {
  if (!start || !end) return '—'
  try {
    const startDate = new Date(start)
    const endDate = new Date(end)
    let diffMs = endDate - startDate
    if (isNaN(diffMs)) return '—'
    if (diffMs < 0) diffMs = 0

    const minutesTotal = Math.floor(diffMs / 60000)
    const days = Math.floor(minutesTotal / (60 * 24))
    const hours = Math.floor((minutesTotal % (60 * 24)) / 60)
    const minutes = minutesTotal % 60

    const parts = []
    if (days > 0) parts.push(`${days} д`)
    if (hours > 0) parts.push(`${hours} ч`)
    parts.push(`${minutes} м`)
    return parts.join(' ')
  } catch (e) {
    return '—'
  }
}

// Загрузка при монтировании компонента
onMounted(async () => {
  await loadParticipant()
  await Promise.all([
    loadBonusData(),
    loadStructureData(),
    loadStageHistory()
  ])
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined' && window.__navActiveKey) {
    try { delete window.__navActiveKey } catch {}
    try { window.dispatchEvent(new Event('nav-active-key-changed')) } catch {}
  }
})
</script>

<style scoped>
:root.dark .participant-view,
:root.dark .participant-view * {
  color: #ffffff !important;
}
</style>
