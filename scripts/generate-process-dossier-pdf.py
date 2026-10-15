"""Render the dossier's prerendered HTML into a reviewable, static PDF.

Run after npm run build. Requires reportlab, lxml and pypdf (Codex PDF runtime).
No browser automation, credentials, network access or invented content.
"""
from pathlib import Path
from html import escape
import hashlib
import json
import re
import os

from lxml import html
from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output/pdf/registrar-compras-toteat.pdf"
SOURCE = ROOT / "dist/procesos/registrar-compras-toteat/index.html"
URL = "https://www.ruka.ai/procesos/registrar-compras-toteat"
INK, MUTED, BLUE, LINE = map(colors.HexColor, ["#171827", "#505b70", "#424ec0", "#dce2ed"])
WIDTH = A4[0] - 96
FONT_DIR = Path(os.environ.get("RUKA_PDF_FONT_DIR", "/System/Library/Fonts/Supplemental"))
pdfmetrics.registerFont(TTFont("Dossier", str(FONT_DIR / "Arial.ttf")))
pdfmetrics.registerFont(TTFont("DossierBold", str(FONT_DIR / "Arial Bold.ttf")))
styles = {
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.5, leading=15.5, textColor=MUTED, spaceAfter=9),
    "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=29, leading=32, textColor=INK, spaceAfter=16, keepWithNext=True),
    "h2": ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=23, leading=27, textColor=INK, spaceAfter=15, keepWithNext=True),
    "h3": ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=11, leading=15, textColor=INK, spaceBefore=6, spaceAfter=6, keepWithNext=True),
    "eyebrow": ParagraphStyle("eyebrow", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=BLUE, spaceBefore=10, spaceAfter=9, keepWithNext=True),
    "caption": ParagraphStyle("caption", fontName="Helvetica", fontSize=8.5, leading=12, textColor=MUTED, spaceAfter=13),
}
for style in styles.values():
    style.fontName = "DossierBold" if style.fontName.endswith("Bold") else "Dossier"


class LinkedImage(Image):
    def draw(self):
        super().draw()
        self.canv.linkURL("https://www.ruka.ai/assets/process-evidence/recepcion-demo.jpg",
                          (0, 0, self.drawWidth, self.drawHeight), relative=1)


def clean(value):
    return re.sub(r"\s+", " ", value).strip().replace("→", "/").replace("…", "...").replace("—", "-").replace("–", "-")


def para(value, style="body"):
    return Paragraph(escape(clean(value)), styles[style])


def text(node):
    return clean(node.text_content())


def render(node):
    tag = node.tag
    if tag in ("h1", "h2", "h3"):
        return [para(text(node), tag)]
    if tag == "p":
        style = "eyebrow" if re.match(r"^0[1-5] /|^Expediente de proceso", text(node)) else "body"
        return [para(text(node), style)]
    if tag == "img":
        src = node.get("src")
        image = LinkedImage(str(ROOT / "public" / src.lstrip("/")), width=WIDTH, height=WIDTH * 315 / 840)
        return [image, Spacer(1, 8)]
    if tag == "figcaption":
        return [para(text(node), "caption")]
    if tag == "a":
        if len(node) and node[0].tag == "img":
            return render(node[0])
        href = node.get("href", "")
        if href.startswith("/"):
            href = "https://www.ruka.ai" + href
        return [Paragraph(f'<a href="{escape(href, quote=True)}" color="#424ec0">{escape(text(node))}</a>', styles["body"])]
    if tag == "dl":
        rows = []
        for item in node:
            terms = item.xpath("./dt")
            if not terms:
                continue
            detail = item.xpath("./dd")
            rows.append([para(text(terms[0]), "h3"), [para(text(value)) for value in detail]])
        table = Table(rows, colWidths=[156, WIDTH - 156], hAlign="LEFT")
        table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (0, -1), 18),
            ("TOPPADDING", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ("LINEBELOW", (0, 0), (-1, -1), .5, LINE),
        ]))
        return [table, Spacer(1, 12)]
    if tag == "li" and not node.xpath("./h3"):
        return [para("• " + text(node))]
    result = []
    for child in node:
        result.extend(render(child))
    return result


