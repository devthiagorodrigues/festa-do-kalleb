"use client";

import Image from "next/image";
import {
  AnimatePresence,
  interpolate,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { useRef, useState } from "react";
import { Cloud, Scene, Waves } from "./decor";

/*
 * Composição em camadas, em coordenadas do PNG original da arca (1448 × 1086):
 *   ARK (casa + casco)  →  ANIMAIS (recortados acima da borda do casco)  →  ondas da frente
 *
 * A borda superior do casco vai de (305, 468) a (1330, 680). A camada de animais usa
 * um clip-path que só deixa visível o que está ACIMA dessa linha (e atrás dos postes de
 * proa/popa), então nenhum corpo aparece para fora do casco.
 */
const ARK_W = 1448;
const ARK_H = 1086;
const px = (x: number) => `${(x / ARK_W) * 100}%`;
const py = (y: number) => `${(y / ARK_H) * 100}%`;

const ABOVE_HULL = `polygon(${[
  [0, 0],
  [ARK_W, 0],
  [ARK_W, 640],
  [1395, 618],
  [1335, 618],
  [1330, 680],
  [305, 468],
  [305, 440],
  [185, 450],
  [110, 560],
  [0, 700],
]
  .map(([x, y]) => `${((x / ARK_W) * 100).toFixed(2)}% ${((y / ARK_H) * 100).toFixed(2)}%`)
  .join(", ")})`;


/**
 * useTransform com clamp garantido. Usamos a forma de função de propósito: a forma com
 * arrays é acelerada via WAAPI/ScrollTimeline e, em alguns navegadores, não segura os
 * valores fora do intervalo (a Arca esmaecia e frases antigas reapareciam).
 */
function useRange<T extends number | string>(progress: MotionValue<number>, input: number[], output: T[]) {
  const map = interpolate(input, output, { clamp: true });
  return useTransform(progress, (v) => map(v) as T);
}

type AnimalId = "elefante" | "urso" | "leao" | "girafa" | "zebra" | "hipopotamo" | "macaco";

type Animal = {
  id: AnimalId;
  label: string;
  /** retângulo do personagem dentro da arca (px do PNG da arca) */
  x: number;
  y: number;
  w: number;
  /** proporção (h / w) do webp recortado */
  ratio: number;
  /** progresso do scroll em que entra */
  at: number;
  z: number;
  flip?: boolean;
  /** quanto sobe ao entrar (em % da própria altura) */
  rise?: number;
};

// Ordem de profundidade: girafa e elefante atrás, leão e urso à frente.
const ANIMALS: Animal[] = [
  { id: "girafa", label: "Girafa", x: 1010, y: 175, w: 300, ratio: 640 / 468, at: 0.36, z: 1 },
  { id: "hipopotamo", label: "Hipopótamo", x: 1125, y: 470, w: 250, ratio: 604 / 640, at: 0.02, z: 2 },
  { id: "zebra", label: "Zebra", x: 930, y: 380, w: 240, ratio: 640 / 567, at: 0.02, z: 3 },
  { id: "elefante", label: "Elefante", x: 300, y: 230, w: 360, ratio: 608 / 640, at: 0.22, z: 2 },
  { id: "urso", label: "Urso", x: 545, y: 345, w: 220, ratio: 640 / 557, at: 0.02, z: 6 },
  { id: "leao", label: "Leão", x: 680, y: 300, w: 330, ratio: 634 / 640, at: 0.62, z: 5 },
];

const MONKEY = { x: 520, y: 18, w: 230, ratio: 592 / 640, at: 0.49 };

const PHRASES: { text: string; at: number; until: number; big?: boolean }[] = [
  { text: "A tripulação já está quase completa…", at: 0, until: 0.2 },
  { text: "O elefante já chegou.", at: 0.22, until: 0.34 },
  { text: "A girafa encontrou seu lugar.", at: 0.36, until: 0.47 },
  { text: "O macaco, como sempre, já começou a bagunça.", at: 0.49, until: 0.6 },
  { text: "E o leão? Ele já está avisando que a festa vai começar.", at: 0.62, until: 0.74 },
  { text: "Só está faltando você.", at: 0.76, until: 0.86 },
  { text: "Todos a bordo para comemorar o primeiro ano do Kalleb!", at: 0.88, until: 1, big: true },
];

function Phrase({ p, progress, index }: { p: (typeof PHRASES)[number]; progress: MotionValue<number>; index: number }) {
  const reduce = useCalmMotion();
  // entra em [at, at+fade] e sai em [until-fade, until]; a próxima só começa depois (sem sobreposição)
  const fade = 0.025;
  const first = index === 0;
  const last = index === PHRASES.length - 1;
  const input = first ? [p.until - fade, p.until] : last ? [p.at, p.at + fade] : [p.at, p.at + fade, p.until - fade, p.until];
  const opacity = useRange(progress, input, first ? [1, 0] : last ? [0, 1] : [0, 1, 1, 0]);
  const y = useRange(progress, input, reduce ? input.map(() => 0) : first ? [0, -12] : last ? [16, 0] : [16, 0, 0, -12]);
  return (
    <motion.p
      style={{ opacity, y }}
      className={`absolute inset-x-0 top-0 mx-auto max-w-[19ch] text-balance font-serif font-bold leading-[1.08] text-brown md:mx-0 md:max-w-[15ch] ${
        p.big ? "text-[2.2rem] md:text-[2.6rem] lg:text-[3.4rem]" : "text-[2.05rem] md:text-[2.4rem] lg:text-5xl"
      }`}
    >
      {p.text}
    </motion.p>
  );
}

function AnimalLayer({ a, progress }: { a: Animal; progress: MotionValue<number> }) {
  const reduce = useCalmMotion();
  const enter = a.at <= 0.05 ? [0, 0.001] : [a.at - 0.06, a.at + 0.02];
  const y = useRange(progress, enter, reduce ? ["0%", "0%"] : [`${a.rise ?? 62}%`, "0%"]);
  const opacity = useRange(progress, enter, reduce ? [0, 1] : [0.2, 1]);
  return (
    <motion.div
      className="absolute"
      style={{ left: px(a.x), top: py(a.y), width: px(a.w), zIndex: a.z, y, opacity: a.at <= 0.05 ? 1 : opacity }}
    >
      <Image
        src={`/img/${a.id}.webp`}
        alt=""
        width={640}
        height={Math.round(640 * a.ratio)}
        sizes="(min-width: 768px) 200px, 120px"
        className="h-auto w-full select-none"
        draggable={false}
      />
    </motion.div>
  );
}

function Lion({ a, progress }: { a: Animal; progress: MotionValue<number> }) {
  const reduce = useCalmMotion();
  const [roars, setRoars] = useState(0);
  const enter = [a.at - 0.06, a.at + 0.02];
  const y = useRange(progress, enter, reduce ? ["0%", "0%"] : ["62%", "0%"]);
  const opacity = useRange(progress, enter, reduce ? [0, 1] : [0.2, 1]);

  return (
    <motion.div
      className="absolute"
      style={{ left: px(a.x), top: py(a.y), width: px(a.w), zIndex: a.z, y, opacity }}
    >
      <motion.button
        type="button"
        aria-label="Tocar no leão para ele rugir"
        onClick={() => setRoars((r) => r + 1)}
        key={roars}
        animate={roars && !reduce ? { scale: [1, 1.07, 0.98, 1.03, 1], rotate: [0, -3, 3, -1, 0] } : undefined}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="block w-full cursor-pointer rounded-[40%] focus-visible:outline-offset-[-8px]"
        style={{ transformOrigin: "50% 70%" }}
      >
        <Image
          src="/img/leao.webp"
          alt=""
          width={640}
          height={634}
          sizes="(min-width: 768px) 220px, 130px"
          className="pointer-events-none h-auto w-full select-none"
          draggable={false}
        />
      </motion.button>
      <RoarBubble count={roars} />
    </motion.div>
  );
}

function RoarBubble({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          key={count}
          aria-hidden
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.05, 1, 1], y: [10, -6, -10, -16] }}
          transition={{ duration: 1.4, times: [0, 0.2, 0.75, 1] }}
          className="pointer-events-none absolute -top-[18%] left-[52%] z-10 flex items-center gap-1"
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" className="-rotate-12 text-wood">
            <path d="M6 10c4 4 4 10 0 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M13 5c7 7 7 17 0 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="rounded-full bg-warm-white px-3 py-1 font-script text-2xl font-bold text-brown shadow-[0_6px_16px_-8px_rgba(117,69,39,0.6)]">
            Roooar!
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Monkey({ progress }: { progress: MotionValue<number> }) {
  const reduce = useCalmMotion();
  const enter = [MONKEY.at - 0.06, MONKEY.at + 0.01];
  const y = useRange(progress, enter, reduce ? ["0%", "0%"] : ["-70%", "0%"]);
  const rotate = useRange(progress, enter, reduce ? [0, 0] : [-18, 0]);
  const opacity = useRange(progress, [MONKEY.at - 0.06, MONKEY.at - 0.03], [0, 1]);
  return (
    <motion.div
      className="absolute z-[6]"
      style={{ left: px(MONKEY.x), top: py(MONKEY.y), width: px(MONKEY.w), y, rotate, opacity }}
    >
      <div className="anim-monkey">
        <Image
          src="/img/macaco.webp"
          alt=""
          width={640}
          height={592}
          sizes="(min-width: 768px) 160px, 100px"
          className="h-auto w-full select-none"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}

export function ArkJourney() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useCalmMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [live, setLive] = useState(PHRASES[0].text);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const current = [...PHRASES].reverse().find((p) => v >= p.at) ?? PHRASES[0];
    if (current.text !== live) setLive(current.text);
  });

  // céu → nuvens → ondas → arca → animais
  const cloudsY = useRange(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);
  const wavesY = useRange(scrollYProgress, [0, 0.12], reduce ? ["0%", "0%"] : ["70%", "0%"]);
  const arkX = useRange(scrollYProgress, [0, 0.18], reduce ? ["0%", "0%"] : ["38%", "0%"]);
  const arkY = useRange(scrollYProgress, [0, 0.18], reduce ? ["0%", "0%"] : ["14%", "0%"]);
  const arkOpacity = useRange(scrollYProgress, [0, 0.06], [reduce ? 1 : 0.4, 1]);
  const rainbow = useRange(scrollYProgress, [0.86, 0.95], [0, 0.85]);
  const doveX = useRange(scrollYProgress, [0.76, 1], ["-30vw", "120vw"]);
  const doveY = useRange(scrollYProgress, [0.76, 1], [30, -20]);

  return (
    <section
      ref={ref}
      id="a-bordo"
      aria-labelledby="a-bordo-title"
      className="relative h-[220vh]"
      style={{ background: "#A8D2E8" }}
    >
      <h2 id="a-bordo-title" className="sr-only">
        Todos a bordo
      </h2>
      {/* Leitores de tela recebem a frase atual da história */}
      <p className="sr-only" aria-live="polite">
        {live}
      </p>

      <div
        className="sticky top-0 h-[100svh] overflow-hidden"
        style={{ background: "linear-gradient(180deg, #E4EEF0 0%, #CFE5F0 30%, #A8D2E8 70%, #94C6E0 100%)" }}
      >
        {/* Céu e nuvens */}
        <motion.div aria-hidden className="absolute inset-0" style={{ y: cloudsY }}>
          <Cloud className="-left-10 top-[30%] w-48 opacity-80 md:left-[6%] md:w-72" duration={40} />
          <Cloud className="-right-12 top-[22%] w-36 opacity-70 md:right-[8%] md:w-56" variant={1} duration={34} />
          <Cloud className="left-[30%] top-[46%] w-40 opacity-50 md:w-64" duration={50} />
        </motion.div>

        {/* Arco-íris discreto ao final */}
        <motion.div aria-hidden style={{ opacity: rainbow }} className="absolute right-[2%] top-[30%] w-44 md:right-[12%] md:top-[18%] md:w-72">
          <Scene name="arco-iris" className="h-auto w-full" />
        </motion.div>

        {/* Pomba aparece novamente */}
        <motion.div aria-hidden className="absolute top-[24%] z-30 md:top-[14%]" style={{ x: doveX, y: doveY }}>
          <div className="anim-flap">
            <Scene name="pomba" className="h-auto w-12 md:w-16" />
          </div>
        </motion.div>

        {/* Mar: ondas de fundo (largura total) */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[40%] md:h-[46%]">
          <Waves className="bottom-[22%]" fill="#B9DCEC" amplitude={10} period={320} duration={26} height={140} crestOpacity={0.9} />
          <motion.div style={{ y: wavesY }} className="absolute inset-0">
            <Waves className="bottom-0" fill="#8EC2DC" amplitude={12} period={240} duration={20} height={220} />
          </motion.div>
        </div>

        <div className="relative mx-auto flex h-full max-w-6xl flex-col md:flex-row md:items-center">
          {/* Frases */}
          <div className="gutter relative z-20 pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))] text-center md:w-[40%] md:pt-0 md:text-left">
            <p className="mb-3 font-script text-2xl text-olive md:text-3xl" aria-hidden>
              Todos a bordo
            </p>
            <div className="relative h-[8rem] md:h-[13rem]" aria-hidden>
              {PHRASES.map((p, i) => (
                <Phrase key={p.text} p={p} progress={scrollYProgress} index={i} />
              ))}
            </div>
          </div>

          {/* Cena */}
          <div className="relative mt-auto h-[64%] w-full md:mt-0 md:h-full md:w-[60%]">
            {/* Arca + animais */}
            <motion.div
              className="absolute bottom-[13%] left-1/2 z-10 w-[108%] max-w-[640px] -translate-x-1/2 md:bottom-[16%] md:w-[104%] md:max-w-[760px]"
              style={{ x: arkX, y: arkY, opacity: arkOpacity }}
            >
              <div>
                <div className="anim-bob relative aspect-[1448/1086] w-full">
                  <Image
                    src="/img/arca.webp"
                    alt="A Arca de Noé navegando, com o elefante, a girafa, a zebra, o hipopótamo, o urso, o leão e o macaco a bordo"
                    fill
                    sizes="(min-width: 768px) 760px, 108vw"
                    className="select-none object-contain"
                    draggable={false}
                  />
                  <div className="absolute inset-0" style={{ clipPath: ABOVE_HULL }}>
                    {ANIMALS.filter((a) => a.id !== "leao").map((a) => (
                      <AnimalLayer key={a.id} a={a} progress={scrollYProgress} />
                    ))}
                    <Lion a={ANIMALS.find((a) => a.id === "leao")!} progress={scrollYProgress} />
                  </div>
                  <Monkey progress={scrollYProgress} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Ondas da frente */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[120px]">
          <Waves className="-bottom-2" fill="#6FA9C9" amplitude={13} period={192} duration={14} reverse height={120} />
        </div>
      </div>
    </section>
  );
}
