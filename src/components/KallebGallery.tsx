"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Cloud, Leaves } from "./decor";
import { Reveal } from "./Reveal";

const PHOTOS = [
  { src: "/img/kalleb-02.webp", alt: "Kalleb sorrindo, deitado na almofada com as mãos para cima", pos: "50% 30%" },
  { src: "/img/kalleb-05.webp", alt: "Kalleb recostado no sofá, de blusinha com ursinho, olhando para o lado", pos: "40% 30%" },
  { src: "/img/kalleb-04.webp", alt: "Kalleb deitado, olhando atento para a câmera", pos: "50% 25%" },
];

export function KallebGallery() {
  const rowRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const center = row.scrollLeft + row.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(row.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let raf = 0;
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onScroll);
    };
    row.addEventListener("scroll", handler, { passive: true });
    return () => {
      row.removeEventListener("scroll", handler);
      cancelAnimationFrame(raf);
    };
  }, [onScroll]);

  const goTo = (i: number) => {
    const row = rowRef.current;
    const el = row?.children[i] as HTMLElement | undefined;
    if (!row || !el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({ left: el.offsetLeft - (row.clientWidth - el.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      id="fotos"
      aria-labelledby="fotos-title"
      className="paper relative overflow-hidden pb-24 pt-20 md:pb-32 md:pt-28"
      style={{ background: "linear-gradient(180deg, #F3E3C8 0%, #F8ECD8 40%, #EAF1EE 100%)" }}
    >
      <Cloud className="-left-16 top-10 w-44 opacity-50 md:left-[6%] md:w-60" duration={44} />
      <div className="gutter relative mx-auto max-w-5xl md:flex md:items-end md:justify-between md:gap-10">
        <div className="text-center md:text-left">
          <Reveal as="h2" className="font-serif text-[2.6rem] font-bold leading-none text-brown md:text-6xl">
            <span id="fotos-title">Um pedacinho do Kalleb</span>
          </Reveal>
          <div className="mt-5 space-y-1 font-script text-[1.65rem] leading-snug text-olive md:text-3xl">
            <Reveal as="p" delay={0.1}>
              Um ano de descobertas.
            </Reveal>
            <Reveal as="p" delay={0.25}>
              Um ano de carinho.
            </Reveal>
            <Reveal as="p" delay={0.4}>
              Um ano deixando nossos dias mais felizes.
            </Reveal>
          </div>
        </div>
        <div className="hidden gap-3 md:flex">
          <button
            type="button"
            className="btn btn-secondary h-14 w-14 !p-0"
            onClick={() => goTo(Math.max(0, active - 1))}
            disabled={active === 0}
            aria-label="Foto anterior"
          >
            <ChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            className="btn btn-secondary h-14 w-14 !p-0"
            onClick={() => goTo(Math.min(PHOTOS.length - 1, active + 1))}
            disabled={active === PHOTOS.length - 1}
            aria-label="Próxima foto"
          >
            <ChevronRight aria-hidden />
          </button>
        </div>
      </div>

      <ul
        ref={rowRef}
        className="snap-row mt-12 items-center gap-5 px-[10vw] py-8 md:gap-10 md:px-[calc((100vw-30rem)/2)]"
        aria-label="Fotos do Kalleb (deslize para ver)"
        tabIndex={0}
      >
        {PHOTOS.map((p, i) => (
          <li
            key={p.src}
            className="relative w-[80vw] max-w-[30rem] transition-transform duration-500"
            style={{ transform: `translateY(${i % 2 ? 14 : -10}px) rotate(${i % 2 ? 1.2 : -1.2}deg)` }}
          >
            <figure
              className="relative aspect-[4/5] overflow-hidden rounded-[30px] border-[8px] border-warm-white bg-sky-light shadow-[0_28px_50px_-30px_rgba(117,69,39,0.6)] transition-opacity duration-500"
              style={{ opacity: i === active ? 1 : 0.72 }}
            >
              <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 480px, 80vw" className="object-cover" style={{ objectPosition: p.pos }} />
            </figure>
            {i === 0 && <Leaves className="-left-4 -top-5 w-16 -rotate-12" />}
            {i === 1 && <Leaves className="-right-3 -bottom-4 w-12 rotate-12" variant={2} />}
            {i === 2 && <Leaves className="-right-5 -top-5 w-16 rotate-[160deg]" />}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-center gap-2.5" aria-hidden>
        {PHOTOS.map((p, i) => (
          <span
            key={p.src}
            className="h-2.5 rounded-full transition-all duration-300"
            style={{ width: i === active ? 28 : 10, background: i === active ? "#62663C" : "#DDBB8F" }}
          />
        ))}
      </div>
    </section>
  );
}
