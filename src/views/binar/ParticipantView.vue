<template>
  <div class="participant-view">
    <div>
      <div>
        <div class="flex items-center justify-between mb-3">
          <h1 class="dark:text-white">Просмотр участника</h1>
          <button @click="$router.go(-1)" class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">Назад</button>
        </div>
        
        <!-- Tailwind Notification -->
        <div v-if="notice.visible" class="fixed top-4 right-4 z-50">
          <div :class="['rounded-md px-4 py-2 text-sm shadow',
            notice.type === 'success' ? 'bg-green-100 text-green-800' :
            notice.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800',
            'dark:bg-[#3f3f47] dark:text-white']">
            {{ notice.message }}
          </div>
        </div>
        
        <!-- Pay Bonus Modal -->
        <div v-if="payModal.visible" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/40" @click="closePayModal"></div>
          <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
            <div class="px-4 py-3 border-b dark:border-gray-700">
              <h5 class="m-0 dark:text-white">Выдать бонус</h5>
            </div>
            <div class="p-4">
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Тип бонуса:</label>
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ payModal.typeLabel }}</p>
              </div>
                    <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Сумма:</label>
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ payModal.amount }}</p>
                    </div>
              <p class="text-sm text-gray-700 dark:text-white">Подтвердите выдачу бонуса участнику.</p>
                    </div>
            <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
              <button @click="closePayModal" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Отмена</button>
              <button @click="confirmPay" :disabled="paying"
                class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-white text-sm hover:bg-green-700 disabled:opacity-40">
                <span v-if="paying" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
                Выдать
              </button>
                    </div>
                    </div>
                  </div>

        <!-- Confirm Delete Modal -->
        <div v-if="confirm.visible" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/40" @click="closeConfirm"></div>
          <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
            <div class="px-4 py-3 border-b dark:border-gray-700">
              <h5 class="m-0 dark:text-white">Подтверждение</h5>
                    </div>
            <div class="p-4 text-sm text-gray-700 dark:text-white">
              <p class="mb-2">Удалить участника? Это действие необратимо.</p>
              <p>Подтвердите действие.</p>
                    </div>
            <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
              <button @click="closeConfirm" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Отмена</button>
              <button @click="confirmDelete" :disabled="deleting"
                class="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-white text-sm hover:bg-red-700 disabled:opacity-40 dark:hover:bg-[#4a4a52]">
                <span v-if="deleting" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
                Удалить
              </button>
                    </div>
                  </div>
                </div>
        
        <!-- Create Contract Modal -->
        <div v-if="createContractModalVisible" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/40" @click="closeCreateContractModal"></div>
          <div class="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
            <div class="px-4 py-3 border-b dark:border-gray-700">
              <h5 class="m-0 dark:text-white">Создать контракт</h5>
              <button @click="closeCreateContractModal" class="absolute top-3 right-3 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-[#4a4a52]">✕</button>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Сумма контракта *</label>
                  <input 
                    v-model.number="contractForm.initial_amount" 
                    type="number" 
                    step="0.01"
                    min="0"
                    required
                    class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Метод оплаты *</label>
                  <select 
                    v-model.number="contractForm.payment_method_id" 
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
                  <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Дата оплаты</label>
                  <input 
                    v-model="contractForm.paid_at" 
                    type="datetime-local"
                    class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Описание</label>
                  <textarea 
                    v-model="contractForm.description" 
                    rows="3"
                    class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white"
                    placeholder="Введите описание контракта (необязательно)"
                  ></textarea>
                </div>
                
                <div v-if="contractError" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
                  {{ contractError }}
                </div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-2 px-4 py-3 border-t dark:border-gray-700">
              <button @click="closeCreateContractModal" class="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-800 hover:bg-gray-200 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">Отмена</button>
              <button @click="createContract" :disabled="!contractForm.initial_amount || !contractForm.payment_method_id || submittingContract"
                class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-white text-sm hover:bg-green-700 disabled:opacity-40 dark:bg-green-800 dark:hover:bg-green-900">
                <span v-if="submittingContract" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white"></span>
                {{ submittingContract ? 'Создание...' : 'Создать' }}
              </button>
            </div>
          </div>
        </div>
                
        <!-- Загрузка -->
        <div v-if="loading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        
        <!-- Данные участника -->
        <div v-else-if="participant" class="grid md:grid-cols-12 gap-4">
          <div class="md:col-span-8">
            <!-- Информация об участнике и Данные структуры рядом -->
            <div class="mb-3 grid md:grid-cols-2 gap-4">
              <!-- Информация об участнике -->
              <div class="bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
                <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                  <h5 class="m-0 dark:text-white">Информация об участнике</h5>
              </div>
                <div class="p-4">
                  <div class="overflow-x-auto">
                    <table class="min-w-full">
                      <tbody>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Персональный номер:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.personal_number }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">ФИО:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.lastname }} {{ participant.name }} {{ participant.patronymic }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Email:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.email }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Код:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.code }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Филиал:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.branch?.name || 'Неизвестно' }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Статус регистрации:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.registered ? 'Зарегистрирован' : 'Ожидает' }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Активен:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.is_active ? 'Да' : 'Нет' }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Дата создания:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ formatDate(participant.created_at) }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Дата регистрации:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ formatDate(participant.register_at) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                    </div>
                  </div>

              <!-- Данные структуры -->
              <div class="bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
                <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                  <h5 class="m-0 dark:text-white">Данные структуры</h5>
                    </div>
                <div class="p-4">
                  <div class="overflow-x-auto">
                    <table class="min-w-full">
                      <tbody>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Цикл:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ structureData?.cycle_number || 'Не указано' }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Этап:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ structureData?.stage_number || 'Не указано' }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Дата начала этапа:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ formatDate(structureData?.stage_start_date) }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Общее количество:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ structureData?.total_count || 0 }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Лево:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ (structureData?.total_left || 0) - (structureData?.base_left || 0) }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Право:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ (structureData?.total_right || 0) - (structureData?.base_right || 0) }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Общий структурный:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ bonusData?.total_structure || 0 }}</td>
                        </tr>
                        <tr>
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Общий спонсорский:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ bonusData?.total_sponsor || 0 }}</td>
                        </tr>
                        <tr v-if="bonusData?.last_updated">
                          <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Последнее обновление:</td>
                          <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ formatDate(bonusData.last_updated) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Паспортная информация -->
            <div class="mb-3 bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                <h5 class="m-0 dark:text-white">Дополнительная информация</h5>
              </div>
              <div class="p-4">
                <div class="overflow-x-auto">
                  <table class="min-w-full">
                    <tbody>
                      <tr>
                        <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">ПИН:</td>
                        <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.passport_info?.pin || 'Не указано' }}</td>
                      </tr>
                      <tr>
                        <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Номер паспорта:</td>
                        <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.passport_info?.passport_id || 'Не указано' }}</td>
                      </tr>
                      <tr>
                        <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Кем выдан:</td>
                        <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.passport_info?.passport_issuer || 'Не указано' }}</td>
                      </tr>
                      <tr>
                        <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Дата выдачи:</td>
                        <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ formatSimpleDate(participant.passport_info?.passport_issue_date) }}</td>
                      </tr>
                      <tr>
                        <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Дата рождения:</td>
                        <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ formatSimpleDate(participant.passport_info?.date_birth) }}</td>
                      </tr>
                      <tr>
                        <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Телефон:</td>
                        <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.passport_info?.phone_number || 'Не указано' }}</td>
                      </tr>
                      <tr>
                        <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Банк:</td>
                        <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.passport_info?.bank || 'Не указано' }}</td>
                      </tr>
                      <tr>
                        <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">ИП/ИНН:</td>
                        <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.passport_info?.ip_inn ? 'Да' : 'Нет' }}</td>
                      </tr>
                      <tr>
                        <td class="py-2 pr-4 text-sm text-gray-700 dark:text-white whitespace-nowrap">Пенсионер:</td>
                        <td class="py-2 text-sm font-bold text-gray-900 dark:text-white">{{ participant.passport_info?.pensioner ? 'Да' : 'Нет' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
                    </div>

            <!-- Бонусы участника и История -->
            <div class="bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b dark:bg-[#3f3f47] dark:border-gray-700">
                <div class="border-b border-gray-200 dark:border-gray-700">
                  <div class="flex gap-2 relative" ref="bonusTabsContainer">
                    <button 
                      type="button"
                      :class="[
                        'px-3 py-2 -mb-px text-sm transition border-b-2',
                        activeBonusTab === 'history'
                          ? 'font-semibold text-gray-900 border-gray-900 dark:text-white dark:border-white'
                          : 'text-gray-500 hover:text-gray-900 border-transparent dark:text-white/70 dark:hover:text-white'
                      ]"
                      @click="setActiveBonusTab('history')"
                      :ref="el => setBonusTabRef('history', el)"
                    >
                      История закрытия этапов
                    </button>
                    <button 
                      type="button"
                      :class="[
                        'px-3 py-2 -mb-px text-sm transition border-b-2',
                        activeBonusTab === 'structural'
                          ? 'font-semibold text-gray-900 border-gray-900 dark:text-white dark:border-white'
                          : 'text-gray-500 hover:text-gray-900 border-transparent dark:text-white/70 dark:hover:text-white'
                      ]"
                      @click="setActiveBonusTab('structural')"
                      :ref="el => setBonusTabRef('structural', el)"
                    >
                      Структурный
                    </button>
                    <button 
                      type="button"
                      :class="[
                        'px-3 py-2 -mb-px text-sm transition border-b-2',
                        activeBonusTab === 'sponsor'
                          ? 'font-semibold text-gray-900 border-gray-900 dark:text-white dark:border-white'
                          : 'text-gray-500 hover:text-gray-900 border-transparent dark:text-white/70 dark:hover:text-white'
                      ]"
                      @click="setActiveBonusTab('sponsor')"
                      :ref="el => setBonusTabRef('sponsor', el)"
                    >
                      Спонсорский
                    </button>
                    <button 
                      type="button"
                      :class="[
                        'px-3 py-2 -mb-px text-sm transition border-b-2',
                        activeBonusTab === 'gifts'
                          ? 'font-semibold text-gray-900 border-gray-900 dark:text-white dark:border-white'
                          : 'text-gray-500 hover:text-gray-900 border-transparent dark:text-white/70 dark:hover:text-white'
                      ]"
                      @click="setActiveBonusTab('gifts')"
                      :ref="el => setBonusTabRef('gifts', el)"
                    >
                      Подарки
                    </button>
                    <button 
                      type="button"
                      :class="[
                        'px-3 py-2 -mb-px text-sm transition border-b-2',
                        activeBonusTab === 'health_day'
                          ? 'font-semibold text-gray-900 border-gray-900 dark:text-white dark:border-white'
                          : 'text-gray-500 hover:text-gray-900 border-transparent dark:text-white/70 dark:hover:text-white'
                      ]"
                      @click="setActiveBonusTab('health_day')"
                      :ref="el => setBonusTabRef('health_day', el)"
                    >
                      Health Day
                    </button>
                    <button 
                      type="button"
                      :class="[
                        'px-3 py-2 -mb-px text-sm transition border-b-2',
                        activeBonusTab === 'multibonus'
                          ? 'font-semibold text-gray-900 border-gray-900 dark:text-white dark:border-white'
                          : 'text-gray-500 hover:text-gray-900 border-transparent dark:text-white/70 dark:hover:text-white'
                      ]"
                      @click="setActiveBonusTab('multibonus')"
                      :ref="el => setBonusTabRef('multibonus', el)"
                    >
                      Мультибонус
                    </button>
                  </div>
                </div>
                    </div>
              
              <div class="p-4">
                <!-- История закрытия этапов -->
                <div v-show="activeBonusTab === 'history'">
                  <div v-if="stageHistory.length > 0" class="overflow-x-auto">
                    <div class="inline-block min-w-full align-middle">
                      <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                            <tr>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата закрытия</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата открытия</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Время ушло</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Левая</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Правая</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                            <tr v-for="stage in stageHistory" :key="stage.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ stage.cycle_number }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ stage.stage_number }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(stage.closed_at) }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(stage.start_at) }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDuration(stage.start_at, stage.closed_at) }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ stage.effective_left}}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ stage.effective_right }}</td>
                            </tr>
                          </tbody>
                        </table>
                  </div>
                    </div>
                  </div>
                  <div v-else class="text-center text-gray-500 dark:text-white">
                    <p>История закрытия этапов отсутствует</p>
              </div>
            </div>

                <!-- Структурный бонус -->
                <div v-show="activeBonusTab === 'structural'">
                  <div v-if="structuralBonusesLoading" class="py-6 text-center">
                    <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
              </div>
                  <div v-else-if="structuralBonusesList.length > 0" class="overflow-x-auto">
                    <div class="inline-block min-w-full align-middle">
                      <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                            <tr>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата выдачи</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                            <tr v-for="bonus in structuralBonusesList" :key="bonus.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ bonus.amount }}</strong></td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.cycle_number }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.stage_number }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.received_at) }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm">
                                <span :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' + getStatusBadgeClass(bonus.status)">
                                  {{ getStatusText(bonus.status) }}
                                </span>
                              </td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.paid_datetime) }}</td>
                            </tr>
                          </tbody>
                        </table>
                    </div>
                    </div>
                  </div>
                  <div v-else class="text-center text-gray-500 dark:text-white">
                    <p>Структурные бонусы отсутствуют</p>
                  </div>
                </div>

                <!-- Спонсорский бонус -->
                <div v-show="activeBonusTab === 'sponsor'">
                  <div v-if="sponsorBonusesLoading" class="py-6 text-center">
                    <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
                    </div>
                  <div v-else-if="sponsorBonusesList.length > 0" class="overflow-x-auto">
                    <div class="inline-block min-w-full align-middle">
                      <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                            <tr>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">От</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата выдачи</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                            <tr v-for="bonus in sponsorBonusesList" :key="bonus.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                                <router-link :to="`/binar/participant/${bonus.from_participant_id}`" class="hover:underline">
                                  {{ bonus.from_participant_fio || '-' }}
                                </router-link>
                              </td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ bonus.amount }}</strong></td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.cycle_number }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.stage_number }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.received_at) }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm">
                                <span :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' + getStatusBadgeClass(bonus.status)">
                                  {{ getStatusText(bonus.status) }}
                                </span>
                              </td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.paid_datetime) }}</td>
                            </tr>
                          </tbody>
                        </table>
                    </div>
                    </div>
                  </div>
                  <div v-else class="text-center text-gray-500 dark:text-white">
                    <p>Спонсорские бонусы отсутствуют</p>
                  </div>
                </div>
                
                <!-- Подарки -->
                <div v-show="activeBonusTab === 'gifts'">
                  <div v-if="giftsLoading" class="py-6 text-center">
                    <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
                  </div>
                  <div v-else-if="giftsList.length > 0" class="overflow-x-auto">
                    <div class="inline-block min-w-full align-middle">
                      <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                            <tr>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Подарок</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата выдачи</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                            <tr v-for="gift in giftsList" :key="gift.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ gift.reward }}</strong></td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ gift.cycle_number }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ gift.stage_number }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(gift.received_at) }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm">
                                <button 
                                  v-if="!gift.status || gift.status === 'pending'"
                                  @click="openPayModal(gift, 'gifts')"
                                  :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-80 ' + getStatusBadgeClass(gift.status)">
                                  {{ getStatusText(gift.status) }}
                                </button>
                                <span v-else :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' + getStatusBadgeClass(gift.status)">
                                  {{ getStatusText(gift.status) }}
                                </span>
                              </td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(gift.paid_datetime) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center text-gray-500 dark:text-white">
                    <p>Подарки отсутствуют</p>
                  </div>
                </div>

                <!-- Health Day -->
                <div v-show="activeBonusTab === 'health_day'">
                  <div v-if="healthDayLoading" class="py-6 text-center">
                    <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
                  </div>
                  <div v-else-if="healthDayList.length > 0" class="overflow-x-auto">
                    <div class="inline-block min-w-full align-middle">
                      <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                            <tr>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">От</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Глубина</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата выдачи</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                            <tr v-for="bonus in healthDayList" :key="bonus.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                                <router-link :to="`/binar/participant/${bonus.from_participant_id}`" class="hover:underline">
                                  {{ bonus.from_participant_fio || '-' }}
                                </router-link>
                              </td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ bonus.amount }}</strong></td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.depth }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.received_at) }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm">
                                <button 
                                  v-if="!bonus.status || bonus.status === 'pending'"
                                  @click="openPayModal(bonus, 'health_day')"
                                  :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-80 ' + getStatusBadgeClass(bonus.status)">
                                  {{ getStatusText(bonus.status) }}
                                </button>
                                <span v-else :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' + getStatusBadgeClass(bonus.status)">
                                  {{ getStatusText(bonus.status) }}
                                </span>
                              </td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.paid_datetime) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center text-gray-500 dark:text-white">
                    <p>Health Day бонусы отсутствуют</p>
              </div>
            </div>

                <!-- Мультибонус -->
                <div v-show="activeBonusTab === 'multibonus'">
                  <div v-if="multibonusesLoading" class="py-6 text-center">
                    <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
              </div>
                  <div v-else-if="multibonusesList.length > 0" class="overflow-x-auto">
                    <div class="inline-block min-w-full align-middle">
                      <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                            <tr>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата выдачи</th>
                      </tr>
                    </thead>
                          <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                            <tr v-for="bonus in multibonusesList" :key="bonus.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ bonus.reward }}</strong></td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.cycle_number }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.stage_number }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.received_at) }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm">
                                <button 
                                  v-if="!bonus.status || bonus.status === 'pending'"
                                  @click="openPayModal(bonus, 'multibonus')"
                                  :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-80 ' + getStatusBadgeClass(bonus.status)">
                                  {{ getStatusText(bonus.status) }}
                                </button>
                                <span v-else :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' + getStatusBadgeClass(bonus.status)">
                                  {{ getStatusText(bonus.status) }}
                                </span>
                              </td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.paid_datetime) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                    </div>
                  </div>
                  <div v-else class="text-center text-gray-500 dark:text-white">
                    <p>Мультибонусы отсутствуют</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="md:col-span-4">
            <div class="bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                <h5 class="m-0 dark:text-white">Действия</h5>
              </div>
              <div class="p-4">
                <div class="grid gap-2">
                  <router-link v-if="participant.registered" :to="`/binar/structure/${participant.id}`" class="inline-flex items-center justify-center rounded-md bg-success px-3 py-2 text-white text-sm hover:bg-gray-900">Структура</router-link>
                  <router-link v-if="participant.registered" :to="`/binar/sponsored/${participant.id}`" class="inline-flex items-center justify-center rounded-md bg-slate-600 px-3 py-2 text-white text-sm hover:bg-gray-900">Личники</router-link>
                  <router-link v-if="!participant.registered" :to="`/binar/add-to-structure/${participant.id}`" class="inline-flex items-center justify-center rounded-md bg-success px-3 py-2 text-white text-sm hover:bg-gray-900">+ Cтруктуру</router-link>
                  <router-link :to="`/binar/user-edit/${participant.id}`" class="inline-flex items-center justify-center rounded-md bg-orange-600 px-3 py-2 text-white text-sm hover:bg-gray-900">Изменить</router-link>
                  <button v-if="!participant.registered" @click="openConfirm(participant.id)" class="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-white text-sm hover:bg-red-700">Удалить</button>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg ring-1 ring-gray-200 mt-3 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                <h5 class="m-0 dark:text-white">Спонсор</h5>
              </div>
              <div class="p-4">
                <p class="text-sm text-gray-900 dark:text-white">{{ participant.sponsor?.lastname }} {{ participant.sponsor?.name }} {{ participant.sponsor?.patronymic }}</p>
                <p class="text-sm text-gray-900 dark:text-white"><a :href="`/binar/participant/${participant.sponsor?.id}`" class="text-blue-600 hover:underline dark:text-blue-300">{{ participant.sponsor?.personal_number }}</a></p>
              </div>
            </div>
            <div class="bg-white rounded-lg ring-1 ring-gray-200 mt-3 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                <h5 class="m-0 dark:text-white">Наставник</h5>
              </div>
              <div class="p-4">
                <p class="text-sm text-gray-900 dark:text-white">{{ participant.mentor?.lastname }} {{ participant.mentor?.name }} {{ participant.mentor?.patronymic }}</p>
                <p class="text-sm text-gray-900 dark:text-white"><a :href="`/binar/participant/${participant.mentor?.id}`" class="text-blue-600 hover:underline dark:text-blue-300">{{ participant.mentor?.personal_number }}</a></p>
              </div>
            </div>

            <div class="bg-white rounded-lg ring-1 ring-gray-200 mt-3 dark:bg-[#3f3f47] dark:ring-gray-700 dark:text-white">
              <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
                <h5 class="m-0 dark:text-white">Контракт</h5>
              </div>
              <div class="p-4">
                <div v-if="contractLoading" class="text-center py-4">
                  <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
                </div>
                <div v-else-if="contract" class="text-sm text-gray-900 dark:text-white space-y-4">
                  <div class="space-y-2">
                    <div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">Остаток:</span>
                      <p class="font-semibold mt-1">${{ contract.remaining_amount }}</p>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">Создан:</span>
                      <p class="font-semibold mt-1">{{ formatDate(contract.created_at) }}</p>
                    </div>
                  </div>
                  
                  <!-- Таблица использования контракта -->
                  <div v-if="contractUsagesLoading" class="text-center py-4">
                    <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
                  </div>
                  <div v-else-if="contractUsages && contractUsages.length > 0" class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                      <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                        <tr>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">#Заказ</th>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Использованная сумма</th>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата создания</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                        <tr v-for="usage in contractUsages" :key="usage.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                          <td class="px-3 py-2 whitespace-nowrap text-sm">
                            <button 
                              @click="openOrderModal(usage.order_id)"
                              class="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-300 dark:hover:text-blue-400 font-medium"
                            >
                              #{{ usage.order_id }}
                            </button>
                          </td>
                          <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">${{ usage.amount_used }}</td>
                          <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(usage.created_at) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-else class="text-center py-2 text-xs text-gray-500 dark:text-gray-400">
                    Нет данных об использовании
                  </div>
                </div>
                <div v-else class="flex items-center justify-center py-4">
                  <button 
                    @click="openCreateContractModal" 
                    class="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  >
                    <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <!-- Ошибка -->
        <div v-else class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-[#3f3f47] dark:border-gray-700 dark:text-white">
          Участник не найден
        </div>
      </div>
    </div>
    
    <!-- Order Detail Modal -->
    <OrderDetailModal
      :visible="orderDetailModalVisible"
      :order-id="selectedOrderId"
      @close="closeOrderModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'
import { store_api } from '@/api'
import OrderDetailModal from '@/components/OrderDetailModal.vue'

const router = useRouter()

// Реактивные данные
const participant = ref(null)
const loading = ref(false)
const bonusData = ref(null)
const structureData = ref(null)
const stageHistory = ref([])
const contract = ref(null)
const contractLoading = ref(false)
const contractUsages = ref([])
const contractUsagesLoading = ref(false)

// Модальное окно заказа
const orderDetailModalVisible = ref(false)
const selectedOrderId = ref(null)

// Модальное окно создания контракта
const createContractModalVisible = ref(false)
const contractForm = ref({
  initial_amount: 230,
  paid_at: '',
  payment_method_id: null,
  description: ''
})
const paymentMethods = ref([])
const loadingPaymentMethods = ref(false)
const submittingContract = ref(false)
const contractError = ref('')

// Уведомления
const notice = ref({ visible: false, type: 'info', message: '' })
const showNotice = (message, type = 'info') => {
  notice.value = { visible: true, type, message }
  setTimeout(() => { notice.value.visible = false }, 2500)
}

// Подтверждение удаления
const confirm = ref({ visible: false, id: null })
const deleting = ref(false)
const openConfirm = (id) => { confirm.value = { visible: true, id } }
const closeConfirm = () => { confirm.value = { visible: false, id: null } }
const confirmDelete = async () => {
  if (!confirm.value.id) return
  deleting.value = true
  await deleteParticipant(confirm.value.id)
  deleting.value = false
  closeConfirm()
}

// Модальное окно выдачи бонуса
const payModal = ref({ 
  visible: false, 
  bonusId: null, 
  bonusType: '', 
  typeLabel: '',
  amount: 0
})
const paying = ref(false)

const openPayModal = (bonus, type) => {
  const typeLabels = {
    'structural': 'Структурный бонус',
    'sponsor': 'Спонсорский бонус',
    'gifts': 'Подарок',
    'health_day': 'Health Day',
    'multibonus': 'Мультибонус'
  }
  
  payModal.value = {
    visible: true,
    bonusId: bonus.id,
    bonusType: type,
    typeLabel: typeLabels[type] || type,
    amount: bonus.amount || bonus.reward || 0
  }
}

const closePayModal = () => {
  payModal.value = { visible: false, bonusId: null, bonusType: '', typeLabel: '', amount: 0 }
}

const confirmPay = async () => {
  if (!payModal.value.bonusId || !payModal.value.bonusType) return
  paying.value = true
  
  try {
    const typeMap = {
      'structural': 'structure',
      'sponsor': 'sponsor',
      'gifts': 'gift',
      'health_day': 'health',
      'multibonus': 'multi'
    }
    const apiType = typeMap[payModal.value.bonusType]
    
    await api.put(`bonuses/pay/batch`, {
      bonuses: [
        {
          bonus_type: apiType,
          bonus_id: payModal.value.bonusId
        }
      ]
    })
    
    showNotice('Бонус успешно выдан', 'success')
    closePayModal()
    
    // Перезагружаем данные для текущей вкладки
    if (activeBonusTab.value === 'structural') {
      await loadStructuralBonuses()
    } else if (activeBonusTab.value === 'sponsor') {
      await loadSponsorBonuses()
    } else if (activeBonusTab.value === 'gifts') {
      await loadGifts()
    } else if (activeBonusTab.value === 'health_day') {
      await loadHealthDay()
    } else if (activeBonusTab.value === 'multibonus') {
      await loadMultibonuses()
    }
  } catch (error) {
    console.error('Ошибка выдачи бонуса:', error)
    showNotice('Не удалось выдать бонус: ' + (error.response?.data?.detail || error.message), 'error')
  } finally {
    paying.value = false
  }
}

// Табы бонусов
const activeBonusTab = ref('history')
const bonusTabsContainer = ref(null)
const bonusTabRefs = new Map()
function setBonusTabRef(key, el) {
  if (el) bonusTabRefs.set(key, el)
}

// Данные бонусов
const structuralBonusesList = ref([])
const structuralBonusesLoading = ref(false)
const sponsorBonusesList = ref([])
const sponsorBonusesLoading = ref(false)
const multibonusesList = ref([])
const multibonusesLoading = ref(false)
const giftsList = ref([])
const giftsLoading = ref(false)
const healthDayList = ref([])
const healthDayLoading = ref(false)

// API базовый URL
// centralized API client is used

// Получение ID из маршрута
const route = useRoute()
const participantId = route.params.id

// Загрузка данных участника
const loadParticipant = async () => {
  loading.value = true
  try {
    const response = await api.get(`participants/${participantId}`)
    participant.value = response.data
    // Навигационная активность теперь вычисляется по маршруту, глобальный ключ не используется
  } catch (error) {
    console.error('Ошибка загрузки участника:', error)
    participant.value = null
  } finally {
    loading.value = false
  }
}

// Загрузка данных о бонусах
const loadBonusData = async () => {
  try {
    const response = await api.get(`data/participants_bonus/${participantId}`)
    bonusData.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки данных о бонусах:', error)
    bonusData.value = null
  }
}

// Загрузка данных структуры
const loadStructureData = async () => {
  try {
    const response = await api.get(`data/participant_bonus_data/${participantId}`)
    structureData.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки данных структуры:', error)
    structureData.value = null
  }
}

// Загрузка истории закрытия этапов
const loadStageHistory = async () => {
  try {
    const response = await api.get(`data/stage_closure_history/${participantId}`)
    stageHistory.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки истории этапов:', error)
    stageHistory.value = []
  }
}

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return 'Не указано'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

// Форматирование длительности между датами (start -> end)
const formatDuration = (start, end) => {
  if (!start || !end) return '—'
  try {
    const startDate = new Date(start)
    const endDate = new Date(end)
    let diffMs = endDate - startDate
    if (isNaN(diffMs)) return '—'
    if (diffMs < 0) diffMs = 0

    const minutesTotal = Math.floor(diffMs / 60000)
    const days = Math.floor(minutesTotal / (60 * 24))
    const hours = Math.floor((minutesTotal % (60 * 24)) / 60)
    const minutes = minutesTotal % 60

    const parts = []
    if (days > 0) parts.push(`${days} д`)
    if (hours > 0) parts.push(`${hours} ч`)
    parts.push(`${minutes} м`)
    return parts.join(' ')
  } catch (e) {
    return '—'
  }
}

// Форматирование простой даты (только дата без времени)
const formatSimpleDate = (dateString) => {
  if (!dateString) return 'Не указано'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

// Функция переключения табов бонусов
const setActiveBonusTab = (tab) => {
  activeBonusTab.value = tab
  if (tab === 'structural' && structuralBonusesList.value.length === 0) {
    loadStructuralBonuses()
  } else if (tab === 'sponsor' && sponsorBonusesList.value.length === 0) {
    loadSponsorBonuses()
  } else if (tab === 'multibonus' && multibonusesList.value.length === 0) {
    loadMultibonuses()
  } else if (tab === 'gifts' && giftsList.value.length === 0) {
    loadGifts()
  } else if (tab === 'health_day' && healthDayList.value.length === 0) {
    loadHealthDay()
  }
}

// Загрузка структурных бонусов
const loadStructuralBonuses = async () => {
  structuralBonusesLoading.value = true
  try {
    const response = await api.get(`bonuses/structure_bonuses`, {
      params: {
        participant_id: participantId,
        page_size: 100,
        order_by: 'created_at',
        order_dir: 'desc'
      }
    })
    structuralBonusesList.value = response.data.results || response.data || []
  } catch (error) {
    console.error('Ошибка загрузки структурных бонусов:', error)
    structuralBonusesList.value = []
  } finally {
    structuralBonusesLoading.value = false
  }
}

// Загрузка спонсорских бонусов
const loadSponsorBonuses = async () => {
  sponsorBonusesLoading.value = true
  try {
    const response = await api.get(`bonuses/sponsor_bonuses`, {
      params: {
        participant_id: participantId,
        page_size: 100,
        order_by: 'created_at',
        order_dir: 'desc'
      }
    })
    sponsorBonusesList.value = response.data.results || response.data || []
  } catch (error) {
    console.error('Ошибка загрузки спонсорских бонусов:', error)
    sponsorBonusesList.value = []
  } finally {
    sponsorBonusesLoading.value = false
  }
}

// Загрузка мультибонусов
const loadMultibonuses = async () => {
  multibonusesLoading.value = true
  try {
    const response = await api.get(`bonuses/multi_bonuses`, {
      params: {
        participant_id: participantId,
        page_size: 100,
        order_by: 'created_at',
        order_dir: 'desc'
      }
    })
    multibonusesList.value = response.data.results || response.data || []
  } catch (error) {
    console.error('Ошибка загрузки мультибонусов:', error)
    multibonusesList.value = []
  } finally {
    multibonusesLoading.value = false
  }
}

// Загрузка подарков
const loadGifts = async () => {
  giftsLoading.value = true
  try {
    const response = await api.get(`bonuses/gifts`, {
      params: {
        participant_id: participantId,
        page_size: 100,
        order_by: 'created_at',
        order_dir: 'desc'
      }
    })
    giftsList.value = response.data.results || response.data || []
  } catch (error) {
    console.error('Ошибка загрузки подарков:', error)
    giftsList.value = []
  } finally {
    giftsLoading.value = false
  }
}

// Загрузка Health Day
const loadHealthDay = async () => {
  healthDayLoading.value = true
  try {
    const response = await api.get(`bonuses/health_day`, {
      params: {
        participant_id: participantId,
        page_size: 100,
        order_by: 'created_at',
        order_dir: 'desc'
      }
    })
    healthDayList.value = response.data.results || response.data || []
  } catch (error) {
    console.error('Ошибка загрузки Health Day:', error)
    healthDayList.value = []
  } finally {
    healthDayLoading.value = false
  }
}

// Получение текста статуса
const getStatusText = (status) => {
  if (!status || status === 'pending') {
    return 'Не выдано'
  } else if (status === 'paid') {
    return 'Выдано'
  }
  return status
}

// Tailwind badge classes
const getStatusBadgeClass = (status) => {
  if (!status || status === 'pending') {
    return 'bg-yellow-100 text-yellow-800'
  } else if (status === 'paid') {
    return 'bg-green-100 text-green-800'
  }
  return 'bg-gray-100 text-gray-800'
}

// Удаление участника
const deleteParticipant = async (id) => {
  if (!id) return
  try {
    await api.delete(`participants/${id}`, {
      headers: { 'accept': 'application/json' }
    })
    showNotice('Участник удалён', 'success')
    // Перенаправляем на страницу регистраций
    setTimeout(() => {
      router.push('/binar/registration')
    }, 1000)
  } catch (error) {
    console.error('Ошибка удаления участника:', error)
    showNotice('Не удалось удалить участника', 'error')
  }
}

// Открытие модального окна заказа
const openOrderModal = (orderId) => {
  selectedOrderId.value = orderId
  orderDetailModalVisible.value = true
}

// Закрытие модального окна заказа
const closeOrderModal = () => {
  orderDetailModalVisible.value = false
  selectedOrderId.value = null
}

// Загрузка контракта
const loadContract = async () => {
  contractLoading.value = true
  try {
    const response = await api.get(`contracts/${participantId}`)
    contract.value = response.data
    // Загружаем использование контракта, если контракт существует
    if (contract.value) {
      await loadContractUsages()
    }
  } catch (error) {
    if (error.response?.status === 404) {
      contract.value = null
    } else {
      console.error('Ошибка загрузки контракта:', error)
      contract.value = null
    }
  } finally {
    contractLoading.value = false
  }
}

// Загрузка использования контракта
const loadContractUsages = async () => {
  contractUsagesLoading.value = true
  try {
    const response = await api.get(`contracts/usages/${participantId}/contract-usage`)
    contractUsages.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    if (error.response?.status === 404) {
      contractUsages.value = []
    } else {
      console.error('Ошибка загрузки использования контракта:', error)
      contractUsages.value = []
    }
  } finally {
    contractUsagesLoading.value = false
  }
}

// Загрузка методов оплаты
const loadPaymentMethods = async () => {
  loadingPaymentMethods.value = true
  try {
    const response = await api.get('enums/payment-methods?limit=100&offset=0')
    paymentMethods.value = response.data.filter(m => m.active)
  } catch (error) {
    console.error('Ошибка загрузки методов оплаты:', error)
    contractError.value = 'Не удалось загрузить методы оплаты'
  } finally {
    loadingPaymentMethods.value = false
  }
}

// Модальное окно создания контракта
const openCreateContractModal = async () => {
  contractForm.value = {
    initial_amount: 230,
    paid_at: '',
    payment_method_id: null,
    description: ''
  }
  contractError.value = ''
  createContractModalVisible.value = true
  // Загружаем методы оплаты при открытии модального окна
  if (paymentMethods.value.length === 0) {
    await loadPaymentMethods()
  }
}

const closeCreateContractModal = () => {
  createContractModalVisible.value = false
  contractForm.value = {
    initial_amount: 230,
    paid_at: '',
    payment_method_id: null,
    description: ''
  }
  contractError.value = ''
}

const createContract = async () => {
  if (!contractForm.value.initial_amount) {
    contractError.value = 'Введите сумму контракта'
    return
  }
  
  if (!contractForm.value.payment_method_id) {
    contractError.value = 'Выберите метод оплаты'
    return
  }
  
  submittingContract.value = true
  contractError.value = ''
  try {
    const payload = {
      participant_id: participantId,
      initial_amount: contractForm.value.initial_amount,
      payment_method_id: contractForm.value.payment_method_id
    }
    
    // Если указана дата, добавляем её
    if (contractForm.value.paid_at) {
      payload.paid_at = contractForm.value.paid_at
    }
    
    // Если указано описание, добавляем его
    if (contractForm.value.description) {
      payload.description = contractForm.value.description
    }
    
    await api.post('contracts/', payload)
    
    // Перезагружаем контракт
    await loadContract()
    closeCreateContractModal()
    showNotice('Контракт успешно создан', 'success')
  } catch (error) {
    console.error('Ошибка создания контракта:', error)
    contractError.value = error.response?.data?.detail || error.response?.data?.message || 'Ошибка создания контракта'
  } finally {
    submittingContract.value = false
  }
}

// Загрузка при монтировании компонента
onMounted(async () => {
  await loadParticipant()
  await Promise.all([
    loadBonusData(),
    loadStructureData(),
    loadStageHistory(),
    loadContract()
  ])
})

onBeforeUnmount(() => {})
</script>

<style scoped>
:root.dark .participant-view,
:root.dark .participant-view * {
  color: #ffffff !important;
}
</style>
