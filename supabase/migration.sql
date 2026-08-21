-- ============================================================
-- ASRT Website — Full Supabase schema
-- Run once in Supabase SQL Editor.
-- ============================================================

-- 1. teams ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.teams (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  description text DEFAULT '',
  metadata    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. products ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text NOT NULL,
  slug        text NOT NULL UNIQUE,
  description text DEFAULT '',
  metadata    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 3. blogs ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blogs (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title            text NOT NULL,
  slug             text NOT NULL UNIQUE,
  excerpt          text DEFAULT '',
  content          text DEFAULT '',
  cover_image_url  text DEFAULT '',
  status           text DEFAULT 'published',
  metadata         jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- 4. communications ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.communications (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text DEFAULT '',
  email      text DEFAULT '',
  phone      text DEFAULT '',
  company    text DEFAULT '',
  city       text DEFAULT '',
  interest   text DEFAULT '',
  message    text DEFAULT '',
  read       boolean DEFAULT false,
  metadata   jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. replies ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.replies (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  metadata   jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. admins ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admins (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          text DEFAULT '',
  email         text NOT NULL UNIQUE,
  password_hash text DEFAULT '',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- 7. smtp_settings ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.smtp_settings (
  id                 bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  host               text DEFAULT '',
  port               integer DEFAULT 587,
  username           text DEFAULT '',
  password_encrypted text DEFAULT '',
  from_email         text DEFAULT '',
  status             text DEFAULT 'active',
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- Add metadata columns if they don't exist (for pre-existing tables)
ALTER TABLE public.teams           ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.communications ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.replies         ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Storage bucket ───────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public uploads are readable') THEN
    CREATE POLICY "Public uploads are readable" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Server uploads are writable') THEN
    CREATE POLICY "Server uploads are writable" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads');
  END IF;
END $$;
