<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useWeatherStore } from '@/stores/weather'
import { useRouter } from 'vue-router'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'
import { ElMessage } from 'element-plus'

const auth = useAuthStore()
const weatherStore = useWeatherStore()
const router = useRouter()

const city = ref('')
const darkMode = ref(false)

const popularCities = [
  '北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京',
  '重庆', '西安', '天津', '苏州', '长沙', '青岛', '大连', '厦门',
  '福州', '昆明', '沈阳', '宁波', '郑州', '合肥', '哈尔滨', '济南',
  '长春', '太原', '石家庄', '南宁', '贵阳', '海口',
]

onMounted(async () => {
  city.value = weatherStore.city
  if (auth.user) {
    const snap = await getDoc(doc(db, 'users', auth.user.uid))
    if (snap.exists()) {
      darkMode.value = !!snap.data()?.settings?.darkMode
    }
  }
})

function applyDarkMode(val: boolean) {
  document.documentElement.classList.toggle('dark', val)
}

function saveCity() {
  if (!city.value) {
    ElMessage.warning('请输入城市名称')
    return
  }
  weatherStore.setCity(city.value)
  ElMessage.success('城市已更新')
}

async function toggleDarkMode(val: boolean) {
  darkMode.value = val
  applyDarkMode(val)
  if (auth.user) {
    await setDoc(doc(db, 'users', auth.user.uid), {
      settings: { darkMode: val },
    }, { merge: true })
  }
}

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="settings-view">
    <h2 class="page-title">设置</h2>

    <el-card class="settings-card">
      <h3>天气</h3>
      <div class="setting-row">
        <el-select
          v-model="city"
          filterable
          allow-create
          clearable
          placeholder="搜索或输入城市名称"
          style="width:240px"
          @keyup.enter="saveCity"
        >
          <el-option
            v-for="c in popularCities"
            :key="c"
            :label="c"
            :value="c"
          />
        </el-select>
        <el-button type="primary" @click="saveCity">保存</el-button>
      </div>
    </el-card>

    <el-card class="settings-card">
      <h3>外观</h3>
      <div class="setting-row">
        <span>深色模式</span>
        <el-switch :model-value="darkMode" @update:model-value="toggleDarkMode" />
      </div>
    </el-card>

    <el-card class="settings-card">
      <h3>账户</h3>
      <p class="user-email">{{ auth.user?.email }}</p>
      <el-button type="danger" plain @click="handleLogout">退出登录</el-button>
    </el-card>
  </div>
</template>

<style scoped>
.settings-view { max-width: 600px; }
.page-title {
  font-size: 22px;
  color: var(--el-text-color-primary);
  margin-bottom: 24px;
  font-family: "Noto Serif SC", "Songti SC", serif;
  letter-spacing: 2px;
}
.settings-card {
  margin-bottom: 16px;
  border: 1px solid var(--warm-border) !important;
  background: var(--warm-card) !important;
}
.settings-card h3 {
  font-size: 14px;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
  font-family: "Noto Serif SC", "Songti SC", serif;
}
.setting-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-email { font-size: 14px; color: var(--el-text-color-secondary); margin-bottom: 12px; }
</style>
