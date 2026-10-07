"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { useRef } from "react";
import { Cloud, Dove, Leaves, Scene, SoftSun } from "./decor";
import { Reveal } from "./Reveal";

function Photo({
  src,
  alt,
  rotate,
  className = "",
  objectPosition = "50% 35%",
}: {
  src: string;
  alt: string;
  rotate: number;
  className?: string;
  objectPosition?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useCalmMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 36, reduce ? 0 : -36]);
  const r = useTransform(scrollYProgress, [0, 1], [reduce ? rotate : rotate * 1.8, reduce ? rotate : rotate * 0.4]);

  return (
    <motion.div ref={ref} style={{ y, rotate: r }} className={`relative ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border-[7px] border-warm-white bg-sky-light shadow-[0_22px_44px_-26px_rgba(117,69,39,0.55)]">
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 380px, 74vw" className="object-cover" style={{ objectPosition }} />
      </div>
      {/* fitinha de papel */}
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-3 rounded-[3px] bg-sand/70 shadow-sm"
      />
    </motion.div>
  );
}

export function StoryIntro() {
  return (
    <section
      id="descobertas"
      aria-labelledby="descobertas-title"
      className="paper relative overflow-hidden pb-24 pt-20 md:pb-36 md:pt-28"
      style={{ background: "linear-gradient(180deg, #F3EBDD 0%, #F8ECD8 18%, #F8ECD8 78%, #E4EEF0 100%)" }}
    >
      <h2 id="descobertas-title" className="sr-only">
        Um ano de descobertas
      </h2>

      {/* Abertura */}
      <div className="gutter relative mx-auto max-w-3xl text-center">
        <Leaves className="-top-12 left-[2%] w-14 -rotate-12 opacity-90 md:-top-10" />
        <Reveal as="p" className="font-serif text-[1.95rem] font-semibold leading-[1.14] text-brown md:text-5xl" amount={0.6}>
          Há um ano, nossos dias ganharam novos sons, novas cores e{" "}
          <span className="font-script text-[1.12em] font-bold text-olive">um sorriso que mudou tudo.</span>
        </Reveal>
      </div>

      {/* Primeiros olhares */}
      <div className="gutter relative mx-auto mt-20 grid max-w-5xl items-center gap-10 md:mt-28 md:grid-cols-2 md:gap-20">
        <Cloud className="-right-16 top-6 w-44 opacity-60 md:right-[40%]" variant={1} duration={36} />
        <Photo
          src="/img/kalleb-05.webp"
          alt="Kalleb recostado nas almofadas, olhando curioso para o lado"
          rotate={-3}
          className="mx-auto w-[74%] max-w-[360px]"
        />
        <Reveal as="p" className="text-center font-serif text-[2.1rem] font-bold leading-tight text-brown md:text-left md:text-5xl">
          Foram os <span className="italic text-olive">primeiros olhares.</span>
        </Reveal>
      </div>

      {/* Primeiras descobertas + aventuras */}
      <div className="gutter relative mx-auto mt-20 grid max-w-5xl items-center gap-10 md:mt-28 md:grid-cols-2 md:gap-20">
        <div className="order-2 space-y-10 text-center md:order-1 md:text-right">
          <Reveal as="p" className="font-serif text-[2.1rem] font-bold leading-tight text-brown md:text-5xl">
            As primeiras <span className="italic text-olive">descobertas.</span>
          </Reveal>
          <Reveal as="p" delay={0.15} className="relative font-serif text-[2.1rem] font-bold leading-tight text-brown md:text-5xl">
            As primeiras <span className="italic text-olive">aventuras.</span>
            <Scene name="onda-frente" className="absolute -bottom-10 right-[4%] w-16 opacity-80 md:right-0" />
          </Reveal>
        </div>
        <div className="relative order-1 md:order-2">
          <Photo
            src="/img/kalleb-04.webp"
            alt="Kalleb deitado na cama, olhando direto para a câmera"
            rotate={3}
            className="mx-auto w-[70%] max-w-[340px]"
            objectPosition="50% 28%"
          />
          <Leaves className="-left-1 bottom-6 w-16 rotate-[-25deg] md:left-6" variant={2} />
        </div>
      </div>

      {/* Fechamento: volta ao sol */}
      <div className="gutter relative mx-auto mt-28 max-w-3xl text-center md:mt-40">
        <SoftSun className="left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 md:h-[28rem] md:w-[28rem]" />
        <Dove className="-top-16" duration={28} delay={4} size={46} />
        <Reveal as="p" className="relative font-serif text-[2rem] font-semibold leading-[1.15] text-brown md:text-5xl" amount={0.7}>
          Agora chegou a hora de comemorar a primeira grande{" "}
          <span className="font-script text-[1.2em] font-bold text-olive">volta ao sol</span> do Kalleb.
        </Reveal>
        <Reveal delay={0.3} className="mt-8 flex justify-center" aria-hidden>
          <motion.span className="anim-nudge text-2xl text-olive/70">↓</motion.span>
        </Reveal>
      </div>
    </section>
  );
}
