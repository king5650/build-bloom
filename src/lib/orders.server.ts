import type { OrderLine } from "./campay.server";

export type OrderRecord = {
  reference: string;
  status: string;
  total: number;
  currency: string;
  operator: string | null;
  createdAt: string;
  lines: { id: string; qty: number; name: string; price: number }[];
};

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function maskLines(raw: unknown) {
  return Array.isArray(raw)
    ? (raw as OrderRecord["lines"]).filter((l) => l && typeof l.id === "string")
    : [];
}

export async function createOrder(input: {
  phone: string;
  total: number;
  lines: (OrderLine & { name: string; price: number })[];
}) {
  const db = await admin();
  const { data: reference, error: refError } = await db.rpc("next_order_reference");
  if (refError || !reference) throw new Error("Could not issue an order reference");

  const { error } = await db.from("orders").insert({
    reference,
    phone: input.phone,
    total: input.total,
    lines: input.lines,
    status: "PENDING",
  });
  if (error) throw new Error(error.message);
  return reference;
}

export async function attachPayment(reference: string, paymentReference: string, operator: string | null) {
  const db = await admin();
  await db.from("orders").update({ payment_reference: paymentReference, operator }).eq("reference", reference);
}

export async function updateOrderStatus(reference: string, status: string, operator?: string | null) {
  const db = await admin();
  await db
    .from("orders")
    .update({ status, ...(operator ? { operator } : {}) })
    .eq("reference", reference);
}

function toRecord(row: {
  reference: string;
  status: string;
  total: number;
  currency: string;
  operator: string | null;
  created_at: string;
  lines: unknown;
}): OrderRecord {
  return {
    reference: row.reference,
    status: row.status,
    total: row.total,
    currency: row.currency,
    operator: row.operator,
    createdAt: row.created_at,
    lines: maskLines(row.lines),
  };
}

const SELECT = "reference, status, total, currency, operator, created_at, lines";

export async function findOrderByReference(reference: string): Promise<OrderRecord | null> {
  const db = await admin();
  const { data } = await db.from("orders").select(SELECT).eq("reference", reference).maybeSingle();
  return data ? toRecord(data) : null;
}

export async function findOrderForGuest(reference: string, phone: string): Promise<OrderRecord | null> {
  const db = await admin();
  const { data } = await db
    .from("orders")
    .select(SELECT)
    .eq("reference", reference.toUpperCase())
    .maybeSingle();
  if (!data) return null;
  const normalize = (v: string) => v.replace(/[^0-9]/g, "").replace(/^237/, "");
  const { data: row } = await db.from("orders").select("phone").eq("reference", data.reference).maybeSingle();
  if (!row || normalize(row.phone) !== normalize(phone)) return null;
  return toRecord(data);
}

export async function getPaymentReference(reference: string): Promise<string | null> {
  const db = await admin();
  const { data } = await db
    .from("orders")
    .select("payment_reference")
    .eq("reference", reference)
    .maybeSingle();
  return data?.payment_reference ?? null;
}
