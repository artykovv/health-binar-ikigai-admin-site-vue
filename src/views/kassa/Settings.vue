<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white text-2xl font-bold">Настройки</h1>
    </div>

    <!-- Tabs (Styles from Orders.vue) -->
    <div class="mb-6 flex gap-2">
      <button
        @click="setTab('categories')"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          activeTab === 'categories'
            ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-gray-300 dark:hover:bg-[#4a4a52]'
        ]"
      >
        Категории
      </button>
      <button
        @click="setTab('tags')"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          activeTab === 'tags'
            ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-gray-300 dark:hover:bg-[#4a4a52]'
        ]"
      >
        Теги
      </button>
      <button
        @click="setTab('payment-methods')"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          activeTab === 'payment-methods'
            ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-gray-300 dark:hover:bg-[#4a4a52]'
        ]"
      >
        Методы оплаты
      </button>
    </div>

    <!-- Categories Tab -->
    <div v-if="activeTab === 'categories'" class="space-y-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold dark:text-white">Категории операций</h2>
        <button 
          @click="openAddCategoryModal" 
          class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
        >
          Добавить категорию
        </button>
      </div>

      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Тип</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                <tr v-if="loading" class="animate-pulse">
                  <td colspan="3" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка...</td>
                </tr>
                <tr v-else-if="categories.length === 0">
                  <td colspan="3" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет категорий</td>
                </tr>
                <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{{ cat.name }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm">
                    <span 
                      class="px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-colors"
                      :class="{
                        'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400': cat.transaction_type === 'income',
                        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400': cat.transaction_type === 'expense',
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400': cat.transaction_type === 'any' || !cat.transaction_type
                      }"
                    >
                      {{ formatType(cat.transaction_type) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm">
                    <button @click="editCategory(cat)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 mr-3">Изменить</button>
                    <button @click="deleteCategory(cat.id)" class="text-red-600 hover:text-red-800 dark:text-red-400">Удалить</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Tags Tab -->
    <div v-if="activeTab === 'tags'" class="space-y-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold dark:text-white">Теги</h2>
        <button 
          @click="openAddTagModal" 
          class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
        >
          Добавить тег
        </button>
      </div>

      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                <tr v-if="loading" class="animate-pulse">
                  <td colspan="2" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка...</td>
                </tr>
                <tr v-else-if="tags.length === 0">
                  <td colspan="2" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет тегов</td>
                </tr>
                <tr v-for="tag in tags" :key="tag.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ tag.name }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm">
                    <button @click="editTag(tag)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 mr-3">Изменить</button>
                    <button @click="deleteTag(tag.id)" class="text-red-600 hover:text-red-800 dark:text-red-400">Удалить</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Methods Tab -->
    <div v-if="activeTab === 'payment-methods'" class="space-y-4">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-semibold dark:text-white">Методы оплаты</h2>
        <button 
          @click="openAddPaymentMethodModal" 
          class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
        >
          Добавить метод
        </button>
      </div>

      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                <tr v-if="loading" class="animate-pulse">
                  <td colspan="3" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка...</td>
                </tr>
                <tr v-else-if="paymentMethods.length === 0">
                  <td colspan="3" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет методов оплаты</td>
                </tr>
                <tr v-for="pm in paymentMethods" :key="pm.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                    {{ pm.name }}
                    <p v-if="pm.description" class="text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">{{ pm.description }}</p>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm">
                    <span 
                      class="px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-colors"
                      :class="pm.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'"
                    >
                      {{ pm.is_active ? 'Активен' : 'Неактивен' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm">
                    <button @click="editPaymentMethod(pm)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 mr-3">Изменить</button>
                    <button @click="deletePaymentMethod(pm.id)" class="text-red-600 hover:text-red-800 dark:text-red-400">Удалить</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="showCategoryModal = false"></div>
        <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200" @click.stop>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ isEditing ? 'Изменить категорию' : 'Добавить категорию' }}
          </h3>
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Название *</label>
              <input v-model="categoryForm.name" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Описание</label>
              <textarea v-model="categoryForm.description" rows="2" class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Тип транзакции</label>
              <select v-model="categoryForm.transaction_type" class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
                <option value="any">Любой</option>
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="categoryForm.is_automated" type="checkbox" id="is_automated" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <label for="is_automated" class="text-sm text-gray-700 dark:text-gray-300">Автоматическая</label>
            </div>
            <div class="mt-6 flex justify-end gap-2">
              <button type="button" @click="showCategoryModal = false" class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-white">Отмена</button>
              <button type="submit" class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Tag Modal -->
    <div v-if="showTagModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="showTagModal = false"></div>
        <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200" @click.stop>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ isEditing ? 'Изменить тег' : 'Добавить тег' }}
          </h3>
          <form @submit.prevent="saveTag" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Название *</label>
              <input v-model="tagForm.name" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
            </div>
            <div class="mt-6 flex justify-end gap-2">
              <button type="button" @click="showTagModal = false" class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-white">Отмена</button>
              <button type="submit" class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Payment Method Modal -->
    <div v-if="showPaymentMethodModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="showPaymentMethodModal = false"></div>
        <div class="relative bg-white dark:bg-[#3f3f47] rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200" @click.stop>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ isEditing ? 'Изменить метод оплаты' : 'Добавить метод оплаты' }}
          </h3>
          <form @submit.prevent="savePaymentMethod" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Название *</label>
              <input v-model="paymentMethodForm.name" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Описание</label>
              <textarea v-model="paymentMethodForm.description" rows="2" class="mt-1 block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"></textarea>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="paymentMethodForm.is_active" type="checkbox" id="pm_is_active" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <label for="pm_is_active" class="text-sm text-gray-700 dark:text-gray-300">Активен</label>
            </div>
            <div class="mt-6 flex justify-end gap-2">
              <button type="button" @click="showPaymentMethodModal = false" class="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-white">Отмена</button>
              <button type="submit" class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700">Сохранить</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { kassa_api } from '@/api'

// Tabs
const activeTab = ref('categories')
const setTab = (tab) => {
  activeTab.value = tab
  if (tab === 'categories') fetchCategories()
  if (tab === 'tags') fetchTags()
  if (tab === 'payment-methods') fetchPaymentMethods()
}

// State
const loading = ref(false)
const categories = ref([])
const tags = ref([])
const paymentMethods = ref([])
const showCategoryModal = ref(false)
const showTagModal = ref(false)
const showPaymentMethodModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const categoryForm = ref({ name: '', transaction_type: 'any', description: '', is_automated: false })
const tagForm = ref({ name: '' })
const paymentMethodForm = ref({ name: '', is_active: true, description: '' })

// CRUD Categories
const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await kassa_api.get('/categories/')
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loading.value = false
  }
}

