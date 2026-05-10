<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e: any) {
    const msg = e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password'
      ? '邮箱或密码错误'
      : e.code === 'auth/invalid-credential'
        ? '邮箱或密码错误'
        : '登录失败，请重试'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  loading.value = true
  try {
    await auth.loginWithGoogle()
    router.push('/')
  } catch {
    ElMessage.error('Google 登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">日常仪表盘</h1>
      <el-form @submit.prevent="handleLogin">
        <el-form-item>
          <el-input v-model="email" placeholder="邮箱" type="email" size="large" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" placeholder="密码" type="password" size="large" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="w-full" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <el-divider>或</el-divider>
      <el-button size="large" class="w-full" @click="handleGoogleLogin" :disabled="loading">
        Google 登录
      </el-button>
      <div class="auth-links">
        <router-link to="/register">注册账号</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(122, 139, 106, 0.07) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(193, 121, 90, 0.04) 0%, transparent 50%),
    var(--warm-bg);
}
.auth-card {
  width: 400px;
  padding: 40px;
  background: var(--warm-card);
  border-radius: 16px;
  border: 1px solid var(--warm-border);
  box-shadow: 0 8px 32px rgba(60, 43, 31, 0.08);
}
.auth-title {
  text-align: center;
  margin-bottom: 32px;
  font-size: 28px;
  color: var(--el-text-color-primary);
  font-family: "Noto Serif SC", "Songti SC", serif;
  letter-spacing: 3px;
}
.w-full {
  width: 100%;
}
.auth-links {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 14px;
}
.auth-links a {
  color: var(--el-color-primary);
  text-decoration: none;
}
.auth-links a:hover {
  color: var(--sage);
}
</style>
