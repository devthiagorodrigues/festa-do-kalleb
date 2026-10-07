import { MotionProvider } from "@/components/MotionProvider";
import { Hero } from "@/components/Hero";
import { StoryIntro } from "@/components/StoryIntro";
import { ArkJourney } from "@/components/ArkJourney";
import { EventInfo } from "@/components/EventInfo";
import { GiftSuggestions } from "@/components/GiftSuggestions";
import { KallebGallery } from "@/components/KallebGallery";
import { Finale } from "@/components/Finale";
import { RSVP } from "@/components/RSVP";
import { FloatingNav } from "@/components/FloatingNav";

// Jornada: céu → Kalleb → um ano de descobertas → mar → Arca → o grande dia
// → sugestões → fotos → encerramento → confirmação (sempre a última seção).
export default function Home() {
  return (
    <MotionProvider>
      <main>
        <Hero />
        <StoryIntro />
        <ArkJourney />
        <EventInfo />
        <GiftSuggestions />
        <KallebGallery />
        <Finale />
        <RSVP />
      </main>
      <FloatingNav />
    </MotionProvider>
  );
}
