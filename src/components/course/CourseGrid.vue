<script setup lang="ts">
import { computed } from 'vue'
import { useCourseStore } from '@/stores/course'
import { useSemesterStore } from '@/stores/semester'
import { useTimeSlotStore } from '@/stores/timeSlot'
import GridHeader from './GridHeader.vue'
import TimeColumn from './TimeColumn.vue'
import CourseCard from './CourseCard.vue'

const courseStore = useCourseStore()
const semesterStore = useSemesterStore()
const timeSlotStore = useTimeSlotStore()

const emit = defineEmits<{
  addCourse: [dayOfWeek: number, slot: number]
  editCourse: [courseId: string]
}>()

const visibleCourses = computed(() => {
  return courseStore.courses.filter((c) => {
    return c.schedules.some((s) => courseStore.isScheduleVisible(s, semesterStore.currentWeek))
  })
})

function handleCellClick(dayOfWeek: number, slotIndex: number) {
  emit('addCourse', dayOfWeek, slotIndex)
}

function handleEditCourse(course: any) {
  emit('editCourse', course.id)
}

const daySlots = computed(() => {
  return timeSlotStore.timeSlots
})
</script>

<template>
  <div v-loading="courseStore.loading || timeSlotStore.loading" class="grid-wrapper">
    <div
      class="course-grid"
      :style="{
        gridTemplateColumns: `var(--time-column-width, 80px) repeat(7, 1fr)`,
        gridTemplateRows: `auto repeat(${daySlots.length}, 1fr)`,
      }"
    >
      <GridHeader />
      <TimeColumn :timeSlots="daySlots" />

      <!-- Empty cells for clicking to add -->
      <template v-for="(_slot, si) in daySlots" :key="'row-' + si">
        <div
          v-for="day in 7"
          :key="'cell-' + day + '-' + si"
          class="grid-cell"
          :style="{
            gridColumn: day + 1,
            gridRow: si + 2,
          }"
          @click="handleCellClick(day, si)"
        />
      </template>

      <!-- Course cards -->
      <CourseCard
        v-for="course in visibleCourses"
        :key="course.id"
        :course="course"
        :slotIndex="(course.schedules[0]?.startSlot ?? 1) - 1"
        @edit="handleEditCourse"
      />
    </div>
  </div>
</template>

<style scoped>
.grid-wrapper {
  height: 100%;
  overflow: auto;
  border: 1px solid var(--warm-border);
  border-radius: 10px;
  background: var(--warm-card);
  box-shadow: var(--el-box-shadow-light);
}
.course-grid {
  display: grid;
  min-width: 800px;
  position: relative;
}
.grid-cell {
  border-bottom: 1px solid var(--warm-border);
  border-right: 1px solid var(--warm-border);
  min-height: 60px;
  cursor: pointer;
  transition: background-color 0.15s;
}
.grid-cell:hover {
  background: var(--sage-pale);
}
.grid-cell:nth-child(7n) {
  border-right: none;
}
</style>
