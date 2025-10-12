<template>
  <div>
    <div>
      <div>
        <div class="search-container mb-2">
          <div class="grid md:grid-cols-12 gap-2">
            <div class="md:col-span-9">
              <input
                v-model="searchQuery"
                @input="onSearchInput"
                type="text"
                class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-[#3f3f47] dark:border-white dark:text-white dark:focus:ring-white dark:focus:border-white dark:placeholder-white/70"
                placeholder="Поиск по ФИО или персональному номеру..."
              >
            </div>
            <div class="md:col-span-3">
              <button
                type="button"
                @click="performSearch"
                :disabled="isSearching || searchQuery.trim().length < 3"
                class="inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-white text-sm hover:bg-gray-900 disabled:opacity-40 dark:bg-primary dark:hover:bg-[#4a4a52] dark:text-white"
              >
                Поиск
              </button>
            </div>
          </div>
          <div v-if="showResults" id="search-results" class="rounded-md shadow-md overflow-hidden">
            <button
              v-for="p in searchResults"
              :key="p.id"
              class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#4a4a52] dark:text-white"
              @click="selectParticipant(p)"
            >
              {{ p.lastname }} {{ p.name }} {{ p.patronymic }} — {{ p.personal_number }}
            </button>
            <div v-if="isSearching" class="px-3 py-2 text-sm text-gray-500 dark:text-white">Поиск...</div>
            <div v-else-if="!isSearching && searchQuery && searchResults.length === 0" class="px-3 py-2 text-sm text-gray-500 dark:text-white">Ничего не найдено</div>
          </div>
        </div>
        <div v-if="loading" class="my-4 text-center">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white"></span>
        </div>
        <div v-else-if="error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 my-3 dark:bg-[#3f3f47] dark:border-gray-700 dark:text-white">{{ error }}</div>
        <div class="flex justify-center" v-else>
          <div class="tree mt-5 mb-5">
              <div v-if="structure" class="node">
              <div @click="goTo(structure.participant_id)" class="node-content" :style="nodeStyle(structure)">
                <div class="text-center">
                  <h6>{{ structure.participant_lastname }} {{ structure.participant_name }} {{ structure.participant_patronymic }}</h6>
                  <button class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-gray-800 text-xs hover:bg-gray-200 mt-1 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">{{ structure.participant_personal_number }}</button>
                  <div class="mt-2 text-[11px] text-gray-800 dark:text-white grid grid-cols-2 gap-2">
                    <div>Цикл: <span class="font-semibold">{{ getBD(structure.participant_id)?.cycle_number ?? '-' }}</span></div>
                    <div>Этап: <span class="font-semibold">{{ getBD(structure.participant_id)?.stage_number ?? '-' }}</span></div>
                  </div>
                </div>
                <div class="mt-2 text-[11px] text-gray-800 dark:text-white">
                  <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                    <div>Общий слева</div>
                    <div>Общий справа</div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 font-semibold mb-2">
                    <div>{{ getBD(structure.participant_id)?.total_left ?? '-' }}</div>
                    <div>{{ getBD(structure.participant_id)?.total_right ?? '-' }}</div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                    <div>Текущий слева</div>
                    <div>Текущий справа</div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 font-semibold">
                    <div>{{ currentLeft(structure.participant_id) }}</div>
                    <div>{{ currentRight(structure.participant_id) }}</div>
                  </div>
                </div>
              </div>
              <div class="branch" v-if="hasAnyChild(structure)">
                <!-- Left subtree level 2 -->
                <div class="node">
                  <div v-if="structure.left_child" @click="goTo(structure.left_child.participant_id)" class="node-content" :style="nodeStyle(structure.left_child)">
                    <div class="text-center">
                      <h6>{{ structure.left_child.participant_lastname }} {{ structure.left_child.participant_name }} {{ structure.left_child.participant_patronymic }}</h6>
                      <button class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-gray-800 text-xs hover:bg-gray-200 mt-1 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">{{ structure.left_child.participant_personal_number }}</button>
                      <div class="mt-2 text-[11px] text-gray-800 dark:text-white grid grid-cols-2 gap-2">
                        <div>Цикл: <span class="font-semibold">{{ getBD(structure.left_child.participant_id)?.cycle_number ?? '-' }}</span></div>
                        <div>Этап: <span class="font-semibold">{{ getBD(structure.left_child.participant_id)?.stage_number ?? '-' }}</span></div>
                      </div>
                    </div>
                    <div class="mt-2 text-[11px] text-gray-800 dark:text-white">
                      <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                        <div>Общий слева</div>
                        <div>Общий справа</div>
                      </div>
                      <div class="grid grid-cols-2 gap-2 font-semibold mb-2">
                        <div>{{ getBD(structure.left_child.participant_id)?.total_left ?? '-' }}</div>
                        <div>{{ getBD(structure.left_child.participant_id)?.total_right ?? '-' }}</div>
                      </div>
                      <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                        <div>Текущий слева</div>
                        <div>Текущий справа</div>
                      </div>
                      <div class="grid grid-cols-2 gap-2 font-semibold">
                        <div>{{ currentLeft(structure.left_child.participant_id) }}</div>
                        <div>{{ currentRight(structure.left_child.participant_id) }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="node invisible"></div>
                  <!-- grandchildren for left child (level 3) -->
                  <div class="branch" v-if="structure.left_child && hasAnyChild(structure.left_child)">
                    <div class="node">
                      <div v-if="structure.left_child.left_child" @click="goTo(structure.left_child.left_child.participant_id)" class="node-content" :style="nodeStyle(structure.left_child.left_child)">
                        <div class="text-center">
                          <h6>{{ structure.left_child.left_child.participant_lastname }} {{ structure.left_child.left_child.participant_name }} {{ structure.left_child.left_child.participant_patronymic }}</h6>
                          <button class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-gray-800 text-xs hover:bg-gray-200 mt-1 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">{{ structure.left_child.left_child.participant_personal_number }}</button>
                          <div class="mt-2 text-[11px] text-gray-800 dark:text-white grid grid-cols-2 gap-2">
                            <div>Цикл: <span class="font-semibold">{{ getBD(structure.left_child.left_child.participant_id)?.cycle_number ?? '-' }}</span></div>
                            <div>Этап: <span class="font-semibold">{{ getBD(structure.left_child.left_child.participant_id)?.stage_number ?? '-' }}</span></div>
                          </div>
                        </div>
                        <div class="mt-2 text-[11px] text-gray-800 dark:text-white">
                          <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                            <div>Общий слева</div>
                            <div>Общий справа</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2 font-semibold mb-2">
                            <div>{{ getBD(structure.left_child.left_child.participant_id)?.total_left ?? '-' }}</div>
                            <div>{{ getBD(structure.left_child.left_child.participant_id)?.total_right ?? '-' }}</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                            <div>Текущий слева</div>
                            <div>Текущий справа</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2 font-semibold">
                            <div>{{ currentLeft(structure.left_child.left_child.participant_id) }}</div>
                            <div>{{ currentRight(structure.left_child.left_child.participant_id) }}</div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="node invisible"></div>
                    </div>
                    <div class="node">
                      <div v-if="structure.left_child.right_child" @click="goTo(structure.left_child.right_child.participant_id)" class="node-content" :style="nodeStyle(structure.left_child.right_child)">
                        <div class="text-center">
                          <h6>{{ structure.left_child.right_child.participant_lastname }} {{ structure.left_child.right_child.participant_name }} {{ structure.left_child.right_child.participant_patronymic }}</h6>
                          <button class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-gray-800 text-xs hover:bg-gray-200 mt-1 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">{{ structure.left_child.right_child.participant_personal_number }}</button>
                          <div class="mt-2 text-[11px] text-gray-800 dark:text-white grid grid-cols-2 gap-2">
                            <div>Цикл: <span class="font-semibold">{{ getBD(structure.left_child.right_child.participant_id)?.cycle_number ?? '-' }}</span></div>
                            <div>Этап: <span class="font-semibold">{{ getBD(structure.left_child.right_child.participant_id)?.stage_number ?? '-' }}</span></div>
                          </div>
                        </div>
                        <div class="mt-2 text-[11px] text-gray-800 dark:text-white">
                          <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                            <div>Общий слева</div>
                            <div>Общий справа</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2 font-semibold mb-2">
                            <div>{{ getBD(structure.left_child.right_child.participant_id)?.total_left ?? '-' }}</div>
                            <div>{{ getBD(structure.left_child.right_child.participant_id)?.total_right ?? '-' }}</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                            <div>Текущий слева</div>
                            <div>Текущий справа</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2 font-semibold">
                            <div>{{ currentLeft(structure.left_child.right_child.participant_id) }}</div>
                            <div>{{ currentRight(structure.left_child.right_child.participant_id) }}</div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="node invisible"></div>
                    </div>
                  </div>
                </div>

                <!-- Right subtree level 2 -->
                <div class="node">
                  <div v-if="structure.right_child" @click="goTo(structure.right_child.participant_id)" class="node-content" :style="nodeStyle(structure.right_child)">
                    <div class="text-center">
                      <h6>{{ structure.right_child.participant_lastname }} {{ structure.right_child.participant_name }} {{ structure.right_child.participant_patronymic }}</h6>
                      <button class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-gray-800 text-xs hover:bg-gray-200 mt-1 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">{{ structure.right_child.participant_personal_number }}</button>
                      <div class="mt-2 text-[11px] text-gray-800 dark:text-white grid grid-cols-2 gap-2">
                        <div>Цикл: <span class="font-semibold">{{ getBD(structure.right_child.participant_id)?.cycle_number ?? '-' }}</span></div>
                        <div>Этап: <span class="font-semibold">{{ getBD(structure.right_child.participant_id)?.stage_number ?? '-' }}</span></div>
                      </div>
                    </div>
                    <div class="mt-2 text-[11px] text-gray-800 dark:text-white">
                      <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                        <div>Общий слева</div>
                        <div>Общий справа</div>
                      </div>
                      <div class="grid grid-cols-2 gap-2 font-semibold mb-2">
                        <div>{{ getBD(structure.right_child.participant_id)?.total_left ?? '-' }}</div>
                        <div>{{ getBD(structure.right_child.participant_id)?.total_right ?? '-' }}</div>
                      </div>
                      <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                        <div>Текущий слева</div>
                        <div>Текущий справа</div>
                      </div>
                      <div class="grid grid-cols-2 gap-2 font-semibold">
                        <div>{{ currentLeft(structure.right_child.participant_id) }}</div>
                        <div>{{ currentRight(structure.right_child.participant_id) }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="node invisible"></div>
                  <!-- grandchildren for right child (level 3) -->
                  <div class="branch" v-if="structure.right_child && hasAnyChild(structure.right_child)">
                    <div class="node">
                      <div v-if="structure.right_child.left_child" @click="goTo(structure.right_child.left_child.participant_id)" class="node-content" :style="nodeStyle(structure.right_child.left_child)">
                        <div class="text-center">
                          <h6>{{ structure.right_child.left_child.participant_lastname }} {{ structure.right_child.left_child.participant_name }} {{ structure.right_child.left_child.participant_patronymic }}</h6>
                          <button class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-gray-800 text-xs hover:bg-gray-200 mt-1 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">{{ structure.right_child.left_child.participant_personal_number }}</button>
                          <div class="mt-2 text-[11px] text-gray-800 dark:text-white grid grid-cols-2 gap-2">
                            <div>Цикл: <span class="font-semibold">{{ getBD(structure.right_child.left_child.participant_id)?.cycle_number ?? '-' }}</span></div>
                            <div>Этап: <span class="font-semibold">{{ getBD(structure.right_child.left_child.participant_id)?.stage_number ?? '-' }}</span></div>
                          </div>
                        </div>
                        <div class="mt-2 text-[11px] text-gray-800 dark:text-white">
                          <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                            <div>Общий слева</div>
                            <div>Общий справа</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2 font-semibold mb-2">
                            <div>{{ getBD(structure.right_child.left_child.participant_id)?.total_left ?? '-' }}</div>
                            <div>{{ getBD(structure.right_child.left_child.participant_id)?.total_right ?? '-' }}</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                            <div>Текущий слева</div>
                            <div>Текущий справа</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2 font-semibold">
                            <div>{{ currentLeft(structure.right_child.left_child.participant_id) }}</div>
                            <div>{{ currentRight(structure.right_child.left_child.participant_id) }}</div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="node invisible"></div>
                    </div>
                    <div class="node">
                      <div v-if="structure.right_child.right_child" @click="goTo(structure.right_child.right_child.participant_id)" class="node-content" :style="nodeStyle(structure.right_child.right_child)">
                        <div class="text-center">
                          <h6>{{ structure.right_child.right_child.participant_lastname }} {{ structure.right_child.right_child.participant_name }} {{ structure.right_child.right_child.participant_patronymic }}</h6>
                          <button class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-gray-800 text-xs hover:bg-gray-200 mt-1 dark:bg-[#3f3f47] dark:text-white dark:hover:bg-[#4a4a52]">{{ structure.right_child.right_child.participant_personal_number }}</button>
                          <div class="mt-2 text-[11px] text-gray-800 dark:text-white grid grid-cols-2 gap-2">
                            <div>Цикл: <span class="font-semibold">{{ getBD(structure.right_child.right_child.participant_id)?.cycle_number ?? '-' }}</span></div>
                            <div>Этап: <span class="font-semibold">{{ getBD(structure.right_child.right_child.participant_id)?.stage_number ?? '-' }}</span></div>
                          </div>
                        </div>
                        <div class="mt-2 text-[11px] text-gray-800 dark:text-white">
                          <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                            <div>Общий слева</div>
                            <div>Общий справа</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2 font-semibold mb-2">
                            <div>{{ getBD(structure.right_child.right_child.participant_id)?.total_left ?? '-' }}</div>
                            <div>{{ getBD(structure.right_child.right_child.participant_id)?.total_right ?? '-' }}</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2 text-[10px] opacity-70 mb-1">
                            <div>Текущий слева</div>
                            <div>Текущий справа</div>
                          </div>
                          <div class="grid grid-cols-2 gap-2 font-semibold">
                            <div>{{ currentLeft(structure.right_child.right_child.participant_id) }}</div>
                            <div>{{ currentRight(structure.right_child.right_child.participant_id) }}</div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="node invisible"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500">Нет данных</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api'

// centralized API client is used

const route = useRoute()
const router = useRouter()

const structure = ref(null)
const loading = ref(false)
const error = ref('')
// Кэш бонус-данных по участнику
const bonusByParticipant = ref({})

const participantId = ref(route.params.id || '')

const fetchStructure = async (id) => {
  if (!id) {
    structure.value = null
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get(`structure/${id}`)
    structure.value = data
    // после загрузки структуры подгружаем бонус-данные для всех присутствующих узлов
    const ids = collectParticipantIds(structure.value)
    await fetchBonusBatch(ids)
  } catch (e) {
    console.error(e)
    error.value = 'Ошибка загрузки структуры'
  } finally {
    loading.value = false
  }
}

const hasAnyChild = (node) => !!(node?.left_child || node?.right_child)

const nodeStyle = (node) => {
  const style = {}
  if (node && node.color) {
    style.background = `linear-gradient(${node.color})`
    style.borderRadius = '30px'
  }
  return style
}

const goTo = (id) => {
  if (!id) return
  router.push(`/structure/${id}`)
}

onMounted(() => {
  fetchStructure(participantId.value)
})

watch(() => route.params.id, (newId) => {
  participantId.value = newId || ''
  fetchStructure(participantId.value)
})

// Search state
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const showResults = ref(false)
let searchTimer = null

const onSearchInput = () => {
  const q = searchQuery.value.trim()
  showResults.value = q.length >= 3
  if (searchTimer) clearTimeout(searchTimer)
  if (q.length < 3) {
    searchResults.value = []
    return
  }
  searchTimer = setTimeout(() => {
    performSearch()
  }, 350)
}

const performSearch = async () => {
  const q = searchQuery.value.trim()
  if (q.length < 3) {
    searchResults.value = []
    showResults.value = false
    return
  }
  isSearching.value = true
  try {
    const { data } = await api.get(`participants/`, {
      params: { page: 1, page_size: 20, search: q }
    })
    searchResults.value = data?.participants || []
  } catch (e) {
    console.error('Ошибка поиска участников:', e)
    searchResults.value = []
  } finally {
    isSearching.value = false
    showResults.value = true
  }
}

const selectParticipant = (p) => {
  if (!p?.id) return
  showResults.value = false
  searchResults.value = []
  router.push(`/structure/${p.id}`)
}

// Сбор всех participant_id из дерева
function collectParticipantIds(root) {
  const result = new Set()
  function walk(node) {
    if (!node) return
    if (node.participant_id) result.add(node.participant_id)
    walk(node.left_child)
    walk(node.right_child)
  }
  walk(root)
  return Array.from(result)
}

// Загрузка бонус-данных для набора ID с кешированием
async function fetchBonusBatch(ids) {
  const toLoad = ids.filter((id) => !bonusByParticipant.value[id])
  await Promise.all(
    toLoad.map(async (id) => {
      try {
        const { data } = await api.get(`data/participant_bonus_data/${id}`)
        bonusByParticipant.value[id] = data
      } catch (e) {
        console.error('Ошибка загрузки бонус-данных участника', id, e)
        bonusByParticipant.value[id] = null
      }
    })
  )
}

// Доступ к бонус-данным одного участника
function getBD(id) {
  return bonusByParticipant.value[id] || null
}

// Текущие значения: слева = total_left - base_right, справа = total_right - base_left
function currentLeft(id) {
  const bd = getBD(id)
  if (!bd) return '-'
  const totalLeft = Number(bd.total_left || 0)
  const baseLeft = Number(bd.base_left || 0)
  return Math.max(totalLeft - baseLeft, 0)
}

function currentRight(id) {
  const bd = getBD(id)
  if (!bd) return '-'
  const totalRight = Number(bd.total_right || 0)
  const baseRight = Number(bd.base_right || 0)
  return Math.max(totalRight - baseRight, 0)
}
</script>

<style>
	.tree .branch {
		padding-top: 20px;
		position: relative;
		transition: all 0.5s;
	}

	.tree .node {
		display: inline-block;
		text-align: center;
		position: relative;
		padding: 20px 5px 0 5px;
		transition: all 0.5s;
	}

	/* Connecting lines */
	.tree .node::before, .tree .node::after {
		content: '';
		position: absolute;
		top: 0;
		right: 50%;
		border-top: 1px solid #ccc;
		width: 50%;
		height: 20px;
	}

	.tree .node::after {
		right: auto;
		left: 50%;
		border-left: 1px solid #ccc;
	}

	/* Remove lines for leaf nodes */
	.tree .node:only-child::after, .tree .node:only-child::before {
		display: none;
	}

	/* Connect parent to children */
	.tree .node:only-child {
		padding-top: 0;
	}

	.tree .node:first-child::before, .tree .node:last-child::after {
		border: 0 none;
	}

	.tree .node:last-child::before {
		border-right: 1px solid #ccc;
		border-radius: 0 5px 0 0;
	}

	.tree .node:first-child::after {
		border-radius: 5px 0 0 0;
	}

	/* Line connecting sibling branches */
	.tree .branch::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		border-left: 1px solid #ccc;
		width: 0;
		height: 20px;
	}

	.tree .node-content {
		text-decoration: none;
		color: #000000;
		font-family: arial, verdana, tahoma;
		font-size: 11px;
		display: inline-grid;
		place-items: center;
		border-radius: 5px;
		transition: all 0.5s;
		cursor: pointer;
		border: 1px solid #000000;
		background-color: #ffffff;
		width: 200px;
		height: 200px;
	}

	.tree .node-content:hover {
		background: #ffffff;
		color: #000;
	}
	.node.invisible {
		visibility: hidden;
	}
	.tree .branch {
		display: flex;
		justify-content: center;
	}
	/* Ensure the container is positioned relative */
	.search-container {
		position: relative;
	}
	
	/* Style the search results */
	#search-results {
		position: absolute;
		top: 100%; /* Position it directly below the search input */
		left: 0;
		right: 0;
		z-index: 1000; /* A high value to ensure it appears above other elements */
		background-color: white; /* Background color to cover content beneath */
		border: 1px solid #ccc; /* Optional: Add a border for visual separation */
	}

  /* Dark mode overrides */
  :root.dark #search-results {
    background-color: #3f3f47;
    border-color: #4a4a52;
    color: #ffffff;
  }

  :root.dark .tree .node-content {
    color: #ffffff;
    background-color: #3f3f47;
    border-color: #4a4a52;
  }

  :root.dark .tree .node-content:hover {
    background-color: #4a4a52;
    color: #ffffff;
  }
</style>
