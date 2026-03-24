import { motion } from 'framer-motion'
import OrbBackground from './OrbBackground'

interface LoginPageProps {
  onLogin: () => void
  signingIn?: boolean
  authError?: string | null
}

export default function LoginPage({ onLogin, signingIn, authError }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      <OrbBackground />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div
          className="rounded-3xl p-8 border border-white/10"
          style={{
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(32px)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 32px 64px -16px rgba(0,0,0,0.6), 0 0 80px rgba(14,165,233,0.1)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #0ea5e9 100%)',
                boxShadow: '0 8px 32px rgba(255,107,53,0.3)',
              }}
            >
               <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
               />
              <span className="text-4xl relative z-10">🤖</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">Sovereign GPT</h1>
            <p className="text-slate-400 font-medium">The Autonomous Factory Engine</p>
          </motion.div>

          {authError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm mb-6 flex items-center gap-3"
            >
              <span className="text-xl">⚠️</span>
              <p className="font-medium leading-snug">{authError}</p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogin}
            disabled={signingIn}
            className="w-full py-4 px-6 rounded-2xl bg-white text-slate-950 font-bold text-lg flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            {signingIn ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                Processing...
              </div>
            ) : 'Access Factory Loop'}
          </motion.button>
          
          <p className="mt-8 text-center text-slate-500 text-xs font-semibold tracking-widest uppercase">
            Protocol V15.4 • Stable
          </p>
        </div>
      </motion.div>
    </div>
  )
}
