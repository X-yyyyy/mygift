import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CalendarEvent } from '@/types'
import {
  subscribeCalendar,
  addCalendarEvent as fbAdd,
  updateCalendarEvent as fbUpdate,
  deleteCalendarEvent as fbDelete,
} from '@/utils/firestore'
import { useAuthStore } from './auth'

export const useCalendarStore = defineStore('calendar', () => {
  const events = ref<CalendarEvent[]>([])
  const loading = ref(true)
  let unsub: (() => void) | null = null

  function fetchEvents() {
    const auth = useAuthStore()
    if (!auth.user) return
    loading.value = true
    unsub?.()
    unsub = subscribeCalendar(auth.user.uid, (list) => {
      events.value = list
      loading.value = false
    })
  }

  function stopListening() {
    unsub?.()
    unsub = null
  }

  async function addEvent(event: Omit<CalendarEvent, 'id'>) {
    const auth = useAuthStore()
    if (!auth.user) return
    await fbAdd(auth.user.uid, event)
  }

  async function updateEvent(eventId: string, data: Partial<CalendarEvent>) {
    const auth = useAuthStore()
    if (!auth.user) return
    await fbUpdate(auth.user.uid, eventId, data)
  }

  async function deleteEvent(eventId: string) {
    const auth = useAuthStore()
    if (!auth.user) return
    await fbDelete(auth.user.uid, eventId)
  }

  return { events, loading, fetchEvents, stopListening, addEvent, updateEvent, deleteEvent }
})
