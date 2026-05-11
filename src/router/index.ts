import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { mobileRoutes } from '@/mobile/router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'calendar',
          name: 'Calendar',
          component: () => import('@/views/CalendarView.vue'),
        },
        {
          path: 'todo',
          name: 'Todo',
          component: () => import('@/views/TodoView.vue'),
        },
        {
          path: 'dates',
          name: 'ImportantDates',
          component: () => import('@/views/ImportantDatesView.vue'),
        },
        {
          path: 'course',
          name: 'Course',
          component: () => import('@/views/CourseGridView.vue'),
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/views/SettingsView.vue'),
        },
      ],
    },
    mobileRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

function getCurrentUser() {
  const auth = getAuth()
  return auth.authStateReady().then(() => auth.currentUser)
}

router.beforeEach(async (to, _from, next) => {
  const user = await getCurrentUser()
  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else if (to.meta.guest && user) {
    next('/')
  } else {
    next()
  }
})

export default router
