# Bujji's Healing Garden — Build Plan
> This document is the single source of truth. Every feature, every decision, every line of code follows this plan.

---

## The North Star

This is **Bujji's app**. Not a generic health tracker — her personal healing companion. She should open it and feel like someone who loves her built it just for her. Every screen greets her by name. Every logged improvement is celebrated. Every hard day is met with warmth, not cold data.

**Core promise:** Make Bujji feel seen, cared for, and genuinely supported in her healing journey — through beautiful design, intelligent tracking, and micro-moments of joy.

---

## What We Already Have (V2 Baseline)

```
fissure-care/src/
├── App.jsx               ← 3-theme shell, 6-tab nav
├── lib/
│   ├── storage.js        ← Local-first + Supabase sync
│   ├── supabase.js       ← Client (kerblmnjjsbgtwidefqw)
│   └── themes.js         ← Cherry blossom, dark, light
├── screens/
│   ├── HomeScreen.jsx    ← Dashboard (needs full rebuild)
│   ├── LogScreen.jsx     ← Rich daily log (good bones, needs UX transformation)
│   ├── InsightsScreen.jsx← Charts (currently thin)
│   ├── MedsScreen.jsx    ← Medications
│   ├── SettingsScreen.jsx← Theme + prefs
│   └── WisdomScreen.jsx  ← Healing tips (stub)
```

**Supabase project:** `kerblmnjjsbgtwidefqw.supabase.co`
**Existing tables:** `daily_logs` (date, data JSONB, wellness_score), `medications`

---

## Tech Stack & Constraints

- **Framework:** React 18 + Vite (no TypeScript, keep it lean)
- **Styling:** Inline styles (existing pattern — keep consistent, no CSS-in-JS lib)
- **Animation:** CSS transitions + keyframes (no Framer Motion — keep bundle small)
- **Data:** Local-first (localStorage) + Supabase sync (offline works always)
- **Charts:** Recharts (install — lightweight, works well on mobile)
- **Platform:** PWA on mobile browser, installed to home screen
- **Deploy:** Vercel via GitHub Actions on push to `main`

---

## Phase 1 — Foundation (Supabase + PWA + Personalization)

### 1A. Supabase Schema

Run these migrations in Supabase SQL editor:

```sql
-- daily_logs (may already exist — upsert safe)
create table if not exists daily_logs (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  data jsonb not null default '{}',
  wellness_score integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- user_settings (Bujji's name, goals, preferences)
create table if not exists user_settings (
  id integer primary key default 1 check (id = 1), -- singleton row
  user_name text default 'Bujji',
  water_goal integer default 8,
  fiber_goal integer default 25,
  reminder_time text default '09:00',
  theme text default 'cherry',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- streak_milestones (for celebration tracking)
create table if not exists streak_milestones (
  id uuid primary key default gen_random_uuid(),
  milestone integer not null, -- 3, 7, 14, 30, 60, 90
  celebrated_at date not null,
  created_at timestamptz default now()
);

-- Enable RLS but allow all for now (single user app)
alter table daily_logs enable row level security;
alter table user_settings enable row level security;
alter table streak_milestones enable row level security;

create policy "allow all" on daily_logs for all using (true);
create policy "allow all" on user_settings for all using (true);
create policy "allow all" on streak_milestones for all using (true);
```

### 1B. PWA Setup

Files to create/update:
- `public/manifest.json` — app name "Bujji's Healing Garden", icons, theme color `#FFF0EB`
- `public/sw.js` — service worker with cache-first strategy for app shell
- `index.html` — add manifest link + meta tags for iOS PWA

### 1C. Personalization Bootstrap

- On first launch, show a **one-time welcome screen** that asks her name (pre-filled "Bujji"), sets reminder time
- Save to `user_settings` + localStorage
- All screens read `userName` from settings and use it in greetings

---

## Phase 2 — UX Transformation (The Feel)

This is the most important phase. The log already has the right data model — what it needs is to feel like an experience, not a form.

### 2A. Log Screen → Swipeable Step-by-Step Journey

**Current problem:** One endless scroll. Exhausting.

**New pattern:** Sectioned card journey with smooth horizontal transitions.

```
Step 1/7: Good morning Bujji! 💛    ← Greeting card with today's date
Step 2/7: Bowel Movements 🚽        ← Same data, new card shell
Step 3/7: How are you feeling? 🌡️   ← Symptom sliders
Step 4/7: Hydration 💧              ← Water tracker
Step 5/7: Food today 🍎             ← Fruits + fiber + avoid
Step 6/7: Self-care 🛁              ← Sitz baths + ointment + activity
Step 7/7: Journal 💛                ← Emotion + notes + save
```

**Navigation:**
- Back/Next buttons at bottom (large, thumb-friendly)
- Step indicator dots at top (tappable)
- Swipe left/right gesture support
- Each card slides in from the right, slides out to the left (CSS transform transition 300ms)
- Progress bar across the top fills as she moves through steps

