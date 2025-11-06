<template>
  <div>
    <div>
      <div>
        <div class="flex items-center justify-between mb-3">
          <h1 class="dark:text-white">Товары</h1>
          <button @click="openAddProductModal" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Добавить товар</button>
        </div>
        
        <!-- Переключатель вида -->
        <div class="mb-3">
          <div class="flex items-center space-x-2">
            <button @click="setView('variants')" type="button" 
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                currentView === 'variants' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'
              ]">
              С вариантами
            </button>
            <button @click="setView('products')" type="button" 
              :class="[
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                currentView === 'products' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'
              ]">
              Без вариантов
            </button>
          </div>
        </div>
        
        <!-- Загрузка -->
        <div v-if="loading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        
        <!-- Таблица товаров/вариантов (Tailwind) -->
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <!-- Заголовки для товаров с вариантами -->
                    <template v-if="currentView === 'variants'">
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Изображение</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Полное название</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Товар</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Атрибуты</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цена</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Остаток</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">SKU</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                    </template>
                    <!-- Заголовки для товаров без вариантов -->
                    <template v-else>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Описание</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Slug</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Теги</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
                    </template>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <!-- Строки для товаров с вариантами -->
                  <template v-if="currentView === 'variants'">
                    <tr v-for="variant in variants" :key="variant.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                      <td class="px-4 py-2 whitespace-nowrap">
                        <img v-if="variant.images && variant.images.length > 0" 
                             :src="getImageUrl(variant.images[0].src)" 
                             :alt="variant.images[0].alt"
                             class="h-12 w-12 rounded object-cover" />
                        <div v-else class="h-12 w-12 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span class="text-gray-400 dark:text-gray-500 text-xs">No img</span>
                        </div>
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <button @click="openProductModal(variant.product_id, variant.id)" 
                                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
                          {{ variant.full_name }}
                        </button>
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <button @click="openProductModal(variant.product_id)" 
                                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
                          {{ variant.product_name }}
                        </button>
                      </td>
                      <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        <div class="flex flex-wrap gap-1">
                          <span v-for="attr in variant.variant_attributes" :key="`${attr.attribute}-${attr.value}`" 
                                class="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-600 px-2 py-1 text-xs text-blue-800 dark:text-blue-200">
                            {{ attr.attribute }}: {{ attr.value }}
                          </span>
                        </div>
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ variant.price }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ variant.stock }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ variant.sku }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <button @click="openVariantEditModal(variant.id)" class="inline-flex items-center rounded-md bg-gray-800 dark:bg-gray-600 px-3 py-2 text-white text-xs mr-2 hover:bg-gray-700 dark:hover:bg-gray-500">Редактировать</button>
                        <button @click="openConfirm(variant.id)" class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-white text-xs hover:bg-red-700">Удалить</button>
                      </td>
                    </tr>
                  </template>
                  <!-- Строки для товаров без вариантов -->
                  <template v-else>
                    <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <button @click="openProductModal(product.id)" 
                                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
                          {{ product.name }}
                        </button>
                      </td>
                      <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ product.description }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ product.slug }}</td>
                      <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        <div class="flex flex-wrap gap-1">
                          <span v-for="tag in product.tag_names" :key="tag" 
                                class="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-600 px-2 py-1 text-xs text-gray-800 dark:text-gray-200">
                            {{ tag }}
                          </span>
                          <span v-if="!product.tag_names || product.tag_names.length === 0" 
                                class="text-xs text-gray-500 dark:text-gray-400 italic">Нет тегов</span>
                        </div>
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <button @click="openEditProductModal(product)" class="inline-flex items-center rounded-md bg-gray-800 dark:bg-gray-600 px-3 py-2 text-white text-xs mr-2 hover:bg-gray-700 dark:hover:bg-gray-500">Редактировать</button>
                        <button @click="openConfirm(product.id)" class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-white text-xs hover:bg-red-700">Удалить</button>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div v-if="(currentView === 'variants' && variants.length === 0) || (currentView === 'products' && products.length === 0)" class="text-center py-8 text-gray-500 dark:text-gray-400">
          {{ currentView === 'variants' ? 'Варианты товаров не найдены' : 'Товары не найдены' }}
        </div>
      </div>
    </div>
    
    <!-- Confirm Delete Modal -->
    <div v-if="confirm.visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeConfirm"></div>
      <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="px-4 py-3 border-b dark:border-gray-700">
          <h5 class="m-0 dark:text-white">Подтверждение</h5>
        </div>
        <div class="p-4 text-sm text-gray-700 dark:text-white">
          <p class="mb-2">{{ currentView === 'variants' ? 'Удалить вариант товара? Это действие необратимо.' : 'Удалить товар? Это действие необратимо.' }}</p>
          <p>Подтвердите действие.</p>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <button @click="closeConfirm" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Отмена</button>
          <button @click="confirmDelete" :disabled="deleting"
            class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-40">
            <span v-if="deleting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
            Удалить
          </button>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно добавления товара -->
    <div v-if="addProductModal.visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeAddProductModal"></div>
      <div class="relative z-10 w-full max-w-2xl mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="px-4 py-3 border-b dark:border-gray-700">
          <h5 class="m-0 dark:text-white">Добавить товар</h5>
        </div>
        <div class="p-4 max-h-96 overflow-y-auto">
          <form @submit.prevent="submitProduct" class="space-y-4">
            <!-- Основные поля -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Название *</label>
                <input v-model="addProductModal.form.name" type="text" required
                       class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                       placeholder="Название товара">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Slug *</label>
                <input v-model="addProductModal.form.slug" type="text" required
                       class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                       placeholder="slug-tovara">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Описание</label>
              <textarea v-model="addProductModal.form.description" 
                        class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                        rows="3"
                        placeholder="Описание товара"></textarea>
            </div>
            
            <!-- Выбор атрибутов -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Атрибуты</label>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="attribute in availableAttributes" :key="attribute.id" 
                     class="flex items-center">
                  <input :id="`attr-${attribute.id}`" v-model="addProductModal.form.selectedAttrs" 
                         :value="attribute.id" type="checkbox"
                         class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500">
                  <label :for="`attr-${attribute.id}`" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {{ attribute.name }}
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Матрица вариаций -->
            <div v-if="addProductModal.form.selectedAttrs.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Вариации</label>
              <VariantMatrix 
                :attributes="selectedAttributes"
                :productName="addProductModal.form.name"
                @update:variants="updateVariants"
              />
            </div>
            
            <div v-if="addProductModal.errorMessage" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-[#3f3f47] dark:border-gray-700 dark:text-white">
              {{ addProductModal.errorMessage }}
            </div>
          </form>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <button @click="closeAddProductModal" 
                  class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">
            Отмена
          </button>
          <button @click="submitProduct" :disabled="submitting"
                  class="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
            <span v-if="submitting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
            Создать товар
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно просмотра товара -->
    <ProductModal 
      :is-open="isProductModalOpen"
      :product-id="selectedProductId"
      :variant-id="selectedVariantId"
      @close="closeProductModal"
      @edit-variant="handleEditVariant"
      @product-updated="handleProductUpdated"
    />

    <!-- Модальное окно редактирования варианта -->
    <VariantEditModal 
      :is-open="isVariantEditModalOpen"
      :variant-id="selectedVariantEditId"
      @close="closeVariantEditModal"
      @variant-updated="handleVariantUpdated"
    />

    <!-- Модальное окно редактирования товара -->
    <div v-if="editProductModal.visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeEditProductModal"></div>
      <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="px-4 py-3 border-b dark:border-gray-700">
          <h5 class="m-0 dark:text-white">Редактирование товара</h5>
        </div>
        <div class="p-4">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Название *</label>
              <input v-model="editProductModal.form.name" type="text" required
                     class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                     placeholder="Название товара">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Slug *</label>
              <input v-model="editProductModal.form.slug" type="text" required
                     class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                     placeholder="slug-tovara">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Описание</label>
              <textarea v-model="editProductModal.form.description" 
                        class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                        rows="3"
                        placeholder="Описание товара"></textarea>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
          <button @click="closeEditProductModal" 
                  class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">
            Отмена
          </button>
          <button @click="saveProduct" :disabled="!editProductModal.form.name?.trim() || !editProductModal.form.slug?.trim() || savingProduct"
                  class="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
            <span v-if="savingProduct" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store_api } from '@/api'
