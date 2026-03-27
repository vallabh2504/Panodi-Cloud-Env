import { motion } from 'framer-motion'
import { Zap, Sun, Moon, AlertCircle, Shield, Cpu, Sparkles } from 'lucide-react'
import type { Theme } from '../App'

/* ─── Google SVG icon ───────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

/* ─── Premium feature pill ───────────────────────────────────────────── */
function FeaturePill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="glass px-3.5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group cursor-default"
    >
      <div className="flex items-center gap-2">
        <span className="text-violet-500 dark:text-violet-400 group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">{label}</span>
      </div>
    </motion.div>
  )
}

/* ─── Props ─────────────────────────────────────────────────── */
interface LoginPageProps {
  onLogin: () => void
  signingIn?: boolean
  authError?: string | null
  theme: Theme
  toggleTheme: () => void
}

/* ─── Component ─────────────────────────────────────────────── */
export default function LoginPage({ onLogin, signingIn, authError, theme, toggleTheme }: LoginPageProps) {
  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-transparent transition-theme">

      {/* ── Top bar with enhanced glass effect ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200/50 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-md transition-theme">
        {/* Logo */}
        <div className="flex items-center gap-3 select-none">
          <motion.div 
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 dark:shadow-violet-600/40 ring-1 ring-violet-400/30 dark:ring-violet-400/50 hover:ring-violet-400/50 dark:hover:ring-violet-400/70 transition-all"
          >
            <Zap size={14} className="text-white" strokeWidth={2.8} />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">Sovereign GPT</span>
            <span className="text-[9px] font-medium text-zinc-500 dark:text-zinc-500 tracking-widest uppercase">Protocol V15.4</span>
          </div>
        </div>

        {/* Theme toggle with premium styling */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-10 h-10 rounded-xl glass flex items-center justify-center text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-200 hover:text-zinc-700 transition-all duration-200 group hover:shadow-lg"
        >
          {theme === 'dark' ? 
            <Sun size={18} className="group-hover:rotate-12 transition-transform" /> : 
            <Moon size={18} className="group-hover:-rotate-12 transition-transform" />
          }
        </motion.button>
      </div>

      {/* ── Center card ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >

          {/* ── Hero section ────────────────────────────────────────── */}
          <div className="text-center mb-10">
            {/* Icon with premium glow */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotateZ: -20 }}
              animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center relative"
            >
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl blur-2xl opacity-40 dark:opacity-50 -z-10 scale-150" />
              
              <div className="w-[80px] h-[80px] rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 dark:from-violet-600 dark:via-purple-600 dark:to-indigo-700 flex items-center justify-center shadow-2xl shadow-violet-500/40 dark:shadow-violet-600/50 ring-1 ring-violet-400/40 dark:ring-violet-400/60 relative overflow-hidden">
                {/* Shine effect */}
                <motion.div 
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <Zap size={32} className="text-white relative z-10" strokeWidth={2.2} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8"
            >
              <h1 className="text-[32px] font-black bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-50 dark:to-zinc-200 bg-clip-text text-transparent tracking-tight leading-tight mb-3">
                Welcome to Sovereign GPT
              </h1>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                The Autonomous Factory Engine.<br />
                <span className="text-violet-600 dark:text-violet-400 font-semibold">Sign in to start the loop.</span>
              </p>
            </motion.div>
          </div>

          {/* ── Premium Glass Card ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-premium rounded-2xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/40"
          >

            {/* Error state */}
            {authError && (
              <motion.div 
                initial={{ opacity: 0, y: -12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -12, height: 0 }}
                className="mx-5 mt-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 backdrop-blur-sm"
              >
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-600 dark:text-red-400 leading-snug font-medium">{authError}</p>
              </motion.div>
            )}

            <div className="p-6 space-y-4">
              {/* Google Sign-in button - Premium styling */}
              <motion.button
                onClick={onLogin}
                disabled={signingIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 h-12 px-5 rounded-xl font-semibold text-[14px] transition-all border border-zinc-300 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700/90 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-black/40 disabled:opacity-50 disabled:cursor-not-allowed shadow-md dark:shadow-black/30 active:scale-[0.98] backdrop-blur-sm group"
              >
                {signingIn
                  ? <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-600 border-t-violet-500 rounded-full" 
                      />
                      <span>Signing in…</span>
                    </>
                  : <>
                      <GoogleIcon />
                      <span>Continue with Google</span>
                    </>
                }
              </motion.button>
            </div>

            {/* Divider + feature pills */}
            <div className="px-6 pb-6">
              <div className="py-4 border-t border-zinc-200/30 dark:border-white/10 mb-4" />
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42, duration: 0.5 }}
                className="grid grid-cols-3 gap-2"
              >
                <FeaturePill icon={<Sparkles size={12} />} label="608K Params" />
                <FeaturePill icon={<Cpu size={12} />} label="Nano Engine" />
                <FeaturePill icon={<Shield size={12} />} label="Secure" />
              </motion.div>
            </div>
          </motion.div>

          {/* Footer text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.48, duration: 0.5 }}
            className="text-center text-[11px] text-zinc-500 dark:text-zinc-600 mt-8 leading-relaxed font-medium tracking-wide"
          >
            Protocol V15.4 · Stable Release
            <br />
            <span className="text-zinc-400 dark:text-zinc-700">By signing in you agree to our Terms of Service</span>
          </motion.p>

        </motion.div>
      </div>
    </div>
  )
}
