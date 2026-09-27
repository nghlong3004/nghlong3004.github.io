import { useAdaptiveGrid } from "./hooks/useAdaptiveGrid";
import { useLenis } from "./hooks/useLenis";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Preloader } from "./components/Preloader";
import { SiteNav } from "./components/SiteNav";
import { NetworkCanvas } from "./components/NetworkCanvas";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Story } from "./components/Story";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Impact } from "./components/Impact";
import { Honors } from "./components/Honors";
import { Footer } from "@/components/ui/footer-section";
import { ScrollProgressIndicator } from "./components/ScrollProgressIndicator";

export default function App() {
  useAdaptiveGrid();
  const lenisRef = useLenis();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Preloader lenisRef={lenisRef} />
        <SiteNav lenisRef={lenisRef} />
        <ScrollProgressIndicator />
        <NetworkCanvas />
        <main className="relative w-full overflow-x-hidden">
          <Hero />
          <Marquee />
          <Story />
          <Experience />
          <Projects />
          <Impact />
          <Honors />
          <Footer />
        </main>
      </LanguageProvider>
    </ThemeProvider>
  );
}
