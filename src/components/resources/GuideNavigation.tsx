import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type GuideItem = { id: string; title: string };

export function GuideNavigation({ items, label = "En esta guía" }: { items: GuideItem[]; label?: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const disclosure = useRef<HTMLDetailsElement>(null);
  const ids = items.map(item => item.id).join("|");
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-112px 0px -55% 0px" });
    ids.split("|").forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, [ids]);
  const links = items.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined} onClick={() => { setActive(item.id); if (disclosure.current) disclosure.current.open = false; }} className={`block border-l-2 px-4 py-3 text-sm leading-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active === item.id ? "border-primary bg-[#eef0ff] font-semibold text-[#424ec0]" : "border-[#e1e5ec] text-[#60687a] hover:border-[#a9b1ef] hover:text-[#171827]"}`}>{item.title}</a>);
  return <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
    <nav aria-label={label} className="hidden lg:block"><p className="mb-4 pl-4 text-xs font-semibold uppercase tracking-wider text-[#60687a]">{label}</p>{links}</nav>
    <details ref={disclosure} className="group rounded-lg border border-[#dce2ed] bg-white lg:hidden"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold focus-visible:outline-primary [&::-webkit-details-marker]:hidden">{label}<ChevronDown size={17} aria-hidden="true" className="transition-transform group-open:rotate-180 motion-reduce:transition-none" /></summary><nav aria-label={`${label}, mobile`} className="border-t border-[#dce2ed] py-2">{links}</nav></details>
  </aside>;
}
