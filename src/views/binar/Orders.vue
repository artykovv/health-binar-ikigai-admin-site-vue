<template>
  <div>
    <div>
      <div>
        <div class="flex items-center justify-between mb-3">
          <h1 class="dark:text-white">Заказы</h1>
        </div>

        <!-- Tabs -->
        <div class="mb-6 flex gap-2">
          <button
            @click="setTab('contracts')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'contracts'
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-gray-300 dark:hover:bg-[#4a4a52]'
            ]"
          >
            Контракты
          </button>
          <button
            @click="setTab('healthday')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === 'healthday'
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-gray-300 dark:hover:bg-[#4a4a52]'
            ]"
          >
            Health Day
          </button>
        </div>

        <!-- Загрузка -->
        <div v-if="loading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>

        <!-- Contracts Tab -->
        <div v-else-if="activeTab === 'contracts'">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold dark:text-white">Контракты</h2>
            <button 
              @click="openAddContractModal" 
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Добавить заказ
            </button>
          </div>
          
          <!-- Filter by Branch -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-white">Филиал</label>
            <select 
              v-model="selectedBranchId"
              @change="loadOrders"
              class="block w-full max-w-xs rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
            >
              <option :value="null">Все филиалы</option>
              <option 
                v-for="branch in branches" 
                :key="branch.id" 
                :value="branch.id"
              >
                {{ branch.name }}
              </option>
            </select>
          </div>
          
          <!-- Loading Orders -->
          <div v-if="loadingOrders" class="py-6 text-center">
            <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
          </div>
          
          <!-- Orders Table -->
          <div v-else class="overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
              <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ID</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Общая сумма</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата создания</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Ответственный</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                    <tr v-if="orders.length === 0">
                      <td colspan="6" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Нет заказов
                      </td>
                    </tr>
                    <tr 
                      v-for="order in orders" 
                      :key="order.id" 
                      class="hover:bg-gray-50 dark:hover:bg-[#4a4a52] cursor-pointer"
                      @click="openOrderDetailModal(order.id)"
                    >
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ order.id }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ order.branch || '-' }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ order.total_amount }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(order.created_at) }}</td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          :class="{
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': order.status === 'paid',
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': order.status === 'pending',
                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': order.status === 'cancelled'
                          }"
                        >
                          {{ getStatusName(order.status) }}
                        </span>
                      </td>
                      <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div v-if="order.responsible_participant">
                          {{ order.responsible_participant.name }} {{ order.responsible_participant.lastname }}
                          <span class="text-gray-500 dark:text-gray-400">({{ order.responsible_participant.personal_number }})</span>
                        </div>
                        <span v-else class="text-gray-500 dark:text-gray-400">-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Health Day Tab -->
        <div v-else-if="activeTab === 'healthday'">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold dark:text-white">Health Day</h2>
            <button 
              @click="openAddHealthDayModal" 
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Добавить заказ
            </button>
          </div>
          <p class="text-gray-600 dark:text-gray-400">Страница в разработке</p>
        </div>
      </div>
    </div>

    <!-- Add Contract Modal -->
    <div v-if="addContractModalVisible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="closeAddContractModal"></div>
      <div class="relative z-10 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
        <div class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-[#3f3f47]">
          <h5 class="m-0 dark:text-white">{{ getStepTitle() }}</h5>
          <button @click="closeAddContractModal" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-[#4a4a52]">✕</button>
        </div>
        <div class="p-4">
          <!-- Step 1: Participant Selection -->
          <div v-if="addContractStep === 1">
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
                  <div v-if="participant.contracts" class="text-right">
                    <p class="font-bold text-gray-900 dark:text-white">${{ participant.contracts.remaining_amount }}</p>
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
          <div v-if="addContractStep === 2">
            <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Выбранные контракты</p>
              <p class="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                Количество участников: {{ selectedContracts.length }}
              </p>
              <p class="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                Общая сумма: ${{ totalRemainingAmount.toFixed(2) }}
              </p>
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
          <div v-if="addContractStep === 3">
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
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Final Confirmation -->
          <div v-if="addContractStep === 4">
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
                </div>
                <div v-if="remainingAmount < 0">
                  <p class="text-xs text-red-600 dark:text-red-400 mb-1">Превышение</p>
                  <p class="text-sm font-bold text-red-600">
                    ${{ Math.abs(remainingAmount).toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 border-t dark:border-gray-700 sticky bottom-0 bg-white dark:bg-[#3f3f47]">
          <!-- Summary sticky at bottom for Step 2 -->
          <div v-if="addContractStep === 2" class="mb-4">
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
              </div>
              <div v-if="remainingAmount < 0">
                <p class="text-xs text-red-600 dark:text-red-400 mb-1">Превышение</p>
                <p class="text-sm font-bold text-red-600">
                  ${{ Math.abs(remainingAmount).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <button
              v-if="addContractStep >= 2"
              @click="addContractStep--"
              class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]"
            >
              Назад
            </button>
            <div v-else></div>
            <div class="flex gap-2">
              <button @click="closeAddContractModal" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Отмена</button>
              <button
                v-if="addContractStep === 1"
                @click="goToStep2"
                :disabled="selectedParticipants.length === 0"
                class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
              >
                Далее
              </button>
              <button
                v-if="addContractStep === 2"
                @click="goToStep3"
                :disabled="selectedProducts.length === 0"
                class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
              >
                Далее
              </button>
              <button
                v-if="addContractStep === 3"
                @click="goToStep4"
                :disabled="!selectedResponsible || (remainingAmount < 0 && (!extraPaymentForm.amount || !extraPaymentForm.payment_method_id))"
                class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
              >
                Далее
              </button>
              <button
                v-if="addContractStep === 4"
                @click="createOrder"
                class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <OrderDetailModal
      :visible="orderDetailModalVisible"
      :order-id="selectedOrderId"
      @close="closeOrderDetailModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import { store_api } from '@/api'
import OrderDetailModal from '@/components/OrderDetailModal.vue'

const route = useRoute()
const router = useRouter()

// Реактивные данные
const loading = ref(false)

// Инициализируем активную вкладку из URL query параметра
const activeTab = ref(route.query.tab || 'contracts')

// Заказы для вкладки Контракты
const orders = ref([])
const loadingOrders = ref(false)

// Филиалы
const branches = ref([])
const selectedBranchId = ref(null)

// Модальное окно деталей заказа
const orderDetailModalVisible = ref(false)
const selectedOrderId = ref(null)

// Модальное окно добавления контракта
const addContractModalVisible = ref(false)
const addContractStep = ref(1)
const availableContracts = ref([])
const loadingContracts = ref(false)
const selectedContracts = ref([])
// Поиск участников на Step 1
const participantSearch = ref('')
const availableParticipants = ref([])
const loadingParticipants = ref(false)
const selectedParticipants = ref([])
const availableProducts = ref([])
const loadingProducts = ref(false)
const selectedProducts = ref([])
const productQuantities = ref({}) // { product_id: quantity }
const responsibleSearch = ref('')
const responsibleResults = ref([])
const loadingResponsible = ref(false)
const selectedResponsible = ref(null)

// Доплата
const extraPaymentForm = ref({
  amount: null,
  payment_method_id: null,
  description: ''
})
const paymentMethods = ref([])
const loadingPaymentMethods = ref(false)
const createdOrderId = ref(null) // Храним ID созданного заказа для доплаты

// Установка вкладки с сохранением в URL
const setTab = (tab) => {
  activeTab.value = tab
  router.push({ 
    path: route.path, 
    query: { ...route.query, tab: tab } 
  })
}

// Отслеживание изменений в URL для синхронизации с состоянием
watch(() => route.query.tab, (newTab) => {
  if (newTab && newTab !== activeTab.value) {
    activeTab.value = newTab
  }
})

// Отслеживание изменений активной вкладки для загрузки данных
watch(activeTab, (newTab) => {
  if (newTab === 'contracts') {
    loadOrders()
  }
})

// Функции для модального окна добавления контракта
const getStepTitle = () => {
  switch(addContractStep.value) {
    case 1: return 'Шаг 1: Выбор участников'
    case 2: return 'Шаг 2: Выбор товаров'
    case 3: return 'Шаг 3: Ответственный'
    case 4: return 'Шаг 4: Подтверждение'
    default: return 'Создание заказа'
  }
}

const openAddContractModal = async () => {
  addContractModalVisible.value = true
  addContractStep.value = 1
  selectedContracts.value = []
  selectedParticipants.value = []
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
    description: ''
  }
  createdOrderId.value = null
  // Загружаем методы оплаты при открытии модального окна
  if (paymentMethods.value.length === 0) {
    await loadPaymentMethods()
  }
}

const closeAddContractModal = () => {
  addContractModalVisible.value = false
  addContractStep.value = 1
  selectedContracts.value = []
  selectedParticipants.value = []
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
    description: ''
  }
  createdOrderId.value = null
}

// Загрузка методов оплаты
const loadPaymentMethods = async () => {
  loadingPaymentMethods.value = true
  try {
    const response = await api.get('enums/payment-methods?limit=100&offset=0')
    const methods = response.data.filter(m => m.active)
    paymentMethods.value = methods
    // Создаем map для быстрого доступа к названиям
    const map = {}
    methods.forEach(method => {
      map[method.id] = method.name
    })
    paymentMethodsMap.value = { ...paymentMethodsMap.value, ...map }
  } catch (error) {
    console.error('Ошибка загрузки методов оплаты:', error)
  } finally {
    loadingPaymentMethods.value = false
  }
}

// Поиск участников
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
  // Проверяем, есть ли у участника контракт
  if (!participant.contracts) {
    alert('У этого участника нет контракта')
    return
  }
  
  const index = selectedParticipants.value.findIndex(p => p.id === participant.id)
  if (index === -1) {
    selectedParticipants.value.push(participant)
  } else {
    selectedParticipants.value.splice(index, 1)
  }
  
  // Обновляем selectedContracts на основе выбранных участников
  updateSelectedContracts()
}

const isParticipantSelected = (participantId) => {
  return selectedParticipants.value.some(p => p.id === participantId)
}

// Обновление selectedContracts на основе выбранных участников
const updateSelectedContracts = () => {
  selectedContracts.value = selectedParticipants.value
    .filter(p => p.contracts)
    .map(participant => ({
      id: participant.contracts.id,
      participant: {
        id: participant.id,
        name: participant.name,
        lastname: participant.lastname,
        patronymic: participant.patronymic,
        personal_number: participant.personal_number
      },
      remaining_amount: participant.contracts.remaining_amount,
      initial_amount: participant.contracts.initial_amount
    }))
}

const goToStep2 = async () => {
  if (selectedParticipants.value.length === 0) return
  // Убеждаемся, что selectedContracts обновлен
  updateSelectedContracts()
  addContractStep.value = 2
  await loadProducts()
}

const goToStep3 = () => {
  if (selectedProducts.value.length === 0) return
  addContractStep.value = 3
  
  // Если выбран только один участник, автоматически устанавливаем его как ответственного
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
  
  // Автоматически устанавливаем сумму доплаты, если есть превышение
  if (remainingAmount.value < 0) {
    extraPaymentForm.value.amount = Math.abs(remainingAmount.value)
  }
}

const goToStep4 = () => {
  if (!selectedResponsible.value) return
  
  // Проверяем форму доплаты, если есть превышение
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
  
  addContractStep.value = 4
}

const getProductById = (productId) => {
  return availableProducts.value.find(p => p.id === productId)
}

// Search responsible person
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

const loadProducts = async () => {
  loadingProducts.value = true
  try {
    const response = await store_api.get('products/variants?skip=0&limit=100')
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
    // Инициализируем количество = 1 при добавлении
    if (!productQuantities.value[productId]) {
      productQuantities.value[productId] = 1
    }
  } else {
    selectedProducts.value.splice(index, 1)
    // Удаляем количество при снятии выбора
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

// Computed для подсчета общей суммы
const totalRemainingAmount = computed(() => {
  return selectedContracts.value.reduce((sum, contract) => {
    return sum + parseFloat(contract.remaining_amount || 0)
  }, 0)
})

// Computed для подсчета общей суммы выбранных товаров (с учетом количества)
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

// Computed для расчета остатка
const remainingAmount = computed(() => {
  return totalRemainingAmount.value - selectedProductsTotal.value
})

// Computed для подсчета общей суммы доплат
const totalExtraPaymentAmount = computed(() => {
  return extraPayments.value.reduce((sum, payment) => {
    return sum + parseFloat(payment.amount || 0)
  }, 0)
})

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
    
    // Если есть превышение, отправляем один запрос на доплату с общей суммой
    if (remainingAmount.value < 0 && extraPaymentForm.value.amount && extraPaymentForm.value.payment_method_id) {
      try {
        await api.post('orders/extra-payment', {
          order_id: createdOrderId.value,
          amount: extraPaymentForm.value.amount,
          payment_method_id: extraPaymentForm.value.payment_method_id,
          description: extraPaymentForm.value.description || ''
        })
      } catch (error) {
        console.error('Ошибка создания доплаты:', error)
        // TODO: Show error message to user
      }
    }
    
    // Close modal and refresh
    closeAddContractModal()
    // Refresh orders list
    await loadOrders()
    console.log('Order created successfully')
  } catch (error) {
    console.error('Ошибка создания заказа:', error)
    // TODO: Show error message to user
  }
}

// Загрузка филиалов
const loadBranches = async () => {
  try {
    const response = await api.get('branches/')
    branches.value = response.data.filter(b => b.is_active) || []
  } catch (error) {
    console.error('Ошибка загрузки филиалов:', error)
    branches.value = []
  }
}

// Загрузка заказов
const loadOrders = async () => {
  loadingOrders.value = true
  try {
    const params = {
      skip: 0,
      limit: 100
    }
    
    if (selectedBranchId.value) {
      params.branch_id = selectedBranchId.value
    }
    
    const response = await api.get('orders/', { params })
    orders.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
  } finally {
    loadingOrders.value = false
  }
}

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Получение названия статуса
const getStatusName = (status) => {
  const statusMap = {
    'paid': 'Оплачен',
    'pending': 'Ожидание',
    'cancelled': 'Отменен'
  }
  return statusMap[status] || status
}

// Открытие модального окна деталей заказа
const openOrderDetailModal = (orderId) => {
  selectedOrderId.value = orderId
  orderDetailModalVisible.value = true
}

// Закрытие модального окна деталей заказа
const closeOrderDetailModal = () => {
  orderDetailModalVisible.value = false
  selectedOrderId.value = null
}

const openAddHealthDayModal = () => {
  console.log('Open add health day modal')
  // TODO: Implement
}

onMounted(async () => {
  // Загружаем филиалы
  await loadBranches()
  
  // Load data based on activeTab
  if (activeTab.value === 'contracts') {
    await loadOrders()
  }
  
  // Проверяем наличие orderId в query параметрах для автоматического открытия модального окна
  if (route.query.orderId) {
    const orderId = Number(route.query.orderId)
    if (orderId) {
      openOrderDetailModal(orderId)
      // Удаляем параметр из URL после открытия модального окна
      router.replace({ query: { ...route.query, orderId: undefined } })
    }
  }
})

// Отслеживание изменений query параметра orderId
watch(() => route.query.orderId, (newOrderId) => {
  if (newOrderId && !orderDetailModalVisible.value) {
    const orderId = Number(newOrderId)
    if (orderId) {
      openOrderDetailModal(orderId)
      // Удаляем параметр из URL после открытия модального окна
      router.replace({ query: { ...route.query, orderId: undefined } })
    }
  }
})
</script>

<style scoped>
</style>

