"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, Download, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { event, mapsUrl } from "@/data/event";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import { Leaves, Scene } from "./decor";
import { Reveal } from "./Reveal";

export function EventInfo() {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <section
      id="grande-dia"
      aria-labelledby="grande-dia-title"
      className="paper relative overflow-hidden pb-24 pt-24 md:pb-36 md:pt-32"
      style={{ background: "linear-gradient(180deg, #6FA9C9 0%, #A8D2E8 5%, #DCECF4 12%, #F8ECD8 26%, #F8ECD8 100%)" }}
    >
      <div className="gutter relative mx-auto grid max-w-5xl gap-14 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-20">
        {/* Data */}
        <div className="relative text-center md:text-left">
          <Reveal as="p" className="font-script text-[1.9rem] leading-tight text-olive md:text-4xl">
            Já pode marcar no calendário.
          </Reveal>
          <h2 id="grande-dia-title" className="sr-only">
            O grande dia: {event.dayLabel}, {event.dateLabel}, às {event.timeLabel}
          </h2>

          <Reveal delay={0.1} className="relative mx-auto mt-8 max-w-[22rem] md:mx-0" aria-hidden>
            <Leaves className="-left-3 -top-6 w-14 -rotate-[20deg] md:-left-16 md:-top-4" />
            <Leaves className="-right-2 -top-8 w-10 rotate-[28deg]" variant={2} />
            <p className="text-[0.95rem] font-extrabold uppercase tracking-[0.42em] text-sage">Sábado</p>
            <p className="mt-1 font-serif text-[4.6rem] font-bold leading-[0.85] text-brown md:text-[6.5rem]">
              24
              <span className="block text-[2.6rem] leading-tight md:text-[3.4rem]">de outubro</span>
            </p>
            <div className="plaque mx-auto mt-6 inline-flex items-center px-7 py-2.5 md:mx-0">
              <span className="font-serif text-[2.1rem] font-bold leading-none tracking-wide text-brown">16H30</span>
            </div>
          </Reveal>
        </div>

        {/* Detalhes */}
        <div className="relative text-center md:text-left">
          <Reveal as="p" className="mx-auto max-w-[30ch] text-[1.15rem] leading-relaxed text-brown md:mx-0 md:text-xl">
            Preparamos uma tarde para brincar, aproveitar, celebrar e criar boas lembranças juntos.
          </Reveal>

          <Reveal delay={0.1} className="mt-9 flex items-start justify-center gap-3 md:justify-start">
            <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-light text-olive">
              <MapPin size={20} aria-hidden />
            </span>
            <address className="text-left not-italic">
              <span className="block font-serif text-[1.6rem] font-bold leading-tight text-brown">{event.addressLine1}</span>
              <span className="block text-lg font-semibold text-brown/80">{event.addressLine2}</span>
            </address>
          </Reveal>

          <Reveal delay={0.2} className="mx-auto mt-9 flex max-w-sm flex-col gap-3 md:mx-0">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <Navigation size={19} aria-hidden />
              Como chegar
            </a>
            <button
              type="button"
              className="btn btn-secondary"
              aria-expanded={calendarOpen}
              aria-controls="calendar-options"
              onClick={() => setCalendarOpen((o) => !o)}
            >
              <CalendarPlus size={19} aria-hidden />
              Adicionar ao calendário
            </button>
            <AnimatePresence initial={false}>
              {calendarOpen && (
                <motion.div
                  id="calendar-options"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={googleCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-12 items-center justify-center rounded-2xl bg-sky-light px-3 text-center text-[0.95rem] font-bold text-brown"
                    >
                      Google Agenda
                    </a>
                    <button
                      type="button"
                      onClick={downloadIcs}
                      className="flex min-h-12 items-center justify-center gap-1.5 rounded-2xl bg-sky-light px-3 text-center text-[0.95rem] font-bold text-brown"
                    >
                      <Download size={16} aria-hidden />
                      iPhone / Outlook
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>

      <Reveal className="gutter relative mx-auto mt-20 max-w-xl text-center md:mt-28">
        <Scene name="onda-fundo" className="mx-auto mb-5 h-auto w-28 opacity-80" />
        <p className="font-script text-[1.85rem] leading-snug text-olive md:text-4xl">
          Chegue com vontade de aproveitar. O resto a gente prepara por aqui.
        </p>
      </Reveal>
    </section>
  );
}
