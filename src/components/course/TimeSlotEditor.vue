<script setup lang="ts">
import { ref } from 'vue'
import { useTimeSlotStore } from '@/stores/timeSlot'
import { ElMessage } from 'element-plus'
import type { TimeSlot } from '@/types'

const store = useTimeSlotStore()
const editing = ref<Omit<TimeSlot, 'id'>[]>([])

function startEdit() {
  editing.value = store.timeSlots.map((s) => ({
    slot: s.slot,
    startTime: s.startTime,
    endTime: s.endTime,
  }))
}

function addRow() {
  editing.value.push({
    slot: editing.value.length + 1,
    startTime: '00:00',
    endTime: '00:00',
  })
}

function removeRow(index: number) {
  editing.value.splice(index, 1)
}

async function save() {
  const validated = editing.value.map((s, i) => ({ ...s, slot: i + 1 }))
  await store.updateTimeSlots(validated)
  ElMessage.success('时间段已更新')
  editing.value = []
}

function cancel() {
  editing.value = []
}
</script>

<template>
  <div class="time-slot-editor">
    <div class="section-header">
      <h3>自定义时间段</h3>
      <el-button v-if="editing.length === 0" size="small" @click="startEdit">编辑</el-button>
    </div>
    <div v-if="editing.length > 0" class="editor-body">
      <div v-for="(row, i) in editing" :key="i" class="slot-row">
        <span class="slot-index">第{{ i + 1 }}节</span>
        <el-time-picker
          v-model="row.startTime"
          format="HH:mm"
          placeholder="开始"
          style="width:120px"
        />
        <span class="separator">-</span>
        <el-time-picker
          v-model="row.endTime"
          format="HH:mm"
          placeholder="结束"
          style="width:120px"
        />
        <el-button type="danger" size="small" @click="removeRow(i)">×</el-button>
      </div>
      <div class="editor-actions">
        <el-button size="small" @click="addRow">+ 添加</el-button>
        <el-button size="small" type="primary" @click="save">保存</el-button>
        <el-button size="small" @click="cancel">取消</el-button>
      </div>
    </div>
    <div v-else class="slot-list">
      <div v-for="slot in store.timeSlots" :key="slot.slot" class="slot-item">
        <span class="slot-label">第{{ slot.slot }}节</span>
        <span class="slot-time">{{ slot.startTime }} - {{ slot.endTime }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.time-slot-editor {
  margin-bottom: 24px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.section-header h3 {
  font-size: 16px;
  color: var(--el-text-color-primary);
}
.slot-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.slot-item {
  display: flex;
  gap: 8px;
  font-size: 14px;
  padding: 8px 12px;
  background: var(--warm-bg);
  border: 1px solid var(--warm-border);
  border-radius: 6px;
}
.slot-label {
  font-weight: 500;
  color: var(--el-text-color-primary);
  font-family: "Noto Serif SC", "Songti SC", serif;
}
.slot-time {
  color: var(--el-text-color-regular);
}
.editor-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.slot-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.slot-index {
  width: 60px;
  font-size: 14px;
  font-weight: 500;
}
.separator {
  color: var(--el-text-color-secondary);
}
.editor-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>
