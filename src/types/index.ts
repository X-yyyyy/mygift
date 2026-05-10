export interface Semester {
  name: string
  startDate: Date
  totalWeeks: number
}

export interface Schedule {
  dayOfWeek: number
  startSlot: number
  duration: number
  weekType: 'all' | 'odd' | 'even' | 'custom'
  customWeeks?: number[]
}

export type CourseType = 'required' | 'elective'

export interface Course {
  id?: string
  name: string
  teacher: string
  location: string
  type: CourseType
  color: string
  schedules: Schedule[]
}

export interface TimeSlot {
  id?: string
  slot: number
  startTime: string
  endTime: string
}

import { Timestamp } from 'firebase/firestore'

export type FirestoreDate = Timestamp | Date

export function toDate(d: FirestoreDate | null | undefined): Date | null {
  if (!d) return null
  if (d instanceof Timestamp) return d.toDate()
  if (d instanceof Date) return d
  return null
}

export interface CalendarEvent {
  id?: string
  title: string
  date: FirestoreDate
  time?: string
  note?: string
}

export interface TodoItem {
  id?: string
  content: string
  done: boolean
  dueDate?: FirestoreDate
  createdAt: FirestoreDate
}

export interface ImportantDate {
  id?: string
  name: string
  date: FirestoreDate
  color: string
  type: 'birthday' | 'anniversary' | 'custom'
  note?: string
}

export interface CsgoEvent {
  id: string
  matchName: string
  team1: string
  team2: string
  beginAt: string
  leagueName: string
  logo?: string
  startDate: string
  endDate: string
}

export interface UserProfile {
  name: string
  email: string
  photoURL: string
}

export interface UserSettings {
  themeColor: string
  darkMode: boolean
  weekStartsOn: number
}

export const DEFAULT_TIME_SLOTS: Omit<TimeSlot, 'id'>[] = [
  { slot: 1, startTime: '08:00', endTime: '08:45' },
  { slot: 2, startTime: '08:50', endTime: '09:35' },
  { slot: 3, startTime: '09:50', endTime: '10:35' },
  { slot: 4, startTime: '10:40', endTime: '11:25' },
  { slot: 5, startTime: '11:30', endTime: '12:15' },
  { slot: 6, startTime: '14:00', endTime: '14:45' },
  { slot: 7, startTime: '14:50', endTime: '15:35' },
  { slot: 8, startTime: '15:50', endTime: '16:35' },
  { slot: 9, startTime: '16:40', endTime: '17:25' },
  { slot: 10, startTime: '19:00', endTime: '19:45' },
  { slot: 11, startTime: '19:50', endTime: '20:35' },
  { slot: 12, startTime: '20:40', endTime: '21:25' },
]

export const COLORS = [
  '#8FA88F', '#B5A88A', '#D4A76A', '#C47A6B',
  '#A88A9B', '#7A9B8A', '#C4A882', '#D4A0A0',
]
