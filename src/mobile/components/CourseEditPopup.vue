<!-- src/mobile/components/CourseEditPopup.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Course, Schedule } from '@/types'
import { COLORS } from '@/types'

const props = defineProps<{
  show: boolean
  course: Course | null
}>()

const emit = defineEmits<{
  close: []
  save: [data: Omit<Course, 'id'>]
  delete: []
}>()

const form = ref({
  name: '',
  teacher: '',
  location: '',
  type: 'required' as 'required' | 'elective',
  color: COLORS[0],
  schedules: [{ dayOfWeek: 1, startSlot: 1, duration: 2, weekType: 'all' as const }] as Schedule[],
})

watch(() => props.show, (v) => {
  if (v && props.course) {
    form.value = {
      name: props.course.name,
      teacher: props.course.teacher,
      location: props.course.location,
      type: props.course.type,
      color: props.course.color,
      schedules: props.course.schedules?.length ? [...props.course.schedules] : form.value.schedules,
    }
  } else if (v) {
    form.value = {
      name: '', teacher: '', location: '',
      type: 'required', color: COLORS[0],
      schedules: [{ dayOfWeek: 1, startSlot: 1, duration: 2, weekType: 'all' }],
    }
  }
})

function addSchedule() {
  form.value.schedules.push({ dayOfWeek: 1, startSlot: 1, duration: 2, weekType: 'all' })
}

function removeSchedule(idx: number) {
  if (form.value.schedules.length > 1) form.value.schedules.splice(idx, 1)
}

function handleSave() {
  if (!form.value.name.trim()) return
  emit('save', { ...form.value, name: form.value.name.trim() })
}
</script>

<template>
  <van-popup :show="show" position="bottom" round @close="emit('close')">
    <div class="popup-content">
      <div class="popup-header">
        <span>{{ course ? '编辑课程' : '添加课程' }}</span>
        <van-button plain @click="emit('close')">取消</van-button>
      </div>

      <van-form @submit="handleSave">
        <van-field v-model="form.name" label="课程名" placeholder="课程名" required />
        <van-field v-model="form.teacher" label="教师" placeholder="教师" />
        <van-field v-model="form.location" label="教室" placeholder="教室" />
        <van-field label="颜色">
          <template #input>
            <div class="color-picker">
              <div
                v-for="c in COLORS" :key="c"
                class="color-dot"
                :class="{ active: form.color === c }"
                :style="{ background: c }"
                @click="form.color = c"
              />
            </div>
          </template>
        </van-field>

        <div class="schedules-section">
          <div class="schedules-header">
            <span>上课时间</span>
            <van-button size="small" plain type="primary" @click="addSchedule">添加时段</van-button>
          </div>
          <div v-for="(s, i) in form.schedules" :key="i" class="schedule-row">
            <van-field v-model="s.dayOfWeek" label="星期" type="digit" placeholder="1-7" />
            <van-field v-model="s.startSlot" label="开始节次" type="digit" placeholder="1-12" />
            <van-field v-model="s.duration" label="持续节数" type="digit" placeholder="1-6" />
            <van-field label="周次">
              <template #input>
                <van-radio-group v-model="s.weekType" direction="horizontal">
                  <van-radio name="all">全</van-radio>
                  <van-radio name="odd">单</van-radio>
                  <van-radio name="even">双</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-button v-if="form.schedules.length > 1" icon="delete" plain type="danger" size="small" @click="removeSchedule(i)" />
          </div>
        </div>

        <div style="margin: 16px; display: flex; gap: 8px;">
          <van-button v-if="course" round block type="danger" @click="emit('delete')">删除此课程</van-button>
          <van-button round block type="primary" native-type="submit">保存</van-button>
        </div>
      </van-form>
    </div>
  </van-popup>
</template>

<style scoped>
.popup-content { padding: 16px; max-height: 80vh; overflow-y: auto; }
.popup-header {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 16px; font-weight: 600; margin-bottom: 12px; padding: 0 4px; color: #3D3D35;
}
.color-picker { display: flex; gap: 8px; flex-wrap: wrap; }
.color-dot {
  width: 24px; height: 24px; border-radius: 50%; cursor: pointer;
  border: 2px solid transparent;
}
.color-dot.active { border-color: #3D3D35; }
.schedules-section { margin-top: 8px; }
.schedules-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 16px; font-size: 14px; font-weight: 500; color: #3D3D35;
}
.schedule-row {
  border: 1px solid #eee; border-radius: 8px; margin: 8px 16px; padding: 4px 0;
}
</style>
