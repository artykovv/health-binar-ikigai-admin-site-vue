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
          
          <!-- Filters -->
          <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Filter by Branch -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-white">Филиал</label>
              <select 
                v-model="selectedBranchId"
                @change="handleBranchChange"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
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
            
            <!-- Search by FIO or Personal Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-white">Поиск по ФИО или личному номеру</label>
              <input
                v-model="searchQuery"
                @input="handleSearchInput"
                type="text"
                placeholder="Введите имя, фамилию или номер..."
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white dark:placeholder-gray-400"
              >
            </div>
            
            <!-- Search by Order ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-white">Поиск по ID заказа</label>
              <input
                v-model.number="orderIdSearch"
                @input="handleOrderIdInput"
                type="number"
                placeholder="Введите ID заказа..."
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white dark:placeholder-gray-400"
              >
            </div>
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
                      <th 
                        class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        @click="toggleContractsSort('id')"
                      >
                        <div class="flex items-center gap-1">
                          ID
                          <span v-if="contractsSortBy === 'id'">
                            {{ contractsSortOrder === 'asc' ? '↑' : '↓' }}
                          </span>
                        </div>
                      </th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                      <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">USD</th>
                      <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">СОМ</th>
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
                      <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-bold text-blue-600 dark:text-blue-400">{{ formatUSD(order.total_amount) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ toSOM(order.total_amount).toLocaleString() }}</td>
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
            
            <!-- Pagination -->
            <div class="flex items-center justify-between mt-4">
              <div class="text-sm text-gray-700 dark:text-gray-300">
                Страница {{ contractsPage }}
              </div>
              <div class="flex gap-2">
                <button
                  @click="changeContractsPage(-1)"
                  :disabled="contractsPage === 1"
                  class="px-3 py-1 rounded border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-white dark:hover:bg-[#4a4a52]"
                >
                  Назад
                </button>
                <button
                  @click="changeContractsPage(1)"
                  :disabled="orders.length < contractsLimit"
                  class="px-3 py-1 rounded border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-white dark:hover:bg-[#4a4a52]"
                >
                  Вперед
                </button>
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
                    <th 
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      @click="toggleHealthDaySort('id')"
                    >
                      <div class="flex items-center gap-1">
                        ID
                        <span v-if="healthDaySortBy === 'id'">
                          {{ healthDaySortOrder === 'asc' ? '↑' : '↓' }}
                        </span>
                      </div>
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Участник</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">USD</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">СОМ</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Способ оплаты</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Изображения</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата создания</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                    <tr v-if="healthDayOrders.length === 0">
                      <td colspan="7" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
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
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div v-if="order.participant">
                          <div class="font-medium">{{ order.participant.name }} {{ order.participant.lastname }} {{ order.participant.patronymic }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">{{ order.participant.personal_number }}</div>
                        </div>
                        <span v-else class="text-gray-500 dark:text-gray-400">-</span>
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ order.branch?.name || '-' }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-bold text-blue-600 dark:text-blue-400">{{ formatUSD(order.total_amount) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ toSOM(order.total_amount).toLocaleString() }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ order.payment_method?.name || '-' }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white" @click.stop>
                        <div v-if="order.images && order.images.length > 0" class="flex gap-1">
                          <img 
                            v-for="img in order.images.slice(0, 3)" 
                            :key="img.url"
                            :src="img.url" 
                            :alt="img.alt"
                            class="w-8 h-8 object-cover rounded cursor-pointer hover:scale-110 transition-transform"
                            @click="openImagePreview(img.url)"
                          >
                          <span v-if="order.images.length > 3" class="text-xs text-gray-500 dark:text-gray-400 self-center">
                            +{{ order.images.length - 3 }}
                          </span>
                        </div>
                        <span v-else class="text-gray-400">-</span>
                      </td>
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
                
                <!-- Pagination -->
                <div class="flex items-center justify-between mt-4">
                  <div class="text-sm text-gray-700 dark:text-gray-300">
                    Страница {{ healthDayPage }}
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="changeHealthDayPage(-1)"
                      :disabled="healthDayPage === 1"
                      class="px-3 py-1 rounded border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-white dark:hover:bg-[#4a4a52]"
                    >
                      Назад
                    </button>
                    <button
                      @click="changeHealthDayPage(1)"
                      :disabled="healthDayOrders.length < healthDayLimit"
                      class="px-3 py-1 rounded border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-white dark:hover:bg-[#4a4a52]"
                    >
                      Вперед
                    </button>
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
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import { formatUSD, toSOM } from '@/utils/currency'
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
const contractsPage = ref(1)
const contractsLimit = ref(20)
const contractsSortBy = ref('id')
const contractsSortOrder = ref('desc')

