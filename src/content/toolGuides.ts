export type ToolFaq = { question: string; answer: string };

export const costFaqs: ToolFaq[] = [
  { question: "¿Cómo calculo el costo por kilo de una caja?", answer: "Divide el total neto de la compra, después del descuento, por los kilos que compraste. Seis bolsas de 1 kg por $18.000 netos equivalen a 6 kg y un costo de $3.000 por kg. Si cada bolsa contiene 500 g, son 3 kg: el costo es $6.000 por kg." },
  { question: "¿Ingreso el valor de un envase o el total de la factura?", answer: "Ingresa el total correspondiente al insumo que estás calculando, no el de toda una factura con productos distintos. Si compraste seis bolsas del mismo producto, usa el total de esas seis bolsas. El contenido corresponde a una sola bolsa." },
  { question: "¿Cómo se trata el IVA y el descuento?", answer: "Primero se aplica el descuento al total ingresado. Si marcas IVA incluido, se divide ese importe por 1 más la tasa indicada. Si el precio ya es neto, no marques IVA; si ya tiene descuento, deja el descuento en 0. La herramienta separa importes, no determina el derecho a crédito fiscal." },
  { question: "¿Puedo pasar de litros a kilos?", answer: "No automáticamente. La calculadora convierte gramos a kilos y mililitros a litros. Pasar de volumen a peso requiere conocer la densidad de cada producto; asumir que un litro equivale a un kilo puede alterar tus costos." },
];

export const variationFaqs: ToolFaq[] = [
  { question: "¿Cómo comparo compras con envases distintos?", answer: "Ingresa por separado el total, la cantidad de envases y el contenido de cada envase. La herramienta lleva las dos compras a una unidad común. Por ejemplo, seis bolsas de 1 kg por $18.000 cuestan $3.000 por kg; un saco de 25 kg por $80.000 cuesta $3.200 por kg: subió 6,67%, aunque el formato sea distinto." },
  { question: "¿La diferencia de precio total sirve para comparar?", answer: "Solo si compraste exactamente la misma cantidad en condiciones equivalentes. Para formatos distintos, compara el costo neto por kilo, litro o unidad. La variación se calcula como costo actual menos costo anterior, dividido por costo anterior y multiplicado por 100." },
  { question: "¿Qué significa el impacto en la compra actual?", answer: "Es la diferencia de costo por unidad multiplicada por la cantidad de la compra actual. Indica cuánto más o menos pagarías frente al costo unitario anterior por esa misma cantidad. No es una proyección mensual ni incluye flete, merma o diferencias de calidad." },
  { question: "¿Un costo menor significa que conviene cambiar de proveedor?", answer: "No por sí solo. Compara el mismo insumo, calidad, rendimiento, moneda y condiciones de entrega. Un formato más barato puede generar más merma o exigir mayor almacenamiento. La calculadora no evalúa esas condiciones ni convierte monedas." },
];

export const marginFaqs: ToolFaq[] = [
  { question: "¿Cuál es la diferencia entre margen y markup?", answer: "Los dos parten de precio menos costo, pero usan una base distinta. El margen divide esa diferencia por el precio de venta; el markup, por el costo. Con costo $6.000 y venta $10.000, el margen es 40% y el markup es 66,67%." },
  { question: "¿Cómo pongo un precio para obtener 40% de margen?", answer: "Divide el costo por 0,60: costo ÷ (1 − 40 ÷ 100). Para un costo neto de $6.000, el precio neto es $10.000. Multiplicar el costo por 1,40 daría $8.400, que deja solo 28,57% de margen sobre la venta." },
  { question: "¿Este margen es mi utilidad final?", answer: "No. Solo considera la diferencia entre el precio y el costo que ingresaste. Para conocer la utilidad final necesitas considerar también los gastos, comisiones, mermas e impuestos que correspondan. Usa costo y venta sin IVA, en la misma moneda y unidad." },
  { question: "¿Puedo calcular un margen negativo o de 100%?", answer: "Una venta menor que el costo produce un margen negativo y la herramienta lo muestra. Con costo positivo no existe un precio finito que deje 100% de margen; por eso el margen objetivo debe ser menor que 100%." },
];
