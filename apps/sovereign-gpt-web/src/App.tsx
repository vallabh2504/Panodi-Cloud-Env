import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import LoginPage from './components/LoginPage'
import ChatPage from './components/ChatPage'

export type Theme = 'dark' | 'light'

function App() {
  const { user, loading, signingIn, authError, signInWithGoogle, signOut } = useAuth()

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('sgpt-theme')
    if (saved === 'dark' || saved === 'light') return saved as Theme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('sgpt-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="w-7 h-7 rounded-full border-2 border-violet-200 dark:border-violet-900 border-t-violet-500 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <LoginPage
        onLogin={signInWithGoogle}
        signingIn={signingIn}
        authError={authError}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    )
  }

  return (
    <ChatPage
      onSignOut={signOut}
      theme={theme}
      toggleTheme={toggleTheme}
      user={user}
    />
  )
}

export default App
