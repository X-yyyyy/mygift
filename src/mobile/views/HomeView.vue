<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useWeatherStore } from '@/stores/weather'
import { useTodoStore } from '@/stores/todo'
import { useImportantDateStore } from '@/stores/importantDates'
import { useCourseStore } from '@/stores/course'
import { useTimeSlotStore } from '@/stores/timeSlot'
import { useSemesterStore } from '@/stores/semester'
import { useCsgoStore } from '@/stores/csgo'
import { toDate } from '@/types'
import type { TodoItem } from '@/types'

const weatherStore = useWeatherStore()
const todoStore = useTodoStore()
const dateStore = useImportantDateStore()
const courseStore = useCourseStore()
const timeSlotStore = useTimeSlotStore()
const semesterStore = useSemesterStore()
const csgoStore = useCsgoStore()

const todayTodos = computed(() =>
  todoStore.todos.filter(t => !t.done).slice(0, 8)
)

const upcomingDates = computed(() =>
  dateStore.dates
    .filter(d => {
      const dt = toDate(d.date)
      return dt && dt >= new Date()
    })
    .sort((a, b) => (toDate(a.date)?.getTime() ?? 0) - (toDate(b.date)?.getTime() ?? 0))
    .slice(0, 4)
)

const todayCourses = computed(() => {
  const dayOfWeek = dayjs().day() === 0 ? 7 : dayjs().day()
  const week = semesterStore.currentWeek
  return courseStore.courses.filter(c =>
    c.schedules?.some(s => s.dayOfWeek === dayOfWeek && courseStore.isScheduleVisible(s, week))
  ).map(c => {
    const sched = c.schedules!.find(s => s.dayOfWeek === dayOfWeek && courseStore.isScheduleVisible(s, week))
    const slot = timeSlotStore.timeSlots.find(ts => ts.slot === sched?.startSlot)
    return {
      name: c.name,
      location: c.location,
      color: c.color,
      time: slot ? `${slot.startTime}` : '',
    }
  }).sort((a, b) => a.time.localeCompare(b.time))
})

const liveEvents = computed(() =>
  csgoStore.events.filter(e => {
    const now = new Date()
    const start = e.startDate ? new Date(e.startDate) : null
    const end = e.endDate ? new Date(e.endDate) : null
    return start && end && start <= now && end >= now
  })
)

function toggleTodo(todo: TodoItem) {
  todoStore.toggleDone(todo.id!, todo.done)
}

function formatCountdown(d: any): string {
  const dt = toDate(d.date)
  if (!dt) return ''
  const diff = dayjs(dt).diff(dayjs(), 'day') + 1
  if (diff <= 0) return ''
  return `距离 ${d.name} 还有 ${diff} 天`
}
</script>

<template>
  <div class="home-view">
    <!-- Weather -->
    <van-cell-group inset class="section">
      <van-cell>
        <template #title>
          <div class="weather-row">
            <span class="weather-temp">{{ weatherStore.current?.temp ?? '--' }}°C</span>
            <span class="weather-city">{{ weatherStore.city }}</span>
            <span v-if="weatherStore.current" class="weather-desc">
              体感 {{ weatherStore.current.feelsLike }}°C · 湿度 {{ weatherStore.current.humidity }}%
            </span>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- Today's Todos -->
    <van-cell-group inset class="section">
      <template #title>
        <div class="section-header">
          <span>今日待办</span>
          <span class="section-badge">{{ todoStore.todos.filter(t => !t.done).length }}</span>
        </div>
      </template>
      <van-cell v-for="todo in todayTodos" :key="todo.id">
        <template #title>
          <div class="todo-row" :class="{ done: todo.done }">
            <van-checkbox :model-value="todo.done" @click="toggleTodo(todo)" shape="square" size="18px" />
            <span class="todo-text">{{ todo.content }}</span>
          </div>
        </template>
      </van-cell>
      <van-cell v-if="todayTodos.length === 0">
        <template #title><span class="empty-text">没有待办</span></template>
      </van-cell>
    </van-cell-group>

    <!-- Countdown -->
    <van-cell-group inset class="section" v-if="upcomingDates.length">
      <template #title>即将到来</template>
      <van-cell v-for="d in upcomingDates" :key="d.id">
        <template #title>
          <div class="countdown-row">
            <div class="countdown-dot" :style="{ background: d.color }" />
            <span>{{ formatCountdown(d) }}</span>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- Today's Courses -->
    <van-cell-group inset class="section">
      <template #title>今日课程</template>
      <van-cell v-for="c in todayCourses" :key="c.name + c.time">
        <template #title>
          <div class="course-row">
            <div class="course-color" :style="{ background: c.color }" />
            <span class="course-time">{{ c.time }}</span>
            <span class="course-name">{{ c.name }}</span>
            <span class="course-location">{{ c.location }}</span>
          </div>
        </template>
      </van-cell>
      <van-cell v-if="todayCourses.length === 0">
        <template #title><span class="empty-text">今日无课</span></template>
      </van-cell>
    </van-cell-group>

    <!-- Live CSGO Events -->
    <van-cell-group inset class="section" v-if="liveEvents.length">
      <template #title>
        <div class="section-header"><span class="live-dot" /> 正在进行</div>
      </template>
      <van-cell v-for="e in liveEvents" :key="e.id">
        <template #title>
          <div class="csgo-match">{{ e.matchName }}</div>
          <div class="csgo-teams">{{ e.team1 }} vs {{ e.team2 }}</div>
          <div class="csgo-time">{{ e.beginAt ? dayjs(e.beginAt).format('HH:mm') : '' }}</div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<style scoped>
.home-view { padding-bottom: 16px; }
.section { margin-bottom: 12px; }
.section-header { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #3D3D35; }
.section-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; border-radius: 50%;
  background: #5A6B4A; color: #fff; font-size: 11px;
}
.weather-row { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.weather-temp { font-size: 24px; font-weight: 700; color: #3D3D35; }
.weather-city { font-size: 14px; color: #5A6B4A; font-weight: 500; }
.weather-desc { font-size: 13px; color: #8A8A7A; }
.todo-row { display: flex; align-items: center; gap: 10px; }
.todo-row.done .todo-text { text-decoration: line-through; color: #B5B5A5; }
.todo-text { font-size: 14px; color: #3D3D35; }
.empty-text { color: #B5B5A5; font-size: 13px; }
.countdown-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #3D3D35; }
.countdown-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.course-row { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.course-color { width: 4px; height: 16px; border-radius: 2px; flex-shrink: 0; }
.course-time { color: #5A6B4A; font-weight: 500; min-width: 36px; }
.course-name { flex: 1; color: #3D3D35; }
.course-location { color: #8A8A7A; font-size: 12px; }
.live-dot {
  display: inline-block; width: 8px; height: 8px;
  border-radius: 50%; background: #e74c3c; animation: pulse 1.5s infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.csgo-match { font-weight: 500; font-size: 14px; color: #3D3D35; }
.csgo-teams { font-size: 12px; color: #5A6B4A; margin-top: 2px; }
.csgo-time { font-size: 12px; color: #8A8A7A; }
</style>