// Поиск для контрактов
const searchQuery = ref('')
const orderIdSearch = ref(null)
let searchDebounceTimer = null

// Заказы для вкладки Health Day
const healthDayOrders = ref([])
const loadingHealthDayOrders = ref(false)
const healthDayPage = ref(1)
const healthDayLimit = ref(20)
const healthDaySortBy = ref('id')
const healthDaySortOrder = ref('desc')

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
const previewImage = ref(null)

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
      page: contractsPage.value,
      limit: contractsLimit.value,
      sort_by: contractsSortBy.value,
      sort_order: contractsSortOrder.value
    }
    
    if (selectedBranchId.value) {
      params.branch_id = selectedBranchId.value
    }
    
    if (searchQuery.value && searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    
    if (orderIdSearch.value) {
      params.order_id = orderIdSearch.value
    }
    
    const response = await api.get('orders/', { params })
    // Handle both array response and paginated response structure if backend changes
    if (Array.isArray(response.data)) {
      orders.value = response.data
    } else if (response.data && response.data.items) {
      orders.value = response.data.items
    } else {
      orders.value = []
    }
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
  } finally {
    loadingOrders.value = false
  }
}

// Обработчик изменения филиала
const handleBranchChange = () => {
  contractsPage.value = 1
  loadOrders()
}

// Обработчик ввода поиска с debouncing
const handleSearchInput = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
  searchDebounceTimer = setTimeout(() => {
    contractsPage.value = 1
    loadOrders()
  }, 300)
}

// Обработчик ввода ID заказа с debouncing
const handleOrderIdInput = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
  searchDebounceTimer = setTimeout(() => {
    contractsPage.value = 1
    loadOrders()
  }, 300)
}

// Сортировка контрактов
const toggleContractsSort = (column) => {
  if (contractsSortBy.value === column) {
    contractsSortOrder.value = contractsSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    contractsSortBy.value = column
    contractsSortOrder.value = 'desc'
  }
  loadOrders()
}

// Пагинация контрактов
const changeContractsPage = (delta) => {
  const newPage = contractsPage.value + delta
  if (newPage >= 1) {
    contractsPage.value = newPage
    loadOrders()
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
    const params = {
      page: healthDayPage.value,
      limit: healthDayLimit.value,
      sort_by: healthDaySortBy.value,
      sort_order: healthDaySortOrder.value
    }
    
    // Note: Assuming backend returns 'images' field eager loaded as per previous backend changes
    const response = await api.get('health-day/orders', { params })
    // Handle both array response and paginated response structure if backend changes
    if (Array.isArray(response.data)) {
      healthDayOrders.value = response.data
    } else if (response.data && response.data.items) {
      healthDayOrders.value = response.data.items
    } else {
      healthDayOrders.value = []
    }
  } catch (error) {
    console.error('Ошибка загрузки заказов Health Day:', error)
    healthDayOrders.value = []
  } finally {
    loadingHealthDayOrders.value = false
  }
}

// Сортировка Health Day
const toggleHealthDaySort = (column) => {
  if (healthDaySortBy.value === column) {
    healthDaySortOrder.value = healthDaySortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    healthDaySortBy.value = column
    healthDaySortOrder.value = 'desc'
  }
  loadHealthDayOrders()
}

// Пагинация Health Day
const changeHealthDayPage = (delta) => {
  const newPage = healthDayPage.value + delta
  if (newPage >= 1) {
    healthDayPage.value = newPage
    loadHealthDayOrders()
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

const openImagePreview = (url) => {
  previewImage.value = url
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

