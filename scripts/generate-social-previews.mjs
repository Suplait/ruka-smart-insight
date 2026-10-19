import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const escape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");

export async function generateSocialPreviews(root) {
  const previews = JSON.parse(await readFile(path.join(root, "src/content/socialPreviews.json"), "utf8"));
  const logo = await sharp(path.join(root, "public/logo.png")).resize({ width: 220 }).png().toBuffer();
  for (const [route, preview] of Object.entries(previews)) {
    // The official iDTECloud wordmark includes white lettering.
    const panelBackground = preview.logos?.includes("idtecloud.png") ? "#171827" : "#ffffff";
    const overlays = [{ input: logo, left: 58, top: 48 }];
    if (preview.art) {
      const art = await sharp(path.join(root, preview.art)).resize(430, 348, { fit: "contain", background: "#ffffff" }).png().toBuffer();
      overlays.push({ input: art, left: 730, top: 168 });
    } else {
      for (let i = 0; i < preview.logos.length; i++) {
        const multiple = preview.logos.length > 1;
        const art = await sharp(path.join(root, "public/integrations", preview.logos[i])).resize(multiple ? 160 : 260, 110, { fit: "contain", background: panelBackground }).png().toBuffer();
        overlays.push({ input: art, left: multiple ? 764 + (i % 2) * 192 : 810, top: multiple ? 208 + Math.floor(i / 2) * 154 : 290 });
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <rect width="1200" height="630" fill="#f7f8fc"/>
      <rect x="708" width="492" height="630" fill="${panelBackground}"/>
      <path d="M58 139 H652" stroke="#dce2ed"/>
      <g font-family="Arial,sans-serif">
        <text x="58" y="192" font-size="23" font-weight="600" fill="#424ec0">${escape(preview.label)}</text>
        ${preview.lines.map((line, i) => `<text x="55" y="${278 + i * 66}" font-size="53" letter-spacing="-1.7" font-weight="700" fill="#171827">${escape(line)}</text>`).join("")}
        <text x="58" y="489" font-size="21" fill="#505b70">${escape(preview.detail)}</text>
        <text x="58" y="572" font-size="19" font-weight="600" fill="#505b70">www.ruka.ai</text>
      </g>
    </svg>`;
    const target = path.join(root, "dist/og", route.slice(1) + ".png");
    await mkdir(path.dirname(target), { recursive: true });
    await sharp(Buffer.from(svg)).composite(overlays).png().toFile(target);
  }
  console.log(`Generated ${Object.keys(previews).length} route-specific social previews.`);
}
