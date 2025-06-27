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
              Suplait LLC y Suplait SpA ("Ruka.ai", "nosotros") nos comprometemos a proteger la información personal y empresarial que tratamos. Al usar la plataforma, usted acepta las prácticas descritas a continuación.
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
            <h2 className="text-2xl font-semibold mb-4">4. Propiedad de los datos y limitaciones de uso</h2>
            <p>
              El Cliente es dueño de sus datos identificables. Ruka.ai actúa como encargado de tratamiento.
            </p>
            
            <p>
              <strong>Uso a nivel macro, nunca micro.</strong> Tendencias sectoriales o comparativas se calculan sobre datos anonimizados y agregados (D A+A).
            </p>
            
            <p>
              <strong>No comercialización de datos individuales.</strong> Nunca vendemos ni compartimos datos que permitan identificar a su empresa o revelar sus precios concretos.
            </p>
            
            <p>
              <strong>Anonimización irrevocable.</strong> Antes de cualquier análisis externo, los datos se transforman de modo que la re-identificación sea imposible según el estado del arte.
            </p>
            
            <p>
              <strong>Consentimiento adicional.</strong> Para usos distintos a los aquí descritos se solicitará su permiso expreso, sin que ello condicione la continuidad del Servicio.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Compartición de información</h2>
            <p>
              Compartimos información únicamente en las siguientes circunstancias:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Proveedores de servicio que operan bajo contrato de confidencialidad (hosting, procesamiento de pagos, soporte)</li>
              <li>Autoridades cuando la ley lo exija</li>
              <li>Fusiones o adquisiciones, garantizando la continuidad de las protecciones aquí establecidas</li>
              <li>Informes D A+A para investigación de mercado, nunca con datos re-identificables</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Seguridad de los datos</h2>
            <p>
              Implementamos las siguientes medidas de seguridad para proteger su información:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Cifrado en tránsito (TLS 1.3) y en reposo (AES-256)</li>
              <li>Control de acceso basado en roles y doble factor</li>
              <li>Copias de seguridad cifradas y segregadas</li>
              <li>Auditorías periódicas y formación interna en seguridad</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Derechos del titular</h2>
            <p>
              Dependiendo de su jurisdicción, puede ejercer: acceso, rectificación, eliminación, oposición, portabilidad y retiro de consentimiento, enviando un correo a <a href="mailto:privacidad@ruka.ai" className="text-primary hover:underline">privacidad@ruka.ai</a>.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Retención</h2>
            <p>
              Conservamos sus datos mientras mantenga una cuenta activa y por los plazos necesarios para cumplir obligaciones legales o resolver disputas. Los D A+A pueden conservarse indefinidamente por no ser datos personales.
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
              Última actualización: 27 de junio de 2025
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
