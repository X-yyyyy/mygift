<!-- src/mobile/views/SettingsView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useSemesterStore } from '@/stores/semester'
import { useWeatherStore } from '@/stores/weather'
import { useAuthStore } from '@/stores/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'

const semesterStore = useSemesterStore()
const weatherStore = useWeatherStore()
const authStore = useAuthStore()

const darkMode = ref(false)

onMounted(async () => {
  if (authStore.user) {
    const snap = await getDoc(doc(db, 'users', authStore.user.uid))
    darkMode.value = !!snap.data()?.settings?.darkMode
  }
})

async function toggleDark(val: boolean) {
  darkMode.value = val
  document.documentElement.classList.toggle('dark', val)
  if (authStore.user) {
    await setDoc(doc(db, 'users', authStore.user.uid), {
      settings: { darkMode: val },
    }, { merge: true })
  }
}

function onCityChange() {
  weatherStore.setCity(weatherStore.city)
}

async function handleLogout() {
  await authStore.logout()
}
</script>

<template>
  <div class="settings-view">
    <van-cell-group inset>
      <van-cell title="学期名称">
        <template #value>
          <span class="cell-value">{{ semesterStore.semesterName || '未设置' }}</span>
        </template>
      </van-cell>
      <van-cell title="起始日期">
        <template #value>
          <span class="cell-value">{{ semesterStore.startDate ? dayjs(semesterStore.startDate).format('YYYY/M/D') : '未设置' }}</span>
        </template>
      </van-cell>
      <van-cell title="总周数">
        <template #value>
          <span class="cell-value">{{ semesterStore.totalWeeks }} 周</span>
        </template>
      </van-cell>
      <van-cell title="当前周">
        <template #value>
          <span class="cell-value">第 {{ semesterStore.currentWeek }} 周</span>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset style="margin-top: 12px;">
      <van-cell title="城市">
        <template #value>
          <van-field
            v-model="weatherStore.city"
            placeholder="输入城市名"
style="width: 130px"
            @blur="onCityChange"
          />
        </template>
      </van-cell>
      <van-cell title="深色模式">
        <template #right-icon>
          <van-switch :model-value="darkMode" @update:model-value="toggleDark" active-color="#5A6B4A" />
        </template>
      </van-cell>
    </van-cell-group>

    <div style="margin: 32px 16px;">
      <van-button round block type="danger" plain @click="handleLogout">登出</van-button>
    </div>
  </div>
</template>

<style scoped>
.settings-view { padding-bottom: 16px; }
.cell-value { color: #8A8A7A; font-size: 13px; }
</style>
