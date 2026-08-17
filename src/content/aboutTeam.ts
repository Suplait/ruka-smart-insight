export type AboutPerson = {
  name: string;
  role: string;
  bio: string;
  expertise: readonly string[];
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  linkedin: string;
  type: "founder" | "team";
};

export const founders: readonly AboutPerson[] = [
  {
    name: "Camilo Silva",
    role: "CEO & Co-founder",
    bio: "Ingeniero Civil de la UC. Antes de Ruka cofundó y lideró Etiner, Etiner Labs y Suplait, trabajando en producto, growth y construcción de negocios tecnológicos en Latinoamérica y Estados Unidos.",
    expertise: ["Producto", "Growth", "Negocios tecnológicos"],
    image: "/about/founders/camilo.webp",
    imageWidth: 600,
    imageHeight: 600,
    linkedin: "https://www.linkedin.com/in/camilo-silva-caviedes-262b2759/",
    type: "founder",
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
    type: "founder",
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
    type: "founder",
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
    type: "founder",
  },
] as const;

export const currentTeam: readonly AboutPerson[] = [
  {
    name: "Jose Saad",
    role: "Software Engineer",
    bio: "Construye producto y plataforma en Ruby on Rails, llevando nuevos flujos operativos desde definición a producción.",
    expertise: ["Ruby on Rails", "Full-stack", "Producto"],
    image: "/about/team/jose.webp",
    imageWidth: 800,
    imageHeight: 800,
    linkedin: "https://ve.linkedin.com/in/jose-saad-556223206/es",
    type: "team",
  },
  {
    name: "Miguel Sumoza",
    role: "Software Engineer",
    bio: "Trabaja en la plataforma de Ruka y en las integraciones que convierten reglas operativas en software confiable.",
    expertise: ["Ruby on Rails", "Integraciones", "Plataforma"],
    image: "/about/team/miguel.webp",
    imageWidth: 640,
    imageHeight: 640,
    linkedin: "https://es.linkedin.com/in/miguelanggelo-sumoza-hurtado-2935861b8",
    type: "team",
  },
  {
    name: "Justine Annai Carrillo Ureñas",
    role: "Operations Engineer",
    bio: "Forma parte del equipo de operaciones de Ruka, cerca de los procesos que el producto pone a trabajar cada día.",
    expertise: ["Operaciones", "Procesos", "Implementación"],
    linkedin: "https://cl.linkedin.com/in/justine-annai-carrillo-ure%C3%B1as-62527a222",
    type: "team",
  },
] as const;

export const teamVerification = {
  founders: "Perfiles públicos del data room de Ruka (septiembre de 2025), historia pública de Ruka y LinkedIn enlazado desde cada perfil.",
  jose: "Roster de Ruka, perfil público de LinkedIn y actividad reciente en el repositorio principal de Ruka durante 2026.",
  miguel: "Roster de Ruka, perfil público de LinkedIn y actividad reciente en el repositorio principal de Ruka durante 2026.",
  justine: "Perfil público de LinkedIn que indica Operations Engineer en Ruka.ai desde agosto de 2025.",
} as const;
