-- Grants for the remaining MVP tables. RLS policies above still enforce ownership,
-- admin-only moderation, and approved members-only reads.

grant select, insert, update, delete on public.sermon_notes to authenticated;
grant select, insert, delete on public.saved_verses to authenticated;
grant select, insert, update, delete on public.membership_requests to authenticated;
grant select, insert, update, delete on public.prayer_request_reports to authenticated;
grant select, insert, update on public.notification_preferences to authenticated;
grant select on public.statement_of_faith_sections to anon, authenticated;

grant usage on schema public to anon, authenticated;
