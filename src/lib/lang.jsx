import { createContext, useContext, useEffect, useState } from "react";
import { TEXT } from "../data/content";

/* Хэлний context: аль ч компонентоос useLang()-аар хэл, текстийг авна */
const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("lang") || "mn"; } catch { return "mn"; }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem("lang", lang); } catch {}
  }, [lang]);

  const toggle = () => setLang((l) => (l === "mn" ? "en" : "mn"));
  return <LangContext.Provider value={{ lang, t: TEXT[lang], toggle }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
