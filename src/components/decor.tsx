import Image from "next/image";
import type { CSSProperties } from "react";

type DecorProps = { className?: string; style?: CSSProperties };

const SCENE = {
  "nuvem-01": { w: 127, h: 64 },
  "nuvem-02": { w: 390, h: 144 },
  pomba: { w: 105, h: 97 },
  "folhas-01": { w: 125, h: 81 },
  "folhas-02": { w: 74, h: 113 },
  "onda-frente": { w: 133, h: 81 },
  "onda-fundo": { w: 190, h: 47 },
  "arco-iris": { w: 140, h: 75 },
} as const;

type SceneName = keyof typeof SCENE;

/** Elemento ilustrado decorativo (aquarela da identidade). Sempre aria-hidden. */
export function Scene({ name, className = "", style }: DecorProps & { name: SceneName }) {
  const { w, h } = SCENE[name];
  return (
    <Image
      src={`/img/${name}.webp`}
      alt=""
      aria-hidden
      width={w}
      height={h}
      unoptimized
      draggable={false}
      className={`pointer-events-none select-none ${className}`}
      style={style}
    />
  );
}

/** Nuvem que deriva lentamente. `variant` alterna entre os dois desenhos da identidade. */
export function Cloud({
  className = "",
  variant = 2,
  duration = 40,
  style,
}: DecorProps & { variant?: 1 | 2; duration?: number }) {
  return (
    <div aria-hidden className={`pointer-events-none ${/\brelative\b/.test(className) ? "" : "absolute"} ${className}`} style={style}>
      <div className="anim-drift" style={{ "--dur": `${duration}s` } as CSSProperties}>
        <Scene name={variant === 1 ? "nuvem-01" : "nuvem-02"} className="h-auto w-full" />
      </div>
    </div>
  );
}

/** Pomba atravessando a tela de tempos em tempos. */
export function Dove({
  className = "",
  duration = 24,
  delay = 0,
  size = 52,
}: {
  className?: string;
  duration?: number;
  delay?: number;
  size?: number;
}) {
  return (
    <div aria-hidden className={`pointer-events-none absolute left-0 ${className}`}>
      <div className="anim-dove" style={{ "--dur": `${duration}s`, "--delay": `${delay}s` } as CSSProperties}>
        <div className="anim-flap">
          <Scene name="pomba" style={{ width: size, height: "auto" }} />
        </div>
      </div>
    </div>
  );
}

export function Leaves({
  className = "",
  variant = 1,
  style,
}: DecorProps & { variant?: 1 | 2 }) {
  return (
    <Scene
      name={variant === 1 ? "folhas-01" : "folhas-02"}
      className={`absolute h-auto ${className}`}
      style={style}
    />
  );
}

/** Faixa de ondas em SVG, em loop horizontal contínuo (transform). */
export function Waves({
  className = "",
  fill = "#7FB6D3",
  crest = "#FFFDF8",
  amplitude = 14,
  period = 240,
  duration = 18,
  reverse = false,
  height = 120,
  crestOpacity = 0.75,
}: {
  className?: string;
  fill?: string;
  crest?: string;
  amplitude?: number;
  period?: number;
  duration?: number;
  reverse?: boolean;
  height?: number;
  crestOpacity?: number;
}) {
  // Duas faixas de 1920px; o loop desloca exatamente uma faixa (-50%). `period` deve dividir 1920.
  const total = 1920 * 2;
  const base = amplitude * 2 + 4;
  let d = `M0 ${base}`;
  for (let x = 0; x < total; x += period) {
    d += ` q ${period / 4} ${-amplitude * 1.6} ${period / 2} ${-amplitude * 0.2} t ${period / 2} ${amplitude * 0.2}`;
  }
  d += ` V ${height} H 0 Z`;
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 overflow-hidden ${className}`} style={{ height }}>
      <svg
        className="anim-wave block h-full max-w-none"
        style={
          {
            width: total,
            "--dur": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as CSSProperties
        }
        viewBox={`0 0 ${total} ${height}`}
        preserveAspectRatio="none"
      >
        <path d={d} fill={crest} fillOpacity={crestOpacity * 0.85} />
        <path d={d} fill={fill} transform="translate(0 5)" />
        <path d={d} fill={fill} fillOpacity={0.35} transform="translate(-36 1)" />
      </svg>
    </div>
  );
}

/** Sol suave em aquarela (CSS). */
export function SoftSun({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        background: "radial-gradient(circle, rgb(242 210 124 / 0.75) 0%, rgb(242 210 124 / 0.35) 45%, rgb(242 210 124 / 0) 70%)",
      }}
    />
  );
}
