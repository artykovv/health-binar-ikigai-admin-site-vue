<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="handleClose"></div>
    <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
      <div class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
        <h5 class="m-0 dark:text-white">Редактирование доплаты</h5>
        <button @click="handleClose" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-[#4a4a52]">✕</button>
      </div>
      <div class="p-4">
        <div class="space-y-4">
          <div>
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Сумма</p>
            <p class="text-sm font-semibold dark:text-white">${{ payment?.amount }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Сумма не может быть изменена</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Метод оплаты *</label>
            <select 
              v-model.number="form.payment_method_id" 
              required
              :disabled="loadingPaymentMethods"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white disabled:opacity-50"
            >
              <option value="">{{ loadingPaymentMethods ? 'Загрузка...' : 'Выберите метод оплаты' }}</option>
              <option 
                v-for="method in paymentMethods" 
                :key="method.id" 
                :value="method.id"
              >
                {{ method.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Описание</label>
            <textarea 
              v-model="form.description" 
              rows="3"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
              placeholder="Описание доплаты..."
            ></textarea>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
        <button
          @click="handleClose"
          class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]"
        >
          Отмена
        </button>
        <button
          @click="handleSave"
          :disabled="!form.payment_method_id || saving"
          class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-40 dark:bg-green-700 dark:hover:bg-green-800"
        >
          {{ saving ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { api } from '@/api'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  payment: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const form = ref({
  payment_method_id: null,
  description: ''
})
const saving = ref(false)
const paymentMethods = ref([])
const loadingPaymentMethods = ref(false)

const loadPaymentMethods = async () => {
  loadingPaymentMethods.value = true
  try {
    const response = await api.get('enums/payment-methods?limit=100&offset=0')
    paymentMethods.value = response.data.filter(m => m.active)
  } catch (error) {
    console.error('Ошибка загрузки методов оплаты:', error)
  } finally {
    loadingPaymentMethods.value = false
  }
}

const handleClose = () => {
  emit('close')
}

const handleSave = async () => {
  if (!form.value.payment_method_id || !props.payment) return
  
  saving.value = true
  try {
    const payload = {
      payment_method_id: form.value.payment_method_id,
      description: form.value.description || ''
    }
    
    await api.patch(`orders/extra-payment/${props.payment.id}`, payload)
    
    emit('saved', {
      ...props.payment,
      payment_method_id: form.value.payment_method_id,
      description: form.value.description,
      payment_method: paymentMethods.value.find(m => m.id === form.value.payment_method_id)
    })
    
    handleClose()
  } catch (error) {
    console.error('Ошибка обновления доплаты:', error)
    alert('Ошибка обновления доплаты. Попробуйте еще раз.')
  } finally {
    saving.value = false
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal && props.payment) {
    form.value = {
      payment_method_id: props.payment.payment_method?.id || props.payment.payment_method_id || null,
      description: props.payment.description || ''
    }
    if (paymentMethods.value.length === 0) {
      loadPaymentMethods()
    }
  } else if (!newVal) {
    form.value = {
      payment_method_id: null,
      description: ''
    }
  }
})

watch(() => props.payment, (newPayment) => {
  if (props.visible && newPayment) {
    form.value = {
      payment_method_id: newPayment.payment_method?.id || newPayment.payment_method_id || null,
      description: newPayment.description || ''
    }
    if (paymentMethods.value.length === 0) {
      loadPaymentMethods()
    }
  }
})
</script>

