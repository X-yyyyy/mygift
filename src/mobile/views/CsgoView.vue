<!-- src/mobile/views/CsgoView.vue -->
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useCsgoStore } from '@/stores/csgo'

const csgoStore = useCsgoStore()

onMounted(() => {
  if (csgoStore.events.length === 0) csgoStore.refresh()
})

const liveEvents = computed(() =>
  csgoStore.events.filter(e => {
    const now = new Date()
    const start = e.startDate ? new Date(e.startDate) : null
    const end = e.endDate ? new Date(e.endDate) : null
    return start && end && start <= now && end >= now
  })
)

const upcomingEvents = computed(() =>
  csgoStore.events
    .filter(e => {
      const start = e.startDate ? new Date(e.startDate) : null
      return start && start > new Date()
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
)

const pastEvents = computed(() =>
  csgoStore.events
    .filter(e => {
      const end = e.endDate ? new Date(e.endDate) : null
      return end && end < new Date()
    })
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
)

function formatDate(e: { startDate: string; endDate: string }): string {
  const s = dayjs(e.startDate).format('M/D')
  const end = dayjs(e.endDate).format('M/D')
  return s === end ? s : `${s} - ${end}`
}

function formatMatchTime(e: { beginAt: string }): string {
  if (!e.beginAt) return ''
  return dayjs(e.beginAt).format('M/D HH:mm')
}
</script>

<template>
  <div class="csgo-view">
    <!-- LIVE -->
    <div v-if="liveEvents.length" class="group">
      <div class="group-title">
        <span class="live-dot" /> LIVE
      </div>
      <div v-for="e in liveEvents" :key="e.id" class="event-card live-card">
        <div class="event-name">{{ e.matchName || e.leagueName }}</div>
        <div class="event-teams">{{ e.team1 }} vs {{ e.team2 }}</div>
        <div class="event-time">{{ formatMatchTime(e) }}</div>
      </div>
    </div>

    <!-- Upcoming -->
    <div class="group">
      <div class="group-title">即将开始</div>
      <div v-for="e in upcomingEvents" :key="e.id" class="event-card">
        <div class="event-name">{{ e.matchName || e.leagueName }}</div>
        <div class="event-teams">{{ e.team1 }} vs {{ e.team2 }}</div>
        <div class="event-time">{{ formatDate(e) }}</div>
      </div>
      <div v-if="upcomingEvents.length === 0 && liveEvents.length === 0" class="empty">暂无赛事</div>
    </div>

    <!-- Past -->
    <div class="group" v-if="pastEvents.length">
      <div class="group-title">往期</div>
      <div v-for="e in pastEvents" :key="e.id" class="event-card past">
        <div class="event-name">{{ e.matchName || e.leagueName }}</div>
        <div class="event-teams">{{ e.team1 }} vs {{ e.team2 }}</div>
        <div class="event-time">{{ formatDate(e) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.csgo-view { padding-bottom: 16px; }
.group { margin-bottom: 20px; }
.group-title {
  font-size: 14px; font-weight: 600; color: #3D3D35;
  margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
}
.live-dot {
  display: inline-block; width: 8px; height: 8px;
  border-radius: 50%; background: #e74c3c; animation: pulse 1.5s infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.event-card {
  background: #fff; border-radius: 10px; padding: 12px 14px;
  margin-bottom: 6px;
}
.live-card { border-left: 3px solid #e74c3c; }
.event-name { font-size: 14px; font-weight: 500; color: #3D3D35; }
.event-teams { font-size: 13px; color: #5A6B4A; margin-top: 2px; }
.event-time { font-size: 12px; color: #8A8A7A; margin-top: 2px; }
.past { opacity: 0.5; }
.empty { text-align: center; padding: 20px; color: #B5B5A5; font-size: 13px; }
</style>
