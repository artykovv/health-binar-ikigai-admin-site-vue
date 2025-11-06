<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900 p-5">
    <!-- Sidebar -->
    <div
      class="bg-white dark:bg-[#3f3f47] shadow-lg flex flex-col rounded-[20px] mr-5 overflow-visible w-16"
    >
      <!-- Logo/Brand -->
      <div class="px-3 py-4 flex items-center justify-center group relative">
        <div class="w-8 h-8 flex items-center justify-center">
          <img src="/favicon.svg" alt="Logo" class="w-8 h-8" />
        </div>
        <span class="whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 absolute left-full ml-2 px-3 py-1 bg-white dark:bg-[#3f3f47] rounded-lg shadow-lg z-50 pointer-events-none">
          Health Admin
        </span>
      </div>

      <!-- Divider -->
      <div class="px-4">
        <div class="border-t border-gray-200 dark:border-gray-600"></div>
      </div>

      <!-- Navigation Pages -->
      <nav class="flex-1 py-2">
        <div class="space-y-1 px-2">
          <router-link 
            to="/binar" 
            class="group flex items-center justify-center text-sm font-medium rounded-[20px] transition-all duration-300 px-3 py-3 overflow-visible relative"
            :class="[
              isActive('/binar') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            <svg 
              class="w-6 h-6 flex-shrink-0 transition-transform duration-300 ease-in-out group-hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span 
              class="whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 absolute left-full ml-2 px-3 py-1 bg-white dark:bg-[#3f3f47] rounded-lg shadow-lg z-50 pointer-events-none"
            >
              MLM
            </span>
          </router-link>

          <!-- Health Store - Temporarily disabled -->
          <!-- <router-link 
            to="/health-store" 
            class="group flex items-center justify-center text-sm font-medium rounded-[20px] transition-all duration-300 px-3 py-3 overflow-visible relative"
            :class="[
              isActive('/health-store') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            <svg 
              class="w-6 h-6 flex-shrink-0 transition-transform duration-300 ease-in-out group-hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span 
              class="whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 absolute left-full ml-2 px-3 py-1 bg-white dark:bg-[#3f3f47] rounded-lg shadow-lg z-50 pointer-events-none"
            >
              Health Store
            </span>
          </router-link> -->

          <!-- IV Bar - Temporarily disabled -->
          <!-- <router-link 
            to="/ivbar" 
            class="group flex items-center justify-center text-sm font-medium rounded-[20px] transition-all duration-300 px-3 py-3 overflow-visible relative"
            :class="[
              isActive('/ivbar') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            <svg 
              class="w-6 h-6 flex-shrink-0 transition-transform duration-300 ease-in-out group-hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span 
              class="whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 absolute left-full ml-2 px-3 py-1 bg-white dark:bg-[#3f3f47] rounded-lg shadow-lg z-50 pointer-events-none"
            >
              IV Bar
            </span>
          </router-link> -->

          <!-- MyBeauty - Temporarily disabled -->
          <!-- <router-link 
            to="/mybeauty" 
            class="group flex items-center justify-center text-sm font-medium rounded-[20px] transition-all duration-300 px-3 py-3 overflow-visible relative"
            :class="[
              isActive('/mybeauty') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            <svg 
              class="w-6 h-6 flex-shrink-0 transition-transform duration-300 ease-in-out group-hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            <span 
              class="whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 absolute left-full ml-2 px-3 py-1 bg-white dark:bg-[#3f3f47] rounded-lg shadow-lg z-50 pointer-events-none"
            >
              MyBeauty
            </span>
          </router-link> -->

          <router-link 
            to="/products" 
            class="group flex items-center justify-center text-sm font-medium rounded-[20px] transition-all duration-300 px-3 py-3 overflow-visible relative"
            :class="[
              isActive('/products') ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600'
            ]"
          >
            <svg 
              class="w-6 h-6 flex-shrink-0 transition-transform duration-300 ease-in-out group-hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
            </svg>
            <span 
              class="whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 absolute left-full ml-2 px-3 py-1 bg-white dark:bg-[#3f3f47] rounded-lg shadow-lg z-50 pointer-events-none"
            >
              Склад
            </span>
          </router-link>
        </div>
      </nav>

      <!-- Divider -->
      <div class="px-4">
        <div class="border-t border-gray-200 dark:border-gray-600"></div>
      </div>

      <!-- Settings -->
      <div class="py-2 px-2">
        <button
          class="group w-full flex items-center justify-center text-sm font-medium rounded-[20px] transition-all duration-300 px-3 py-3 overflow-visible relative text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <svg 
            class="w-6 h-6 flex-shrink-0 transition-transform duration-300 ease-in-out group-hover:scale-110" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span 
            class="whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 absolute left-full ml-2 px-3 py-1 bg-white dark:bg-[#3f3f47] rounded-lg shadow-lg z-50 pointer-events-none"
          >
            Настройки
          </span>
        </button>
      </div>

      <!-- Divider -->
      <div class="px-4">
        <div class="border-t border-gray-200 dark:border-gray-600"></div>
      </div>

      <!-- Admin Avatar -->
      <div class="p-3 flex items-center justify-center">
        <div class="group relative">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
            <span class="text-white font-semibold text-sm">A</span>
          </div>
          <span 
            class="whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 absolute left-full ml-2 px-3 py-1 bg-white dark:bg-[#3f3f47] rounded-lg shadow-lg z-50 pointer-events-none"
          >
            Админ
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation Bar -->
      <header class="bg-white dark:bg-[#3f3f47] shadow-sm border-b dark:border-gray-600 rounded-[20px] mb-5">
        <!-- Sub-navigation tabs -->
        <div class="p-2">
          <nav class="flex space-x-8 justify-center">
            <!-- Binar sub-navigation -->
            <template v-if="isActive('/binar')">
              <router-link 
                to="/binar" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="route.path === '/binar' ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                Главная
              </router-link>
              <!-- <router-link 
                to="/binar/structure" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="isActive('/binar/structure') ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                Структура
              </router-link> -->
              <router-link 
                to="/binar/participants" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="(['/binar/participants','/binar/participant','/binar/user-edit','/binar/sponsored'].some(p => route.path.startsWith(p)))
                  ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                Участники
              </router-link>
              <router-link 
                to="/binar/registration" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="(['/binar/registration','/binar/user-registration','/binar/add-to-structure','/binar/registration/participant','/binar/registration/user-edit'].some(p => route.path.startsWith(p))) ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                Регистрации
              </router-link>
              <router-link 
                to="/binar/branches" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="isActive('/binar/branches') ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                Филиалы
              </router-link>
              <router-link 
                to="/binar/bonuses" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="isActive('/binar/bonuses') ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                Бонусы
              </router-link>
              <router-link 
                to="/binar/report" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="isActive('/binar/report') ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                Отчет
              </router-link>
              <router-link 
                to="/binar/orders" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="isActive('/binar/orders') ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                Заказы
              </router-link>
            </template>
            
            <!-- Products sub-navigation -->
            <template v-if="isActive('/products')">
              <router-link 
                to="/products" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="route.path === '/products' ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                Главная
              </router-link>
              <router-link 
                to="/products/attributes" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="isActive('/products/attributes') ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                Атрибуты
              </router-link>
              <router-link 
                to="/products/products" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="isActive('/products/products') ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                Товары
              </router-link>
              <router-link 
                to="/products/receipt" 
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="isActive('/products/receipt') ? 'border-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-100' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                Приход
              </router-link>
            </template>
          </nav>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-[#3f3f47] rounded-[20px] p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Check if current route is active
const isActive = (path, exact = false) => {
  if (exact) {
    return route.path.startsWith(path + '/')
  }
  return route.path === path || route.path.startsWith(path + '/')
}


// Dynamic page title and description use route meta
const pageTitle = computed(() => {
  return (route.meta && route.meta.title) ? route.meta.title : ''
})

const pageDescription = computed(() => {
  return (route.meta && route.meta.description) ? route.meta.description : ''
})
</script>



