<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <slot name="left" />
    </div>
    <div class="topbar-right">
      <el-dropdown v-if="auth.user" trigger="click">
        <span class="user-info">
          {{ auth.user.email }}
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="auth.logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--warm-card);
  border-bottom: 1px solid var(--warm-border);
}
.user-info {
  cursor: pointer;
  font-size: 14px;
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', sans-serif;
}
.user-info:hover {
  color: var(--sage);
}
</style>
