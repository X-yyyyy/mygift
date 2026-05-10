import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CsgoEvent } from '@/types'
import { fetchUpcomingTournaments } from '@/utils/pandascore'
import fallbackEvents from '@/csgo-events.json'

const CACHE_KEY = 'dashboard_csgo'
const CACHE_TTL = 6 * 60 * 60 * 1000

export const useCsgoStore = defineStore('csgo', () => {
  const events = ref<CsgoEvent[]>(fallbackEvents as CsgoEvent[])
  const loading = ref(false)
  const error = ref('')

  async function refresh(force = false) {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!force && cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          events.value = parsed.events
          return
        }
      } catch { /* ignore */ }
    }

    loading.value = true
    error.value = ''
    try {
      const apiEvents = await fetchUpcomingTournaments()
      if (apiEvents.length > 0) {
        events.value = apiEvents
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          events: apiEvents, timestamp: Date.now(),
        }))
      }
    } catch {
      error.value = '获取赛事数据失败，使用本地数据'
    } finally {
      loading.value = false
    }
  }

  return { events, loading, error, refresh }
})
