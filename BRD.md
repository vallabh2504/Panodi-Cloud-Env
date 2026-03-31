Rendinti App Engine — BRD (Business Requirements Document)

Project overview
Build a minimal viable Rendinti App Engine focused on food & recipe creators. Deliver a Next.js starter app with core features, CI-ready repo, and deployment instructions for Vercel. Optionally automate deployment if Vercel credentials are provided.

Objectives
- Deliver a working Next.js starter app that showcases: recipes (CRUD), meal planner calendar, user auth (email+magic link), comments, and admin CMS for content.
- Provide clear developer README, env sample, and Vercel deploy button/instructions.
- Prepare CI/Git workflow that can auto-deploy to Vercel on push to main.

Functional requirements
1. Data models: Recipe {title, ingredients, steps, images, tags, owner}, MealPlan {date, recipeIds, notes}, User.
2. Auth: Email magic link using NextAuth or Clerk (configurable).
3. CMS: Simple admin pages to create/edit recipes (protected behind auth).
4. Public pages: Browse recipes, view recipe details, add to meal plan, comment.
5. API: Serverless endpoints for CRUD operations and comments.
6. Payments (optional): Stripe integration placeholder for paid content.
7. Deployment: Vercel-ready with vercel.json and env example.

Non-functional requirements
- Use Next.js 14 app-router, TypeScript, Tailwind CSS.
- Tests: basic unit/smoke tests for API routes.
- Code quality: ESLint, Prettier, Husky pre-commit linting.
- Repo: commit history and clear branching strategy.

MVP scope (Phase 1)
- Implement models, public recipe listing/detail, auth, admin recipe CRUD, meal planner add/remove, comments.
- No payments in Phase 1; keep placeholder hooks.

Deliverables
- Git repo under projects/Panodi-Cloud-Env/rendinti-app-engine with full source
- README with local setup and Vercel deploy instructions
- vercel.json and GitHub Actions workflow for CI
- Optional: a deploy to Vercel if credentials given; otherwise instructions

Timeline (estimates)
- Design & spec: 4 hours (done)
- Implementation (claude-worker): 1-2 days
- Testing & polish: 0.5 day
- Vercel deployment: minutes after credentials provided

Dependencies & notes
- Vercel account + token or ability to connect repo
- Optional: Stripe keys for payments

Acceptance criteria
- Starter app runs locally with npm run dev
- Admin can create a recipe and it appears on public listing
- README includes steps to deploy to Vercel

Who to notify
- Boss Garu (Vallabh) — final deployed URL or instructions to deploy if credentials withheld
