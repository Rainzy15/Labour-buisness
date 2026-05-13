-- Supabase database linter hardening.
-- Run this after 0001_platform_schema.sql.

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- These helper functions are used internally by RLS policies/triggers and should not be callable as public RPC endpoints.
revoke execute on function public.current_profile_id() from anon, authenticated;
revoke execute on function public.current_role() from anon, authenticated;
revoke execute on function public.is_admin() from anon, authenticated;
revoke execute on function public.owns_customer(uuid) from anon, authenticated;
revoke execute on function public.employee_can_access_assignment(uuid) from anon, authenticated;
revoke execute on function public.handle_new_user() from anon, authenticated;

-- Keep trigger/function ownership behavior intact for internal database use.
grant execute on function public.touch_updated_at() to postgres;
