import { createContext, useContext, useState, useEffect } from 'react'

export const THEMES = ['lavender', 'sage', 'rose']
export const THEME_LABELS = { lavender: '💜 Lavender', sage: '🌿 Sage', rose: '🌸 Rose' }

const ThemeContext = createContext({ theme: 'lavender', setTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('carenest_theme') || 'lavender')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('carenest_theme', theme)
  }, [theme])
  // Apply on first render
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [])
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
