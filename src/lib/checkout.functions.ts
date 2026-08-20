import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^(237)?6\d{8}$/, "Cameroonian mobile money number expected");

const startSchema = z.object({
  phone: phoneSchema,
  lines: z
    .array(z.object({ id: z.string().min(1).max(60), qty: z.number().int().min(1).max(99) }))
    .min(1)
    .max(30),
});

export const startMobilePayment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => startSchema.parse(data))
  .handler(async ({ data }) => {
    const { priceOrder, collect } = await import("./campay.server");
    const orders = await import("./orders.server");
    const { total, description, items } = priceOrder(data.lines);
    if (total <= 0) return { ok: false as const, error: "EMPTY_ORDER" };

    const phone = data.phone.startsWith("237") ? data.phone : `237${data.phone}`;

    let orderReference: string;
    try {
      orderReference = await orders.createOrder({ phone, total, lines: items });
    } catch (error) {
      console.error("createOrder failed", error);
      return { ok: false as const, error: "ORDER_ERROR" };
    }

    try {
      const result = await collect({
        amount: total,
        phone,
        description,
        externalReference: orderReference,
      });
      await orders.attachPayment(orderReference, result.reference, result.operator);
      return { ok: true as const, total, orderReference, ...result };
    } catch (error) {
      console.error("startMobilePayment failed", error);
      await orders.updateOrderStatus(orderReference, "FAILED");
      return { ok: false as const, error: "PROVIDER_ERROR" };
    }
  });

export const getPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ orderReference: z.string().trim().min(4).max(40) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { status } = await import("./campay.server");
    const orders = await import("./orders.server");
    try {
      const paymentReference = await orders.getPaymentReference(data.orderReference);
      if (!paymentReference) return { ok: false as const, error: "UNKNOWN_ORDER" };
      const result = await status(paymentReference);
      const mapped =
        result.status === "SUCCESSFUL"
          ? "PAID"
          : result.status === "FAILED" || result.status === "CANCELLED"
            ? "FAILED"
            : "PENDING";
      await orders.updateOrderStatus(data.orderReference, mapped, result.operator);
      return { ok: true as const, status: mapped };
    } catch (error) {
      console.error("getPaymentStatus failed", error);
      return { ok: false as const, error: "PROVIDER_ERROR" };
    }
  });

export const getOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ reference: z.string().trim().min(4).max(40) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { findOrderByReference } = await import("./orders.server");
    const order = await findOrderByReference(data.reference.toUpperCase());
    return order ? { ok: true as const, order } : { ok: false as const, error: "NOT_FOUND" };
  });

export const lookupOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({ reference: z.string().trim().min(4).max(40), phone: phoneSchema })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { findOrderForGuest } = await import("./orders.server");
    const order = await findOrderForGuest(data.reference, data.phone);
    return order ? { ok: true as const, order } : { ok: false as const, error: "NOT_FOUND" };
  });
