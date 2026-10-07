"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCalmMotion } from "@/lib/useCalmMotion";
import { Minus, Plus } from "lucide-react";
import { useId, useRef, useState } from "react";
import { buildWhatsAppUrl, getWhatsAppNumber, hasInvalidWhatsAppNumber, type RsvpAnswer } from "@/lib/whatsapp";
import { Leaves, Scene } from "./decor";
import { Reveal } from "./Reveal";

const FEEDBACK_MS = 600;
const MAX_PEOPLE = 20;

type Phase = { kind: "form" } | { kind: "sending"; attending: boolean } | { kind: "done"; attending: boolean; url: string };

function Stepper({
  id,
  label,
  value,
  min,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
  error?: string;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(MAX_PEOPLE, v));
  const errId = `${id}-error`;
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <label htmlFor={id} className="block text-[1.02rem] font-bold text-brown">
        {label}
      </label>
      <div className="flex w-[11.5rem] items-center gap-2">
        <button
          type="button"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky-light text-brown transition active:scale-95 disabled:opacity-40"
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= min}
          aria-label={`Diminuir ${label.toLowerCase()}`}
        >
          <Minus size={20} aria-hidden />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={MAX_PEOPLE}
          value={value}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            onChange(Number.isNaN(n) ? min : clamp(n));
          }}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className="h-12 w-full min-w-0 rounded-2xl border-2 border-sand/70 bg-warm-white text-center text-xl font-extrabold text-brown outline-none transition focus:border-olive [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky-light text-brown transition active:scale-95 disabled:opacity-40"
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= MAX_PEOPLE}
          aria-label={`Aumentar ${label.toLowerCase()}`}
        >
          <Plus size={20} aria-hidden />
        </button>
      </div>
      {error && (
        <p id={errId} className="w-full text-sm font-bold text-[#9a3b22]">
          {error}
        </p>
      )}
    </div>
  );
}

function openWhatsApp(url: string) {
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (isTouch) {
    // No celular, navegar direto abre o app do WhatsApp e não sofre bloqueio de pop-up.
    window.location.href = url;
    return;
  }
  // Sem "noopener" nas features: com ele, window.open sempre retorna null e não daria para detectar bloqueio.
  const win = window.open(url, "_blank");
  if (win) win.opener = null;
  else window.location.href = url;
}

