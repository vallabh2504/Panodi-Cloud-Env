# PROJECT BRD: THE PIXEL EMPIRE 🏛️👾

## 1. VISION
To transform the invisible "Agent Swarm" of Panodu's ecosystem into a live, visual, and gamified dashboard. Every agent action is reflected by animated pixel characters in a virtual "War Room."

## 2. CORE REQUIREMENTS
- **Visual Representation:** Individual pixel avatars for Panodu, wa-gatekeeper, Architect-Pro, Auditor-Pro, and Claude Worker.
- **Dynamic Animations:** 
    - `Idle`: Characters drinking chai, sleeping, or wandering.
    - `Working`: Characters typing, building, or looking at blueprints.
    - `Alert`: Visual indicators (speech bubbles/emojis) when human input is needed.
- **Headless Snapshots:** The dashboard must run on Xvfb (Virtual Framebuffer) and be captured via Playwright. No 24/7 GUI process allowed due to 2GB RAM constraints.
- **Agent Integration:** A centralized `swarm_events.jsonl` file will act as the "source of truth." Agents append their status; the React dashboard renders it.

## 3. TECH STACK
- **Frontend:** React + Vite + Tailwind CSS + Framer Motion.
- **Execution:** Xvfb + Playwright + Node.js.
- **Assets:** High-quality Pixel Art (16x16 or 32x32 tileset style).

## 4. CONSTRAINTS (CRITICAL)
- **RAM Limit:** 2GB total server RAM. The rendering process must be "On-Demand" (start browser, take snapshot, kill browser).
- **Token Efficiency:** Architect-Pro must use precise prompts for Claude CLI to avoid context bloat.
- **State Anchoring:** Maintain `STATE.json` for progress tracking across turns.

## 5. WORKFLOW
1. Architect-Pro initializes the React project.
2. Claude CLI builds the UI components and pixel layout.
3. Architect-Pro connects the Playwright-Xvfb snapshot logic.
4. Agents are "Plumbed" to write to the event log.
5. Final Verification: Panodu requests "Status Check" -> Image delivered to Telegram.

---
**Status:** DRAFT | MARCH 1, 2026 | MISSION: PHYSICAL DIGITAL DHARMA
