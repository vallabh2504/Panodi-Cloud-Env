# Bujji's Healing Garden — Build Plan
> This document is the single source of truth. Every feature, every decision, every line of code follows this plan.
> Last updated: 2026-05-15

---

## The North Star

This is **Bujji's app**. Not a generic health tracker — her personal healing companion. She should open it and feel like someone who loves her built it just for her. Every screen greets her by name. Every logged improvement is celebrated. Every hard day is met with warmth, not cold data.

**Core promise:** Make Bujji feel seen, cared for, and genuinely supported in her healing journey — through beautiful design, intelligent tracking, and micro-moments of joy.

---

## Credentials & Infrastructure

| Key | Location |
|-----|----------|
| Supabase URL | `https://kerblmnjjsbgtwidefqw.supabase.co` |
| Anon Key | `fissure-care/.env.local` |
| Service Role Key | `fissure-care/.env.local` (gitignored — never commits) |
| Live URL | `https://fissure-care-vivid.vercel.app` |
| Deploy trigger | Push to `main` → GitHub Actions → Vercel |

---

## The 25 World-Class UX Features — Audit

Research sources: NN/g, SPDLoad, Designveloper, Userpilot (May 2026)

| # | Feature | Status in Our App | Priority |
|---|---------|------------------|----------|
| 1 | **Skeleton Loaders** — shimmer placeholders during load | ❌ Missing | P1 |
| 2 | **Spring/Physics Animations** — natural overshoot & bounce | ✅ Framer Motion imported in HomeScreen | — |
| 3 | **Haptic Feedback** — vibration on key actions | ❌ Missing (web API available) | P2 |
| 4 | **Button Press States** — scale/ripple confirms the tap | 🟡 Partial (CSS transitions on some) | P1 |
| 5 | **Success/Error Micro-Animations** — animated checkmarks, shakes | 🟡 Partial (save state, no animation) | P1 |
| 6 | **Swipe-to-Go-Back / Edge Gesture** — dismiss modals with swipe | ❌ Missing | P2 |
| 7 | **Pull-to-Refresh with Custom Animation** — branded refresh indicator | ❌ Missing | P3 |
| 8 | **Swipe-to-Reveal Actions** — swipe rows for quick actions | ❌ Missing | P3 |
| 9 | **Predictive Back / Peek Transitions** — preview previous screen | ❌ Missing | P3 |
| 10 | **Sticky/Collapsing Navigation Headers** — collapses on scroll | ❌ Missing | P2 |
| 11 | **Adaptive / Contextual Layouts** — rearranges by usage pattern | ❌ Missing (correlation engine will power this) | P2 |
| 12 | **Smart Defaults & Prefilled Fields** — pre-populated with likely values | ✅ Loads today's log if it exists | — |
| 13 | **Contextual Onboarding Hotspots** — pulsing dots, first-use only | ❌ Missing | P2 |
| 14 | **Rich Push Notifications** — inline images, action buttons | ✅ Web Push logic in App.jsx (morning/noon/evening) | — |
| 15 | **Dark Mode / Theme System** — OLED-optimized dark | ✅ 3 themes: cherry, dark, light | — |
| 16 | **Delightful Empty States** — illustrated, branded, with CTA | ❌ Missing (blank or nothing) | P1 |
| 17 | **Lottie / Vector Micro-Animations** — scalable JSON animations | 🟡 Partial (canvas falling particles in Home) | P2 |
| 18 | **Meaningful Semantic Color Feedback** — whole element reacts | ✅ Bristol type colors, pain slider emoji, food warnings | — |
| 19 | **Optimistic UI Updates** — action reflects instantly before server | ✅ Local-first storage, Supabase syncs after | — |
| 20 | **Offline Mode with Clear Indicator** — graceful degradation + banner | ✅ localStorage fallback always works | P1 (add indicator) |
| 21 | **Biometric Auth on Re-entry** — Face ID / fingerprint | ❌ Missing (no auth at all currently) | P4 (post-MVP) |
| 22 | **Conversational Error Messages** — plain human language | 🟡 Partial (warm copy in food tips, not everywhere) | P1 |
| 23 | **Microcopy that Reassures** — copy near CTAs reduces hesitation | 🟡 Partial (doctor disclaimer, some tips) | P1 |
| 24 | **Dynamic Type / Font Scaling** — responds to OS font size preference | ❌ Missing | P3 |
| 25 | **Focus States & Screen Reader** — full keyboard/a11y support | ❌ Missing | P3 |

