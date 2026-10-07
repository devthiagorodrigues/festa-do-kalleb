import Image from "next/image";
import { Cloud, Dove, Waves } from "./decor";
import { Reveal } from "./Reveal";

export function Finale() {
  return (
    <section
      id="encerramento"
      aria-labelledby="encerramento-title"
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #EAF1EE 0%, #CFE5F0 22%, #BFDDEC 52%, #F6E7C4 78%, #F2D9A8 100%)" }}
    >
      <h2 id="encerramento-title" className="sr-only">
        Até lá
      </h2>
      <Cloud className="-left-12 top-[8%] w-48 opacity-70 md:left-[8%] md:w-72" duration={50} />
      <Cloud className="-right-10 top-[20%] w-36 opacity-60 md:right-[10%] md:w-56" variant={1} duration={40} />
      <Dove className="top-[14%]" duration={30} delay={2} size={44} />

      <div className="gutter relative z-10 mx-auto max-w-3xl pb-6 pt-24 text-center md:pt-32">
        {/* Kalleb na escotilha */}
        <Reveal className="mx-auto w-40 md:w-52" y={14}>
          <div
            className="relative aspect-square rounded-full p-[9px] shadow-[0_20px_40px_-24px_rgba(117,69,39,0.7)]"
            style={{ background: "radial-gradient(circle at 35% 30%, #d8a878, #A97851 60%, #8a5f3d)" }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-full ring-4 ring-[#c99a6b]/60">
              <Image
                src="/img/kalleb-retrato.webp"
                alt="Retrato do Kalleb com a roupinha da Arca de Noé"
                fill
                sizes="(min-width: 768px) 208px, 160px"
                className="object-cover"
                style={{ objectPosition: "50% 32%" }}
              />
            </div>
          </div>
        </Reveal>

        <div className="mt-12 space-y-3">
          <Reveal as="p" className="font-serif text-[2.2rem] font-bold leading-tight text-brown md:text-5xl" amount={0.8}>
            Um ano passa depressa.
          </Reveal>
          <Reveal as="p" delay={0.35} className="font-serif text-[2.2rem] font-bold leading-tight text-brown md:text-5xl" amount={0.8}>
            Mas alguns momentos <span className="italic text-olive">ficam para sempre.</span>
          </Reveal>
          <Reveal as="p" delay={0.7} className="mx-auto max-w-[24ch] pt-3 text-[1.2rem] leading-relaxed text-brown/85 md:text-2xl" amount={0.8}>
            Esperamos você para viver esse com a gente.
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-10 flex flex-col items-center gap-1">
          <span className="font-script text-[2.1rem] font-bold leading-none text-olive">Kalleb • 1 ano</span>
          <span className="text-sm font-extrabold uppercase tracking-[0.32em] text-brown/70">24 de outubro</span>
        </Reveal>
      </div>

      {/* Horizonte com a Arca ao longe */}
      <div className="relative h-56 md:h-72" aria-hidden>
        <div className="absolute bottom-[50%] left-[58%] w-28 md:bottom-[46%] md:left-[62%] md:w-40">
          <div className="anim-bob">
            <Image src="/img/arca.webp" alt="" width={1200} height={900} sizes="160px" className="h-auto w-full opacity-95" />
          </div>
        </div>
        <Waves className="bottom-[22%]" fill="#B9DCEC" amplitude={6} period={320} duration={30} height={90} crestOpacity={0.6} />
        <Waves className="bottom-0" fill="#9ACBE2" amplitude={8} period={240} duration={22} reverse height={80} crestOpacity={0.7} />
      </div>

      <div className="relative bg-[#9ACBE2] pb-16 pt-2 text-center">
        <Reveal as="p" className="gutter font-script text-[2.1rem] font-bold leading-tight text-brown md:text-5xl" amount={0.8}>
          E agora só falta saber uma coisa…
        </Reveal>
        <span className="anim-nudge mt-4 inline-block text-2xl text-brown/80" aria-hidden>
          ↓
        </span>
      </div>
    </section>
  );
}