import VariantMatrix from '@/components/VariantMatrix.vue'
import ProductModal from '@/components/ProductModal.vue'
import VariantEditModal from '@/components/VariantEditModal.vue'

// Router setup
const route = useRoute()
const router = useRouter()

// Реактивные данные
const variants = ref([])
const products = ref([])
const loading = ref(false)
const submitting = ref(false)

// Текущий вид (товары с вариантами или без) - инициализируем из URL
const currentView = ref(route.query.view || 'variants')

// Подтверждение удаления
const confirm = ref({ visible: false, id: null })
const deleting = ref(false)

// Модальное окно просмотра товара
const isProductModalOpen = ref(false)
const selectedProductId = ref(null)
const selectedVariantId = ref(null)

// Модальное окно редактирования варианта
const isVariantEditModalOpen = ref(false)
const selectedVariantEditId = ref(null)

// Модальное окно редактирования товара
const editProductModal = ref({
  visible: false,
  productId: null,
  form: {
    name: '',
    slug: '',
    description: ''
  }
})
const savingProduct = ref(false)

// Модальное окно добавления товара
const addProductModal = ref({
  visible: false,
  form: {
    name: '',
    slug: '',
    description: '',
    tag_names: [],
    selectedAttrs: []
  },
  errorMessage: ''
})

