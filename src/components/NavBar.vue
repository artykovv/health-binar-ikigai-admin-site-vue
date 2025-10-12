<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ref, reactive, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const items = [
  { to: '/', label: 'Главная', key: 'home' },
  { to: '/structure', label: 'Структура', key: 'structure' },
  { to: '/participants', label: 'Участники', key: 'participants' },
  { to: '/registration', label: 'Регистрации', key: 'registration' },
  { to: '/branches', label: 'Филиалы', key: 'branches' },
  { to: '/bonuses', label: 'Бонусы', key: 'bonuses' },
  // { to: '/purchase', label: 'Покупки', key: 'purchases' },
  { to: '/report', label: 'Отчет', key: 'report' },
  // { to: '/settings', label: 'Настройки', key: 'settings' }
]

const route = useRoute()
const containerRef = ref(null)
const linkRefs = new Map()
function setLinkRef(key, el) {
  if (el) {
    linkRefs.set(key, el)
  }
}

const linkWidth = ref(0)

// Theme handling (light/dark)
const isDark = ref(false)

function applyThemeClass() {
  const root = document.documentElement
  if (isDark.value) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

function loadTheme() {
  try {
    const saved = localStorage.getItem('theme')
    isDark.value = saved === 'dark'
  } catch {}
  applyThemeClass()
}

function saveTheme() {
  try {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  } catch {}
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyThemeClass()
  saveTheme()
  // Recalculate indicator in case layout metrics subtly change
  nextTick().then(() => updateIndicator())
}

const indicator = reactive({
  left: 0,
  width: 0,
  visible: false
})

// External active key override for detail pages (e.g., participants/:id)
const externalActiveKey = ref(null)

function readExternalActiveKey() {
  if (typeof window === 'undefined') return null
  const k = window.__navActiveKey
  if (k === 'participants' || k === 'registration') return k
  return null
}

function getActiveKey() {
  const currentPath = route.path
  // Map related detail pages to their logical parent menu item
  if (currentPath.startsWith('/sponsored')) {
    return 'participants'
  }
  // On participant detail, allow external override (set by the page after data load)
  if (currentPath.startsWith('/participants/')) {
    const ext = externalActiveKey.value || readExternalActiveKey()
    if (ext) return ext
    // If not yet known, avoid showing a wrong active tab (no highlight until decided)
    return null
  }
  let match = items.find(i => currentPath === i.to)
  if (!match) {
    match = items.find(i => i.to !== '/' && (currentPath === i.to || currentPath.startsWith(i.to + '/')))
  }
  if (!match) {
    match = items[0]
  }
  return match.key
}

function updateWidths() {
  let maxW = 0
  for (const item of items) {
    const el = linkRefs.get(item.key)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.width > maxW) maxW = Math.ceil(rect.width)
  }
  if (maxW > 0 && linkWidth.value !== maxW) linkWidth.value = maxW
}

function updateIndicator() {
  const ul = containerRef.value
  if (!ul) return

  updateWidths()

  const activeKey = getActiveKey()
  if (!activeKey) {
    indicator.visible = false
    return
  }
  const linkEl = linkRefs.get(activeKey)
  if (!linkEl) return

  const linkRect = linkEl.getBoundingClientRect()
  const ulRect = ul.getBoundingClientRect()
  const width = linkWidth.value || Math.round(linkRect.width)
  const centerLeft = (linkRect.left - ulRect.left) + (linkRect.width / 2) - (width / 2)

  indicator.left = Math.round(centerLeft)
  indicator.width = Math.round(width)
  indicator.visible = true
}

function onResize() {
  updateIndicator()
}

let resizeObserver

// Listen for external active key change events to update immediately
function onExternalKeyChanged() {
  externalActiveKey.value = readExternalActiveKey()
  nextTick().then(() => updateIndicator())
}

onMounted(() => {
  // Load persisted theme
  loadTheme()
  
  nextTick(() => {
    updateIndicator()
  })
  
  window.addEventListener('resize', onResize)
  window.addEventListener('load', onResize)
  
  // External key change listener
  if (typeof window !== 'undefined') {
    window.addEventListener('nav-active-key-changed', onExternalKeyChanged)
  }

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      updateIndicator()
    })
    if (containerRef.value) {
      resizeObserver.observe(containerRef.value)
    }
  }

  if (document && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      nextTick().then(() => updateIndicator())
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('load', onResize)
  
  if (typeof window !== 'undefined') {
    window.removeEventListener('nav-active-key-changed', onExternalKeyChanged)
  }
  
  if (resizeObserver && containerRef.value) {
    try { resizeObserver.unobserve(containerRef.value) } catch {}
  }
})

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    updateIndicator()
    // Clear external override when leaving participant detail page
    const currentPath = route.path
    if (!currentPath.startsWith('/participants/')) {
      externalActiveKey.value = null
      if (typeof window !== 'undefined' && window.__navActiveKey) {
        try { delete window.__navActiveKey } catch {}
      }
    }
  }
)

