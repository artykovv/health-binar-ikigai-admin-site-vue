<template>
  <div class="container mx-auto px-4 py-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold dark:text-white">Продукция</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Управление товарами и каталогом</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Всего товаров</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">156</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Активные товары</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">142</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Варианты товаров</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">1,234</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Общая стоимость</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">₽45.2M</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Быстрые действия</h3>
          <div class="space-y-3">
            <router-link to="/products/products" class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#4a4a52] transition-colors">
              <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Управление товарами</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Просмотр, добавление и редактирование товаров</p>
              </div>
            </router-link>

            <router-link to="/products/products/add" class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#4a4a52] transition-colors">
              <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-3">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Добавить товар</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Создать новый товар с опциями и вариантами</p>
              </div>
            </router-link>

            <div class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-[#4a4a52] opacity-50">
              <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-500 dark:text-gray-400">Категории товаров</p>
                <p class="text-sm text-gray-400 dark:text-gray-500">Скоро будет доступно</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Последние действия</h3>
          <div class="space-y-3">
            <div class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-[#4a4a52]">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">Новый товар добавлен</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">5 минут назад</p>
              </div>
            </div>
            <div class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-[#4a4a52]">
              <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">Товар обновлен</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">1 час назад</p>
              </div>
            </div>
            <div class="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-[#4a4a52]">
              <div class="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">Добавлены варианты товара</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">2 часа назад</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Products -->
      <div class="bg-white dark:bg-[#3f3f47] rounded-lg shadow-sm border dark:border-gray-600 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Последние товары</h3>
          <router-link to="/products/products" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
            Показать все
          </router-link>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-[#4a4a52]">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Арабика Колумбия</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">6 вариантов • ₽1,200 - ₽2,400</p>
              </div>
            </div>
            <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">Активен</span>
          </div>
          <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-[#4a4a52]">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Робуста Бразилия</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">4 варианта • ₽800 - ₽1,600</p>
              </div>
            </div>
            <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">Активен</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Dashboard component for Products section
</script>
