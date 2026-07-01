alter table public.profiles enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.prayer_request_reports enable row level security;
alter table public.events enable row level security;
alter table public.devotionals enable row level security;
alter table public.sermon_notes enable row level security;
alter table public.saved_verses enable row level security;
alter table public.testimonies enable row level security;
alter table public.membership_requests enable row level security;
alter table public.private_community_posts enable row level security;
alter table public.statement_of_faith_sections enable row level security;
alter table public.notification_preferences enable row level security;

create policy "profiles own read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles own update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = 'user');
create policy "admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "public approved prayer" on public.prayer_requests for select using (status='published');
create policy "users own prayer" on public.prayer_requests for select using (user_id=auth.uid());
create policy "users create pending prayer" on public.prayer_requests for insert with check (user_id=auth.uid() and status in ('pending_review','draft'));
create policy "admins manage prayer" on public.prayer_requests for all using (public.is_admin()) with check (public.is_admin());
create policy "users report prayer" on public.prayer_request_reports for insert with check (reporter_id=auth.uid());
create policy "admins manage reports" on public.prayer_request_reports for all using (public.is_admin()) with check (public.is_admin());

create policy "public events" on public.events for select using (status='published' and visibility='public');
create policy "member events" on public.events for select using (status='published' and visibility='members' and public.is_approved_member());
create policy "admins manage events" on public.events for all using (public.is_admin()) with check (public.is_admin());

create policy "public devotionals" on public.devotionals for select using (status='published');
create policy "admins manage devotionals" on public.devotionals for all using (public.is_admin()) with check (public.is_admin());

create policy "users manage own notes" on public.sermon_notes for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "users manage own saved verses" on public.saved_verses for all using (user_id=auth.uid()) with check (user_id=auth.uid());

create policy "public testimonies" on public.testimonies for select using (status='published');
create policy "users own testimonies" on public.testimonies for select using (user_id=auth.uid());
create policy "users create pending testimony" on public.testimonies for insert with check (user_id=auth.uid() and status='pending_review');
create policy "admins manage testimonies" on public.testimonies for all using (public.is_admin()) with check (public.is_admin());

create policy "users own membership request" on public.membership_requests for select using (user_id=auth.uid());
create policy "users request membership" on public.membership_requests for insert with check (user_id=auth.uid() and status='pending_review');
create policy "admins manage membership" on public.membership_requests for all using (public.is_admin()) with check (public.is_admin());

create policy "members read private posts" on public.private_community_posts for select using (status='published' and public.is_approved_member());
create policy "admins manage private posts" on public.private_community_posts for all using (public.is_admin()) with check (public.is_admin());

create policy "public faith sections" on public.statement_of_faith_sections for select using (status='published');
create policy "admins manage faith sections" on public.statement_of_faith_sections for all using (public.is_admin()) with check (public.is_admin());
create policy "users own notifications" on public.notification_preferences for all using (user_id=auth.uid()) with check (user_id=auth.uid());
