import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const postsDirectory = path.join(projectRoot, "src", "content", "blog", "posts");
const files = (await readdir(postsDirectory)).filter((file) => file.endsWith(".json")).sort();
const failures = [];
const slugs = new Set();

const textFields = (post) => [
  post.title,
  post.excerpt,
  post.metaTitle,
  post.metaDescription,
  post.targetQuery,
  post.searchIntent,
  post.audience,
  ...(post.intro ?? []),
  ...(post.keyTakeaways ?? []),
  ...(post.sections ?? []).flatMap((section) => [
    section.title,
    ...(section.paragraphs ?? []),
    ...(section.bullets ?? []),
    section.callout ?? "",
  ]),
  ...(post.faq ?? []).flatMap((item) => [item.question, item.answer]),
  post.relatedProduct?.title,
  post.relatedProduct?.description,
].filter(Boolean);

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const file of files) {
  const sourcePath = path.join(postsDirectory, file);
  let post;
  try {
    post = JSON.parse(await readFile(sourcePath, "utf8"));
  } catch (error) {
    failures.push(`${file}: JSON inválido (${error.message})`);
    continue;
  }

  const label = `/blog/${post.slug || file}`;
  const expectedFile = `${post.slug}.json`;
  assert(file === expectedFile, `${label}: el nombre del archivo debe ser ${expectedFile}`);
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug ?? ""), `${label}: slug inválido`);
  assert(!slugs.has(post.slug), `${label}: slug duplicado`);
  slugs.add(post.slug);
  assert(post.status === "published", `${label}: status debe ser published`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(post.datePublished ?? ""), `${label}: datePublished inválido`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(post.dateModified ?? ""), `${label}: dateModified inválido`);
  assert((post.metaTitle?.length ?? 0) >= 20 && post.metaTitle.length <= 65, `${label}: metaTitle debe tener 20-65 caracteres`);
  assert((post.metaDescription?.length ?? 0) >= 90 && post.metaDescription.length <= 170, `${label}: metaDescription debe tener 90-170 caracteres`);
  assert((post.sections?.length ?? 0) >= 3, `${label}: requiere al menos 3 secciones sustantivas`);
  assert((post.faq?.length ?? 0) >= 2 && post.faq.length <= 5, `${label}: requiere 2-5 preguntas frecuentes`);
  assert((post.keyTakeaways?.length ?? 0) >= 3, `${label}: requiere al menos 3 conclusiones útiles`);
  assert((post.sources?.length ?? 0) >= 1, `${label}: requiere al menos una fuente verificable`);
  assert((post.relatedLinks?.length ?? 0) >= 1, `${label}: requiere enlaces internos relacionados`);
  assert(post.relatedProduct?.href?.startsWith("/productos/") || post.relatedProduct?.href === "/one", `${label}: el producto relacionado no es una ruta comercial válida`);

  const body = textFields(post).join(" ");
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  assert(wordCount >= 650, `${label}: contenido demasiado superficial (${wordCount} palabras, mínimo 650)`);
  assert(wordCount <= 2200, `${label}: contenido demasiado extenso (${wordCount} palabras, máximo 2200)`);
  assert(!body.includes("—"), `${label}: usa raya larga, reemplázala por puntuación natural`);
  assert(!/\b(garantizamos|garantizado|100%|nunca falla)\b/i.test(body), `${label}: contiene un claim absoluto no permitido`);

  const sectionIds = new Set();
  for (const section of post.sections ?? []) {
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id ?? ""), `${label}: id de sección inválido (${section.id})`);
    assert(!sectionIds.has(section.id), `${label}: id de sección duplicado (${section.id})`);
    sectionIds.add(section.id);
    assert((section.paragraphs?.length ?? 0) >= 2, `${label}: la sección ${section.id} necesita al menos dos párrafos`);
  }

  for (const source of post.sources ?? []) {
    let url;
    try {
      url = new URL(source.url);
    } catch {
      failures.push(`${label}: fuente inválida (${source.url})`);
      continue;
    }
    assert(url.protocol === "https:", `${label}: las fuentes deben usar HTTPS (${source.url})`);
    assert(Boolean(source.title?.trim()), `${label}: fuente sin título`);
  }

  const imageSource = post.heroImage?.src ?? "";
  assert(imageSource.startsWith("/"), `${label}: heroImage.src debe ser una ruta local absoluta`);
  assert((post.heroImage?.alt?.length ?? 0) >= 20, `${label}: heroImage.alt debe describir la imagen`);
  if (imageSource.startsWith("/")) {
    try {
      await access(path.join(projectRoot, "public", imageSource.slice(1)));
    } catch {
      failures.push(`${label}: la imagen ${imageSource} no existe en public`);
    }
  }
}

assert(files.length > 0, "El motor de blog no tiene artículos publicados");
assert([...files].length === slugs.size, "Hay slugs duplicados o inválidos");

if (failures.length) {
  console.error(`Blog validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Blog validation passed for ${files.length} post(s).`);
