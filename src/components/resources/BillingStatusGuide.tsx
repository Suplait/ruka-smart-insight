import { Info } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { billingStates } from "@/content/billingExperience";

export function BillingStatusGuide() {
  const [selected, setSelected] = useState("sent");
  return (
    <div className="mt-10 rounded-xl border border-[#dce2ed] bg-white p-5 sm:p-7">
      <h3 className="text-xl font-semibold tracking-tight">
        El estado cambia lo que haces después.
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#586176]">
        Explora qué significa cada estado. Esta es una guía, no una consulta al
        SII.
      </p>
      <Tabs value={selected} onValueChange={setSelected} className="mt-5">
        <TabsList
          aria-label="Estados de un documento"
          className="grid h-auto grid-cols-2 gap-1 rounded-lg bg-[#f1f3fa] p-1 sm:grid-cols-4"
        >
          {billingStates.map((state) => (
            <TabsTrigger
              key={state.id}
              value={state.id}
              className="min-h-11 rounded-md px-2 text-sm text-[#505b70] transition-colors duration-150 data-[state=active]:bg-[#424ec0] data-[state=active]:text-white data-[state=active]:shadow-none motion-reduce:transition-none"
            >
              {state.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {billingStates.map((state) => (
          <TabsContent
            key={state.id}
            value={state.id}
            forceMount
            hidden={selected !== state.id}
            className="mt-6 data-[state=inactive]:hidden"
          >
            <h4 className="text-lg font-semibold">{state.title}</h4>
            <p className="mt-3 leading-7 text-[#586176]">{state.text}</p>
            <p className="mt-4 text-sm font-semibold">
              Siguiente acción: {state.action.toLowerCase()}.
            </p>
            <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-[#424ec0]">
              <Info size={17} className="mt-1 shrink-0" aria-hidden="true" />
              {state.limit}
            </p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
