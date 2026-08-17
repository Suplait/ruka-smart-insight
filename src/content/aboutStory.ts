export type StoryImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  presentation?: "photo" | "document";
};

export type StoryMetric = {
  value: string;
  label: string;
};

export type StoryChapter = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  images: readonly StoryImage[];
  metrics?: readonly StoryMetric[];
  dark?: boolean;
};

export const storyChapters: readonly StoryChapter[] = [
  {
    id: "aprender-a-construir",
    number: "01",
    eyebrow: "01 · APRENDER A CONSTRUIR",
    title: "Antes de saber construir una startup, ya estábamos construyendo una.",
    paragraphs: [
      "Camilo y Lorenzo fueron compañeros de colegio y después vivieron juntos mientras terminaban la universidad. En 2015 crearon PortSalud para facilitar la comparación de servicios médicos según el plan de salud de cada persona.",
      "Llegaron a la final de un programa universitario. No ganaron. Después se fueron de vacaciones, dejaron de trabajar en el proyecto y nunca recuperó el ritmo. Fue una primera lección, bastante literal, sobre continuidad y ejecución.",
      "Lorenzo conoció a Benja en un programa de innovación vinculado a Stanford Technology Ventures Program. Camilo acumuló experiencia temprana en una startup tecnológica, incluido trabajo en Estados Unidos. Cuando apareció una convocatoria relacionada con turismo, probaron la idea antes de construir producto: publicaron un itinerario en Facebook y recibieron cerca de 640 comentarios en una tarde.",
      "Benja conocía a Enzo, que se sumó como technical co-founder. Ahí quedó formado el equipo fundador que sigue construyendo junto hasta hoy.",
    ],
    images: [
      {
        src: "/about/story/port-salud-2015.webp",
        alt: "Camilo Silva y Lorenzo Verdugo presentando PortSalud en 2015",
        caption: "PortSalud · 2015",
        width: 432,
        height: 537,
      },
      {
        src: "/about/story/etiner-validation.webp",
        alt: "Publicación con la que el equipo validó interés por itinerarios antes de construir Etiner",
        caption: "Validar antes de construir",
        width: 948,
        height: 509,
        presentation: "document",
      },
    ],
    metrics: [{ value: "640", label: "comentarios en una tarde. Validamos interés antes de construir producto." }],
  },
  {
    id: "ir-al-problema",
    number: "02",
    eyebrow: "02 · IR AL PROBLEMA",
    title: "Si queríamos entender el problema, teníamos que vivir dentro de él.",
    paragraphs: [
      "Etiner comenzó ayudando a planificar viajes. Había interés, pero no un modelo de negocio claro. Un usuario hizo la pregunta que cambió la dirección: dónde reservar las experiencias recomendadas sin pagar el sobreprecio de una agencia ni llegar al destino a buscar operadores.",
      "El equipo tomó un avión a San Pedro de Atacama. Habló con operadores, creó acuerdos comerciales y empezó a vender. Durante cerca de cinco meses vivieron ahí. El producto inicial podía ser una Google Sheet y automatizaban conversaciones por WhatsApp cuando hacerlo todavía no era estándar.",
      "Entre 2017 y 2018 alcanzaron sus primeros US$100 mil en ventas acumuladas. Después construyeron producto propio, vivieron más de seis meses en Cusco y siguieron aprendiendo turismo desde terreno.",
      "Tras postular varias veces entraron a 500 Startups, se mudaron a México y Etiner terminó operando en cinco países. Más de 10.000 personas compraron a través del negocio.",
    ],
    images: [
      {
        src: "/about/story/etiner-founders.webp",
        alt: "Los cuatro fundadores presentando Etiner en una feria de turismo",
        caption: "Etiner · construir desde terreno",
        width: 1024,
        height: 632,
      },
      {
        src: "/about/story/etiner-latin-america.webp",
        alt: "Registro de distintos viajes y destinos durante la expansión de Etiner",
        caption: "Aprender turismo viviéndolo",
        width: 1024,
        height: 647,
        presentation: "document",
      },
    ],
    metrics: [
      { value: "US$100k", label: "primeras ventas acumuladas" },
      { value: "5", label: "países" },
      { value: "+10.000", label: "clientes" },
    ],
  },
  {
    id: "volver-a-empezar",
    number: "03",
    eyebrow: "03 · VOLVER A EMPEZAR",
    title: "Un jueves nuestras ventas llegaron a cero.",
    paragraphs: [
      "En marzo de 2020 Etiner estaba creciendo y el equipo estaba en México. La pandemia cerró el turismo, las ventas cayeron literalmente a $0 y la frontera chilena estaba por cerrar. Los fundadores volvieron a Chile con caja limitada y personas trabajando con ellos.",
      "La pregunta dejó de ser cómo hacer crecer Etiner. Pasó a ser qué sabíamos hacer para mantener al equipo andando. Pausaron Etiner y crearon Etiner Labs para aplicar su experiencia en growth, producto y tecnología a problemas de otras compañías.",
      "La operación creció hasta cerca de 20 personas y trabajó con organizaciones como P&G, Crystal Lagoons y Rappi. Con Rappi participaron durante casi dos años en la transformación del modelo de adquisición de restaurantes.",
      "Ese trabajo llegó a nueve países, redujo el costo de adquisición cerca de 87% y, en su peak, incorporó más de 10.000 restaurantes al mes. No era el negocio original, pero permitió seguir construyendo y aprender a operar tecnología a gran escala.",
    ],
    images: [
      {
        src: "/about/story/pandemic-2020.webp",
        alt: "Registro del regreso del equipo a Chile al comenzar la pandemia en 2020",
        caption: "Marzo de 2020 · volver a Chile",
        width: 951,
        height: 535,
      },
    ],
    metrics: [
      { value: "$0", label: "ventas de Etiner al comenzar la pandemia" },
      { value: "9", label: "países en la operación con Rappi" },
      { value: "−87%", label: "costo de adquisición" },
      { value: "+10.000", label: "restaurantes incorporados al mes en el peak" },
    ],
    dark: true,
  },
  {
    id: "encontrar-ruka",
    number: "04",
    eyebrow: "04 · ENCONTRAR RUKA",
    title: "Ruka apareció cuando dejamos de defender la idea que teníamos.",
    paragraphs: [
      "Etiner Labs funcionaba, pero una agencia no era la empresa que queríamos construir a largo plazo. A fines de 2022 volvimos a producto y nació Suplait, una plataforma para digitalizar sourcing y procurement en empresas medianas.",
      "Suplait reunió una red de más de 15.000 proveedores. Aun así, el negocio no crecía como esperábamos. Mientras tanto, las herramientas de IA que construíamos para categorizar compras y generar información provocaban una reacción mucho más fuerte en los usuarios.",
      "El cliente podía licitar solo una fracción de sus compras con Suplait, pero quería visibilidad sobre todas. Descartamos gran parte de lo construido, volvimos a conversar con compradores y validamos otra vez. De ahí nació Ruka.",
      "Ruka comenzó organizando información de compras. Después entendimos que ordenar los datos no eliminaba el trabajo: los equipos seguían descargando, copiando, cruzando, conciliando, actualizando y corrigiendo entre sistemas. La tesis actual apareció ahí: tu empresa ya tiene los sistemas; Ruka hace el trabajo que queda entre medio.",
    ],
    images: [
      {
        src: "/about/story/suplait-platform.webp",
        alt: "Interfaz original de Suplait para procesos de compra y proveedores",
        caption: "Suplait · volver a producto",
        width: 1024,
        height: 559,
        presentation: "document",
      },
      {
        src: "/about/story/suplait-categorization.webp",
        alt: "Herramienta de categorización de compras que ayudó a descubrir la oportunidad de Ruka",
        caption: "La señal que cambió la dirección",
        width: 999,
        height: 621,
        presentation: "document",
      },
    ],
    metrics: [{ value: "+15.000", label: "proveedores reunidos en la red de Suplait" }],
  },
] as const;
