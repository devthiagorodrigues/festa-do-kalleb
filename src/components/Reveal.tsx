"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useCalmMotion } from "@/lib/useCalmMotion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  amount?: number;
  as?: "div" | "p" | "h2" | "h3" | "li" | "span";
};

/** Aparece suavemente quando entra na tela (uma vez). Com reduced motion, só fade. */
export function Reveal({ delay = 0, y = 22, amount = 0.5, as = "div", children, ...rest }: RevealProps) {
  const reduce = useCalmMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduce ? 0.4 : 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
