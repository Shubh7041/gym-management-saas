CREATE OR REPLACE FUNCTION public.check_subscription_overlap(
  p_member_id uuid,
  p_start_date date,
  p_end_date date,
  p_exclude_subscription_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.member_subscriptions
    WHERE member_id = p_member_id
      AND status = 'active'
      AND (
        p_exclude_subscription_id IS NULL
        OR id <> p_exclude_subscription_id
      )
      AND start_date <= p_end_date
      AND end_date >= p_start_date
  );
$$;