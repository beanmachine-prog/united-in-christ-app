-- Security hardening found during senior review.
-- 1) Create a safe profile row automatically on signup.
-- 2) Prevent normal users from granting themselves admin/member access.
-- 3) Limit public column exposure for approved community content.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, first_name, role, is_approved_member)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    'user',
    false
  )
  on conflict (id) do nothing;
  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update"
on public.profiles
for update
using (id = auth.uid() and role = 'user' and is_approved_member = false)
with check (id = auth.uid() and role = 'user' and is_approved_member = false);

-- Remove broad table grants, then grant only safe public columns.
-- RLS still decides which rows are visible; these grants prevent exposing user_id/private metadata on public reads.
revoke all on public.profiles from anon, authenticated;
revoke all on public.prayer_requests from anon, authenticated;
revoke all on public.testimonies from anon, authenticated;
revoke all on public.events from anon, authenticated;
revoke all on public.devotionals from anon, authenticated;
revoke all on public.private_community_posts from anon, authenticated;

grant select (id, display_name, first_name, role, is_approved_member) on public.profiles to authenticated;

grant select (id, title, body, category, anonymous, urgent, status, created_at, updated_at) on public.prayer_requests to anon, authenticated;
grant insert (user_id, title, body, category, anonymous, urgent, status) on public.prayer_requests to authenticated;
grant update (title, body, category, anonymous, urgent, status, updated_at) on public.prayer_requests to authenticated;
grant delete on public.prayer_requests to authenticated;

grant select (id, title, body, anonymous, status, created_at, updated_at) on public.testimonies to anon, authenticated;
grant insert (user_id, title, body, anonymous, status) on public.testimonies to authenticated;
grant update (title, body, anonymous, status, updated_at) on public.testimonies to authenticated;
grant delete on public.testimonies to authenticated;

grant select (id, title, event_date, event_time, location, description, visibility, status, created_at, updated_at) on public.events to anon, authenticated;
grant select (id, title, body, scripture_reference, author, status, created_at, updated_at) on public.devotionals to anon, authenticated;
grant select (id, title, body, visibility, status, created_at, updated_at) on public.private_community_posts to authenticated;

-- Admin policies still require an authenticated admin profile before writes are accepted by RLS.
-- Column grants below permit admin workflows while RLS prevents non-admin users from using admin-only mutations.
grant insert (id, display_name, first_name, role, is_approved_member) on public.profiles to authenticated;
grant update (display_name, first_name, role, is_approved_member, updated_at) on public.profiles to authenticated;
grant delete on public.profiles to authenticated;

grant insert (title, event_date, event_time, location, description, visibility, status, created_by) on public.events to authenticated;
grant update (title, event_date, event_time, location, description, visibility, status, updated_at) on public.events to authenticated;
grant delete on public.events to authenticated;

grant insert (title, body, scripture_reference, author, status, created_by) on public.devotionals to authenticated;
grant update (title, body, scripture_reference, author, status, updated_at) on public.devotionals to authenticated;
grant delete on public.devotionals to authenticated;

grant insert (title, body, visibility, status, created_by) on public.private_community_posts to authenticated;
grant update (title, body, visibility, status, updated_at) on public.private_community_posts to authenticated;
grant delete on public.private_community_posts to authenticated;
