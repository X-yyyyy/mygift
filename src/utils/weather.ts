const BASE = 'https://api.openweathermap.org/data/2.5'

function getKey(): string {
  return import.meta.env.VITE_OPENWEATHERMAP_API_KEY || ''
}

const CITY_ALIASES: Record<string, string> = {
  '北京': 'Beijing',
  '上海': 'Shanghai',
  '广州': 'Guangzhou',
  '深圳': 'Shenzhen',
  '杭州': 'Hangzhou',
  '成都': 'Chengdu',
  '武汉': 'Wuhan',
  '南京': 'Nanjing',
  '重庆': 'Chongqing',
  '西安': "Xi'an",
  '天津': 'Tianjin',
  '苏州': 'Suzhou',
  '长沙': 'Changsha',
  '青岛': 'Qingdao',
  '大连': 'Dalian',
  '厦门': 'Xiamen',
  '福州': 'Fuzhou',
  '昆明': 'Kunming',
  '沈阳': 'Shenyang',
  '宁波': 'Ningbo',
}

function normalizeCity(city: string): string {
  return CITY_ALIASES[city] || city
}

export interface WeatherData {
  temp: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
  city: string
}

export interface ForecastDay {
  date: string
  tempMax: number
  tempMin: number
  icon: string
  description: string
}

export async function fetchCurrentWeather(city: string): Promise<WeatherData | null> {
  const key = getKey()
  if (!key) return null
  const res = await fetch(`${BASE}/weather?q=${normalizeCity(city)}&units=metric&lang=zh_cn&appid=${key}`)
  if (!res.ok) return null
  const d = await res.json()
  return {
    temp: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    humidity: d.main.humidity,
    description: d.weather[0].description,
    icon: d.weather[0].icon,
    city: d.name,
  }
}

export async function fetchForecast(city: string): Promise<ForecastDay[]> {
  const key = getKey()
  if (!key) return []
  const res = await fetch(`${BASE}/forecast?q=${normalizeCity(city)}&units=metric&lang=zh_cn&appid=${key}`)
  if (!res.ok) return []
  const d = await res.json()
  const daily: Record<string, ForecastDay> = {}
  for (const item of d.list) {
    const date = item.dt_txt.split(' ')[0]
    if (!daily[date]) {
      daily[date] = {
        date,
        tempMax: item.main.temp_max,
        tempMin: item.main.temp_min,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      }
    } else {
      daily[date].tempMax = Math.max(daily[date].tempMax, item.main.temp_max)
      daily[date].tempMin = Math.min(daily[date].tempMin, item.main.temp_min)
    }
  }
  return Object.values(daily).slice(0, 5)
}
