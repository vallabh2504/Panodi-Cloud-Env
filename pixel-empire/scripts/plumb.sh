#!/bin/bash

# Configuration
PIXEL_EMPIRE_DIR="/root/.openclaw/workspace/Panodi-Cloud-Env/pixel-empire"
DASHBOARD_DIR="$PIXEL_EMPIRE_DIR/dashboard"
SNAPSHOT_SCRIPT="$PIXEL_EMPIRE_DIR/scripts/snapshot.mjs"
XVFB_LOCK="/tmp/.X99-lock"

echo "🚀 Pixel Empire Plumber: Triggering Refresh..."

# 1. Start Dashboard if not running (simple check)
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "📦 Starting Vite Dashboard in background..."
    cd "$DASHBOARD_DIR" && npm run dev -- --host &
    # Wait for Vite to be ready
    for i in {1..30}; do
        if curl -s http://localhost:5173 > /dev/null; then
            echo "✅ Dashboard is UP."
            break
        fi
        sleep 1
    done
else
    echo "✅ Dashboard is already running."
fi

# 2. Run Snapshot using Xvfb
echo "📸 Running Headless Snapshot..."
xvfb-run --server-args="-screen 0 1920x1080x24" node "$SNAPSHOT_SCRIPT"

echo "🏁 Plumbing complete."
