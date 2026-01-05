<template>
  <div class="h-full flex flex-col">
    <!-- POS Header -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold dark:text-white">Кассовый терминал</h1>
      <div class="flex items-center gap-4">
        <div class="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
          Смена открыта
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ currentTime }}
        </div>
      </div>
    </div>

    <!-- Main POS Interface -->
    <div class="flex-1 flex gap-6 overflow-hidden">
      <!-- Left side: Product Catalog -->
      <div class="flex-1 flex flex-col bg-white dark:bg-[#3f3f47] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Search and Filter -->
        <div class="p-4 border-b dark:border-gray-700 space-y-4">
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Поиск товара по названию или штрихкоду..." 
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all"
            >
          </div>
          
          <!-- Quick Categories -->
          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              v-for="cat in [ 'Все', 'Напитки', 'Еда', 'Лекарства', 'БАДы', 'Уход' ]" 
              :key="cat"
              @click="selectedCategory = cat"
              :class="[
                'px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                selectedCategory === cat 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              ]"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Product Grid -->
        <div class="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              @click="addToCart(product)"
              class="group relative bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-transparent hover:border-blue-500 hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer overflow-hidden shadow-sm"
            >
              <div class="aspect-square bg-white dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                <img v-if="product.image" :src="product.image" class="w-full h-full object-cover transition-transform group-hover:scale-105">
                <svg v-else class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate" :title="product.name">{{ product.name }}</h3>
              <p class="text-xs text-gray-500 mt-1">{{ product.stock }} шт. в наличии</p>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-sm font-bold text-blue-600 dark:text-blue-400">${{ product.price }}</span>
                <div class="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side: Cart & Checkout -->
      <div class="w-[400px] flex flex-col bg-white dark:bg-[#3f3f47] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Cart Header -->
        <div class="p-6 border-b dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold dark:text-white">Корзина</h2>
            <p class="text-xs text-gray-500 mt-0.5">Добавлено {{ cart.length }} позиций</p>
          </div>
          <button @click="clearCart" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-center px-6">
            <div class="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <p class="text-lg font-medium text-gray-400">Корзина пуста</p>
            <p class="text-sm text-gray-400 mt-1">Выберите товары из каталога слева</p>
          </div>

          <div 
            v-for="(item, index) in cart" 
            :key="item.id + index"
            class="group flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-blue-500 transition-all"
          >
            <div class="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
               <img v-if="item.image" :src="item.image" class="w-full h-full object-cover">
               <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
               </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ item.name }}</h4>
              <p class="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">${{ item.price }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button @click="updateQty(index, -1)" class="w-6 h-6 rounded-lg bg-white dark:bg-gray-700 border dark:border-gray-600 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              <span class="text-xs font-bold w-4 text-center dark:text-white">{{ item.qty }}</span>
              <button @click="updateQty(index, 1)" class="w-6 h-6 rounded-lg bg-white dark:bg-gray-700 border dark:border-gray-600 flex items-center justify-center hover:bg-green-50 hover:text-green-500 transition-colors">
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Checkout Summary -->
        <div class="p-6 bg-gray-50 dark:bg-gray-800/80 border-t dark:border-gray-700 space-y-4">
          <div class="space-y-2">
            <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Сумма</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Скидка</span>
              <span class="text-red-500">-$0.00</span>
            </div>
            <div class="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t dark:border-gray-700">
              <span>Итого</span>
              <span class="text-blue-600 dark:text-blue-400">${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="grid grid-cols-2 gap-2">
            <button 
              v-for="pm in ['Cash', 'Card']" 
              :key="pm"
              @click="paymentMethod = pm"
              :class="[
                'py-3 rounded-2xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2',
                paymentMethod === pm
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border dark:border-gray-600'
              ]"
            >
              <svg v-if="pm === 'Cash'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm3-2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              {{ pm === 'Cash' ? 'Наличные' : 'Карта' }}
            </button>
          </div>

          <button 
            @click="checkout"
            :disabled="cart.length === 0 || processing"
            class="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-xl"
          >
            <span v-if="!processing">Оплатить</span>
            <div v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Обработка...
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
       <div class="bg-white dark:bg-[#3f3f47] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
          <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold dark:text-white mb-2">Оплата прошла</h2>
          <p class="text-gray-500 dark:text-gray-400 mb-8">Сдача: <span class="font-bold text-gray-900 dark:text-white">$0.00</span></p>
          <button @click="showSuccess = false" class="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold transition-all hover:scale-105 active:scale-95">
            Новая продажа
          </button>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// State
const searchQuery = ref('')
const selectedCategory = ref('Все')
const paymentMethod = ref('Cash')
const processing = ref(false)
const showSuccess = ref(false)
const currentTime = ref(new Date().toLocaleTimeString())
let timeInterval

// Mock Data
const products = ref([
 { id: 1, name: 'Куркумин Плюс', price: 45.00, stock: 12, category: 'БАДы', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop' },
 { id: 2, name: 'Вода без газа 0.5л', price: 1.50, stock: 45, category: 'Напитки', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&h=200&fit=crop' },
 { id: 3, name: 'Витамин C 1000мг', price: 15.00, stock: 30, category: 'Лекарства', image: 'https://images.unsplash.com/photo-1616671285528-7630fbc36758?w=200&h=200&fit=crop' },
 { id: 4, name: 'Коллаген Морской', price: 60.00, stock: 8, category: 'БАДы', image: 'https://images.unsplash.com/photo-1626245917246-39049b79bb50?w=200&h=200&fit=crop' },
 { id: 5, name: 'Протеиновый батончик', price: 2.50, stock: 24, category: 'Еда', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop' },
 { id: 6, name: 'Крем для рук', price: 10.00, stock: 15, category: 'Уход', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop' },
 { id: 7, name: 'Чай облепиховый', price: 4.00, stock: 10, category: 'Напитки', image: 'https://images.unsplash.com/photo-1576092729250-59c240b79acb?w=200&h=200&fit=crop' },
 { id: 8, name: 'Шампунь натуральный', price: 18.00, stock: 5, category: 'Уход', image: 'https://images.unsplash.com/photo-1598454123303-99933391746f?w=200&h=200&fit=crop' }
])

const cart = ref([])

// Computed
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'Все' || p.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const subtotal = computed(() => {
  return cart.value.reduce((acc, item) => acc + (item.price * item.qty), 0)
})

const total = computed(() => subtotal.value)

// Methods
const addToCart = (product) => {
  const existing = cart.value.find(item => item.id === product.id)
  if (existing) {
    existing.qty++
  } else {
    cart.value.push({ ...product, qty: 1 })
  }
}

const updateQty = (index, delta) => {
  cart.value[index].qty += delta
  if (cart.value[index].qty <= 0) {
    cart.value.splice(index, 1)
  }
}

const clearCart = () => {
  if (confirm('Очистить корзину?')) {
    cart.value = []
  }
}

const checkout = () => {
  processing.value = true
  // Mock API call
  setTimeout(() => {
    processing.value = false
    showSuccess.value = true
    cart.value = []
  }, 1000)
}

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timeInterval)
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
