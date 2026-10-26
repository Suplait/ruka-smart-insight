/** Server-side examples for the Ruka customer API. Never put an API key in browser code. */
const origin = "https://api.rukafactura.cl";

export async function requestPurchaseData(path, query, { token, fetchImpl = fetch, signal } = {}) {
  if (!["/api/v1/reports/purchase_lines", "/api/v1/reports/purchase_book"].includes(path)) throw new Error("Unsupported read-only route");
  if (typeof token !== "string" || !token.trim()) throw new Error("RUKA_API_KEY is required");
  const url = new URL(path, origin);
  for (const [key, value] of Object.entries(query)) if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  const timeout = AbortSignal.timeout(30_000);
  const response = await fetchImpl(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, redirect: "error", signal: signal ? AbortSignal.any([signal, timeout]) : timeout });
  if (!response.ok) {
    const error = new Error(`Ruka returned HTTP ${response.status}. Check access, filters or retry later; no checkpoint was advanced.`);
    error.status = response.status;
    error.retryAfter = response.headers.get("retry-after");
    throw error;
  }
  const result = await response.json();
  if (!Array.isArray(result.data) || !result.meta || typeof result.meta !== "object") throw new Error("Unexpected response shape");
  return result;
}

/** Consume each page before requesting the next. Persist a checkpoint only after saving its data. */
export async function* purchaseLinePages(filters, options) {
  const query = { ...filters, page: 1, per_page: 100 };
  for (let page = 1; page <= 10_000; page += 1) {
    const result = await requestPurchaseData("/api/v1/reports/purchase_lines", { ...query, page }, options);
    const totalPages = result.meta.total_pages;
    if (!Number.isInteger(totalPages) || totalPages < 0 || !Number.isInteger(result.meta.page) || result.meta.page !== page) throw new Error("Invalid page metadata");
    yield result;
    if (page >= totalPages) return;
  }
  throw new Error("Page safety limit reached: split the date window; the export is incomplete");
}

/** The purchase book uses a cursor, not page numbers. Re-run overlapping date windows to reconcile changes. */
export async function* purchaseBookPages(filters, options) {
  const query = { ...filters, per_page: 100 };
  delete query.after_id;
  let afterId;
  for (let page = 0; page < 10_000; page += 1) {
    const result = await requestPurchaseData("/api/v1/reports/purchase_book", { ...query, after_id: afterId }, options);
    const next = result.meta.next_after_id;
    if (next !== null && (!Number.isSafeInteger(next) || next <= (afterId ?? 0))) throw new Error("Invalid or repeated cursor");
    yield result;
    if (next === null) return;
    afterId = next;
  }
  throw new Error("Cursor safety limit reached: split the date window; the export is incomplete");
}
