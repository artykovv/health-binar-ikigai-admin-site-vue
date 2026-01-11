<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Финансовый Дашборд</h1>
        <p class="text-gray-500 dark:text-gray-400">Обзор финансовых показателей и транзакций</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <!-- Balance -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Баланс</span>
          </div>
          <div>
            <p class="text-3xl font-black text-gray-900 dark:text-white">$0</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Текущий счет</p>
          </div>
        </div>

        <!-- Income -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Доходы</span>
          </div>
          <div>
            <p class="text-3xl font-black text-gray-900 dark:text-white">$0</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">За месяц</p>
          </div>
        </div>

        <!-- Expense -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-red-50 dark:bg-red-500/10 rounded-2xl text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Расходы</span>
          </div>
          <div>
            <p class="text-3xl font-black text-gray-900 dark:text-white">$0</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">За месяц</p>
          </div>
        </div>

        <!-- Transactions -->
        <div class="group bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Операции</span>
          </div>
          <div>
            <p class="text-3xl font-black text-gray-900 dark:text-white">0</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Всего транзакций</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <!-- Quick Actions -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Действия</h3>
            <div class="space-y-3">
              <router-link to="/kassa/income" class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group">
                <div class="p-2 bg-white dark:bg-gray-700 rounded-xl group-hover:bg-opacity-20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span class="font-bold">Добавить доход</span>
              </router-link>
              <router-link to="/kassa/expenses" class="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group">
                <div class="p-2 bg-white dark:bg-gray-700 rounded-xl group-hover:bg-opacity-20">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </div>
                <span class="font-bold">Добавить расход</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Recent Transactions Placeholder -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-[#3f3f47] p-6 rounded-[24px] shadow-sm border dark:border-gray-700 h-full">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Последние операции</h3>
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
