export type FounderProfile = {
  name: string;
  role: string;
  bio: string;
  expertise: readonly string[];
  image: string;
  imageWidth: number;
  imageHeight: number;
  linkedin: string;
};

export const founders: readonly FounderProfile[] = [
  {
    name: "Camilo Silva",
    role: "CEO · Cofundador",
    bio: "Soy Ingeniero Civil de la UC. Antes de Ruka cofundé y lideré Etiner, Etiner Labs y Suplait. He trabajado principalmente en producto, growth y construcción de negocios tecnológicos en Latinoamérica y Estados Unidos.",
    expertise: ["Producto", "Growth", "Negocios tecnológicos"],
    image: "/about/founders/camilo.webp",
    imageWidth: 600,
    imageHeight: 600,
    linkedin: "https://www.linkedin.com/in/camilo-silva-caviedes-262b2759/",
  },
  {
    name: "Enzo Zerega",
    role: "CTO · Cofundador",
    bio: "Soy Ingeniero Civil con major y magíster en Computer Science de la UC. Programo desde los 13 años y, desde los primeros días de Etiner, he construido la arquitectura y tecnología detrás de nuestros productos.",
    expertise: ["Software", "Arquitectura", "Datos"],
    image: "/about/founders/enzo.webp",
    imageWidth: 1200,
    imageHeight: 1281,
    linkedin: "https://www.linkedin.com/in/enzo-crist%C3%B3bal-zerega-cruzat-303997134/",
  },
  {
    name: "Lorenzo Verdugo",
    role: "CGO · Cofundador",
    bio: "Soy Ingeniero Civil Industrial de la UDD y también me formé en innovación en un programa vinculado a Stanford Technology Ventures Program. Desde Etiner he trabajado principalmente en operaciones y growth.",
    expertise: ["Growth", "Operaciones", "Go-to-market"],
    image: "/about/founders/lorenzo.webp",
    imageWidth: 600,
    imageHeight: 900,
    linkedin: "https://www.linkedin.com/in/lorenzo-verdugo/",
  },
  {
    name: "Benjamín Vega",
    role: "CFO · Cofundador",
    bio: "Soy Ingeniero Civil Industrial de la UDD y emprendedor. Soy parte del equipo fundador desde Etiner y, desde entonces, he trabajado principalmente en finanzas, operación y estructura.",
    expertise: ["Finanzas", "Operaciones", "Estrategia"],
    image: "/about/founders/benjamin.webp",
    imageWidth: 1200,
    imageHeight: 926,
    linkedin: "https://www.linkedin.com/in/benjamin-vega-ruiz-68936bb9/",
  },
] as const;
