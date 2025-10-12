<template>
  <div>
    <h1 class="mb-6 dark:text-white">Главная</h1>
    
    <!-- Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
      <!-- Large card - spans 2 columns and 2 rows -->
      <div class="md:col-span-2 md:row-span-2 bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 1</span>
        </div>
      </div>
      
      <!-- Medium card - spans 1 column and 2 rows -->
      <div class="md:row-span-2 bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 2</span>
        </div>
      </div>
      
      <!-- Small card -->
      <div class="bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 3</span>
        </div>
      </div>
      
      <!-- Wide card - spans 2 columns -->
      <div class="md:col-span-2 bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 4</span>
        </div>
      </div>
      
      <!-- Small card -->
      <div class="bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 5</span>
        </div>
      </div>
      
      <!-- Small card -->
      <div class="bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 6</span>
        </div>
      </div>
      
      <!-- Tall card - spans 2 rows -->
      <div class="md:row-span-2 bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 7</span>
        </div>
      </div>
      
      <!-- Small card -->
      <div class="bg-white rounded-lg ring-1 ring-gray-200 p-6 dark:bg-[#3f3f47] dark:ring-gray-700 transition-all duration-300 hover:ring-gray-300 dark:hover:ring-gray-600">
        <div class="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span class="text-sm">Карточка 8</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Главная страница с Bento Grid
</script>

<style scoped>
/* Плавные переходы для карточек */
</style>
