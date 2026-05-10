import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WeatherData, ForecastDay } from '@/utils/weather'
import { fetchCurrentWeather, fetchForecast } from '@/utils/weather'

const CACHE_KEY = 'dashboard_weather'
const CACHE_TTL = 30 * 60 * 1000

export const useWeatherStore = defineStore('weather', () => {
  const current = ref<WeatherData | null>(null)
  const forecast = ref<ForecastDay[]>([])
  const loading = ref(false)
  const error = ref('')
  const city = ref(localStorage.getItem('weather_city') || '北京')

  async function refresh(force = false) {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!force && cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          current.value = parsed.current
          forecast.value = parsed.forecast
          return
        }
      } catch { /* ignore */ }
    }

    loading.value = true
    error.value = ''
    try {
      const [curr, fore] = await Promise.all([
        fetchCurrentWeather(city.value),
        fetchForecast(city.value),
      ])
      if (curr) current.value = curr
      if (fore.length) forecast.value = fore
      if (curr && fore.length) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          current: curr, forecast: fore, timestamp: Date.now(),
        }))
      }
    } catch {
      error.value = '获取天气失败'
    } finally {
      loading.value = false
    }
  }

  function setCity(c: string) {
    city.value = c
    localStorage.setItem('weather_city', c)
    refresh(true)
  }

  return { current, forecast, loading, error, city, refresh, setCity }
})
