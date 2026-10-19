import previews from "@/content/socialPreviews.json";

export function socialPreview(path: string) {
  const preview = previews[path as keyof typeof previews];
  if (!preview) return undefined;
  return {
    image: `/og${path}.png`,
    alt: `${preview.label}: ${preview.lines.join(" ")} ${preview.detail}`,
  };
}
