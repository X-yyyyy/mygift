<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useImportantDateStore } from '@/stores/importantDates'
import { ElMessage } from 'element-plus'
import { toDate } from '@/types'

const store = useImportantDateStore()
const dialogVisible = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ name: '', date: '', color: '#8FA88F', type: 'custom' as const, note: '' })

onMounted(() => store.fetchDates())

const upcoming = computed(() =>
  store.dates
    .filter(d => {
      const dt = toDate(d.date)
      return dt && dt >= new Date()
    })
    .sort((a, b) => {
      const da = toDate(a.date)?.getTime() ?? 0
      const db = toDate(b.date)?.getTime() ?? 0
      return da - db
    })
)

const past = computed(() =>
  store.dates
    .filter(d => {
      const dt = toDate(d.date)
      return dt && dt < new Date()
    })
    .sort((a, b) => {
      const da = toDate(a.date)?.getTime() ?? 0
      const db = toDate(b.date)?.getTime() ?? 0
      return db - da
    })
)

function openAdd() {
  editingId.value = null
  form.value = { name: '', date: '', color: '#8FA88F', type: 'custom', note: '' }
  dialogVisible.value = true
}

function openEdit(d: any) {
  editingId.value = d.id
  const dt = toDate(d.date) ? dayjs(toDate(d.date)) : dayjs()
  form.value = {
    name: d.name || '',
    date: dt.format('YYYY-MM-DD'),
    color: d.color || '#8FA88F',
    type: d.type || 'custom',
    note: d.note || '',
  }
  dialogVisible.value = true
}

async function handleSave() {
  try {
    const data = {
      name: form.value.name,
      date: new Date(form.value.date),
      color: form.value.color,
      type: form.value.type,
      note: form.value.note,
    }
    if (editingId.value) {
      await store.updateDate(editingId.value, data)
      ElMessage.success('已更新')
    } else {
      await store.addDate(data)
      ElMessage.success('已添加')
    }
    dialogVisible.value = false
  } catch {
    ElMessage.error('保存失败')
  }
}

async function handleDelete(id: string) {
  await store.deleteDate(id)
  dialogVisible.value = false
}
</script>

<template>
  <div class="dates-view">
    <div class="view-header">
      <h2>重大日期</h2>
      <el-button type="primary" @click="openAdd">添加日期</el-button>
    </div>

    <h3 class="section-title">即将到来</h3>
    <div v-if="upcoming.length === 0" class="empty">暂无即将到来的日期</div>
    <div v-for="d in upcoming" :key="d.id" class="date-card" @click="openEdit(d)">
      <div class="date-color" :style="{ background: d.color }" />
      <div class="date-info">
        <span class="date-name">{{ d.name }}</span>
        <span class="date-value">{{ toDate(d.date) ? dayjs(toDate(d.date)).format('YYYY年M月D日') : '' }}</span>
      </div>
      <span class="date-countdown">
        还剩 {{ toDate(d.date) ? dayjs(toDate(d.date)).diff(dayjs(), 'day') + 1 : '?' }} 天
      </span>
    </div>

    <h3 class="section-title" v-if="past.length">已过去</h3>
    <div v-for="d in past" :key="d.id" class="date-card past" @click="openEdit(d)">
      <div class="date-color" :style="{ background: d.color }" />
      <div class="date-info">
        <span class="date-name">{{ d.name }}</span>
        <span class="date-value">{{ toDate(d.date) ? dayjs(toDate(d.date)).format('YYYY年M月D日') : '' }}</span>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑日期' : '添加日期'"
      width="400px"
    >
      <el-form :model="form">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" style="width:100%" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" style="width:100%">
            <el-option value="birthday" label="生日" />
            <el-option value="anniversary" label="纪念日" />
            <el-option value="custom" label="自定义" />
          </el-select>
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="form.color" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.note" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button v-if="editingId" type="danger" @click="handleDelete(editingId)">删除</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.dates-view { max-width: 600px; }
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.view-header h2 { font-size: 20px; color: var(--el-text-color-primary); }
.section-title {
  font-size: 15px;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  margin-top: 16px;
}
.empty { color: var(--el-text-color-secondary); padding: 20px; text-align: center; }
.date-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 8px;
}
.date-card:hover { background: var(--el-fill-color-light); }
.date-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}
.date-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.date-name { font-size: 14px; color: var(--el-text-color-primary); font-weight: 500; }
.date-value { font-size: 12px; color: var(--el-text-color-secondary); }
.date-countdown { font-size: 13px; color: var(--el-color-primary); font-weight: 500; white-space: nowrap; }
.past { opacity: 0.5; }
</style>
