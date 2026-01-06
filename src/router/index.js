import { createRouter, createWebHistory } from 'vue-router'
import SidebarLayout from '../components/SidebarLayout.vue'

// Binar views
import BinarDashboard from '../views/binar/Dashboard.vue'
import Structure from '../views/binar/Structure.vue'
import Participants from '../views/binar/Participants.vue'
import Registration from '../views/binar/Registration.vue'
import Branches from '../views/binar/Branches.vue'
import Bonuses from '../views/binar/Bonuses.vue'
import Report from '../views/binar/Report.vue'
import ParticipantView from '../views/binar/ParticipantView.vue'
import AddToStructure from '../views/binar/AddToStructure.vue'
import UserRegistration from '../views/binar/UserRegistration.vue'
import UserEdit from '../views/binar/UserEdit.vue'
import Sponsored from '../views/binar/Sponsored.vue'
import Orders from '../views/binar/Orders.vue'

// Health Store views
import HealthStoreDashboard from '../views/health-store/Dashboard.vue'
import HealthStoreOrders from '../views/health-store/Orders.vue'
import HealthStoreSettings from '../views/health-store/Settings.vue'
import HealthStoreSalespeople from '../views/health-store/Salespeople.vue'
import HealthStoreEK from '../views/health-store/EK.vue'

// IV Bar views
import IVBarDashboard from '../views/ivbar/Dashboard.vue'

// MyBeauty views
import MyBeautyDashboard from '../views/mybeauty/Dashboard.vue'

// Kassa views
import KassaDashboard from '../views/kassa/Dashboard.vue'
import KassaTerminal from '../views/kassa/Kassa.vue'
import KassaExpenses from '../views/kassa/Expenses.vue'
import KassaIncome from '../views/kassa/Income.vue'
import KassaSettings from '../views/kassa/Settings.vue'

// Products views
import ProductsDashboard from '../views/products/Dashboard.vue'
import Attributes from '../views/products/Attributes.vue'
import Products from '../views/products/Products.vue'
import ProductPage from '../views/products/ProductPage.vue'
import StockReceiptsList from '../views/products/StockReceiptsList.vue'
import StockReceipt from '../views/products/StockReceipt.vue'

// Welcome page
import Welcome from '../views/Welcome.vue'

