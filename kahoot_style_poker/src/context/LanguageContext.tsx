// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState } from "react";

type Language = "en" | "no";

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (sessionStorage.getItem("language") as Language) || "en";
  });

  const toggleLanguage = () => {
    const newLang = language === "en" ? "no" : "en";
    setLanguage(newLang);
    sessionStorage.setItem("language", newLang); // persist between refreshes
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
