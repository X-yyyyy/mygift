<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Course } from '@/types'
import CourseGrid from '@/components/course/CourseGrid.vue'
import CourseDialog from '@/components/course/CourseDialog.vue'
import TimeSlotEditor from '@/components/course/TimeSlotEditor.vue'
import { EditPen, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useCourseStore } from '@/stores/course'
import { useSemesterStore } from '@/stores/semester'
import { useTimeSlotStore } from '@/stores/timeSlot'
import { ElMessage, ElMessageBox } from 'element-plus'

const courseStore = useCourseStore()
const semesterStore = useSemesterStore()
const timeSlotStore = useTimeSlotStore()
const dialogVisible = ref(false)
const editingCourse = ref<Course | null>(null)
const defaultDay = ref(1)
const defaultSlot = ref(1)
const showSemesterDialog = ref(false)
const showTimeSlotEditor = ref(false)

const semesterForm = ref({
  name: '',
  startDate: '',
  totalWeeks: 20,
})

onMounted(() => {
  courseStore.fetchCourses()
  semesterStore.fetchSemester()
  timeSlotStore.fetchTimeSlots()
})

function handleAddCourse(dayOfWeek: number, slotIndex: number) {
  defaultDay.value = dayOfWeek
  defaultSlot.value = slotIndex + 1
  editingCourse.value = null
  dialogVisible.value = true
}

function handleEditCourse(courseId: string) {
  const course = courseStore.courses.find((c) => c.id === courseId)
  if (course) {
    editingCourse.value = JSON.parse(JSON.stringify(course))
    dialogVisible.value = true
  }
}

async function handleSave(data: Omit<Course, 'id'>) {
  try {
    if (editingCourse.value?.id) {
      await courseStore.updateCourse(editingCourse.value.id, data)
      ElMessage.success('课程已更新')
    } else {
      await courseStore.addCourse(data)
      ElMessage.success('课程已添加')
    }
    dialogVisible.value = false
  } catch {
    ElMessage.error('保存失败')
  }
}

async function handleDelete() {
  if (editingCourse.value?.id) {
    try {
      await courseStore.deleteCourse(editingCourse.value.id)
      ElMessage.success('课程已删除')
      dialogVisible.value = false
    } catch {
      ElMessage.error('删除失败')
    }
  }
}

function openSemesterDialog() {
  semesterForm.value = {
    name: semesterStore.semesterName,
    startDate: semesterStore.startDate ? semesterStore.startDate.split('T')[0] : '',
    totalWeeks: semesterStore.totalWeeks,
  }
  showSemesterDialog.value = true
}

async function saveSemester() {
  if (!semesterForm.value.name || !semesterForm.value.startDate) {
    ElMessage.warning('请填写学期名称和开始日期')
    return
  }
  await semesterStore.saveSemester(semesterForm.value)
  ElMessage.success('学期设置已保存')
  showSemesterDialog.value = false
}
</script>

<template>
  <div class="course-grid-view">
    <div class="view-header">
      <h2>课表</h2>
    </div>

    <!-- Semester bar -->
    <div class="semester-bar">
      <div class="semester-info">
        <el-button text class="semester-name" @click="openSemesterDialog">
          <span v-if="semesterStore.semesterName">{{ semesterStore.semesterName }}</span>
          <span v-else class="placeholder">设置学期</span>
          <el-icon class="edit-icon"><EditPen /></el-icon>
        </el-button>
        <span class="week-range">{{ semesterStore.weekDateRange }}</span>
      </div>
      <div class="week-nav">
        <el-button text :disabled="semesterStore.currentWeek <= 1" @click="semesterStore.prevWeek">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <span class="week-label">第 {{ semesterStore.currentWeek }} 周</span>
        <el-button text :disabled="semesterStore.currentWeek >= semesterStore.totalWeeks" @click="semesterStore.nextWeek">
          <el-icon><ArrowRight /></el-icon>
        </el-button>
        <el-button size="small" text @click="semesterStore.goToCurrentWeek">回到当前周</el-button>
      </div>
      <div class="semester-actions">
        <el-button size="small" @click="showTimeSlotEditor = !showTimeSlotEditor">
          {{ showTimeSlotEditor ? '收起' : '设置' }}时间段
        </el-button>
      </div>
    </div>

    <!-- Time slot editor (collapsible) -->
    <Transition name="fade">
      <div v-if="showTimeSlotEditor" class="time-slot-section">
        <TimeSlotEditor />
      </div>
    </Transition>

    <CourseGrid
      @add-course="handleAddCourse"
      @edit-course="handleEditCourse"
    />
    <CourseDialog
      v-model:visible="dialogVisible"
      :course="editingCourse"
      :defaultDay="defaultDay"
      :defaultSlot="defaultSlot"
      @save="handleSave"
      @delete="handleDelete"
    />

    <!-- Semester settings dialog -->
    <el-dialog
      v-model="showSemesterDialog"
      title="学期设置"
      width="400px"
    >
      <el-form label-width="80px">
        <el-form-item label="学期名称">
          <el-input v-model="semesterForm.name" placeholder="例如：2026 春季学期" />
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="semesterForm.startDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width:100%" />
        </el-form-item>
        <el-form-item label="总周数">
          <el-input-number v-model="semesterForm.totalWeeks" :min="1" :max="52" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSemesterDialog = false">取消</el-button>
        <el-button type="primary" @click="saveSemester">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.course-grid-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.view-header {
  margin-bottom: 16px;
}
.view-header h2 {
  font-size: 22px;
  color: var(--el-text-color-primary);
  font-family: "Noto Serif SC", "Songti SC", serif;
  letter-spacing: 2px;
}

/* Semester bar */
.semester-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 18px;
  background: var(--warm-card);
  border: 1px solid var(--warm-border);
  border-radius: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  box-shadow: var(--el-box-shadow-light);
}
.semester-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.semester-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  font-family: "Noto Serif SC", "Songti SC", serif;
}
.semester-name:hover {
  color: var(--sage);
}
.semester-name .placeholder {
  color: var(--el-text-color-secondary);
}
.edit-icon {
  font-size: 12px;
  margin-left: 2px;
  color: var(--el-text-color-secondary);
}
.week-range {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  background: var(--warm-bg);
  padding: 2px 10px;
  border-radius: 10px;
}
.week-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}
.week-label {
  font-size: 15px;
  font-weight: 700;
  color: var(--sage);
  min-width: 72px;
  text-align: center;
  font-family: "Noto Serif SC", "Songti SC", serif;
}
.semester-actions {
  display: flex;
  gap: 8px;
}
.semester-actions .el-button {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', sans-serif;
}

/* Time slot section */
.time-slot-section {
  padding: 16px;
  background: var(--warm-card);
  border: 1px solid var(--warm-border);
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: var(--el-box-shadow-light);
}

/* Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
