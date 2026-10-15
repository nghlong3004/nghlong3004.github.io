import { useState, useEffect } from "react";
import type Lenis from "lenis";
import { useAdaptiveGrid } from "./hooks/useAdaptiveGrid";
import { useLenis } from "./hooks/useLenis";
import { useLanguage } from "./hooks/useLanguage";
import { useTheme } from "./hooks/useTheme";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Preloader } from "./components/Preloader";
import { SiteNav } from "./components/SiteNav";
import { NetworkCanvas } from "./components/NetworkCanvas";
import GlowCursor from "./components/GlowCursor";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Story } from "./components/Story";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { ProjectDetails } from "./components/ProjectDetails";
import { Impact } from "./components/Impact";
import { Honors } from "./components/Honors";
import { Footer } from "@/components/ui/footer-section";
import { ScrollProgressIndicator } from "./components/ScrollProgressIndicator";

function AppContent({ lenisRef }: { lenisRef: React.RefObject<Lenis | null> }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const hash = window.location.hash;
    if (hash.startsWith("#/project/")) {
      return hash.replace("#/project/", "");
    }
    return null;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/project/")) {
        const id = hash.replace("#/project/", "");
        setSelectedProjectId(id);
        window.scrollTo(0, 0);
        lenisRef.current?.scrollTo(0, { immediate: true });
      } else {
        setSelectedProjectId(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, [lenisRef]);

  const handleOpenProject = (id: string) => {
    setSelectedProjectId(id);
    window.location.hash = `#/project/${id}`;
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
  };

  const handleBackToHome = () => {
    setSelectedProjectId(null);
    window.location.hash = "#projects";
    setTimeout(() => {
      const el = document.getElementById("projects");
      if (el) {
        lenisRef.current?.scrollTo(el);
      }
    }, 60);
  };

  const activeProject = selectedProjectId
    ? t.projects.projects.find(
        (p) => p.id === selectedProjectId || p.slug === selectedProjectId
      )
    : null;

  return (
    <>
      <Preloader lenisRef={lenisRef} />
      <SiteNav lenisRef={lenisRef} />
      <ScrollProgressIndicator />
      <NetworkCanvas />
      <GlowCursor
        className="!fixed !inset-0 pointer-events-none z-30"
        theme={theme}
        color={theme === "dark" ? "#38bdf8" : "#0284c7"}
        intensity={1.1}
        trailWidth={2}
        linger={0.65}
        glow={1.3}
        hotspot={0.2}
        clickBurst={true}
      />

      {activeProject ? (
        <main className="relative w-full overflow-x-hidden">
          <ProjectDetails project={activeProject} onBack={handleBackToHome} />
          <Footer />
        </main>
      ) : (
        <main className="relative w-full overflow-x-hidden">
          <Hero />
          <Marquee />
          <Story />
          <Experience />
          <Projects onSelectProject={handleOpenProject} />
          <Impact />
          <Honors />
          <Footer />
        </main>
      )}
    </>
  );
}

export default function App() {
  useAdaptiveGrid();
  const lenisRef = useLenis();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent lenisRef={lenisRef} />
      </LanguageProvider>
    </ThemeProvider>
  );
}
