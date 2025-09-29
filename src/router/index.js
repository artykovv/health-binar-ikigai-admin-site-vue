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
import UserRegistration from '../views/UserRegistration.vue'
import UserEdit from '../views/UserEdit.vue'
import Structure from '../views/Structure.vue'
import AddToStructure from '../views/AddToStructure.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/participants',
    name: 'Participants',
    component: Participants
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration
  },
  {
    path: '/branches',
    name: 'Branches',
    component: Branches
  },
  {
    path: '/bonuses',
    name: 'Bonuses',
    component: Bonuses
  },
  {
    path: '/bonuses/multibonus',
    name: 'Multibonus',
    component: Bonuses,
    props: { defaultTab: 'multibonus' }
  },
  {
    path: '/bonuses/structural',
    name: 'StructuralBonus',
    component: Bonuses,
    props: { defaultTab: 'structural' }
  },
  {
    path: '/bonuses/sponsor',
    name: 'SponsorBonus',
    component: Bonuses,
    props: { defaultTab: 'sponsor' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/report',
    name: 'Report',
    component: Report
  },
  {
    path: '/participants/:id',
    name: 'ParticipantView',
    component: ParticipantView
  },
  {
    path: '/purchase',
    name: 'Purchases',
    component: Purchases
  },
  {
    path: '/purchase/:id',
    name: 'Purchase',
    component: Purchase
  },
  {
    path: '/registration/new',
    name: 'UserRegistration',
    component: UserRegistration
  },
  {
    path: '/registration/edit/:id',
    name: 'UserEdit',
    component: UserEdit
  },
  {
    path: '/structure/:id?',
    name: 'Structure',
    component: Structure
  },
  {
    path: '/registration/add-to-structure/:id',
    name: 'AddToStructure',
    component: AddToStructure
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
