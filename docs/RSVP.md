# RSVP — Confirmação pelo WhatsApp

> Substitui a versão anterior com Supabase e `/admin`. Não há banco de dados nem painel.

- A confirmação é a **última seção** do site (`#confirmar`).
- Campos: Nome, Quantos adultos?, Quantas crianças?
- "Claro que vou!": exige nome e adultos ≥ 1 (crianças ≥ 0).
- "Não vou conseguir": exige apenas o nome.
- Antes de abrir o WhatsApp, microinteração de ~600 ms:
  "Lugar reservado a bordo! 💛" / "Obrigado por avisar 💛".
- Abre `https://wa.me/{NEXT_PUBLIC_WHATSAPP_NUMBER}?text={encodeURIComponent(mensagem)}`.
  No celular navega direto (abre o app, sem bloqueio de pop-up); no desktop abre nova aba.
  A tela de retorno mantém um botão "Abrir o WhatsApp" como alternativa.

Implementação: `src/components/RSVP.tsx` e `src/lib/whatsapp.ts`.
