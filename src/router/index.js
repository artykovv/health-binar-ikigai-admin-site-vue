import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Participants from '../views/Participants.vue'
import Registration from '../views/Registration.vue'
import Branches from '../views/Branches.vue'
import Bonuses from '../views/Bonuses.vue'
import Settings from '../views/Settings.vue'
import ParticipantView from '../views/ParticipantView.vue'
import Purchase from '../views/Purchase.vue'
import Purchases from '../views/Purchases.vue'
import Report from '../views/Report.vue'
import Sponsored from '../views/Sponsored.vue'
import UserRegistration from '../views/UserRegistration.vue'
import UserEdit from '../views/UserEdit.vue'
import Structure from '../views/Structure.vue'
import AddToStructure from '../views/AddToStructure.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Главная' }
  },
  {
    path: '/participants',
    name: 'Participants',
    component: Participants,
    meta: { title: 'Участники' }
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
    meta: { title: 'Регистрация' }
  },
  {
    path: '/branches',
    name: 'Branches',
    component: Branches,
    meta: { title: 'Филиалы' }
  },
  {
    path: '/bonuses',
    name: 'Bonuses',
    component: Bonuses,
    meta: { title: 'Бонусы' }
  },
  {
    path: '/bonuses/multibonus',
    name: 'Multibonus',
    component: Bonuses,
    props: { defaultTab: 'multibonus' },
    meta: { title: 'Бонусы — Мультибонус' }
  },
  {
    path: '/bonuses/structural',
    name: 'StructuralBonus',
    component: Bonuses,
    props: { defaultTab: 'structural' },
    meta: { title: 'Бонусы — Структурный' }
  },
  {
    path: '/bonuses/sponsor',
    name: 'SponsorBonus',
    component: Bonuses,
    props: { defaultTab: 'sponsor' },
    meta: { title: 'Бонусы — Спонсорский' }
  },
  {
    path: '/bonuses/gifts',
    name: 'Gifts',
    component: Bonuses,
    props: { defaultTab: 'gifts' },
    meta: { title: 'Бонусы — Подарки' }
  },
  {
    path: '/bonuses/health_day',
    name: 'HealthDay',
    component: Bonuses,
    props: { defaultTab: 'health_day' },
    meta: { title: 'Бонусы — Health Day' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { title: 'Настройки' }
  },
  {
    path: '/report',
    name: 'Report',
    component: Report,
    meta: { title: 'Отчёты' }
  },
  {
    path: '/participants/:id',
    name: 'ParticipantView',
    component: ParticipantView,
    meta: { title: 'Участник' }
  },
  {
    path: '/sponsored/:id',
    name: 'Sponsored',
    component: Sponsored,
    meta: { title: 'Личники' }
  },
  {
    path: '/purchase',
    name: 'Purchases',
    component: Purchases,
    meta: { title: 'Покупки' }
  },
  {
    path: '/purchase/:id',
    name: 'Purchase',
    component: Purchase,
    meta: { title: 'Покупка' }
  },
  {
    path: '/registration/new',
    name: 'UserRegistration',
    component: UserRegistration,
    meta: { title: 'Новая регистрация' }
  },
  {
    path: '/registration/edit/:id',
    name: 'UserEdit',
    component: UserEdit,
    meta: { title: 'Изменение участника' }
  },
  {
    path: '/structure/:id?',
    name: 'Structure',
    component: Structure,
    meta: { title: 'Структура' }
  },
  {
    path: '/registration/add-to-structure/:id',
    name: 'AddToStructure',
    component: AddToStructure,
    meta: { title: 'Добавить в структуру' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Установка заголовка страницы из meta.title
router.afterEach((to) => {
  const defaultTitle = 'Ikigai'
  if (to && to.meta && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = defaultTitle
  }
})

export default router
