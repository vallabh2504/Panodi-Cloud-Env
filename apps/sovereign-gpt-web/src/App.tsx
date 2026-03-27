import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import LoginPage from './components/LoginPage'
import ChatPage from './components/ChatPage'
import OrbBackground from './components/OrbBackground'

export type Theme = 'dark' | 'light' | 'forest' | 'cyber'

function App() {
  const { user, loading, signingIn, authError, signInWithGoogle, signOut } = useAuth()
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('sovereign-theme') as Theme
    return (['dark', 'light', 'forest', 'cyber'].includes(saved) ? saved : 'dark') as Theme
  })

  useEffect(() => {
    const html = document.documentElement
    html.classList.remove('theme-dark', 'theme-light', 'theme-forest', 'theme-cyber', 'dark')
    html.classList.add(`theme-${theme}`)
    if (theme !== 'light') html.classList.add('dark')
    localStorage.setItem('sovereign-theme', theme)
  }, [theme])

  const cycleTheme = () => {
    const themes: Theme[] = ['dark', 'light', 'forest', 'cyber']
    setTheme(themes[(themes.indexOf(theme) + 1) % themes.length])
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center font-semibold transition-theme">
        <div className="flex items-center gap-3 opacity-60">
          <div className="w-2 h-2 rounded-full accent-bg animate-pulse" />
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative isolate transition-theme">
      <OrbBackground theme={theme} />
      {!user ? (
        <LoginPage onLogin={signInWithGoogle} signingIn={signingIn} authError={authError} theme={theme} toggleTheme={cycleTheme} />
      ) : (
        <ChatPage onSignOut={signOut} theme={theme} toggleTheme={cycleTheme} user={user} />
      )}
    </div>
  )
}
export default App
