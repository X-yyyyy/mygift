<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useTodoStore } from '@/stores/todo'
import { toDate } from '@/types'
const store = useTodoStore()
const newContent = ref('')

const activeTodos = computed(() =>
  store.todos
    .filter(t => !t.done)
    .slice(0, 5)
)

async function addTodo() {
  const content = newContent.value.trim()
  if (!content) return
  await store.addTodo({ content, done: false, createdAt: new Date() })
  newContent.value = ''
}

async function toggleDone(todo: any) {
  try {
    await store.toggleDone(todo.id, todo.done)
  } catch (e) {
    console.error('toggle todo failed', e)
  }
}
</script>

<template>
  <div class="todo-widget">
    <div v-if="activeTodos.length === 0" class="empty">
      没有未完成的待办 🎉
    </div>
    <div
      v-for="todo in activeTodos"
      :key="todo.id"
      class="todo-item"
      @click="toggleDone(todo)"
    >
      <span class="todo-check" :class="{ checked: todo.done }">
        <span v-if="todo.done" class="check-mark">✓</span>
      </span>
      <span class="todo-content" :class="{ done: todo.done }">{{ todo.content }}</span>
      <span v-if="toDate(todo.dueDate)" class="todo-due">
        截止: {{ dayjs(toDate(todo.dueDate)).format('M/D') }}
      </span>
    </div>
    <div class="add-row">
      <el-input
        v-model="newContent"
        placeholder="添加待办..."
        size="small"
        @keyup.enter="addTodo"
      />
    </div>
    <router-link to="/todo" class="view-more">查看全部 →</router-link>
  </div>
</template>

<style scoped>
.todo-widget { font-size: 14px; }
.empty { color: var(--el-text-color-secondary); padding: 16px 0; text-align: center; font-size: 13px; }
.todo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s;
}
.todo-item:hover {
  background: var(--el-color-primary-light-9);
}
.todo-check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--warm-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  font-size: 12px;
}
.todo-check.checked {
  background: var(--sage);
  border-color: var(--sage);
}
.check-mark {
  color: white;
  font-weight: 700;
}
.todo-content { flex: 1; color: var(--el-text-color-primary); }
.todo-content.done { text-decoration: line-through; color: var(--el-text-color-secondary); }
.todo-due { font-size: 12px; color: var(--el-text-color-secondary); white-space: nowrap; }
.add-row { margin-top: 8px; }
.view-more {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: var(--sage);
  text-decoration: none;
}
</style>
