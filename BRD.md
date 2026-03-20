# Business Requirements Document (BRD) - SwarmOps Dashboard

## 1. Project Overview
**Project Name:** SwarmOps Dashboard (genesis-app-v2)
**Goal:** Build a complex, multi-component, Next.js 15, Tailwind v4, and state-managed web application for monitoring and controlling autonomous AI agents.

## 2. Technical Stack
- **Framework:** Next.js 15 (React 19, App Router)
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand for local high-frequency telemetry data management and global state.
- **Icons:** Lucide React
- **Data Fetching:** SWR or React Query (for simulated data updates).
- **Other:** Recharts for data visualization (cost, tokens).

## 3. Core Features

### 3.1. Dashboard View (The Control Plane)
- A high-level overview of active swarms, total tokens used (daily/monthly), total cost, and active agent count.
- **Visuals:** Line charts showing token burn rate over the last 24 hours.

### 3.2. Agent Activity Feed
- A real-time scrolling feed of agent logs categorized by severity (Info, Action, Thought, Error).
- Filters for filtering by agent ID, swarm ID, or log type.
- **Complexity:** Needs robust state management to handle incoming logs without UI freezing.

### 3.3. Human-in-the-Loop Override Panel
- A view to see agents that are paused and waiting for human confirmation before executing a "dangerous" tool (e.g., file deletion, money transfer).
- Approve/Reject buttons with a small input for providing corrected guidance to the agent.

### 3.4. Swarm Configuration
- UI to define budgets (token limits) per swarm.
- Toggle switches for global "Kill Switch" or pausing entire swarms.

## 4. Non-Functional Requirements
- **Responsive Design:** Must work flawlessly on Desktop and Tablet sizes.
- **Performance:** Log feed must handle hundreds of simulated logs via Zustand store limits.
- **Accessibility:** Ensure high contrast, keyboard navigation, and ARIA labels.

## 5. Development Steps (For Claude-Worker)
1. Bootstrap Next.js 15 project with Tailwind v4 in current directory.
2. Initialize Zustand store (`store/swarmStore.ts`) with mock initial data (agents, logs, metrics).
3. Create a layout with a Sidebar navigation (Dashboard, Agents, Interventions, Settings).
4. Implement Dashboard View (Stats cards, Recharts graph).
5. Implement Agent Activity Feed (Virtual list or limited array state, filtering logic).
6. Implement Intervention Panel.
7. Write simulated interval functions in `useEffect` at the layout level to continuously push new logs to the Zustand store, creating a "live" feel.
8. Initialize git repository.
9. Commit all files.
10. Push to `https://github.com/Vallabh2504/Panodi-Cloud-Env.git` (or correct remote setup).

*Ensure the app runs cleanly and builds without errors.*