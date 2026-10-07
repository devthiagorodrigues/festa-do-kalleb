import { event } from "@/data/event";

const TITLE = "Aniversário de 1 ano do Kalleb";
const DETAILS = "Uma tarde para brincar, aproveitar, celebrar e criar boas lembranças juntos. 💛";
const LOCATION = `${event.addressLine1} - ${event.addressLine2}`;

/** 2026-10-24T19:30:00Z → 20261024T193000Z */
const compact = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: TITLE,
    dates: `${compact(event.startUtc)}/${compact(event.endUtc)}`,
    details: DETAILS,
    location: LOCATION,
    ctz: "America/Sao_Paulo",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const escapeIcs = (s: string) => s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");

export function icsContent() {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kalleb 1 ano//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:kalleb-1-ano-20261024@convite",
    `DTSTAMP:${compact(new Date().toISOString())}`,
    `DTSTART:${compact(event.startUtc)}`,
    `DTEND:${compact(event.endUtc)}`,
    `SUMMARY:${escapeIcs(TITLE)}`,
    `DESCRIPTION:${escapeIcs(DETAILS)}`,
    `LOCATION:${escapeIcs(LOCATION)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs("Amanhã é o aniversário do Kalleb!")}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs() {
  const blob = new Blob([icsContent()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kalleb-1-ano.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