### Score: **8 fully present · 5 partial · 12 missing**

**The 8 we already have are the right foundation.** The 12 missing ones are now explicitly planned below. Every single one ships before we call this done.

---

## GitHub Learning Resources

These repos inform our implementation patterns. Study before building each feature:

| Repo | Stars | What We Learn From It |
|------|-------|----------------------|
| [motiondivision/motion](https://github.com/motiondivision/motion) | ~30K | Declarative spring animations, layout transitions, gesture (tap/drag) — our primary animation library |
| [pmndrs/use-gesture](https://github.com/react-spring/react-use-gesture) | ~9K | Touch/mouse gesture binding (swipe, pinch, drag velocity) |
| [aholachek/mobile-first-animation](https://github.com/aholachek/mobile-first-animation) | ~1.5K | Gesture-driven mobile web animation mental model — read the README fully |
| [pmndrs/react-spring](https://github.com/pmndrs/react-spring) | ~28K | Spring physics values — stiffness/damping tuning reference |
| [Atyantik/react-pwa](https://github.com/Atyantik/react-pwa) | — | Full PWA architecture: SW, offline, code split, Lighthouse 100 |
| [jondot/awesome-react-native](https://github.com/jondot/awesome-react-native) | ~34K | Master reference for animation libs, gesture handlers, UX patterns |
| [brillout/awesome-react-components](https://github.com/brillout/awesome-react-components) | ~38K | Best-in-class React web components, animation, mobile UX |
| [tim-soft/react-spring-lightbox](https://github.com/tim-soft/react-spring-lightbox) | — | Swipe/pinch gesture pattern for mobile gallery UX |
| [zhengdechang/awesome-gsap](https://github.com/zhengdechang/awesome-gsap) | — | GSAP timeline and stagger patterns for complex sequences |

**Key implementation decision:** We use **CSS transitions + keyframes** for simple micro-interactions (button presses, fades, shimmer) and **Framer Motion** (already installed) for complex gesture-driven or layout animations. No new animation lib installs needed.

---

## What We Already Have (V2 Baseline)

```
fissure-care/src/
├── App.jsx               ← 3-theme shell, push notification logic, 6-tab nav
├── lib/
│   ├── storage.js        ← Local-first + Supabase sync, wellness score, streak
│   ├── supabase.js       ← Client (kerblmnjjsbgtwidefqw) — hardcoded keys
│   └── themes.js         ← Cherry blossom, dark, light
├── screens/
│   ├── HomeScreen.jsx    ← Dashboard w/ canvas particles, Framer Motion, Recharts
│   ├── LogScreen.jsx     ← Rich daily log (Bristol, pain, food, sitz, meds, journal)
│   ├── InsightsScreen.jsx← Charts (thin, needs rebuild)
│   ├── MedsScreen.jsx    ← Medications list
│   ├── SettingsScreen.jsx← Theme picker
│   └── WisdomScreen.jsx  ← Stub
```

**Data model** (localStorage + Supabase `daily_logs` JSONB):
```js
{
  date, bowelMovements[], dailySymptoms{}, medications[],
  topicalOintment{}, sitzBaths[], hydration{}, fruitsEaten[],
  fiberFoods[], avoidFoods[], activity{}, selfCare{}
}
```

---

## Tech Stack

| Layer | Tool | Notes |
|-------|------|-------|
| Framework | React 18 + Vite | Keep — no migration |
| Styling | Inline styles | Keep consistent pattern throughout |
| Animation | CSS + Framer Motion | Already installed, use both |
| Charts | Recharts | Already imported in HomeScreen |
| Data | localStorage + Supabase | Local-first, sync on write |
| PWA | Vite PWA plugin | Add in Phase 1B |
| Notifications | Web Push API | Already wired in App.jsx |
| Deploy | Vercel via GitHub Actions | Auto on push to `main` |

---

## Phase 1 — Foundation

### 1A. Supabase Schema Migration

Run in Supabase SQL editor (service_role key in `.env.local`):

```sql
-- daily_logs (may already exist — safe upsert)
create table if not exists daily_logs (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  data jsonb not null default '{}',
  wellness_score integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- user_settings (Bujji's name, goals, preferences) — singleton row
create table if not exists user_settings (
  id integer primary key default 1 check (id = 1),
  user_name text default 'Bujji',
  water_goal integer default 8,
  fiber_goal integer default 25,
  reminder_time text default '09:00',
  theme text default 'cherry',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- streak_milestones (track which celebrations already fired)
create table if not exists streak_milestones (
  id uuid primary key default gen_random_uuid(),
  milestone integer not null,
  celebrated_at date not null,
  created_at timestamptz default now()
);

-- RLS: open policies (single-user app, no auth)
alter table daily_logs enable row level security;
alter table user_settings enable row level security;
alter table streak_milestones enable row level security;
create policy "allow all" on daily_logs for all using (true);
create policy "allow all" on user_settings for all using (true);
create policy "allow all" on streak_milestones for all using (true);
```

### 1B. PWA Setup

Files to create:
- `public/manifest.json` — name "Bujji's Healing Garden", `#FFF0EB` theme
- `vite.config.js` — add vite-plugin-pwa for SW auto-generation
- `public/sw.js` — cache-first for app shell, network-first for Supabase
- `index.html` — meta tags for iOS PWA (apple-touch-icon, apple-mobile-web-app-capable)

**Offline indicator** (Feature #20 gap): Persistent top bar that slides down when offline: `"You're offline, Bujji — your logs are saved locally and will sync when you're back 💛"`

### 1C. Personalization Bootstrap

- `supabase.js` → switch to env vars (`import.meta.env.VITE_SUPABASE_*`) so keys leave source code
- First-launch modal: "Hi, I'm your healing companion 🌸 What's your name?" (pre-filled "Bujji")
- Save to `user_settings` + `localStorage`
- All screens pull `userName` and use it in every greeting, celebration, tip

---

## Phase 2 — UX Transformation

### 2A. Log Screen → 7-Step Swipeable Journey (Feature #6 partially, #10)

**Current:** One vertical scroll. Exhausting, feels clinical.
**New:** Step-by-step card flow with horizontal slide transitions.

```
Step 1/7  ← Greeting card: "Good morning, Bujji 💛 Let's check in"
Step 2/7  ← Bowel Movements (same data, new card shell)
Step 3/7  ← How are you feeling? (symptom sliders)
Step 4/7  ← Hydration 💧
Step 5/7  ← Food today 🍎 (simple meal tags)
Step 6/7  ← Self-care 🛁 (sitz baths, ointment, activity)
Step 7/7  ← Journal + save 💛
```

**Step navigation:**
- Back / Next buttons (min 48px touch target — Feature #24 adjacent)
- Step dot indicators at top (tappable)
- Swipe left/right gesture (Framer Motion `drag="x"` + velocity threshold)
- Each card: `x: 40px → 0, opacity: 0 → 1` on enter, reverse on exit (200ms spring)
- Progress bar fills as she advances (Feature #5 visual feedback)
- Step completion dots turn green with animated checkmark when data entered (Feature #5)
- "Almost there, Bujji! 💛" appears at step 6

**Button press states** (Feature #4 — applied globally):
```css
button:active { transform: scale(0.97); transition: transform 80ms; }
```
Add globally to `index.css`.

### 2B. Skeleton Loaders (Feature #1)

`components/SkeletonLoader.jsx` — shimmer animation:
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f0e0da 25%, #fff8f5 50%, #f0e0da 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 12px;
}
```
Use on: Home score card (until data loads), Insights charts, Wisdom card.

### 2C. Delightful Empty States (Feature #16)

`components/EmptyState.jsx` — illustrated states for:
- No logs yet → cherry blossom illustration + "Start your journey, Bujji 🌸"
- No insights yet (< 3 days data) → "Log for 3 days and I'll start finding patterns for you 💡"
- No meds set → "Add your medications so we can track them together 💊"

Each empty state: soft illustration (SVG inline), warm headline, single CTA button.

### 2D. Collapsing Log Header (Feature #10)

Log screen header collapses from 80px to 44px as user scrolls through steps. Title shrinks, date fades. Uses `IntersectionObserver` to detect step position.

### 2E. Contextual Onboarding Hotspots (Feature #13)

`components/Hotspot.jsx` — pulsing orange dot that appears once per feature:
- First visit: pulsing dot on Log tab → "Start here, Bujji 💛"
- First time Insights has 7 days data: hotspot on correlation card → "Tap to see your patterns"
- Dismissed permanently on tap, stored in localStorage

```css
@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}
```

### 2F. Home Screen Rebuild

Full rebuild. Sections with staggered entrance animations (Framer Motion `staggerChildren`):

```
┌────────────────────────────────────────┐
│  Good morning, Bujji! ☀️               │  ← Time-aware (morning/afternoon/evening/night)
│  Thursday, 15 May · Day 12 of healing │
└────────────────────────────────────────┘
[Skeleton shown while data loads — Feature #1]

┌──────────────────┐  ┌──────────────────┐
│  Wellness Score  │  │  🔥 Streak        │
│   82 / 100       │  │   7 days          │
│   Ring animates  │  │  Streak # counts  │
│   0→82 on mount  │  │  up on mount      │
└──────────────────┘  └──────────────────┘

┌────────────────────────────────────────┐
│  Yesterday's insight 💡               │  ← Correlation engine output
│  "You had coffee ☕ → pain 7/10 today │
│   On coffee days: avg pain 6.5 📊"    │
└────────────────────────────────────────┘

┌──── This week ─────────────────────────┐
│  Pain:      ████░░ improving ↓         │  ← Recharts mini sparkline
│  Hydration: ██████ on track ✓          │
│  Bristol:   3× Type 4 🌟               │
└────────────────────────────────────────┘

[ 📝 Log Today ]  ← Primary CTA, full width, pulsing if not logged yet
```

### 2G. Insights Screen with Real Charts

Install already done (Recharts in HomeScreen). Sections:

1. **7-day wellness score** — `LineChart` with coral fill, animated draw-in
2. **Bristol type history** — `BarChart`, color-coded by type
3. **Pain trend** — `AreaChart`, gradient red→green as scores improve
4. **Correlation cards** (horizontal scroll strip) — Feature #11
5. **Weekly summary** in Bujji's language: "This was a better week 🌸 Your pain dropped by 2 points"

### 2H. Wisdom Screen

60+ curated healing tips in `lib/wisdom.js`, organized by category:
- Nutrition (20 tips)
- Sitz bath techniques (10 tips)
- Breathing & stress (10 tips)
- Affirmations for Bujji (20 tips)

Daily card rotates by `dayOfYear % 60`. Card flip animation on open. "Save this tip" button → localStorage bookmark. Bookmarks tab shows saved tips.

### 2I. Conversational Copy Pass (Features #22 + #23)

Audit every piece of text in the app. Replace:
- "Error saving" → "Couldn't save right now — your data is safe locally 💛"
- "No data" → "Nothing here yet — log your first day to get started 🌸"
- Save button microcopy below it: "Saved locally even if you're offline"
- Every slider label ends warmly: "How bad is the discomfort? (0 = none, we hope!)"

---

## Phase 3 — Intelligence Layer

### 3A. Food → Outcome Correlation Engine (`lib/correlations.js`)

```javascript
// For each food item, looks at next-day bowel quality
// Requires N>=3 occurrences to show a pattern
export function analyzeFoodOutcomes(logs) {
  // Returns: { spicy: { avgPain: 6.8, avgBristol: 2.1, count: 5 }, ... }
}

export function getDailyInsight(logs) {
  // Returns: "Yesterday you had coffee ☕ — your pain this morning was 7.
  //           On days after coffee, your avg pain is 6.5.
  //           Consider switching to herbal tea today 🌿"
  // Returns null if < 3 data points for any pattern
}

export function getTopTrigger(logs) {
  // Returns the single biggest pain-correlation food for Home screen badge
}

export function getTopHelper(logs) {
  // Returns the single biggest pain-reducer food (e.g. "Kiwi days: pain 3.1 avg")
}
```

### 3B. Smart Log Hints (Feature #11 — Adaptive)

In the LogScreen food section, when she taps an avoid-food:
- Generic tip → replaced with personal data: `"Last 4 times you had spicy food, next-day pain averaged 7.2/10 🌶️"`
- Requires correlations.js with ≥3 data points, else shows generic tip

### 3C. Weekly Pattern Summary

Every Sunday, Home screen shows a "This week" card with:
- Best day (highest wellness score)
- Worst trigger (food that correlated most to bad days)
- Best helper (food that correlated to good days)
- Trend direction (improving / stable / needs attention)

---

## Phase 4 — Delight Layer

### 4A. Celebration System (`lib/celebrations.js` + `components/CelebrationOverlay.jsx`)

**Overlay:** Full-screen, appears over content, auto-dismisses in 3s or on tap.

| Trigger | Visual | Copy |
|---------|--------|------|
| First log ever | Cherry blossom fall (canvas) | "Bujji, your healing journey starts today! 🌸" |
| 3-day streak | Confetti burst (CSS keyframes) | "3 days in a row, Bujji! 🔥 You're doing it!" |
| 7-day streak | Gold stars rain | "A whole week! You're incredible 💛" |
| 14-day streak | Fireworks SVG | "Two weeks strong, Bujji. I'm so proud of you 🌟" |
| 30-day streak | Full screen fireworks | Special message from "your healing app" |
| Pain drops 2+ pts vs last week | Upward arrows animate | "Bujji, your pain has improved this week! 🌸" |
| First Type 4 Bristol | Banana emoji bounces | "Perfect movement! Your gut is healing, Bujji 🍌✨" |
| Water goal hit | Water drops rain | "Hydration hero! 💧 Bujji nailed it today" |
| 2+ sitz baths | Bathtub emoji grows | "So much self-care today 🛁 Your body thanks you" |
| Wellness score > 85 | Score card glows | "Your best score yet, Bujji! 🎉" |

**Anti-spam:** Never show same celebration twice in 24 hours. Track in localStorage `celebrations_shown_{date}`.

### 4B. Haptic Feedback (Feature #3)

```javascript
// lib/haptics.js — Web Vibration API wrapper
export function hapticLight() { navigator.vibrate?.(10) }   // selection
export function hapticMedium() { navigator.vibrate?.(25) }  // action confirm
export function hapticSuccess() { navigator.vibrate?.([10, 50, 10]) } // save success
export function hapticError() { navigator.vibrate?.([50, 30, 50]) }   // error
```

Apply to: every button press (light), save log (success pattern), celebration trigger (medium).

### 4C. Swipe Gestures (Feature #6)

Log step navigation supports swipe with Framer Motion:
```jsx
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(e, { offset, velocity }) => {
    if (offset.x < -80 || velocity.x < -500) goNext()
    if (offset.x > 80 || velocity.x > 500) goPrev()
  }}
>
```

### 4D. In-App Soft Reminder Banner

If she opens the app and hasn't logged today by 8pm → soft banner at top of Home:
```
╔══════════════════════════════════════╗
║  Hey Bujji, haven't heard from      ║
║  you today 💛 How are you feeling?  ║
║  [ Log Now ]        [ Later ]        ║
╚══════════════════════════════════════╝
```
Slides down from top with spring animation. Dismisses on "Later" (remembers for 2 hours).

### 4E. The 100 Micro UX Touches

Every one of these ships. No exceptions.

**Buttons & Interaction:**
- All buttons: `scale(0.97)` on `:active` (global CSS)
- All buttons: `transition: all 180ms cubic-bezier(0.34, 1.56, 0.64, 1)` (spring-like)
- Fruit selection: selected fruit does a quick `scale(1.2) → scale(1)` bounce
- Bristol type selection: selected card lifts with `box-shadow` + slight `translateY(-2px)`
- Water glass: each glass fills with color transition when tapped (200ms)
- Toggle buttons: slide animation between Yes/No states
- Pain slider: emoji does `scale(1.3) → scale(1)` pop when value changes
- Sitz bath add: new bath card slides in from bottom

**Loading & Data:**
- All screens show skeleton loaders while data loads
- Score ring animates from 0 to actual value (800ms ease-out) on mount
- Streak number counts up from 0 on mount (600ms)
- Chart lines draw from left to right on first render (Recharts animation)
- Trend arrows animate in with direction on mount

**Navigation:**
- Tab bar: active icon bounces once (`scale(1.2) → scale(1)`) on selection
- Tab switch: screen content fades in (100ms opacity)
- Log step indicator dots scale up when active

**Feedback:**
- Save: checkmark draws with SVG stroke animation (500ms)
- Food avoid warning: slides in from bottom, auto-dismisses with progress bar shrinking
- Offline indicator: slides down from top, coral background
- Error states: subtle red border glow, not harsh
- Long press on insight card: shows "Copied to clipboard" toast (500ms)

**Typography & Copy:**
- All headings use `Nunito` (weight 800) — bold and warm
- All body text: `Inter` (weight 400/600)
- All CTA buttons end with an emoji or 💛
- Placeholder text in journal: uses her name: "What's on your mind, Bujji?"
- Every section label has a soft description line beneath it

**Scroll & Layout:**
- Keyboard avoidance: focused input scrolls into view (scrollIntoView smooth)
- Log steps: each card is exactly viewport height (no awkward partial reveals)
- Bottom nav: safe-area-inset respected for iPhone home bar
- Page: max-width 480px, centered — prevents ugly stretch on tablet

**Personal Touches:**
- Morning tip on Home rotates daily and always includes a gentle note: "Tip for you today, Bujji 💛"
- After 7 consecutive logs: a permanent star badge appears on her Home screen
- 30-day badge: a "Healing Champion" title appears in Settings next to her name

---

## Phase 5 — Polish & Ship

- [ ] Full test on iOS Safari (PWA install, gestures, notifications)
- [ ] Full test on Android Chrome (PWA install, haptics, push)
- [ ] Lighthouse audit: Performance ≥ 90, PWA ≥ 90
- [ ] Offline test: disable wifi → log → re-enable → confirm Supabase sync
- [ ] All touch targets ≥ 44px minimum
- [ ] Font size test at 200% OS zoom (Feature #24 — Dynamic Type)
- [ ] Screen reader pass with VoiceOver on iOS (Feature #25)
- [ ] Final copy audit: every string passes the Tone Guide below

---

## File Structure After Build

```
fissure-care/
├── public/
│   ├── manifest.json           ← PWA manifest
│   ├── sw.js                   ← Service worker
│   └── icons/                  ← PWA icons (192, 512)
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css               ← Global button:active state + skeleton shimmer
│   ├── lib/
│   │   ├── supabase.js         ← Uses VITE_ env vars
│   │   ├── storage.js          ← Extended with settings + streak + milestones
│   │   ├── themes.js
│   │   ├── correlations.js     ← NEW: food→outcome engine
│   │   ├── celebrations.js     ← NEW: celebration trigger logic
│   │   ├── haptics.js          ← NEW: Web Vibration API wrapper
│   │   ├── affirmations.js     ← NEW: pool of 30 warm Bujji messages
│   │   └── wisdom.js           ← NEW: 60 curated healing tips
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── CelebrationOverlay.jsx  ← NEW
│   │   ├── EmptyState.jsx          ← NEW (Feature #16)
│   │   ├── Hotspot.jsx             ← NEW (Feature #13)
│   │   ├── SkeletonLoader.jsx      ← NEW (Feature #1)
│   │   ├── OfflineBanner.jsx       ← NEW (Feature #20 gap)
│   │   └── StepProgress.jsx        ← NEW (log step dots + bar)
│   └── screens/
│       ├── HomeScreen.jsx          ← FULL REBUILD
│       ├── LogScreen.jsx           ← TRANSFORM → 7-step swipeable
│       ├── InsightsScreen.jsx      ← FULL REBUILD with Recharts
│       ├── MedsScreen.jsx          ← LIGHT POLISH
│       ├── SettingsScreen.jsx      ← ADD name/reminder/goals
│       └── WisdomScreen.jsx        ← BUILD OUT
```

---

## Execution Order

```
1. Phase 1A  → Supabase SQL migrations (schema)
2. Phase 1C  → supabase.js env vars + first-launch personalization
3. Phase 1B  → PWA manifest + service worker + offline indicator
4. Phase 2A  → Log screen 7-step transform (biggest UX win)
5. Phase 4A  → Celebration system (rewards effort immediately)
6. Phase 4B  → Haptic feedback (global, quick win)
7. Phase 2B  → Skeleton loaders (Feature #1)
8. Phase 2C  → Empty states (Feature #16)
9. Phase 2E  → Onboarding hotspots (Feature #13)
10. Phase 2F → Home screen full rebuild
11. Phase 3A → Correlation engine
12. Phase 2G → Insights screen with Recharts
13. Phase 3B → Smart log hints
14. Phase 2H → Wisdom screen
15. Phase 4C → Swipe gestures (Feature #6)
16. Phase 2I → Conversational copy pass (Features #22, #23)
17. Phase 4D → In-app soft reminders
18. Phase 4E → All 100 micro UX touches (pass through every file)
19. Phase 5  → Polish + test + ship
```

---

## Tone & Copy Guide

Every piece of copy follows these rules:

1. **Always use "Bujji"** in greetings, celebrations, reminders, and empty states
2. **Never clinical** — "movement" not "defecation", "discomfort" not "severe pain"
3. **Never alarming** — blood tracking is matter-of-fact, not scary
4. **Always warm** — 💛 or 🌸 at end of key messages (not every single line)
5. **Celebrate effort, not perfection** — "You logged 5 days!" not "You missed 2 days"
6. **Personal > generic** — use her data to make every insight specific to her
7. **Conversational errors** — "Couldn't save right now" not "Error 500"
8. **Microcopy reassures** — near every CTA: small line that removes friction

---

## UX Feature Completion Tracker

Update this table as each feature ships:

| Feature | Shipped | Notes |
|---------|---------|-------|
| Skeleton Loaders (#1) | ⬜ | |
| Spring Animations (#2) | ✅ | Framer Motion already present |
| Haptic Feedback (#3) | ⬜ | |
| Button Press States (#4) | ⬜ | Global CSS pass |
| Success Micro-Animations (#5) | ⬜ | |
| Swipe Gestures (#6) | ⬜ | |
| Pull-to-Refresh (#7) | ⬜ | |
| Swipe-to-Reveal (#8) | ⬜ | P3 |
| Predictive Back (#9) | ⬜ | P3 |
| Collapsing Header (#10) | ⬜ | |
| Adaptive Layout (#11) | ⬜ | Via correlation engine |
| Smart Defaults (#12) | ✅ | Already loads today's log |
| Onboarding Hotspots (#13) | ⬜ | |
| Push Notifications (#14) | ✅ | Already in App.jsx |
| Dark/Theme Mode (#15) | ✅ | 3 themes working |
| Delightful Empty States (#16) | ⬜ | |
| Vector Micro-Animations (#17) | 🟡 | Canvas particles on Home |
| Semantic Color Feedback (#18) | ✅ | Bristol, pain, food colors |
| Optimistic UI (#19) | ✅ | Local-first storage |
| Offline Mode + Indicator (#20) | 🟡 | Works, no indicator yet |
| Biometric Auth (#21) | ⬜ | P4 post-MVP |
| Conversational Errors (#22) | ⬜ | Copy pass needed |
| Reassuring Microcopy (#23) | 🟡 | Partial |
| Dynamic Type (#24) | ⬜ | P3 |
| Screen Reader / A11y (#25) | ⬜ | P3 |

**Current: 6 ✅ · 3 🟡 · 16 ⬜**
**Target: 25 ✅ (21 shippable before MVP, 4 post-MVP)**