**Micro UX on each card:**
- Card entrance: slides up 20px + fade in (50ms stagger)
- Step complete indicator: green checkmark animates in when data is entered on that step
- "You're almost done, Bujji! 💛" appears at step 6
- Final save: full-screen celebration animation

### 2B. Home Screen → Bujji's Daily Dashboard

Complete rebuild. Structure:

```
┌─────────────────────────────────────────┐
│  Good morning, Bujji! ☀️               │  ← Time-aware greeting
│  Thursday, 15 May · Day 12 of healing  │
└─────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐
│  Today's Score  │  │  🔥 Streak       │
│      82 / 100   │  │   7 days 🎉     │
│  ░░░░░░░░░░░░  │  │  Keep it up!    │
└─────────────────┘  └─────────────────┘

┌─────────────────────────────────────────┐
│ Yesterday's insight 💡                  │
│ "You ate spicy food → pain was 7/10    │
│  the next morning. Pattern detected."  │
└─────────────────────────────────────────┘

┌─── This week's trend ──────────────────┐
│ Pain:   ████░░░░ improving ↓           │
│ Hydration: ██████░░ good               │
│ Bristol: 3×Type4 this week 🌟          │
└─────────────────────────────────────────┘

[ 📝 Log Today ]  [ 💡 Insights ]  ← CTA buttons
```

**Micro UX:**
- Greeting changes by time: "Good morning" / "Good afternoon" / "Good evening"
- Score card has a subtle pulse animation
- Streak counter shows fire emoji that grows with streak length
- "Yesterday's insight" card slides in 200ms after load
- Trend bars animate from 0 on mount

### 2C. Insights Screen → Intelligence Dashboard

Sections:
1. **7-day wellness score chart** (Recharts LineChart, warm coral color)
2. **Bristol type distribution** (7-bar chart, color-coded)
3. **Pain trend** (line chart, red→green gradient as it improves)
4. **Food → Outcome correlation cards:**
   - "Days you had spicy food: avg pain 6.8"
   - "Days you hit water goal: avg pain 4.1"
   - "Days with 2+ sitz baths: 40% less bleeding"
5. **Weekly summary** (plain English, warm tone: "This was a better week, Bujji 🌸")

### 2D. Wisdom Screen → Daily Healing Card

- One beautiful card per day (rotates from a curated list of 60+)
- Categories: nutrition tips, sitz bath techniques, breathing exercises, affirmations
- "Save this tip" bookmarks to localStorage
- Smooth card flip animation when she opens the screen

---

## Phase 3 — Intelligence Layer (Food → Poop Correlation)

This is the feature that makes the app genuinely useful.

### 3A. Correlation Engine (`lib/correlations.js`)

```javascript
// Algorithm:
// 1. For each day D, look at food logged on D
// 2. Look at bowel movement quality on D+1 (Bristol type, pain)
// 3. Build a map: food_item → [next_day_outcomes]
// 4. Surface patterns when N >= 3 occurrences

function analyzeFoodOutcomes(logs) {
  // Returns: { spicy: { avgPain: 6.8, avgBristol: 2.1, count: 5 }, ... }
}

function getTodayInsight(logs) {
  // Returns a human-readable string like:
  // "Yesterday you had coffee ☕ — your pain this morning was 7. 
  //  On days after coffee, your avg pain is 6.5. Consider switching to herbal tea 🌿"
}
```

### 3B. Insight Cards

- Show on Home screen in a horizontally scrollable strip
- Color-coded: red border for triggers, green for helpers
- Tap to expand with full data

### 3C. "Smart Log" hints

- When she taps a food-to-avoid item in the log, the tip includes her personal data:
  - Instead of generic "spicy food can irritate" →
  - "Last 3 times you had spicy food, next-day pain averaged 7.2/10 🌶️"

---

## Phase 4 — Delight Layer (Celebrations + Reminders)

### 4A. Celebration System (`lib/celebrations.js`)

**Triggers and responses:**

| Event | Celebration |
|-------|-------------|
| First log ever | Full-screen welcome animation + "Bujji, your healing journey starts today! 🌸" |
| 3-day streak | Confetti burst + "3 days strong, Bujji! 🔥" |
| 7-day streak | Gold stars + "A whole week! You're incredible 💛" |
| 30-day streak | Full screen fireworks + personal message |
| Pain drops 2+ points vs last week | "Bujji, your pain has improved! Keep going 🌸" |
| First Type 4 Bristol logged | "Perfect movement, Bujji! Your gut is healing 🍌✨" |
| Water goal hit | Water droplet rain animation |
| 2 sitz baths in a day | "You're taking such good care of yourself 🛁💛" |
| Wellness score > 80 | Warm glow animation + score bounces |

**Implementation:** 
- `CelebrationOverlay.jsx` — full-screen overlay with CSS animation
- Auto-dismisses after 3 seconds or on tap
- Never shows same celebration twice in 24 hours

