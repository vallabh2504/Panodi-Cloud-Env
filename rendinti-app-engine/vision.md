Rendinti App Engine — Vision

Problem space
- Target: urban and peri-urban markets in developing countries where food and goods delivery is growing but faces friction: rider safety risks, unreliable offline/low-connectivity payments, poor order accuracy/merchant integration, and lack of transparency for customers.

Vision
- Build a lightweight, resilient delivery platform (Rendinti) that prioritizes rider safety, supports offline-capable payments, and improves order accuracy through simple merchant integration and verification.
- Mobile-first PWAs for riders and customers; small merchant dashboard; serverless backend hosted in Panodi-Cloud-Env and deployed to Vercel.

Core differentiators
- Safety-first routing & pacing incentives: route suggestions that avoid high-risk roads, enforced max-speed alerts, and a short safety checklist per shift.
- Offline-capable payment flow: local QR + tokenized voucher fallback when network/PSP fails; reconcile when online.
- Order verification: photo-on-pickup, merchant-prepared QR, and lightweight checksum to reduce wrong deliveries.
- Minimal footprint: PWA with caching, low-bandwidth APIs, and optional SMS fallbacks.

Primary users & personas
- Rider (motorbike/bike): needs clear routes, low-bandwidth UI, safety prompts, offline order/receipt capture.
- Customer: needs accurate ETAs, simple payments, and delivery verification.
- Merchant: needs easy order acceptance, offline order printing/screening, and reconciliation.

Success metrics (first 6 months)
- Reduce wrong-delivery rate by 40% vs baseline.
- Enable 99% of orders to be captured offline and reconciled within 12 hours.
- Achieve 80% rider adoption of safety checklist features on onboarding.

Constraints & non-goals
- Not a full replacement for heavy logistic operators; focused on SME-marketplaces and hyperlocal networks.
- Initially support a single payment provider integration + tokenized voucher fallback.

Roadmap (MVP)
1. Core API + auth (email/phone + OTP) and minimal DB schema.
2. PWA rider app: accept orders, routing (map links), photo capture, offline queueing.
3. Merchant PWA: orders list, confirm/prep, QR generation for each order.
4. Customer PWA: place order, pay (online + voucher fallback), track with photo proof.
5. Admin dashboard (basic) and reconciliation tools.

Deployment
- Repo: projects/Panodi-Cloud-Env/rendinti-app-engine
- CI/CD: Vercel for frontend (PWA), serverless functions for API (Vercel/Edge Functions) or Node server in Panodi infra.

Security & Privacy
- Minimal PII storage; OTP-based auth; photo proofs stored encrypted at rest with retention policies.
- Rider location shared only for active deliveries and anonymized in analytics.

Open questions
- Which local payment provider to integrate first? (user preference/market)
- Map/routing provider and offline routing feasibility.

"Surprise Boss Garu" note
- Deliver a live PWA URL on Vercel with a functional demo flow (create order, merchant confirm, rider pickup photo, delivery proof).