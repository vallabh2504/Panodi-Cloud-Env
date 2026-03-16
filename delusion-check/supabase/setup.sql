-- ============================================================
-- DelusionCheck.ai — Supabase Setup SQL
-- Run this in your Supabase project's SQL Editor
-- ============================================================

-- 1. Create the roasts table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.roasts (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dream       TEXT        NOT NULL,
  reality     TEXT        NOT NULL,
  score       INTEGER     NOT NULL CHECK (score >= 0 AND score <= 100),
  roast       TEXT        NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.roasts ENABLE ROW LEVEL SECURITY;

-- 3. Drop old policies if they exist (idempotent re-run safe)
DROP POLICY IF EXISTS "Users can insert own roasts"  ON public.roasts;
DROP POLICY IF EXISTS "Users can select own roasts"  ON public.roasts;
DROP POLICY IF EXISTS "Users can delete own roasts"  ON public.roasts;

-- 4. INSERT policy — authenticated users can only insert rows for themselves
CREATE POLICY "Users can insert own roasts"
  ON public.roasts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 5. SELECT policy — authenticated users can only read their own rows
CREATE POLICY "Users can select own roasts"
  ON public.roasts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. DELETE policy — users can delete their own rows (optional but good practice)
CREATE POLICY "Users can delete own roasts"
  ON public.roasts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS roasts_user_id_idx ON public.roasts (user_id, created_at DESC);
