import { db } from '@/firebase/init'
import {
  doc, collection, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy,
  type Unsubscribe,
} from 'firebase/firestore'
import type { Course, TimeSlot, CalendarEvent, TodoItem, ImportantDate } from '@/types'

function userPrefix(uid: string) {
  return `users/${uid}`
}

// Courses
export function coursesRef(uid: string) {
  return collection(db, userPrefix(uid), 'courses')
}

export function subscribeCourses(uid: string, callback: (courses: Course[]) => void): Unsubscribe {
  const q = query(coursesRef(uid), orderBy('name'))
  return onSnapshot(q, (snapshot) => {
    const list: Course[] = []
    snapshot.forEach((d) => {
      const data = d.data() as Omit<Course, 'id'>
      list.push({ id: d.id, ...data })
    })
    callback(list)
  })
}

export async function addCourse(uid: string, course: Omit<Course, 'id'>) {
  return addDoc(coursesRef(uid), course)
}

export async function updateCourse(uid: string, courseId: string, data: Partial<Course>) {
  return updateDoc(doc(db, userPrefix(uid), 'courses', courseId), data)
}

export async function deleteCourse(uid: string, courseId: string) {
  return deleteDoc(doc(db, userPrefix(uid), 'courses', courseId))
}

// TimeSlots
export function timeSlotsRef(uid: string) {
  return collection(db, userPrefix(uid), 'timeSlots')
}

export function subscribeTimeSlots(uid: string, callback: (slots: TimeSlot[]) => void): Unsubscribe {
  const q = query(timeSlotsRef(uid), orderBy('slot'))
  return onSnapshot(q, (snapshot) => {
    const list: TimeSlot[] = []
    snapshot.forEach((d) => {
      const data = d.data() as Omit<TimeSlot, 'id'>
      list.push({ id: d.id, ...data })
    })
    callback(list)
  })
}

export async function batchUpdateTimeSlots(uid: string, slots: Omit<TimeSlot, 'id'>[]) {
  const ref = timeSlotsRef(uid)
  for (const s of slots) {
    await addDoc(ref, s)
  }
}

// Calendar Events
export function calendarRef(uid: string) {
  return collection(db, userPrefix(uid), 'calendar')
}

export function subscribeCalendar(uid: string, callback: (events: CalendarEvent[]) => void): Unsubscribe {
  const q = query(calendarRef(uid), orderBy('date'))
  return onSnapshot(q, (snapshot) => {
    const list: CalendarEvent[] = []
    snapshot.forEach((d) => {
      const data = d.data() as Omit<CalendarEvent, 'id'>
      list.push({ id: d.id, ...data })
    })
    callback(list)
  })
}

export async function addCalendarEvent(uid: string, event: Omit<CalendarEvent, 'id'>) {
  return addDoc(calendarRef(uid), event)
}

export async function updateCalendarEvent(uid: string, eventId: string, data: Partial<CalendarEvent>) {
  return updateDoc(doc(db, userPrefix(uid), 'calendar', eventId), data)
}

export async function deleteCalendarEvent(uid: string, eventId: string) {
  return deleteDoc(doc(db, userPrefix(uid), 'calendar', eventId))
}

// Todos
export function todosRef(uid: string) {
  return collection(db, userPrefix(uid), 'todos')
}

export function subscribeTodos(uid: string, callback: (todos: TodoItem[]) => void): Unsubscribe {
  const q = query(todosRef(uid), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const list: TodoItem[] = []
    snapshot.forEach((d) => {
      const data = d.data() as Omit<TodoItem, 'id'>
      list.push({ id: d.id, ...data })
    })
    callback(list)
  })
}

export async function addTodo(uid: string, todo: Omit<TodoItem, 'id'>) {
  return addDoc(todosRef(uid), todo)
}

export async function updateTodo(uid: string, todoId: string, data: Partial<TodoItem>) {
  return updateDoc(doc(db, userPrefix(uid), 'todos', todoId), data)
}

export async function deleteTodo(uid: string, todoId: string) {
  return deleteDoc(doc(db, userPrefix(uid), 'todos', todoId))
}

// Important Dates
export function importantDatesRef(uid: string) {
  return collection(db, userPrefix(uid), 'importantDates')
}

export function subscribeImportantDates(uid: string, callback: (dates: ImportantDate[]) => void): Unsubscribe {
  const q = query(importantDatesRef(uid), orderBy('date'))
  return onSnapshot(q, (snapshot) => {
    const list: ImportantDate[] = []
    snapshot.forEach((d) => {
      const data = d.data() as Omit<ImportantDate, 'id'>
      list.push({ id: d.id, ...data })
    })
    callback(list)
  })
}

export async function addImportantDate(uid: string, date: Omit<ImportantDate, 'id'>) {
  return addDoc(importantDatesRef(uid), date)
}

export async function updateImportantDate(uid: string, dateId: string, data: Partial<ImportantDate>) {
  return updateDoc(doc(db, userPrefix(uid), 'importantDates', dateId), data)
}

export async function deleteImportantDate(uid: string, dateId: string) {
  return deleteDoc(doc(db, userPrefix(uid), 'importantDates', dateId))
}

// Semester
export function semesterRef(uid: string) {
  return doc(db, userPrefix(uid), 'semester', 'current')
}
