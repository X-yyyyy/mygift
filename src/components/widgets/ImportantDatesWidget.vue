<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useImportantDateStore } from '@/stores/importantDates'
import { toDate } from '@/types'

const store = useImportantDateStore()

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
    .slice(0, 4)
)
</script>

<template>
  <div class="dates-widget">
    <div v-if="upcoming.length === 0" class="empty">
      暂无即将到来的日期
    </div>
    <div
      v-for="d in upcoming"
      :key="d.id"
      class="date-item"
    >
      <div class="date-color" :style="{ background: d.color }" />
      <div class="date-info">
        <span class="date-name">{{ d.name }}</span>
        <span class="date-label">
          {{ toDate(d.date) ? dayjs(toDate(d.date)).format('M月D日') : '' }}
        </span>
      </div>
      <span class="date-countdown">
        {{ toDate(d.date) ? dayjs(toDate(d.date)).diff(dayjs(), 'day') + 1 : '?' }} 天
      </span>
    </div>
    <router-link to="/dates" class="view-more">管理 →</router-link>
  </div>
</template>

<style scoped>
.dates-widget { font-size: 14px; }
.empty { color: var(--el-text-color-secondary); padding: 16px 0; text-align: center; font-size: 13px; }
.date-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}
.date-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.date-info { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.date-name { font-size: 14px; color: var(--el-text-color-primary); }
.date-label { font-size: 12px; color: var(--el-text-color-secondary); }
.date-countdown { font-size: 13px; color: var(--sage); font-weight: 500; white-space: nowrap; }
.view-more {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: var(--sage);
  text-decoration: none;
}
</style>
