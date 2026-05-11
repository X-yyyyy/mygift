<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/init'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopBar from '@/components/layout/AppTopBar.vue'
import { isNativeApp } from '@/utils/platform'

const router = useRouter()
const auth = useAuthStore()

onMounted(async () => {
  if (auth.user) {
    const snap = await getDoc(doc(db, 'users', auth.user.uid))
    if (snap.exists()) {
      const dark = !!snap.data()?.settings?.darkMode
      document.documentElement.classList.toggle('dark', dark)
    }
    // Redirect native app to mobile layout
    if (isNativeApp() && !window.location.pathname.startsWith('/m/')) {
      router.replace('/m/home')
    }
  }
})
</script>

<template>
  <template v-if="auth.user">
    <AppSidebar />
    <div class="main-area">
      <AppTopBar />
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </template>
  <template v-else-if="!auth.loading">
    <router-view />
  </template>
</template>

<style>
:root {
  --sidebar-width: 220px;

  /* Sage & warm palette */
  --sage: #7A8B6A;
  --sage-light: #9AAA8A;
  --sage-lighter: #C5D0B8;
  --sage-pale: #E5ECD8;
  --sage-bg: #F2F5EC;

  --warm-bg: #F0F0E8;
  --warm-card: #FFFBF5;
  --warm-sidebar: var(--sage);
  --warm-sidebar-hover: #6A7B5A;
  --warm-text: #3D3D35;
  --warm-text-secondary: #8A8A7A;
  --warm-border: #E0E0D5;
  --warm-primary: #5A6B4A;
  --warm-primary-light: #7A8B6A;
  --warm-accent: #4A5B3A;

  /* Element Plus overrides */
  --el-color-primary: #5A6B4A;
  --el-color-primary-light-3: #7A8B6A;
  --el-color-primary-light-5: #9AAA8A;
  --el-color-primary-light-7: #C5D0B8;
  --el-color-primary-light-9: #E5ECD8;
  --el-color-success: var(--sage);
  --el-color-warning: #C49A4A;
  --el-color-danger: #C46A5A;
  --el-color-info: var(--sage-light);

  --el-bg-color: #FFFBF5;
  --el-bg-color-page: #F0F0E8;
  --el-bg-color-overlay: #FFFBF5;
  --el-text-color-primary: #3D3D35;
  --el-text-color-regular: #5C5A50;
  --el-text-color-secondary: #8A8A7A;
  --el-text-color-placeholder: #B5B5A5;
  --el-border-color: #E0E0D5;
  --el-border-color-light: #E8E8DE;
  --el-border-color-lighter: #F0F0E8;
  --el-border-color-extra-light: #F5F5EE;
  --el-fill-color: #F0F0E8;
  --el-fill-color-light: #F5F5EE;
  --el-fill-color-lighter: #F8F8F2;
  --el-fill-color-extra-light: #FBFBF8;

  --el-box-shadow: 0 2px 12px rgba(60, 60, 50, 0.06);
  --el-box-shadow-light: 0 2px 8px rgba(60, 60, 50, 0.04);
  --el-box-shadow-lighter: 0 1px 4px rgba(60, 60, 50, 0.03);

  --el-border-radius-base: 8px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: "Noto Serif SC", "Songti SC", "STSong", "Georgia", serif;
  color: var(--el-text-color-primary);
  background: var(--warm-bg);
}

body {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(122, 139, 106, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(193, 121, 90, 0.03) 0%, transparent 50%),
    var(--warm-bg);
}

.el-button, .el-input, .el-select, .el-tabs, .el-dropdown,
.el-form-item, .el-table, .el-menu, .el-dialog {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans SC', sans-serif;
}

.main-area {
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.25s ease;
  background: transparent;
}

.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: transparent;
}

.main-content::-webkit-scrollbar { width: 8px; }
.main-content::-webkit-scrollbar-track { background: transparent; }
.main-content::-webkit-scrollbar-thumb {
  background: var(--sage-lighter);
  border-radius: 4px;
}
.main-content::-webkit-scrollbar-thumb:hover {
  background: var(--sage-light);
}

/* Element Plus tweaks */
.el-card {
  border: 1px solid var(--warm-border) !important;
  border-radius: 10px !important;
  background: var(--warm-card) !important;
}

.el-button--primary {
  --el-button-text-color: #F5F5EE;
}
.el-button--primary:hover {
  --el-button-hover-bg-color: #4A5B3A;
  --el-button-hover-border-color: #4A5B3A;
}

.el-button--success {
  --el-button-bg-color: var(--sage);
  --el-button-border-color: var(--sage);
}
.el-button--success:hover {
  --el-button-hover-bg-color: var(--sage-light);
  --el-button-hover-border-color: var(--sage-light);
}

.el-dialog {
  border-radius: 12px;
  border: 1px solid var(--warm-border);
}

.el-tabs__item.is-active {
  color: var(--el-color-primary) !important;
}
.el-tabs__active-bar {
  background-color: var(--el-color-primary) !important;
}

.el-input__wrapper {
  background-color: var(--warm-card) !important;
  border-radius: 6px !important;
  border: 1px solid var(--warm-border) !important;
  box-shadow: none !important;
}
.el-input__wrapper:hover {
  border-color: var(--sage-light) !important;
}
.el-input__wrapper.is-focus {
  border-color: var(--sage) !important;
}
.el-input__inner {
  color: var(--el-text-color-primary) !important;
}

.el-select .el-input__wrapper {
  border-color: var(--warm-border) !important;
}

/* Checkbox */
.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: var(--sage) !important;
  border-color: var(--sage) !important;
}

/* Switch */
.el-switch.is-checked .el-switch__core {
  background-color: var(--sage) !important;
  border-color: var(--sage) !important;
}

/* Tag / badge */
.el-tag--success {
  --el-tag-bg-color: var(--sage-pale) !important;
  --el-tag-text-color: var(--sage) !important;
  --el-tag-border-color: var(--sage-lighter) !important;
}
</style>