def chrome(canvas, doc):
    canvas.saveState()
    canvas.drawImage(str(ROOT / "public/logo.png"), 48, A4[1] - 48, width=86, height=20, preserveAspectRatio=True, mask="auto")
    canvas.setFont("Dossier", 8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(A4[0] - 48, A4[1] - 41, "EXPEDIENTE DE PROCESO / COMPRAS Y TOTEAT")
    canvas.setStrokeColor(LINE)
    canvas.line(48, 47, A4[0] - 48, 47)
    canvas.setFont("Dossier", 7)
    canvas.drawString(48, 33, "ruka.ai/procesos/registrar-compras-toteat")
    canvas.linkURL(URL, (48, 29, 330, 43), relative=0)
    canvas.drawRightString(A4[0] - 48, 33, f"{doc.page} / 5")
    canvas.restoreState()


def main():
    assert SOURCE.stat().st_mtime >= (ROOT / "src/pages/PurchaseProcessDossier.tsx").stat().st_mtime, "Run npm run build before rendering the PDF"
    tree = html.fromstring(SOURCE.read_text())
    main_node = tree.get_element_by_id("dossier-main")
    # Strip web-only actions and screen-reader placeholder answers, not evidence.
    for node in list(main_node.xpath('.//*[contains(concat(" ", normalize-space(@class), " "), " dossier-screen ") or contains(concat(" ", normalize-space(@class), " "), " sr-only ") or contains(concat(" ", normalize-space(@class), " "), " dossier-print-url ")]')):
        if node.getparent() is not None:
            node.getparent().remove(node)
    sections = main_node.xpath("./section")
    assert len(sections) == 5, "Review PDF layout when dossier structure changes"
    story = render(main_node.xpath("./header")[0])
    story.append(Spacer(1, 10))
    for index, section in enumerate(sections):
        if index:
            story.append(PageBreak())
        if index == 4:
            # The decision page has genuine writing room, no prefilled answers.
            for node in section.xpath(".//p | .//h2 | .//dl"):
                if node.tag == "dl":
                    labels = [text(node) for node in node.xpath(".//dt")]
                    assert len(labels) == 8
                    rows = [[para(labels[i], "h3"), para(labels[i + 1], "h3")] for i in range(0, 8, 2)]
                    table = Table(rows, colWidths=[WIDTH / 2, WIDTH / 2], rowHeights=[85] * 4)
                    table.setStyle(TableStyle([
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 0),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 20),
                        ("TOPPADDING", (0, 0), (-1, -1), 12),
                        ("LINEBELOW", (0, 0), (-1, -1), .5, LINE),
                    ]))
                    story.extend([table, Spacer(1, 22)])
                else:
                    story.extend(render(node))
        else:
            story.extend(render(section))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=48, rightMargin=48,
                            topMargin=73, bottomMargin=65, title="Registrar compras en Toteat - Expediente de proceso",
                            author="Ruka.ai", subject="Alcance, evidencia y hoja de decisión. Prueba externa pendiente.")
    doc.build(story, onFirstPage=chrome, onLaterPages=chrome)
    pages = PdfReader(OUTPUT).pages
    assert len(pages) == 5, f"Expected five reviewed pages; got {len(pages)}. Do not publish."
    assert "La hoja de decisión" in pages[-1].extract_text()
    source_files = ["src/pages/PurchaseProcessDossier.tsx", "public/assets/process-evidence/recepcion-demo.jpg", "public/logo.png", "scripts/generate-process-dossier-pdf.py"]
    manifest = {"pages": len(pages), "sources": {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in source_files},
                "pdfSha256": hashlib.sha256(OUTPUT.read_bytes()).hexdigest()}
    (OUTPUT.with_suffix(".json")).write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Generated {OUTPUT}; {len(pages)} pages. Visual inspection required before copying to public.")


if __name__ == "__main__":
    main()
