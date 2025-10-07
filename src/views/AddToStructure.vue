<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white">Добавить в структуру</h1>
      <button @click="$router.go(-1)" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Назад</button>
    </div>

    <div class="flex flex-col bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
      <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
        <h5 class="mb-0 dark:text-white">Добавление участника в структуру</h5>
      </div>
      <div class="p-4 flex-1 overflow-hidden min-h-0">
        <!-- Загрузка -->
        <div v-if="loading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>

        <!-- Форма добавления -->
        <div v-if="!loading">
          <div v-if="participantInfo && participantInfo.registered" class="rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-[#252529] dark:border-gray-700 dark:text-white">
            Нельзя повторно добавить участника: он уже находится в структуре.
          </div>
          <div v-else class="grid md:grid-cols-12 gap-4">
            <div class="md:col-span-6 flex flex-col">
              <h6 class="mb-2 dark:text-white">Информация об участнике</h6>
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Участник:</label>
                <div class="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:bg-[#252529] dark:border-gray-700">
                  <strong class="dark:text-white">{{ participantInfo.lastname }} {{ participantInfo.name }} {{ participantInfo.patronymic }}</strong><br>
                  <small class="text-gray-500 dark:text-white">{{ participantInfo.personal_number }}</small>
                </div>
              </div>

              <!-- Поиск по позициям (перенесено в левую колонку) -->
              <div v-if="availablePositions.length > 0" class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Поиск по позициям:</label>
                <input 
                  v-model="positionSearchQuery" 
                  type="text" 
                  class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white dark:placeholder-white/70" 
                  placeholder="Поиск по ФИО или персональному номеру"
                  @input="filterPositions"
                >
              </div>

              <!-- Список позиций (перенесён в левую колонку) -->
              <div class="h-[500px] overflow-y-auto pr-1">
              <div v-if="filteredPositions.length > 0" class="rounded-md border border-gray-200 divide-y dark:border-gray-700 dark:divide-gray-700 dark:bg-[#252529]">
                <button 
                  v-for="position in filteredPositions" 
                  :key="position.id"
                  @click="selectPosition(position)"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#4a4a52]"
                  :class="{ 'bg-gray-100 dark:bg-[#4a4a52]': selectedPosition && selectedPosition.id === position.id }"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <strong class="dark:text-white">{{ position.lastname }} {{ position.name }} {{ position.patronymic }}</strong><br>
                      <small class="text-gray-500 dark:text-white">{{ position.personal_number }}</small>
                    </div>
                    <div class="text-right">
                      <span :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' + getPositionBadgeClass(position.position)">
                        {{ getPositionText(position.position) }}
                      </span>
                      <div v-if="selectedPosition && selectedPosition.id === position.id" class="text-green-600 mt-1 text-xs dark:text-green-400">
                        ✓ Выбрано
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              
              <div v-else-if="availablePositions.length > 0 && filteredPositions.length === 0" class="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800 dark:bg-[#252529] dark:border-gray-700 dark:text-white">
                <strong>Ничего не найдено</strong><br>
                Попробуйте изменить поисковый запрос
              </div>
              
              <div v-else-if="!loadingPositions" class="rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-[#252529] dark:border-gray-700 dark:text-white">
                <strong>Нет доступных позиций</strong><br>
                У спонсора нет свободных мест в структуре
              </div>
              </div>
            </div>
            
            <div class="md:col-span-6">
              <h6 class="mb-2 dark:text-white">Доступные позиции</h6>
              
              <!-- Визуальный выбор структуры: Спонсор -> Ментор -> Левый/Правый -->
              <div class="mb-4 p-4 rounded-lg ring-1 ring-gray-200 bg-white dark:bg-[#252529] dark:ring-gray-700 shadow-sm">
                <div class="flex flex-col items-center space-y-3 md:space-y-4">
                  <!-- Спонсор сверху как прямоугольник -->
                  <div class="w-full max-w-xs">
                    <div class="ring-1 ring-gray-200 bg-gray-50 dark:bg-[#252529] dark:ring-gray-700 p-3 rounded-md">
                      <div class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-300 mb-1">Спонсор</div>
                      <div class="text-sm font-medium dark:text-white">
                        {{ sponsorInfo ? (sponsorInfo.lastname + ' ' + sponsorInfo.name + (sponsorInfo.patronymic ? ' ' + sponsorInfo.patronymic : '')) : 'Спонсор не указан' }}
                      </div>
                      <div class="text-[11px] text-gray-500 dark:text-gray-300" v-if="sponsorInfo">{{ sponsorInfo.personal_number }}</div>
                    </div>
                  </div>

                  <!-- Ментор по центру как прямоугольник -->
                  <div class="w-full max-w-xs" :class="{ 'animate-bump': animateMentor }">
                    <div class="relative ring-1 ring-gray-200 bg-gray-50 dark:bg-[#252529] dark:ring-gray-700 p-3 rounded-md">
                      <button
                        v-if="selectedPosition || side"
                        type="button"
                        @click="onClearSelection"
                        class="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-black dark:bg-[#3a3a40] dark:text-white dark:hover:bg-[#4a4a52] dark:focus:ring-white"
                        title="Сбросить выбор"
                        aria-label="Сбросить выбор"
                      >
                        <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                      <div class="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-300 mb-1">НАСТАВНИК</div>
                      <div class="text-sm font-medium dark:text-white">
                        {{ selectedPosition ? (selectedPosition.lastname + ' ' + selectedPosition.name + (selectedPosition.patronymic ? ' ' + selectedPosition.patronymic : '')) : 'Выберите ментора ниже' }}
                      </div>
                      <div class="text-[11px] text-gray-500 dark:text-gray-300" v-if="selectedPosition">{{ selectedPosition.personal_number }}</div>
                    </div>
                  </div>

                  <!-- Разветвление на 2 стороны от ментора -->
                  <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mt-2"></div>
                  <div class="flex items-center w-full">
                    <div class="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                    <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    <div class="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                  <div class="mt-2 text-xs text-gray-600 dark:text-gray-300">Нажмите на левый или правый блок для выбора стороны</div>
                  <div class="mt-3 grid grid-cols-2 gap-4 w-full">
                    <!-- Левая сторона -->
                    <button
                      type="button"
                      @click="onLeftClick"
                      :disabled="!selectedPosition || (!leftIsFree && !isLeftPreviewParticipant)"
                      class="relative rounded-md p-4 text-left ring-1 ring-gray-200 bg-gray-50 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors transition-transform duration-150 hover:-translate-y-0.5 hover:shadow focus:outline-none focus:ring-2 focus:ring-black hover:ring-2 hover:ring-black dark:hover:ring-white dark:bg-[#2f2f35] dark:hover:bg-[#3a3a40] dark:ring-gray-700 dark:focus:ring-white"
                      :title="(leftIsFree || isLeftPreviewParticipant) ? 'Выбрать левую сторону' : 'Место занято'"
                      :class="{ 'animate-bump': animateLeft }"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-xs text-gray-500 mb-1 dark:text-gray-300">Левый</div>
                          <!-- При выборе стороны при обеих свободных — показываем участника на выбранной стороне -->
                          <template v-if="isLeftPreviewParticipant">
                            <div class="text-sm font-medium dark:text-white">{{ participantInfo.lastname }} {{ participantInfo.name }} {{ participantInfo.patronymic }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-300">{{ participantInfo.personal_number }}</div>
                          </template>
                          <template v-else-if="leftIsFree && rightIsFree">
                            <div class="text-sm font-medium dark:text-white">Свободно</div>
                          </template>
                          <template v-else>
                            <div class="text-sm font-medium text-gray-400 dark:text-gray-400">Занято</div>
                          </template>
                        </div>
                        <div class="ml-3">
                          <svg v-if="selectedSide==='left'" class="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                          <svg v-else-if="leftIsFree && rightIsFree" class="h-6 w-6 text-gray-700 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                          <svg v-else-if="isLeftPreviewParticipant" class="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                          <svg v-else class="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                      </div>
                    </button>

                    <!-- Правая сторона -->
                    <button
                      type="button"
                      @click="onRightClick"
                      :disabled="!selectedPosition || (!rightIsFree && !isRightPreviewParticipant)"
                      class="relative rounded-md p-4 text-left ring-1 ring-gray-200 bg-gray-50 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors transition-transform duration-150 hover:-translate-y-0.5 hover:shadow focus:outline-none focus:ring-2 focus:ring-black hover:ring-2 hover:ring-black dark:hover:ring-white dark:bg-[#2f2f35] dark:hover:bg-[#3a3a40] dark:ring-gray-700 dark:focus:ring-white"
                      :title="(rightIsFree || isRightPreviewParticipant) ? 'Выбрать правую сторону' : 'Место занято'"
                      :class="{ 'animate-bump': animateRight }"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-xs text-gray-500 mb-1 dark:text-gray-300">Правый</div>
                          <template v-if="isRightPreviewParticipant">
                            <div class="text-sm font-medium dark:text-white">{{ participantInfo.lastname }} {{ participantInfo.name }} {{ participantInfo.patronymic }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-300">{{ participantInfo.personal_number }}</div>
                          </template>
                          <template v-else-if="leftIsFree && rightIsFree">
                            <div class="text-sm font-medium dark:text-white">Свободно</div>
                          </template>
                          <template v-else>
                            <div class="text-sm font-medium text-gray-400 dark:text-gray-400">Занято</div>
                          </template>
                        </div>
                        <div class="ml-3">
                          <svg v-if="selectedSide==='right'" class="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                          <svg v-else-if="leftIsFree && rightIsFree" class="h-6 w-6 text-gray-700 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                          <svg v-else-if="isRightPreviewParticipant" class="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                          <svg v-else class="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <!-- Кнопка добавить в структуру на всю ширину под визуальным блоком -->
              <div class="mt-3">
                <button 
                  @click="addToStructure" 
                  class="inline-flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-60 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
                  :disabled="!selectedPosition || (selectedPosition.position === 'both' && !side) || adding"
                >
                  <span v-if="adding" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
                  Добавить в структуру
                </button>
              </div>
              
              
            </div>
          </div>

          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'

// Router для навигации
const router = useRouter()
const route = useRoute()

// Реактивные данные
const loading = ref(false)
const participantInfo = ref({})
const sponsorInfo = ref(null)
const availablePositions = ref([])
const filteredPositions = ref([])
const positionSearchQuery = ref('')
const selectedPosition = ref(null)
const side = ref('')
const loadingPositions = ref(false)
const adding = ref(false)
// Анимации смены
const animateMentor = ref(false)
const animateLeft = ref(false)
const animateRight = ref(false)
// Доступность для выбранного ментора
const leftIsFree = computed(() => {
  if (!selectedPosition.value) return false
  return selectedPosition.value.position === 'left' || selectedPosition.value.position === 'both'
})
const rightIsFree = computed(() => {
  if (!selectedPosition.value) return false
  return selectedPosition.value.position === 'right' || selectedPosition.value.position === 'both'
})

// Превью участника, когда свободна только одна сторона у выбранного ментора
const isLeftPreviewParticipant = computed(() => {
  if (!selectedPosition.value) return false
  if (selectedPosition.value.position === 'left') return true
  return selectedPosition.value.position === 'both' && side.value === 'left'
})
const isRightPreviewParticipant = computed(() => {
  if (!selectedPosition.value) return false
  if (selectedPosition.value.position === 'right') return true
  return selectedPosition.value.position === 'both' && side.value === 'right'
})

const selectedSide = computed(() => side.value)

// Обработчики кликов по сторонам: выбирают только сторону
const onLeftClick = () => {
  if (!selectedPosition.value) return
  if (!leftIsFree.value && !isLeftPreviewParticipant.value) return
  side.value = 'left'
  animateLeft.value = false
  requestAnimationFrame(() => { animateLeft.value = true })
}

const onRightClick = () => {
  if (!selectedPosition.value) return
  if (!rightIsFree.value && !isRightPreviewParticipant.value) return
  side.value = 'right'
  animateRight.value = false
  requestAnimationFrame(() => { animateRight.value = true })
}

const onClearSelection = () => {
  selectedPosition.value = null
  side.value = ''
}


// API базовый URL
// centralized API client is used

// Получение ID участника из маршрута
const participantId = ref(route.params.id)

// Загрузка информации об участнике
const loadParticipantInfo = async () => {
  loading.value = true
  try {
    const response = await api.get(`participants/${participantId.value}`)
    participantInfo.value = response.data
    
    // Если есть sponsor_id, загружаем информацию о спонсоре
    if (response.data.sponsor_id) {
      await loadSponsorInfo(response.data.sponsor_id)
    }
  } catch (error) {
    console.error('Ошибка загрузки информации об участнике:', error)
  } finally {
    loading.value = false
  }
}

// Загрузка информации о спонсоре
const loadSponsorInfo = async (sponsorId) => {
  try {
    const response = await api.get(`participants/${sponsorId}`)
    sponsorInfo.value = response.data
    
    // Загружаем доступные позиции
    await loadAvailablePositions(sponsorId)
  } catch (error) {
    console.error('Ошибка загрузки информации о спонсоре:', error)
  }
}

// Загрузка доступных позиций
const loadAvailablePositions = async (sponsorId) => {
  loadingPositions.value = true
  try {
    const response = await api.get(`structure/find_free_positions/${sponsorId}`)
    availablePositions.value = response.data.available_positions || []
    // Инициализируем отфильтрованные позиции
    filteredPositions.value = [...availablePositions.value]
    // Автовыбор стороны выполняется при выборе ментора (selectPosition)
  } catch (error) {
    console.error('Ошибка загрузки доступных позиций:', error)
    availablePositions.value = []
    filteredPositions.value = []
  } finally {
    loadingPositions.value = false
  }
}

// Фильтрация позиций по поисковому запросу
const filterPositions = () => {
  if (!positionSearchQuery.value.trim()) {
    // Если поиск пустой, показываем все позиции
    filteredPositions.value = [...availablePositions.value]
  } else {
    const query = positionSearchQuery.value.toLowerCase().trim()
    filteredPositions.value = availablePositions.value.filter(position => {
      const fullName = `${position.name} ${position.lastname} ${position.patronymic}`.toLowerCase()
      const personalNumber = position.personal_number.toLowerCase()
      
      return fullName.includes(query) || personalNumber.includes(query)
    })
  }
}

// Выбор позиции
const selectPosition = (position) => {
  selectedPosition.value = position
  side.value = '' // Сбрасываем выбор стороны
  // Если у выбранного ментора доступна только одна сторона — автоподстановка
  if (position.position === 'left') {
    side.value = 'left'
  } else if (position.position === 'right') {
    side.value = 'right'
  }
  animateMentor.value = false
  requestAnimationFrame(() => { animateMentor.value = true })
}

// Очистка выбранной позиции
const clearPosition = () => {
  selectedPosition.value = null
  side.value = ''
  positionSearchQuery.value = ''
  // Сбрасываем фильтр и показываем все позиции
  filteredPositions.value = [...availablePositions.value]
}

// Получение текста позиции
const getPositionText = (position) => {
  switch (position) {
    case 'left':
      return 'Только левая'
    case 'right':
      return 'Только правая'
    case 'both':
      return 'Обе стороны'
    default:
      return position
  }
}

// Получение класса бейджа для позиции (Tailwind)
const getPositionBadgeClass = (position) => {
  switch (position) {
    case 'left':
      return 'bg-blue-100 text-blue-800'
    case 'right':
      return 'bg-green-100 text-green-800'
    case 'both':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Получение иконки для позиции
const getPositionIcon = (position) => {
  switch (position) {
    case 'left':
      return 'bi bi-arrow-left me-1'
    case 'right':
      return 'bi bi-arrow-right me-1'
    case 'both':
      return 'bi bi-arrows-left-right me-1'
    default:
      return 'bi bi-question-circle me-1'
  }
}

// Добавление в структуру
const addToStructure = async () => {
  if (!selectedPosition.value) {
    return
  }
  
  // Определяем позицию
  let finalPosition = selectedPosition.value.position
  if (selectedPosition.value.position === 'both' && side.value) {
    finalPosition = side.value
  }
  
  adding.value = true
  
  try {
    const payload = {
      mentor_id: selectedPosition.value.id,
      participant_id: participantId.value,
      position: finalPosition
    }
    
    await api.post(`structure/add`, payload)
    
    // Перенаправляем на страницу структуры
    router.push(`/registration`)
  } catch (error) {
    console.error('Ошибка добавления в структуру:', error)
    alert('Ошибка при добавлении в структуру: ' + (error.response?.data?.message || error.message))
  } finally {
    adding.value = false
  }
}

// Загрузка при монтировании компонента
onMounted(() => {
  if (participantId.value) {
    loadParticipantInfo()
  }
})
</script>

<style scoped>
.list-group-item.active {
  background-color: #007bff;
  border-color: #007bff;
}

.form-control-plaintext {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
}

/* Небольшая bump-анимация для наглядности изменений */
@keyframes bump {
  0% { transform: scale(1); }
  40% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
.animate-bump {
  animation: bump 220ms ease-in-out;
}
</style>
