
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Política de Privacidad | Ruka.ai</title>
        <meta name="description" content="Política de privacidad de la plataforma Ruka.ai" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
            <p>
              Suplait LLC (Estados Unidos) y Suplait SPA (Chile), en adelante "Ruka.ai" o "nosotros", se compromete a proteger la privacidad de los datos personales que recopilamos. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información cuando utiliza nuestra plataforma y servicios.
            </p>
            <p>
              Al acceder o utilizar Ruka.ai, usted acepta las prácticas descritas en esta Política de Privacidad. Le recomendamos leer detenidamente este documento.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Información que recopilamos</h2>
            <p>
              Para proporcionar nuestros servicios, recopilamos los siguientes tipos de información:
            </p>
            <h3 className="text-xl font-medium mt-4 mb-2">2.1 Información proporcionada directamente</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Información de contacto (nombre, correo electrónico, número de teléfono)</li>
              <li>Información comercial (nombre de la empresa, dirección, RUT)</li>
              <li>Credenciales de acceso al SII y sistemas de facturación</li>
              <li>Información de facturación y pago</li>
              <li>Contenido que usted proporciona a través de nuestra plataforma</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">2.2 Información recopilada automáticamente</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Datos de transacciones (facturas de compra y venta)</li>
              <li>Información sobre proveedores y productos</li>
              <li>Datos de uso e interacción con nuestra plataforma</li>
              <li>Información técnica (dirección IP, tipo de dispositivo, navegador)</li>
              <li>Cookies y tecnologías similares</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Uso de la información</h2>
            <p>
              Utilizamos la información recopilada para los siguientes propósitos:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Proporcionar, mantener y mejorar nuestros servicios</li>
              <li>Procesar y digitalizar facturas</li>
              <li>Generar análisis y reportes de costos</li>
              <li>Monitoreando precios y detectando tendencias</li>
              <li>Comunicarnos con usted sobre nuestros servicios</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
              <li>Prevenir fraudes y proteger la seguridad de nuestros usuarios</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Limitaciones en el uso de datos</h2>
            <p>
              Nos comprometemos a usar sus datos respetando las siguientes limitaciones:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Uso a nivel macro, no micro:</strong> Podemos identificar tendencias generales, como si una industria está comprando más materiales de construcción que alimentos. Sin embargo, no podemos divulgar compras específicas o proveedores a terceros.</li>
              <li><strong>Anonimización:</strong> Cualquier dato utilizado para análisis o informes debe ser completamente anonimizado, eliminando cualquier detalle que pueda identificar a empresas o individuos.</li>
              <li><strong>Sin comercialización de datos individuales:</strong> No podemos vender, compartir o distribuir datos de transacciones individuales a terceros (por ejemplo, no podemos informar a una empresa qué precio está pagando su competencia, incluso si desean pagar por esta información).</li>
              <li><strong>Transparencia y consentimiento:</strong> Cualquier uso adicional de los datos requerirá el consentimiento explícito del usuario.</li>
              <li><strong>Cumplimiento legal y regulatorio:</strong> Cumplimos con todas las regulaciones relevantes de privacidad de datos.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Compartiendo información</h2>
            <p>
              No vendemos su información personal. Podemos compartir información en las siguientes circunstancias:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Con proveedores de servicios que nos ayudan a operar nuestra plataforma</li>
              <li>Con su consentimiento explícito para propósitos específicos</li>
              <li>Para cumplir con obligaciones legales o regulatorias</li>
              <li>En caso de fusión, adquisición o venta de activos, siempre protegiendo la confidencialidad</li>
              <li>De forma agregada y anonimizada para análisis de mercado e investigación</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Seguridad de datos</h2>
            <p>
              Implementamos medidas técnicas y organizativas apropiadas para proteger su información contra acceso no autorizado, alteración, divulgación o destrucción. Estas medidas incluyen:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encriptación de datos sensibles</li>
              <li>Protocolos de seguridad en nuestros servidores</li>
              <li>Acceso restringido a información personal</li>
              <li>Evaluaciones regulares de seguridad</li>
              <li>Capacitación del personal en prácticas de seguridad de datos</li>
            </ul>
            <p>
              Sin embargo, ningún método de transmisión por Internet o de almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar una seguridad absoluta.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Oportunidades futuras y uso de datos agregados</h2>
            <p>
              Con el fin de mejorar nuestros servicios y ofrecer valor adicional, podemos desarrollar las siguientes oportunidades usando datos agregados y anonimizados:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Análisis de mercado y tendencias:</strong> Observando patrones a nivel macro, podemos ofrecer informes sectoriales para ayudar a las empresas a comprender el panorama del mercado actual.</li>
              <li><strong>Benchmarking y comparaciones:</strong> Sin revelar datos específicos, permitimos a las empresas comparar sus hábitos de compra y precios con promedios de mercado.</li>
              <li><strong>Alertas de precios:</strong> Detectamos fluctuaciones significativas en los precios de productos o servicios, enviando alertas a las empresas.</li>
              <li><strong>Predicciones de mercado:</strong> Utilizando aprendizaje automático, podemos pronosticar tendencias futuras y ofrecer proyecciones sobre demanda, precios o cambios en el mercado.</li>
            </ul>
            <p>
              Para cualquiera de estos usos que implique un nivel de detalle más allá de datos completamente anonimizados y agregados, solicitaremos su consentimiento explícito.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Sus derechos</h2>
            <p>
              Dependiendo de su ubicación, puede tener ciertos derechos con respecto a sus datos personales, incluyendo:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Acceder a los datos personales que tenemos sobre usted</li>
              <li>Corregir datos inexactos</li>
              <li>Eliminar sus datos personales</li>
              <li>Oponerse al procesamiento de sus datos</li>
              <li>Retirar su consentimiento</li>
              <li>Solicitar la portabilidad de sus datos</li>
            </ul>
            <p>
              Para ejercer estos derechos, contáctenos a través de <a href="mailto:privacidad@ruka.ai" className="text-primary hover:underline">privacidad@ruka.ai</a>.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta Política de Privacidad ocasionalmente. La versión más reciente estará siempre disponible en nuestro sitio web. Le notificaremos sobre cambios significativos a través de un aviso en nuestra plataforma o por correo electrónico.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contacto</h2>
            <p>
              Si tiene preguntas o inquietudes sobre esta Política de Privacidad o el manejo de sus datos personales, contáctenos en:
            </p>
            <p className="mt-2">
              Email: <a href="mailto:privacidad@ruka.ai" className="text-primary hover:underline">privacidad@ruka.ai</a>
            </p>
          </section>
          
          <section className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Última actualización: Septiembre 2023
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
