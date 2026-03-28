Rendinti App Engine — Business Requirements Document (MVP)

Objective
Build an MVP delivery platform focusing on rider safety and offline-capable order/payment capture for SME merchants in emerging markets.

Stakeholders
- Boss Garu (Product Lead)
- Riders (operators)
- Merchants (SMEs)
- Customers (end users)
- Dev team: Claude-Worker (build), QA, DevOps

Functional Requirements
1. Authentication
   - Phone-number + OTP login for riders, merchants, customers.
2. Order lifecycle
   - Customer creates order (merchant selection, items, delivery address).
   - Merchant receives order push; can confirm/prep and generate an order QR.
   - Rider accepts order, marks pickup with photo, and marks delivered with photo and customer OTP.
3. Payments
   - Integrate one PSP (configurable). Support online payments when connected.
   - Voucher token fallback: when payment fails or offline, generate a signed voucher stored locally; reconcile when online.
4. Offline support
   - PWA caches routes, orders, and queued actions (pickup/deliver) using IndexedDB; retries when connectivity restores.
5. Safety features
   - Safety checklist per shift (toggleable), max-speed warning (client-side using GPS), and optional route suggestions avoiding high-risk roads.
6. Notifications & Tracking
   - Basic ETA updates via server-sent events or polling.
   - Photo proofs attached to order history.
7. Admin
   - Simple dashboard for order logs, reconciliation, and merchant onboarding.

Non-functional Requirements
- Lightweight PWA UI, under 2MB initial payload.
- API latency <500ms for core flows under normal conditions.
- Support 1000 concurrent daily active users in MVP infra.
- Secure storage, encrypted photo at rest, OTP expiry 5 minutes.

MVP Scope (explicit)
- Single-country setup, single PSP, one language (English), basic maps via deep links to Google Maps.
- No routing engine; use map links and simple distance estimation.

Deliverables
- Repo scaffolding in projects/Panodi-Cloud-Env/rendinti-app-engine with frontend (Next.js PWA), backend API (serverless functions), and README with local dev instructions.
- Vercel deployment for frontend and functions.
- Demo walkthrough script and test data.

Success Criteria
- End-to-end demo works: create order (customer) -> merchant confirm -> rider pickup photo -> delivery proof -> payment reconciled (voucher or PSP).

Assumptions
- PSP provides an API for payment capture and webhooks.
- Basic smartphone hardware for riders (GPS + camera).

Risks & Mitigations
- Offline voucher security: use signed tokens with expiry and server-side reconciliation.
- Rider safety routing accuracy: outsource to maps provider for routing info; log incidents for manual review.

Timeline
- Planning & design: 2 days
- Build MVP (Claude-Worker): 3-5 days
- Deploy & QA: 1-2 days

Next steps
1. Spawn Claude-Worker to scaffold project and implement core flows in Panodi-Cloud-Env.
2. Configure Vercel project and provide access token (DevOps step) — Claude-Worker will request token or instructions.
3. Run deployment and return Vercel URL.

Appendix
- Repo path: projects/Panodi-Cloud-Env/rendinti-app-engine
- Suggested tech: Next.js (React) PWA, Vercel Deploy, Node/Express serverless API, IndexedDB for offline queue, simple JWT/OTP auth.
