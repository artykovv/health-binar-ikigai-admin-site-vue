<template>
  <div 
    v-if="visible" 
    class="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300"
  >
    <div class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-[#3f3f47]">
      <h5 class="m-0 dark:text-white">Детали заказа #{{ orderId }}</h5>
      <button @click="handleClose" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-[#4a4a52]">✕</button>
    </div>
    <div class="p-4">
      <!-- Ответственный -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold dark:text-white mb-4">Ответственный</h3>
        <div v-if="loadingResponsibleParticipant" class="text-center py-8">
          <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        <div v-else-if="responsibleParticipant" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ФИО</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Персональный номер</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ responsibleParticipant.name }} {{ responsibleParticipant.lastname }} {{ responsibleParticipant.patronymic }}
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ responsibleParticipant.personal_number }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#4a4a52]">
          Ответственный не указан
        </div>
      </div>

      <!-- Доплата по заказу -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold dark:text-white mb-4">Доплата по заказу</h3>
        <div v-if="extraPayments && extraPayments.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Метод оплаты</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Описание</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата создания</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Чек</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr 
                v-for="payment in extraPayments" 
                :key="payment.id"
                class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]"
              >
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ Math.round(payment.amount).toLocaleString() }} сом</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ payment.payment_method?.name || '-' }}</td>
                <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ payment.description || '-' }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(payment.created_at) }}</td>

                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div v-if="payment.images && payment.images.length > 0" class="flex gap-1">
                      <img 
                        v-for="img in payment.images.slice(0, 3)" 
                        :key="img.url"
                        :src="img.url" 
                        :alt="img.alt"
                        class="w-8 h-8 object-cover rounded cursor-pointer hover:scale-110 transition-transform"
                        @click="openImagePreview(img.url)"
                      >
                      <span v-if="payment.images.length > 3" class="text-xs text-gray-500 dark:text-gray-400 self-center">
                        +{{ payment.images.length - 3 }}
                      </span>
                    </div>
                    <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm">
                  <button
                    @click="openEditPaymentModal(payment)"
                    class="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Редактировать
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#4a4a52]">
          Нет данных о доплате
        </div>
      </div>

      <!-- Контракты -->
      <div>
        <h3 class="text-lg font-semibold dark:text-white mb-4">Контракты</h3>
        <div v-if="loadingOrderContracts" class="text-center py-8">
          <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        <div v-else-if="orderContracts && orderContracts.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ФИО</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Персональный номер</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Использованная сумма</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата создания</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr 
                v-for="contract in orderContracts" 
                :key="contract.id"
                class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]"
              >
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div v-if="contract.participant">
                    {{ contract.participant.name }} {{ contract.participant.lastname }} {{ contract.participant.patronymic }}
                  </div>
                  <span v-else class="text-gray-500 dark:text-gray-400">-</span>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ contract.participant?.personal_number || '-' }}
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ Math.round(contract.amount_used).toLocaleString() }} сом</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(contract.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#4a4a52]">
          Нет данных о контрактах
        </div>
      </div>
    </div>
    <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
      <button @click="handleClose" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Закрыть</button>
    </div>
    
    <!-- Edit Extra Payment Modal -->
    <EditExtraPaymentModal
      :visible="editPaymentModalVisible"
      :payment="selectedPayment"
      @close="closeEditPaymentModal"
      @saved="handlePaymentSaved"
    />

    <!-- Image Preview Modal -->
    <div v-if="previewImage" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" @click="previewImage = null">
      <button class="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <img :src="previewImage" class="max-w-full max-h-full object-contain" @click.stop>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { api } from '@/api'
import EditExtraPaymentModal from './EditExtraPaymentModal.vue'

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

const orderDetail = ref(null)
const extraPayments = ref([])
const orderContracts = ref([])
const loadingOrderContracts = ref(false)
const responsibleParticipant = ref(null)
const loadingResponsibleParticipant = ref(false)

// Модальное окно редактирования доплаты
const editPaymentModalVisible = ref(false)
const selectedPayment = ref(null)

const previewImage = ref(null)
const openImagePreview = (url) => {
  previewImage.value = url
}

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

const handleClose = () => {
  emit('close')
}

const loadOrderDetail = async (orderId) => {
  if (!orderId) return
  
  try {
    const response = await api.get(`orders/${orderId}`)
    const orderData = Array.isArray(response.data) ? response.data[0] : response.data
    orderDetail.value = orderData
    
    // Загружаем ответственного участника, если есть ID
    if (orderData.responsible_participant_id) {
      await loadResponsibleParticipant(orderData.responsible_participant_id)
    }
    
    // Загружаем доплаты
    try {
      const extraPaymentsResponse = await api.get(`orders/extra-payment/${orderId}`)
      if (Array.isArray(extraPaymentsResponse.data)) {
        extraPayments.value = extraPaymentsResponse.data
      } else if (extraPaymentsResponse.data && extraPaymentsResponse.data.id) {
        extraPayments.value = [extraPaymentsResponse.data]
      } else {
        extraPayments.value = []
      }
    } catch (error) {
      extraPayments.value = []
    }
  } catch (error) {
    console.error('Ошибка загрузки деталей заказа:', error)
  }
}

const loadResponsibleParticipant = async (participantId) => {
  if (!participantId) return
  
  loadingResponsibleParticipant.value = true
  try {
    const response = await api.get(`participants/${participantId}`)
    responsibleParticipant.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки ответственного участника:', error)
    responsibleParticipant.value = null
  } finally {
    loadingResponsibleParticipant.value = false
  }
}

const loadOrderContracts = async (orderId) => {
  if (!orderId) return
  
  loadingOrderContracts.value = true
  try {
    const response = await api.get(`contracts/usages/${orderId}/participants`)
    orderContracts.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Ошибка загрузки контрактов:', error)
    orderContracts.value = []
  } finally {
    loadingOrderContracts.value = false
  }
}

const openEditPaymentModal = (payment) => {
  selectedPayment.value = payment
  editPaymentModalVisible.value = true
}

const closeEditPaymentModal = () => {
  editPaymentModalVisible.value = false
  selectedPayment.value = null
}

const handlePaymentSaved = (updatedPayment) => {
  const paymentIndex = extraPayments.value.findIndex(p => p.id === updatedPayment.id)
  if (paymentIndex !== -1) {
    extraPayments.value[paymentIndex] = updatedPayment
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal && props.orderId) {
    loadOrderDetail(props.orderId)
    loadOrderContracts(props.orderId)
  } else if (!newVal) {
    orderDetail.value = null
    extraPayments.value = []
    orderContracts.value = []
    responsibleParticipant.value = null
    editPaymentModalVisible.value = false
    selectedPayment.value = null
  }
})

watch(() => props.orderId, (newId) => {
  if (props.visible && newId) {
    responsibleParticipant.value = null
    loadOrderDetail(newId)
    loadOrderContracts(newId)
  }
})

onMounted(() => {
  if (props.visible && props.orderId) {
    loadOrderDetail(props.orderId)
    loadOrderContracts(props.orderId)
  }
})
</script>

