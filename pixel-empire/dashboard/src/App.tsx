import "./App.css";
import stateRaw from "../../STATE.json?raw";

const GRID_SIZE = 12;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

type PixelEmpireState = {
  project: string;
  phase: string;
  status: string;
  milestones: Record<string, boolean>;
  notes?: string;
  last_update?: string;
};

type SpriteAgent = {
  id: string;
  label: string;
  gridIndex: number;
  animation: string;
  aura: string;
  accent: string;
  status: string;
  badge: string;
};

const state: PixelEmpireState = JSON.parse(stateRaw);
const milestoneEntries = Object.entries(state.milestones || {});
const completedMilestones = milestoneEntries.filter(([, done]) => done).length;
const completionRatio = milestoneEntries.length
  ? completedMilestones / milestoneEntries.length
  : 0;

const clampIndex = (value: number) => Math.max(0, Math.min(TOTAL_CELLS - 1, value));
const progressIndex = clampIndex(Math.round(completionRatio * (TOTAL_CELLS - 1)));
const architectIndex = clampIndex(
  progressIndex + (state.milestones.Pixel_Assets_Setup ? -GRID_SIZE + 2 : GRID_SIZE - 2)
);
const workerIndex = clampIndex(
  progressIndex + (state.milestones.Snapshot_Logic_Working ? 3 : GRID_SIZE + 3)
);

const sprites: SpriteAgent[] = [
  {
    id: "panodu",
    label: "Panodu",
    gridIndex: progressIndex,
    animation: "sprite-panodu",
    aura: "from-cyan-400/80 to-cyan-700/60",
    accent: "text-cyan-300",
    status: state.status,
    badge: `${Math.round(completionRatio * 100)}% mission aligned`,
  },
  {
    id: "architect",
    label: "Architect",
    gridIndex: architectIndex,
    animation: "sprite-architect",
    aura: "from-amber-400/70 to-amber-600/50",
    accent: "text-amber-300",
    status: state.milestones.Pixel_Assets_Setup ? "Assets staged" : "Assets pending",
    badge: state.phase,
  },
  {
    id: "worker",
    label: "Worker",
    gridIndex: workerIndex,
    animation: "sprite-worker",
    aura: "from-pink-400/70 to-pink-600/50",
    accent: "text-pink-300",
    status: state.milestones.Snapshot_Logic_Working ? "Snapshot ready" : "Snapshot blocked",
    badge: state.last_update ? new Date(state.last_update).toLocaleDateString() : "Awaiting sync",
  },
];

const spriteMap = sprites.reduce<Record<number, SpriteAgent>>((map, sprite) => {
  map[sprite.gridIndex] = sprite;
  return map;
}, {});

const intelFeed = (state.notes || "")
  .split(/\.|\n|\r/g)
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((msg, index) => ({
    time: new Date(Date.now() - index * 62000).toLocaleTimeString(),
    msg,
    lvl: index % 3 === 0 ? "ALERT" : "INFO",
  }));

const milestoneCards = milestoneEntries.map(([key, done]) => ({
  key,
  done,
  text: key.replace(/_/g, " "),
}));

const PixelGrid = ({ spriteLookup }: { spriteLookup: Record<number, SpriteAgent> }) => (
  <div className="pixel-grid">
    {Array.from({ length: TOTAL_CELLS }).map((_, index) => {
      const sprite = spriteLookup[index];
      return (
        <div
          key={index}
          data-active={Boolean(sprite)}
          className="pixel-cell"
          style={{ animationDelay: `${(index % GRID_SIZE) * 40}ms` }}
        >
          {sprite && <SpriteAvatar sprite={sprite} />}
        </div>
      );
    })}
  </div>
);

const SpriteAvatar = ({ sprite }: { sprite: SpriteAgent }) => (
  <div className={`sprite-avatar ${sprite.animation}`}>
    <div className={`sprite-chip bg-gradient-to-br ${sprite.aura}`}></div>
    <span className="sprite-label">{sprite.label}</span>
  </div>
);

