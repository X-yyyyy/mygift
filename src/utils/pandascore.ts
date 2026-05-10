import type { CsgoEvent } from '@/types'

const BASE = 'https://api.pandascore.co'
const PER_PAGE = 50

function getKey(): string {
  return import.meta.env.VITE_PANDASCORE_API_KEY || ''
}

function parseTeams(matchName: string): [string, string] {
  const parts = matchName.split(' vs ')
  if (parts.length >= 2) {
    const left = parts[0].includes(':') ? parts[0].split(':')[1].trim() : parts[0].trim()
    return [left, parts[1].trim()]
  }
  return [matchName, '']
}

export async function fetchUpcomingTournaments(): Promise<CsgoEvent[]> {
  const key = getKey()
  if (!key) return []
  const res = await fetch(
    `${BASE}/csgo/tournaments/upcoming?sort=begin_at&per_page=${PER_PAGE}&filter[tier]=s,a`,
    { headers: { Authorization: `Bearer ${key}` } }
  )
  if (!res.ok) return []
  const data: any[] = await res.json()
  const matches: CsgoEvent[] = []
  for (const t of data) {
    const leagueName = t.league?.name || ''
    const logo = t.league?.image_url || ''
    for (const m of t.matches || []) {
      const [team1, team2] = parseTeams(m.name)
      matches.push({
        id: String(m.id),
        matchName: m.name,
        team1,
        team2,
        beginAt: m.begin_at || '',
        leagueName,
        logo,
        startDate: m.begin_at?.split('T')[0] || '',
        endDate: '',
      })
    }
  }
  return matches
}
