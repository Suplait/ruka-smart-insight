import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Términos y Condiciones | Ruka.ai</title>
        <meta name="description" content="Términos y condiciones de uso de la plataforma Ruka.ai" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Términos y Condiciones</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
            <p>
              Bienvenido a Ruka.ai ("nosotros", "nuestra" o "Ruka"), operado por Suplait LLC (Estados Unidos) y Suplait SpA (Chile). Al acceder o utilizar nuestros servicios, sitio web y aplicación (colectivamente, los "Servicios"), usted acepta estos Términos y Condiciones ("Términos").
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Servicios</h2>
            <p>
              Ruka.ai ofrece una plataforma de gestión de costos para restaurantes que incluye, entre otros:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Digitalización automática de facturas</li>
              <li>Control de costos de insumos en tiempo real</li>
              <li>Monitoreo de precios y alertas</li>
              <li>Generación de reportes de food-cost</li>
              <li>Gestión de proveedores e inventario</li>
            </ul>
            <p>
              Podremos modificar, suspender o descontinuar total o parcialmente los Servicios, con o sin previo aviso.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Registro de Cuenta</h2>
            <p>
              Para utilizar determinadas características de nuestros Servicios, es posible que deba registrarse para una cuenta. Al registrarse, usted acepta proporcionar información precisa, actualizada y completa. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña y de restringir el acceso a su computadora o dispositivo.
            </p>
            <p>
              Usted acepta la responsabilidad por todas las actividades que ocurran bajo su cuenta o contraseña. Si cree que su cuenta ha sido comprometida, debe notificarnos inmediatamente.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Prueba Gratuita</h2>
            <p>
              Ruka.ai puede ofrecer un período de prueba gratuito para nuevos usuarios. Las condiciones específicas de la prueba gratuita serán especificadas durante el proceso de registro. Al finalizar el período de prueba gratuita, se aplicarán las tarifas correspondientes a menos que cancele su cuenta antes de finalizar el período de prueba.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Tarifas y Pagos</h2>
            <p>
              Al suscribirse a nuestros servicios de pago, usted acepta pagar todas las tarifas aplicables. Nos reservamos el derecho de cambiar nuestras tarifas en cualquier momento, con previo aviso. Los pagos no son reembolsables excepto cuando lo exija la ley o se especifique en estos Términos.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Propiedad Intelectual</h2>
            <p>
              Ruka.ai y su contenido, características y funcionalidad son propiedad de Suplait LLC, Suplait SPA o sus licenciantes y están protegidos por leyes de derechos de autor, marcas registradas, patentes, secretos comerciales y otras leyes de propiedad intelectual.
            </p>
            <p>
              No se permite el uso de cualquier material de Ruka.ai sin nuestro permiso previo por escrito, excepto según lo expresamente permitido en estos Términos.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Propiedad de los datos y licencia de uso</h2>
            <h3 className="text-xl font-medium mt-4 mb-2">Titularidad del Cliente</h3>
            <p>
              Todos los datos identificables que ingrese o que capture la plataforma en su nombre (facturas, cantidades, precios, nombres de proveedores, etc.) son y seguirán siendo de su exclusiva propiedad.
            </p>
            
            <h3 className="text-xl font-medium mt-4 mb-2">Licencia limitada a Ruka</h3>
            <p>
              Usted otorga a Ruka.ai una licencia mundial, no exclusiva, revocable y libre de regalías únicamente para:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>custodiar sus datos,</li>
              <li>procesarlos con el fin de prestarle los Servicios, y</li>
              <li>cumplir obligaciones legales o regulatorias.</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-4 mb-2">Derechos del Cliente</h3>
            <p>
              Puede solicitar copia, portabilidad o eliminación definitiva de sus datos identificables en cualquier momento escribiendo a <a href="mailto:privacidad@ruka.ai" className="text-primary hover:underline">privacidad@ruka.ai</a>; responderemos en un plazo máximo de 30 días naturales.
            </p>
            
            <h3 className="text-xl font-medium mt-4 mb-2">Datos anonimizados y agregados (D A+A)</h3>
            <p>
              Ruka.ai es titular de los datos que han sido irreversiblemente anonimizados y estadísticamente agregados (por ejemplo, "precio promedio del kilo de tomate en 200 restaurantes"). Dichos D A+A no permiten identificar a su empresa ni a ninguna otra y se usan para:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>elaborar informes de mercado y productos analíticos;</li>
              <li>ofrecerle comparaciones ("benchmarking") sobre si compra más caro o barato que el mercado;</li>
              <li>mejorar algoritmos y modelos estadísticos.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitación de Responsabilidad</h2>
            <p>
              En ningún caso Suplait LLC, Suplait SPA, sus directores, empleados, socios, agentes, proveedores o afiliados serán responsables por cualquier daño indirecto, incidental, especial, consecuente o punitivo, incluyendo sin limitación, pérdida de beneficios, datos, uso, buena voluntad, u otras pérdidas intangibles, resultantes de:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Su acceso o uso o incapacidad para acceder o usar los Servicios</li>
              <li>Cualquier conducta o contenido de terceros en los Servicios</li>
              <li>Cualquier contenido obtenido de los Servicios</li>
              <li>Acceso no autorizado, uso o alteración de sus transmisiones o contenido</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Privacidad</h2>
            <p>
              Su uso de los Servicios se rige por nuestra Política de Privacidad (véase más abajo).
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Modificaciones</h2>
            <p>
              Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, proporcionaremos al menos 30 días de aviso antes de que los nuevos términos entren en vigor. Lo que constituye un cambio material será determinado a nuestra sola discreción.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Ley Aplicable</h2>
            <p>
              Estos Términos se regirán e interpretarán de acuerdo con las leyes de Estados Unidos y Chile, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
            </p>
            <p>
              Cualquier acción legal o procedimiento que surja de o esté relacionado con estos Términos o los Servicios será sometido exclusivamente a los tribunales federales o estatales ubicados en Delaware, Estados Unidos, y Santiago, Chile, y usted consiente a la jurisdicción personal y lugar en dichos tribunales.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contacto</h2>
            <p>
              Si tiene alguna pregunta sobre estos Términos, póngase en contacto con nosotros en <a href="mailto:legal@ruka.ai" className="text-primary hover:underline">legal@ruka.ai</a>.
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
