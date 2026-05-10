import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { getDoc, setDoc } from 'firebase/firestore'
import { useAuthStore } from './auth'
import { semesterRef } from '@/utils/firestore'

export const useSemesterStore = defineStore('semester', () => {
  const currentWeek = ref(1)
  const semesterName = ref('')
  const startDate = ref('')
  const totalWeeks = ref(20)

  const weekDateRange = computed(() => {
    if (!startDate.value) return ''
    const start = dayjs(startDate.value)
    const weekStart = start.add((currentWeek.value - 1) * 7, 'day')
    const weekEnd = weekStart.add(6, 'day')
    return `${weekStart.format('M/D')} - ${weekEnd.format('M/D')}`
  })

  async function fetchSemester() {
    const auth = useAuthStore()
    if (!auth.user) return
    const snap = await getDoc(semesterRef(auth.user.uid))
    if (snap.exists()) {
      const d = snap.data()
      semesterName.value = d.name || ''
      startDate.value = d.startDate?.toDate?.()?.toISOString() || ''
      totalWeeks.value = d.totalWeeks || 20
      if (d.startDate?.toDate) {
        const diff = dayjs().diff(dayjs(d.startDate.toDate()), 'week')
        currentWeek.value = Math.max(1, Math.min(diff + 1, totalWeeks.value))
      }
    }
  }

  async function saveSemester(data: { name: string; startDate: string; totalWeeks: number }) {
    const auth = useAuthStore()
    if (!auth.user) return
    await setDoc(semesterRef(auth.user.uid), {
      name: data.name,
      startDate: new Date(data.startDate),
      totalWeeks: data.totalWeeks,
    })
    semesterName.value = data.name
    startDate.value = data.startDate
    totalWeeks.value = data.totalWeeks
  }

  function setCurrentWeek(n: number) {
    currentWeek.value = Math.max(1, Math.min(n, totalWeeks.value))
  }

  function nextWeek() {
    setCurrentWeek(currentWeek.value + 1)
  }

  function prevWeek() {
    setCurrentWeek(currentWeek.value - 1)
  }

  function goToCurrentWeek() {
    if (startDate.value) {
      const diff = dayjs().diff(dayjs(startDate.value), 'week')
      currentWeek.value = Math.max(1, Math.min(diff + 1, totalWeeks.value))
    }
  }

  return {
    currentWeek, semesterName, startDate, totalWeeks,
    weekDateRange, fetchSemester, saveSemester,
    setCurrentWeek, nextWeek, prevWeek, goToCurrentWeek,
  }
})
