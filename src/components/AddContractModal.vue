<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
    <div class="relative z-10 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
      <div class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-[#3f3f47]">
        <h5 class="m-0 dark:text-white">{{ getStepTitle() }}</h5>
        <button @click="$emit('close')" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-[#4a4a52]">✕</button>
      </div>
      <div class="p-4">
        <!-- Step 1: Participant Selection -->
        <div v-if="step === 1">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
            <p class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Выбор участников</p>
            <p class="text-xs text-blue-700 dark:text-blue-300 mb-3">Найдите и выберите участников с контрактами</p>
            
            <!-- Search input -->
            <div class="mb-3">
              <input
                v-model="participantSearch"
                @input="searchParticipants"
                type="text"
                placeholder="Поиск по имени, фамилии, персональному номеру..."
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
              />
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loadingParticipants" class="text-center py-8">
            <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
          </div>

          <!-- Results -->
          <div v-else class="space-y-2">
            <div v-if="availableParticipants.length === 0 && participantSearch" class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              Участники не найдены
            </div>
            <div
              v-for="participant in availableParticipants"
              :key="participant.id"
              @click="toggleParticipant(participant)"
              class="p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#4a4a52] transition-colors"
              :class="{ 'border-gray-900 dark:border-gray-300 bg-blue-50 dark:bg-blue-900/20': isParticipantSelected(participant.id) }"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    :checked="isParticipantSelected(participant.id)"
                    @change="toggleParticipant(participant)"
                    @click.stop
                    class="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">
                      {{ participant.name }} {{ participant.lastname }} {{ participant.patronymic }}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ participant.personal_number }}</p>
                  </div>
                </div>
                <div v-if="participant.contract_status && parseFloat(participant.contract_status.total_remaining_amount) > 0" class="text-right">
                  <p class="font-bold text-gray-900 dark:text-white">${{ participant.contract_status.total_remaining_amount }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Остаток</p>
                </div>
                <div v-else class="text-right">
                  <p class="text-xs text-red-500 dark:text-red-400">Нет контракта</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Product Selection -->
        <div v-if="step === 2">
          <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Выбранные контракты</p>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                  Количество участников: {{ selectedContracts.length }}
                </p>
                <p class="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                  Общая сумма: ${{ totalRemainingAmount.toFixed(2) }}
                </p>
              </div>
              <div v-if="exchangeRate">
                 <p class="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                  &nbsp;
                </p>
                <p class="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                  {{ Math.round(totalRemainingAmount * exchangeRate).toLocaleString() }} сом
                </p>
              </div>
            </div>
          </div>

          <!-- Exchange Rate Input -->
          <div class="mb-4 p-3 bg-gray-50 dark:bg-[#4a4a52] border border-gray-200 dark:border-gray-600 rounded-lg">
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-white">Курс валюты (1$ = X сом)</label>
            <input
              v-model.number="exchangeRate"
              type="number"
              min="1"
              step="1"
              placeholder="Введите курс (например, 88)"
              class="block w-full max-w-xs rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
            />
          </div>

          <div v-if="loadingProducts" class="text-center py-8">
            <span class="inline-block h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white"></th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цена</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цена (сом)</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Кол-во</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Остаток</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                <tr
                  v-for="product in availableProducts"
                  :key="product.id"
                  @click="toggleProduct(product.id)"
                  class="hover:bg-gray-50 dark:hover:bg-[#4a4a52] cursor-pointer"
                >
                  <td class="px-4 py-2 whitespace-nowrap" @click.stop>
                    <input
                      type="checkbox"
                      :checked="isProductSelected(product.id)"
                      :value="product.id"
                      @change.stop="toggleProduct(product.id)"
                      @click.stop
                      class="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ product.id }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ product.full_name }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ product.price }}</td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                    {{ exchangeRate ? Math.round(product.price * exchangeRate).toLocaleString() : '-' }} сом
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap" @click.stop>
                    <input
                      v-if="isProductSelected(product.id)"
                      type="number"
                      :value="getProductQuantity(product.id)"
                      @input="updateProductQuantity(product.id, $event.target.value)"
                      @click.stop
                      min="1"
                      class="w-20 px-2 py-1 text-sm border rounded border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white"
                    />
                    <span v-else class="text-sm text-gray-500 dark:text-gray-400 inline-block w-20">-</span>
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ product.stock }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Step 3: Responsible Person Selection -->
        <div v-if="step === 3">
          <div class="space-y-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Ответственный</p>
              <p class="text-xs text-blue-700 dark:text-blue-300 mb-3">Выберите участника, который заберет товары</p>
              
              <!-- Selected responsible or Search input -->
              <div class="mb-3">
                <div v-if="selectedResponsible" class="relative">
                  <input
                    type="text"
                    :value="`${selectedResponsible.name} ${selectedResponsible.lastname} ${selectedResponsible.patronymic} (${selectedResponsible.personal_number})`"
                    readonly
                    class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm focus:outline-none dark:bg-[#3f3f47] dark:border-white dark:text-white"
                  />
                  <button
                    @click="selectedResponsible = null; responsibleSearch = ''; responsibleResults = []"
                    class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-[#4a4a52]"
                    title="Удалить выбранного участника"
                  >
                    ✕
                  </button>
                </div>
                <input
                  v-else
                  v-model="responsibleSearch"
                  @input="searchResponsible"
                  type="text"
                  placeholder="Поиск по имени, фамилии, персональному номеру..."
                  class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                />
              </div>

              <!-- Loading -->
              <div v-if="loadingResponsible" class="text-center py-4">
                <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
              </div>

              <!-- Results -->
              <div v-else-if="!selectedResponsible" class="space-y-2 max-h-[400px] overflow-y-auto">
                <div
                  v-for="participant in responsibleResults"
                  :key="participant.id"
                  @click="selectResponsible(participant)"
                  class="p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#4a4a52] transition-colors"
                  :class="{ 'border-gray-900 dark:border-gray-300 bg-blue-50 dark:bg-blue-900/20': selectedResponsible?.id === participant.id }"
                >
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ participant.name }} {{ participant.lastname }} {{ participant.patronymic }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ participant.personal_number }}</p>
                </div>
                <div v-if="responsibleResults.length === 0 && responsibleSearch" class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                  Участники не найдены
                </div>
              </div>
            </div>

            <!-- Extra Payment Form (if there's an overage) -->
            <div v-if="remainingAmount < 0" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-sm font-medium text-red-900 dark:text-red-200 mb-3">Доплата требуется</p>
              <p class="text-xs text-red-700 dark:text-red-300 mb-4">
                Превышение бюджета: ${{ Math.abs(remainingAmount).toFixed(2) }} 
                <span v-if="exchangeRate" class="font-bold ml-1">({{ Math.round(Math.abs(remainingAmount) * exchangeRate).toLocaleString() }} сом)</span>
              </p>
              
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Сумма доплаты *</label>
                  <input 
                    v-model.number="extraPaymentForm.amount" 
                    type="number" 
                    step="0.01"
                    min="0"
                    required
                    class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                    :placeholder="`Максимум: $${Math.abs(remainingAmount).toFixed(2)}`"
                  />
                  <p v-if="extraPaymentForm.amount && exchangeRate" class="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    {{ Math.round(extraPaymentForm.amount * exchangeRate).toLocaleString() }} сом
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Метод оплаты *</label>
                  <select 
                    v-model.number="extraPaymentForm.payment_method_id" 
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
                    v-model="extraPaymentForm.description" 
                    rows="2"
                    class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                    placeholder="Описание доплаты..."
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Чек оплаты</label>
                  <div class="flex items-center gap-2">
                    <button 
                      @click="openImageUpload"
                      class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52] border border-gray-300 dark:border-gray-600"
                    >
                      <span v-if="!extraPaymentForm.receipt_image">Загрузить чек</span>
                      <span v-else>Изменить чек</span>
                    </button>
                    <div v-if="extraPaymentForm.receipt_image" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span class="truncate max-w-[200px]">{{ extraPaymentForm.receipt_image.filename }}</span>
                      <button @click="extraPaymentForm.receipt_image = null" class="text-red-500 hover:text-red-700">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Final Confirmation -->
        <div v-if="step === 4">
          <div class="space-y-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Ответственный</p>
              <p class="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                {{ selectedResponsible.name }} {{ selectedResponsible.lastname }} {{ selectedResponsible.patronymic }}
              </p>
              <p class="text-sm text-blue-700 dark:text-blue-300">{{ selectedResponsible.personal_number }}</p>
            </div>

            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Выбранные контракты</p>
              <p class="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                Количество участников: {{ selectedContracts.length }}
              </p>
              <p class="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                Общая сумма: ${{ totalRemainingAmount.toFixed(2) }}
              </p>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Название</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цена</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Кол-во</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr
                    v-for="productId in selectedProducts"
                    :key="productId"
                    class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]"
                  >
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ productId }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ getProductById(productId)?.full_name || '-' }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${{ getProductById(productId)?.price || 0 }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ getProductQuantity(productId) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Summary for Step 4 -->
            <div class="grid grid-cols-4 gap-4 p-3 bg-gray-50 dark:bg-[#4a4a52] rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Товары</p>
                <p class="text-sm font-bold text-gray-900 dark:text-white">${{ selectedProductsTotal.toFixed(2) }}</p>
                <p v-if="exchangeRate" class="text-xs text-blue-600 dark:text-blue-400">{{ Math.round(selectedProductsTotal * exchangeRate).toLocaleString() }} сом</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Доступно</p>
                <p class="text-sm font-bold text-gray-900 dark:text-white">${{ totalRemainingAmount.toFixed(2) }}</p>
                <p v-if="exchangeRate" class="text-xs text-blue-600 dark:text-blue-400">{{ Math.round(totalRemainingAmount * exchangeRate).toLocaleString() }} сом</p>
              </div>
              <div>
                <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Остаток</p>
                <p class="text-sm font-bold" :class="remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'">
                  ${{ remainingAmount.toFixed(2) }}
                </p>
                <p v-if="exchangeRate" class="text-xs font-bold" :class="remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'">{{ Math.round(remainingAmount * exchangeRate).toLocaleString() }} сом</p>
              </div>
              <div v-if="remainingAmount < 0">
                <p class="text-xs text-red-600 dark:text-red-400 mb-1">Превышение</p>
                <p class="text-sm font-bold text-red-600">
                  ${{ Math.abs(remainingAmount).toFixed(2) }}
                </p>
                <p v-if="exchangeRate" class="text-xs font-bold text-red-600">{{ Math.round(Math.abs(remainingAmount) * exchangeRate).toLocaleString() }} сом</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="px-4 py-3 border-t dark:border-gray-700 sticky bottom-0 bg-white dark:bg-[#3f3f47]">
        <!-- Summary sticky at bottom for Step 2 -->
        <div v-if="step === 2" class="mb-4">
          <div class="grid grid-cols-4 gap-4 p-3 bg-gray-50 dark:bg-[#4a4a52] rounded-lg border border-gray-200 dark:border-gray-600">
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Товары</p>
              <p class="text-sm font-bold text-gray-900 dark:text-white">${{ selectedProductsTotal.toFixed(2) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Доступно</p>
              <p class="text-sm font-bold text-gray-900 dark:text-white">${{ totalRemainingAmount.toFixed(2) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">Остаток</p>
              <p class="text-sm font-bold" :class="remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'">
                ${{ remainingAmount.toFixed(2) }}
              </p>
              <p v-if="exchangeRate" class="text-xs font-bold" :class="remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'">{{ Math.round(remainingAmount * exchangeRate).toLocaleString() }} сом</p>
            </div>
            <div v-if="remainingAmount < 0">
              <p class="text-xs text-red-600 dark:text-red-400 mb-1">Превышение</p>
              <p class="text-sm font-bold text-red-600">
                ${{ Math.abs(remainingAmount).toFixed(2) }}
              </p>
              <p v-if="exchangeRate" class="text-xs font-bold text-red-600">{{ Math.round(Math.abs(remainingAmount) * exchangeRate).toLocaleString() }} сом</p>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <button
            v-if="step >= 2"
            @click="step--"
            class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]"
          >
            Назад
          </button>
          <div v-else></div>
          <div class="flex gap-2">
            <button @click="$emit('close')" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Отмена</button>
            <button
              v-if="step === 1"
              @click="goToStep2"
              :disabled="selectedParticipants.length === 0"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Далее
            </button>
            <button
              v-if="step === 2"
              @click="goToStep3"
              :disabled="selectedProducts.length === 0"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Далее
            </button>
            <button
              v-if="step === 3"
              @click="goToStep4"
              :disabled="!selectedResponsible || (remainingAmount < 0 && (!extraPaymentForm.amount || !extraPaymentForm.payment_method_id))"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Далее
            </button>
            <button
              v-if="step === 4"
              @click="createOrder"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Image Upload Modal -->
    <ImageUploadModal
      :is-open="imageUploadModalOpen"
      title="Загрузка чека оплаты"
      directory="receipts"
      @close="imageUploadModalOpen = false"
      @uploaded="handleImageUploaded"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '@/api'
import { store_api } from '@/api'
import ImageUploadModal from '@/components/ImageUploadModal.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'created'])

// Step management
const step = ref(1)

// Participants
const participantSearch = ref('')
const availableParticipants = ref([])
const loadingParticipants = ref(false)
const selectedParticipants = ref([])
const selectedContracts = ref([])

// Products
const availableProducts = ref([])
const loadingProducts = ref(false)
const selectedProducts = ref([])
const productQuantities = ref({})

// Responsible
const responsibleSearch = ref('')
const responsibleResults = ref([])
const loadingResponsible = ref(false)
const selectedResponsible = ref(null)

// Extra Payment
const extraPaymentForm = ref({
  amount: null,
  payment_method_id: null,
  description: '',
  receipt_image: null
})
const paymentMethods = ref([])
const loadingPaymentMethods = ref(false)
const createdOrderId = ref(null)

// Image Upload Modal
const imageUploadModalOpen = ref(false)

// Exchange Rate
const exchangeRate = ref(88)

// Computed
const totalRemainingAmount = computed(() => {
  return selectedContracts.value.reduce((sum, contract) => {
    return sum + parseFloat(contract.remaining_amount || 0)
  }, 0)
})

const selectedProductsTotal = computed(() => {
  return selectedProducts.value.reduce((sum, productId) => {
    const product = availableProducts.value.find(p => p.id === productId)
    const quantity = productQuantities.value[productId] || 1
    if (product) {
      return sum + (parseFloat(product.price || 0) * quantity)
    }
    return sum
  }, 0)
})

const remainingAmount = computed(() => {
  return totalRemainingAmount.value - selectedProductsTotal.value
})

// Functions
const getStepTitle = () => {
  switch(step.value) {
    case 1: return 'Шаг 1: Выбор участников'
    case 2: return 'Шаг 2: Выбор товаров'
    case 3: return 'Шаг 3: Ответственный'
    case 4: return 'Шаг 4: Подтверждение'
    default: return 'Создание заказа'
  }
}

// Load payment methods
const loadPaymentMethods = async () => {
  loadingPaymentMethods.value = true
  try {
    const response = await api.get('enums/payment-methods?limit=100&offset=0')
    const methods = response.data.filter(m => m.active)
    paymentMethods.value = methods
  } catch (error) {
    console.error('Ошибка загрузки методов оплаты:', error)
  } finally {
    loadingPaymentMethods.value = false
  }
}

// Search participants
let participantSearchTimeout = null
const searchParticipants = async () => {
  if (participantSearchTimeout) clearTimeout(participantSearchTimeout)
  
  if (!participantSearch.value.trim()) {
    availableParticipants.value = []
    return
  }
  
  participantSearchTimeout = setTimeout(async () => {
    loadingParticipants.value = true
    try {
      const response = await api.get('participants/', {
        params: {
          page: 1,
          page_size: 20,
          search: participantSearch.value,
          contract: true
        }
      })
      availableParticipants.value = response.data.participants || []
    } catch (error) {
      console.error('Ошибка поиска участников:', error)
      availableParticipants.value = []
    } finally {
      loadingParticipants.value = false
    }
  }, 300)
}

const toggleParticipant = (participant) => {
  const hasContracts = participant.contract_status && parseFloat(participant.contract_status.total_remaining_amount) > 0
  if (!hasContracts) {
    alert('У этого участника нет активных контрактов')
    return
  }
  
  const index = selectedParticipants.value.findIndex(p => p.id === participant.id)
  if (index === -1) {
    selectedParticipants.value.push(participant)
  } else {
    selectedParticipants.value.splice(index, 1)
  }
  
  updateSelectedContracts()
}

const isParticipantSelected = (participantId) => {
  return selectedParticipants.value.some(p => p.id === participantId)
}

const updateSelectedContracts = () => {
  selectedContracts.value = selectedParticipants.value.flatMap(participant => {
    if (!participant.contracts) return []
    return participant.contracts
      .filter(c => parseFloat(c.remaining_amount) > 0)
      .map(c => ({
        id: c.id,
        participant: {
          id: participant.id,
          name: participant.name,
          lastname: participant.lastname,
          patronymic: participant.patronymic,
          personal_number: participant.personal_number
        },
        remaining_amount: c.remaining_amount,
        initial_amount: c.initial_amount
      }))
  })
}

const goToStep2 = async () => {
  if (selectedParticipants.value.length === 0) return
  updateSelectedContracts()
  step.value = 2
  await loadProducts()
}

const loadProducts = async () => {
  loadingProducts.value = true
  try {
    const response = await store_api.get('products/variants?skip=0&limit=100&is_binar=true&sort_order=asc')
    availableProducts.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
  } finally {
    loadingProducts.value = false
  }
}

const toggleProduct = (productId) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index === -1) {
    selectedProducts.value.push(productId)
    if (!productQuantities.value[productId]) {
      productQuantities.value[productId] = 1
    }
  } else {
    selectedProducts.value.splice(index, 1)
    delete productQuantities.value[productId]
  }
}

const isProductSelected = (productId) => {
  return selectedProducts.value.includes(productId)
}

const getProductQuantity = (productId) => {
  return productQuantities.value[productId] || 1
}

const updateProductQuantity = (productId, value) => {
  const numValue = value === '' ? 1 : Number(value)
  if (numValue >= 1) {
    productQuantities.value[productId] = numValue
  }
}

const getProductById = (productId) => {
  return availableProducts.value.find(p => p.id === productId)
}

const goToStep3 = () => {
  if (selectedProducts.value.length === 0) return
  step.value = 3
  
  if (selectedParticipants.value.length === 1) {
    const participant = selectedParticipants.value[0]
    selectedResponsible.value = {
      id: participant.id,
      name: participant.name,
      lastname: participant.lastname,
      patronymic: participant.patronymic,
      personal_number: participant.personal_number
    }
  }
  
  if (remainingAmount.value < 0) {
    extraPaymentForm.value.amount = Math.abs(remainingAmount.value)
  }
}

// Search responsible
let searchTimeout = null
const searchResponsible = async () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (!responsibleSearch.value.trim()) {
    responsibleResults.value = []
    return
  }
  
  searchTimeout = setTimeout(async () => {
    loadingResponsible.value = true
    try {
      const response = await api.get('participants/', {
        params: {
          page: 1,
          page_size: 20,
          search: responsibleSearch.value
        }
      })
      responsibleResults.value = response.data.participants || []
    } catch (error) {
      console.error('Ошибка поиска участников:', error)
      responsibleResults.value = []
    } finally {
      loadingResponsible.value = false
    }
  }, 300)
}

const selectResponsible = (participant) => {
  selectedResponsible.value = participant
}

const goToStep4 = () => {
  if (!selectedResponsible.value) return
  
  if (remainingAmount.value < 0) {
    if (!extraPaymentForm.value.amount || extraPaymentForm.value.amount <= 0) {
      alert('Укажите сумму доплаты')
      return
    }
    if (!extraPaymentForm.value.payment_method_id) {
      alert('Выберите метод оплаты для доплаты')
      return
    }
  }
  
  step.value = 4
}

const createOrder = async () => {
  try {
    const payload = {
      responsible_participant_id: selectedResponsible.value?.id,
      items: selectedProducts.value.map(productId => {
        const product = getProductById(productId)
        const quantity = productQuantities.value[productId] || 1
        return {
          variant_id: productId,
          quantity: quantity,
          price: product?.price || 0
        }
      }),
      contributions: selectedContracts.value.map(c => ({
        participant_id: c.participant.id,
        contract_id: c.id,
        amount: c.remaining_amount
      }))
    }
    
    const response = await api.post('orders/', payload)
    createdOrderId.value = response.data.id || response.data[0]?.id
    
    if (remainingAmount.value < 0 && extraPaymentForm.value.amount && extraPaymentForm.value.payment_method_id) {
      try {
        await api.post('orders/extra-payment', {
          order_id: createdOrderId.value,
          amount: extraPaymentForm.value.amount,
          payment_method_id: extraPaymentForm.value.payment_method_id,
          description: extraPaymentForm.value.description || '',
          receipt_image: extraPaymentForm.value.receipt_image
        })
      } catch (error) {
        console.error('Ошибка создания доплаты:', error)
      }
    }
    
    emit('created')
    emit('close')
  } catch (error) {
    console.error('Ошибка создания заказа:', error)
    alert(error.response?.data?.detail || 'Ошибка создания заказа')
  }
}

// Image Upload Functions
const openImageUpload = () => {
  imageUploadModalOpen.value = true
}

const handleImageUploaded = (imageData) => {
  extraPaymentForm.value.receipt_image = {
    id: imageData.id,
    url: imageData.url,
    filename: imageData.filename,
    size: imageData.size,
    content_type: imageData.content_type
  }
}

// Reset on close
watch(() => props.visible, (newVal) => {
  if (newVal) {
    step.value = 1
    selectedParticipants.value = []
    selectedContracts.value = []
    participantSearch.value = ''
    availableParticipants.value = []
    selectedProducts.value = []
    productQuantities.value = {}
    selectedResponsible.value = null
    responsibleSearch.value = ''
    responsibleResults.value = []
    extraPaymentForm.value = {
      amount: null,
      payment_method_id: null,
      description: '',
      receipt_image: null
    }
    createdOrderId.value = null
    exchangeRate.value = 88
    if (paymentMethods.value.length === 0) {
      loadPaymentMethods()
    }
  }
})
</script>

