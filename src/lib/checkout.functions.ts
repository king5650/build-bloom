import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const startSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^(237)?6\d{8}$/, "Cameroonian mobile money number expected"),
  lines: z
    .array(z.object({ id: z.string().min(1).max(60), qty: z.number().int().min(1).max(99) }))
    .min(1)
    .max(30),
});

export const startMobilePayment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => startSchema.parse(data))
  .handler(async ({ data }) => {
    const { priceOrder, collect } = await import("./campay.server");
    const { total, description } = priceOrder(data.lines);
    if (total <= 0) return { ok: false as const, error: "EMPTY_ORDER" };

    const phone = data.phone.startsWith("237") ? data.phone : `237${data.phone}`;
    try {
      const result = await collect({
        amount: total,
        phone,
        description,
        externalReference: `as-${Date.now()}`,
      });
      return { ok: true as const, total, ...result };
    } catch (error) {
      console.error("startMobilePayment failed", error);
      return { ok: false as const, error: "PROVIDER_ERROR" };
    }
  });

export const getPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ reference: z.string().trim().min(6).max(80) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { status } = await import("./campay.server");
    try {
      return { ok: true as const, ...(await status(data.reference)) };
    } catch (error) {
      console.error("getPaymentStatus failed", error);
      return { ok: false as const, error: "PROVIDER_ERROR" };
    }
  });