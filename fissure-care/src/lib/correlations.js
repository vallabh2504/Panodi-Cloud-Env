const FOOD_NAMES = {
  banana: 'Banana', papaya: 'Papaya', grapes: 'Grapes', watermelon: 'Watermelon',
  chikoo: 'Chikoo', jamun: 'Jamun', apple: 'Apple', pear: 'Pear', kiwi: 'Kiwi',
  mango: 'Mango', guava: 'Guava',
  fiber_oats: 'Oats', fiber_brown_rice: 'Brown rice', fiber_lentils: 'Lentils',
  fiber_spinach: 'Spinach', fiber_carrots: 'Carrots', fiber_isabgol: 'Isabgol husk',
  avoid_spicy: 'Spicy food', avoid_fried: 'Fried food', avoid_red_meat: 'Red meat',
  avoid_alcohol: 'Alcohol', avoid_coffee: 'Coffee', avoid_salty: 'Salty food',
  avoid_white_bread: 'White bread',
}

export function analyzeFoodOutcomes(logs) {
  const foodMap = {}
  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date))

  for (let i = 0; i < sorted.length - 1; i++) {
    const day = sorted[i]
    const next = sorted[i + 1]
    const d1 = new Date(day.date), d2 = new Date(next.date)
    if ((d2 - d1) / (1000 * 60 * 60 * 24) !== 1) continue

    const nextPain = next.bowelMovements?.[0]?.painLevel ?? next.dailySymptoms?.restingPain ?? null
    const nextBristol = next.bowelMovements?.[0]?.bristolType ?? null
    if (nextPain === null) continue

    const foods = [
      ...(day.fruitsEaten || []),
      ...(day.fiberFoods || []).map(f => 'fiber_' + f),
      ...(day.avoidFoods || []).map(f => 'avoid_' + f),
    ]

    for (const food of foods) {
      if (!foodMap[food]) foodMap[food] = { totalPain: 0, count: 0, totalBristol: 0, bristolCount: 0 }
      foodMap[food].totalPain += nextPain
      foodMap[food].count++
      if (nextBristol) { foodMap[food].totalBristol += nextBristol; foodMap[food].bristolCount++ }
    }
  }

  const results = {}
  for (const [food, data] of Object.entries(foodMap)) {
    if (data.count >= 2) {
      results[food] = {
        avgPain: parseFloat((data.totalPain / data.count).toFixed(1)),
        avgBristol: data.bristolCount ? parseFloat((data.totalBristol / data.bristolCount).toFixed(1)) : null,
        count: data.count,
        name: FOOD_NAMES[food] || food,
        isTrigger: food.startsWith('avoid_'),
      }
    }
  }
  return results
}

export function getDailyInsight(logs) {
  if (logs.length < 2) return null
  const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date))
  const yesterday = sorted[1]
  if (!yesterday) return null

  const outcomes = analyzeFoodOutcomes(logs)
  const yesterdayFoods = [
    ...(yesterday.avoidFoods || []).map(f => 'avoid_' + f),
    ...(yesterday.fruitsEaten || []),
  ]

  let worstTrigger = null, bestHelper = null

  for (const food of yesterdayFoods) {
    if (!outcomes[food]) continue
    const o = outcomes[food]
    if (o.isTrigger && o.avgPain >= 5) {
      if (!worstTrigger || o.avgPain > outcomes[worstTrigger].avgPain) worstTrigger = food
    }
    if (!o.isTrigger && o.avgPain <= 4) {
      if (!bestHelper || o.avgPain < outcomes[bestHelper].avgPain) bestHelper = food
    }
  }

  if (worstTrigger) {
    const o = outcomes[worstTrigger]
    const name = o.name
    return `Yesterday you had ${name} — after it, your average pain is ${o.avgPain}/10 (${o.count} times tracked). Consider skipping it today 🌿`
  }
  if (bestHelper) {
    const o = outcomes[bestHelper]
    return `${o.name} has been great for you! 🌟 On those days your pain averages ${o.avgPain}/10. Keep it up today!`
  }
  return null
}

export function getTopTrigger(logs) {
  const outcomes = analyzeFoodOutcomes(logs)
  const triggers = Object.entries(outcomes)
    .filter(([, o]) => o.isTrigger)
    .sort(([, a], [, b]) => b.avgPain - a.avgPain)
  return triggers[0] ? { name: triggers[0][1].name, avgPain: triggers[0][1].avgPain } : null
}

export function getTopHelper(logs) {
  const outcomes = analyzeFoodOutcomes(logs)
  const helpers = Object.entries(outcomes)
    .filter(([, o]) => !o.isTrigger)
    .sort(([, a], [, b]) => a.avgPain - b.avgPain)
  return helpers[0] ? { name: helpers[0][1].name, avgPain: helpers[0][1].avgPain } : null
}
