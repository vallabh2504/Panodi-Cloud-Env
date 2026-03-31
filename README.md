# Rendinti App Engine Starter

Next.js 14 (App Router) TypeScript starter with Tailwind CSS, Prisma, and NextAuth.

## Features
- Next.js 14 App Router
- TypeScript & Tailwind CSS
- Prisma ORM (Postgres ready)
- NextAuth Magic Link Authentication
- Recipe & Meal Plan Models
- Admin Recipe CRUD (In-progress)
- GitHub Actions CI/CD
- Vercel Deployment ready

## Local Setup

1. **Clone & Install:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL`: Postgres connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: `http://localhost:3000`
   - `EMAIL_SERVER`: SMTP server
   - `EMAIL_FROM`: Sender email

3. **Database Migration:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Dev Server:**
   ```bash
   npm run dev
   ```

## Vercel Deployment Plan

1. **GitHub Connection:**
   - Link this repository to your Vercel account.
2. **Environment Variables on Vercel:**
   - Add `DATABASE_URL` (Supabase, Vercel Postgres, or similar).
   - Add `NEXTAUTH_SECRET`.
   - Add `NEXTAUTH_URL` (your production URL).
   - Add `EMAIL_SERVER` & `EMAIL_FROM`.
3. **Deployment:**
   - Push to `main` branch; the GitHub Action and Vercel's automatic build will handle the rest.

## Changelog
- Initialize Next.js 14 project.
- Configure Prisma with Recipe and MealPlan models.
- Setup NextAuth with Email provider.
- Add vercel.json and GitHub Actions.
- Prepare project structure (app router).
