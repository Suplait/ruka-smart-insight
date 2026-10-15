import { readFile } from "node:fs/promises";
import sharp from "sharp";

// Code-native brand artwork. No customer data, generated product UI or partner logos.
const logo = (await readFile(new URL("../public/logo.png", import.meta.url))).toString("base64");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f7f8fc"/>
  <image href="data:image/png;base64,${logo}" x="64" y="52" width="225" height="54" preserveAspectRatio="xMinYMid meet"/>
  <g font-family="Arial, sans-serif">
    <text x="64" y="186" font-size="21" font-weight="600" fill="#424ec0">Para consultoras de restaurantes</text>
    <g fill="#171827" font-size="70" font-weight="700" letter-spacing="-3">
      <text x="60" y="280">Tu experiencia.</text>
      <text x="60" y="360">Más alcance.</text>
    </g>
    <text x="64" y="425" font-size="26" fill="#505b70">Automatización y datos para potenciar tu asesoría.</text>
    <path d="M64 480 H1136" stroke="#dce2ed"/>
    <text x="64" y="535" font-size="22" font-weight="600" fill="#171827">Insumos maestros</text>
    <path d="M320 526 H390 M382 519 L390 526 L382 533" fill="none" stroke="#9da6bd" stroke-width="2"/>
    <text x="420" y="535" font-size="22" font-weight="600" fill="#424ec0">Costos unitarios</text>
    <path d="M609 526 H679 M671 519 L679 526 L671 533" fill="none" stroke="#9da6bd" stroke-width="2"/>
    <text x="709" y="535" font-size="22" font-weight="600" fill="#171827">API para tus dashboards</text>
  </g>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile(new URL("../public/partners-og.png", import.meta.url).pathname);
