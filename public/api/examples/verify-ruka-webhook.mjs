import { createHmac, timingSafeEqual } from "node:crypto";

/** Verify the exact bytes BEFORE parsing JSON. This does not deduplicate or persist the delivery. */
export function verifyRukaWebhook({ rawBody, timestamp, signature, secret, nowSeconds = Math.floor(Date.now() / 1000) }) {
  if (!Buffer.isBuffer(rawBody) || typeof secret !== "string" || !secret.length) return false;
  if (typeof timestamp !== "string" || !/^\d{1,12}$/.test(timestamp) || !Number.isSafeInteger(nowSeconds)) return false;
  if (Math.abs(nowSeconds - Number(timestamp)) > 300) return false;
  if (typeof signature !== "string" || !/^sha256=[a-f0-9]{64}$/.test(signature)) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.`).update(rawBody).digest();
  return timingSafeEqual(expected, Buffer.from(signature.slice(7), "hex"));
}
