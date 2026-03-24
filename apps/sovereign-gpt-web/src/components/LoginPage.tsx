import { motion } from 'framer-motion'
import { Zap, Sun, Moon, AlertCircle, Shield, Cpu } from 'lucide-react'
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

/* ─── Feature row ───────────────────────────────────────────── */
function FeaturePill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
      <span className="text-violet-500 dark:text-violet-400">{icon}</span>
      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
    </div>
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
    <div className="flex flex-col min-h-full bg-zinc-50 dark:bg-[#0b0b0f] transition-colors duration-300">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-transparent">
        {/* Logo */}
        <div className="flex items-center gap-2.5 select-none">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-violet-500/20">
            <Zap size={13} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Sovereign GPT</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all duration-150"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* ── Center card ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[380px]"
        >

          {/* ── Hero ────────────────────────────────────────── */}
          <div className="text-center mb-8">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-6 shadow-2xl shadow-violet-500/30 ring-1 ring-violet-400/20"
            >
              <Zap size={30} className="text-white" strokeWidth={2} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45 }}
            >
              <h1 className="text-[28px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mb-2">
                Welcome to<br />Sovereign GPT
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                The Autonomous Factory Engine.<br />
                Sign in to start the loop.
              </p>
            </motion.div>
          </div>

          {/* ── Card ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45 }}
            className="bg-white dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 shadow-xl shadow-zinc-900/5 dark:shadow-black/40 overflow-hidden"
          >

            {/* Error */}
            {authError && (
              <div className="mx-5 mt-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/8 border border-red-200 dark:border-red-500/20">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-600 dark:text-red-400 leading-snug">{authError}</p>
              </div>
            )}

            <div className="p-5 space-y-3">
              {/* Google button */}
              <button
                onClick={onLogin}
                disabled={signingIn}
                className="w-full flex items-center justify-center gap-3 h-11 px-4 rounded-xl font-medium text-[14px] transition-all border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 hover:border-zinc-300 dark:hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.99]"
              >
                {signingIn
                  ? <>
                      <div className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-600 border-t-violet-500 rounded-full animate-spin" />
                      <span>Signing in…</span>
                    </>
                  : <>
                      <GoogleIcon />
                      <span>Continue with Google</span>
                    </>
                }
              </button>
            </div>

            {/* Divider + model info */}
            <div className="px-5 pb-5">
              <div className="pt-1 pb-4 border-t border-zinc-100 dark:border-zinc-800/80" />
              <div className="grid grid-cols-3 gap-2">
                <FeaturePill icon={<Zap size={12} />} label="608K params" />
                <FeaturePill icon={<Cpu size={12} />} label="Nano GPT" />
                <FeaturePill icon={<Shield size={12} />} label="Secure" />
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-center text-[11px] text-zinc-400 dark:text-zinc-600 mt-6 leading-relaxed"
          >
            Protocol V15.4 · Stable · By signing in you agree to our Terms
          </motion.p>

        </motion.div>
      </div>
    </div>
  )
}
