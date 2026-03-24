# Panodi Cloud Env

Monorepo for all of Boss Garu's cloud apps and tools.

## Apps

| Folder | App | Stack |
|--------|-----|-------|
| `apps/sovereign-gpt-web` | Sovereign GPT — AI chat interface | React 19 + Vite + Supabase |
| `swarmops` | SwarmOps — AI agent swarm dashboard | Next.js + Zustand + Recharts |
| `delusion-check` | DelusionCheck.ai — reality check tool | React 19 + Vite + Supabase |
| `fissure-care` | Healing Garden — health tracking PWA | React 19 + Vite + Supabase |
| `nexus-edge` | Nexus Edge — event-driven agent orchestrator | Node.js + TypeScript |
| `pixel-empire` | Pixel Empire — agent swarm visualizer | React 19 + Vite + Playwright |
| `weather-bridge` | Weather Bridge — live weather for 2 cities | Vanilla JS |
| `crazy-combat-game` | Cyber Clash — combat game prototype | HTML/CSS/JS |

## Development

```bash
# Run a specific app
npm run dev:sovereign     # Sovereign GPT
npm run dev:swarmops      # SwarmOps dashboard

# Or go into any app folder and run directly
cd apps/sovereign-gpt-web && npm run dev
cd swarmops && npm run dev
```
