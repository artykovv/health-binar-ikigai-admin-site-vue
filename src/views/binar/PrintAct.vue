<template>
  <div class="print-act-container p-8 max-w-4xl mx-auto bg-white text-black">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
    
    <div v-else-if="order" class="space-y-6">
      <!-- Header -->
      <div class="text-center border-b-2 border-gray-800 pb-4 mb-8">
        <h1 class="text-2xl font-bold uppercase mb-2">Акт приема-передачи товара</h1>
        <p class="text-lg">к Заказу №{{ order.id }}</p>
        <p class="text-gray-600 mt-2">{{ formatDate(new Date()) }}</p>
      </div>

      <!-- Parties -->
      <div class="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 class="font-bold underline mb-2">Поставщик:</h3>
          <p class="font-semibold">Health Binar</p>
          <p v-if="order.branch">Филиал: {{ order.branch.name }}</p>
        </div>
        <div>
          <h3 class="font-bold underline mb-2">Получатель (Участник):</h3>
          <div v-if="order.participant">
            <p><span class="font-semibold">ФИО:</span> {{ order.participant.lastname }} {{ order.participant.name }} {{ order.participant.patronymic }}</p>
            <p><span class="font-semibold">ID:</span> {{ order.participant.personal_number }}</p>
            <p v-if="order.participant.phone_number || order.participant.phone"><span class="font-semibold">Телефон:</span> {{ order.participant.phone_number || order.participant.phone }}</p>
          </div>
          <div v-else>
            <p class="text-gray-500">Данные участника не найдены</p>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="mb-8">
        <h3 class="font-bold mb-4">Список товаров:</h3>
        <table class="w-full border-collapse border border-gray-800 text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-800 p-2 text-left w-10">№</th>
              <th class="border border-gray-800 p-2 text-left">Наименование</th>
              <th class="border border-gray-800 p-2 text-center w-16">Ед. изм.</th>
              <th class="border border-gray-800 p-2 text-center w-16">Кол-во</th>
              <th class="border border-gray-800 p-2 text-center w-16">Выдано</th>
              <th class="border border-gray-800 p-2 text-right w-28">Цена (СОМ)</th>
              <th class="border border-gray-800 p-2 text-right w-28">Сумма (СОМ)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in order.items" :key="item.id">
              <td class="border border-gray-800 p-2 text-center">{{ index + 1 }}</td>
              <td class="border border-gray-800 p-2">
                {{ getVariantName(item.variant_id) }}
              </td>
              <td class="border border-gray-800 p-2 text-center">шт.</td>
              <td class="border border-gray-800 p-2 text-center">{{ item.quantity }}</td>
              <td class="border border-gray-800 p-2 text-center">
                <span v-if="(item.issued_quantity || 0) >= item.quantity" class="font-bold text-lg">✓</span>
              </td>
              <td class="border border-gray-800 p-2 text-right">{{ toSOM(item.price).toLocaleString() }}</td>
              <td class="border border-gray-800 p-2 text-right">{{ toSOM(item.price * item.quantity).toLocaleString() }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="font-bold bg-gray-50">
              <td colspan="3" class="border border-gray-800 p-2 text-right">Итого:</td>
              <td class="border border-gray-800 p-2 text-center">{{ totalQuantity }}</td>
              <td class="border border-gray-800 p-2"></td>
              <td class="border border-gray-800 p-2"></td>
              <td class="border border-gray-800 p-2 text-right">{{ toSOM(order.total_amount).toLocaleString() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Signatures -->
      <div class="mt-16 grid grid-cols-2 gap-16">
        <div>
          <p class="mb-8 font-bold">Отпустил (Представитель Поставщика):</p>
          <div class="border-b border-gray-800 mb-2"></div>
          <p class="text-xs text-center text-gray-500">(Подпись / ФИО)</p>
        </div>
        <div>
          <p class="mb-8 font-bold">Получил (Участник):</p>
          <div class="border-b border-gray-800 mb-2"></div>
          <p class="text-xs text-center text-gray-500">(Подпись / ФИО)</p>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12 text-red-600">
      <p>Не удалось загрузить данные заказа</p>
    </div>

    <!-- Print Controls (Hidden on Print) -->
    <div class="fixed bottom-4 right-4 print:hidden flex gap-2">
      <button 
        @click="print" 
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
        </svg>
        Печать
      </button>
      <button 
        @click="close" 
        class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 shadow-lg"
      >
        Закрыть
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api, store_api } from '@/api'
import { toSOM } from '@/utils/currency'

const route = useRoute()
const loading = ref(true)
const order = ref(null)
const variantsMap = ref({})

const totalQuantity = computed(() => {
  return order.value?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
})

const formatDate = (date) => {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const getVariantName = (variantId) => {
  return variantsMap.value[variantId] || `Товар #${variantId}`
}

const loadOrder = async () => {
  loading.value = true
  try {
    const orderId = route.params.id
    
    // Check if it's health day from query param (added in modal link)
    const isHealthDay = route.query.type === 'healthday'
    
    let response
    if (isHealthDay) {
        response = await api.get(`health-day/orders/${orderId}`)
    } else {
        // Assume contract order
        response = await api.get(`orders/${orderId}`)
    }
    
    // Handle array or object response
    const data = Array.isArray(response.data) ? response.data[0] : response.data
    order.value = data

    // If it's a contract order with responsible_participant_id but no full participant data
    if (data.responsible_participant_id && !data.participant) {
        try {
            const pResponse = await api.get(`participants/${data.responsible_participant_id}`)
            order.value.participant = pResponse.data
        } catch (e) {
            console.error('Failed to load participant details', e)
        }
    }

    if (data.items && data.items.length) {
      const variantIds = data.items.map(i => i.variant_id)
      await loadVariants(variantIds)
    }
    
  } catch (error) {
    console.error('Failed to load order:', error)
    // Fallback attempt if direct fetch failed (e.g. wrong type assumption)
    if (!order.value) {
         try {
            // Try the other endpoint just in case
            const isHealthDay = route.query.type === 'healthday'
            const altEndpoint = isHealthDay ? `orders/${route.params.id}` : `health-day/orders/${route.params.id}`
             const response = await api.get(altEndpoint)
             const data = Array.isArray(response.data) ? response.data[0] : response.data
             order.value = data
             if (data.items && data.items.length) {
                const variantIds = data.items.map(i => i.variant_id)
                await loadVariants(variantIds)
             }
         } catch (e) {
             console.error('Fallback load failed', e)
         }
    }
  } finally {
    loading.value = false
  }
}

const loadVariants = async (ids) => {
  try {
    const response = await store_api.get('products/variants?skip=0&limit=1000')
    const variants = response.data
    variants.forEach(v => {
      if (ids.includes(v.id)) {
        variantsMap.value[v.id] = v.full_name || v.variant_name
      }
    })
  } catch (e) {
    console.error('Error loading variants:', e)
  }
}

const print = () => window.print()
const close = () => window.close()

onMounted(() => {
  loadOrder()
})
</script>

<style>
@media print {
  @page {
    margin: 1cm;
    size: A4;
  }
  .print-act-container {
    padding: 0;
    max-width: 100%;
  }
}
</style>
