<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSemesterStore } from '@/stores/semester'
import { useCourseStore } from '@/stores/course'
import { useTimeSlotStore } from '@/stores/timeSlot'
import { useTodoStore } from '@/stores/todo'
import { useCalendarStore } from '@/stores/calendar'
import { useImportantDateStore } from '@/stores/importantDates'
import { useCsgoStore } from '@/stores/csgo'
import { useWeatherStore } from '@/stores/weather'
import MobileNavBar from '@/mobile/components/MobileNavBar.vue'

const router = useRouter()
const route = useRoute()

const semesterStore = useSemesterStore()
const courseStore = useCourseStore()
const timeSlotStore = useTimeSlotStore()
const todoStore = useTodoStore()
const calendarStore = useCalendarStore()
const dateStore = useImportantDateStore()
const csgoStore = useCsgoStore()
const weatherStore = useWeatherStore()

onMounted(() => {
  semesterStore.fetchSemester()
  courseStore.fetchCourses()
  timeSlotStore.fetchTimeSlots()
  todoStore.fetchTodos()
  calendarStore.fetchEvents()
  dateStore.fetchDates()
  csgoStore.refresh()
  weatherStore.refresh()
})

const activeTab = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments.length >= 2 ? segments[1] : ''
})

const titleMap: Record<string, string> = {
  home: '首页',
  schedule: '日程',
  course: '课表',
  csgo: 'CSGO 赛事',
  settings: '设置',
}

const pageTitle = computed(() => titleMap[activeTab.value] || '')

const tabs = [
  { name: 'home', icon: 'home-o', label: '首页' },
  { name: 'schedule', icon: 'notes-o', label: '日程' },
  { name: 'course', icon: 'bar-chart-o', label: '课表' },
  { name: 'csgo', icon: 'tv-o', label: '赛事' },
  { name: 'settings', icon: 'setting-o', label: '设置' },
]

function onTabChange(name: string) {
  router.replace(`/m/${name}`)
}
</script>

<template>
  <div class="mobile-container">
    <MobileNavBar :title="pageTitle" />
    <div class="mobile-content">
      <router-view />
    </div>
    <van-tabbar active-color="#5A6B4A" inactive-color="#8A8A7A" :model-value="activeTab" @change="onTabChange">
      <van-tabbar-item v-for="tab in tabs" :key="tab.name" :name="tab.name" :icon="tab.icon">
        {{ tab.label }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped>
.mobile-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f0;
}
.mobile-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  padding-bottom: 4px;
}
</style>
