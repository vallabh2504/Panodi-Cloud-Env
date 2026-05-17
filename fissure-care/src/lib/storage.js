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
  const water = ((log.hydration?.waterGlasses || 0) / 8) * 20
  const fruits = Math.min((log.fruitsEaten?.length || 0) / 3, 1) * 15
  const fiber = Math.min((log.fiberFoods?.length || 0) / 3, 1) * 15
  const sitz = Math.min((log.sitzBaths?.length || 0) / 2, 1) * 15
  const avgPain = log.bowelMovements?.length
    ? log.bowelMovements.reduce((s, bm) => s + (bm.painLevel || 0), 0) / log.bowelMovements.length
    : (log.dailySymptoms?.restingPain || 0)
  const pain = ((10 - avgPain) / 10) * 25
  const bmTypes = log.bowelMovements?.map(bm => bm.bristolType) || []
  const bm = bmTypes.includes(4) ? 10 : bmTypes.some(t => t === 3 || t === 5) ? 7 : bmTypes.length ? 3 : 0
  // boAt watch bonuses (capped so total never exceeds 100)
  const steps = log.activity?.steps || 0
  const walking = steps >= 7500 ? 10 : steps >= 5000 ? 7 : steps >= 2500 ? 4 : steps > 0 ? 1 : 0
  const sleep = log.activity?.sleepHours || 0
  const sleepBonus = sleep >= 7 ? 5 : sleep >= 6 ? 3 : sleep >= 5 ? 1 : 0
  return Math.round(Math.min(water + fruits + fiber + sitz + pain + bm + walking + sleepBonus, 100))
}

// boAt watch data CRUD
export function getWatchData(date) {
  try {
    const d = localStorage.getItem('fissurecare_watch_' + date)
    return d ? JSON.parse(d) : null
  } catch { return null }
}

export async function saveWatchData(date, watchData) {
  localStorage.setItem('fissurecare_watch_' + date, JSON.stringify(watchData))
  // backward-compat step key
  if (watchData.steps) localStorage.setItem('fissurecare_steps_' + date, String(watchData.steps))
  // patch daily log activity if it exists
  const log = await getLog(date)
  if (log) {
    if (!log.activity) log.activity = {}
    if (watchData.steps != null)        log.activity.steps        = watchData.steps
    if (watchData.activeMinutes != null) log.activity.walkingMinutes = watchData.activeMinutes
    if (watchData.heartRate != null)    log.activity.heartRate    = watchData.heartRate
    if (watchData.spO2 != null)         log.activity.spO2         = watchData.spO2
    if (watchData.sleepHours != null)   log.activity.sleepHours   = watchData.sleepHours
    if (watchData.calories != null)     log.activity.calories     = watchData.calories
    await saveLog(date, log)
  }
}

export function getAllWatchData() {
  const result = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('fissurecare_watch_')) {
      try {
        const date = key.replace('fissurecare_watch_', '')
        result.push({ date, ...JSON.parse(localStorage.getItem(key)) })
      } catch {}
    }
  }
  return result.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getHealingDayFreezes() {
  const data = localStorage.getItem('fissurecare_freezes')
  return data ? JSON.parse(data) : { used: 0, lastReset: new Date().toISOString().slice(0, 7) }
}

export function useHealingDayFreeze() {
  const f = getHealingDayFreezes()
  const thisMonth = new Date().toISOString().slice(0, 7)
  if (f.lastReset !== thisMonth) { f.used = 0; f.lastReset = thisMonth }
  if (f.used >= 2) return false
  f.used++
  localStorage.setItem('fissurecare_freezes', JSON.stringify(f))
  return true
}
