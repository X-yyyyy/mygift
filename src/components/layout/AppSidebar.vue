<script setup lang="ts">
import { ref } from 'vue'
import {
  Fold, Expand,
  HomeFilled,
  Calendar,
  List,
  StarFilled,
  Reading,
  Setting,
} from '@element-plus/icons-vue'

const collapsed = ref(false)

function toggleCollapse() {
  collapsed.value = !collapsed.value
  document.documentElement.style.setProperty(
    '--sidebar-width',
    collapsed.value ? '64px' : '220px'
  )
}
</script>

<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-header">
      <div v-show="!collapsed" class="app-brand">
        <span class="app-icon">◈</span>
        <h2 class="app-title">仪表盘</h2>
      </div>
      <el-button
        :icon="collapsed ? Expand : Fold"
        text
        class="collapse-btn"
        @click="toggleCollapse"
      />
    </div>
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item" :title="'仪表盘'">
        <span class="nav-icon">⌂</span>
        <span v-show="!collapsed">仪表盘</span>
      </router-link>
      <router-link to="/calendar" class="nav-item" :title="'日程'">
        <span class="nav-icon">☰</span>
        <span v-show="!collapsed">日程</span>
      </router-link>
      <router-link to="/todo" class="nav-item" :title="'待办'">
        <span class="nav-icon">☐</span>
        <span v-show="!collapsed">待办</span>
      </router-link>
      <router-link to="/dates" class="nav-item" :title="'重大日期'">
        <span class="nav-icon">✦</span>
        <span v-show="!collapsed">重大日期</span>
      </router-link>
      <router-link to="/course" class="nav-item" :title="'课表'">
        <span class="nav-icon">♢</span>
        <span v-show="!collapsed">课表</span>
      </router-link>
      <router-link to="/settings" class="nav-item" :title="'设置'">
        <span class="nav-icon">⚙</span>
        <span v-show="!collapsed">设置</span>
      </router-link>
    </nav>
    <div class="sidebar-footer" v-show="!collapsed">
      <span class="footer-text">Daily Dashboard</span>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width, 220px);
  height: 100vh;
  background: var(--warm-sidebar);
  display: flex;
  flex-direction: column;
  padding: 0;
  position: fixed;
  left: 0;
  top: 0;
  transition: width 0.25s ease;
  overflow: hidden;
  z-index: 100;
  border-right: 1px solid rgba(255,255,255,0.08);
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 28px;
  min-height: 24px;
}
.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 20px 0 28px;
}
.app-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.app-icon {
  font-size: 22px;
  color: #C5D0B8;
}
.app-title {
  font-family: "Noto Serif SC", "Songti SC", "STSong", serif;
  font-size: 19px;
  font-weight: 600;
  color: #F0F0E8;
  white-space: nowrap;
  letter-spacing: 1px;
}
.collapse-btn {
  font-size: 16px;
  color: #A0B090 !important;
}
.collapse-btn:hover {
  color: #E0E8D0 !important;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 10px;
  flex: 1;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #D0D8C8;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', sans-serif;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: none;
}
.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 10px 0;
}
.nav-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}
.nav-item:hover {
  background: #6A7B5A;
  color: #F5F5EE;
}
.nav-item.router-link-exact-active {
  background: rgba(255, 255, 255, 0.12);
  color: #F5F5EE;
  font-weight: 500;
}
.sidebar-footer {
  padding: 16px;
  text-align: center;
}
.footer-text {
  font-size: 11px;
  color: #A0B090;
  letter-spacing: 0.5px;
}
</style>
