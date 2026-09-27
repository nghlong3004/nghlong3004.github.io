import { useLanguage } from "../hooks/useLanguage";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`size-10 flex items-center justify-center rounded-full text-foreground/80 hover:text-foreground hover:bg-foreground/10 active:scale-95 transition-all text-base font-medium cursor-pointer ${className}`}
      aria-label="Toggle language"
      title={language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
    >
      <span className="text-base sm:text-lg leading-none select-none">
        {language === "vi" ? "🇻🇳" : "🇬🇧"}
      </span>
    </button>
  );
}

export default LanguageToggle;
