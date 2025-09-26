<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div id="app">
    <NavBar />

    <!-- Основной контент -->
    <main class="py-4">
      <div class="container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style>
/* Базовая типографика */
body {
  color: #000000;
}

/* Таблицы - базовая компактная подача */
.table {
  font-size: 14px;
}

.table th {
  font-weight: normal;
  background-color: #f8f9fa;
}

/* Кнопки - сохраняем компактный размер */
.btn {
  font-size: 12px;
  padding: 4px 8px;
}
</style>
