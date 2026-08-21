-- Run once in Supabase SQL Editor.
-- These compatibility columns preserve the fields used by the existing ASRT admin UI.
alter table public.teams add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.communications add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.replies add column if not exists metadata jsonb not null default '{}'::jsonb;

-- Create a public bucket for website uploads used by product/blog content.
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do update set public = true;

do $$
begin
	if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public uploads are readable') then
		create policy "Public uploads are readable" on storage.objects for select using (bucket_id = 'uploads');
	end if;
	if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Server uploads are writable') then
		create policy "Server uploads are writable" on storage.objects for insert with check (bucket_id = 'uploads');
	end if;
end $$;
