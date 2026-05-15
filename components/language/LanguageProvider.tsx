"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import de from "@/messages/de.json";
import lb from "@/messages/lb.json";
import { phraseTranslations } from "@/messages/phrases";

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

  return (
    <LanguageContext.Provider value={value}>
      {children}
      <DomTranslator language={language} />
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}

const textOriginals = new WeakMap<Text, string>();
const attrOriginals = new WeakMap<Element, Record<string, string>>();

function DomTranslator({ language }: { language: Language }) {
  const pathname = usePathname();
  const previousLanguage = useRef<Language>("en");

  useEffect(() => {
    const wasTranslated = previousLanguage.current !== "en";
    previousLanguage.current = language;

    if (language === "en" && !wasTranslated) {
      return;
    }

    const run = () => translateNode(document.body, language);
    const idleId = scheduleIdle(run);
    const timeout = window.setTimeout(run, 450);

    return () => {
      cancelIdle(idleId);
      window.clearTimeout(timeout);
    };
  }, [language, pathname]);

  return null;
}

function scheduleIdle(callback: () => void) {
  if ("requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, { timeout: 700 });
  }
  return globalThis.setTimeout(callback, 120);
}

function cancelIdle(id: number | ReturnType<typeof setTimeout>) {
  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(id as number);
    return;
  }
  globalThis.clearTimeout(id);
}

function translateNode(root: Node, language: Language) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => {
    if (shouldSkip(node.parentElement)) return;
    if (!textOriginals.has(node)) textOriginals.set(node, node.nodeValue ?? "");
    const original = textOriginals.get(node) ?? "";
    const nextValue = translateWithWhitespace(original, language);
    if (node.nodeValue !== nextValue) {
      node.nodeValue = nextValue;
    }
  });

  if (root instanceof Element || root instanceof Document || root instanceof DocumentFragment) {
    const elements = root instanceof Element ? [root, ...Array.from(root.querySelectorAll("*"))] : Array.from((root as Document | DocumentFragment).querySelectorAll("*"));
    elements.forEach((element) => {
      if (shouldSkip(element)) return;
      ["placeholder", "aria-label", "title"].forEach((attr) => {
        const value = element.getAttribute(attr);
        if (!value) return;
        const originals = attrOriginals.get(element) ?? {};
        if (!originals[attr]) {
          originals[attr] = value;
          attrOriginals.set(element, originals);
        }
        const nextValue = translatePhrase(originals[attr], language);
        if (element.getAttribute(attr) !== nextValue) {
          element.setAttribute(attr, nextValue);
        }
      });
    });
  }
}

function shouldSkip(element: Element | null) {
  if (!element) return true;
  return Boolean(element.closest("script, style, code, pre, [data-no-translate]"));
}

function translateWithWhitespace(value: string, language: Language) {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const trimmed = value.trim();
  if (!trimmed) return value;
  return `${leading}${translatePhrase(trimmed, language)}${trailing}`;
}

function translatePhrase(value: string, language: Language) {
  if (language === "en") return value;
  return phraseTranslations[language][value] ?? dictionaries[language][value] ?? value;
}
