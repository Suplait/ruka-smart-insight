import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SupplierRutCheck } from "@/components/suppliers/SupplierRutCheck";
import {
  SupplierActivities,
  SupplierQuestions,
  SupplierSources,
} from "@/components/suppliers/SupplierDetails";
import { SupplierPurchaseReview } from "@/components/suppliers/SupplierPurchaseReview";
import {
  SupplierCopy,
  SupplierDownload,
} from "@/components/suppliers/SupplierActions";
import {
  compareSupplierRut,
  supplierCsv,
  supplierRecordRows,
  supplierInquiry,
  sourceCaption,
} from "@/utils/supplierWorkspace";
import records from "../../config/supplier-profiles.json";
const company = records.find((p) => p.slug === "agrosuper")!;
const many = records.find((p) => p.slug === "cencosud-retail-s-a-81201000k")!;
const show = (child: React.ReactNode) =>
  render(<MemoryRouter>{child}</MemoryRouter>);
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("supplier workspace / reliable data", () => {
  it.each(["79.984.240-8", "799842408", " 79984240-8 "])(
    "compares equivalent public RUT %s",
    (value) => expect(compareSupplierRut(value, company.rut)).toBe("match"),
  );
  it("accepts lowercase K without inventing validation of the invoice", () =>
    expect(compareSupplierRut("81201000-k", many.rut)).toBe("match"));
  it.each(["hello", "79.984.240-9", "1", "79984240<script>8"])(
    "rejects invalid RUT %s",
    (value) => expect(compareSupplierRut(value, company.rut)).toBe("invalid"),
  );
  it("distinguishes missing input and a different valid company", () => {
    expect(compareSupplierRut(" ", company.rut)).toBe("empty");
    expect(compareSupplierRut(many.rut, company.rut)).toBe("different");
  });
  it("preserves every source and activity in export", () => {
    const rows = supplierRecordRows(many);
    many.sources.forEach((source) =>
      expect(rows.some((r) => r.includes(source.url))).toBe(true),
    );
    many.registry.activities.forEach((a) =>
      expect(rows.some((r) => r[0] === `Actividad ${a.code}`)).toBe(true),
    );
    expect(rows.some((r) => r[2].includes("Año comercial 2024"))).toBe(true);
  });
  it("exports zero employees rather than treating zero as absent", () => {
    const profile = records.find((p) => p.registry?.annual?.employees === 0)!;
    expect(
      supplierRecordRows(profile).find(
        (r) => r[0] === "Trabajadores informados",
      )?.[1],
    ).toBe("0");
  });
  it("omits absent records rather than filling fictional data", () => {
    const rows = supplierRecordRows({
      ...company,
      registry: undefined,
      channel: null,
      website: null,
    });
    expect(rows.some((r) => r[0] === "Canal oficial")).toBe(false);
    expect(rows.some((r) => r[0] === "Trabajadores informados")).toBe(false);
  });
  it("quotes CSV delimiters, multiline data and formulas", () => {
    const csv = supplierCsv([
      ["=SUM(1)", 'Dato "a";b', "línea\notra", 0, " +cmd"],
    ]);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain('"\'=SUM(1)"');
    expect(csv).toContain('"Dato ""a"";b"');
    expect(csv).toContain('"línea\notra"');
    expect(csv).toContain('"0"');
    expect(csv).toContain('"\' +cmd"');
  });
  it("identifies source download formats without exposing implementation logs", () => {
    expect(sourceCaption("https://www.sii.cl/a.zip?x=1")).toEqual({
      host: "sii.cl",
      format: "Archivo ZIP",
    });
    expect(sourceCaption("https://example.com/a.pdf").format).toBe(
      "Documento PDF",
    );
    expect(sourceCaption("bad").format).toBe("Enlace");
  });
  it("drafts an inquiry instead of implying commercial terms", () => {
    const draft = supplierInquiry(company);
    expect(draft).toContain(company.legalName);
    expect(draft).toContain(company.rut);
    expect(draft).toContain("¿Me pueden confirmar");
  });
});