### 4B. Gentle Reminders (PWA Push or In-App)

Since push notifications need a backend, start with **in-app reminders**:
- If she opens the app and hasn't logged today by 8pm → gentle banner: "Hey Bujji, haven't heard from you today 💛 How are you feeling?"
- If she goes 2 days without logging → Home screen shows a soft nudge card instead of dashboard

**Future:** Add Web Push API with service worker for true background notifications

### 4C. Micro UX Details (The 100 Small Things)

These are sprinkled throughout — no individual feature, just the texture:

- **Haptic-equivalent:** Buttons scale to 0.97 on tap (CSS transform active state)
- **Loading states:** Skeleton shimmer instead of blank while data loads
- **Empty states:** Warm illustrated states ("No logs yet — start your journey, Bujji! 🌸")
- **Scroll to top:** Smooth scroll when navigating between log steps
- **Input focus:** Fields glow with a soft coral border on focus
- **Success micro-animations:** Checkmarks draw in with a stroke animation
- **Water glasses:** Each glass fills with a liquid pour animation
- **Fruit selection:** Selected fruits bounce slightly
- **Pain slider:** Emoji changes animate with a pop (scale 1.3 → 1)
- **Bristol type selection:** Selected card lifts with a shadow
- **Save button:** Ripple effect on tap
- **Score ring:** Animates from 0 to actual score on mount (800ms ease)
- **Streak number:** Counts up from previous value on mount
- **Chart lines:** Draw from left to right on first render
- **Tab switching:** Active tab icon bounces once
- **Long press on insight:** Shows "copied to clipboard" toast
- **Pull to refresh:** Custom refresh indicator with cherry blossom
- **Keyboard avoidance:** Form fields scroll into view automatically on mobile
- **Date header:** Subtle shimmer on today's date
- **Affirmation on save:** Random warm message from a pool of 30, always uses "Bujji"

---

## Phase 5 — Polish & Ship

- [ ] Test on actual mobile (iOS Safari + Chrome Android)
- [ ] Verify PWA install prompt works
- [ ] Check offline mode (disable wifi, log data, re-enable, confirm sync)
- [ ] Performance audit (Lighthouse score > 90)
- [ ] Accessibility: font sizes readable, touch targets >= 44px
- [ ] Final theme pass: ensure cherry blossom theme is consistent everywhere

---

## File Structure After Build

```
fissure-care/src/
├── App.jsx
├── main.jsx
├── index.css
├── lib/
│   ├── supabase.js
│   ├── storage.js          ← extend with settings + streak + milestones
│   ├── themes.js
│   ├── correlations.js     ← NEW: food→outcome engine
│   ├── celebrations.js     ← NEW: celebration trigger logic
│   └── affirmations.js     ← NEW: pool of warm messages for Bujji
├── components/
│   ├── BottomNav.jsx
│   ├── CelebrationOverlay.jsx  ← NEW
│   ├── ProgressBar.jsx         ← NEW (log step progress)
│   ├── InsightCard.jsx         ← NEW (correlation card)
│   ├── SkeletonLoader.jsx      ← NEW
│   └── StepDots.jsx            ← NEW (log navigation dots)
└── screens/
    ├── HomeScreen.jsx      ← FULL REBUILD
    ├── LogScreen.jsx       ← TRANSFORM to step-by-step
    ├── InsightsScreen.jsx  ← FULL REBUILD with Recharts
    ├── MedsScreen.jsx      ← LIGHT POLISH
    ├── SettingsScreen.jsx  ← ADD name/reminder/goals
    └── WisdomScreen.jsx    ← BUILD OUT with tip cards
```

---

## Execution Order

```
Phase 1A → Supabase SQL migrations
Phase 1B → PWA manifest + service worker
Phase 1C → Settings screen + name bootstrap
Phase 2A → Log screen step-by-step transform  ← biggest UX win
Phase 2B → Home screen rebuild
Phase 4A → Celebration system (reward the effort immediately)
Phase 3A → Correlation engine
Phase 2C → Insights screen with Recharts
Phase 3B → Insight cards on Home
Phase 4B → In-app reminders
Phase 2D → Wisdom screen
Phase 4C → Micro UX pass (all the small things)
Phase 5  → Polish + ship
```

---

## Tone & Copy Guide

Every piece of copy in this app follows these rules:

1. **Always use her name** — "Bujji" in greetings, celebrations, reminders
2. **Never clinical** — "movement" not "defecation", "discomfort" not "pain" where possible
3. **Never alarming** — blood tracking is factual, never scary
4. **Always warm** — end with 💛 or 🌸 frequently but not on every single line
5. **Celebrate effort, not perfection** — "You logged 5 days this week!" not "You missed 2 days"
6. **Personal insight > generic advice** — use her data to make advice specific to her

---

*Last updated: 2026-05-15*
*Supabase project: kerblmnjjsbgtwidefqw*
*Live URL: https://fissure-care-vivid.vercel.app*
