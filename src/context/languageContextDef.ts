import { createContext } from "react";
import type { Language, TranslationDictionary } from "../i18n/types";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);
