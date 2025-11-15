<template>
  <div 
    v-if="visible" 
    class="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300"
  >
    <div class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-[#3f3f47]">
      <h5 class="m-0 dark:text-white">Детали заказа Health Day #{{ orderId }}</h5>
      <button @click="handleClose" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-[#4a4a52]">✕</button>
    </div>
    <div class="p-4">
      <!-- Bonuses Info -->
      <div class="space-y-6">
        <div class="p-4 bg-gray-50 dark:bg-[#4a4a52] rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 class="text-lg font-semibold dark:text-white mb-3">Бонусы по заказу</h3>
          <div v-if="loadingBonuses" class="text-center py-8">
            <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
          </div>
          <div v-else-if="bonuses && bonuses.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Участник</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">От кого</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Глубина</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                <tr
                  v-for="bonus in bonuses"
                  :key="bonus.id"
                  class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]"
                >
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <p class="font-medium">{{ bonus.participant_fio }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ bonus.participant_personal_number }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <p class="font-medium">{{ bonus.from_participant_fio }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ bonus.from_participant_personal_number }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">${{ bonus.amount }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.depth }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.branch }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': bonus.status === 'paid',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': bonus.status === 'pending',
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': bonus.status === 'cancelled'
                      }"
                    >
                      {{ getBonusStatusName(bonus.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.received_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#3f3f47]">
            Бонусы не найдены
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { api } from '@/api'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['close'])

const bonuses = ref([])
const loadingBonuses = ref(false)

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getBonusStatusName = (status) => {
  const statusMap = {
    'paid': 'Оплачен',
    'pending': 'Ожидание',
    'cancelled': 'Отменен'
  }
  return statusMap[status] || status
}

const handleClose = () => {
  emit('close')
}


const loadBonuses = async (orderId) => {
  if (!orderId) {
    bonuses.value = []
    return
  }
  
  loadingBonuses.value = true
  try {
    console.log('Загрузка бонусов для заказа:', orderId)
    const response = await api.get('bonuses/health_day', {
      params: {
        health_day_order_id: orderId
      }
    })
    console.log('Ответ бонусов:', response.data)
    bonuses.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Ошибка загрузки бонусов:', error)
    console.error('Детали ошибки:', error.response)
    bonuses.value = []
  } finally {
    loadingBonuses.value = false
  }
}

// Функция для загрузки данных
const loadData = () => {
  if (props.visible && props.orderId) {
    console.log('Загрузка данных для orderId:', props.orderId)
    loadBonuses(props.orderId)
  } else {
    console.log('Модальное окно не открыто или orderId отсутствует', { visible: props.visible, orderId: props.orderId })
  }
}

watch(() => props.visible, (newVal) => {
  console.log('Изменение visible:', newVal, 'orderId:', props.orderId)
  if (newVal && props.orderId) {
    loadData()
  } else if (!newVal) {
    bonuses.value = []
  }
})

watch(() => props.orderId, (newId, oldId) => {
  console.log('Изменение orderId:', { oldId, newId, visible: props.visible })
  if (props.visible && newId) {
    loadData()
  } else if (props.visible && !newId) {
    bonuses.value = []
  }
})

// Загружаем данные при монтировании, если модальное окно уже открыто
onMounted(() => {
  console.log('Компонент смонтирован', { visible: props.visible, orderId: props.orderId })
  if (props.visible && props.orderId) {
    loadData()
  }
})
</script>

