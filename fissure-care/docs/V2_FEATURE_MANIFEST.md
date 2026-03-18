# 🌸 Healing Garden V2: Feature Manifest & Architecture

This document defines the scope for the V2 "Super-App" upgrade for the FissureCare (Healing Garden) platform.

## 🎯 V2 Vision
Transform a simple tracker into a comprehensive, proactive healing companion that provides utility, community insights, and automated support.

---

## 🏗️ Core Features (V2)

### 1. 🔍 Global Reddit Hub & Deep Search
- **Functionality:** Integrated search engine targeting `r/AnalFissures` and `r/Health`.
- **UI:** A dedicated "Discovery" tab with quick-links for common tags (Sitz bath, Diltiazem, Fiber).
- **Goal:** Provide immediate access to community wisdom without leaving the app.

### 2. 🛁 Sitz Pro-Timer & Zen Guide
- **Functionality:** 10-15 minute countdown timer specifically for Sitz baths.
- **Interactions:** "Breathing Guide" animation (Inhale/Exhale) to help relax the sphincter muscles during the bath.
- **Audio:** Optional gentle "Zen" chime when the timer finishes.

### 3. 🚨 Emergency "Doctor's Report" Generator
- **Functionality:** A "Generate PDF/Summary" button that compiles the last 7-14 days of logs (Pain levels, Blood, Fiber intake).
- **Goal:** Professional summary to show a doctor during a consultation to ensure accurate diagnosis.

### 4. 🌺 Visual Healing Garden (Gamified Progress)
- **Functionality:** Dynamic SVG garden on the Home screen.
- **Logic:**
    - High Fiber + High Water = Flowers bloom.
    - Low activity = Garden looks "dormant" (waiting for care).
- **Goal:** Visual positive reinforcement for daily habits.

### 5. 🔔 Proactive "Nudge" Notifications (PWA)
- **Architecture:** Service Worker (sw.js) integration using the Web Push API & Local Scheduling.
- **Logic:**
    - **9 AM:** "Good morning! Start with fruit and fiber. 🍎"
    - **2 PM:** "Water check! 💧"
    - **9 PM:** "Time to log your day for the garden. 🌙"
- **Permission:** Gentle, themed opt-in modal.

### 6. 🥗 Fiber & Hydration Goal Widgets
- **Functionality:** Progress bars/rings on the Home screen for daily targets (e.g., 25g Fiber, 3L Water).
- **Interaction:** Quick-add buttons (+5g Fiber, +1 Glass Water).

---

## 🛠️ Technical Constraints
- **Language:** Strictly **English Only**.
- **Auth:** Maintain **Public/Anonymous** Supabase access (No Google Login Gate).
- **Storage:** Primary LocalStorage with optional Supabase Sync (Background).
- **Styling:** Tailwind v4 + Framer Motion (Glassmorphism/Pastel aesthetics).

---

## ✅ Auditor Checklist (Panodu)
- [ ] No regressions in existing V1 logging flow.
- [ ] Reddit search opens in a safe external tab or clean modal.
- [ ] Timer continues running if the screen dims (Service Worker/Wake Lock).
- [ ] All icons consistent (Hibiscus/Flower theme 🌺).

**Status:** Document Created. Ready for Claude-Worker Handover.
