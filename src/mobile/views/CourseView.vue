<!-- src/mobile/views/CourseView.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCourseStore } from '@/stores/course'
import { useTimeSlotStore } from '@/stores/timeSlot'
import { useSemesterStore } from '@/stores/semester'
import type { Course } from '@/types'
import CourseEditPopup from '@/mobile/components/CourseEditPopup.vue'

const courseStore = useCourseStore()
const timeSlotStore = useTimeSlotStore()
const semesterStore = useSemesterStore()

const showPopup = ref(false)
const editingCourse = ref<Course | null>(null)

const days = ['周一','周二','周三','周四','周五','周六','周日']

const timeRows = computed(() =>
  timeSlotStore.timeSlots
    .sort((a, b) => a.slot - b.slot)
    .map(ts => ({ slot: ts.slot, time: ts.startTime }))
)

function getCoursesForDay(dayIndex: number) {
  const week = semesterStore.currentWeek
  return courseStore.courses.filter(c =>
    c.schedules?.some(s => s.dayOfWeek === dayIndex + 1 && courseStore.isScheduleVisible(s, week))
  ).map(c => {
    const sched = c.schedules!.find(s => s.dayOfWeek === dayIndex + 1 && courseStore.isScheduleVisible(s, week))
    const slot = timeSlotStore.timeSlots.find(ts => ts.slot === sched?.startSlot)
    return {
      ...c,
      _startSlot: sched?.startSlot ?? 1,
      _duration: sched?.duration ?? 1,
      _time: slot ? slot.startTime : '',
    }
  }).sort((a, b) => a._startSlot - b._startSlot)
}

function openAdd() {
  editingCourse.value = null
  showPopup.value = true
}

function openEdit(course: any) {
  editingCourse.value = course as Course
  showPopup.value = true
}

async function handleSave(data: any) {
  if (editingCourse.value?.id) {
    await courseStore.updateCourse(editingCourse.value.id, data)
  } else {
    await courseStore.addCourse(data)
  }
  showPopup.value = false
}

async function handleDelete() {
  if (editingCourse.value?.id) {
    await courseStore.deleteCourse(editingCourse.value.id)
  }
  showPopup.value = false
}
</script>

<template>
  <div class="course-view">
    <!-- Week nav -->
    <div class="week-nav">
      <van-button icon="arrow-left" plain size="small" @click="semesterStore.prevWeek()" />
      <span class="week-label">第 {{ semesterStore.currentWeek }} 周</span>
      <van-button icon="arrow" plain size="small" @click="semesterStore.nextWeek()" />
      <van-button size="small" plain type="primary" style="margin-left:auto" @click="openAdd">添加</van-button>
    </div>

    <!-- Grid -->
    <div class="grid-wrapper">
      <div class="grid">
        <div class="grid-header">
          <div class="time-col"></div>
          <div v-for="day in days" :key="day" class="day-header">{{ day }}</div>
        </div>
        <div class="grid-body">
          <div v-for="tr in timeRows" :key="tr.slot" class="grid-row">
            <div class="time-col time-cell">{{ tr.time }}</div>
            <div v-for="(_, di) in 7" :key="di" class="cell" @click="openAdd()">
              <div
                v-for="c in getCoursesForDay(di).filter(c => c._startSlot === tr.slot)"
                :key="c.id"
                class="course-chip"
                :style="{ background: c.color + '22', borderLeftColor: c.color }"
                @click.stop="openEdit(c)"
              >
                <span class="chip-name">{{ c.name }}</span>
                <span class="chip-location">{{ c.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CourseEditPopup
      :show="showPopup"
      :course="editingCourse"
      @close="showPopup = false"
      @save="handleSave"
      @delete="handleDelete"
    />
  </div>
</template>

<style scoped>
.course-view { padding-bottom: 16px; }
.week-nav {
  display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
}
.week-label { font-size: 16px; font-weight: 600; color: #3D3D35; }
.grid-wrapper { overflow-x: auto; }
.grid { min-width: 420px; }
.grid-header { display: flex; }
.day-header {
  flex: 1; text-align: center; font-size: 12px; font-weight: 600;
  color: #5A6B4A; padding: 6px 0; border-bottom: 1px solid #eee;
}
.time-col { width: 40px; flex-shrink: 0; }
.grid-row { display: flex; border-bottom: 1px solid #f0f0e8; }
.time-cell {
  font-size: 11px; color: #8A8A7A; padding: 4px 4px 4px 0;
  text-align: right; line-height: 34px;
}
.cell {
  flex: 1; min-height: 36px; padding: 1px;
  border-left: 1px solid #f0f0e8; cursor: pointer;
}
.course-chip {
  border-left: 3px solid; border-radius: 4px;
  padding: 2px 4px; margin-bottom: 1px; cursor: pointer;
}
.chip-name { font-size: 11px; font-weight: 500; display: block; color: #3D3D35; }
.chip-location { font-size: 10px; color: #8A8A7A; }
</style>
