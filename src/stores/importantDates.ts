import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ImportantDate } from '@/types'
import {
  subscribeImportantDates,
  addImportantDate as fbAdd,
  updateImportantDate as fbUpdate,
  deleteImportantDate as fbDelete,
} from '@/utils/firestore'
import { useAuthStore } from './auth'

export const useImportantDateStore = defineStore('importantDates', () => {
  const dates = ref<ImportantDate[]>([])
  const loading = ref(true)
  let unsub: (() => void) | null = null

  function fetchDates() {
    const auth = useAuthStore()
    if (!auth.user) return
    loading.value = true
    unsub?.()
    unsub = subscribeImportantDates(auth.user.uid, (list) => {
      dates.value = list
      loading.value = false
    })
  }

  function stopListening() {
    unsub?.()
    unsub = null
  }

  async function addDate(date: Omit<ImportantDate, 'id'>) {
    const auth = useAuthStore()
    if (!auth.user) return
    await fbAdd(auth.user.uid, date)
  }

  async function updateDate(dateId: string, data: Partial<ImportantDate>) {
    const auth = useAuthStore()
    if (!auth.user) return
    await fbUpdate(auth.user.uid, dateId, data)
  }

  async function deleteDate(dateId: string) {
    const auth = useAuthStore()
    if (!auth.user) return
    await fbDelete(auth.user.uid, dateId)
  }

  return { dates, loading, fetchDates, stopListening, addDate, updateDate, deleteDate }
})
