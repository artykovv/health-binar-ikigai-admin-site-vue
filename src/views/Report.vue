<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white">Отчёты</h1>
    </div>

    <!-- Фильтры -->
    <div class="mb-3">
      <div class="grid md:grid-cols-12 gap-3">
        <div class="md:col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Неделя</label>
          <select v-model="selectedWeekIndex" @change="onWeekChange"
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
            <option v-for="(w, idx) in weeks" :key="idx" :value="idx">Неделя {{ idx + 1 }}</option>
          </select>
        </div>
        <div class="md:col-span-6">
          <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Поиск</label>
          <input v-model="filters.search" type="text" placeholder="ФИО или персональный номер"
            class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:placeholder-white/70 dark:focus:ring-white" />
        </div>
        <div class="md:col-span-3 flex items-end gap-2">
          <button @click="fetchSummary" :disabled="loading"
            class="inline-flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
            <span v-if="loading" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
            Показать
          </button>
          <button @click="resetFilters" :disabled="loading"
            class="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:bg-[#3f3f47] dark:text-white dark:border-gray-700 dark:hover:bg-[#4a4a52]">
            Сбросить
          </button>
        </div>
      </div>
      <div v-if="errorMessage" class="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-[#3f3f47] dark:border-gray-700 dark:text-white">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Загрузка -->
    <div v-if="loading" class="py-6 text-center">
      <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
    </div>

    <!-- Таблица отчёта -->
    <div v-else-if="summary.length > 0" class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Персональный номер</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ФИО</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Структурный бонус</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Спонсорский бонус</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-for="row in summary" :key="row.participant_id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ row.branch?.name || '-' }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                  <router-link :to="`/participants/${row.participant_id}`" class="hover:underline">{{ row.personal_number }}</router-link>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ row.full_name }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ row.structure_bonus }}</strong></td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ row.sponsor_bonus }}</strong></td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white" colspan="3">Итого</th>
                <th class="px-4 py-2 text-left text-sm text-gray-900 dark:text-white">{{ totalStructure }}</th>
                <th class="px-4 py-2 text-left text-sm text-gray-900 dark:text-white">
                  <div class="flex items-center justify-between gap-3">
                    <span>{{ totalSponsor }}</span>
                    <div class="flex items-center gap-2">
                      <button @click="downloadSummary" type="button" :disabled="downloading"
                        class="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-white text-xs hover:bg-green-700 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
                        <span v-if="downloading" class="mr-2 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/50 border-t-white"></span>
                        Скачать xlsx
                      </button>
                      <button @click="copyPlainText" type="button"
                        class="inline-flex items-center rounded-md bg-black px-3 py-1.5 text-white text-xs hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
                        Копировать
                      </button>
                    </div>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg ring-1 ring-gray-200 p-6 text-gray-700 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
      Данные не найдены. Уточните фильтры и попробуйте снова.
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'

const loading = ref(false)
const errorMessage = ref('')
const summary = ref([])

const filters = ref({
  start_date: '',
  end_date: '',
  search: ''
})

// Недели, считая от стартовой даты 23.09.2025, неделя = [вторник..следующий вторник)
const START_ANCHOR = new Date('2025-09-23T00:00:00')
const weeks = ref([])
const selectedWeekIndex = ref(0)

const totalStructure = computed(() => summary.value.reduce((s, r) => s + (Number(r.structure_bonus) || 0), 0))
const totalSponsor = computed(() => summary.value.reduce((s, r) => s + (Number(r.sponsor_bonus) || 0), 0))

const formatDate = (d) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const setDefaultDates = () => {
  // По умолчанию установить последнюю завершенную неделю
  buildWeeks()
  if (weeks.value.length > 0) {
    selectedWeekIndex.value = weeks.value.length - 1
    const w = weeks.value[selectedWeekIndex.value]
    filters.value.start_date = w.start
    filters.value.end_date = w.end
  }
}

const fetchSummary = async () => {
  errorMessage.value = ''
  if (filters.value.start_date && filters.value.end_date && filters.value.start_date > filters.value.end_date) {
    errorMessage.value = 'Дата начала позже даты окончания'
    return
  }
  loading.value = true
  try {
    const params = {}
    if (filters.value.start_date) params.start_date = filters.value.start_date
    if (filters.value.end_date) params.end_date = filters.value.end_date
    if (filters.value.search) params.search = filters.value.search

    const response = await api.get(`bonuses/summary`, { params })
    summary.value = Array.isArray(response.data) ? response.data : (response.data?.results || [])
  } catch (error) {
    console.error('Ошибка загрузки отчёта:', error)
    errorMessage.value = 'Не удалось загрузить отчёт'
    summary.value = []
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  setDefaultDates()
  filters.value.search = ''
  fetchSummary()
}

// Построение недель с 23.09.2025 по последнюю завершенную неделю
function buildWeeks() {
  weeks.value = []
  const today = new Date()
  // Округляем до полуночи
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  // Находим текущую текущую неделю интервала: [start, end) длиной 7 дней
  let start = new Date(START_ANCHOR)
  let end = new Date(start)
  end.setDate(start.getDate() + 7)
  const result = []
  // Добавляем недели, пока конец недели меньше или равен сегодняшней полуночи (полностью завершенная неделя)
  while (end <= midnight) {
    const label = `${formatDate(start)} — ${formatDate(end)}`
    result.push({ start: formatDate(start), end: formatDate(end), label })
    // Следующая неделя
    start = new Date(end)
    end = new Date(start)
    end.setDate(start.getDate() + 7)
  }
  weeks.value = result
}

function onWeekChange() {
  const w = weeks.value[selectedWeekIndex.value]
  if (!w) return
  filters.value.start_date = w.start
  filters.value.end_date = w.end
}

// Копирование всех строк как обычный текст
async function copyPlainText() {
  try {
    const lines = summary.value.map((row) => {
      const branchName = row.branch?.name || '-'
      return `${branchName}\t${row.personal_number}\t${row.full_name}\t${row.structure_bonus}\t${row.sponsor_bonus}`
    })
    const header = 'Филиал\tПерсональный номер\tФИО\tСтруктурный бонус\tСпонсорский бонус'
    const totals = `Итого\t\t\t${totalStructure.value}\t${totalSponsor.value}`
    const text = [header, ...lines, totals].join('\n')
    await navigator.clipboard.writeText(text)
  } catch (e) {
    console.error('Не удалось скопировать', e)
  }
}

// Скачать Excel отчёт за выбранную неделю
const downloading = ref(false)
async function downloadSummary() {
  if (!filters.value.start_date || !filters.value.end_date) return
  downloading.value = true
  try {
    const response = await api.get(`bonuses/summary/download`, {
      params: { start_date: filters.value.start_date, end_date: filters.value.end_date, search: filters.value.search || undefined },
      responseType: 'blob'
    })
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const name = `report_${filters.value.start_date}_to_${filters.value.end_date}.xlsx`
    a.setAttribute('download', name)
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Ошибка скачивания отчёта:', e)
  } finally {
    downloading.value = false
  }
}

onMounted(() => {
  setDefaultDates()
  fetchSummary()
})
</script>
