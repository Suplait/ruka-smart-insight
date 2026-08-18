const acquisitionCustomerLogos = [
  { name: "La Virgen", image: "/customer-logos/01-la-virgen.webp", className: "max-h-7 max-w-[7rem]" },
  { name: "Asfaltos del Maule", image: "/customer-logos/02-asfaltos-del-maule.webp", className: "max-h-8 max-w-[7rem]" },
  { name: "Barbazul", image: "/customer-logos/03-barbazul.webp", className: "max-h-10 max-w-[6rem]" },
  { name: "Uncle Fletch", image: "/customer-logos/04-uncle-fletch.webp", className: "max-h-10 max-w-[5rem]" },
  { name: "Chicken Love You", image: "/customer-logos/06-chicken-love-you.webp", className: "max-h-10 max-w-[5.5rem]" },
  { name: "Cervecería Kross", image: "/customer-logos/08-cerveceria-kross.svg", className: "max-h-10 max-w-[4rem]" },
  { name: "Street Wrap", image: "/customer-logos/09-street-wrap.webp", className: "max-h-8 max-w-[7rem]" },
  { name: "Rocoto", image: "/customer-logos/18-rocoto.webp", className: "max-h-8 max-w-[7rem]" },
] as const;

export function AcquisitionSocialProof() {
  return (
    <section aria-labelledby="acquisition-social-proof-title" className="border-y border-[#dce3f2] py-8 sm:py-9">
      <h2
        id="acquisition-social-proof-title"
        className="max-w-2xl text-balance text-sm font-semibold leading-6 text-[#454c60] sm:text-base sm:leading-7"
      >
        Ruka ya procesa millones de registros operativos para cientos de empresas.
      </h2>

      <ul className="mt-6 grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-7 sm:gap-y-7">
        {acquisitionCustomerLogos.map((logo) => (
          <li key={logo.name} className="flex min-h-11 items-center justify-center sm:justify-start">
            <img
              src={logo.image}
              alt={logo.name}
              loading="eager"
              className={`block h-auto w-auto object-contain grayscale opacity-60 transition-opacity duration-200 hover:opacity-80 ${logo.className}`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
