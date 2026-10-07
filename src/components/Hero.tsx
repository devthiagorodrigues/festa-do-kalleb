"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { useRef } from "react";
import { Cloud, Dove, Leaves } from "./decor";
import { scrollToId } from "@/lib/scroll";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useCalmMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const farY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);
  const nearY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section
      ref={ref}
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
      style={{ background: "linear-gradient(180deg, #A8D2E8 0%, #C4E0EE 42%, #DCECF4 70%, #F3EBDD 100%)" }}
    >
      {/* Céu: nuvens em três profundidades */}
      <motion.div aria-hidden className="absolute inset-0 -z-10" style={{ y: farY }}>
        <Cloud className="-left-16 top-[16%] w-56 opacity-70 md:left-[4%] md:w-80" duration={46} />
        <Cloud className="-right-10 top-[6%] w-40 opacity-80 md:right-[30%] md:w-56" variant={1} duration={38} />
        <Cloud className="right-[-30px] top-[44%] w-48 opacity-60 md:right-[2%] md:top-[60%] md:w-72" duration={52} />
      </motion.div>
      <Dove className="top-[30%] z-0 md:top-[14%]" duration={26} delay={1.5} />

      {/* Placa da marca, pendurada do céu */}
      <motion.div
        className="absolute left-[3%] top-[-12px] z-20 w-[clamp(118px,34vw,150px)] md:left-[max(2rem,calc(50%-34rem))] md:top-[-18px] md:w-[210px]"
        initial={{ opacity: 0, y: reduce ? 0 : -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.5, ease }}
      >
        <div className="anim-sway">
          <Image
            src="/img/kalleb-1ano.webp"
            alt="Kalleb, 1 ano"
            width={720}
            height={662}
            sizes="(min-width: 768px) 210px, 150px"
            className="h-auto w-full drop-shadow-[0_10px_14px_rgba(117,69,39,0.18)]"
            priority
          />
        </div>
      </motion.div>

      <div className="gutter relative mx-auto grid min-h-[100svh] max-w-6xl content-center gap-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))] md:grid-cols-[1.05fr_1fr] md:items-center md:gap-14 md:py-16">
        {/* Foto real do Kalleb como protagonista */}
        <div className="relative mx-auto mt-16 w-full max-w-[min(72vw,30svh,340px)] md:order-2 md:mt-0 md:max-w-[min(440px,58svh)]">
          <motion.div style={{ y: photoY }}>
            <motion.div
              initial={{ scale: reduce ? 1 : 0.94, rotate: reduce ? -2 : -5 }}
              animate={{ scale: 1, rotate: -2 }}
              transition={{ duration: 1.2, ease }}
              className="relative aspect-[4/5] h-auto w-full overflow-hidden bg-sky-light shadow-[0_24px_50px_-28px_rgba(117,69,39,0.55)]"
              style={{ borderRadius: "999px 999px 34px 34px", border: "7px solid #FFFDF8" }}
            >
              <Image
                src="/img/kalleb-02.webp"
                alt="Kalleb deitado na almofada, sorrindo com as mãozinhas para cima"
                fill
                priority
                sizes="(min-width: 768px) 440px, 80vw"
                className="object-cover"
                style={{ objectPosition: "50% 30%" }}
              />
            </motion.div>
          </motion.div>

          <motion.div aria-hidden style={{ y: nearY }} className="pointer-events-none absolute -bottom-8 -left-14 z-10 w-48 md:-left-20 md:w-64">
            <Cloud className="relative w-full" duration={30} />
          </motion.div>
          <Leaves className="-right-5 -top-2 z-10 w-14 rotate-[30deg] md:w-16" variant={2} />
          <Leaves className="-right-8 bottom-[18%] z-10 w-16 -rotate-12 md:w-20" />
        </div>

        {/* Texto */}
        <div className="relative z-10 text-center md:order-1 md:text-left">
          <motion.p {...enter(0.2)} className="font-script text-[1.5rem] leading-tight text-olive md:text-3xl lg:text-4xl">
            Tem uma aventura muito especial chegando…
          </motion.p>
          <motion.h1
            id="hero-title"
            {...enter(0.45)}
            className="mt-1 font-serif text-[2.3rem] font-bold leading-[1.02] tracking-[-0.01em] text-brown md:text-5xl lg:text-6xl"
          >
            Nosso pequeno Kalleb está completando <span className="whitespace-nowrap">1 ano.</span>
          </motion.h1>
          <motion.p {...enter(0.7)} className="mx-auto mt-3 max-w-[30ch] text-[1.0625rem] leading-relaxed text-brown/85 md:mx-0 md:text-lg">
            E queremos você pertinho da gente para celebrar esse primeiro capítulo.
          </motion.p>
          <motion.div {...enter(0.95)} className="mt-5 flex flex-col items-center gap-3 md:items-start">
            <button type="button" className="btn btn-primary w-full max-w-xs md:w-auto" onClick={() => scrollToId("descobertas")}>
              Entrar nessa aventura
            </button>
            <span className="text-sm font-semibold text-olive">
              Role para embarcar <span className="anim-nudge inline-block" aria-hidden>↓</span>
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
