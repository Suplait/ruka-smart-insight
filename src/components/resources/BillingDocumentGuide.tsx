import { ArrowRight, FileText } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { billingDocuments } from "@/content/billingExperience";

export function BillingDocumentGuide() {
  const [selected, setSelected] = useState("ventas");
  return (
    <section
      id="documentos"
      aria-labelledby="billing-documents-title"
      className="scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <h2
            id="billing-documents-title"
            className="text-3xl font-semibold leading-[1.12] tracking-[-.035em] sm:text-5xl"
          >
            ¿Qué necesitas documentar?
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#586176]">
            Parte por el trabajo que haces. RukaFactura contempla distintos
            documentos, según la habilitación y configuración de tu empresa.
          </p>
        </header>
        <Tabs value={selected} onValueChange={setSelected} className="mt-9">
          <TabsList
            aria-label="Documentos según tu operación"
            className="grid h-auto grid-cols-2 justify-start gap-1 rounded-xl bg-[#f1f3fa] p-1.5 sm:inline-flex"
          >
            {billingDocuments.map((group) => (
              <TabsTrigger
                key={group.id}
                value={group.id}
                className="min-h-12 rounded-lg px-2 text-sm text-[#505b70] transition-colors duration-150 data-[state=active]:bg-[#424ec0] data-[state=active]:text-white data-[state=active]:shadow-none sm:px-5 sm:text-base motion-reduce:transition-none"
              >
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {billingDocuments.map((group) => (
            <TabsContent
              key={group.id}
              value={group.id}
              forceMount
              hidden={selected !== group.id}
              className="mt-7 rounded-2xl bg-[#f7f8fc] p-6 data-[state=inactive]:hidden sm:p-10"
            >
              <div className="grid gap-9 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                <div>
                  <h3 className="max-w-lg text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                    {group.title}
                  </h3>
                  <p className="mt-4 max-w-lg leading-7 text-[#586176]">
                    {group.description}
                  </p>
                  <dl className="mt-7 space-y-5">
                    <div>
                      <dt className="text-sm font-semibold text-[#424ec0]">
                        Lo que preparas
                      </dt>
                      <dd className="mt-2 leading-7">{group.prepare}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-semibold text-[#424ec0]">
                        Lo que queda disponible
                      </dt>
                      <dd className="mt-2 leading-7">{group.result}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <ul className="space-y-6">
                    {group.documents.map((document) => (
                      <li key={document.name} className="flex gap-4">
                        <FileText
                          size={22}
                          className="mt-1 shrink-0 text-[#424ec0]"
                          aria-hidden="true"
                        />
                        <div>
                          <h4 className="text-lg font-semibold">
                            {document.name}
                          </h4>
                          <p className="mt-2 leading-7 text-[#586176]">
                            {document.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 border-t border-[#dce2ed] pt-5 text-sm leading-6 text-[#586176]">
                    {group.note}
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <a
          href="#preparar"
          className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-[#424ec0] underline-offset-4 hover:underline focus-visible:outline-primary"
        >
          Qué necesito para empezar <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
