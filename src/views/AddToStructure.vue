<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white">Добавить в структуру</h1>
      <button @click="$router.go(-1)" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Назад</button>
    </div>

    <div class="bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
      <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
        <h5 class="mb-0 dark:text-white">Добавление участника в структуру</h5>
      </div>
      <div class="p-4">
        <!-- Загрузка -->
        <div v-if="loading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>

        <!-- Форма добавления -->
        <div v-if="!loading">
          <div class="grid md:grid-cols-12 gap-4">
            <div class="md:col-span-6">
              <h6 class="mb-2 dark:text-white">Информация об участнике</h6>
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Участник:</label>
                <div class="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:bg-[#3f3f47] dark:border-gray-700">
                  <strong class="dark:text-white">{{ participantInfo.name }} {{ participantInfo.lastname }} {{ participantInfo.patronymic }}</strong><br>
                  <small class="text-gray-500 dark:text-white">{{ participantInfo.personal_number }}</small>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Спонсор:</label>
                <div class="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:bg-[#3f3f47] dark:border-gray-700">
                  <strong v-if="sponsorInfo" class="dark:text-white">{{ sponsorInfo.lastname }} {{ sponsorInfo.name }} {{ sponsorInfo.patronymic }}</strong>
                  <span v-else class="text-gray-500 dark:text-white">Не указан</span><br>
                  <small v-if="sponsorInfo" class="text-gray-500 dark:text-white">{{ sponsorInfo.personal_number }}</small>
                </div>
              </div>
            </div>
            
            <div class="md:col-span-6">
              <h6 class="mb-2 dark:text-white">Доступные позиции</h6>
              
              <!-- Поиск по позициям -->
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
              
              <div v-if="filteredPositions.length > 0" class="rounded-md border border-gray-200 divide-y dark:border-gray-700 dark:divide-gray-700">
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
              
              <div v-else-if="availablePositions.length > 0 && filteredPositions.length === 0" class="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800 dark:bg-[#3f3f47] dark:border-gray-700 dark:text-white">
                <strong>Ничего не найдено</strong><br>
                Попробуйте изменить поисковый запрос
              </div>
              
              <div v-else-if="!loadingPositions" class="rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-[#3f3f47] dark:border-gray-700 dark:text-white">
                <strong>Нет доступных позиций</strong><br>
                У спонсора нет свободных мест в структуре
              </div>
            </div>
          </div>

          <!-- Выбранная позиция -->
          <div v-if="selectedPosition" class="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800 mt-3 dark:bg-[#3f3f47] dark:border-gray-700 dark:text-white">
            <h6 class="mb-2">Выбранная позиция:</h6>
            <div class="flex items-center justify-between">
              <div>
                <strong class="dark:text-white">{{ selectedPosition.lastname }} {{ selectedPosition.name }} {{ selectedPosition.patronymic }}</strong><br>
                <small class="dark:text-white">{{ selectedPosition.personal_number }}</small>
                <div class="mt-1">
                  <span :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' + getPositionBadgeClass(selectedPosition.position)">
                    {{ getPositionText(selectedPosition.position) }}
                  </span>
                </div>
              </div>
              <button @click="clearPosition" class="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-800 hover:bg-gray-100 dark:bg-[#3f3f47] dark:text-white dark:border-gray-700 dark:hover:bg-[#4a4a52]">Изменить</button>
            </div>
          </div>

          <!-- Выбор стороны (если доступны обе) -->
          <div v-if="selectedPosition && selectedPosition.position === 'both'" class="mb-3 mt-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Выберите сторону:</label>
            <div class="flex items-center gap-4">
              <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                <input 
                  v-model="side" 
                  value="left" 
                  type="radio" 
                  class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black dark:border-white dark:text-white dark:focus:ring-white"
                >
                <span class="text-sm dark:text-white">Левый ребенок</span>
              </label>
              <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                <input 
                  v-model="side" 
                  value="right" 
                  type="radio" 
                  class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black dark:border-white dark:text-white dark:focus:ring-white"
                >
                <span class="text-sm dark:text-white">Правый ребенок</span>
              </label>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="flex gap-2">
            <button 
              @click="addToStructure" 
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
              :disabled="!selectedPosition || (selectedPosition.position === 'both' && !side) || adding"
            >
              <span v-if="adding" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
              Добавить в структуру
            </button>
            <button @click="$router.go(-1)" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
</style>
