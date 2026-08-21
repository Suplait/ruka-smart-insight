import { oneContent } from "@/content/oneContent";

export function OneStartingPoint() {
  return (
    <section id="punto-de-partida" className="border-b border-[#e0e4ea] bg-[#f6f7fb] px-5 py-16 sm:px-8 sm:py-[4.5rem]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[#5369eb]">
              {oneContent.startingPoint.eyebrow}
            </p>
            <h2 className="mt-4 max-w-4xl text-balance text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#171827] sm:text-[42px] lg:text-[46px]">
              {oneContent.startingPoint.title}
            </h2>
          </div>
          <p className="max-w-2xl text-pretty text-base leading-7 text-[#5f6677] sm:text-lg sm:leading-8">
            {oneContent.startingPoint.copy}
          </p>
        </div>

        <dl className="mt-9 grid border-y border-[#d8dce6] md:grid-cols-2">
          {oneContent.startingPoint.options.map((option, index) => (
            <div
              key={option.name}
              className={`py-6 sm:py-7 ${
                index === 0
                  ? "border-b border-[#d8dce6] md:border-b-0 md:border-r md:pr-10"
                  : "md:pl-10"
              }`}
            >
              <dt className={`text-xs font-semibold tracking-[0.13em] ${index === 0 ? "text-[#747b8b]" : "text-[#5369eb]"}`}>
                {option.name}
              </dt>
              <dd className="mt-2 max-w-xl text-balance text-lg font-semibold leading-7 tracking-[-0.015em] text-[#292b39] sm:text-xl">
                {option.copy}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