const openAddCategoryModal = () => {
  isEditing.value = false
  editingId.value = null
  categoryForm.value = { name: '', transaction_type: 'any', description: '', is_automated: false }
  showCategoryModal.value = true
}

const editCategory = (cat) => {
  isEditing.value = true
  editingId.value = cat.id
  categoryForm.value = { ...cat }
  showCategoryModal.value = true
}

const saveCategory = async () => {
  try {
    if (isEditing.value) {
      await kassa_api.patch(`/categories/${editingId.value}`, categoryForm.value)
    } else {
      await kassa_api.post('/categories/', categoryForm.value)
    }
    await fetchCategories()
    showCategoryModal.value = false
  } catch (error) {
    console.error('Error saving category:', error)
  }
}

const deleteCategory = async (id) => {
  if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return
  try {
    await kassa_api.delete(`/categories/${id}`)
    await fetchCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
  }
}

// CRUD Tags
const fetchTags = async () => {
  loading.value = true
  try {
    const response = await kassa_api.get('/tags/')
    tags.value = response.data
  } catch (error) {
    console.error('Error fetching tags:', error)
  } finally {
    loading.value = false
  }
}

const openAddTagModal = () => {
  isEditing.value = false
  editingId.value = null
  tagForm.value = { name: '' }
  showTagModal.value = true
}

const editTag = (tag) => {
  isEditing.value = true
  editingId.value = tag.id
  tagForm.value = { ...tag }
  showTagModal.value = true
}

const saveTag = async () => {
  try {
    if (isEditing.value) {
      await kassa_api.patch(`/tags/${editingId.value}`, tagForm.value)
    } else {
      await kassa_api.post('/tags/', tagForm.value)
    }
    await fetchTags()
    showTagModal.value = false
  } catch (error) {
    console.error('Error saving tag:', error)
  }
}

const deleteTag = async (id) => {
  if (!confirm('Вы уверены, что хотите удалить этот тег?')) return
  try {
    await kassa_api.delete(`/tags/${id}`)
    await fetchTags()
  } catch (error) {
    console.error('Error deleting tag:', error)
  }
}

// CRUD Payment Methods
const fetchPaymentMethods = async () => {
  loading.value = true
  try {
    const response = await kassa_api.get('/payment-methods/', {
      params: { only_active: false }
    })
    paymentMethods.value = response.data
  } catch (error) {
    console.error('Error fetching payment methods:', error)
  } finally {
    loading.value = false
  }
}

const openAddPaymentMethodModal = () => {
  isEditing.value = false
  editingId.value = null
  paymentMethodForm.value = { name: '', is_active: true, description: '' }
  showPaymentMethodModal.value = true
}

const editPaymentMethod = (pm) => {
  isEditing.value = true
  editingId.value = pm.id
  paymentMethodForm.value = { ...pm }
  showPaymentMethodModal.value = true
}

const savePaymentMethod = async () => {
  try {
    if (isEditing.value) {
      await kassa_api.patch(`/payment-methods/${editingId.value}`, paymentMethodForm.value)
    } else {
      await kassa_api.post('/payment-methods/', paymentMethodForm.value)
    }
    await fetchPaymentMethods()
    showPaymentMethodModal.value = false
  } catch (error) {
    console.error('Error saving payment method:', error)
  }
}

const deletePaymentMethod = async (id) => {
  if (!confirm('Вы уверены, что хотите удалить этот метод оплаты?')) return
  try {
    await kassa_api.delete(`/payment-methods/${id}`)
    await fetchPaymentMethods()
  } catch (error) {
    console.error('Error deleting payment method:', error)
  }
}

// Helpers
const formatType = (type) => {
  const map = {
    'income': 'Доход',
    'expense': 'Расход',
    'any': 'Любой'
  }
  return map[type] || 'Любой'
}

onMounted(() => {
  fetchCategories()
})
</script>
