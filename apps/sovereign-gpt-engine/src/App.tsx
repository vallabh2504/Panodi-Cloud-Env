import { useAuth } from './hooks/useAuth'
import LoginPage from './components/LoginPage'
import ChatPage from './components/ChatPage'

function App() {
  const { user, loading, signingIn, authError, signInWithGoogle, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <LoginPage
        onLogin={signInWithGoogle}
        signingIn={signingIn}
        authError={authError}
      />
    )
  }

  return <ChatPage onSignOut={signOut} />
}

export default App
