import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Course, Schedule } from '@/types'
import { subscribeCourses, addCourse as fbAdd, updateCourse as fbUpdate, deleteCourse as fbDelete } from '@/utils/firestore'
import { useAuthStore } from './auth'

export const useCourseStore = defineStore('course', () => {
  const courses = ref<Course[]>([])
  const loading = ref(true)
  let unsub: (() => void) | null = null

  function fetchCourses() {
    const auth = useAuthStore()
    if (!auth.user) return
    loading.value = true
    unsub?.()
    unsub = subscribeCourses(auth.user.uid, (list) => {
      courses.value = list
      loading.value = false
    })
  }

  function stopListening() {
    unsub?.()
    unsub = null
  }

  async function addCourse(course: Omit<Course, 'id'>) {
    const auth = useAuthStore()
    if (!auth.user) return
    await fbAdd(auth.user.uid, course)
  }

  async function updateCourse(courseId: string, data: Partial<Course>) {
    const auth = useAuthStore()
    if (!auth.user) return
    await fbUpdate(auth.user.uid, courseId, data)
  }

  async function deleteCourse(courseId: string) {
    const auth = useAuthStore()
    if (!auth.user) return
    await fbDelete(auth.user.uid, courseId)
  }

  function isScheduleVisible(schedule: Schedule, weekNum: number) {
    if (schedule.weekType === 'all') return true
    if (schedule.weekType === 'odd') return weekNum % 2 === 1
    if (schedule.weekType === 'even') return weekNum % 2 === 0
    if (schedule.weekType === 'custom') return schedule.customWeeks?.includes(weekNum) ?? false
    return false
  }

  return { courses, loading, fetchCourses, stopListening, addCourse, updateCourse, deleteCourse, isScheduleVisible }
})
