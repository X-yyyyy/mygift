<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { ElMessage } from 'element-plus'

const weather = useWeatherStore()

const popularCities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京', '重庆', '西安']
const showPicker = ref(false)

onMounted(() => weather.refresh())

function selectCity(city: string) {
  weather.setCity(city)
  showPicker.value = false
}
</script>

<template>
  <div class="weather-widget">
    <template v-if="weather.loading && !weather.current">
      <span class="loading">加载天气...</span>
    </template>
    <template v-else-if="weather.current">
      <div class="weather-main">
        <img
          v-if="weather.current.icon"
          :src="`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`"
          class="weather-icon"
          alt=""
        />
        <div class="weather-temp">{{ weather.current.temp }}°C</div>
        <div class="weather-desc">{{ weather.current.description }}</div>
      </div>
      <div class="weather-details">
        <span>体感 {{ weather.current.feelsLike }}°C</span>
        <span>湿度 {{ weather.current.humidity }}%</span>
        <span class="weather-city" @click="showPicker = !showPicker">
          {{ weather.city }} ▾
        </span>
      </div>
      <!-- City picker dropdown -->
      <Transition name="fade">
        <div v-if="showPicker" class="city-picker">
          <div class="city-picker-inner">
            <button
              v-for="c in popularCities"
              :key="c"
              class="city-option"
              :class="{ active: c === weather.city }"
              @click="selectCity(c)"
            >
              {{ c }}
            </button>
          </div>
        </div>
      </Transition>
    </template>
    <div v-else-if="weather.error" class="error">{{ weather.error }}</div>
  </div>
</template>

<style scoped>
.weather-widget {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}
.weather-main {
  display: flex;
  align-items: center;
  gap: 8px;
}
.weather-icon { width: 40px; height: 40px; }
.weather-temp { font-size: 24px; font-weight: 700; }
.weather-desc { font-size: 14px; color: var(--el-text-color-secondary); }
.weather-details {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.weather-city {
  color: var(--sage);
  cursor: pointer;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.15s;
}
.weather-city:hover {
  background: var(--sage-pale);
}
.loading, .error { font-size: 14px; color: var(--el-text-color-secondary); }
.error { color: var(--el-color-danger); }

/* City picker */
.city-picker {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 50;
  margin-top: 4px;
  background: var(--warm-card);
  border: 1px solid var(--warm-border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(60, 43, 31, 0.12);
  padding: 8px;
}
.city-picker-inner {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
  min-width: 280px;
}
.city-option {
  padding: 6px 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: var(--el-text-color-regular);
  text-align: center;
  transition: all 0.15s;
  font-family: inherit;
}
.city-option:hover {
  background: var(--sage-pale);
  color: var(--sage);
}
.city-option.active {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 600;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
