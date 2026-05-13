"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "fr" | "de" | "lu";

const languageLabels: Record<Language, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
  lu: "LU"
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.pricing": "Pricing",
    "nav.bundles": "Bundles",
    "nav.robot": "Robot Rental",
    "nav.about": "About",
    "nav.equipment": "Equipment",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.book": "Book",
    "nav.language": "Language",
    "services.lawn": "Lawn Care",
    "services.hedge": "Hedge Care",
    "services.leaves": "Leaf Clearing",
    "services.pressure": "Pressure Washing",
    "services.winter": "Winter Services",
    "services.robot": "Robot Mower Rental",
    "account.login": "Login",
    "account.account": "Account",
    "account.signedInAs": "Signed in as",
    "account.dashboard": "My Dashboard",
    "account.bookings": "My Bookings",
    "account.admin": "Admin Dashboard",
    "account.employee": "Employee Portal",
    "account.settings": "Settings",
    "account.logout": "Logout",
    "footer.pages": "Pages",
    "footer.areas": "Service Areas",
    "footer.copy": "Simple, seasonal garden care with clear pricing before we visit. Lawn mowing, hedge care, pressure washing, winter salting, and robot mower rental across Luxembourg.",
    "footer.other": "Other areas on request.",
    "floating.quote": "Floating quote",
    "pricing.eyebrow": "Transparent Luxembourg pricing",
    "pricing.title": "Build your garden care estimate in seconds.",
    "pricing.subtitle": "Adjust the sliders, choose your add-ons, and see a transparent Luxembourg-based estimate before booking.",
    "pricing.card.lawn": "Lawn visit",
    "pricing.card.garden": "Garden maintenance",
    "pricing.card.robot": "Robot rental",
    "pricing.card.winter": "Winter safety",
    "pricing.badge.market": "Based on Luxembourg market rates",
    "pricing.badge.callout": "No hidden call-out fee shown after booking",
    "pricing.badge.savings": "Bundle savings available",
    "pricing.badge.quote": "Final quote confirmed before work",
    "assistant.button": "Ask pricing assistant",
    "assistant.title": "LuxLawn Assistant",
    "assistant.note": "Rule-based helper, no AI cost",
    "assistant.close": "Close assistant",
    "assistant.placeholder": "Ask about price, bundles, booking...",
    "assistant.book": "Book",
    "assistant.contact": "Contact",
    "assistant.welcome": "Hi, I’m the LuxLawn pricing assistant. I can help you choose a service, understand estimates, and decide whether to book a visit.",
    "assistant.fallback": "I can help with lawn mowing, hedges, leaves, pressure washing, winter salting, bundles, robot mower rental, and booking. Try asking about your garden size, season, or service type.",
    "assistant.prompt.lawn": "How much for a 300m² lawn?",
    "assistant.prompt.bundle": "Which bundle should I choose?",
    "assistant.prompt.robot": "Robot mower rental vs buying?",
    "assistant.prompt.cancel": "Can I cancel or reschedule?",
    "assistant.prompt.quote": "What affects the final quote?"
  },
  fr: {
    "nav.home": "Accueil",
    "nav.services": "Services",
    "nav.pricing": "Tarifs",
    "nav.bundles": "Forfaits",
    "nav.robot": "Robot tondeuse",
    "nav.about": "À propos",
    "nav.equipment": "Équipement",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.book": "Réserver",
    "nav.language": "Langue",
    "services.lawn": "Tonte de pelouse",
    "services.hedge": "Taille de haies",
    "services.leaves": "Ramassage des feuilles",
    "services.pressure": "Nettoyage haute pression",
    "services.winter": "Services d’hiver",
    "services.robot": "Location robot tondeuse",
    "account.login": "Connexion",
    "account.account": "Compte",
    "account.signedInAs": "Connecté en tant que",
    "account.dashboard": "Mon tableau de bord",
    "account.bookings": "Mes réservations",
    "account.admin": "Admin",
    "account.employee": "Portail employé",
    "account.settings": "Réglages",
    "account.logout": "Déconnexion",
    "footer.pages": "Pages",
    "footer.areas": "Zones desservies",
    "footer.copy": "Entretien de jardin simple et saisonnier, avec des tarifs clairs avant notre visite. Tonte, haies, nettoyage haute pression, salage hivernal et location de robots tondeuses au Luxembourg.",
    "footer.other": "Autres communes sur demande.",
    "floating.quote": "Devis rapide",
    "pricing.eyebrow": "Tarifs transparents au Luxembourg",
    "pricing.title": "Construisez votre estimation jardin en quelques secondes.",
    "pricing.subtitle": "Ajustez les curseurs, choisissez vos options et obtenez une estimation luxembourgeoise transparente avant de réserver.",
    "pricing.card.lawn": "Visite pelouse",
    "pricing.card.garden": "Entretien jardin",
    "pricing.card.robot": "Location robot",
    "pricing.card.winter": "Sécurité hiver",
    "pricing.badge.market": "Basé sur les tarifs du marché luxembourgeois",
    "pricing.badge.callout": "Pas de frais cachés ajoutés après réservation",
    "pricing.badge.savings": "Économies possibles avec les forfaits",
    "pricing.badge.quote": "Devis final confirmé avant intervention",
    "assistant.button": "Aide tarifs",
    "assistant.title": "Assistant LuxLawn",
    "assistant.note": "Aide guidée, sans coût IA",
    "assistant.close": "Fermer l’assistant",
    "assistant.placeholder": "Question sur prix, forfaits, réservation...",
    "assistant.book": "Réserver",
    "assistant.contact": "Contact",
    "assistant.welcome": "Bonjour, je suis l’assistant tarifs LuxLawn. Je peux vous aider à choisir un service, comprendre les estimations et décider si une visite est utile.",
    "assistant.fallback": "Je peux aider avec la tonte, les haies, les feuilles, le nettoyage haute pression, le salage, les forfaits, la location robot et la réservation.",
    "assistant.prompt.lawn": "Prix pour 300 m² de pelouse ?",
    "assistant.prompt.bundle": "Quel forfait choisir ?",
    "assistant.prompt.robot": "Location robot ou achat ?",
    "assistant.prompt.cancel": "Annuler ou déplacer ?",
    "assistant.prompt.quote": "Pourquoi le devis change ?"
  },
  de: {
    "nav.home": "Start",
    "nav.services": "Leistungen",
    "nav.pricing": "Preise",
    "nav.bundles": "Pakete",
    "nav.robot": "Mähroboter",
    "nav.about": "Über uns",
    "nav.equipment": "Ausrüstung",
    "nav.faq": "FAQ",
    "nav.contact": "Kontakt",
    "nav.book": "Buchen",
    "nav.language": "Sprache",
    "services.lawn": "Rasenpflege",
    "services.hedge": "Heckenpflege",
    "services.leaves": "Laubentfernung",
    "services.pressure": "Hochdruckreinigung",
    "services.winter": "Winterdienst",
    "services.robot": "Mähroboter-Miete",
    "account.login": "Login",
    "account.account": "Konto",
    "account.signedInAs": "Angemeldet als",
    "account.dashboard": "Mein Dashboard",
    "account.bookings": "Meine Buchungen",
    "account.admin": "Admin-Dashboard",
    "account.employee": "Mitarbeiterportal",
    "account.settings": "Einstellungen",
    "account.logout": "Abmelden",
    "footer.pages": "Seiten",
    "footer.areas": "Einsatzgebiete",
    "footer.copy": "Einfache saisonale Gartenpflege mit klaren Preisen vor dem Besuch. Rasenmähen, Heckenpflege, Hochdruckreinigung, Winterstreuen und Mähroboter-Miete in Luxemburg.",
    "footer.other": "Weitere Orte auf Anfrage.",
    "floating.quote": "Schnellangebot",
    "pricing.eyebrow": "Transparente Preise in Luxemburg",
    "pricing.title": "Erstellen Sie Ihre Gartenschätzung in Sekunden.",
    "pricing.subtitle": "Passen Sie Regler und Zusatzleistungen an und erhalten Sie vor der Buchung eine transparente Schätzung für Luxemburg.",
    "pricing.card.lawn": "Rasenbesuch",
    "pricing.card.garden": "Gartenpflege",
    "pricing.card.robot": "Robotermiete",
    "pricing.card.winter": "Wintersicherheit",
    "pricing.badge.market": "Basierend auf Luxemburger Marktpreisen",
    "pricing.badge.callout": "Keine versteckten Anfahrtskosten nach der Buchung",
    "pricing.badge.savings": "Paketvorteile verfügbar",
    "pricing.badge.quote": "Endpreis wird vor der Arbeit bestätigt",
    "assistant.button": "Preisassistent",
    "assistant.title": "LuxLawn Assistent",
    "assistant.note": "Regelbasierte Hilfe, keine KI-Kosten",
    "assistant.close": "Assistent schließen",
    "assistant.placeholder": "Fragen zu Preis, Paketen, Buchung...",
    "assistant.book": "Buchen",
    "assistant.contact": "Kontakt",
    "assistant.welcome": "Hallo, ich bin der LuxLawn Preisassistent. Ich helfe bei Serviceauswahl, Schätzungen und Buchungsfragen.",
    "assistant.fallback": "Ich helfe mit Rasenmähen, Hecken, Laub, Hochdruckreinigung, Winterdienst, Paketen, Mähroboter-Miete und Buchungen.",
    "assistant.prompt.lawn": "Preis für 300 m² Rasen?",
    "assistant.prompt.bundle": "Welches Paket passt?",
    "assistant.prompt.robot": "Mieten oder kaufen?",
    "assistant.prompt.cancel": "Stornieren oder umbuchen?",
    "assistant.prompt.quote": "Was ändert den Endpreis?"
  },
  lu: {
    "nav.home": "Home",
    "nav.services": "Servicer",
    "nav.pricing": "Präisser",
    "nav.bundles": "Packagen",
    "nav.robot": "Roboterméier",
    "nav.about": "Iwwer eis",
    "nav.equipment": "Equipement",
    "nav.faq": "FAQ",
    "nav.contact": "Kontakt",
    "nav.book": "Buchen",
    "nav.language": "Sprooch",
    "services.lawn": "Wiss fleegen",
    "services.hedge": "Hecken schneiden",
    "services.leaves": "Blieder ewechmaachen",
    "services.pressure": "Héichdrock botzen",
    "services.winter": "Wanterservice",
    "services.robot": "Roboterméier lounen",
    "account.login": "Aloggen",
    "account.account": "Kont",
    "account.signedInAs": "Ageloggt als",
    "account.dashboard": "Mäin Dashboard",
    "account.bookings": "Meng Buchungen",
    "account.admin": "Admin Dashboard",
    "account.employee": "Employé Portal",
    "account.settings": "Astellungen",
    "account.logout": "Ausloggen",
    "footer.pages": "Säiten",
    "footer.areas": "Servicegebidder",
    "footer.copy": "Einfach saisonal Gaardefleeg mat kloere Präisser virum Besuch. Wiss méien, Hecken, Héichdrockbotzen, Streuen am Wanter a Roboterméier-Locatioun zu Lëtzebuerg.",
    "footer.other": "Aner Gemengen op Ufro.",
    "floating.quote": "Schnell Devis",
    "pricing.eyebrow": "Transparent Präisser zu Lëtzebuerg",
    "pricing.title": "Maacht Är Gaarde-Schätzung a Sekonnen.",
    "pricing.subtitle": "Passt d’Regler un, wielt Optiounen a kritt eng transparent Lëtzebuerger Schätzung virum Buchen.",
    "pricing.card.lawn": "Wiss-Besuch",
    "pricing.card.garden": "Gaardefleeg",
    "pricing.card.robot": "Robot lounen",
    "pricing.card.winter": "Wantersécherheet",
    "pricing.badge.market": "Baséiert op Lëtzebuerger Maartpräisser",
    "pricing.badge.callout": "Keng verstoppt Fraisen no der Buchung",
    "pricing.badge.savings": "Spueren duerch Packagen",
    "pricing.badge.quote": "Finalen Devis virun der Aarbecht confirméiert",
    "assistant.button": "Präisassistent",
    "assistant.title": "LuxLawn Assistent",
    "assistant.note": "Regelbaséiert Hëllef, keng AI-Käschten",
    "assistant.close": "Assistent zoumaachen",
    "assistant.placeholder": "Fro iwwer Präis, Packagen, Buchung...",
    "assistant.book": "Buchen",
    "assistant.contact": "Kontakt",
    "assistant.welcome": "Moien, ech sinn de LuxLawn Präisassistent. Ech hëllefen Iech beim Service auswielen, Schätzunge verstoen a buchen.",
    "assistant.fallback": "Ech hëllefe bei Wiss méien, Hecken, Blieder, Héichdrockbotzen, Wanterservice, Packagen, Roboterméier lounen a Buchungen.",
    "assistant.prompt.lawn": "Präis fir 300 m² Wiss?",
    "assistant.prompt.bundle": "Wéi ee Package passt?",
    "assistant.prompt.robot": "Robot lounen oder kafen?",
    "assistant.prompt.cancel": "Annuléieren oder verréckelen?",
    "assistant.prompt.quote": "Wat ännert de finale Präis?"
  }
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
      t: (key: string) => translations[language][key] ?? translations.en[key] ?? key
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
