<script setup lang="ts">
import type { Course } from '@/types'

const props = defineProps<{
  course: Course
  slotIndex: number
}>()

const emit = defineEmits<{
  edit: [course: Course]
}>()

function getGridPosition() {
  const schedule = props.course.schedules[0]
  return {
    gridColumn: (schedule?.dayOfWeek ?? 1) + 1,
    gridRow: `${(props.slotIndex) + 2} / span ${schedule?.duration ?? 1}`,
  }
}
</script>

<template>
  <div
    class="course-card"
    :style="{
      ...getGridPosition(),
      backgroundColor: course.color + '20',
      borderLeft: `4px solid ${course.color}`,
    }"
    @click="emit('edit', course)"
  >
    <div class="card-name" :style="{ color: course.color }">{{ course.name }}</div>
    <div class="card-info">{{ course.teacher }}</div>
    <div class="card-info">{{ course.location }}</div>
  </div>
</template>

<style scoped>
.course-card {
  padding: 4px 6px;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  min-height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: box-shadow 0.2s;
  margin: 2px;
  border: 1px solid transparent;
}
.course-card:hover {
  box-shadow: 0 4px 12px rgba(60, 60, 50, 0.12);
  border-color: var(--sage-lighter);
}
.card-name {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 2px;
  font-family: "Noto Serif SC", "Songti SC", serif;
}
.card-info {
  font-size: 11px;
  color: #8B7A6A;
  line-height: 1.3;
}
</style>
