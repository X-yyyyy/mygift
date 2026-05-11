<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <van-nav-bar :title="title" />
</template>
