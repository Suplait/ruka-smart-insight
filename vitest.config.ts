import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    environmentOptions: { jsdom: { url: "https://www.ruka.ai/" } },
    include: ["src/__tests__/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      include: ["src/utils/leadAttribution.ts", "src/services/leadIntake.ts", "src/hooks/useCalendlyObservation.ts", "supabase/functions/_shared/*.ts"],
      thresholds: { lines: 80 },
    },
  },
});
