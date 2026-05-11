import type { RouteRecordRaw } from 'vue-router'

export const mobileRoutes: RouteRecordRaw = {
  path: '/m',
  component: () => import('@/mobile/layout/MobileLayout.vue'),
  meta: { requiresAuth: true },
  children: [
    { path: '', redirect: '/m/home' },
    { path: 'home', component: () => import('@/mobile/views/HomeView.vue') },
    { path: 'schedule', component: () => import('@/mobile/views/ScheduleView.vue') },
    { path: 'course', component: () => import('@/mobile/views/CourseView.vue') },
    { path: 'csgo', component: () => import('@/mobile/views/CsgoView.vue') },
    { path: 'settings', component: () => import('@/mobile/views/SettingsView.vue') },
  ],
}
