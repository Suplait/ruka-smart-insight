import Navbar from "@/components/Navbar";

/** Preserve the page frame while a resource's lazy module is loading. */
export function ResourceLoading() {
  return <div className="min-h-screen bg-white text-[#171827]">
    <Navbar />
    <main aria-busy="true" className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <p role="status" className="text-sm font-medium text-[#60687a]">Cargando recurso…</p>
      <div aria-hidden="true" className="mt-8 max-w-4xl space-y-5">
        <div className="h-9 w-4/5 rounded bg-[#f0f2f7] sm:h-12" />
        <div className="h-4 w-full max-w-2xl rounded bg-[#f0f2f7]" />
        <div className="h-4 w-3/5 rounded bg-[#f0f2f7]" />
        <div className="pt-10"><div className="h-56 rounded-xl border border-[#e1e5ec] bg-[#fafbfc]" /></div>
      </div>
    </main>
  </div>;
}