// Доступные атрибуты
const availableAttributes = ref([])

// Варианты товара
const productVariants = ref([])

// Выбранные атрибуты с их значениями
const selectedAttributes = computed(() => {
  return availableAttributes.value.filter(attr => 
    addProductModal.value.form.selectedAttrs.includes(attr.id)
  )
})

// Установка вида с сохранением в URL
const setView = (view) => {
  currentView.value = view
  // Обновляем URL без перезагрузки страницы
  router.push({ 
    path: route.path, 
    query: { ...route.query, view: view } 
  })
  loadData()
}

// Загрузка данных в зависимости от текущего вида
const loadData = async () => {
  if (currentView.value === 'variants') {
    await loadVariants()
  } else {
    await loadProducts()
  }
}

// Загрузка товаров без вариантов
const loadProducts = async () => {
  loading.value = true
  try {
    const response = await store_api.get(`products/?skip=0&limit=100`)
    products.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
  } finally {
    loading.value = false
  }
}

// Загрузка вариантов товаров
const loadVariants = async () => {
  loading.value = true
  try {
    const response = await store_api.get(`products/variants?skip=0&limit=100`)
    variants.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки вариантов:', error)
  } finally {
    loading.value = false
  }
}

// Загрузка атрибутов
const loadAttributes = async () => {
  try {
    const response = await store_api.get('attributes/?skip=0&limit=100')
    availableAttributes.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки атрибутов:', error)
  }
}

// Модальное окно добавления товара
const openAddProductModal = () => {
  addProductModal.value = {
    visible: true,
    form: {
      name: '',
      slug: '',
      description: '',
      selectedAttrs: []
    },
    errorMessage: ''
  }
}

const closeAddProductModal = () => {
  addProductModal.value = {
    visible: false,
    form: {
      name: '',
      slug: '',
      description: '',
      selectedAttrs: []
    },
    errorMessage: ''
  }
}

// Обновление вариантов из VariantMatrix
const updateVariants = (variants) => {
  productVariants.value = variants
}

