import { handleCalendlyWebhook } from "./handler.ts";

Deno.serve(handleCalendlyWebhook);
