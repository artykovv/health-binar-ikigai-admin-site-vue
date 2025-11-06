<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1 class="dark:text-white">Бонусы</h1>
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
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Участник:</label>
            <p class="text-sm font-bold text-gray-900 dark:text-white">{{ payModal.participantInfo }}</p>
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
        
    <!-- Tailwind Tabs -->
    <div class="mb-3 border-b border-gray-200 dark:border-gray-700">
      <div class="flex gap-2 relative tabs-list" ref="tabsContainer">
            <button 
              type="button"
          :class="[
            'px-3 py-2 -mb-px text-sm transition border-b-2',
            activeTab === 'structural'
              ? 'font-semibold text-gray-900 border-gray-900 dark:text-white dark:border-white'
              : 'text-gray-500 hover:text-gray-900 border-transparent dark:text-white/70 dark:hover:text-white'
          ]"
              @click="setActiveTab('structural')"
          :ref="el => setTabRef('structural', el)"
            >
              Структурный бонус
            </button>
            <button 
              type="button"
          :class="[
            'px-3 py-2 -mb-px text-sm transition border-b-2',
            activeTab === 'sponsor'
              ? 'font-semibold text-gray-900 border-gray-900 dark:text-white dark:border-white'
              : 'text-gray-500 hover:text-gray-900 border-transparent dark:text-white/70 dark:hover:text-white'
          ]"
              @click="setActiveTab('sponsor')"
          :ref="el => setTabRef('sponsor', el)"
            >
              Спонсорский бонус
            </button>
            <button 
              type="button"
          :class="[
            'px-3 py-2 -mb-px text-sm transition border-b-2',
            activeTab === 'gifts'
              ? 'font-semibold text-gray-900 border-gray-900 dark:text-white dark:border-white'
              : 'text-gray-500 hover:text-gray-900 border-transparent dark:text-white/70 dark:hover:text-white'
          ]"
          @click="setActiveTab('gifts')"
          :ref="el => setTabRef('gifts', el)"
        >
          Подарки
            </button>
        <button
          type="button"
          :class="[
            'px-3 py-2 -mb-px text-sm transition border-b-2',
            activeTab === 'health_day'
              ? 'font-semibold text-gray-900 border-gray-900 dark:text-white dark:border-white'
              : 'text-gray-500 hover:text-gray-900 border-transparent dark:text-white/70 dark:hover:text-white'
          ]"
          @click="setActiveTab('health_day')"
          :ref="el => setTabRef('health_day', el)"
        >
          Health Day
        </button>
        <button
          type="button"
          :class="[
            'px-3 py-2 -mb-px text-sm transition border-b-2',
            activeTab === 'multibonus'
              ? 'font-semibold text-gray-900 border-gray-900 dark:text-white dark:border-white'
              : 'text-gray-500 hover:text-gray-900 border-transparent dark:text-white/70 dark:hover:text-white'
          ]"
          @click="setActiveTab('multibonus')"
          :ref="el => setTabRef('multibonus', el)"
        >
                  Мультибонус
        </button>
        <span
          class="tab-indicator"
          :style="{
            transform: `translateX(${indicator.left}px)`,
            width: indicator.width + 'px',
            opacity: indicator.visible ? 1 : 0
          }"
          aria-hidden="true"
        />
              </div>
    </div>

          <!-- Health Day -->
    <div v-show="activeTab === 'health_day'" class="mt-3 bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
      <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
        <h5 class="m-0 dark:text-white">Health Day</h5>
      </div>
      <div class="p-4">
                <!-- Фильтры и сортировка -->
        <div class="grid md:grid-cols-12 gap-3 mb-3">
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Размер страницы:</label>
            <select v-model="healthDayFilters.page_size" @change="loadHealthDay"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                    </select>
                  </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Сортировка:</label>
            <select v-model="healthDayFilters.order_by" @change="loadHealthDay"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                      <option value="created_at">Дата создания</option>
                      <option value="received_at">Дата получения</option>
              <option value="amount">Сумма</option>
            </select>
          </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Направление:</label>
            <select v-model="healthDayFilters.order_dir" @change="loadHealthDay"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
              <option value="desc">По убыванию</option>
              <option value="asc">По возрастанию</option>
            </select>
          </div>
          <div class="md:col-span-3 flex items-end">
            <button @click="loadHealthDay"
              class="inline-flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
              Обновить
            </button>
          </div>
        </div>
        
        <!-- Загрузка -->
        <div v-if="healthDayLoading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        
        <!-- Таблица Health Day -->
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Номер</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ФИО</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">От Номер</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">От ФИО</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Глубина</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата выдачи</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="bonus in healthDayBonuses" :key="bonus.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/binar/participant/${bonus.participant_id}`" class="hover:underline">
                        {{ bonus.participant_personal_number || '-' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <router-link :to="`/binar/participant/${bonus.participant_id}`" class="hover:underline">
                        {{ bonus.participant_fio || '-' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/binar/participant/${bonus.from_participant_id}`" class="hover:underline">
                        {{ bonus.from_participant_personal_number || '-' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <router-link :to="`/binar/participant/${bonus.from_participant_id}`" class="hover:underline">
                        {{ bonus.from_participant_fio || '-' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ bonus.amount }}</strong></td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.depth }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.branch || '-' }}</td>
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
        
        <!-- Пагинация -->
        <div v-if="healthDayPagination" class="mt-3 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-white">
            <span>Страница {{ healthDayPagination.current_page }} из {{ healthDayPagination.total_pages }}</span>
            <span class="ml-3">Всего: {{ healthDayPagination.total_count }}</span>
          </div>
          <div class="flex gap-2">
            <button 
              @click="changeHealthDayPage(healthDayPagination.current_page - 1)" 
              :disabled="healthDayPagination.current_page <= 1"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Предыдущая
            </button>
            <button 
              @click="changeHealthDayPage(healthDayPagination.current_page + 1)" 
              :disabled="healthDayPagination.current_page >= healthDayPagination.total_pages"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Следующая
            </button>
          </div>
        </div>
      </div>
    </div>

          <!-- Подарки -->
    <div v-show="activeTab === 'gifts'" class="mt-3 bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
      <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
        <h5 class="m-0 dark:text-white">Подарки</h5>
      </div>
      <div class="p-4">
        <!-- Фильтры и сортировка -->
        <div class="grid md:grid-cols-12 gap-3 mb-3">
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Размер страницы:</label>
            <select v-model="giftsFilters.page_size" @change="loadGifts"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Сортировка:</label>
            <select v-model="giftsFilters.order_by" @change="loadGifts"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
              <option value="created_at">Дата создания</option>
              <option value="received_at">Дата получения</option>
                      <option value="cycle_number">Номер цикла</option>
                      <option value="stage_number">Номер этапа</option>
                    </select>
                  </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Направление:</label>
            <select v-model="giftsFilters.order_dir" @change="loadGifts"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                      <option value="desc">По убыванию</option>
                      <option value="asc">По возрастанию</option>
                    </select>
                  </div>
          <div class="md:col-span-3 flex items-end">
            <button @click="loadGifts"
              class="inline-flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
              Обновить
            </button>
                  </div>
                </div>
                
                <!-- Загрузка -->
        <div v-if="giftsLoading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
                  </div>
        
        <!-- Таблица подарков -->
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Номер</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ФИО</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Подарок</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата выдачи</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="gift in gifts" :key="gift.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/binar/participant/${gift.participant_id}`" class="hover:underline">
                        {{ gift.participant_personal_number || '-' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <router-link :to="`/binar/participant/${gift.participant_id}`" class="hover:underline">
                        {{ gift.participant_fio || '-' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ gift.reward }}</strong></td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ gift.cycle_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ gift.stage_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ gift.branch || '-' }}</td>
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
        
        <!-- Пагинация -->
        <div v-if="giftsPagination" class="mt-3 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-white">
            <span>Страница {{ giftsPagination.current_page }} из {{ giftsPagination.total_pages }}</span>
            <span class="ml-3">Всего: {{ giftsPagination.total_count }}</span>
          </div>
          <div class="flex gap-2">
            <button 
              @click="changeGiftsPage(giftsPagination.current_page - 1)" 
              :disabled="giftsPagination.current_page <= 1"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Предыдущая
            </button>
            <button 
              @click="changeGiftsPage(giftsPagination.current_page + 1)" 
              :disabled="giftsPagination.current_page >= giftsPagination.total_pages"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
            >
              Следующая
            </button>
          </div>
        </div>
      </div>
    </div>

          <!-- Мультибонус -->
    <div v-show="activeTab === 'multibonus'" class="mt-3 bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
      <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
        <h5 class="m-0 dark:text-white">Мультибонус</h5>
              </div>
      <div class="p-4">
                <!-- Фильтры и сортировка -->
        <div class="grid md:grid-cols-12 gap-3 mb-3">
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Размер страницы:</label>
            <select v-model="multibonusFilters.page_size" @change="loadMultibonuses"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                    </select>
                  </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Сортировка:</label>
            <select v-model="multibonusFilters.order_by" @change="loadMultibonuses"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                      <option value="created_at">Дата создания</option>
                      <option value="received_at">Дата получения</option>
                      <option value="reward">Сумма</option>
                      <option value="cycle_number">Номер цикла</option>
                      <option value="stage_number">Номер этапа</option>
                    </select>
                  </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Направление:</label>
            <select v-model="multibonusFilters.order_dir" @change="loadMultibonuses"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                      <option value="desc">По убыванию</option>
                      <option value="asc">По возрастанию</option>
                    </select>
                  </div>
          <div class="md:col-span-3 flex items-end">
            <button @click="loadMultibonuses"
              class="inline-flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
              Обновить
            </button>
                  </div>
                </div>
                
                <!-- Загрузка -->
        <div v-if="multibonusLoading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
                </div>
                
                <!-- Таблица мультибонусов -->
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Номер</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ФИО</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата выдачи</th>
                      </tr>
                    </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="bonus in multibonuses" :key="bonus.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/binar/participant/${bonus.participant_id}`" class="hover:underline">
                            {{ bonus.participant_personal_number || '-' }}
                          </router-link>
                        </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <router-link :to="`/binar/participant/${bonus.participant_id}`" class="hover:underline">
                        {{ bonus.participant_fio || '-' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ bonus.reward }}</strong></td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.cycle_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.stage_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.branch || '-' }}</td>
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
                
                <!-- Пагинация -->
        <div v-if="multibonusPagination" class="mt-3 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-white">
                    <span>Страница {{ multibonusPagination.current_page }} из {{ multibonusPagination.total_pages }}</span>
            <span class="ml-3">Всего: {{ multibonusPagination.total_count }}</span>
                  </div>
          <div class="flex gap-2">
                    <button 
                      @click="changeMultibonusPage(multibonusPagination.current_page - 1)" 
                      :disabled="multibonusPagination.current_page <= 1"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
                    >
                      Предыдущая
                    </button>
                    <button 
                      @click="changeMultibonusPage(multibonusPagination.current_page + 1)" 
                      :disabled="multibonusPagination.current_page >= multibonusPagination.total_pages"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
                    >
                      Следующая
                    </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Структурный бонус -->
    <div v-show="activeTab === 'structural'" class="mt-6 bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
      <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
        <h5 class="m-0 dark:text-white">Структурный бонус</h5>
              </div>
      <div class="p-4">
        <div class="grid md:grid-cols-12 gap-3 mb-3">
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Размер страницы:</label>
            <select v-model="structuralFilters.page_size" @change="loadStructuralBonuses"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                    </select>
                  </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Сортировка:</label>
            <select v-model="structuralFilters.order_by" @change="loadStructuralBonuses"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                      <option value="created_at">Дата создания</option>
                      <option value="received_at">Дата получения</option>
                      <option value="amount">Сумма</option>
                      <option value="cycle_number">Номер цикла</option>
                      <option value="stage_number">Номер этапа</option>
                    </select>
                  </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Направление:</label>
            <select v-model="structuralFilters.order_dir" @change="loadStructuralBonuses"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                      <option value="desc">По убыванию</option>
                      <option value="asc">По возрастанию</option>
                    </select>
                  </div>
          <div class="md:col-span-3 flex items-end">
            <button @click="loadStructuralBonuses"
              class="inline-flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
              Обновить
            </button>
                  </div>
                </div>
                
        <div v-if="structuralLoading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
                </div>
                
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Номер</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ФИО</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                      </tr>
                    </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="bonus in structuralBonuses" :key="bonus.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/binar/participant/${bonus.participant_id}`" class="hover:underline">
                            {{ bonus.participant_personal_number || '-' }}
                          </router-link>
                        </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <router-link :to="`/binar/participant/${bonus.participant_id}`" class="hover:underline">
                        {{ bonus.participant_fio || '-' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ bonus.amount }}</strong></td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.cycle_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.stage_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.branch || '-' }}</td>
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
                
        <div v-if="structuralPagination" class="mt-3 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-white">
                    <span>Страница {{ structuralPagination.current_page }} из {{ structuralPagination.total_pages }}</span>
            <span class="ml-3">Всего: {{ structuralPagination.total_count }}</span>
                  </div>
          <div class="flex gap-2">
                    <button 
                      @click="changeStructuralPage(structuralPagination.current_page - 1)" 
                      :disabled="structuralPagination.current_page <= 1"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
                    >
                      Предыдущая
                    </button>
                    <button 
                      @click="changeStructuralPage(structuralPagination.current_page + 1)" 
                      :disabled="structuralPagination.current_page >= structuralPagination.total_pages"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
                    >
                      Следующая
                    </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Спонсорский бонус -->
    <div v-show="activeTab === 'sponsor'" class="mt-6 bg-white rounded-lg ring-1 ring-gray-200 dark:bg-[#3f3f47] dark:ring-gray-700">
      <div class="px-4 py-3 bg-gray-50 border-b rounded-t-lg dark:bg-[#3f3f47] dark:border-gray-700">
        <h5 class="m-0 dark:text-white">Спонсорский бонус</h5>
              </div>
      <div class="p-4">
        <div class="grid md:grid-cols-12 gap-3 mb-3">
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Размер страницы:</label>
            <select v-model="sponsorFilters.page_size" @change="loadSponsorBonuses"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                    </select>
                  </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Сортировка:</label>
            <select v-model="sponsorFilters.order_by" @change="loadSponsorBonuses"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                      <option value="created_at">Дата создания</option>
                      <option value="received_at">Дата получения</option>
                      <option value="amount">Сумма</option>
                      <option value="cycle_number">Номер цикла</option>
                      <option value="stage_number">Номер этапа</option>
                    </select>
                  </div>
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Направление:</label>
            <select v-model="sponsorFilters.order_dir" @change="loadSponsorBonuses"
              class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-[#3f3f47] dark:text-white dark:focus:ring-white">
                      <option value="desc">По убыванию</option>
                      <option value="asc">По возрастанию</option>
                    </select>
                  </div>
          <div class="md:col-span-3 flex items-end">
            <button @click="loadSponsorBonuses"
              class="inline-flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white">
              Обновить
            </button>
                  </div>
                </div>
                
        <div v-if="sponsorLoading" class="py-6 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
                </div>
                
        <div v-else class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden rounded-lg ring-1 ring-gray-200 bg-white dark:ring-gray-700 dark:bg-[#3f3f47]">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-[#3f3f47]">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Номер </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">ФИО</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">От Номер</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">От ФИО</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата выдачи</th>
                      </tr>
                    </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="bonus in sponsorBonuses" :key="bonus.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/binar/participant/${bonus.participant_id}`" class="hover:underline">
                        {{ bonus.participant_personal_number || '-' }}
                          </router-link>
                        </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <router-link :to="`/binar/participant/${bonus.participant_id}`" class="hover:underline">
                        {{ bonus.participant_fio || '-' }}
                          </router-link>
                        </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/binar/participant/${bonus.from_participant_id}`" class="hover:underline">
                        {{ bonus.from_participant_personal_number || '-' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <router-link :to="`/binar/participant/${bonus.from_participant_id}`" class="hover:underline">
                        {{ bonus.from_participant_fio || '-' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ bonus.amount }}</strong></td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.cycle_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.stage_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.branch || '-' }}</td>
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
                
        <div v-if="sponsorPagination" class="mt-3 flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-white">
                    <span>Страница {{ sponsorPagination.current_page }} из {{ sponsorPagination.total_pages }}</span>
            <span class="ml-3">Всего: {{ sponsorPagination.total_count }}</span>
                  </div>
          <div class="flex gap-2">
                    <button 
                      @click="changeSponsorPage(sponsorPagination.current_page - 1)" 
                      :disabled="sponsorPagination.current_page <= 1"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
                    >
                      Предыдущая
                    </button>
                    <button 
                      @click="changeSponsorPage(sponsorPagination.current_page + 1)" 
                      :disabled="sponsorPagination.current_page >= sponsorPagination.total_pages"
              class="inline-flex items-center rounded-md bg-black px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-[#3f3f47] dark:hover:bg-[#4a4a52] dark:text-white"
                    >
                      Следующая
                    </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '@/api'

// Props
const props = defineProps({
  defaultTab: {
    type: String,
    default: 'structural'
  }
})

// Router для навигации
const router = useRouter()
const route = useRoute()

// Реактивные данные
const activeTab = ref(props.defaultTab || 'structural')

// Уведомления
const notice = ref({ visible: false, type: 'info', message: '' })
const showNotice = (message, type = 'info') => {
  notice.value = { visible: true, type, message }
  setTimeout(() => { notice.value.visible = false }, 3000)
}

// Модальное окно выдачи бонуса
const payModal = ref({ 
  visible: false, 
  bonusId: null, 
  bonusType: '', 
  typeLabel: '',
  amount: 0,
  participantInfo: ''
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
    amount: bonus.amount || bonus.reward || 0,
    participantInfo: `${bonus.participant_fio || ''} (${bonus.participant_personal_number || ''})`
  }
}

const closePayModal = () => {
  payModal.value = { visible: false, bonusId: null, bonusType: '', typeLabel: '', amount: 0, participantInfo: '' }
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
    if (activeTab.value === 'structural') {
      await loadStructuralBonuses()
    } else if (activeTab.value === 'sponsor') {
      await loadSponsorBonuses()
    } else if (activeTab.value === 'gifts') {
      await loadGifts()
    } else if (activeTab.value === 'health_day') {
      await loadHealthDay()
    } else if (activeTab.value === 'multibonus') {
      await loadMultibonuses()
    }
  } catch (error) {
    console.error('Ошибка выдачи бонуса:', error)
    showNotice('Не удалось выдать бонус: ' + (error.response?.data?.detail || error.message), 'error')
  } finally {
    paying.value = false
  }
}

// Данные для подарков
const gifts = ref([])
const giftsLoading = ref(false)
const giftsPagination = ref(null)

// Фильтры для подарков
const giftsFilters = ref({
  page_size: 30,
  order_by: 'created_at',
  order_dir: 'desc',
  page: 1
})

// Данные для Health Day
const healthDayBonuses = ref([])
const healthDayLoading = ref(false)
const healthDayPagination = ref(null)

// Фильтры для Health Day
const healthDayFilters = ref({
  page_size: 30,
  order_by: 'created_at',
  order_dir: 'desc',
  page: 1
})

// Animated indicator for tabs
const tabsContainer = ref(null)
const tabRefs = new Map()
function setTabRef(key, el) {
  if (el) tabRefs.set(key, el)
}
const indicator = reactive({ left: 0, width: 0, visible: false })
function updateIndicator() {
  const container = tabsContainer.value
  if (!container) return
  const el = tabRefs.get(activeTab.value)
  if (!el) return
  const r = el.getBoundingClientRect()
  const cr = container.getBoundingClientRect()
  indicator.left = Math.round(r.left - cr.left)
  indicator.width = Math.round(r.width)
  indicator.visible = true
}
function onResize() { updateIndicator() }

onMounted(() => {
  nextTick(() => updateIndicator())
  window.addEventListener('resize', onResize)
  if (document && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => nextTick().then(() => updateIndicator()))
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

watch(activeTab, async () => {
  await nextTick()
  updateIndicator()
})

// Данные для мультибонусов
const multibonuses = ref([])
const multibonusLoading = ref(false)
const multibonusPagination = ref(null)

// Фильтры для мультибонусов
const multibonusFilters = ref({
  page_size: 30,
  order_by: 'created_at',
  order_dir: 'desc',
  page: 1
})

// Данные для структурных бонусов
const structuralBonuses = ref([])
const structuralLoading = ref(false)
const structuralPagination = ref(null)

// Фильтры для структурных бонусов
const structuralFilters = ref({
  page_size: 30,
  order_by: 'created_at',
  order_dir: 'desc',
  page: 1
})

// Данные для спонсорских бонусов
const sponsorBonuses = ref([])
const sponsorLoading = ref(false)
const sponsorPagination = ref(null)

// Фильтры для спонсорских бонусов
const sponsorFilters = ref({
  page_size: 30,
  order_by: 'created_at',
  order_dir: 'desc',
  page: 1
})

// API базовый URL
// centralized API client is used

// Функция для переключения вкладок
const setActiveTab = (tab) => {
  activeTab.value = tab
  router.push(`/binar/bonuses/${tab}`)
  if (tab === 'multibonus') {
    loadMultibonuses()
  } else if (tab === 'structural') {
    loadStructuralBonuses()
  } else if (tab === 'sponsor') {
    loadSponsorBonuses()
  } else if (tab === 'gifts') {
    loadGifts()
  } else if (tab === 'health_day') {
    loadHealthDay()
  }
}

// Загрузка мультибонусов
const loadMultibonuses = async () => {
  multibonusLoading.value = true
  try {
    const response = await api.get(`bonuses/multi_bonuses`, {
      params: {
        order_by: multibonusFilters.value.order_by,
        order_dir: multibonusFilters.value.order_dir,
        page: multibonusFilters.value.page,
        page_size: multibonusFilters.value.page_size
      }
    })
    const bonuses = response.data.results || response.data
    // Бэкенд уже отдает FIO и персональные номера, дополнительные запросы не нужны
    multibonuses.value = bonuses
    multibonusPagination.value = {
      current_page: response.data.current_page || 1,
      total_pages: response.data.total_pages || 1,
      total_count: response.data.total_count || response.data.count || 0
    }
  } catch (error) {
    console.error('Ошибка загрузки мультибонусов:', error)
    multibonuses.value = []
  } finally {
    multibonusLoading.value = false
  }
}

const changeMultibonusPage = (page) => {
  if (page >= 1 && page <= multibonusPagination.value.total_pages) {
    multibonusFilters.value.page = page
    loadMultibonuses()
  }
}

// Загрузка структурных бонусов
const loadStructuralBonuses = async () => {
  structuralLoading.value = true
  try {
    const response = await api.get(`bonuses/structure_bonuses`, {
      params: {
        order_by: structuralFilters.value.order_by,
        order_dir: structuralFilters.value.order_dir,
        page: structuralFilters.value.page,
        page_size: structuralFilters.value.page_size
      }
    })
    const bonuses = response.data.results || response.data
    // Бэкенд уже отдает FIO и персональные номера, дополнительные запросы не нужны
    structuralBonuses.value = bonuses
    structuralPagination.value = {
      current_page: response.data.current_page || 1,
      total_pages: response.data.total_pages || 1,
      total_count: response.data.total_count || response.data.count || 0
    }
  } catch (error) {
    console.error('Ошибка загрузки структурных бонусов:', error)
    structuralBonuses.value = []
  } finally {
    structuralLoading.value = false
  }
}

const changeStructuralPage = (page) => {
  if (page >= 1 && page <= structuralPagination.value.total_pages) {
    structuralFilters.value.page = page
    loadStructuralBonuses()
  }
}

// Загрузка спонсорских бонусов
const loadSponsorBonuses = async () => {
  sponsorLoading.value = true
  try {
    const response = await api.get(`bonuses/sponsor_bonuses`, {
      params: {
        order_by: sponsorFilters.value.order_by,
        order_dir: sponsorFilters.value.order_dir,
        page: sponsorFilters.value.page,
        page_size: sponsorFilters.value.page_size
      }
    })
    const bonuses = response.data.results || response.data
    // Бэкенд уже отдает FIO и персональные номера, дополнительные запросы не нужны
    sponsorBonuses.value = bonuses
    sponsorPagination.value = {
      current_page: response.data.current_page || 1,
      total_pages: response.data.total_pages || 1,
      total_count: response.data.total_count || response.data.count || 0
    }
  } catch (error) {
    console.error('Ошибка загрузки спонсорских бонусов:', error)
    sponsorBonuses.value = []
  } finally {
    sponsorLoading.value = false
  }
}

const changeSponsorPage = (page) => {
  if (page >= 1 && page <= sponsorPagination.value.total_pages) {
    sponsorFilters.value.page = page
    loadSponsorBonuses()
  }
}

// Загрузка подарков
const loadGifts = async () => {
  giftsLoading.value = true
  try {
    const response = await api.get(`bonuses/gifts`, {
      params: {
        order_by: giftsFilters.value.order_by,
        order_dir: giftsFilters.value.order_dir,
        page: giftsFilters.value.page,
        page_size: giftsFilters.value.page_size
      }
    })
    const giftsList = response.data.results || response.data
    // Бэкенд уже отдает FIO и персональные номера, дополнительные запросы не нужны
    gifts.value = giftsList
    giftsPagination.value = {
      current_page: response.data.current_page || 1,
      total_pages: response.data.total_pages || 1,
      total_count: response.data.total_count || response.data.count || giftsList.length
    }
  } catch (error) {
    console.error('Ошибка загрузки подарков:', error)
    gifts.value = []
  } finally {
    giftsLoading.value = false
  }
}

const changeGiftsPage = (page) => {
  if (page >= 1 && page <= giftsPagination.value.total_pages) {
    giftsFilters.value.page = page
    loadGifts()
  }
}

// Загрузка Health Day
const loadHealthDay = async () => {
  healthDayLoading.value = true
  try {
    const response = await api.get(`bonuses/health_day`, {
      params: {
        order_by: healthDayFilters.value.order_by,
        order_dir: healthDayFilters.value.order_dir,
        page: healthDayFilters.value.page,
        page_size: healthDayFilters.value.page_size
      }
    })
    const bonuses = response.data.results || response.data
    // Бэкенд уже отдает FIO и персональные номера, дополнительные запросы не нужны
    healthDayBonuses.value = bonuses
    healthDayPagination.value = {
      current_page: response.data.current_page || 1,
      total_pages: response.data.total_pages || 1,
      total_count: response.data.total_count || response.data.count || bonuses.length
    }
  } catch (error) {
    console.error('Ошибка загрузки Health Day:', error)
    healthDayBonuses.value = []
  } finally {
    healthDayLoading.value = false
  }
}

const changeHealthDayPage = (page) => {
  if (page >= 1 && page <= healthDayPagination.value.total_pages) {
    healthDayFilters.value.page = page
    loadHealthDay()
  }
}

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
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

// Инициализация активной вкладки
onMounted(() => {
  if (route.params.tab) {
    activeTab.value = route.params.tab
  } else if (route.query.tab) {
    activeTab.value = route.query.tab
  }
  const currentPath = route.path
  if (currentPath.includes('/multibonus')) {
    activeTab.value = 'multibonus'
  } else if (currentPath.includes('/structural')) {
    activeTab.value = 'structural'
  } else if (currentPath.includes('/sponsor')) {
    activeTab.value = 'sponsor'
  } else if (currentPath.includes('/gifts')) {
    activeTab.value = 'gifts'
  } else if (currentPath.includes('/health_day')) {
    activeTab.value = 'health_day'
  }
  if (activeTab.value === 'multibonus') {
    loadMultibonuses()
  } else if (activeTab.value === 'structural') {
    loadStructuralBonuses()
  } else if (activeTab.value === 'sponsor') {
    loadSponsorBonuses()
  } else if (activeTab.value === 'gifts') {
    loadGifts()
  } else if (activeTab.value === 'health_day') {
    loadHealthDay()
  }
})
</script>

<style scoped>
.tabs-list { position: relative; }
.tab-indicator {
  position: absolute;
  left: 0;
  bottom: -1px;
  height: 2px;
  background-color: #111827; /* gray-900 */
  border-radius: 2px;
  transition: transform 300ms ease, width 300ms ease, opacity 150ms ease;
  will-change: transform, width;
}
/* Dark mode: make tab indicator white */
:root.dark .tab-indicator {
  background-color: #ffffff;
}
</style>