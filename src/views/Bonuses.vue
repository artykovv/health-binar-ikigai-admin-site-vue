<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h1>Бонусы</h1>
    </div>

    <!-- Tailwind Tabs -->
    <div class="mb-3 border-b border-gray-200 dark:border-gray-700">
      <div class="flex gap-2 relative tabs-list" ref="tabsContainer">
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
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Персональный номер</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата создания</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="bonus in multibonuses" :key="bonus.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/participants/${bonus.participant_id}`" class="hover:underline">
                        {{ bonus.personal_number || 'Загрузка...' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ bonus.reward }}</strong></td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.cycle_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.stage_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.branch_id }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.received_at) }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">
                      <span :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' + getStatusBadgeClass(bonus.status)">
                        {{ getStatusText(bonus.status) }}
                      </span>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.created_at) }}</td>
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
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Персональный номер</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата создания</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="bonus in structuralBonuses" :key="bonus.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/participants/${bonus.participant_id}`" class="hover:underline">
                        {{ bonus.personal_number || 'Загрузка...' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ bonus.amount }}</strong></td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.cycle_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.stage_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.branch_id }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.received_at) }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">
                      <span :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' + getStatusBadgeClass(bonus.status)">
                        {{ getStatusText(bonus.status) }}
                      </span>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.created_at) }}</td>
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
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Участник</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">От участника</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Сумма</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Цикл</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Этап</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Филиал</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата получения</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Статус</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Дата создания</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-[#3f3f47]">
                  <tr v-for="bonus in sponsorBonuses" :key="bonus.id" class="hover:bg-gray-50 dark:hover:bg-[#4a4a52]">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/participants/${bonus.participant_id}`" class="hover:underline">
                        {{ bonus.participant_personal_number || 'Загрузка...' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">
                      <router-link :to="`/participants/${bonus.from_participant_id}`" class="hover:underline">
                        {{ bonus.from_participant_personal_number || 'Загрузка...' }}
                      </router-link>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white"><strong>{{ bonus.amount }}</strong></td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.cycle_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.stage_number }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ bonus.branch_id || '-' }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.received_at) }}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">
                      <span :class="'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ' + getStatusBadgeClass(bonus.status)">
                        {{ getStatusText(bonus.status) }}
                      </span>
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ formatDate(bonus.created_at) }}</td>
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

// Router для навигации
const router = useRouter()
const route = useRoute()

// Реактивные данные
const activeTab = ref('multibonus')

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
  router.push(`/bonuses/${tab}`)
  if (tab === 'multibonus') {
    loadMultibonuses()
  } else if (tab === 'structural') {
    loadStructuralBonuses()
  } else if (tab === 'sponsor') {
    loadSponsorBonuses()
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
    const bonusesWithPersonalNumbers = await Promise.all(
      bonuses.map(async (bonus) => {
        try {
          const participantResponse = await api.get(`participants/${bonus.participant_id}`)
          return { ...bonus, personal_number: participantResponse.data.personal_number }
        } catch (error) {
          console.error(`Ошибка загрузки участника ${bonus.participant_id}:`, error)
          return bonus
        }
      })
    )
    multibonuses.value = bonusesWithPersonalNumbers
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
    const bonusesWithPersonalNumbers = await Promise.all(
      bonuses.map(async (bonus) => {
        try {
          const participantResponse = await api.get(`participants/${bonus.participant_id}`)
          return { ...bonus, personal_number: participantResponse.data.personal_number }
        } catch (error) {
          console.error(`Ошибка загрузки участника ${bonus.participant_id}:`, error)
          return bonus
        }
      })
    )
    structuralBonuses.value = bonusesWithPersonalNumbers
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
    const bonusesWithPersonalNumbers = await Promise.all(
      bonuses.map(async (bonus) => {
        try {
          const [participantResponse, fromParticipantResponse] = await Promise.all([
            api.get(`participants/${bonus.participant_id}`),
            api.get(`participants/${bonus.from_participant_id}`)
          ])
          return {
            ...bonus,
            participant_personal_number: participantResponse.data.personal_number,
            from_participant_personal_number: fromParticipantResponse.data.personal_number
          }
        } catch (error) {
          console.error(`Ошибка загрузки участников для бонуса ${bonus.id}:`, error)
          return bonus
        }
      })
    )
    sponsorBonuses.value = bonusesWithPersonalNumbers
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
  switch (status) {
    case 'pending':
      return 'Ожидает'
    case 'approved':
      return 'Одобрен'
    case 'rejected':
      return 'Отклонен'
    case 'paid':
      return 'Выплачен'
    default:
      return status
  }
}

// Tailwind badge classes
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'paid':
      return 'bg-sky-100 text-sky-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
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
  }
  if (activeTab.value === 'multibonus') {
    loadMultibonuses()
  } else if (activeTab.value === 'structural') {
    loadStructuralBonuses()
  } else if (activeTab.value === 'sponsor') {
    loadSponsorBonuses()
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