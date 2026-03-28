# Rendinti App Engine MVP

Objective: Build an MVP delivery platform focusing on rider safety and offline-capable order/payment capture.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **PWA**: Manifest.json, Lucide icons, IndexedDB (idb) for offline queueing
- **Backend API**: Serverless Next.js API Routes (Auth, Orders, Photos, Vouchers)
- **Database**: Mock (MVP). In production, connect to a database.
- **Offline Protocol**: Actions are queued to IndexedDB when offline and synced automatically when online.

## Core Features Implemented
- **Auth (Mock)**: Use phone + OTP (Try `123456`).
- **Order Lifecycle**: Browse orders, accept (preparing), take pickup photo (mock), and complete delivery with customer OTP.
- **Offline Support**: Queue order status updates when connectivity is lost.
- **Serverless API**:
  - `POST /api/auth`: Login.
  - `GET /api/orders`: List pending orders.
  - `POST /api/orders`: Update order status.
  - `POST /api/upload`: Mock photo proof upload.
  - `POST /api/voucher`: Reconcile offline signed vouchers.

## Deployment to Vercel

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Login**: `vercel login`
3. **Deploy**:
   ```bash
   cd projects/Panodi-Cloud-Env/rendinti-app-engine
   vercel --prod
   ```
4. **Environment Variables**: Add any necessary secrets (e.g., `NEXT_PUBLIC_MAPS_API_KEY`) to the Vercel dashboard.

## Demo Walkthrough
1. Access the app and login with phone number and OTP `123456`.
2. View the mock orders list.
3. Toggle airplane mode (simulate offline) and click "Accept". Notice the "Action queued offline" alert.
4. Restore connectivity and see the status sync automatically in the background console logs.

---
Built by Architect-Pro (Claw-Worker) for Panodi-Cloud-Env.
