import Image from "next/image";
import { event } from "@/data/event";
import { Leaves } from "./decor";
import { Reveal } from "./Reveal";

const ART: Record<string, { src: string; w: number; h: number; alt: string; tint: string; rotate: string }> = {
  roupas: { src: "/img/urso.webp", w: 557, h: 640, alt: "", tint: "#DCECF4", rotate: "-1.2deg" },
  sapatos: { src: "/img/girafa.webp", w: 468, h: 640, alt: "", tint: "#E9EBDD", rotate: "1deg" },
  brinquedo: { src: "/img/macaco.webp", w: 640, h: 592, alt: "", tint: "#F7E6BF", rotate: "-0.8deg" },
};

export function GiftSuggestions() {
  return (
    <section
      id="sugestoes"
      aria-labelledby="sugestoes-title"
      className="paper relative overflow-hidden pb-24 pt-20 md:pb-36 md:pt-28"
      style={{ background: "linear-gradient(180deg, #F8ECD8 0%, #F3E3C8 100%)" }}
    >
      <div className="gutter relative mx-auto max-w-3xl text-center">
        <Leaves className="-top-14 right-[6%] w-12 rotate-[25deg]" variant={2} />
        <Reveal as="h2" className="font-serif text-[2.3rem] font-bold leading-[1.05] text-brown md:text-6xl">
          <span id="sugestoes-title">Se quiser levar um carinho para o Kalleb…</span>
        </Reveal>
        <Reveal as="p" delay={0.1} className="mx-auto mt-5 max-w-[34ch] text-[1.08rem] leading-relaxed text-brown/85 md:text-lg">
          Sua presença já faz parte dessa história. Mas, se quiser presenteá-lo, reunimos algumas ideias que combinam com essa
          fase tão gostosa.
        </Reveal>
      </div>

      <ul
        className="snap-row mt-12 gap-4 px-[max(var(--gutter),calc((100vw-19rem)/2))] pb-6 pt-10 md:mx-auto md:grid md:max-w-5xl md:grid-cols-3 md:gap-8 md:overflow-visible md:px-10"
        aria-label="Sugestões de presentes"
      >
        {event.gifts.map((g, i) => {
          const art = ART[g.id];
          return (
            <li key={g.id} className="w-[min(19rem,78vw)] md:w-auto">
              <Reveal delay={i * 0.12} amount={0} className="h-full">
                <article
                  className="relative flex h-full flex-col items-center rounded-[28px] bg-warm-white px-6 pb-8 pt-24 text-center shadow-[0_18px_40px_-28px_rgba(117,69,39,0.6)]"
                  style={{ rotate: art.rotate, boxShadow: "inset 0 0 0 1.5px rgb(221 187 143 / 0.6), 0 18px 40px -28px rgb(117 69 39 / 0.6)" }}
                >
                  {/* furinho de etiqueta + barbante */}
                  <span aria-hidden className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-cream shadow-[inset_0_1px_2px_rgba(117,69,39,0.35)]" />
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-0 grid h-[6.5rem] w-[6.5rem] -translate-x-1/2 -translate-y-[42%] place-items-center rounded-full"
                    style={{ background: art.tint }}
                  >
                    <Image src={art.src} alt={art.alt} width={art.w} height={art.h} sizes="96px" className="h-[5.4rem] w-auto object-contain" />
                  </div>
                  <h3 className="font-serif text-[1.9rem] font-bold leading-none text-brown">{g.title}</h3>
                  {g.detail && (
                    <p className="plaque mt-4 px-4 py-1.5 text-[0.98rem] font-extrabold tracking-wide text-brown">{g.detail}</p>
                  )}
                  <p className="mt-4 text-[1.02rem] leading-relaxed text-brown/80">{g.text}</p>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
      <p className="mt-1 text-center text-sm font-bold text-olive md:hidden" aria-hidden>
        Deslize para ver as ideias <span className="anim-hint inline-block">→</span>
      </p>

      <Reveal className="gutter mx-auto mt-14 max-w-xl text-center">
        <p className="font-script text-[1.85rem] leading-snug text-olive md:text-4xl">
          O mais importante mesmo é ter você celebrando esse dia com a gente.
        </p>
      </Reveal>
    </section>
  );
}
