import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://delusion-check-vallabhu.vercel.app/auth/callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) {
      console.error('Sign-in error:', error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-bg relative flex items-center justify-center">
      {/* Radial glow background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(57,255,20,0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 30% at 80% 100%, rgba(255,45,120,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Floating emojis background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-10">
        {['🤡', '💸', '📉', '🎭', '💀', '🔥'].map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl select-none"
            style={{
              left: `${15 + i * 14}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -18, 0],
              rotate: [0, i % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 px-4 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <div
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.4em] px-4 py-1.5 rounded-sm"
            style={{
              border: '1px solid rgba(255,45,120,0.3)',
              color: '#ff2d78',
              background: 'rgba(255,45,120,0.05)',
            }}
          >
            <span className="animate-pulse-neon">◉</span>
            Reality Check Protocol v1.0
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-none">
            <span className="glow-green" style={{ color: '#39ff14' }}>DELUSION</span>
            <br />
            <span className="glow-pink" style={{ color: '#ff2d78' }}>CHECK</span>
            <span style={{ color: 'rgba(226,232,240,0.4)' }}>.AI</span>
          </h1>

          <p className="font-mono text-sm max-w-sm" style={{ color: 'rgba(226,232,240,0.5)' }}>
            Enter your dream. Face your reality. Get roasted by Hyderabad's finest.
          </p>
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative w-full max-w-sm rounded-sm p-8 flex flex-col items-center gap-6"
          style={{
            background: 'rgba(13,13,26,0.9)',
            border: '1px solid rgba(57,255,20,0.2)',
            boxShadow: '0 0 40px rgba(57,255,20,0.08), 0 0 80px rgba(255,45,120,0.06)',
          }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l" style={{ borderColor: '#39ff14' }} />
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r" style={{ borderColor: '#39ff14' }} />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l" style={{ borderColor: '#ff2d78' }} />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r" style={{ borderColor: '#ff2d78' }} />

          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(226,232,240,0.4)' }}>
              Authentication Required
            </p>
            <p className="font-mono text-base font-bold" style={{ color: 'rgba(226,232,240,0.85)' }}>
              Sign in to unlock your reality check
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px" style={{ background: 'rgba(57,255,20,0.15)' }} />

          {/* Google Sign-In Button */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="relative w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-sm font-mono font-bold text-sm uppercase tracking-wider overflow-hidden"
            style={{
              background: loading
                ? 'rgba(57,255,20,0.05)'
                : 'linear-gradient(135deg, rgba(57,255,20,0.12) 0%, rgba(0,245,255,0.08) 100%)',
              border: '1px solid rgba(57,255,20,0.4)',
              color: loading ? 'rgba(57,255,20,0.4)' : '#39ff14',
              boxShadow: loading ? 'none' : '0 0 20px rgba(57,255,20,0.15)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {/* Shine sweep */}
            {!loading && (
              <motion.div
                className="absolute inset-0 -skew-x-12"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }}
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            <span className="relative z-10 flex items-center gap-3">
              {loading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  ⟳
                </motion.span>
              ) : (
                <svg width="18" height="18" viewBox="0 0 48 48" className="flex-shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              )}
              {loading ? 'Redirecting...' : 'Sign in with Google'}
            </span>
          </motion.button>

          <p className="font-mono text-xs text-center" style={{ color: 'rgba(226,232,240,0.25)' }}>
            ⚠️ Sign in to save your delusion scores and get brutally roasted
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-mono text-xs"
          style={{ color: 'rgba(226,232,240,0.2)' }}
        >
          DelusionCheck.ai — Built with ❤️ and brutal honesty in Hyderabad
        </motion.p>
      </div>
    </div>
  )
}
