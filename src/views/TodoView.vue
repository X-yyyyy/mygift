<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useTodoStore } from '@/stores/todo'
import { toDate } from '@/types'
const store = useTodoStore()
const filter = ref<'all' | 'active' | 'done'>('all')
const newContent = ref('')
const editingId = ref<string | null>(null)
const editContent = ref('')

onMounted(() => store.fetchTodos())

const filteredTodos = computed(() => {
  let list = store.todos
  if (filter.value === 'active') list = list.filter(t => !t.done)
  else if (filter.value === 'done') list = list.filter(t => t.done)
  return list
})

async function addTodo() {
  const content = newContent.value.trim()
  if (!content) return
  await store.addTodo({ content, done: false, createdAt: new Date() })
  newContent.value = ''
}

async function handleToggle(todo: any) {
  await store.toggleDone(todo.id, todo.done)
}

function startEdit(todo: any) {
  editingId.value = todo.id
  editContent.value = todo.content
}

async function saveEdit(id: string) {
  const content = editContent.value.trim()
  if (!content) return
  await store.updateTodo(id, { content })
  editingId.value = null
}

async function handleDelete(id: string | undefined) {
  if (!id) return
  await store.deleteTodo(id)
}
</script>

<template>
  <div class="todo-view">
    <div class="view-header">
      <h2>待办</h2>
    </div>

    <div class="add-bar">
      <el-input v-model="newContent" placeholder="添加待办..." @keyup.enter="addTodo" />
      <el-button type="primary" @click="addTodo">添加</el-button>
    </div>

    <div class="filter-bar">
      <el-radio-group v-model="filter">
        <el-radio-button value="all">全部</el-radio-button>
        <el-radio-button value="active">未完成</el-radio-button>
        <el-radio-button value="done">已完成</el-radio-button>
      </el-radio-group>
    </div>

    <div v-if="filteredTodos.length === 0" class="empty">
      暂无待办
    </div>

    <div v-for="todo in filteredTodos" :key="todo.id" class="todo-item" :class="{ done: todo.done }">
      <el-checkbox :model-value="todo.done" @change="handleToggle(todo)" />
      <template v-if="editingId === todo.id">
        <el-input v-model="editContent" size="small" @keyup.enter="saveEdit(todo.id)" @blur="saveEdit(todo.id)" />
      </template>
      <template v-else>
        <span class="todo-content" @click="startEdit(todo)">{{ todo.content }}</span>
      </template>
      <span v-if="toDate(todo.dueDate)" class="todo-due">
        截止: {{ dayjs(toDate(todo.dueDate)!).format('M/D') }}
      </span>
      <el-button text type="danger" size="small" @click="handleDelete(todo.id)">删除</el-button>
    </div>
  </div>
</template>

<style scoped>
.todo-view { max-width: 600px; }
.view-header { margin-bottom: 16px; }
.view-header h2 { font-size: 20px; color: var(--el-text-color-primary); }
.add-bar { display: flex; gap: 8px; margin-bottom: 16px; }
.filter-bar { margin-bottom: 16px; }
.empty { color: var(--el-text-color-secondary); padding: 40px; text-align: center; }
.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  transition: background 0.15s;
  margin-bottom: 4px;
}
.todo-item:hover { background: var(--el-fill-color-light); }
.todo-item.done .todo-content {
  text-decoration: line-through;
  color: var(--el-text-color-disabled);
}
.todo-content { flex: 1; cursor: pointer; }
.todo-due { font-size: 12px; color: var(--el-text-color-secondary); }
</style>
