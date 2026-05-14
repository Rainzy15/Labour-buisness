"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import de from "@/messages/de.json";
import lb from "@/messages/lb.json";

export type Language = "en" | "fr" | "de" | "lb";

const dictionaries: Record<Language, Record<string, string>> = { en, fr, de, lb };

const languageLabels: Record<Language, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
  lb: "LB"
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  languageLabels: Record<Language, string>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("luxlawn-language") as Language | null;
    if (saved && saved in languageLabels) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("luxlawn-language", nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languageLabels,
      t: (key: string) => dictionaries[language][key] ?? dictionaries.en[key] ?? key
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
