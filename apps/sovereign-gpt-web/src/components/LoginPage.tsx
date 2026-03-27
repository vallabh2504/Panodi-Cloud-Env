import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Sun, Moon, AlertCircle, Shield, Cpu, Sparkles, TreePine, Binary } from 'lucide-react'
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

/* ─── Theme icon map ────────────────────────────────────────── */
const themeIcons: Record<Theme, React.ReactNode> = {
  dark: <Moon size={18} />,
  light: <Sun size={18} />,
  forest: <TreePine size={18} />,
  cyber: <Binary size={18} />,
}

/* ─── Premium feature pill ──────────────────────────────────── */
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
        <span className="accent-text group-hover:scale-110 transition-transform">{icon}</span>
        <span className="text-xs font-semibold tracking-wide opacity-80">{label}</span>
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
    <div className="flex flex-col min-h-full transition-theme">
      {/* ── Top bar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-5 header-glow glass backdrop-blur-xl transition-theme">
        {/* Logo */}
        <div className="flex items-center gap-3 select-none">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-all relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-glow)))`,
            }}
          >
            <motion.div
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <Zap size={14} className="text-white relative z-10" strokeWidth={2.8} />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gradient tracking-tight">Sovereign GPT</span>
            <span className="text-[9px] font-medium opacity-50 tracking-widest uppercase">Protocol V15.4</span>
          </div>
        </div>

        {/* Theme toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-10 h-10 rounded-xl glass flex items-center justify-center transition-all duration-200 group hover:shadow-lg overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ y: 20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              {themeIcons[theme]}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Center card ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px]"
        >
          {/* ── Hero section ──────────────────────────────────── */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotateZ: -20 }}
              animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center relative"
            >
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-2xl blur-2xl opacity-40 -z-10 scale-150"
                style={{ background: `linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-glow)))` }}
              />
              <div
                className="w-[80px] h-[80px] rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-glow)))` }}
              >
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
              <h1 className="text-[32px] font-black tracking-tight leading-tight mb-3">
                Welcome to <span className="text-gradient">Sovereign GPT</span>
              </h1>
              <p className="text-[15px] leading-relaxed font-medium opacity-70">
                The Autonomous Factory Engine.<br />
                <span className="accent-text font-semibold opacity-100">Sign in to start the loop.</span>
              </p>
            </motion.div>
          </div>

          {/* ── Premium Glass Card ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-premium rounded-2xl overflow-hidden"
          >
            {/* Error state */}
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                className="mx-5 mt-5 flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm"
              >
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-400 leading-snug font-medium">{authError}</p>
              </motion.div>
            )}

            <div className="p-6 space-y-4">
              <motion.button
                onClick={onLogin}
                disabled={signingIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 h-12 px-5 rounded-xl font-semibold text-[14px] transition-all glass hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm group"
              >
                {signingIn ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full"
                    />
                    <span>Signing in\u2026</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    <span>Continue with Google</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Feature pills */}
            <div className="px-6 pb-6">
              <div className="py-4 border-t border-current/5 mb-4" />
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

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.48, duration: 0.5 }}
            className="text-center text-[11px] opacity-40 mt-8 leading-relaxed font-medium tracking-wide"
          >
            Protocol V15.4 &middot; Stable Release
            <br />
            <span className="opacity-60">By signing in you agree to our Terms of Service</span>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
