<script setup lang="ts">
import { onMounted } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useCourseStore } from '@/stores/course'
import { useTodoStore } from '@/stores/todo'
import { useCalendarStore } from '@/stores/calendar'
import { useImportantDateStore } from '@/stores/importantDates'
import { useCsgoStore } from '@/stores/csgo'
import { useSemesterStore } from '@/stores/semester'
import WeatherWidget from '@/components/widgets/WeatherWidget.vue'
import ScheduleWidget from '@/components/widgets/ScheduleWidget.vue'
import ImportantDatesWidget from '@/components/widgets/ImportantDatesWidget.vue'
import TodoWidget from '@/components/widgets/TodoWidget.vue'
import CsgoWidget from '@/components/widgets/CsgoWidget.vue'

const courseStore = useCourseStore()
const todoStore = useTodoStore()
const calendarStore = useCalendarStore()
const dateStore = useImportantDateStore()
const csgoStore = useCsgoStore()
const semesterStore = useSemesterStore()

dayjs.locale('zh-cn')

onMounted(() => {
  todoStore.fetchTodos()
  dateStore.fetchDates()
  csgoStore.refresh()
  courseStore.fetchCourses()
  semesterStore.fetchSemester()
  calendarStore.fetchEvents()
})
</script>

<template>
  <div class="dashboard">
    <!-- Top Overview Bar -->
    <div class="overview-bar">
      <WeatherWidget />
      <div class="overview-right">
        <div class="date-display">{{ dayjs().format('YYYY年M月D日 dddd') }}</div>
        <div class="today-summary">
          {{ courseStore.courses.length ? `${courseStore.courses.length} 门课` : '' }}
          {{ todoStore.todos.filter(t => !t.done).length ? `· ${todoStore.todos.filter(t => !t.done).length} 项待办` : '' }}
        </div>
      </div>
    </div>

    <!-- Widget Grid -->
    <div class="widget-grid">
      <div class="widget-card card-schedule">
        <div class="widget-title">
          <span class="title-icon">📅</span> 日程课表
        </div>
        <ScheduleWidget />
      </div>

      <div class="widget-card card-dates">
        <div class="widget-title">
          <span class="title-icon">🎯</span> 重大日期
        </div>
        <ImportantDatesWidget />
      </div>

      <div class="widget-card card-todo">
        <div class="widget-title">
          <span class="title-icon">✅</span> 待办
        </div>
        <TodoWidget />
      </div>

      <div class="widget-card card-csgo">
        <div class="widget-title">
          <span class="title-icon">🎮</span> CSGO 赛事
        </div>
        <CsgoWidget />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}
.overview-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--warm-card);
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid var(--warm-border);
  box-shadow: var(--el-box-shadow-light);
}
.overview-right { text-align: right; }
.date-display {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  font-family: "Noto Serif SC", "Songti SC", serif;
}
.today-summary { font-size: 13px; color: var(--el-text-color-secondary); margin-top: 2px; }
.widget-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.widget-card {
  background: var(--warm-card);
  border-radius: 12px;
  padding: 16px 20px;
  border: 1px solid var(--warm-border);
  box-shadow: var(--el-box-shadow-light);
  transition: box-shadow 0.2s;
}
.widget-card:hover {
  box-shadow: var(--el-box-shadow);
}
.widget-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--warm-border);
  display: flex;
  align-items: center;
  gap: 6px;
}
.title-icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .widget-grid {
    grid-template-columns: 1fr;
  }
  .overview-bar {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  .overview-right { text-align: left; }
}
</style>
