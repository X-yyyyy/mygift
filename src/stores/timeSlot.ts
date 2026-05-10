import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TimeSlot } from '@/types'
import { DEFAULT_TIME_SLOTS } from '@/types'
import { subscribeTimeSlots, timeSlotsRef } from '@/utils/firestore'
import { useAuthStore } from './auth'
import { getDocs, writeBatch, doc } from 'firebase/firestore'
import { db } from '@/firebase/init'

export const useTimeSlotStore = defineStore('timeSlot', () => {
  const timeSlots = ref<TimeSlot[]>([])
  const loading = ref(true)
  let unsub: (() => void) | null = null

  function fetchTimeSlots() {
    const auth = useAuthStore()
    if (!auth.user) return
    const uid = auth.user.uid
    loading.value = true
    unsub?.()
    unsub = subscribeTimeSlots(uid, (list) => {
      if (list.length === 0) {
        initDefaultSlots(uid)
      } else {
        timeSlots.value = list
        loading.value = false
      }
    })
  }

  async function initDefaultSlots(uid: string) {
    const batch = writeBatch(db)
    const ref = timeSlotsRef(uid)
    for (const slot of DEFAULT_TIME_SLOTS) {
      batch.set(doc(ref), slot)
    }
    await batch.commit()
    loading.value = false
  }

  function stopListening() {
    unsub?.()
    unsub = null
  }

  async function updateTimeSlots(slots: Omit<TimeSlot, 'id'>[]) {
    const auth = useAuthStore()
    if (!auth.user) return
    const existing = await getDocs(timeSlotsRef(auth.user.uid))
    const batch = writeBatch(db)
    existing.forEach((d) => batch.delete(d.ref))
    for (const s of slots) {
      batch.set(doc(timeSlotsRef(auth.user.uid)), s)
    }
    await batch.commit()
  }

  return { timeSlots, loading, fetchTimeSlots, stopListening, updateTimeSlots }
})
