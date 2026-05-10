<script setup lang="ts">
const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
</script>

<template>
  <div class="grid-header">
    <div class="time-corner"></div>
    <div v-for="(name, i) in dayNames" :key="i" class="day-header">
      {{ name }}
    </div>
  </div>
</template>

<style scoped>
.grid-header {
  display: contents;
}
:root {
  --grid-header-bg: var(--sage-pale, #E5ECD8);
}
.time-corner {
  grid-column: 1;
  grid-row: 1;
  background: var(--grid-header-bg);
  border-bottom: 1px solid var(--warm-border);
  border-right: 1px solid var(--warm-border);
  position: sticky;
  top: 0;
  z-index: 3;
}
.day-header {
  background: var(--grid-header-bg);
  border-bottom: 1px solid var(--warm-border);
  border-right: 1px solid var(--warm-border);
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #5C5A50;
  position: sticky;
  top: 0;
  z-index: 2;
  font-family: "Noto Serif SC", "Songti SC", serif;
}
.day-header:last-child {
  border-right: none;
}
</style>
