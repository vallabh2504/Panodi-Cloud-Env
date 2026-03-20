# Business Requirements Document (BRD) - SwarmOps v2.1

## 1. Project Overview
Transform the static Genesis dashboard into **SwarmOps**, a live-syncing, installable PWA (Progressive Web App) that serves as the primary Command Center for Boss Garu's AI swarm.

## 2. Core Requirements

### 2.1 Progressive Web App (PWA)
- **Installability**: Must include `public/manifest.json` and `public/sw.js`.
- **Metadata**: `app/layout.tsx` must define `themeColor`, `viewport`, and link to the manifest.
- **Iconography**: Use a high-quality cyberpunk-style agent icon for home screen presence.

### 2.2 Live Data Synchronization (Critical)
- **API Routes**:
  - `GET /api/status`: Must execute `openclaw status --json` on the host and return the JSON payload.
  - `GET /api/logs`: Must read the latest entries from current day's memory file.
- **Frontend Integration**:
  - Replace all mock data in `lib/mockData.ts` or components (e.g., `StatsCard`, `LogFeed`, `TokenBurnChart`) with real `fetch()` calls to the new internal API routes.
- **Branding**:
  - Ensure all 'Genesis' text is replaced with 'SwarmOps'.

## 3. Workflow Constraints
- **Zero-Context Execution**: This run starts from a fresh slate.
- **Push Notification**: Upon successful `npm run build` and `git push origin main`, the worker MUST log a final message: "DEPLOYMENT_READY_FOR_MANAGER".
