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
    role: "CEO & Co-founder",
    bio: "Ingeniero Civil de la UC. Antes de Ruka cofundó y lideró Etiner, Etiner Labs y Suplait, trabajando en producto, growth y construcción de negocios tecnológicos en Latinoamérica y Estados Unidos.",
    expertise: ["Producto", "Growth", "Negocios tecnológicos"],
    image: "/about/founders/camilo.webp",
    imageWidth: 600,
    imageHeight: 600,
    linkedin: "https://www.linkedin.com/in/camilo-silva-caviedes-262b2759/",
  },
  {
    name: "Enzo Zerega",
    role: "CTO & Co-founder",
    bio: "Ingeniero Civil con major y magíster en Computer Science de la UC. Programa desde los 13 años y ha construido plataformas de alta concurrencia desde los primeros días de Etiner.",
    expertise: ["Software", "Arquitectura", "Datos"],
    image: "/about/founders/enzo.webp",
    imageWidth: 1200,
    imageHeight: 1281,
    linkedin: "https://www.linkedin.com/in/enzo-crist%C3%B3bal-zerega-cruzat-303997134/",
  },
  {
    name: "Lorenzo Verdugo",
    role: "CGO & Co-founder",
    bio: "Ingeniero Civil Industrial UDD con formación en innovación vinculada a Stanford Technology Ventures Program. Ha liderado operaciones y growth desde Etiner hasta Ruka.",
    expertise: ["Growth", "Operaciones", "Go-to-market"],
    image: "/about/founders/lorenzo.webp",
    imageWidth: 600,
    imageHeight: 900,
    linkedin: "https://www.linkedin.com/in/lorenzo-verdugo/",
  },
  {
    name: "Benjamín Vega",
    role: "CFO & Co-founder",
    bio: "Ingeniero Civil Industrial UDD, emprendedor y parte del equipo fundador desde Etiner. Lidera finanzas, estructura y operación para que Ruka pueda crecer con disciplina.",
    expertise: ["Finanzas", "Operaciones", "Estrategia"],
    image: "/about/founders/benjamin.webp",
    imageWidth: 1200,
    imageHeight: 926,
    linkedin: "https://www.linkedin.com/in/benjamin-vega-ruiz-68936bb9/",
  },
] as const;