watch(linkWidth, async () => {
  await nextTick()
  updateIndicator()
})
</script>

<template>
  <nav class="nav" aria-label="Основная навигация">
    <ul class="nav-list card" ref="containerRef">
      <li v-for="item in items" :key="item.key" class="nav-item">
        <RouterLink :to="item.to" custom v-slot="{ isActive, href, navigate }">
          <a
            :href="href"
            @click="navigate"
            :ref="el => setLinkRef(item.key, el)"
            :class="['nav-link', { 'is-active': isActive }]"
            :style="{ width: linkWidth ? linkWidth + 'px' : undefined }"
            :aria-label="item.label"
          >
            {{ item.label }}
          </a>
        </RouterLink>
      </li>
      <span
        class="nav-indicator"
        :style="{
          transform: `translateX(${indicator.left}px)`,
          width: indicator.width + 'px',
          opacity: indicator.visible ? 1 : 0
        }"
        aria-hidden="true"
      />
    </ul>
    <div class="nav-toggle-card card">
      <button 
        class="theme-toggle" 
        type="button" 
        @click="toggleTheme" 
        :aria-pressed="isDark"
        :aria-label="isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'"
        :title="isDark ? 'Светлая тема' : 'Темная тема'"
      >
        <span v-if="!isDark" aria-hidden="true" class="icon theme-icon">☀️</span>
        <span v-else aria-hidden="true" class="icon theme-icon">🌙</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.nav-list {
  position: relative;
  display: inline-flex;
  justify-content: center;
  gap: 12px;
  padding: 10px 0;
  list-style: none;
  margin: 0;
  border-radius: 20px;
  padding-left: 40px;
  padding-right: 40px;
}
.nav-item {
  position: relative;
}
.nav-link {
  display: inline-block;
  padding: 8px 10px;
  color: #111827;
  text-decoration: none;
  text-align: center;
  border-radius: 10px;
  transition: color 300ms ease, background-color 300ms ease;
}
.nav-link:hover {
  color: #000000;
  background-color: #91919120;
}
.nav-indicator {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  background-color: #000000;
  border-radius: 2px;
  transition: transform 450ms ease, width 250ms ease, opacity 150ms ease, background-color 300ms ease;
  will-change: transform, width;
}

/* Theme toggle button */
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 36px;
  padding: 0 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background-color: #f3f4f6;
  color: #111827;
  transition: background-color 300ms ease, color 300ms ease, transform 200ms ease;
}
.theme-toggle:hover {
  background-color: #e5e7eb;
  transform: scale(1.05);
}
.theme-toggle:active {
  transform: scale(0.95);
}
.icon {
  font-size: 18px;
  line-height: 1;
}
.theme-icon {
  display: inline-block;
  animation: fadeIn 300ms ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: rotate(-20deg) scale(0.8);
  }
  to {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Dark theme overrides for navbar */
:root.dark .nav-link {
  color: #ffffff;
  transition: color 300ms ease, background-color 300ms ease;
}
:root.dark .nav-link:hover {
  color: #ffffff;
  background-color: rgba(255,255,255,0.08);
}
:root.dark .nav-indicator {
  background-color: #ffffff;
  transition: transform 450ms ease, width 250ms ease, opacity 150ms ease, background-color 300ms ease;
}
:root.dark .theme-toggle {
  background-color: #3f3f47;
  color: #ffffff;
}
:root.dark .theme-toggle:hover {
  background-color: #4a4a52;
}

/* In dark mode keep navbar container dark instead of white cards */
.nav-list {
  transition: background-color 300ms ease;
}
:root.dark .nav-list {
  background-color: #252529 !important;
}

/* Separate toggle card next to the menu */
.nav-toggle-card {
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
  padding: 6px 10px;
  border-radius: 20px;
  transition: background-color 300ms ease;
}
:root.dark .nav-toggle-card {
  background-color: #252529 !important;
}
</style>


