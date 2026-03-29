Rendinti App Engine — BRD (Business Requirements Document)

1. Executive Summary
Rendinti App Engine is a focused product to help small food operators create and publish limited-run menus (events) fast. The MVP will provide authoring, publishing to a short URL, and accepting pre-orders via Stripe Checkout.

2. Stakeholders
- Boss Garu (Product Owner)
- Small restaurants, home chefs, caterers (end users)
- DevOps (Claude-Worker / Build agents)

3. User Personas
- Quick-Serve Owner: Needs to move surplus ingredients into a limited-time special.
- Home Chef: Wants to run a weekend pop-up with minimal setup.
- Social Seller: Primarily posts on Instagram and needs a link to take pre-orders.

4. Functional Requirements
FR1: Event creation
- Admin can create an event with title, description, date/time window, timezone, location (optional), and hero image.
- Each event contains a list of items: name, description, price, photo, available_quantity, pickup/delivery option.

FR2: Menu Page generation
- Generate a single, responsive, shareable menu page per event with SEO metadata and social cards.
- Show remaining quantity, simple add-to-cart, and Stripe Checkout for payment.

FR3: Payments
- Integrate Stripe Checkout sessions (serverless endpoint) for secure payments.
- Webhook handler to record successful payments and decrement item quantities.

FR4: Publishing and Deployment
- Repo-based deployment: pushing to main triggers Vercel to build and publish a unique URL per event.
- Provide a CLI or admin UI to trigger deployment.

FR5: Admin dashboard (MVP-lite)
- View orders per event and basic revenue summary.

5. Non-functional Requirements
- Time-to-publish target: <10 minutes for new users (excluding account setup).
- Security: use Stripe Checkout; store minimal payment data; secure webhooks with signatures.
- Availability: best-effort for Hobby tier; document scaling to Pro for high volume.

6. Data Model
- Event: id, slug, title, description, start_time, end_time, timezone, hero_image, metadata
- Item: id, event_id, name, description, price_cents, currency, photo_url, available_quantity
- Order: id, event_id, items[{item_id, qty, price_cents}], total_cents, stripe_session_id, status, created_at

7. API Surfaces
- GET /api/events/[slug] -> event payload (used by static generation via getStaticProps)
- POST /api/create-checkout-session -> creates Stripe session for a cart
- POST /api/webhook -> Stripe webhook endpoint to confirm payment

8. Integration Points
- Stripe (Checkout, Webhooks)
- Vercel (deploy and hosting)
- Optional: Supabase/Planetscale for persistent storage; start with flat JSON or SQLite in repo for genesis run

9. CI/CD
- GitHub Actions to run build, tests (if any), and call Vercel CLI to deploy (if using token).

10. Acceptance Criteria
- A sample event can be created and published to a Vercel URL.
- A test Stripe payment flow completes (using Stripe test keys) and an order is recorded.
- Admin can view orders in a basic dashboard.

11. Risks and Mitigations
- Risk: Vercel deploy requires token or owner connection. Mitigation: Provide step-by-step for owner to connect and add Vercel token as a secret; or use user's CLI to deploy locally.
- Risk: Stripe onboarding required. Mitigation: Test keys supported; owner must connect live keys for production.

12. Timeline for Genesis Run
- Research + BRD + vision: 2 hours
- Scaffold Next.js app + API endpoints + CI: 4–6 hours (Claude-Worker)
- Testing and deploy: 1–2 hours (plus account setup time)

13. Deliverables
- projects/Panodi-Cloud-Env/rendinti-app-engine repo scaffold
- vision.md, BRD.md
- Deployment instructions and Vercel URL (once deployed)

