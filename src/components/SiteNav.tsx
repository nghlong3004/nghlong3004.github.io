import { useState, useEffect, type RefObject } from "react";
import type Lenis from "lenis";
import { MoveUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SOCIAL_LINKS } from "@/data/socials";
import { useLanguage } from "../hooks/useLanguage";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa6";

export interface SiteNavProps {
  lenisRef: RefObject<Lenis | null>;
}

export function SiteNav({ lenisRef }: SiteNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useLanguage();

  const MENU_LINKS = [
    { name: language === "vi" ? "Trang chủ" : "Home", url: "#top" },
    { name: t.nav.story, url: "#story" },
    { name: t.nav.experience, url: "#experience" },
    { name: t.nav.projects, url: "#projects" },
    { name: t.nav.impact, url: "#impact" },
    { name: t.nav.honors, url: "#honors" },
    { name: t.nav.contact, url: "#contact" },
  ];

  const handleMenuClick = (url: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      if (url === "#top" || url === "/") {
        lenisRef.current?.scrollTo(0);
      } else {
        const el = document.querySelector(url);
        if (el) {
          lenisRef.current?.scrollTo(el as HTMLElement);
        }
      }
    }, 120);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [isMenuOpen, lenisRef]);

  const getSocialIcon = (label: string) => {
    const key = label.toLowerCase();
    if (key.includes("github")) return <FaGithub size={17} />;
    if (key.includes("linkedin")) return <FaLinkedinIn size={17} />;
    if (key.includes("instagram")) return <FaInstagram size={17} />;
    return null;
  };

  return (
    <>
      {/* Floating Center Island Pill */}
      <div className="fixed top-3.5 sm:top-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <div className="flex items-center rounded-full border border-line-strong/60 bg-background/80 backdrop-blur-xl shadow-lg shadow-black/5 p-1 transition-all duration-300">
          <ThemeToggle />
          <div className="w-px h-5 bg-line-strong/60 mx-0.5" />
          <LanguageToggle />
          <div className="w-px h-5 bg-line-strong/60 mx-0.5" />
          <button
            type="button"
            className="group size-10 relative rounded-full transition-colors hover:bg-foreground/10 active:scale-95 flex items-center justify-center cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <span
              className={cn(
                "inline-block w-[18px] h-0.5 bg-foreground rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 duration-300 -translate-y-[4px]",
                {
                  "rotate-45 -translate-y-1/2": isMenuOpen,
                  "md:group-hover:rotate-12": !isMenuOpen,
                },
              )}
            />
            <span
              className={cn(
                "inline-block w-[18px] h-0.5 bg-foreground rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 duration-300 translate-y-[4px]",
                {
                  "-rotate-45 -translate-y-1/2": isMenuOpen,
                  "md:group-hover:-rotate-12": !isMenuOpen,
                },
              )}
            />
          </button>
        </div>
      </div>

      {/* Dim Overlay */}
      <div
        className={cn(
          "overlay fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-all duration-300",
          {
            "opacity-0 invisible pointer-events-none": !isMenuOpen,
            "opacity-100 visible pointer-events-auto": isMenuOpen,
          },
        )}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      {/* Offcanvas Drawer (Centered 2-column balanced layout with clean spacing) */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-[100dvh] w-full sm:w-[500px] md:w-[540px] max-w-full transform translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-50 overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col justify-between py-6 px-6 sm:py-8 sm:px-8 bg-background/95 sm:bg-surface-2/95 backdrop-blur-2xl border-l border-line-strong/40 shadow-2xl",
          { "translate-x-0": isMenuOpen },
        )}
        aria-label="Navigation Drawer"
        aria-hidden={!isMenuOpen}
      >
        {/* Drawer Header with Close Button */}
        <div className="w-full max-w-[420px] sm:max-w-[440px] mx-auto flex items-center justify-between pb-6 border-b border-line/40 shrink-0">
          <div>
            <span className="font-display text-xl sm:text-2xl uppercase tracking-[-0.01em] text-foreground block">
              Nguyen Hoang Long
            </span>
            <p className="font-sans text-eyebrow uppercase tracking-[0.22em] text-muted-foreground mt-1">
              Backend & Systems Engineer
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="size-10 rounded-full border border-line-strong/60 hover:border-line-strong bg-surface/50 hover:bg-foreground/10 flex items-center justify-center text-foreground transition-all active:scale-95 cursor-pointer shrink-0"
            aria-label="Close menu"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Center content: 2 columns centered & positioned closer together */}
        <div className="grow flex flex-col justify-center py-6 sm:py-8 w-full">
          <div className="w-full max-w-[420px] sm:max-w-[440px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
            {/* Column 1: Navigation Links */}
            <div>
              <p className="font-sans text-eyebrow uppercase tracking-[0.22em] text-muted-foreground mb-4">
                {language === "vi" ? "ĐIỀU HƯỚNG" : "NAVIGATION"}
              </p>
              <ul className="space-y-1 sm:space-y-1.5">
                {MENU_LINKS.map((link, idx) => (
                  <li key={link.url}>
                    <button
                      type="button"
                      onClick={() => handleMenuClick(link.url)}
                      className="group w-full py-1.5 px-2 -mx-2 flex items-center justify-between text-left transition-all cursor-pointer rounded-lg hover:bg-foreground/5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-sans text-xs font-semibold text-muted-foreground/60 tabular-nums transition-colors duration-200 group-hover:text-primary shrink-0">
                          0{idx + 1}
                        </span>
                        <span className="font-display text-xl sm:text-2xl uppercase tracking-[-0.01em] text-foreground transition-all duration-200 group-hover:text-primary group-hover:translate-x-1">
                          {link.name}
                        </span>
                      </div>
                      <MoveUpRight
                        size={15}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-primary transition-all duration-200 shrink-0"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Social Links & Contact Details */}
            <div className="space-y-6 sm:space-y-7">
              {/* Social Links */}
              <div>
                <p className="font-sans text-eyebrow uppercase tracking-[0.22em] text-muted-foreground mb-4">
                  {language === "vi" ? "MẠNG XÃ HỘI" : "SOCIAL"}
                </p>
                <ul className="space-y-1.5 sm:space-y-2">
                  {SOCIAL_LINKS.map((link) => {
                    const Icon = getSocialIcon(link.label);
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group py-1.5 px-2 -mx-2 rounded-lg hover:bg-foreground/5 flex items-center justify-between text-muted-foreground hover:text-foreground transition-all duration-200"
                        >
                          <div className="flex items-center gap-2.5">
                            {Icon && (
                              <span className="text-muted-foreground/80 group-hover:text-primary group-hover:scale-105 transition-all duration-200 shrink-0">
                                {Icon}
                              </span>
                            )}
                            <span className="font-sans text-sm sm:text-base font-medium">
                              {link.label}
                            </span>
                          </div>
                          <MoveUpRight
                            size={14}
                            className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-primary transition-all duration-200 shrink-0"
                          />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Direct Contact Info */}
              <div className="pt-4 border-t border-line/40 space-y-3">
                <div>
                  <p className="font-sans text-eyebrow uppercase tracking-[0.22em] text-muted-foreground mb-1.5">
                    {language === "vi" ? "LIÊN HỆ TRỰC TIẾP" : "DIRECT CONTACT"}
                  </p>
                  <a
                    href="mailto:nghlong3004@gmail.com"
                    className="font-sans text-sm sm:text-base font-medium text-foreground hover:text-primary transition-colors block break-all"
                  >
                    nghlong3004@gmail.com
                  </a>
                </div>

                <div>
                  <p className="font-sans text-eyebrow uppercase tracking-[0.22em] text-muted-foreground mb-1">
                    {language === "vi" ? "VỊ TRÍ" : "LOCATION"}
                  </p>
                  <p className="font-sans text-sm text-foreground/80">
                    {language === "vi" ? "Hà Nội, Việt Nam" : "Hanoi, Vietnam"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer with subtle copyright */}
        <div className="w-full max-w-[420px] sm:max-w-[440px] mx-auto pt-4 border-t border-line/40 shrink-0 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center justify-between text-xs text-muted-foreground font-sans">
          <span>© {new Date().getFullYear()} Nguyen Hoang Long</span>
          <span className="hidden sm:inline">Backend & Systems Engineer</span>
        </div>
      </aside>
    </>
  );
}

export default SiteNav;
