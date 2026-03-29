Project: Rendinti App Engine — Genesis Run

Vision

Rendinti is a lightweight app engine that helps small restaurants and home cooks generate and publish dynamic, localized dinner menus and limited-run meal offers that convert social followers into paying customers.

Problem (summary of research)
- Many small eateries and home cooks struggle to create timely, appealing one-off menus for events, limited-quantity specials, or pop-up dinners. They lack design resources, rapid copywriting, and simple deployment to sell/payments.
- Existing solutions (full POS or marketplace platforms) are heavy, expensive, or require onboarding and fees that small operators avoid.
- There's demand for short-run promotion tools that integrate simple ordering (pre-orders), attractive menu presentation, social shareability, and low-friction payments.

Product Goals
- Enable a user to create a one-page, beautifully rendered menu for an event (name, date/time, limited-quantity items with photos, descriptions, and quantities available), publish it to a short URL, and accept payments via Stripe or link-to-pay.
- Fast authoring: templates + AI-assisted copy & pricing suggestions from ingredient-cost inputs.
- Lightweight deployment: single repo per event, Vercel-hosted static site with Next.js; optional serverless endpoints for webhooks and payments.
- Reusable engine: templates and components, plus a simple admin UI to create and manage events and view orders.

Success metrics
- Time to create & publish an event: target < 10 minutes for a new user with photos.
- Conversion rate from link click to order: target > 4% for followers with intent.
- Hosting cost: keep under $10/month for average usage.

Scope for Genesis Run (MVP)
- CLI/admin to create an event (JSON/YAML) with items and quantities.
- Static Next.js site generator that renders a single-event menu page using a template and deploys to Vercel via their Git integration or the Vercel CLI.
- Stripe checkout integration for simple pre-orders (no full POS).
- Minimal analytics: order count and revenue per event.
- Automated CI: GitHub Actions that build and deploy to Vercel on push to main.

Constraints
- No complex inventory sync; keep per-event quotas assigned at event creation.
- Payment handled via Stripe Checkout to reduce PCI scope.
- Use free-tier friendly tooling (Vercel Hobby, Postgres-free options like SQLite for initial runs) with clear upgrade paths.

Next steps
1. Build a repo scaffold in Panodi-Cloud-Env/projects/rendinti-app-engine with Next.js template, sample event, and CI/deploy scripts.
2. Create BRD.md detailing user flows, data model, API surfaces, and integration points.
3. Spawn Claude-Worker to implement the scaffold, push to the repo, set up Vercel project, and deploy (requires user credentials).
4. Provide final Vercel URL and instructions for owner to connect Stripe.

Notes
- The deploy step requires the user's Vercel account or an API token; I'll provide deployment steps and attempt to use Vercel CLI if credentials are provided by the user.
