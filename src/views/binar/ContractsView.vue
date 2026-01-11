<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white text-2xl font-bold">Контракты</h1>
      <button
        @click="openAddModal"
        class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Добавить контракт
      </button>
    </div>

    <!-- Search -->
    <div class="mb-3">
      <input
        v-model="searchQuery"
        @input="debouncedSearch"
        type="text"
        placeholder="Поиск по ФИО участника..."
        class="w-full md:w-96 rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
      >
    </div>

    <!-- Contracts Table -->
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Участник</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Остаток</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Метод оплаты</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Изображения</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-if="loading" class="animate-pulse">
                <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка...</td>
              </tr>
              <tr v-else-if="contracts.length === 0">
                <td colspan="7" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет контрактов</td>
              </tr>
              <tr v-for="contract in contracts" :key="contract.participant?.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div>
                    <div class="font-medium">{{ contract.participant?.lastname }} {{ contract.participant?.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ contract.participant?.patronymic }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">№ {{ contract.participant?.personal_number }}</div>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div class="font-bold text-blue-600 dark:text-blue-400">${{ formatUSD(contract.total_initial_amount) }}</div>
                  <div class="font-bold text-emerald-600 dark:text-emerald-400">{{ toSOM(contract.total_initial_amount).toLocaleString() }} сом</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <div class="font-bold text-blue-600 dark:text-blue-400">${{ formatUSD(contract.total_remaining_amount) }}</div>
                  <div class="font-bold text-emerald-600 dark:text-emerald-400">{{ toSOM(contract.total_remaining_amount).toLocaleString() }} сом</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div v-for="pm in contract.payment_methods" :key="pm.id">
                    {{ pm.name }}
                  </div>
                  <span v-if="!contract.payment_methods?.length">-</span>
                </td>
                <td class="px-4 py-3 text-sm">
                  <div v-if="contract.images?.length > 0" class="flex gap-1">
                    <img 
                      v-for="img in contract.images.slice(0, 3)" 
                      :key="img.url"
                      :src="img.url" 
                      :alt="img.alt"
                      class="w-8 h-8 object-cover rounded cursor-pointer hover:scale-110 transition-transform"
                      @click="openImagePreview(img.url)"
                    >
                    <span v-if="contract.images.length > 3" class="text-xs text-gray-500 dark:text-gray-400 self-center">
                      +{{ contract.images.length - 3 }}
                    </span>
                  </div>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(contract.last_paid_at) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openDetails(contract.participant)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && contracts.length > 0" class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Показано {{ contracts.length }} контрактов
      </div>
      <div class="flex gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
        >
          Назад
        </button>
        <button
          @click="nextPage"
          :disabled="contracts.length < pageSize"
          class="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-sm disabled:opacity-50"
        >
          Вперед
        </button>
      </div>
    </div>

    <!-- Add Contract Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="closeModal"></div>
        
        <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-2xl w-full p-6 animate-in fade-in zoom-in duration-200" @click.stop>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Добавить контракт</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveContract" class="space-y-4">
            <!-- Participant Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Участник *</label>
              <div class="relative">
                <input
                  v-model="participantSearchQuery"
                  @input="searchParticipants"
                  @focus="showParticipantDropdown = true"
                  type="text"
                  placeholder="Введите ФИО участника..."
                  class="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                >
                
                <!-- Dropdown -->
                <div 
                  v-if="showParticipantDropdown && participantResults.length > 0"
                  class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
                >
                  <div
                    v-for="participant in participantResults"
                    :key="participant.id"
                    @click="selectParticipant(participant)"
                    class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                  >
                    <div class="font-medium text-gray-900 dark:text-white">{{ participant.full_name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">№ {{ participant.personal_number }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Selected Participant -->
              <div v-if="form.participant_id" class="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedParticipantName }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">№ {{ selectedParticipantNumber }}</div>
                  </div>
                  <button
                    @click="clearParticipant"
                    type="button"
                    class="text-red-600 hover:text-red-700"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Amount -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Сумма (USD) *</label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    v-model.number="form.initial_amount"
                    @input="syncSom"
                    type="number"
                    step="0.01"
                    required
                    class="block w-full pl-7 rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Сумма (СОМ)</label>
                <div class="relative rounded-md shadow-sm">
                  <input
                    v-model.number="somAmount"
                    @input="syncUsd"
                    type="number"
                    step="0.01"
                    class="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">сом</span>
                  </div>
                </div>
              </div>
            </div>


            <!-- Payment Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Метод оплаты *</label>
              <select
                v-model="form.payment_method_id"
                required
                class="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
                <option :value="null">Выберите метод оплаты</option>
                <option v-for="pm in paymentMethods" :key="pm.id" :value="pm.id">{{ pm.name }}</option>
              </select>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Описание</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                placeholder="Дополнительная информация..."
              ></textarea>
            </div>

            <!-- Images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Изображения (чеки, подтверждения)</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <div v-for="(img, idx) in form.images" :key="idx" class="relative w-20 h-20 group">
                  <img :src="img.url" class="w-full h-full object-cover rounded-lg">
                  <button
                    @click.prevent="removeImage(idx)"
                    class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <button
                  @click.prevent="openImageUpload"
                  type="button"
                  class="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors"
                >
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span class="text-[10px] text-gray-500 mt-1">Загрузить</span>
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
              <button
                @click="closeModal"
                type="button"
                class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                :disabled="saving || !form.participant_id"
                class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {{ saving ? 'Сохранение...' : 'Создать контракт' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showDetailsModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-[#3f3f47] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white dark:bg-[#3f3f47] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                  История контрактов: {{ selectedDetailsParticipant?.lastname }} {{ selectedDetailsParticipant?.name }}
                </h3>
                <div class="mt-4 overflow-x-auto">
                    <p v-if="detailsLoading" class="text-center text-gray-500 py-4">Загрузка...</p>
                    <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr>
                                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата</th>
                                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма (USD)</th>
                                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Остаток</th>
                                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Метод</th>
                                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Описание</th>
                                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Фото</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr v-for="c in detailsContracts" :key="c.id">
                                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                    {{ formatDate(c.paid_at) }}
                                </td>
                                <td class="px-3 py-2 whitespace-nowrap text-sm">
                                    <span class="font-bold text-blue-600 dark:text-blue-400">${{ formatUSD(c.initial_amount) }}</span>
                                    <div class="font-bold text-emerald-600 dark:text-emerald-400">{{ toSOM(c.initial_amount).toLocaleString() }} сом</div>
                                </td>
                                <td class="px-3 py-2 whitespace-nowrap text-sm font-bold text-blue-600 dark:text-blue-400">
                                    ${{ formatUSD(c.remaining_amount) }}
                                </td>
                                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                    {{ c.payment_method?.name }}
                                </td>
                                <td class="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate" :title="c.description">
                                    {{ c.description || '-' }}
                                </td>
                                <td class="px-3 py-2 whitespace-nowrap text-sm">
                                    <div v-if="c.images?.length" class="flex gap-1">
                                        <img 
                                          v-for="img in c.images" 
                                          :key="img.id" 
                                          :src="img.url" 
                                          class="w-8 h-8 object-cover rounded cursor-pointer"
                                          @click="openImagePreview(img.url)"
                                        >
                                    </div>
                                    <span v-else>-</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-[#3f3f47] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-500" @click="showDetailsModal = false">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Upload Modal -->
    <ImageUploadModal
      v-if="imageModalOpen"
      :isOpen="imageModalOpen"
      directory="contracts"
      @close="imageModalOpen = false"
      @uploaded="handleImageUploaded"
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
import { ref, onMounted } from 'vue'
import { binar_api } from '@/api'

import { formatUSD, toSOM, toUSD } from '@/utils/currency'
import ImageUploadModal from '@/components/ImageUploadModal.vue'

const contracts = ref([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const showDetailsModal = ref(false)
const detailsContracts = ref([])
const detailsLoading = ref(false)
const selectedDetailsParticipant = ref(null)
const imageModalOpen = ref(false)
const previewImage = ref(null)

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const somAmount = ref(0) // New ref for SOM amount

// Participant search
const participantSearchQuery = ref('')
const participantResults = ref([])
const showParticipantDropdown = ref(false)
const selectedParticipantName = ref('')
const selectedParticipantNumber = ref('')

// Payment methods
const paymentMethods = ref([])

const defaultForm = {
  participant_id: null,
  initial_amount: 230,
  payment_method_id: null,
  description: '',
  images: []
}

const form = ref({ ...defaultForm })

// Sync functions
const syncSom = () => {
  somAmount.value = toSOM(form.value.initial_amount)
}

const syncUsd = () => {
  form.value.initial_amount = toUSD(somAmount.value)
}

// Fetch contracts
const fetchContracts = async () => {
  loading.value = true
  try {
    const params = {
      skip: (currentPage.value - 1) * pageSize.value,
      limit: pageSize.value
    }
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    const response = await binar_api.get('/contracts/', { params })
    contracts.value = response.data
  } catch (error) {
    console.error('Error fetching contracts:', error)
  } finally {
    loading.value = false
  }
}

// Search participants
let searchTimeout
const searchParticipants = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    if (participantSearchQuery.value.length < 2) {
      participantResults.value = []
      return
    }
    
    try {
      const response = await binar_api.get('/participants/search', {
        params: { query: participantSearchQuery.value, limit: 10 }
      })
      participantResults.value = response.data
      showParticipantDropdown.value = true
    } catch (error) {
      console.error('Error searching participants:', error)
    }
  }, 300)
}

const selectParticipant = (participant) => {
  form.value.participant_id = participant.id
  selectedParticipantName.value = participant.full_name
  selectedParticipantNumber.value = participant.personal_number
  participantSearchQuery.value = participant.full_name
  showParticipantDropdown.value = false
}

const clearParticipant = () => {
  form.value.participant_id = null
  selectedParticipantName.value = ''
  selectedParticipantNumber.value = ''
  participantSearchQuery.value = ''
}

// Payment methods
const fetchPaymentMethods = async () => {
  try {
    const response = await binar_api.get('/enums/payment-methods', { params: { only_active: true } })
    paymentMethods.value = response.data
  } catch (error) {
    console.error('Error fetching payment methods:', error)
  }
}

// Modal actions
const openDetails = async (participant) => {
    selectedDetailsParticipant.value = participant
    showDetailsModal.value = true
    detailsLoading.value = true
    detailsContracts.value = []
    try {
        const response = await binar_api.get(`/contracts/${participant.id}/details`)
        detailsContracts.value = response.data
    } catch (e) {
        console.error("Error fetching details", e)
    } finally {
        detailsLoading.value = false
    }
}

const openAddModal = () => {
  form.value = { ...defaultForm, images: [] }
  somAmount.value = toSOM(form.value.initial_amount)
  participantSearchQuery.value = ''
  participantResults.value = []
  showModal.value = true
}


const closeModal = () => {
  showModal.value = false
  form.value = { ...defaultForm }
}

const saveContract = async () => {
  saving.value = true
  try {
    await binar_api.post('/contracts/', form.value)
    await fetchContracts()
    closeModal()
  } catch (error) {
    console.error('Error creating contract:', error)
    alert('Ошибка при создании контракта')
  } finally {
    saving.value = false
  }
}

// Image handling
const openImageUpload = () => {
  imageModalOpen.value = true
}

const handleImageUploaded = (data) => {
  form.value.images.push({
    url: data.url,
    alt: data.filename || 'Contract document',
    order: form.value.images.length
  })
}

const removeImage = (index) => {
  form.value.images.splice(index, 1)
}

const openImagePreview = (url) => {
  previewImage.value = url
}

// Pagination
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchContracts()
  }
}

const nextPage = () => {
  currentPage.value++
  fetchContracts()
}

// Debounced search
let debounceTimeout
const debouncedSearch = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchContracts()
  }, 500)
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    showParticipantDropdown.value = false
  }
}

onMounted(() => {
  fetchContracts()
  fetchPaymentMethods()
  document.addEventListener('click', handleClickOutside)
})
</script>
