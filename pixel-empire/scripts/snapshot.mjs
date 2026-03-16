import { chromium } from 'playwright';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const SNAPSHOT_PATH = '/root/.openclaw/workspace/Panodi-Cloud-Env/pixel-empire/snapshots/latest.png';
const DASHBOARD_URL = 'http://localhost:5173';

async function takeSnapshot() {
    console.log('📸 Starting snapshot process...');
    
    const browser = await chromium.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    
    try {
        console.log(`🌐 Navigating to ${DASHBOARD_URL}...`);
        await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle' });
        
        // Wait for any specific element if needed, e.g., the dashboard container
        // await page.waitForSelector('#root');
        
        console.log('🖼️ Taking screenshot...');
        await page.screenshot({ path: SNAPSHOT_PATH });
        console.log(`✅ Snapshot saved to ${SNAPSHOT_PATH}`);
    } catch (error) {
        console.error('❌ Failed to take snapshot:', error);
    } finally {
        await browser.close();
    }
}

takeSnapshot();
