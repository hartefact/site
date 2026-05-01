import { HeroSection } from "@/components/hero/HeroSection";
import { UseCasesSection } from "@/components/home/UseCasesSection";
import { IntroSection } from "@/components/home/IntroSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <UseCasesSection />
      <IntroSection />
    </>
  );
}
