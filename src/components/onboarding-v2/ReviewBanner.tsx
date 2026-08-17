import { Eye } from "lucide-react";

type ReviewBannerProps = {
  detail?: string;
};

export function ReviewBanner({ detail }: ReviewBannerProps) {
  return (
    <div className="sticky top-0 z-50 border-b border-[#cbd3ff] bg-[#eef0ff] px-4 py-2.5 text-[#232b52]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs font-semibold sm:text-sm">
        <span className="inline-flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" aria-hidden="true" />
          MODO REVIEW
        </span>
        <span className="font-medium text-[#59617a]">No se guardará ni enviará información.</span>
        {detail ? <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#3d4770]">{detail}</span> : null}
      </div>
    </div>
  );
}
