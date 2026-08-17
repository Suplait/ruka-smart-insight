import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: ruta inexistente", location.pathname);
  }, [location.pathname]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#fbfcff] px-6 py-20 text-[#171827]">
      <Helmet>
        <title>Página no encontrada | Ruka.ai</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>
      <div className="w-full max-w-3xl border-y border-[#cbd3e2] py-16 text-center sm:py-24">
        <Link to="/" aria-label="Ir al inicio de Ruka" className="inline-flex">
          <img src="/logo.png" alt="Ruka.ai" className="h-9 w-auto" />
        </Link>
        <p className="mt-12 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Error 404</p>
        <h1 className="mt-5 text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl">Esta página no existe.</h1>
        <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-[#5b6275]">La dirección puede haber cambiado o el enlace está incompleto.</p>
        <Link
          to="/"
          className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al inicio
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
