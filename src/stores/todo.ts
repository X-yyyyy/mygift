import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TodoItem } from '@/types'
import {
  subscribeTodos,
  addTodo as fbAdd,
  updateTodo as fbUpdate,
  deleteTodo as fbDelete,
} from '@/utils/firestore'
import { useAuthStore } from './auth'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<TodoItem[]>([])
  const loading = ref(true)
  let unsub: (() => void) | null = null

  function fetchTodos() {
    const auth = useAuthStore()
    if (!auth.user) return
    loading.value = true
    unsub?.()
    unsub = subscribeTodos(auth.user.uid, (list) => {
      todos.value = list
      loading.value = false
    })
  }

  function stopListening() {
    unsub?.()
    unsub = null
  }

  async function addTodo(todo: Omit<TodoItem, 'id'>) {
    const auth = useAuthStore()
    if (!auth.user) return
    await fbAdd(auth.user.uid, todo)
  }

  async function updateTodo(todoId: string, data: Partial<TodoItem>) {
    const auth = useAuthStore()
    if (!auth.user) return
    await fbUpdate(auth.user.uid, todoId, data)
  }

  async function deleteTodo(todoId: string) {
    const auth = useAuthStore()
    if (!auth.user) return
    await fbDelete(auth.user.uid, todoId)
  }

  async function toggleDone(todoId: string, current: boolean) {
    await updateTodo(todoId, { done: !current })
  }

  return { todos, loading, fetchTodos, stopListening, addTodo, updateTodo, deleteTodo, toggleDone }
})