const routes = [
  // Welcome page
  {
    path: '/',
    name: 'Welcome',
    component: Welcome,
    meta: { title: 'Главная' }
  },
  
  // Binar routes
  {
    path: '/binar',
    component: SidebarLayout,
    children: [
      {
        path: '',
        name: 'BinarDashboard',
        component: BinarDashboard,
        meta: { title: 'MLM' }
      },
      {
        path: 'structure',
        name: 'Structure',
        component: Structure,
        meta: { title: 'Структура' }
      },
      {
        path: 'structure/:id',
        name: 'StructureView',
        component: Structure,
        meta: { title: 'Структура' }
      },
      {
        path: 'participants',
        name: 'Participants',
        component: Participants,
        meta: { title: 'Участники' }
      },
      {
        path: 'registration',
        name: 'Registration',
        component: Registration,
        meta: { title: 'Регистрации' }
      },
      {
        path: 'branches',
        name: 'Branches',
        component: Branches,
        meta: { title: 'Филиалы' }
      },
      {
        path: 'bonuses',
        name: 'Bonuses',
        component: Bonuses,
        meta: { title: 'Бонусы' }
      },
      {
        path: 'bonuses/:tab',
        name: 'BonusesTab',
        component: Bonuses,
        meta: { title: 'Бонусы' }
      },
      {
        path: 'report',
        name: 'Report',
        component: Report,
        meta: { title: 'Отчет' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: Orders,
        meta: { title: 'Заказы' }
      },
      {
        path: 'participant/:id',
        name: 'ParticipantView',
        component: ParticipantView,
        meta: { title: 'Участник' }
      },
      {
        path: 'registration/participant/:id',
        name: 'RegistrationParticipantView',
        component: ParticipantView,
        meta: { title: 'Участник' }
      },
      {
        path: 'add-to-structure/:id',
        name: 'AddToStructure',
        component: AddToStructure,
        meta: { title: 'Добавить в структуру' }
      },
      {
        path: 'user-registration',
        name: 'UserRegistration',
        component: UserRegistration,
        meta: { title: 'Регистрация пользователя' }
      },
      {
        path: 'user-edit/:id',
        name: 'UserEdit',
        component: UserEdit,
        meta: { title: 'Редактирование пользователя' }
      },
      {
        path: 'registration/user-edit/:id',
        name: 'RegistrationUserEdit',
        component: UserEdit,
        meta: { title: 'Редактирование пользователя' }
      },
      {
        path: 'sponsored/:id',
        name: 'Sponsored',
        component: Sponsored,
        meta: { title: 'Спонсоры' }
      }
    ]
  },

  // Health Store routes
  {
    path: '/health-store',
    component: SidebarLayout,
    children: [
      {
        path: '',
        name: 'HealthStoreDashboard',
        component: HealthStoreDashboard,
        meta: { title: 'Health Store' }
      },
      {
        path: 'orders',
        name: 'HealthStoreOrders',
        component: HealthStoreOrders,
        meta: { title: 'Заказы Health Store' }
      },
      {
        path: 'settings',
        name: 'HealthStoreSettings',
        component: HealthStoreSettings,
        meta: { title: 'Настройки Health Store' }
      },
      {
        path: 'salespeople',
        name: 'HealthStoreSalespeople',
        component: HealthStoreSalespeople,
        meta: { title: 'Отчет по продажникам' }
      }
    ]
  },

  // EK routes
  {
    path: '/ek',
    component: SidebarLayout,
    children: [
      {
        path: '',
        name: 'HealthStoreEK',
        component: HealthStoreEK,
        meta: { title: 'Списания товаров (EK)' }
      }
    ]
  },

  // IV Bar routes
  {
    path: '/ivbar',
    component: SidebarLayout,
    children: [
      {
        path: '',
        name: 'IVBarDashboard',
        component: IVBarDashboard,
        meta: { title: 'IV Bar' }
      }
    ]
  },

  // MyBeauty routes
  {
    path: '/mybeauty',
    component: SidebarLayout,
    children: [
      {
        path: '',
        name: 'MyBeautyDashboard',
        component: MyBeautyDashboard,
        meta: { title: 'MyBeauty' }
      }
    ]
  },

  // Kassa routes
  {
    path: '/kassa',
    component: SidebarLayout,
    children: [
      {
        path: '',
        name: 'KassaDashboard',
        component: KassaDashboard,
        meta: { title: 'Главная' }
      },
      {
        path: 'pos',
        name: 'KassaPOS',
        component: KassaTerminal,
        meta: { title: 'Касса' }
      },
      {
        path: 'expenses',
        name: 'KassaExpenses',
        component: KassaExpenses,
        meta: { title: 'Расходы' }
      },
      {
        path: 'income',
        name: 'KassaIncome',
        component: KassaIncome,
        meta: { title: 'Доходы' }
      },
      {
        path: 'settings',
        name: 'KassaSettings',
        component: KassaSettings,
        meta: { title: 'Настройки кассы' }
      }
    ]
  },

  // Products routes
  {
    path: '/products',
    component: SidebarLayout,
    children: [
      {
        path: '',
        name: 'ProductsDashboard',
        component: ProductsDashboard,
        meta: { title: 'Склад' }
      },
      {
        path: 'attributes',
        name: 'Attributes',
        component: Attributes,
        meta: { title: 'Атрибуты товаров' }
      },
      {
        path: 'products',
        name: 'Products',
        component: Products,
        meta: { title: 'Товары' }
      },
      {
        path: 'product/:id',
        name: 'ProductPage',
        component: ProductPage,
        meta: { title: 'Товар' }
      },
      {
        path: 'receipt',
        name: 'StockReceiptsList',
        component: StockReceiptsList,
        meta: { title: 'Приход товара' }
      },
      {
        path: 'receipt/new',
        name: 'StockReceiptNew',
        component: StockReceipt,
        meta: { title: 'Новый приход' }
      }
    ]
  },

  // Legacy routes for backward compatibility (redirect to new structure)
  {
    path: '/home',
    redirect: '/binar'
  },
  {
    path: '/structure',
    redirect: '/binar/structure'
  },
  {
    path: '/participants',
    redirect: '/binar/participants'
  },
  {
    path: '/registration',
    redirect: '/binar/registration'
  },
  {
    path: '/branches',
    redirect: '/binar/branches'
  },
  {
    path: '/bonuses',
    redirect: '/binar/bonuses'
  },
  {
    path: '/report',
    redirect: '/binar/report'
  },
  {
    path: '/products',
    redirect: '/products/products'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Update document title based on route meta
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Health Admin`
  } else {
    document.title = 'Health Admin'
  }
  next()
})

export default router