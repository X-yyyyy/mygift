<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useCourseStore } from '@/stores/course'
import { useSemesterStore } from '@/stores/semester'
import { useCalendarStore } from '@/stores/calendar'
import { useTimeSlotStore } from '@/stores/timeSlot'
import { toDate } from '@/types'

const courseStore = useCourseStore()
const semesterStore = useSemesterStore()
const calendarStore = useCalendarStore()
const timeSlotStore = useTimeSlotStore()
const activeTab = ref<'today' | 'week'>('today')

onMounted(() => {
  courseStore.fetchCourses()
  semesterStore.fetchSemester()
  calendarStore.fetchEvents()
  timeSlotStore.fetchTimeSlots()
})

const todayIndex = computed(() => {
  const d = dayjs().day()
  return d === 0 ? 6 : d - 1
})

const todayCourses = computed(() => {
  const dow = todayIndex.value + 1
  const week = semesterStore.currentWeek
  return courseStore.courses
    .filter(c => c.schedules?.some(s => s.dayOfWeek === dow && courseStore.isScheduleVisible(s, week)))
    .flatMap(c =>
      c.schedules
        .filter(s => s.dayOfWeek === dow && courseStore.isScheduleVisible(s, week))
        .map(s => ({
          name: c.name,
          location: c.location,
          color: c.color,
          startSlot: s.startSlot,
          duration: s.duration,
          startTime: timeSlotStore.timeSlots.find(t => t.slot === s.startSlot)?.startTime || '',
        }))
    )
    .sort((a, b) => a.startSlot - b.startSlot)
})

const todayEvents = computed(() => {
  const today = dayjs().format('YYYY-MM-DD')
  return calendarStore.events.filter(ev => {
    const d = toDate(ev.date) ? dayjs(toDate(ev.date)).format('YYYY-MM-DD') : ''
    return d === today
  })
})

const dayLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const weekCourses = computed(() => {
  const week = semesterStore.currentWeek
  const byDay: Record<number, { name: string; color: string }[]> = {}
  for (let d = 1; d <= 7; d++) {
    byDay[d] = courseStore.courses
      .filter(c => c.schedules?.some(s => s.dayOfWeek === d && courseStore.isScheduleVisible(s, week)))
      .map(c => ({ name: c.name, color: c.color }))
  }
  return byDay
})
</script>

<template>
  <div class="schedule-widget">
    <el-tabs v-model="activeTab" class="widget-tabs">
      <el-tab-pane label="今日" name="today">
        <div v-if="todayCourses.length === 0 && todayEvents.length === 0" class="empty">
          今天没有安排
        </div>
        <div
          v-for="(c, i) in todayCourses"
          :key="'c' + i"
          class="schedule-item"
        >
          <div class="schedule-time">{{ c.startTime }}</div>
          <div class="schedule-dot" :style="{ background: c.color }" />
          <div class="schedule-info">
            <span class="schedule-name">{{ c.name }}</span>
            <span v-if="c.location" class="schedule-location">{{ c.location }}</span>
          </div>
        </div>
        <div
          v-for="ev in todayEvents"
          :key="'e' + ev.id"
          class="schedule-item event"
        >
          <div class="schedule-time">{{ ev.time || '全天' }}</div>
          <div class="schedule-dot" style="background: var(--el-color-warning)" />
          <div class="schedule-info">
            <span class="schedule-name">{{ ev.title }}</span>
            <span v-if="ev.note" class="schedule-location">{{ ev.note }}</span>
          </div>
        </div>
        <router-link to="/course" class="view-more">查看完整课表 →</router-link>
      </el-tab-pane>
      <el-tab-pane label="本周" name="week">
        <div class="week-grid">
          <div v-for="d in 7" :key="d" class="week-col">
            <div class="week-col-header">{{ dayLabels[d - 1] }}</div>
            <div
              v-for="c in weekCourses[d]"
              :key="c.name + d"
              class="week-course-block"
              :style="{ background: c.color + '30', borderLeftColor: c.color }"
            >
              {{ c.name }}
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.schedule-widget { font-size: 14px; }
.widget-tabs { margin-top: -8px; }
.empty { color: var(--el-text-color-secondary); padding: 16px 0; text-align: center; font-size: 13px; }
.schedule-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}
.schedule-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  min-width: 48px;
  font-variant-numeric: tabular-nums;
}
.schedule-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.schedule-info { flex: 1; display: flex; gap: 8px; align-items: center; }
.schedule-name { color: var(--el-text-color-primary); }
.schedule-location { font-size: 12px; color: var(--el-text-color-secondary); }
.view-more {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: var(--sage);
  text-decoration: none;
}
.week-grid { display: flex; gap: 4px; }
.week-col { flex: 1; min-width: 0; }
.week-col-header {
  text-align: center;
  font-size: 11px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
  font-family: "Noto Serif SC", "Songti SC", serif;
}
.week-course-block {
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 3px;
  border-left: 3px solid;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
