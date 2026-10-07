# Arquitetura

Stack: Next.js App Router + TypeScript + Tailwind CSS + Framer Motion. RSVP via WhatsApp (sem Supabase, sem banco, sem /admin — ver RSVP.md). GSAP/ScrollTrigger apenas se necessário na seção sticky da Arca.

Estrutura sugerida:
```txt
app/page.tsx
src/components/Hero.tsx
src/components/StoryIntro.tsx
src/components/ArkJourney.tsx
src/components/EventInfo.tsx
src/components/GiftSuggestions.tsx
src/components/RSVP.tsx
src/components/KallebGallery.tsx
src/components/Finale.tsx
src/components/FloatingNav.tsx
src/data/event.ts
src/lib/whatsapp.ts
src/lib/calendar.ts
```

Navegação flutuante discreta: O Kalleb / O grande dia / Sugestões / Fotos / Confirmar presença (leva à última seção).
