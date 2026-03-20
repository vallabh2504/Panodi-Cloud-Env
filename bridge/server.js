const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs/promises');
const path = require('path');

const execAsync = promisify(exec);
const app = express();
const PORT = 3333;
const API_KEY = process.env.BRIDGE_API_KEY || 'vps-bridge-token-2026';

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
    const { stdout } = await execAsync('openclaw status --json');
    res.json(JSON.parse(stdout));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const MEMORY_DIR = '/root/.openclaw/workspace/memory';

app.get('/api/logs', async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const filePath = path.join(MEMORY_DIR, `${date}.md`);
    let content = '';
    
    try {
      content = await fs.readFile(filePath, 'utf-8');
      return res.json({ date, content, source: filePath });
    } catch {
      // Try latest
      const files = (await fs.readdir(MEMORY_DIR))
        .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
        .sort()
        .reverse();

      if (files.length === 0) {
        return res.status(404).json({ error: 'No files found' });
      }

      const latest = files[0];
      const latestPath = path.join(MEMORY_DIR, latest);
      content = await fs.readFile(latestPath, 'utf-8');
      return res.json({ date: latest.replace('.md', ''), content, source: latestPath });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bridge listening on port ${PORT}`);
});
