import { event } from "@/data/event";

export type RsvpAnswer =
  | { attending: true; name: string; adults: number; children: number }
  | { attending: false; name: string };

/** Número configurado em NEXT_PUBLIC_WHATSAPP_NUMBER, validado (só dígitos, 10–15). */
export function getWhatsAppNumber(): string | null {
  const raw = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").trim();
  return /^\d{10,15}$/.test(raw) ? raw : null;
}

export function hasInvalidWhatsAppNumber(): boolean {
  const raw = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").trim();
  return raw.length > 0 && getWhatsAppNumber() === null;
}

export function buildMessage(answer: RsvpAnswer): string {
  const name = answer.name.trim().replace(/\s+/g, " ");
  if (answer.attending) {
    return [
      "Oi! 💛",
      `Estou passando para confirmar nossa presença no aniversário de 1 ano do ${event.childName}! 🎉`,
      "",
      `Nome: ${name}`,
      `Adultos: ${answer.adults}`,
      `Crianças: ${answer.children}`,
      "",
      `Estaremos com vocês no dia ${event.dateLabel}, às ${event.timeLabel}. 💛`,
    ].join("\n");
  }
  return [
    "Oi! 💛",
    `Passando para avisar que infelizmente não vou conseguir estar no aniversário de 1 ano do ${event.childName} no dia ${event.dateLabel}.`,
    "",
    `Nome: ${name}`,
    "",
    "Desejamos um dia lindo para vocês! 💛",
  ].join("\n");
}

export function buildWhatsAppUrl(number: string, answer: RsvpAnswer): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(buildMessage(answer))}`;
}
