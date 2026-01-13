<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="dark:text-white text-2xl font-bold">Списания (Бесплатно)</h1>
      <button 
        @click="showAddModal = true"
        class="px-4 py-2 bg-black text-white rounded-xl text-sm hover:bg-gray-900 transition-colors flex items-center gap-2"
      >
        <span>+ Добавить списание</span>
      </button>
    </div>

    <!-- EK Table -->
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#3f3f47]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Товары</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Общая сумма</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Комментарий</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Действия</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
              <tr v-if="loading">
                <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Загрузка...</td>
              </tr>
              <tr v-else-if="expenses.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">Нет данных</td>
              </tr>
              <tr v-for="exp in expenses" :key="exp._id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                <td class="px-4 py-3 whitespace-nowrap text-xs dark:text-gray-300">
                  {{ formatDate(exp.created_at) }}
                </td>
                <td class="px-4 py-3 text-xs dark:text-white">
                  <div v-for="item in exp.items" :key="item.variant_id" class="mb-1">
                    {{ item.name }} x{{ item.quantity }}
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-right font-bold text-blue-600 dark:text-blue-400">
                  ${{ exp.total_amount.toFixed(2) }}
                  <div class="text-[10px] text-emerald-600 font-medium">{{ (exp.total_amount * 88).toLocaleString() }} сом</div>
                </td>
                <td class="px-4 py-3 text-xs dark:text-gray-300 max-w-xs truncate">
                  {{ exp.comment || '-' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right text-sm">
                  <button @click="viewDetails(exp)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400">Детали</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/40 transition-opacity" @click="showAddModal = false"></div>
        
        <div class="relative bg-white dark:bg-[#3f3f47] rounded-[24px] shadow-xl max-w-4xl w-full p-6 animate-in fade-in zoom-in duration-200" @click.stop>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Новое списание (EK)</h3>
            <button @click="showAddModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left: Product Selection -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Выберите товары</label>
                <div class="relative">
                  <input 
                    v-model="search" 
                    type="text" 
                    placeholder="Поиск товара..." 
                    class="w-full rounded-xl border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                </div>
                
                <div class="mt-4 max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  <div v-if="loadingVariants" class="text-center py-4 text-gray-500">Загрузка товаров...</div>
                  <div 
                    v-for="variant in filteredProducts" 
                    :key="variant.id"
                    class="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div class="flex-1">
                      <div class="text-sm font-semibold dark:text-white">{{ variant.full_name }}</div>
                      <div class="flex items-center gap-4 mt-1">
                        <div class="flex gap-2 text-sm font-bold">
                          <span class="text-blue-600 dark:text-blue-400">${{ variant.price }}</span>
                          <span class="text-emerald-600 dark:text-emerald-400">{{ (variant.price * 88).toLocaleString() }} сом</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      @click="addToCart(variant)"
                      class="ml-4 p-2 rounded-lg bg-gray-900 text-white hover:bg-black dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Cart and Info -->
            <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-800/50 rounded-[24px] p-6 border border-gray-100 dark:border-gray-700">
              <h4 class="text-lg font-bold mb-4 dark:text-white">Корзина списания</h4>
              
              <div class="flex-1 space-y-4 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                <div v-if="cart.length === 0" class="text-center py-8 text-gray-500 italic">Списание пусто</div>
                <div 
                  v-for="item in cart" 
                  :key="item.variant_id"
                  class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm"
                >
                  <div class="flex-1 min-w-0 mr-3">
                    <div class="text-xs font-bold truncate dark:text-white">{{ item.name }}</div>
                    <div class="flex gap-2 text-xs font-bold mt-1">
                      <span class="text-blue-600 dark:text-blue-400">${{ item.price }}</span>
                      <span class="text-emerald-600 dark:text-emerald-400">{{ (item.price * 88).toLocaleString() }} сом</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <button @click="updateQty(item, -1)" class="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">-</button>
                    <span class="text-sm font-bold w-6 text-center dark:text-white">{{ item.quantity }}</span>
                    <button @click="updateQty(item, 1)" class="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">+</button>
                    <button @click="removeItem(item)" class="ml-2 text-red-500 hover:text-red-700">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Comment and Summary -->
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Комментарий / Причина</label>
                  <textarea 
                    v-model="comment" 
                    rows="2" 
                    class="w-full p-3 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Укажите причину списания..."
                  ></textarea>
                </div>

                <div class="space-y-1">
                  <div class="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
                    <span>Итоговая оценка:</span>
                    <div class="flex flex-col items-end">
                      <span class="text-blue-600 dark:text-blue-400">${{ total.toFixed(2) }}</span>
                      <span class="text-sm text-emerald-600 dark:text-emerald-500">{{ (total * 88).toLocaleString() }} сом</span>
                    </div>
                  </div>
                </div>

                <button 
                  @click="submitEK"
                  :disabled="cart.length === 0 || submitting"
                  class="w-full py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-all transform active:scale-95"
                >
                  {{ submitting ? 'Оформление...' : 'Создать списание' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Issue Items Modal -->
    <IssueItemsModal
      v-if="createdEkOrder"
      :visible="showIssueModal"
      :items="itemsToIssue"
      :order-id="createdEkOrder._id"
      :order-number="createdEkOrder._id"
      source-type="ek"
      :total-price="0"
      @close="handleIssueError" 
      @success="handleIssueSuccess"
      @error="handleIssueError"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { health_store, store_api } from '@/api'
import IssueItemsModal from '@/components/IssueItemsModal.vue'

const loading = ref(false)
const expenses = ref([])
const showAddModal = ref(false)
const variants = ref([])
const loadingVariants = ref(false)
const search = ref('')
const cart = ref([])
const comment = ref('')
const submitting = ref(false)

// Issuance State
const showIssueModal = ref(false)
const createdEkOrder = ref(null)
const itemsToIssue = ref([])

const filteredProducts = computed(() => {
  if (!search.value) return variants.value
  const q = search.value.toLowerCase()
  return variants.value.filter(v => v.full_name.toLowerCase().includes(q))
})

const total = computed(() => cart.value.reduce((s, i) => s + (i.price * i.quantity), 0))

const fetchExpenses = async () => {
  loading.value = true
  try {
    const res = await health_store.get('/ek/')
    expenses.value = res.data
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const fetchVariants = async () => {
  loadingVariants.value = true
  try {
    const res = await store_api.get('/products/variants', { 
      params: { skip: 0, limit: 100, sort_order: 'asc' } 
    })
    variants.value = res.data
  } catch (e) { console.error(e) }
  finally { loadingVariants.value = false }
}

const addToCart = (p) => {
  const existing = cart.value.find(c => c.variant_id === p.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({
      variant_id: p.id,
      name: p.full_name,
      quantity: 1,
      price: p.price
    })
  }
}

const updateQty = (item, delta) => {
  item.quantity = Math.max(1, item.quantity + delta)
}

const removeItem = (item) => {
  cart.value = cart.value.filter(c => c.variant_id !== item.variant_id)
}

const submitEK = async () => {
  submitting.value = true
  try {
    const res = await health_store.post('/ek/', {
      items: cart.value,
      total_amount: total.value,
      comment: comment.value
    })
    
    // Success - Prepare for issuance
    createdEkOrder.value = res.data
    itemsToIssue.value = cart.value.map(item => ({
      variant_id: item.variant_id,
      quantity: item.quantity,
      maxQuantity: item.quantity
    }))
    
    // Close Add Modal and Open Issue Modal
    showAddModal.value = false
    showIssueModal.value = true
    
    // Clear form
    // cart.value = [] // Keep cart for reference if needed, or clear. Clearing is safer.
    cart.value = []
    comment.value = ''
    
    fetchExpenses()
  } catch (e) {
    alert('Ошибка при создании')
    console.error(e)
  } finally {
    submitting.value = false
  }
}

const handleIssueSuccess = async (response) => {
  const issuedItems = response.issued_items || []
  const issuedQuantities = {} 
  issuedItems.forEach(item => issuedQuantities[item.variant_id] = item.quantity)
  
  // Update issued_quantity in EK API
  // Note: EK API doesn't have partial update for nested array easily exposed OR we might have added it?
  // We added PATCH /{ek_id}/issue which updates ONE item at a time.
  // We need to iterate.
  
  if (createdEkOrder.value) {
     for (const item of itemsToIssue.value) {
        const qty = issuedQuantities[item.variant_id]
        if (qty) {
           try {
              await health_store.patch(`/ek/${createdEkOrder.value._id}/issue`, {
                 variant_id: item.variant_id,
                 quantity: qty
              })
           } catch(e) {
              console.error('Failed to update EK issuance status', e)
           }
        }
     }
  }
  
  showIssueModal.value = false
  createdEkOrder.value = null
  fetchExpenses() // Refresh list to show potential status updates if any
}

const handleIssueError = () => {
  // Even if issuance fails, the order was created.
  showIssueModal.value = false
  createdEkOrder.value = null
  fetchExpenses()
}


const formatDate = (d) => new Date(d).toLocaleString('ru-RU')

watch(() => showAddModal.value, (newVal) => {
  if (newVal && variants.value.length === 0) fetchVariants()
})

onMounted(() => {
  fetchExpenses()
  if (showAddModal.value) fetchVariants()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
