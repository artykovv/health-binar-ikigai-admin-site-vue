<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Дашборд Магазина</h1>
        <p class="text-gray-500 dark:text-gray-400">Обзор заказов и продаж магазина здоровья</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <!-- Revenue -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Выручка</span>
          </div>
          <div>
            <p class="text-3xl font-black text-gray-900 dark:text-white">$0</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">За месяц</p>
          </div>
        </div>

        <!-- Orders -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Заказы</span>
          </div>
          <div>
            <p class="text-3xl font-black text-gray-900 dark:text-white">0</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Новых заказов</p>
          </div>
        </div>

        <!-- Customers -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Клиенты</span>
          </div>
          <div>
            <p class="text-3xl font-black text-gray-900 dark:text-white">0</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Активных покупателей</p>
          </div>
        </div>

        <!-- Products -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Товары</span>
          </div>
          <div>
            <p class="text-3xl font-black text-gray-900 dark:text-white">0</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">В каталоге</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <!-- Quick Actions -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Действия</h3>
            <div class="space-y-3">
              <router-link to="/health-store/orders" class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group">
                <div class="p-2 bg-white dark:bg-gray-700 rounded-xl group-hover:bg-opacity-20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span class="font-bold">Все заказы</span>
              </router-link>
              <router-link to="/health-store/products" class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group">
                <div class="p-2 bg-white dark:bg-gray-700 rounded-xl group-hover:bg-opacity-20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <span class="font-bold">Каталог товаров</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Orders Placeholder -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 h-full">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Последние заказы</h3>
            </div>
            <div class="text-center py-20 text-gray-400">
              Данные загружаются...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
