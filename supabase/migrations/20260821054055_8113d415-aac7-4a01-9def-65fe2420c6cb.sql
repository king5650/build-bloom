CREATE OR REPLACE FUNCTION public.next_order_reference()
RETURNS TEXT
LANGUAGE sql
VOLATILE
SET search_path = public
AS $$
  SELECT 'AS-' || to_char(now(), 'YYYY') || '-'
    || lpad(nextval('public.order_reference_seq')::text, 4, '0') || '-'
    || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
$$;

DELETE FROM public.orders WHERE reference = 'AS-2026-0001';