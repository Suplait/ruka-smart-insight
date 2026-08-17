export type StoryImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  presentation?: "photo" | "document";
  aspect?: "portrait" | "landscape" | "wide" | "natural";
};

export type StoryMetric = {
  value: string;
  label: string;
};

export type StoryArchiveItem = {
  label: string;
  title: string;
  description: string;
  image: StoryImage;
};

export type StoryBlock =
  | { type: "copy"; paragraphs: readonly string[]; lead?: boolean }
  | { type: "image"; image: StoryImage; size?: "full" | "medium"; align?: "left" | "right" }
  | { type: "gallery"; images: readonly StoryImage[]; layout?: "balanced" | "portrait-document" }
  | { type: "quote"; text: string; context?: string }
  | { type: "metrics"; items: readonly StoryMetric[] }
  | { type: "archive"; title: string; intro: string; items: readonly StoryArchiveItem[] }
  | { type: "timeline"; items: readonly { date: string; text: string }[] }
  | { type: "evolution"; steps: readonly string[] };

export type StoryChapter = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  blocks: readonly StoryBlock[];
  dark?: boolean;
};

export const storyChapters: readonly StoryChapter[] = [
  {
    id: "aprender-a-construir",
    number: "01",
    eyebrow: "01 · APRENDER A CONSTRUIR",
    title: "Antes de saber construir una startup, ya estábamos construyendo una.",
    blocks: [
      {
        type: "copy",
        lead: true,
        paragraphs: [
          "Nuestra historia empezó antes de que estuviéramos los cuatro. Camilo y Lorenzo se conocían desde el colegio y, años después, compartían casa mientras terminaban la universidad.",
          "En 2015, dos de nosotros, Camilo y Lorenzo, crearon PortSalud: una forma de comparar y cotizar prestaciones médicas según el plan de salud de cada persona. La idea llegó a la final de un programa universitario. El problema era real; el modelo de negocio, todavía no.",
          "Cuando llegó el verano, ambos se fueron de vacaciones, dejaron de mover el proyecto y todo se enfrió. Nunca lo retomaron. Nuestra primera lección fue así de básica: parar también es retroceder.",
        ],
      },
      {
        type: "image",
        size: "medium",
        align: "left",
        image: {
          src: "/about/story/port-salud-2015.webp",
          alt: "Camilo Silva y Lorenzo Verdugo presentando PortSalud en 2015",
          caption: "PortSalud · la primera idea que intentamos convertir en empresa",
          width: 432,
          height: 537,
          aspect: "portrait",
        },
      },
      {
        type: "copy",
        paragraphs: [
          "En 2016 empezamos a encontrarnos. Lorenzo conoció a Benja en un programa de innovación vinculado a Stanford Technology Ventures Program. Camilo trabajaba en Kiwibot y, durante una pasantía en Berkeley, conoció de cerca el ecosistema de Silicon Valley.",
          "Cuando apareció un programa público que buscaba soluciones para turismo, Benja se sumó. Como viajeros, conocíamos la dificultad de planificar un viaje, pero antes de construir quisimos comprobar si a alguien más le importaba.",
          "Publicamos en Facebook una foto de uno de nuestros itinerarios. En una sola tarde recibió 640 comentarios. No habíamos escrito una línea de código y ya teníamos una señal mucho más útil que cualquier presentación.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/about/story/etiner-validation.webp",
          alt: "Publicación de Facebook con la que validamos interés por itinerarios antes de construir Etiner",
          caption: "Validamos la idea con una publicación y una planilla, antes de construir producto",
          width: 948,
          height: 509,
          presentation: "document",
          aspect: "wide",
        },
      },
      { type: "metrics", items: [{ value: "640", label: "comentarios en una tarde, sin producto construido" }] },
      {
        type: "copy",
        paragraphs: [
          "La primera idea de Etiner era una plataforma donde las personas compartieran itinerarios y nosotros pudiéramos transformar esos viajes en información útil para otros. Nos faltaba algo esencial: alguien que pudiera construirla.",
          "Benja conocía a Enzo, que estudiaba y hacía clases en la misma universidad de Camilo. Conversamos, le interesó el proyecto y se sumó como cofundador técnico. Entramos al programa, llegamos otra vez a una final y otra vez no ganamos. Esta vez no dejamos que la idea se enfriara.",
          "Todavía no sabíamos cuál iba a ser la empresa. Pero ahí quedamos los cuatro.",
        ],
      },
    ],
  },
  {
    id: "ir-al-problema",
    number: "02",
    eyebrow: "02 · IR AL PROBLEMA",
    title: "Si queríamos entender el problema, teníamos que vivir dentro de él.",
    blocks: [
      {
        type: "copy",
        lead: true,
        paragraphs: [
          "Con Etiner ya estábamos los cuatro. Empezamos ayudando gratis a personas a planificar viajes a cualquier parte del mundo: desde aventuras universitarias hasta lunas de miel.",
          "Veíamos interés, pero no encontrábamos un modelo de negocio. Probamos cobrar por la planificación. Las personas pagaban poco y nosotros terminábamos operando una consultoría difícil de escalar.",
        ],
      },
      {
        type: "quote",
        text: "¿Dónde reservo estas experiencias? Una agencia cobra más, pero tampoco quiero perder un día buscando operadores cuando llegue ni reservar online sin saber en quién confiar.",
        context: "La pregunta de un viajero que estaba preparando un viaje a San Pedro de Atacama",
      },
      {
        type: "copy",
        paragraphs: [
          "Después de escucharlo, nos pareció obvio. Tomamos un avión a San Pedro de Atacama, hablamos con operadores locales y armamos acuerdos que nos permitían vender al mismo precio del destino. El viajero nos pagaba, viajaba y nosotros pagábamos al operador cuando todo había salido bien.",
          "Pasamos de cero a una venta. Decidimos concentrarnos por completo en San Pedro durante esa temporada y nos mudamos allá por cinco meses.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/about/story/etiner-san-pedro-2017.webp",
          alt: "Fundadores de Etiner trabajando con computadores desde San Pedro de Atacama",
          caption: "San Pedro de Atacama · durante cinco meses trabajamos desde donde ocurría el problema",
          width: 959,
          height: 524,
          aspect: "wide",
        },
      },
      {
        type: "copy",
        paragraphs: [
          "Todos los días hablábamos con viajeros y operadores. Creamos un ranking para los proveedores y armábamos cada viaje en una Google Sheet con formato de calendario. Nuestro producto era esa planilla, mucha atención al detalle y conversaciones por WhatsApp.",
          "También automatizábamos parte de esas conversaciones en 2017, cuando todavía no era una práctica estándar: teníamos servidores emulando WhatsApp Web para enviar mensajes y mantener la operación andando.",
          "Durante el verano de 2017-2018 alcanzamos nuestros primeros US$100 mil en ventas acumuladas. Las planillas dejaron de alcanzar y empezamos a construir la primera plataforma real de Etiner.",
        ],
      },
      {
        type: "archive",
        title: "El producto también fue cambiando.",
        intro: "Antes de tener una plataforma tuvimos una hipótesis, después una operación manual y recién entonces un producto propio. Cada versión apareció cuando la anterior dejó de servirnos.",
        items: [
          {
            label: "ARCHIVO 01 · 2017",
            title: "La idea conversacional",
            description: "Imaginábamos un Etiner capaz de entender el viaje y proponer un itinerario modificable usando datos de la comunidad.",
            image: {
              src: "/about/story/etiner-conversational-concept.webp",
              alt: "Concepto de Etiner de 2017 mostrando un planificador conversacional basado en datos de viajes",
              caption: "Concepto de producto previo a la operación en San Pedro",
              width: 728,
              height: 681,
              presentation: "document",
              aspect: "natural",
            },
          },
          {
            label: "ARCHIVO 02 · SAN PEDRO",
            title: "La operación cabía en una planilla",
            description: "Construíamos itinerarios flexibles en Google Sheets, con experiencias ordenadas por día y horario.",
            image: {
              src: "/about/story/etiner-itinerary-sheet.webp",
              alt: "Google Sheet de Etiner con un itinerario de experiencias para San Pedro de Atacama",
              caption: "El calendario que usábamos para operar cada viaje",
              width: 1866,
              height: 1014,
              presentation: "document",
              aspect: "natural",
            },
          },
          {
            label: "ARCHIVO 03 · 2018",
            title: "La primera plataforma",
            description: "Cuando las planillas dejaron de escalar, llevamos experiencias, itinerarios y reservas a un producto propio.",
            image: {
              src: "/about/story/etiner-platform-2018.webp",
              alt: "Primera plataforma de Etiner con experiencias de viaje organizadas en un calendario",
              caption: "Experiencias e itinerarios dentro del primer producto de Etiner",
              width: 861,
              height: 539,
              presentation: "document",
              aspect: "natural",
            },
          },
        ],
      },
      {
        type: "copy",
        paragraphs: [
          "En la segunda mitad de 2018 hicimos nuestra primera contratación. Elegimos Cusco como siguiente destino, armamos las maletas y vivimos más de seis meses en Perú para volver a aprender la industria desde adentro mientras mejorábamos el producto.",
          "A comienzos de 2019, después de postular tres veces, entramos a 500 Startups. Nos fuimos a México por un año y desde ahí seguimos abriendo destinos por la región.",
          "Para comienzos de 2020 habíamos procesado cerca de 10.000 reservas en 19 destinos de Chile, Perú y Bolivia, y empezábamos a abrir México y Colombia. Lo que había empezado como planificación gratuita ya era una operación regional.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/about/story/etiner-500-mexico.webp",
          alt: "Equipo de Etiner en las oficinas de 500 Startups en México",
          caption: "México · después de tres postulaciones, entramos a 500 Startups",
          width: 959,
          height: 465,
          aspect: "wide",
        },
      },
      {
        type: "metrics",
        items: [
          { value: "US$100k", label: "primeras ventas acumuladas" },
          { value: "19", label: "destinos activos" },
          { value: "+10.000", label: "reservas procesadas" },
        ],
      },
    ],
  },
  {
    id: "volver-a-empezar",
    number: "03",
    eyebrow: "03 · VOLVER A EMPEZAR",
    title: "En cuatro días, las ventas de Etiner llegaron a cero.",
    dark: true,
    blocks: [
      {
        type: "copy",
        lead: true,
        paragraphs: [
          "El miércoles 11 de marzo de 2020, Camilo volvió de Puerto Escondido a Ciudad de México para trabajar desde las oficinas de 500 Startups. Etiner venía creciendo y el plan era seguir al menos seis meses más en México. Benja aterrizó ese mismo día para instalarse.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/about/story/etiner-puerto-escondido-2020.webp",
          alt: "Tres escenas de trabajo y vida junto al mar en Puerto Escondido durante la expansión de Etiner",
          caption: "Puerto Escondido · trabajando mientras Etiner seguía expandiéndose por la región",
          width: 1262,
          height: 856,
          aspect: "natural",
        },
      },
      { type: "metrics", items: [{ value: "$0", label: "ventas de Etiner al comenzar la pandemia" }] },
      {
        type: "timeline",
        items: [
          {
            date: "Miércoles 11",
            text: "Volvimos a Ciudad de México. La caída de las ventas ya se empezaba a notar.",
          },
          { date: "Viernes 13", text: "500 Startups cerró sus oficinas en México." },
          {
            date: "Domingo 15",
            text: "Chile anunció que cerraría sus fronteras en 48 horas. Ese día, por primera vez, vendimos $0.",
          },
          {
            date: "Lunes 16",
            text: "Tomamos el primer vuelo disponible de regreso a Chile. Benja llevaba menos de una semana en México.",
          },
          {
            date: "Miércoles 18",
            text: "Ya en cuarentena, completamos el cuarto día con ventas en cero y sin señales de recuperación.",
          },
        ],
      },
      {
        type: "image",
        image: {
          src: "/about/story/pandemic-2020.webp",
          alt: "Registro del regreso a Chile al comenzar la pandemia en marzo de 2020",
          caption: "Marzo de 2020 · el vuelo de regreso y la incertidumbre que venía después",
          width: 1262,
          height: 856,
          aspect: "natural",
        },
      },
      {
        type: "quote",
        text: "Podíamos pagar marzo y abril. Después no sabíamos.",
        context: "Ese era el horizonte de caja que compartimos con quienes trabajaban con nosotros",
      },
      {
        type: "copy",
        paragraphs: [
          "La pregunta dejó de ser cómo hacer crecer Etiner. Teníamos un mes y once días —hasta que terminara abril— para encontrar ingresos y sostener al equipo durante los nueve meses siguientes sin consumir el dinero de la empresa. Evaluamos cambiar el modelo, buscar otra oportunidad en turismo o incluso empezar desde cero en otra industria.",
          "La primera oportunidad apareció en la Región del Maule. Mientras cerraban calles y comercios, el gobierno regional necesitaba dar presencia digital al comercio local. Propusimos diseñar el producto, convocar a los negocios y lanzarlo. Market Maule pasó de idea a plataforma funcionando en menos de tres semanas y se estrenó con más de 1.000 comercios inscritos.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/about/story/market-maule-2020.webp",
          alt: "Plataforma Market Maule mostrando su vitrina digital para comercios de la Región del Maule",
          caption: "Market Maule · más de 2.000 comercios inscritos antes de cumplir dos meses",
          width: 1325,
          height: 629,
          presentation: "document",
          aspect: "natural",
        },
      },
      {
        type: "copy",
        paragraphs: [
          "Esa primera prueba nos mostró que podíamos usar lo aprendido en producto, growth y tecnología para resolver problemas de otras organizaciones. Así nació Etiner Labs. En sus primeros dos meses generó caja suficiente para llegar a febrero sin tocar el dinero reservado para Etiner.",
          "Con el tiempo Etiner Labs creció hasta cerca de 20 personas y trabajó con organizaciones como P&G, Crystal Lagoons y Rappi. Con Rappi participamos durante casi dos años en la transformación del modelo de adquisición de restaurantes.",
          "Ese trabajo llegó a nueve países, redujo el costo de adquisición cerca de 87% y, en su punto más alto, incorporó más de 10.000 restaurantes al mes. No era el negocio que habíamos imaginado, pero nos permitió seguir construyendo y aprender a operar tecnología a gran escala.",
        ],
      },
      {
        type: "metrics",
        items: [
          { value: "9", label: "países en la operación con Rappi" },
          { value: "−87%", label: "costo de adquisición" },
          { value: "+10.000", label: "restaurantes incorporados al mes en el punto más alto" },
        ],
      },
    ],
  },
  {
    id: "encontrar-ruka",
    number: "04",
    eyebrow: "04 · ENCONTRAR RUKA",
    title: "Ruka apareció cuando dejamos de defender la idea que teníamos.",
    blocks: [
      {
        type: "copy",
        lead: true,
        paragraphs: [
          "Etiner Labs funcionó. Sobrevivimos, crecimos y aprendimos muchísimo, pero no queríamos pasar los siguientes años operando una agencia. Queríamos volver a construir producto.",
          "A fines de 2022 creamos Suplait para digitalizar el sourcing de empresas medianas. Reunimos una red de más de 15.000 proveedores que podían responder a los requerimientos de nuestros clientes.",
          "Durante un año aprendimos más sobre transacciones B2B, pero no logramos el crecimiento que esperábamos. Muchas empresas preferían mantener la relación con sus proveedores y licitaban solo una parte pequeña de sus compras.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/about/story/suplait-platform.webp",
          alt: "Interfaz original de Suplait para procesos de compra y proveedores",
          caption: "Suplait · nuestro regreso a producto",
          width: 1024,
          height: 559,
          presentation: "document",
          aspect: "wide",
        },
      },
      { type: "metrics", items: [{ value: "+15.000", label: "proveedores reunidos en la red de Suplait" }] },
      {
        type: "copy",
        paragraphs: [
          "Mientras Suplait avanzaba lento, empezamos a construir herramientas de IA para categorizar compras y generar reportes. Esa parte del producto provocaba una reacción mucho más fuerte que el flujo principal.",
        ],
      },
      {
        type: "quote",
        text: "Con Suplait licito como máximo el 15% de mis compras. ¿Cómo puedo tener estas herramientas sobre el 100%?",
        context: "La pregunta de un usuario que cambió la dirección otra vez",
      },
      {
        type: "image",
        image: {
          src: "/about/story/suplait-categorization.webp",
          alt: "Herramienta de categorización de compras que nos ayudó a descubrir la oportunidad de Ruka",
          caption: "La herramienta que generó una señal mucho más fuerte que el producto principal",
          width: 999,
          height: 621,
          presentation: "document",
          aspect: "landscape",
        },
      },
      {
        type: "copy",
        paragraphs: [
          "Decidimos botar buena parte de lo construido. Volvimos a llamar a compradores, formulamos hipótesis y ofrecíamos un producto que todavía no existía. De ahí nació Ruka.",
          "Al principio Ruka organizaba información de compras. Después entendimos algo más importante: ordenar los datos no eliminaba el trabajo. Nuestros clientes seguían descargando, copiando, cruzando, conciliando y actualizando información entre sistemas.",
          "Ahí apareció la tesis que seguimos construyendo hoy.",
        ],
      },
      { type: "evolution", steps: ["SOURCING", "DATOS", "AUTOMATIZACIÓN", "TRABAJO OPERATIVO"] },
    ],
  },
] as const;
