<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-5">
    <div class="max-w-4xl w-full">
      <!-- Welcome Header -->
      <div class="text-center mb-12">
        <div class="inline-block mb-6">
          <img src="/favicon.svg" alt="Logo" class="w-20 h-20 mx-auto" />
        </div>
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Добро пожаловать
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          На данный момент сайт в разработке
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- MLM -->
        <router-link
          to="/binar"
          class="group bg-white dark:bg-[#3f3f47] rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center"
        >
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
            <svg class="w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">MLM</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Сетевой маркетинг</p>
        </router-link>

        <!-- Касса -->
        <router-link
          to="/kassa"
          class="group bg-white dark:bg-[#3f3f47] rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center"
        >
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
            <svg class="w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Касса</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Кассовые операции</p>
        </router-link>

        <!-- Health Store -->
        <router-link
          to="/health-store"
          class="group bg-white dark:bg-[#3f3f47] rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center"
        >
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
            <svg class="w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Health Store</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Интернет магазин</p>
        </router-link>

        <!-- IV Bar - Temporarily disabled -->
        <!-- <router-link
          to="/ivbar"
          class="group bg-white dark:bg-[#3f3f47] rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center"
        >
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
            <svg class="w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">IV Bar</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Капельницы</p>
        </router-link> -->

        <!-- MyBeauty - Temporarily disabled -->
        <!-- <router-link
          to="/mybeauty"
          class="group bg-white dark:bg-[#3f3f47] rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center"
        >
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
            <svg class="w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">MyBeauty</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Косметология</p>
        </router-link> -->

        <!-- Склад -->
        <router-link
          to="/products"
          class="group bg-white dark:bg-[#3f3f47] rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center"
        >
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
            <svg class="w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Склад</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Управление товарами</p>
        </router-link>

        <!-- Списания -->
        <router-link
          to="/ek"
          class="group bg-white dark:bg-[#3f3f47] rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center text-center"
        >
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
            <svg class="w-8 h-8 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Списания</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">Бесплатная выдача (EK)</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Welcome page component
</script>

<style scoped>
/* Component styles */
</style>
