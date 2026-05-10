<script setup lang="ts">
import { computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useCsgoStore } from '@/stores/csgo'

dayjs.extend(utc)

const csgo = useCsgoStore()

onMounted(() => {
  csgo.refresh()
})

const displayEvents = computed(() => {
  const now = dayjs.utc()
  const max = now.add(30, 'day')
  return csgo.events
    .filter(e => e.team1 && e.team2 && e.team1 !== 'TBD' && e.team2 !== 'TBD')
    .filter(e => {
      const t = dayjs.utc(e.beginAt)
      return t.isAfter(now.subtract(3, 'hour')) && t.isBefore(max)
    })
    .sort((a, b) => dayjs.utc(a.beginAt).valueOf() - dayjs.utc(b.beginAt).valueOf())
    .slice(0, 8)
})

const titleMap: Record<string, string> = {
  'PGL': 'PGL',
  'IEM': 'IEM',
  'CS Asia Championships': 'CS Asia',
}

function shortLeague(name: string): string {
  return titleMap[name] || name
}

function matchTime(beginAt: string): string {
  return dayjs.utc(beginAt).local().format('M/D HH:mm')
}

function isLive(beginAt: string): boolean {
  const begin = dayjs.utc(beginAt)
  const now = dayjs()
  return begin.isBefore(now) && now.isBefore(begin.add(4, 'hour'))
}

function countdown(beginAt: string): string {
  const begin = dayjs.utc(beginAt)
  const now = dayjs()
  const diffMin = begin.diff(now, 'minute')
  if (diffMin < 0) return '进行中'
  if (diffMin < 60) return `${diffMin} 分钟后`
  const diffHour = begin.diff(now, 'hour')
  if (diffHour < 24) return `${diffHour} 小时后`
  return begin.format('M/D')
}
</script>

<template>
  <div class="csgo-widget">
    <div v-if="csgo.loading && csgo.events.length === 0" class="loading">
      加载赛事数据...
    </div>
    <div v-else-if="displayEvents.length === 0" class="empty">
      暂无即将到来的 S/A 级赛事
    </div>
    <div
      v-for="ev in displayEvents"
      :key="ev.id"
      class="match-item"
      :class="{ live: isLive(ev.beginAt) }"
    >
      <div class="match-header">
        <span class="match-league">{{ shortLeague(ev.leagueName) }}</span>
        <span class="match-time">{{ matchTime(ev.beginAt) }}</span>
        <span v-if="isLive(ev.beginAt)" class="live-badge">LIVE</span>
        <span v-else class="match-countdown">{{ countdown(ev.beginAt) }}</span>
      </div>
      <div class="match-teams">
        <span class="team team-left">{{ ev.team1 }}</span>
        <span class="vs">vs</span>
        <span class="team team-right">{{ ev.team2 }}</span>
      </div>
    </div>
    <div v-if="csgo.error" class="error-note">{{ csgo.error }}</div>
  </div>
</template>

<style scoped>
.csgo-widget { font-size: 14px; }
.loading, .empty {
  color: var(--el-text-color-secondary);
  padding: 20px;
  text-align: center;
  font-size: 13px;
}
.match-item {
  padding: 10px 0;
  border-bottom: 1px solid var(--el-border-color-light);
}
.match-item:last-child { border-bottom: none; }
.match-item.live {
  background: rgba(196, 106, 90, 0.08);
  border-radius: 6px;
  padding: 10px 8px;
}
.match-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 12px;
}
.match-league {
  font-weight: 600;
  color: var(--el-text-color-regular);
}
.match-time {
  color: var(--el-text-color-secondary);
}
.match-countdown {
  color: var(--sage);
  font-weight: 500;
  margin-left: auto;
}
.live-badge {
  background: #C46A5A;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 3px;
  animation: pulse 2s infinite;
  margin-left: auto;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.match-teams {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.team {
  font-weight: 500;
  color: var(--el-text-color-primary);
}
.vs {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  font-weight: 400;
}
.error-note { font-size: 12px; color: var(--el-color-warning); margin-top: 8px; }
</style>
