import { useEffect, useState, type ReactNode } from "react";
import type { Language } from "../i18n/types";
import { translations } from "../i18n/translations";
import { LanguageContext } from "./languageContextDef";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem("lang") as Language | null;
    if (saved === "en" || saved === "vi") return saved;
    const browserLang = navigator.language?.toLowerCase();
    if (browserLang?.startsWith("vi")) return "vi";
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", language);
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "vi" : "en"));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
