CREATE OR REPLACE FUNCTION public.expire_member_subscriptions()
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  expired_count integer;
BEGIN
  UPDATE public.member_subscriptions
  SET
    status = 'expired',
    updated_at = now()
  WHERE status = 'active'
    AND end_date < CURRENT_DATE;

  GET DIAGNOSTICS expired_count = ROW_COUNT;

  RETURN expired_count;
END;
$$;