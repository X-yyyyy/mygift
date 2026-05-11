<!-- src/mobile/views/ScheduleView.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useTodoStore } from '@/stores/todo'
import type { TodoItem } from '@/types'
import { toDate } from '@/types'

const todoStore = useTodoStore()

dayjs.locale('zh-cn')

const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const showCalendar = ref(false)

const weekDays = computed(() => {
  const today = dayjs()
  return Array.from({ length: 7 }, (_, i) => {
    const d = today.startOf('week').add(i, 'day')
    return {
      date: d.format('YYYY-MM-DD'),
      dayName: d.format('ddd'),
      dayNum: d.format('D'),
      isToday: d.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'),
    }
  })
})

const filteredTodos = computed(() =>
  todoStore.todos.filter(t => {
    if (!t.dueDate) return false
    const dt = toDate(t.dueDate)
    return dt && dayjs(dt).format('YYYY-MM-DD') === selectedDate.value
  })
)

const newContent = ref('')

function selectDate(dateStr: string) {
  selectedDate.value = dateStr
}

function onCalendarConfirm(date: Date) {
  selectedDate.value = dayjs(date).format('YYYY-MM-DD')
  showCalendar.value = false
}

async function addTodo() {
  const content = newContent.value.trim()
  if (!content) return
  await todoStore.addTodo({
    content,
    done: false,
    dueDate: new Date(selectedDate.value),
    createdAt: new Date(),
  })
  newContent.value = ''
}

function toggleTodo(todo: TodoItem) {
  todoStore.toggleDone(todo.id!, todo.done)
}
</script>

<template>
  <div class="schedule-view">
    <!-- Date header -->
    <div class="date-header">
      <span class="date-display">{{ dayjs(selectedDate).format('M月D日 dddd') }}</span>
      <van-button icon="calendar-o" size="small" plain @click="showCalendar = true" />
    </div>

    <!-- Week bar -->
    <div class="week-bar">
      <div
        v-for="d in weekDays"
        :key="d.date"
        class="week-day"
        :class="{ active: d.date === selectedDate, today: d.isToday }"
        @click="selectDate(d.date)"
      >
        <span class="day-name">{{ d.dayName }}</span>
        <span class="day-num">{{ d.dayNum }}</span>
      </div>
    </div>

    <!-- Todo list for selected date -->
    <div class="todo-section">
      <div class="todo-header">{{ dayjs(selectedDate).format('M月D日') }} 待办</div>
      <div v-for="todo in filteredTodos" :key="todo.id" class="todo-item">
        <van-checkbox :model-value="todo.done" @click="toggleTodo(todo)" shape="square" size="18px" />
        <span class="todo-text" :class="{ done: todo.done }">{{ todo.content }}</span>
      </div>
      <div v-if="filteredTodos.length === 0" class="empty">暂无待办</div>
    </div>

    <!-- Quick add -->
    <div class="add-bar">
      <van-field
        v-model="newContent"
        placeholder="添加待办..."
        @keyup.enter="addTodo"
        clearable
      />
      <van-button type="primary" size="small" @click="addTodo">添加</van-button>
    </div>

    <!-- Calendar popup -->
    <van-calendar
      v-model:show="showCalendar"
      @confirm="onCalendarConfirm"
      :min-date="dayjs().subtract(1, 'year').toDate()"
      :max-date="dayjs().add(1, 'year').toDate()"
    />
  </div>
</template>

<style scoped>
.schedule-view { padding-bottom: 16px; }
.date-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 12px;
}
.date-display { font-size: 18px; font-weight: 600; color: #3D3D35; }
.week-bar {
  display: flex; gap: 4px; margin-bottom: 20px;
  background: #fff; border-radius: 10px; padding: 8px;
}
.week-day {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; padding: 6px 0;
  border-radius: 8px; cursor: pointer;
}
.week-day:hover { background: #f0f0e8; }
.week-day.active { background: #5A6B4A; color: #fff; }
.week-day.today .day-num { font-weight: 700; }
.day-name { font-size: 11px; margin-bottom: 2px; }
.day-num { font-size: 15px; }
.todo-section { margin-bottom: 12px; }
.todo-header { font-size: 14px; font-weight: 600; color: #3D3D35; margin-bottom: 8px; }
.todo-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; background: #fff; border-radius: 8px; margin-bottom: 4px;
}
.todo-text { font-size: 14px; color: #3D3D35; }
.todo-text.done { text-decoration: line-through; color: #B5B5A5; }
.empty { text-align: center; padding: 24px; color: #B5B5A5; font-size: 13px; }
.add-bar {
  display: flex; gap: 8px; align-items: center;
  background: #fff; border-radius: 10px; padding: 4px 8px;
}
</style>
