<template>
  <div>
    <div>
      <div>
        <div class="flex items-center justify-between mb-3">
          <h1 class="dark:text-white">Заказы</h1>
        </div>

        <!-- Tabs -->
        <div class="mb-6 flex gap-2">
          <button
            @click="setTab('contracts')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'contracts'
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-gray-300 dark:hover:bg-[#4a4a52]'
            ]"
          >
            Контракты
          </button>
          <button
            @click="setTab('healthday')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'healthday'
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-gray-300 dark:hover:bg-[#4a4a52]'
            ]"
          >
            Health Day
          </button>
        </div>

        <!-- Загрузка -->
        <div v-if="loading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>

        <!-- Contracts Tab -->
        <div v-else-if="activeTab === 'contracts'">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold dark:text-white">Контракты</h2>
            <button 
              @click="openAddContractModal" 
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Добавить заказ
            </button>
          </div>
          
          <!-- Filter by Branch -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-white">Филиал</label>
            <select 
              v-model="selectedBranchId"
              @change="loadOrders"
              class="block w-full max-w-xs rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
            >
              <option :value="null">Все филиалы</option>
              <option 
                v-for="branch in branches" 
                :key="branch.id" 
                :value="branch.id"
              >
                {{ branch.name }}
              </option>
            </select>
          </div>
          
          <!-- Loading Orders -->
          <div v-if="loadingOrders" class="py-6 text-center">
            <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
          </div>
          
          <!-- Orders Table -->
          <div v-else class="overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
              <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Общая сумма</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата создания</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Ответственный</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                    <tr v-if="orders.length === 0">
                      <td colspan="6" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Нет заказов
                      </td>
                    </tr>
                    <tr 
                      v-for="order in orders" 
                      :key="order.id" 
                      class="hover:bg-gray-50 dark:hover:bg-[#4a4a52] cursor-pointer"
                      @click="openOrderDetailModal(order.id)"
                    >
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ order.id }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ order.branch || '-' }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ order.total_amount }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(order.created_at) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          :class="{
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': order.status === 'paid',
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': order.status === 'pending',
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': order.status === 'cancelled'
                          }"
                        >
                          {{ getStatusName(order.status) }}
                        </span>
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div v-if="order.responsible_participant">
                          {{ order.responsible_participant.name }} {{ order.responsible_participant.lastname }}
                          <span class="text-gray-500 dark:text-gray-400">({{ order.responsible_participant.personal_number }})</span>
                        </div>
                        <span v-else class="text-gray-500 dark:text-gray-400">-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Health Day Tab -->
        <div v-else-if="activeTab === 'healthday'">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold dark:text-white">Health Day</h2>
            <button 
              @click="openAddHealthDayModal" 
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Добавить заказ
            </button>
    </div>

          <!-- Loading Health Day Orders -->
          <div v-if="loadingHealthDayOrders" class="py-6 text-center">
            <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
          
          <!-- Health Day Orders Table -->
            <div v-else class="overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
              <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Общая сумма</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Способ оплаты</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата создания</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                    <tr v-if="healthDayOrders.length === 0">
                      <td colspan="6" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Нет заказов
                    </td>
                  </tr>
                    <tr 
                      v-for="order in healthDayOrders" 
                      :key="order.id" 
                      class="hover:bg-gray-50 dark:hover:bg-[#4a4a52] cursor-pointer"
                      @click="openHealthDayOrderDetailModal(order.id)"
                    >
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ order.id }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ order.branch?.name || '-' }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ order.total_amount }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ order.payment_method?.name || '-' }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(order.created_at) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          :class="{
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': order.status === 'paid',
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': order.status === 'pending',
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': order.status === 'cancelled'
                          }"
                        >
                          {{ getStatusName(order.status) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
                </div>
                </div>
        </div>
      </div>
    </div>

    <!-- Add Contract Modal -->
    <AddContractModal
      :visible="addContractModalVisible"
      @close="closeAddContractModal"
      @created="handleContractOrderCreated"
    />

    <!-- Order Detail Modal -->
      <OrderDetailModal
        :visible="orderDetailModalVisible"
        :order-id="selectedOrderId"
        @close="closeOrderDetailModal"
      />

      <!-- Add Health Day Modal -->
      <AddHealthDayModal
        :visible="addHealthDayModalVisible"
        @close="closeAddHealthDayModal"
        @created="handleHealthDayOrderCreated"
      />

      <!-- Health Day Order Detail Modal -->
      <HealthDayOrderDetailModal
        :visible="healthDayOrderDetailModalVisible"
        :order-id="selectedHealthDayOrderId"
        @close="closeHealthDayOrderDetailModal"
      />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import OrderDetailModal from '@/components/OrderDetailModal.vue'
import AddContractModal from '@/components/AddContractModal.vue'
import AddHealthDayModal from '@/components/AddHealthDayModal.vue'
import HealthDayOrderDetailModal from '@/components/HealthDayOrderDetailModal.vue'

const route = useRoute()
const router = useRouter()

// Реактивные данные
const loading = ref(false)

// Инициализируем активную вкладку из URL query параметра
const activeTab = ref(route.query.tab || 'contracts')

// Заказы для вкладки Контракты
const orders = ref([])
const loadingOrders = ref(false)

// Заказы для вкладки Health Day
const healthDayOrders = ref([])
const loadingHealthDayOrders = ref(false)

// Филиалы
const branches = ref([])
const selectedBranchId = ref(null)

// Модальное окно деталей заказа
const orderDetailModalVisible = ref(false)
const selectedOrderId = ref(null)

// Модальное окно деталей заказа Health Day
const healthDayOrderDetailModalVisible = ref(false)
const selectedHealthDayOrderId = ref(null)

// Модальное окно добавления контракта
const addContractModalVisible = ref(false)

// Health Day Modal
const addHealthDayModalVisible = ref(false)

// Установка вкладки с сохранением в URL
const setTab = (tab) => {
  activeTab.value = tab
  router.push({ 
    path: route.path, 
    query: { ...route.query, tab: tab } 
  })
}

// Отслеживание изменений в URL для синхронизации с состоянием
watch(() => route.query.tab, (newTab) => {
  if (newTab && newTab !== activeTab.value) {
    activeTab.value = newTab
  }
})

// Отслеживание изменений активной вкладки для загрузки данных
watch(activeTab, (newTab) => {
  if (newTab === 'contracts') {
    loadOrders()
  } else if (newTab === 'healthday') {
    loadHealthDayOrders()
  }
})

// Функции для модального окна добавления контракта
const openAddContractModal = () => {
  addContractModalVisible.value = true
}

const closeAddContractModal = () => {
  addContractModalVisible.value = false
}

const handleContractOrderCreated = async () => {
  closeAddContractModal()
  await loadOrders()
}


// Загрузка филиалов
const loadBranches = async () => {
  try {
    const response = await api.get('branches/')
    branches.value = response.data.filter(b => b.is_active) || []
    } catch (error) {
    console.error('Ошибка загрузки филиалов:', error)
    branches.value = []
  }
}

// Загрузка заказов
const loadOrders = async () => {
  loadingOrders.value = true
  try {
    const params = {
      skip: 0,
      limit: 100
    }
    
    if (selectedBranchId.value) {
      params.branch_id = selectedBranchId.value
    }
    
    const response = await api.get('orders/', { params })
    orders.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
  } finally {
    loadingOrders.value = false
  }
}

// Форматирование даты
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

// Получение названия статуса
const getStatusName = (status) => {
  const statusMap = {
    'paid': 'Оплачен',
    'pending': 'Ожидание',
    'cancelled': 'Отменен'
  }
  return statusMap[status] || status
}

// Открытие модального окна деталей заказа
const openOrderDetailModal = (orderId) => {
  selectedOrderId.value = orderId
  orderDetailModalVisible.value = true
}

// Закрытие модального окна деталей заказа
const closeOrderDetailModal = () => {
  orderDetailModalVisible.value = false
  selectedOrderId.value = null
}

// Health Day Modal Functions
const openAddHealthDayModal = () => {
  addHealthDayModalVisible.value = true
}

const closeAddHealthDayModal = () => {
  addHealthDayModalVisible.value = false
}

const handleHealthDayOrderCreated = async () => {
  closeAddHealthDayModal()
  await loadHealthDayOrders()
}

// Загрузка заказов Health Day
const loadHealthDayOrders = async () => {
  loadingHealthDayOrders.value = true
  try {
    const response = await api.get('health-day/orders', {
      params: {
        skip: 0,
        limit: 100
      }
    })
    healthDayOrders.value = response.data || []
  } catch (error) {
    console.error('Ошибка загрузки заказов Health Day:', error)
    healthDayOrders.value = []
  } finally {
    loadingHealthDayOrders.value = false
  }
}

// Открытие модального окна деталей заказа Health Day
const openHealthDayOrderDetailModal = (orderId) => {
  selectedHealthDayOrderId.value = orderId
  healthDayOrderDetailModalVisible.value = true
}

// Закрытие модального окна деталей заказа Health Day
const closeHealthDayOrderDetailModal = () => {
  healthDayOrderDetailModalVisible.value = false
  selectedHealthDayOrderId.value = null
}

onMounted(async () => {
  // Загружаем филиалы
  await loadBranches()
  
  // Load data based on activeTab
  if (activeTab.value === 'contracts') {
    await loadOrders()
  } else if (activeTab.value === 'healthday') {
    await loadHealthDayOrders()
  }
  
  // Проверяем наличие orderId в query параметрах для автоматического открытия модального окна
  if (route.query.orderId) {
    const orderId = Number(route.query.orderId)
    if (orderId) {
      openOrderDetailModal(orderId)
      // Удаляем параметр из URL после открытия модального окна
      router.replace({ query: { ...route.query, orderId: undefined } })
    }
  }
})

// Отслеживание изменений query параметра orderId
watch(() => route.query.orderId, (newOrderId) => {
  if (newOrderId && !orderDetailModalVisible.value) {
    const orderId = Number(newOrderId)
    if (orderId) {
      openOrderDetailModal(orderId)
      // Удаляем параметр из URL после открытия модального окна
      router.replace({ query: { ...route.query, orderId: undefined } })
    }
  }
})
</script>

<style scoped>
</style>

