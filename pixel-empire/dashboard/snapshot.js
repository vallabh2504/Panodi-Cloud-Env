import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto('http://localhost:5173');
await page.screenshot({ path: 'live_war_room.png', fullPage: true });

await browser.close();
console.log('Screenshot saved to live_war_room.png');
