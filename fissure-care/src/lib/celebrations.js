const LS_PREFIX = 'fissurecare_'
const todayKey = () => new Date().toISOString().split('T')[0]

function wasShown(key) {
  try {
    const shown = JSON.parse(localStorage.getItem(LS_PREFIX + 'celebrations_' + todayKey()) || '{}')
    return !!shown[key]
  } catch { return false }
}

function markShown(key) {
  try {
    const shown = JSON.parse(localStorage.getItem(LS_PREFIX + 'celebrations_' + todayKey()) || '{}')
    shown[key] = true
    localStorage.setItem(LS_PREFIX + 'celebrations_' + todayKey(), JSON.stringify(shown))
  } catch {}
}

export function checkAndClaimCelebrations(log, streak) {
  const celebrations = []
  const settings = (() => { try { return JSON.parse(localStorage.getItem(LS_PREFIX + 'settings') || '{}') } catch { return {} } })()
  const name = settings.userName || 'Bujji'

  // Streak milestones
  if ([3, 7, 14, 30].includes(streak)) {
    const key = 'streak_' + streak
    if (!wasShown(key)) {
      const map = {
        3: { type: 'confetti', title: `3 days in a row, ${name}! 🔥 You're doing it!` },
        7: { type: 'stars', title: `A whole week, ${name}! You showed up for yourself every single day 💛` },
        14: { type: 'fireworks', title: `Two weeks strong, ${name}. That takes real courage 🌟` },
        30: { type: 'mega', title: `30 DAYS, ${name}!! You are absolutely incredible 🎉🌸` },
      }
      celebrations.push({ key, ...map[streak] })
      markShown(key)
    }
  }

  // First Type 4 Bristol ever
  const hasType4Today = log?.bowelMovements?.some(bm => bm.bristolType === 4)
  const type4Key = 'type4_ever'
  if (hasType4Today && !wasShown(type4Key) && !localStorage.getItem(LS_PREFIX + 'type4_celebrated')) {
    celebrations.push({
      key: type4Key,
      type: 'bounce',
      title: `Perfect movement! Your gut is healing beautifully, ${name} 🍌✨`,
    })
    markShown(type4Key)
    localStorage.setItem(LS_PREFIX + 'type4_celebrated', '1')
  }

  // Water goal reached
  const waterGoal = settings.waterGoal || 8
  const waterKey = 'water_goal'
  if ((log?.hydration?.waterGlasses || 0) >= waterGoal && !wasShown(waterKey)) {
    celebrations.push({
      key: waterKey,
      type: 'drops',
      title: `Hydration hero! 💧 ${name} nailed the water goal today!`,
    })
    markShown(waterKey)
  }

  // 2+ sitz baths
  const sitzKey = 'sitz_2'
  if ((log?.sitzBaths?.length || 0) >= 2 && !wasShown(sitzKey)) {
    celebrations.push({
      key: sitzKey,
      type: 'bathtub',
      title: `So much self-care today 🛁 ${name}'s body is grateful`,
    })
    markShown(sitzKey)
  }

  return celebrations
}
