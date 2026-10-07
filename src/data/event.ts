export const event = {
  childName: "Kalleb",
  age: 1,
  dateLabel: "24 de outubro",
  dayLabel: "Sábado",
  timeLabel: "16h30",
  addressLine1: "Rua Carnaubas, 304",
  addressLine2: "Jd. Pinheirinho",
  mapsQuery: "Rua Carnaubas, 304 - Jd. Pinheirinho",
  // Sábado, 24/10/2026, 16h30 em Brasília (UTC−3). Duração estimada: 3h.
  startUtc: "2026-10-24T19:30:00Z",
  endUtc: "2026-10-24T22:30:00Z",
  gifts: [
    { id: "roupas", title: "Roupinhas", detail: "Tamanho 1–2", text: "Para acompanhar as próximas aventuras." },
    { id: "sapatos", title: "Sapatinhos", detail: "Tamanho 23–24", text: "Para os próximos passinhos e descobertas." },
    { id: "brinquedo", title: "Brinquedo", detail: null, text: "Uma opção divertida para acompanhar as próximas descobertas." },
  ],
} as const;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapsQuery)}`;
