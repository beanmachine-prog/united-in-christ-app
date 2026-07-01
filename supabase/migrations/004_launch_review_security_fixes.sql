-- Launch review security fixes.
-- Keep RLS as the source of truth while making client grants explicit and safe.

-- Allow users to update basic profile fields without being able to change their role
-- or approved-member flag. This works even after a user becomes an approved member.
create or replace function public.can_self_update_profile(
  target_id uuid,
  target_role public.app_role,
  target_is_approved_member boolean
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select target_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = target_role
        and p.is_approved_member = target_is_approved_member
    )
$$;

drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update"
on public.profiles
for update
using (id = auth.uid())
with check (public.can_self_update_profile(id, role, is_approved_member));

-- Report submissions must remain pending for admin review.
drop policy if exists "users report prayer" on public.prayer_request_reports;
create policy "users report prayer"
on public.prayer_request_reports
for insert
with check (reporter_id = auth.uid() and status = 'pending_review');

-- Make grants explicit for tables that were not covered by earlier hardening.
-- RLS still controls row access; column grants avoid accidental public metadata exposure.
revoke all on public.prayer_request_reports from anon, authenticated;
revoke all on public.sermon_notes from anon, authenticated;
revoke all on public.saved_verses from anon, authenticated;
revoke all on public.membership_requests from anon, authenticated;
revoke all on public.statement_of_faith_sections from anon, authenticated;
revoke all on public.notification_preferences from anon, authenticated;

-- User-owned private tables.
grant select, insert, update, delete on public.sermon_notes to authenticated;
grant select, insert, update, delete on public.saved_verses to authenticated;
grant select, insert, update, delete on public.notification_preferences to authenticated;

-- Prayer reports are only created by signed-in users and managed by admins.
grant insert (prayer_request_id, reporter_id, reason, status) on public.prayer_request_reports to authenticated;
grant select, update, delete on public.prayer_request_reports to authenticated;

-- Membership requests are user-owned on read/insert and admin-managed by RLS.
grant select (id, user_id, reason, status, reviewed_by, created_at, updated_at) on public.membership_requests to authenticated;
grant insert (user_id, reason, status) on public.membership_requests to authenticated;
grant update (reason, status, reviewed_by, updated_at) on public.membership_requests to authenticated;
grant delete on public.membership_requests to authenticated;

-- Statement of faith is public when published; only admins can mutate through RLS.
grant select (id, title, body, sort_order, status, created_at, updated_at) on public.statement_of_faith_sections to anon, authenticated;
grant insert (title, body, sort_order, status, updated_by) on public.statement_of_faith_sections to authenticated;
grant update (title, body, sort_order, status, updated_by, updated_at) on public.statement_of_faith_sections to authenticated;
grant delete on public.statement_of_faith_sections to authenticated;