// Создание товара
const submitProduct = async () => {
  if (!addProductModal.value.form.name.trim() || !addProductModal.value.form.slug.trim()) {
    addProductModal.value.errorMessage = 'Название и slug обязательны'
    return
  }
  
  submitting.value = true
  addProductModal.value.errorMessage = ''
  
  try {
    const productData = {
      name: addProductModal.value.form.name.trim(),
      slug: addProductModal.value.form.slug.trim(),
      description: addProductModal.value.form.description.trim(),
      variants: productVariants.value.length > 0 ? productVariants.value : undefined
    }
    
    await store_api.post('products/', productData)
    await loadData() // Перезагружаем данные
    closeAddProductModal()
  } catch (error) {
    console.error('Ошибка создания товара:', error)
    if (error.response?.data?.detail) {
      addProductModal.value.errorMessage = error.response.data.detail
    } else {
      addProductModal.value.errorMessage = 'Ошибка при создании товара'
    }
  } finally {
    submitting.value = false
  }
}

// Подтверждение удаления
const openConfirm = (id) => { confirm.value = { visible: true, id } }
const closeConfirm = () => { confirm.value = { visible: false, id: null } }
const confirmDelete = async () => {
  if (!confirm.value.id) return
  deleting.value = true
  try {
    if (currentView.value === 'variants') {
      await store_api.delete(`variants/${confirm.value.id}/`)
    } else {
      await store_api.delete(`products/${confirm.value.id}`)
    }
    await loadData() // Перезагружаем данные после удаления
  } catch (e) {
    console.error('Ошибка удаления:', e)
  } finally {
    deleting.value = false
    closeConfirm()
  }
}

// Функции для работы с модальным окном просмотра товара
const openProductModal = (productId, variantId = null) => {
  selectedProductId.value = productId
  selectedVariantId.value = variantId
  isProductModalOpen.value = true
}

const closeProductModal = () => {
  isProductModalOpen.value = false
  selectedProductId.value = null
  selectedVariantId.value = null
}

const handleEditVariant = (variantId) => {
  // Открываем модальное окно редактирования варианта
  selectedVariantEditId.value = variantId
  isVariantEditModalOpen.value = true
}

const handleProductUpdated = () => {
  // Обновляем данные после редактирования товара
  loadData()
}

const handleVariantUpdated = () => {
  // Обновляем данные после редактирования варианта
  loadData()
}

// Функции для работы с модальным окном редактирования варианта
const openVariantEditModal = (variantId) => {
  selectedVariantEditId.value = variantId
  isVariantEditModalOpen.value = true
}

const closeVariantEditModal = () => {
  isVariantEditModalOpen.value = false
  selectedVariantEditId.value = null
}

// Функции для работы с модальным окном редактирования товара
const openEditProductModal = (product) => {
  editProductModal.value = {
    visible: true,
    productId: product.id,
    form: {
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || ''
    }
  }
}

const closeEditProductModal = () => {
  editProductModal.value = {
    visible: false,
    productId: null,
    form: {
      name: '',
      slug: '',
      description: ''
    }
  }
}

const saveProduct = async () => {
  if (!editProductModal.value.productId || !editProductModal.value.form.name?.trim() || !editProductModal.value.form.slug?.trim()) return
  
  savingProduct.value = true
  try {
    await store_api.patch(`products/${editProductModal.value.productId}`, {
      name: editProductModal.value.form.name.trim(),
      slug: editProductModal.value.form.slug.trim(),
      description: editProductModal.value.form.description?.trim() || null
    })
    
    // Обновляем данные
    await loadData()
    
    // Закрываем модальное окно
    closeEditProductModal()
    
    alert('Товар успешно обновлен!')
  } catch (error) {
    console.error('Ошибка сохранения товара:', error)
    alert('Ошибка при сохранении товара')
  } finally {
    savingProduct.value = false
  }
}

// Функция для формирования URL изображения
const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  // Если путь уже содержит полный URL, возвращаем как есть
  if (imagePath.startsWith('http')) return imagePath
  // Добавляем базовый URL API
  const baseUrl = import.meta.env.VITE_STORE_API_URL || 'http://127.0.0.1:8000'
  return `${baseUrl}${imagePath}`
}

// Загрузка при монтировании компонента
onMounted(() => {
  loadData()
  loadAttributes()
})

// Отслеживание изменений в URL для синхронизации с состоянием
watch(() => route.query.view, (newView) => {
  if (newView && newView !== currentView.value) {
    currentView.value = newView
    loadData()
  }
})
</script>
