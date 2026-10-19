import { founders } from "@/content/aboutFounders";

const founder = founders[0];
export const blogAuthor = {
  name: "Camilo Silva",
  role: "CEO y Founder de Ruka",
  url: "https://www.ruka.ai/about#founder-1",
  image: founder.image,
  bio: "Ingeniero Civil de la UC y fundador de Ruka. Trabaja en producto, growth y construcción de negocios tecnológicos, con foco en automatizar el trabajo operativo de las empresas.",
  linkedin: founder.linkedin,
};

export const blogAuthorSchema = {
  "@type": "Person",
  "@id": blogAuthor.url,
  name: blogAuthor.name,
  url: blogAuthor.url,
  jobTitle: blogAuthor.role,
  description: blogAuthor.bio,
  image: `https://www.ruka.ai${blogAuthor.image}`,
  sameAs: [blogAuthor.linkedin],
  worksFor: { "@id": "https://www.ruka.ai/#organization" },
};
