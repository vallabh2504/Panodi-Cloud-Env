import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import LoginPage from './components/LoginPage'
import ChatPage from './components/ChatPage'
import OrbBackground from './components/OrbBackground'

export type Theme = 'dark' | 'light'

function App() {
  const { user, loading, signingIn, authError, signInWithGoogle, signOut } = useAuth()
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const htmlElement = document.documentElement
    if (theme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  if (loading) {
    return (
      <div className="h-full bg-white dark:bg-slate-950 flex items-center justify-center text-zinc-900 dark:text-white font-semibold transition-colors duration-500">
        Loading...
      </div>
    )
  }

  return (
    <div className="h-full w-full relative isolate bg-white dark:bg-transparent transition-colors duration-500">
      <OrbBackground />
      {!user ? (
        <LoginPage onLogin={signInWithGoogle} signingIn={signingIn} authError={authError} theme={theme} toggleTheme={toggleTheme} />
      ) : (
        <ChatPage onSignOut={signOut} theme={theme} toggleTheme={toggleTheme} user={user} />
      )}
    </div>
  )
}
export default App
