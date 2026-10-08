import { execFileSync } from "node:child_process";

const base = process.env.ORGANIC_GROWTH_BASE_REF || "origin/main";
const commands = [
  ["diff", "--name-only", `${base}...HEAD`],
  ["diff", "--name-only"],
  ["diff", "--cached", "--name-only"],
];
const untracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split("\n").map((item) => item.trim()).filter(Boolean);
const files = [...new Set([...commands.flatMap((args) =>
  execFileSync("git", args, { encoding: "utf8" }).split("\n").map((item) => item.trim()).filter(Boolean),
), ...untracked])];

const allowed = [
  /^src\/organic-growth\//,
  /^src\/pages\/(AboutUs|Integraciones|PanelControl|CuentasPorPagar|RegistroDeCompras|ConciliacionAutomatica|Stock)\.tsx$/,
  /^src\/components\/seo\/(AboutSeo|ProductDemoVisuals|ProductLandingPage|PurchaseRegistrationTour|ProductGuidedTour)\.tsx$/,
  /^src\/content\/productPages\.ts$/,
  /^public\/(sitemap\.xml|robots\.txt|llms\.txt)$/,
  /^public\/organic-growth\//,
  /^docs\/organic-growth\//,
  /^scripts\/organic-growth\//,
];

if (process.env.ORGANIC_GROWTH_BOOTSTRAP === "true") {
  allowed.push(
    /^\.github\/workflows\/organic-growth-(execution|reporting)\.yml$/,
    /^\.gitignore$/,
    /^package(-lock)?\.json$/,
    /^supabase\/config\.toml$/,
    /^supabase\/functions\/organic-growth-api\/index\.ts$/,
    /^supabase\/migrations\/\d+_(create_organic_growth_engine|separate_organic_growth_leases|recover_expired_organic_growth_leases)\.sql$/,
  );
}

const forbidden = [
  /^src\/pages\/(LandingV2|Register|OnboardingSuccess|OneContact)\.tsx$/,
  /^src\/components\/(Navbar|Footer|Pricing)\.tsx$/,
  /^src\/components\/(onboarding|onboarding-v2|restaurant|calendly)\//,
  /^src\/components\/product\/ProductRegistrationForm\.tsx$/,
  /^src\/services\//,
  /^src\/utils\/(dataLayer|utmTracker)\.ts$/,
  /^supabase\/functions\/(notify-slack|notify-one-slack|update-lead)\//,
];

const violations = files.filter((file) => forbidden.some((pattern) => pattern.test(file)) || !allowed.some((pattern) => pattern.test(file)));
if (violations.length) {
  console.error("Organic Growth safety guard blocked protected or out-of-scope files:");
  violations.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log(`Organic Growth safety guard passed for ${files.length} changed file(s).`);