describe("supplier workspace / interactions", () => {
  it("compares on demand and clears stale results when edited", async () => {
    const user = userEvent.setup();
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    show(<SupplierRutCheck profile={company} />);
    await user.click(screen.getByRole("button", { name: "Comparar RUT" }));
    expect(screen.getByText(/Escribe el RUT/)).toBeTruthy();
    const field = screen.getByLabelText("RUT que aparece en tu documento");
    await user.type(field, "799842408");
    expect(screen.queryByText(/El RUT coincide/)).toBeNull();
    await user.click(screen.getByRole("button", { name: "Comparar RUT" }));
    expect(screen.getByText(/El RUT coincide/)).toBeTruthy();
    expect(screen.getByText(/no valida la factura/)).toBeTruthy();
    await user.type(field, "9");
    expect(screen.queryByText(/El RUT coincide/)).toBeNull();
    await user.click(screen.getByRole("button", { name: "Comparar RUT" }));
    expect(field.getAttribute("aria-invalid")).toBe("true");
    await user.click(screen.getByRole("button", { name: "Limpiar RUT" }));
    expect((field as HTMLInputElement).value).toBe("");
    expect(document.activeElement).toBe(field);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("offers a directory search only for another valid RUT", async () => {
    const user = userEvent.setup();
    show(<SupplierRutCheck profile={company} />);
    await user.type(
      screen.getByLabelText("RUT que aparece en tu documento"),
      many.rut,
    );
    await user.click(screen.getByRole("button", { name: "Comparar RUT" }));
    expect(
      screen
        .getByRole("link", { name: "Buscar ese RUT en el directorio" })
        .getAttribute("href"),
    ).toBe(`/proveedores?q=${encodeURIComponent(many.rut)}`);
  });
  it("searches activity codes, handles empty results and recovers", async () => {
    const user = userEvent.setup();
    show(<SupplierActivities profile={many} />);
    const input = screen.getByLabelText("Buscar actividad o código");
    await user.type(input, many.registry.activities[0].code);
    expect(
      screen.getByText(`1 de ${many.registry.activities.length} actividades`),
    ).toBeTruthy();
    await user.clear(input);
    await user.type(input, "no-existe-zz");
    expect(screen.getByText(/No hay actividades/)).toBeTruthy();
    await user.click(
      screen.getByRole("button", { name: "Limpiar búsqueda de actividades" }),
    );
    expect((input as HTMLInputElement).value).toBe("");
  });
  it("sorts activity dates while retaining all records", async () => {
    const user = userEvent.setup();
    const { container } = show(<SupplierActivities profile={many} />);
    await user.selectOptions(screen.getByLabelText("Ordenar por"), "date");
    expect(container.querySelectorAll("li").length).toBe(
      many.registry.activities.length,
    );
    const dates = Array.from(container.querySelectorAll("li time")).map((n) =>
      n.getAttribute("datetime"),
    );
    expect(dates).toEqual([...dates].sort().reverse());
  });
  it("filters FAQs with accent-insensitive matching and an empty-state reset", async () => {
    const user = userEvent.setup();
    show(<SupplierQuestions profile={company} />);
    const input = screen.getByLabelText("Busca una respuesta en esta ficha");
    await user.type(input, "xyz987");
    expect(screen.getByText("No encontramos esa respuesta aquí.")).toBeTruthy();
    await user.click(
      screen.getByRole("button", { name: "Ver todas las preguntas" }),
    );
    await user.type(input, "razon");
    expect(screen.getByText("¿Cuál es el RUT de Agrosuper?")).toBeTruthy();
  });
  it("filters sources without changing source URLs and pre-fills correction safely", async () => {
    const user = userEvent.setup();
    show(<SupplierSources profile={company} />);
    await user.click(
      within(screen.getByRole("group", { name: "Filtrar fuentes" })).getByRole(
        "button",
        { name: "Identificación" },
      ),
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(
      company.sources.filter((s) => s.supports === "identity").length,
    );
    await user.click(screen.getByRole("button", { name: "Todas las fuentes" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(
      company.sources.length,
    );
    const correction = screen
      .getByRole("link", { name: "Solicitar una corrección" })
      .getAttribute("href")!;
    expect(decodeURIComponent(correction)).toContain(company.rut);
    expect(decodeURIComponent(correction)).toContain(
      "No adjuntar facturas ni datos bancarios",
    );
  });
  it("filters pending checks, copies their actual status and undoes a reset", async () => {
    const user = userEvent.setup();
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    show(<SupplierPurchaseReview profile={company} />);
    await user.click(
      screen.getByRole("checkbox", {
        name: `Revisado: ${company.checks[0].title}`,
      }),
    );
    await user.click(screen.getByRole("button", { name: "Solo pendientes" }));
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    await user.click(
      screen.getByRole("button", { name: "Copiar mi revisión" }),
    );
    expect(copy.mock.calls[0][0]).toContain(
      `Revisado: ${company.checks[0].title}`,
    );
    expect(copy.mock.calls[0][0]).toContain(
      `Pendiente: ${company.checks[1].title}`,
    );
    await user.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(screen.getByText("0 de 3 revisados")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Deshacer reinicio" }));
    expect(screen.getByText("1 de 3 revisados")).toBeTruthy();
  });
  it("states that completing a checklist does not authorize payment", async () => {
    const user = userEvent.setup();
    show(<SupplierPurchaseReview profile={company} />);
    for (const c of screen.getAllByRole("checkbox")) await user.click(c);
    expect(screen.getByText(/Marcaste todos los puntos/)).toBeTruthy();
    expect(screen.getByText(/esto no valida al proveedor/)).toBeTruthy();
  });
  it("provides selectable fallback on clipboard failure and invalidates copied state", async () => {
    const user = userEvent.setup();
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    const view = render(<SupplierCopy label="Copiar dato" text="A" />);
    await user.click(screen.getByRole("button"));
    view.rerender(<SupplierCopy label="Copiar dato" text="B" />);
    expect(screen.queryByText("Copiado")).toBeNull();
    copy.mockRejectedValue(new Error("denied"));
    await user.click(screen.getByRole("button"));
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe(
      "B",
    );
  });
  it("recovers gracefully when creating a download fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("URL", {
      createObjectURL: () => {
        throw new Error("unavailable");
      },
    });
    render(<SupplierDownload rows={[["a"]]} filename="ficha.csv" />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("alert").textContent).toContain(
      "Puedes copiar los datos",
    );
  });
});
