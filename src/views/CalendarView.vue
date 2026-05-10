<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useCalendarStore } from '@/stores/calendar'
import { ElMessage } from 'element-plus'
import { toDate } from '@/types'

const store = useCalendarStore()
const dialogVisible = ref(false)
const editingEvent = ref<any>(null)
const form = ref({ title: '', date: '', time: '', note: '' })

const today = dayjs().format('YYYY-MM-DD')

onMounted(() => {
  store.fetchEvents()
})

const groupedEvents = computed(() => {
  const groups: Record<string, typeof store.events> = {}
  for (const ev of store.events) {
    const dateStr = toDate(ev.date) ? dayjs(toDate(ev.date)).format('YYYY-MM-DD') : ''
    if (!dateStr) continue
    if (!groups[dateStr]) groups[dateStr] = []
    groups[dateStr].push(ev)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
})

function openAdd() {
  editingEvent.value = null
  form.value = { title: '', date: today, time: '', note: '' }
  dialogVisible.value = true
}

function openEdit(ev: any) {
  editingEvent.value = ev
  const d = toDate(ev.date) ? dayjs(toDate(ev.date)) : dayjs()
  form.value = {
    title: ev.title || '',
    date: d.format('YYYY-MM-DD'),
    time: ev.time || '',
    note: ev.note || '',
  }
  dialogVisible.value = true
}

async function handleSave() {
  try {
    const data = {
      title: form.value.title,
      date: new Date(form.value.date),
      time: form.value.time || '',
      note: form.value.note || '',
    }
    if (editingEvent.value?.id) {
      await store.updateEvent(editingEvent.value.id, data)
      ElMessage.success('已更新')
    } else {
      await store.addEvent(data)
      ElMessage.success('已添加')
    }
    dialogVisible.value = false
  } catch {
    ElMessage.error('保存失败')
  }
}

async function handleDelete() {
  if (editingEvent.value?.id) {
    try {
      await store.deleteEvent(editingEvent.value.id)
      ElMessage.success('已删除')
      dialogVisible.value = false
    } catch {
      ElMessage.error('删除失败')
    }
  }
}
</script>

<template>
  <div class="calendar-view">
    <div class="view-header">
      <h2>日程</h2>
      <el-button type="primary" @click="openAdd">添加日程</el-button>
    </div>

    <div v-if="groupedEvents.length === 0" class="empty">
      暂无日程
    </div>

    <div v-for="[date, items] in groupedEvents" :key="date" class="day-group">
      <h3 class="day-header">{{ dayjs(date).format('M月D日 dddd') }}</h3>
      <div
        v-for="ev in items"
        :key="ev.id"
        class="event-card"
        @click="openEdit(ev)"
      >
        <span v-if="ev.time" class="event-time">{{ ev.time }}</span>
        <span class="event-title">{{ ev.title }}</span>
        <span v-if="ev.note" class="event-note">{{ ev.note }}</span>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="editingEvent ? '编辑日程' : '添加日程'"
      width="400px"
    >
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" style="width:100%" />
        </el-form-item>
        <el-form-item label="时间">
          <el-time-picker v-model="form.time" value-format="HH:mm" style="width:100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.note" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button v-if="editingEvent" type="danger" @click="handleDelete">删除</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.calendar-view { max-width: 800px; }
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.view-header h2 { font-size: 20px; color: var(--el-text-color-primary); }
.empty { color: var(--el-text-color-secondary); padding: 40px; text-align: center; }
.day-group { margin-bottom: 24px; }
.day-header {
  font-size: 15px;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--el-border-color-light);
}
.event-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 4px;
}
.event-card:hover { background: var(--el-fill-color-light); }
.event-time {
  font-size: 13px;
  color: var(--el-color-primary);
  font-weight: 500;
  min-width: 50px;
}
.event-title { font-size: 14px; color: var(--el-text-color-primary); }
.event-note {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-left: auto;
}
</style>
