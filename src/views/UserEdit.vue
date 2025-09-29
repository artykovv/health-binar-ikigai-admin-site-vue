<template>
  <div>
    <div>
      <div class="flex items-center justify-between mb-3">
        <h1 class="dark:text-white">Изменение пользователя</h1>
        <button @click="$router.go(-1)" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Назад</button>
      </div>

      <div class="grid md:grid-cols-12 gap-4">
        <div class="md:col-span-8">
          <div class="bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
            <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
              <h5 class="m-0 dark:text-white">Форма изменения</h5>
            </div>
            <div class="p-4">
              <form @submit.prevent="submitEdit" class="space-y-4">
                <div class="grid md:grid-cols-12 gap-4">
                  <div class="md:col-span-6">
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Email *</label>
                    <input v-model="form.email" type="email" id="email" required
                      class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
                  </div>
                  <div class="md:col-span-6">
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Пароль (необязательно)</label>
                    <div class="relative">
                      <input v-model="form.password" :type="showPassword ? 'text' : 'password'" id="password"
                        class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
                      <button @click="togglePassword" type="button" class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600 hover:text-gray-900 dark:text-white dark:hover:text-white">👁</button>
                    </div>
                  </div>
                </div>

                <div class="grid md:grid-cols-12 gap-4">
                  <div class="md:col-span-4">
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Имя *</label>
                    <input v-model="form.name" type="text" id="name" required
                      class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
                  </div>
                  <div class="md:col-span-4">
                    <label for="lastname" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Фамилия *</label>
                    <input v-model="form.lastname" type="text" id="lastname" required
                      class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
                  </div>
                  <div class="md:col-span-4">
                    <label for="patronymic" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Отчество</label>
                    <input v-model="form.patronymic" type="text" id="patronymic"
                      class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
                  </div>
                </div>

                <div class="grid md:grid-cols-12 gap-4">
                  <div class="md:col-span-6">
                    <label for="sponsor_search" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Поиск спонсора</label>
                    <div class="flex gap-2">
                      <input v-model="sponsorSearch" type="text" id="sponsor_search"
                        placeholder="Поиск по ФИО или персональному номеру" @input="searchSponsors"
                        class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
                      <button @click="searchSponsors" type="button"
                        class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white" :disabled="searchingSponsors">
                        <span v-if="searchingSponsors" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
                        Поиск
                      </button>
                    </div>
                    <div v-if="sponsorResults.length > 0" class="mt-2 rounded-md shadow">
                      <div class="divide-y dark:divide-gray-700">
                        <button v-for="sponsor in sponsorResults" :key="sponsor.id" @click="selectSponsor(sponsor)"
                          class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#4a4a52] dark:text-white">
                          {{ sponsor.lastname }} {{ sponsor.name }} {{ sponsor.patronymic }} - {{ sponsor.personal_number }}
                        </button>
                      </div>
                    </div>
                    <div v-if="selectedSponsor" class="mt-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800 dark:bg-[#3f3f47] dark:border-gray-700 dark:text-white">
                      <div class="flex items-center justify-between">
                        <div>
                          <strong>Выбранный спонсор:</strong>
                          {{ selectedSponsor.lastname }} {{ selectedSponsor.name }} {{ selectedSponsor.patronymic }} - {{ selectedSponsor.personal_number }}
                        </div>
                        <button @click="clearSponsor" class="inline-flex items-center rounded-md border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50 dark:bg-[#3f3f47] dark:text-white dark:border-gray-700 dark:hover:bg-[#4a4a52]">Удалить</button>
                      </div>
                    </div>
                  </div>
                  <div class="md:col-span-6">
                    <label for="branch_id" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Филиал *</label>
                    <select v-model="form.branch_id" id="branch_id" required
                      class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white">
                      <option value="">Выберите филиал</option>
                      <option v-for="branch in branches" :key="branch.id" :value="branch.id">{{ branch.code }} - {{ branch.name }} - {{ branch.address }}</option>
                    </select>
                  </div>
                </div>

                <div class="grid md:grid-cols-12 gap-4">
                  <div class="md:col-span-6">
                    <label for="personal_number" class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Номер</label>
                    <input v-model="form.personal_number" type="text" id="personal_number" disabled
                      class="block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-[#3f3f47] dark:border-white dark:text-white"
                      placeholder="Персональный номер">
                  </div>
                </div>

                <div v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-[#3f3f47] dark:border-gray-700 dark:text-white">{{ errorMessage }}</div>
                <div v-if="successMessage" class="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:bg-[#3f3f47] dark:border-gray-700 dark:text-white">{{ successMessage }}</div>

                <div class="flex gap-2">
                  <button type="submit" :disabled="submitting"
                    class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
                    <span v-if="submitting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
                    {{ submitting ? 'Сохранение...' : 'Сохранить' }}
                  </button>
                  <button @click="loadParticipant" type="button"
                    class="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:bg-[#3f3f47] dark:text-white dark:border-gray-700 dark:hover:bg-[#4a4a52]">
                    Сбросить изменения
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="md:col-span-4">
          <div class="bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
            <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
              <h5 class="m-0 dark:text-white">Информация</h5>
            </div>
            <div class="p-4 text-sm text-gray-700 dark:text-white">
              <p class="text-gray-600 mb-3 dark:text-white">
                Поля Email, Имя, Фамилия и Филиал обязательны. Пароль вводите только если хотите его изменить.
              </p>
            </div>
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

const route = useRoute()
const router = useRouter()

const participantId = ref(route.params.id)

const branches = ref([])
const submitting = ref(false)
const searchingSponsors = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const sponsorSearch = ref('')
const sponsorResults = ref([])
const selectedSponsor = ref(null)

const showPassword = ref(false)

const form = ref({
  email: '',
  password: '',
  name: '',
  lastname: '',
  patronymic: '',
  sponsor_id: '',
  branch_id: '',
  personal_number: ''
})

const togglePassword = () => { showPassword.value = !showPassword.value }

const loadBranches = async () => {
  try {
    const response = await api.get(`branches/`, { params: { is_active: true } })
    branches.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки филиалов:', error)
  }
}

const loadParticipant = async () => {
  if (!participantId.value) return
  errorMessage.value = ''
  try {
    const response = await api.get(`participants/${participantId.value}`)
    const p = response.data || {}
    form.value.email = p.email || ''
    form.value.name = p.name || ''
    form.value.lastname = p.lastname || ''
    form.value.patronymic = p.patronymic || ''
    form.value.branch_id = p.branch_id || p.branch?.id || ''
    form.value.sponsor_id = p.sponsor_id || p.sponsor?.id || ''
    form.value.personal_number = p.personal_number || p.code || ''
    selectedSponsor.value = p.sponsor || null
  } catch (error) {
    console.error('Ошибка загрузки пользователя:', error)
    errorMessage.value = 'Ошибка при загрузке данных пользователя'
  }
}

const searchSponsors = async () => {
  if (!sponsorSearch.value.trim()) {
    sponsorResults.value = []
    return
  }
  searchingSponsors.value = true
  try {
    const response = await api.get(`participants/`, {
      params: { page: 1, page_size: 20, search: sponsorSearch.value }
    })
    sponsorResults.value = response.data.participants || []
  } catch (error) {
    console.error('Ошибка поиска спонсоров:', error)
    sponsorResults.value = []
  } finally {
    searchingSponsors.value = false
  }
}

const selectSponsor = (sponsor) => {
  selectedSponsor.value = sponsor
  form.value.sponsor_id = sponsor.id
  sponsorResults.value = []
  sponsorSearch.value = ''
}

const clearSponsor = () => {
  selectedSponsor.value = null
  form.value.sponsor_id = ''
}

const submitEdit = async () => {
  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const payload = {
      email: form.value.email,
      name: form.value.name,
      lastname: form.value.lastname,
      patronymic: form.value.patronymic || null,
      sponsor_id: form.value.sponsor_id || null,
      branch_id: parseInt(form.value.branch_id)
    }
    if (form.value.password && form.value.password.trim().length > 0) {
      payload.password = form.value.password
    }
    const response = await api.put(`participants/${participantId.value}`, payload)
    if (response.status === 200 || response.status === 204) {
      successMessage.value = 'Изменения сохранены'
      setTimeout(() => { router.push(`/participants/${participantId.value}`) }, 1200)
    }
  } catch (error) {
    console.error('Ошибка сохранения пользователя:', error)
    if (error.response?.data?.detail) {
      errorMessage.value = error.response.data.detail
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Ошибка при сохранении пользователя'
    }
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadBranches()
  loadParticipant()
})
</script>


