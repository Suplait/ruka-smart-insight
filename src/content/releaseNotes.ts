// Announce only resources shipped with this release, not inferred product launches.
export const releaseNotes = [
  {
    id: "recursos-compras-2026-10",
    date: "2026-10-26",
    label: "Recursos y ayuda",
    title: "Menos dudas entre una compra y la siguiente.",
    summary: "Ahora puedes comparar costos, aclarar documentos y encontrar pasos concretos para trabajar con Ruka desde un mismo lugar.",
    changes: [
      { title: "Compara formatos sin hacer una planilla", description: "Calcula costo por kilo, litro o unidad; compara compras y distingue margen de markup. Los datos que ingresas se procesan en tu navegador.", href: "/herramientas/costo-unitario", link: "Calcular mi costo unitario" },
      { title: "Separa recepción, revisión y acuse", description: "Guías de compras con ejemplos y enlaces al SII. Explican qué significa cada paso y qué no conviene dar por hecho.", href: "/guias/compras", link: "Explorar las guías" },
      { title: "Encuentra el paso que necesitas", description: "El centro de ayuda reúne recorridos de compras, insumos, recepción, nómina bancaria y RukaFactura. Las capturas muestran datos de ejemplo.", href: "/ayuda", link: "Abrir el centro de ayuda" },
      { title: "Identifica a la empresa antes de registrar", description: "Un primer directorio de 20 empresas permite consultar RUT, razón social y canales oficiales, con fuentes visibles. No es una certificación ni una lista de partners.", href: "/proveedores", link: "Buscar un proveedor" },
    ],
  },
  {
    id: "guias-api-2026-10",
    date: "2026-10-26",
    label: "Para integradores",
    title: "De la referencia de API a una tarea concreta.",
    summary: "Una nueva entrada para desarrolladores organiza la documentación existente y explica cómo usarla en un dashboard, una exportación contable o un receptor de eventos.",
    changes: [
      { title: "Tres guías, con sus límites a la vista", description: "Distingue qué datos entrega cada endpoint, qué debe calcular tu sistema y cómo revisar permisos, paginación y reintentos. El acceso depende de tu cuenta y configuración.", href: "/desarrolladores", link: "Explorar las guías y la referencia" },
    ],
  },
];

export const updatesPath = "/novedades";
export const updatesTitle = "Novedades de Ruka: recursos, guías y mejoras | Ruka";
export const updatesDescription = "Conoce los nuevos recursos de Ruka: herramientas para comparar costos, guías de compras, ayuda operativa y documentación para conectar tus sistemas.";
