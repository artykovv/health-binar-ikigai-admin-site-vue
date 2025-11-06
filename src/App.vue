<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
/* Базовая типографика */
body {
  color: #000000;
  transition: background-color 300ms ease, color 300ms ease;
}

:root.dark body {
  background-color: #18181b;
  color: #ffffff;
}

#app {
  transition: background-color 300ms ease;
}

:root.dark #app {
  background-color: #18181b;
}

main {
  transition: background-color 300ms ease;
}

:root.dark main {
  background-color: #18181b;
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
