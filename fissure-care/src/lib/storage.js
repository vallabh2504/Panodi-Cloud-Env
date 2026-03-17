import { supabase } from './supabase'

const LS_PREFIX = 'fissurecare_'

// Daily Logs
export async function saveLog(date, data) {
  const score = calcWellnessScore(data)
  data.wellnessScore = score
  // Save to localStorage always
  localStorage.setItem(LS_PREFIX + 'log_' + date, JSON.stringify(data))
  // Try Supabase
  try {
    await supabase.from('daily_logs').upsert({ date, data, wellness_score: score }, { onConflict: 'date' })
  } catch (e) { console.warn('Supabase sync failed, using local', e) }
  return data
}

export async function getLog(date) {
  // Try local first
  const local = localStorage.getItem(LS_PREFIX + 'log_' + date)
  if (local) return JSON.parse(local)
  // Try Supabase
  try {
    const { data } = await supabase.from('daily_logs').select('data').eq('date', date).single()
    if (data) return data.data
  } catch (e) {}
  return null
}

export async function getAllLogs() {
  const logs = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(LS_PREFIX + 'log_')) {
      try { logs.push(JSON.parse(localStorage.getItem(key))) } catch (e) {}
    }
  }
  return logs.sort((a, b) => new Date(b.date) - new Date(a.date))
}

// Medications
export async function saveMedications(meds) {
  localStorage.setItem(LS_PREFIX + 'medications', JSON.stringify(meds))
  try {
    // Upsert each med
    for (const med of meds) {
      await supabase.from('medications').upsert(med, { onConflict: 'id' })
    }
  } catch (e) {}
}

export function getMedications() {
  const data = localStorage.getItem(LS_PREFIX + 'medications')
  return data ? JSON.parse(data) : []
}

// Settings
export function getSettings() {
  const data = localStorage.getItem(LS_PREFIX + 'settings')
  return data ? JSON.parse(data) : {
    userName: '',
    waterGoal: 8,
    fiberGoal: 25,
    darkMode: false
  }
}

export function saveSettings(settings) {
  localStorage.setItem(LS_PREFIX + 'settings', JSON.stringify(settings))
}

// Streak
export function getStreak() {
  const logs = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(LS_PREFIX + 'log_')) logs.push(key.replace(LS_PREFIX + 'log_', ''))
  }
  if (!logs.length) return 0
  const sorted = logs.sort((a, b) => new Date(b) - new Date(a))
  let streak = 0
  let current = new Date()
  current.setHours(0, 0, 0, 0)
  for (const dateStr of sorted) {
    const d = new Date(dateStr)
    d.setHours(0, 0, 0, 0)
    const diff = (current - d) / (1000 * 60 * 60 * 24)
    if (diff <= 1) { streak++; current = d }
    else break
  }
  return streak
}

export function calcWellnessScore(log) {
  if (!log) return 0
  const water = ((log.hydration?.waterGlasses || 0) / 8) * 25
  const fruits = Math.min((log.fruitsEaten?.length || 0) / 3, 1) * 20
  const sitz = Math.min((log.sitzBaths?.length || 0) / 2, 1) * 20
  const avgPain = log.bowelMovements?.length
    ? log.bowelMovements.reduce((s, bm) => s + (bm.painLevel || 0), 0) / log.bowelMovements.length
    : (log.dailySymptoms?.restingPain || 0)
  const pain = ((10 - avgPain) / 10) * 20
  const bmTypes = log.bowelMovements?.map(bm => bm.bristolType) || []
  const bm = bmTypes.includes(4) ? 15 : bmTypes.some(t => t === 3 || t === 5) ? 10 : bmTypes.length ? 5 : 0
  return Math.round(Math.min(water + fruits + sitz + pain + bm, 100))
}
