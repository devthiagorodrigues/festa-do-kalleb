"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Anchor, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { scrollToId } from "@/lib/scroll";

const ITEMS = [
  { id: "descobertas", label: "O Kalleb" },
  { id: "grande-dia", label: "O grande dia" },
  { id: "sugestoes", label: "Sugestões" },
  { id: "fotos", label: "Fotos" },
  { id: "confirmar", label: "Confirmar presença", primary: true },
];

export function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const show = y > window.innerHeight * 0.6;
    if (show !== visible) setVisible(show);
    if (!show && open) setOpen(false);
  });

  useEffect(() => {
    if (!open) return;
    firstItemRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Navegação"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex flex-col items-end gap-3"
        >
          <AnimatePresence>
            {open && (
              <>
                <motion.button
                  type="button"
                  aria-label="Fechar menu"
                  tabIndex={-1}
                  className="fixed inset-0 -z-10 cursor-default bg-brown/15"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                />
                <motion.ul
                  id="floating-menu"
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "100% 100%" }}
                  className="w-[min(16.5rem,calc(100vw-2rem))] rounded-[26px] bg-warm-white p-2 shadow-[inset_0_0_0_1.5px_rgb(221_187_143/0.7),0_24px_50px_-24px_rgba(117,69,39,0.6)]"
                >
                  {ITEMS.map((item, i) => (
                    <li key={item.id}>
                      <button
                        ref={i === 0 ? firstItemRef : undefined}
                        type="button"
                        onClick={() => go(item.id)}
                        className={`flex min-h-12 w-full items-center rounded-[18px] px-4 text-left text-[1.05rem] font-bold transition ${
                          item.primary ? "mt-1 bg-olive text-warm-white" : "text-brown active:bg-cream"
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              </>
            )}
          </AnimatePresence>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="floating-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu de navegação"}
            className="grid h-14 w-14 place-items-center rounded-full bg-warm-white text-olive shadow-[inset_0_0_0_2px_rgb(221_187_143/0.9),0_14px_30px_-14px_rgba(117,69,39,0.7)] transition active:scale-95"
          >
            {open ? <X size={24} aria-hidden /> : <Anchor size={24} aria-hidden />}
          </button>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
