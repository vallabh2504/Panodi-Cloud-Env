/**
 * V2 Theme System — Healing Garden
 * 3 beautiful themes: Cherry Blossom (default), Ocean Breeze, Northern Lights
 */

export const themes = {
  cherry: {
    id: 'cherry',
    name: 'Cherry Blossom',
    emoji: '🌸',
    description: 'Soft pink petals drifting over a serene river',
    // Colors
    primary: '#E8705A',
    primaryLight: '#F5A68A',
    secondary: '#F9C5D1',
    accent: '#C9A8F5',
    background: '#FFF5F7',
    backgroundGradient: 'linear-gradient(160deg, #FFE8ED 0%, #FFF5F7 40%, #FFF0F3 100%)',
    headerGradient: 'linear-gradient(135deg, #FFD6E0 0%, #FFF0F3 60%, #FFE8ED 100%)',
    card: '#FFFFFF',
    cardBorder: '#FFD6E0',
    cardShadow: 'rgba(232,112,90,0.1)',
    text: '#3D2B2B',
    textMuted: '#8C7070',
    navBg: '#FFFFFF',
    navBorder: '#FFE0E6',
    navActive: '#E8705A',
    navInactive: '#C4A0A0',
    wellnessHigh: '#A8D5A2',
    wellnessLow: '#F5C67A',
    ctaGradient: 'linear-gradient(135deg, #E8705A, #F5A68A)',
    ctaShadow: 'rgba(232,112,90,0.35)',
    tipBg: 'linear-gradient(135deg, #FFE8ED, #FFF5F7)',
    tipBorder: '#FFD6E0',
    // Particles
    particleColors: ['#FFB7C5', '#FF92A5', '#FFDCE5', '#FFE4E9', '#F8A4B8'],
    particleChar: ['🌸', '🌸', '🌸', '💮', '✿'],
    riverColor: 'rgba(168,213,162,0.25)',
    riverHighlight: 'rgba(255,183,197,0.3)',
  },

  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    emoji: '🌊',
    description: 'Calm waves under a crystal blue sky',
    primary: '#3B82C4',
    primaryLight: '#7BB8E8',
    secondary: '#B4D8F0',
    accent: '#67C7B8',
    background: '#F0F7FF',
    backgroundGradient: 'linear-gradient(160deg, #D4E8FF 0%, #F0F7FF 40%, #E8F4FE 100%)',
    headerGradient: 'linear-gradient(135deg, #C8E0FF 0%, #E8F4FE 60%, #D4E8FF 100%)',
    card: '#FFFFFF',
    cardBorder: '#C8E0FF',
    cardShadow: 'rgba(59,130,196,0.1)',
    text: '#1B3A5C',
    textMuted: '#6A8BAA',
    navBg: '#FFFFFF',
    navBorder: '#D4E8FF',
    navActive: '#3B82C4',
    navInactive: '#A0BFD8',
    wellnessHigh: '#67C7B8',
    wellnessLow: '#F5C67A',
    ctaGradient: 'linear-gradient(135deg, #3B82C4, #7BB8E8)',
    ctaShadow: 'rgba(59,130,196,0.35)',
    tipBg: 'linear-gradient(135deg, #D4E8FF, #F0F7FF)',
    tipBorder: '#C8E0FF',
    particleColors: ['#87CEEB', '#B4D8F0', '#6EC6E6', '#A0D2F0', '#70C4E8'],
    particleChar: ['~', '~', '~', '~', '~'],
    riverColor: 'rgba(59,130,196,0.15)',
    riverHighlight: 'rgba(135,206,235,0.3)',
  },

  aurora: {
    id: 'aurora',
    name: 'Northern Lights',
    emoji: '🌌',
    description: 'Ethereal aurora glowing across a twilight sky',
    primary: '#8B5CF6',
    primaryLight: '#B794F6',
    secondary: '#C4B5FD',
    accent: '#34D399',
    background: '#F5F0FF',
    backgroundGradient: 'linear-gradient(160deg, #E8DEFF 0%, #F5F0FF 40%, #EDE4FF 100%)',
    headerGradient: 'linear-gradient(135deg, #DDD0FF 0%, #EDE4FF 50%, #E0F5EC 100%)',
    card: '#FFFFFF',
    cardBorder: '#DDD0FF',
    cardShadow: 'rgba(139,92,246,0.1)',
    text: '#2D1B69',
    textMuted: '#7C6BA0',
    navBg: '#FFFFFF',
    navBorder: '#E8DEFF',
    navActive: '#8B5CF6',
    navInactive: '#B0A0CC',
    wellnessHigh: '#34D399',
    wellnessLow: '#FBBF24',
    ctaGradient: 'linear-gradient(135deg, #8B5CF6, #B794F6)',
    ctaShadow: 'rgba(139,92,246,0.35)',
    tipBg: 'linear-gradient(135deg, #E8DEFF, #F5F0FF)',
    tipBorder: '#DDD0FF',
    particleColors: ['#C4B5FD', '#A78BFA', '#34D399', '#6EE7B7', '#93C5FD'],
    particleChar: ['✦', '✧', '⋆', '★', '✦'],
    riverColor: 'rgba(139,92,246,0.12)',
    riverHighlight: 'rgba(52,211,153,0.2)',
  },
}

export const themeList = Object.values(themes)

export function getThemeId() {
  return localStorage.getItem('fissurecare_theme') || 'cherry'
}

export function saveThemeId(id) {
  localStorage.setItem('fissurecare_theme', id)
}

export function getTheme() {
  return themes[getThemeId()] || themes.cherry
}
