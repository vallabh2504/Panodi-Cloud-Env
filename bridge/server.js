const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');

const execAsync = promisify(exec);
const app = express();
const PORT = parseInt(process.env.BRIDGE_PORT || '3333', 10);
const API_KEY = process.env.BRIDGE_API_KEY || 'vps-bridge-token-2026';
const OPENCLAW_STATUS_TIMEOUT_MS = parseInt(process.env.OPENCLAW_STATUS_TIMEOUT_MS || '8000', 10);

// Memory dir resolution: env override → root workspace → user home
const MEMORY_DIR_CANDIDATES = [
  process.env.MEMORY_DIR,
  '/root/.openclaw/workspace/memory',
  path.join(os.homedir(), '.openclaw', 'workspace', 'memory'),
  path.join(os.homedir(), '.openclaw', 'memory'),
].filter(Boolean);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);

  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.get('/api/status', async (req, res) => {
  try {
    const { stdout } = await execAsync('openclaw status --json', {
      timeout: OPENCLAW_STATUS_TIMEOUT_MS,
      killSignal: 'SIGTERM',
    });
    const data = JSON.parse(stdout.trim());
    return res.json(data);
  } catch (err) {
    // Timeout or parse error — return lightweight fallback with real OS info
    const fallback = {
      os: {
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        label: `${os.type()} ${os.release()}`,
        uptime: os.uptime(),
        loadAvg: os.loadavg(),
        freeMem: os.freemem(),
        totalMem: os.totalmem(),
      },
      agents: {
        defaultId: 'main',
        agents: [],
        totalSessions: 0,
        bootstrapPendingCount: 0,
      },
      bridgeError: err.killed ? 'openclaw status timed out' : err.message,
      timestamp: Date.now(),
    };
    return res.json(fallback);
  }
});

// Find first readable memory directory from candidate list
async function resolveMemoryDir() {
  for (const dir of MEMORY_DIR_CANDIDATES) {
    try {
      await fs.access(dir);
      return dir;
    } catch {
      // not accessible, try next
    }
  }
  return null;
}

app.get('/api/logs', async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);

  const memoryDir = await resolveMemoryDir();
  if (!memoryDir) {
    return res.status(503).json({
      error: 'No readable memory directory found',
      candidates: MEMORY_DIR_CANDIDATES,
    });
  }

  // Try the requested date first, then fall back to latest available file
  const requestedPath = path.join(memoryDir, `${date}.md`);
  try {
    const content = await fs.readFile(requestedPath, 'utf-8');
    return res.json({ date, content, source: requestedPath });
  } catch {
    // fall through to latest file scan
  }

  try {
    const files = (await fs.readdir(memoryDir))
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
      .sort()
      .reverse();

    if (files.length === 0) {
      return res.status(404).json({ error: 'No memory log files found', memoryDir });
    }

    const latest = files[0];
    const latestPath = path.join(memoryDir, latest);
    const content = await fs.readFile(latestPath, 'utf-8');
    return res.json({ date: latest.replace('.md', ''), content, source: latestPath });
  } catch (err) {
    return res.status(500).json({ error: err.message, memoryDir });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), port: PORT });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bridge listening on port ${PORT}`);
  console.log(`Memory dir candidates: ${MEMORY_DIR_CANDIDATES.join(', ')}`);
});
