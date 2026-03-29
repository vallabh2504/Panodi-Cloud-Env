# Rendinti App Engine

Next.js scaffold for Rendinti applications.

## Features

- **Next.js 14 App Router** (Tailwind CSS, TypeScript, ESLint)
- **Stripe Integration Mockups**:
  - `/api/checkout-session`: Create Stripe Checkout sessions.
  - `/api/webhooks`: Stripe Webhook handler with signature placeholder.
- **Mock Data**:
  - `/public/events.json`: Sample event listings.
  - `/public/orders.json`: Sample order history.
- **Admin Page**: Simple order management interface at `/admin`.
- **CI/CD**: GitHub Actions workflow for building and optional Vercel deployment.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Vallabh2504/Panodi-Cloud-Env.git
    cd Panodi-Cloud-Env/rendinti-app-engine
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Visit:** `http://localhost:3000` (Home) and `http://localhost:3000/admin` (Admin).

## Deployment (Vercel)

### 1. Setup Vercel

1.  Go to [Vercel](https://vercel.com) and create a new project.
2.  Link your repository.
3.  Add the following Environment Variables:
    - `STRIPE_SECRET_KEY`: Your Stripe Test/Live secret key.
    - `STRIPE_WEBHOOK_SECRET`: Your Stripe Webhook secret (once configured).

### 2. GitHub Actions (Optional Auto-Deploy)

To enable automatic deployments via GitHub Actions:
1.  Go to your GitHub Repository Settings > Secrets and variables > Actions.
2.  Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.
3.  Uncomment the Vercel deploy step in `.github/workflows/deploy.yml`.

## Stripe Integration Setup

1.  Replace the mock API logic in `src/app/api/checkout-session/route.ts` with the official `stripe` package.
2.  Install Stripe: `npm install stripe`.
3.  Configure your webhook URL in the [Stripe Dashboard](https://dashboard.stripe.com/test/webhooks) pointing to `https://your-domain.com/api/webhooks`.

## Admin Page

The admin page (`/admin`) currently reads orders from `public/orders.json`. In a real application, you should move this data to a database like SQLite (via Prisma or Drizzle) or a cloud database like Convex.
