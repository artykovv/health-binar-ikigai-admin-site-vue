<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white text-2xl font-bold">Настройки Health Store</h1>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex gap-2">
      <button
        @click="activeTab = 'employees'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          activeTab === 'employees'
            ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-gray-300 dark:hover:bg-[#4a4a52]'
        ]"
      >
        Сотрудники
      </button>
      <button
        @click="activeTab = 'sales'"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          activeTab === 'sales'
            ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-gray-300 dark:hover:bg-[#4a4a52]'
        ]"
      >
        Акции
      </button>
    </div>

    <!-- Employees Tab -->
    <div v-if="activeTab === 'employees'" class="space-y-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold dark:text-white">Сотрудники</h2>
        <button 
          @click="openAddEmployeeModal" 
          class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
        >
          Добавить сотрудника
        </button>
      </div>

      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ФИО</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Скидка (%)</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                <tr v-if="loading" class="animate-pulse">
                  <td colspan="3" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка...</td>
                </tr>
                <tr v-else-if="employees.length === 0">
                  <td colspan="3" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет сотрудников</td>
                </tr>
                <tr v-for="emp in employees" :key="emp.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                    {{ emp.lastname }} {{ emp.name }} {{ emp.patronymic }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ emp.sale }}%
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm">
                    <button @click="editEmployee(emp)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 mr-3">Изменить</button>
                    <button @click="deleteEmployee(emp.id)" class="text-red-600 hover:text-red-800 dark:text-red-400">Удалить</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Sales Tab -->
    <div v-if="activeTab === 'sales'" class="space-y-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold dark:text-white">Акции</h2>
        <button 
          @click="openAddSaleModal" 
          class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
        >
          Добавить акцию
        </button>
      </div>

      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Скидка (%)</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                <tr v-if="loading" class="animate-pulse">
                  <td colspan="4" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка...</td>
                </tr>
                <tr v-else-if="sales.length === 0">
                  <td colspan="4" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет акций</td>
                </tr>
                <tr v-for="sale in sales" :key="sale.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{{ sale.name }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ sale.sale }}%</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm">
                    <span 
                      class="px-2 py-1 rounded-full text-[10px] font-bold uppercase"
                      :class="sale.active ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'"
                    >
                      {{ sale.active ? 'Активна' : 'Неактивна' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm">
                    <button @click="editSale(sale)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 mr-3">Изменить</button>
                    <button @click="deleteSale(sale.id)" class="text-red-600 hover:text-red-800 dark:text-red-400">Удалить</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Employee Modal -->
    <div v-if="showEmployeeModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="showEmployeeModal = false"></div>
        <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ isEditing ? 'Изменить сотрудника' : 'Добавить сотрудника' }}
          </h3>
          <form @submit.prevent="saveEmployee" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Фамилия *</label>
              <input v-model="employeeForm.lastname" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Имя *</label>
              <input v-model="employeeForm.name" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Отчество</label>
              <input v-model="employeeForm.patronymic" type="text" class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Скидка (%)</label>
              <input v-model="employeeForm.sale" type="number" step="0.1" class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
            </div>
            <div class="mt-6 flex justify-end gap-2">
              <button type="button" @click="showEmployeeModal = false" class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-white">Отмена</button>
              <button type="submit" class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Sale Modal -->
    <div v-if="showSaleModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="showSaleModal = false"></div>
        <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ isEditing ? 'Изменить акцию' : 'Добавить акцию' }}
          </h3>
          <form @submit.prevent="saveSale" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Название *</label>
              <input v-model="saleForm.name" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Скидка (%)</label>
              <input v-model="saleForm.sale" type="number" step="0.1" required class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
            </div>
            <div class="flex items-center gap-2">
              <input v-model="saleForm.active" type="checkbox" id="sale_active" class="rounded border-gray-300 text-blue-600">
              <label for="sale_active" class="text-sm text-gray-700 dark:text-gray-300">Активна</label>
            </div>
            <div class="mt-6 flex justify-end gap-2">
              <button type="button" @click="showSaleModal = false" class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-white">Отмена</button>
              <button type="submit" class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { health_store } from '@/api'

const activeTab = ref('employees')
const loading = ref(false)
const employees = ref([])
const sales = ref([])

const showEmployeeModal = ref(false)
const showSaleModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const employeeForm = ref({ name: '', lastname: '', patronymic: '', sale: 0 })
const saleForm = ref({ name: '', sale: 0, active: true })

const fetchEmployees = async () => {
  loading.value = true
  try {
    const res = await health_store.get('/employees/')
    employees.value = res.data
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const fetchSales = async () => {
  loading.value = true
  try {
    const res = await health_store.get('/sales/')
    sales.value = res.data
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

watch(activeTab, (tab) => {
  if (tab === 'employees') fetchEmployees()
  else fetchSales()
}, { immediate: true })

const openAddEmployeeModal = () => {
  isEditing.value = false
  employeeForm.value = { name: '', lastname: '', patronymic: '', sale: 0 }
  showEmployeeModal.value = true
}

const editEmployee = (emp) => {
  isEditing.value = true
  editingId.value = emp.id
  employeeForm.value = { ...emp }
  showEmployeeModal.value = true
}

const saveEmployee = async () => {
  try {
    if (isEditing.value) await health_store.patch(`/employees/${editingId.value}`, employeeForm.value)
    else await health_store.post('/employees/', employeeForm.value)
    showEmployeeModal.value = false
    fetchEmployees()
  } catch (e) { console.error(e) }
}

const deleteEmployee = async (id) => {
  if (!confirm('Удалить сотрудника?')) return
  try {
    await health_store.delete(`/employees/${id}`)
    fetchEmployees()
  } catch (e) { console.error(e) }
}

const openAddSaleModal = () => {
  isEditing.value = false
  saleForm.value = { name: '', sale: 0, active: true }
  showSaleModal.value = true
}

const editSale = (s) => {
  isEditing.value = true
  editingId.value = s.id
  saleForm.value = { ...s }
  showSaleModal.value = true
}

const saveSale = async () => {
  try {
    if (isEditing.value) await health_store.patch(`/sales/${editingId.value}`, saleForm.value)
    else await health_store.post('/sales/', saleForm.value)
    showSaleModal.value = false
    fetchSales()
  } catch (e) { console.error(e) }
}

const deleteSale = async (id) => {
  if (!confirm('Удалить акцию?')) return
  try {
    await health_store.delete(`/sales/${id}`)
    fetchSales()
  } catch (e) { console.error(e) }
}
</script>
