import { PRODUCTS } from "@/data/products";

export type OrderLine = { id: string; qty: number };

function baseUrl() {
  return (process.env["CAMPAY_ENV"] ?? "demo") === "live"
    ? "https://www.campay.net"
    : "https://demo.campay.net";
}

export function priceOrder(lines: OrderLine[]) {
  let total = 0;
  const labels: string[] = [];
  for (const line of lines) {
    const product = PRODUCTS.find((p) => p.id === line.id);
    if (!product) continue;
    const qty = Math.max(1, Math.min(99, Math.round(line.qty)));
    total += product.price * qty;
    labels.push(`${qty}× ${product.name.fr}`);
  }
  return { total, description: labels.join(", ").slice(0, 120) || "Commande A.S Africa" };
}

async function token() {
  const username = process.env["CAMPAY_USERNAME"];
  const password = process.env["CAMPAY_PASSWORD"];
  if (!username || !password) throw new Error("CamPay credentials are not configured");

  const res = await fetch(`${baseUrl()}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`CamPay token failed [${res.status}]: ${body}`);
    throw new Error("Payment provider unavailable");
  }
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Payment provider returned no token");
  return data.token;
}

export async function collect(input: {
  amount: number;
  phone: string;
  description: string;
  externalReference: string;
}) {
  const res = await fetch(`${baseUrl()}/api/collect/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Token ${await token()}` },
    body: JSON.stringify({
      amount: String(input.amount),
      currency: "XAF",
      from: input.phone,
      description: input.description,
      external_reference: input.externalReference,
    }),
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`CamPay collect failed [${res.status}]: ${body}`);
    throw new Error("Payment request refused by the provider");
  }
  const data = JSON.parse(body) as { reference?: string; ussd_code?: string; operator?: string };
  if (!data.reference) throw new Error("Payment provider returned no reference");
  return {
    reference: data.reference,
    ussdCode: data.ussd_code ?? null,
    operator: data.operator ?? null,
  };
}

export async function status(reference: string) {
  const res = await fetch(`${baseUrl()}/api/transaction/${encodeURIComponent(reference)}/`, {
    headers: { Authorization: `Token ${await token()}` },
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`CamPay status failed [${res.status}]: ${body}`);
    throw new Error("Could not read the payment status");
  }
  const data = JSON.parse(body) as {
    status?: string;
    reason?: string;
    amount?: number;
    operator?: string;
  };
  return {
    status: (data.status ?? "PENDING").toUpperCase(),
    reason: data.reason ?? null,
    amount: data.amount ?? null,
    operator: data.operator ?? null,
  };
}