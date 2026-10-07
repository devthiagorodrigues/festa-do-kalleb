# Kalleb — A primeira grande aventura

Site mobile-first do aniversário de 1 ano do Kalleb.
Sábado, 24 de outubro, 16h30 — Rua Carnaubas, 304, Jd. Pinheirinho.

## Stack
Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide (ícones funcionais).
Sem banco de dados, sem Supabase, sem painel administrativo.

## Rodando localmente
```bash
npm install
cp .env.example .env.local   # e preencha o número
npm run dev                  # http://localhost:3000
npm run lint
npm run build
```

## Confirmação de presença (WhatsApp)
A confirmação é a **última seção** do site e abre o WhatsApp da mãe do Kalleb com a
mensagem já preenchida (`https://wa.me/{NUMERO}?text=...`). Nenhum dado é salvo.

Configure a variável de ambiente (local em `.env.local`; na Vercel em
*Project → Settings → Environment Variables*):

```
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

Formato: só números — país + DDD + número, sem `+`, espaços, parênteses ou traços.
Por ser `NEXT_PUBLIC_`, o valor entra no build: **depois de alterar, faça um novo deploy**.
Sem a variável, o site funciona normalmente e a seção mostra um aviso (detalhado em
desenvolvimento, gentil em produção).

## Deploy na Vercel
1. Importe o repositório na Vercel (framework detectado: Next.js).
2. Adicione `NEXT_PUBLIC_WHATSAPP_NUMBER`.
3. Opcional: `NEXT_PUBLIC_SITE_URL` com o domínio final (usado nas URLs do Open Graph;
   sem ela, usa o domínio de produção da Vercel).

O site está com `noindex` (convite pessoal, com fotos de bebê): ele não aparece em buscadores,
mas o link compartilhado funciona e gera a prévia (OG) normalmente.

## Imagens
Os originais ficam em `assets/` (fora de `public/`, então não são publicados). As versões usadas pelo site (WebP, recortadas e com
o halo de recorte limpo) ficam em `public/img/`, junto de `public/og.jpg` e dos ícones em `app/`.
Se trocar/adicionar fotos em `assets/kalleb/` (`foto-XX.png`), rode:

```bash
npm run optimize-images
```

e ajuste a lista `PHOTOS` em `src/components/KallebGallery.tsx`.

## Estrutura
```
app/layout.tsx            metadados, fontes, viewport/theme-color
app/page.tsx              ordem da jornada (Confirmação é sempre a última)
src/components/
  Hero.tsx                céu + foto real + placa da marca
  StoryIntro.tsx          "Um ano de descobertas"
  ArkJourney.tsx          seção sticky da Arca (camadas: arca → animais recortados → ondas)
  EventInfo.tsx           o grande dia, mapa e calendário (.ics / Google Agenda)
  GiftSuggestions.tsx     sugestões de presentes (sem reserva)
  KallebGallery.tsx       galeria horizontal com scroll snap
  Finale.tsx              encerramento emocional
  RSVP.tsx                confirmação via WhatsApp
  FloatingNav.tsx         menu flutuante
src/lib/whatsapp.ts       montagem da mensagem e da URL
src/lib/calendar.ts       evento para calendário
scripts/optimize-images.mjs
```