export function RSVP() {
  const reduce = useCalmMotion();
  const uid = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [errors, setErrors] = useState<{ name?: string; adults?: string; config?: string }>({});
  const [phase, setPhase] = useState<Phase>({ kind: "form" });

  const number = getWhatsAppNumber();
  const invalidNumber = hasInvalidWhatsAppNumber();
  const isDev = process.env.NODE_ENV !== "production";

  function submit(attending: boolean) {
    const next: typeof errors = {};
    if (!name.trim()) next.name = attending ? "Conta pra gente o seu nome 💛" : "Só precisamos do seu nome 💛";
    if (attending && adults < 1) next.adults = "Pelo menos 1 adulto, combinado?";
    if (!number) next.config = "A confirmação pelo WhatsApp ainda não foi configurada.";
    setErrors(next);
    if (next.name) {
      nameRef.current?.focus();
      return;
    }
    if (next.adults || next.config || !number) return;

    const answer: RsvpAnswer = attending
      ? { attending: true, name, adults, children: Math.max(0, children) }
      : { attending: false, name };
    const url = buildWhatsAppUrl(number, answer);

    setPhase({ kind: "sending", attending });
    window.setTimeout(
      () => {
        setPhase({ kind: "done", attending, url });
        openWhatsApp(url);
      },
      reduce ? 350 : FEEDBACK_MS,
    );
  }

  return (
    <section
      id="confirmar"
      aria-labelledby="confirmar-title"
      className="paper relative overflow-hidden pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-16 md:pb-24 md:pt-24"
      style={{ background: "linear-gradient(180deg, #9ACBE2 0%, #DCECF4 14%, #F8ECD8 34%, #F3E3C8 100%)" }}
    >
      <div className="gutter relative mx-auto max-w-xl md:grid md:max-w-5xl md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16">
        <Reveal className="text-center md:text-left">
          <h2 id="confirmar-title" className="font-serif text-[2.5rem] font-bold leading-[1.02] text-brown md:text-6xl">
            Você vem comemorar com a gente?
          </h2>
          <p className="mx-auto mt-4 max-w-[30ch] text-[1.08rem] leading-relaxed text-brown/85 md:mx-0 md:text-lg">
            Conta pra gente para prepararmos tudo com muito carinho.
          </p>
        </Reveal>

        {/* Cartão, com o leão e o urso espiando por cima — como na borda da Arca */}
        <Reveal delay={0.15} amount={0.2} className="relative mt-24">
          <div aria-hidden className="absolute -top-[4.6rem] left-[8%] w-28 rotate-[-6deg] md:w-32">
            <Image src="/img/urso.webp" alt="" width={557} height={640} sizes="128px" className="h-auto w-full" />
          </div>
          <div aria-hidden className="absolute -top-[5.2rem] right-[6%] w-32 rotate-[5deg] md:w-36">
            <Image src="/img/leao.webp" alt="" width={640} height={634} sizes="144px" className="h-auto w-full" />
          </div>
          <Leaves className="-right-3 -top-3 z-20 w-14 rotate-[20deg]" variant={2} />

          <div className="relative z-10 rounded-[30px] bg-warm-white px-5 pb-7 pt-7 shadow-[inset_0_0_0_1.5px_rgb(221_187_143/0.7),0_30px_60px_-36px_rgba(117,69,39,0.7)] md:px-9 md:pb-9 md:pt-9">
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                submit(true);
              }}
              className="space-y-6"
              aria-describedby={!number ? `${uid}-config` : undefined}
            >
              <div>
                <label htmlFor={`${uid}-name`} className="block text-[1.02rem] font-bold text-brown">
                  Nome
                </label>
                <input
                  ref={nameRef}
                  id={`${uid}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  autoCapitalize="words"
                  enterKeyHint="done"
                  maxLength={80}
                  placeholder="Seu nome (ou da família)"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
                  }}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                  className="mt-2 h-14 w-full rounded-2xl border-2 border-sand/70 bg-warm-white px-4 text-[1.1rem] font-semibold text-brown outline-none transition placeholder:font-normal placeholder:text-brown/45 focus:border-olive"
                />
                {errors.name && (
                  <p id={`${uid}-name-error`} className="mt-2 text-sm font-bold text-[#9a3b22]" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-4 rounded-[22px] bg-cream/60 p-4">
                <Stepper
                  id={`${uid}-adults`}
                  label="Quantos adultos?"
                  value={adults}
                  min={1}
                  onChange={(v) => {
                    setAdults(v);
                    if (errors.adults) setErrors((er) => ({ ...er, adults: undefined }));
                  }}
                  error={errors.adults}
                />
                <Stepper id={`${uid}-children`} label="Quantas crianças?" value={children} min={0} onChange={setChildren} />
              </div>

              {!number && (
                <div
                  id={`${uid}-config`}
                  role="status"
                  className="rounded-2xl border-2 border-dashed border-wood/50 bg-cream px-4 py-3 text-[0.95rem] leading-relaxed text-brown"
                >
                  {isDev ? (
                    <>
                      <strong className="block">Configuração pendente (desenvolvimento)</strong>
                      {invalidNumber
                        ? "O número em NEXT_PUBLIC_WHATSAPP_NUMBER está em formato inválido. Use só números, com país e DDD:"
                        : "Defina o WhatsApp da mãe do Kalleb em .env.local e reinicie o servidor:"}
                      <code className="mt-2 block break-all rounded-lg bg-warm-white px-3 py-2 font-mono text-[0.85rem]">
                        NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
                      </code>
                    </>
                  ) : (
                    <>A confirmação pelo WhatsApp ainda não está disponível. Por favor, avise a família diretamente. 💛</>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3 pt-1">
                <button type="submit" className="btn btn-primary text-lg">
                  Claro que vou!
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => submit(false)}>
                  Não vou conseguir
                </button>
              </div>
            </form>

            {/* Microinteração antes de abrir o WhatsApp */}
            <AnimatePresence>
              {phase.kind !== "form" && (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[30px] bg-warm-white px-6 text-center"
                  role="status"
                  aria-live="assertive"
                >
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0, x: reduce ? 0 : -40, y: reduce ? 0 : 16, rotate: reduce ? 0 : -10 }}
                    animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="anim-flap">
                      <Scene name="pomba" className="h-auto w-20" />
                    </div>
                  </motion.div>
                  <p className="mt-4 font-serif text-[2rem] font-bold leading-tight text-brown">
                    {phase.attending ? "Lugar reservado a bordo! 💛" : "Obrigado por avisar 💛"}
                  </p>
                  {phase.kind === "sending" ? (
                    <p className="mt-3 text-[1rem] text-brown/75">Abrindo o WhatsApp…</p>
                  ) : (
                    <>
                      <p className="mt-3 max-w-[28ch] text-[1rem] leading-relaxed text-brown/80">
                        {phase.attending
                          ? "É só enviar a mensagem que já preparamos no WhatsApp."
                          : "Sua mensagem já está prontinha no WhatsApp para enviar."}
                      </p>
                      <a href={phase.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
                        Abrir o WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => setPhase({ kind: "form" })}
                        className="mt-3 min-h-12 px-4 text-[0.98rem] font-bold text-olive underline decoration-sand decoration-2 underline-offset-4"
                      >
                        Voltar e editar resposta
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <div className="md:col-span-2">
          <p className="mt-14 text-center font-script text-2xl text-olive">Até lá! 💛</p>
          <p className="mt-2 text-center text-xs font-semibold text-brown/75">Feito com carinho para a primeira grande aventura do Kalleb.</p>
        </div>
      </div>
    </section>
  );
}