const SpriteLegend = ({ spriteAgents }: { spriteAgents: SpriteAgent[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
    {spriteAgents.map((sprite) => {
      const row = Math.floor(sprite.gridIndex / GRID_SIZE) + 1;
      const col = (sprite.gridIndex % GRID_SIZE) + 1;
      return (
        <div
          key={sprite.id}
          className="border border-green-900 bg-black/60 p-4 rounded-lg flex flex-col gap-2 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-widest text-green-600">
            <span>{sprite.label}</span>
            <span className="text-green-800">r{row} • c{col}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`sprite-dot ${sprite.animation}`} />
            <div>
              <p className={`${sprite.accent} text-sm font-semibold`}>{sprite.status}</p>
              <p className="text-xs text-green-700">{sprite.badge}</p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-[#020a0b] text-green-300 font-['JetBrains_Mono',monospace]">
      <header className="border-b border-green-900 bg-slate-950/80 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 border border-cyan-900 bg-cyan-950/30 px-3 py-1 rounded">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] text-cyan-400 uppercase tracking-tighter font-bold">Memory Pulse: 37 Units</span>
        </div>
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] text-cyan-400 uppercase tracking-tighter font-bold">Memory Pulse: 37 Units</span>
        </div> bg-slate-950/80 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="status-led" />
          <div>
            <p className="text-green-400 text-xs tracking-[0.4em] uppercase">{state.project}</p>
            <p className="text-[11px] text-green-700 tracking-widest">PHASE: {state.phase}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs text-green-600 tracking-widest">
          <span>SYS:{completedMilestones >= 1 ? "STABLE" : "BOOT"}</span>
          <span>MILESTONES:{completedMilestones}/{milestoneEntries.length}</span>
          <span>SYNC:{state.last_update ? new Date(state.last_update).toLocaleTimeString() : "N/A"}</span>
        </div>
        <div className="text-xs text-green-700 tracking-widest text-right">
          CLEARANCE: ALPHA-7
        </div>
      </header>

      <div className="grid grid-cols-12 grid-rows-[auto_1fr_1fr] gap-px bg-green-950/40 min-h-[calc(100vh-68px)]">
        <aside className="col-span-2 row-span-3 bg-slate-950/80 border-r border-green-900 p-4 flex flex-col gap-4">
          <div className="text-xs tracking-widest text-green-500 uppercase border-b border-green-900 pb-2">
            Swarm Health
          </div>
          <div className="flex flex-col gap-2">
            {milestoneCards.map((milestone) => (
              <div key={milestone.key} className="flex items-center justify-between text-xs">
                <span className="text-green-400">{milestone.text}</span>
                <span className={milestone.done ? "text-emerald-400" : "text-yellow-500"}>
                  {milestone.done ? "ONLINE" : "PENDING"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto text-xs text-green-900 border-t border-green-900 pt-4 flex flex-col gap-1">
            <span>STATUS: {state.status}</span>
            <span>UPTIME: 14d 06h 22m</span>
          </div>
        </aside>

        <section className="col-span-7 row-span-2 bg-slate-950/80 p-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs tracking-widest text-green-600 uppercase border-b border-green-900 pb-2">
            <span>PixelGrid // 12 x 12 Matrix</span>
            <span className="text-green-800">Capture Vector: DELTA-9</span>
          </div>
          <PixelGrid spriteLookup={spriteMap} />
          <SpriteLegend spriteAgents={sprites} />
        </section>

        <aside className="col-span-3 row-span-2 bg-slate-950/80 border-l border-green-900 p-4 flex flex-col gap-3">
          <div className="text-xs tracking-widest text-green-600 uppercase border-b border-green-900 pb-2">
            Intel Feed
          </div>
          <div className="flex flex-col gap-2 overflow-hidden">
            {intelFeed.length === 0 && (
              <p className="text-xs text-green-700">No live intel. Monitoring channel...</p>
            )}
            {intelFeed.slice(0, 8).map((entry, i) => (
              <div key={i} className="text-xs border-b border-green-950 pb-2">
                <div className="flex justify-between">
                  <span className="text-green-800">{entry.time}</span>
                  <span className={
                    entry.lvl === "ALERT"
                      ? "text-red-500"
                      : entry.lvl === "WARN"
                      ? "text-yellow-600"
                      : "text-green-700"
                  }>
                    {entry.lvl}
                  </span>
                </div>
                <div className="text-green-500 mt-0.5">{entry.msg}</div>
              </div>
            ))}
          </div>
        </aside>

        <section className="col-span-7 bg-slate-950/80 border-t border-green-900 p-4 grid grid-cols-4 gap-4">
          {[
            { label: "Completion", value: `${Math.round(completionRatio * 100)}%`, unit: "Scope" },
            { label: "Agents Online", value: "003", unit: "Sprites" },
            { label: "Next Gate", value: state.milestones.Pixel_Assets_Setup ? "Snapshot" : "Assets", unit: "Focus" },
            { label: "Signal", value: state.phase, unit: "Phase" },
          ].map((metric) => (
            <div key={metric.label} className="border border-green-900 bg-black/60 p-3 flex flex-col gap-1">
              <div className="text-xs text-green-700 uppercase tracking-widest">{metric.label}</div>
              <div className="text-2xl text-green-400 leading-none">{metric.value}</div>
              <div className="text-xs text-green-800">{metric.unit}</div>
            </div>
          ))}
        </section>

        <aside className="col-span-3 bg-slate-950/80 border-t border-l border-green-900 p-4 flex flex-col gap-3">
          <div className="text-xs tracking-widest text-green-600 uppercase border-b border-green-900 pb-2">
            Mission Log
          </div>
          <div className="flex flex-col gap-2 text-xs text-green-500">
            {milestoneCards.map((milestone, idx) => (
              <div key={milestone.key} className="flex items-center gap-3">
                <span className="text-green-800">{idx + 1}.</span>
                <span className={milestone.done ? "text-emerald-400" : "text-yellow-500"}>{milestone.text}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
