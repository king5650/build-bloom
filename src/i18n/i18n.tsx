import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "fr" | "en";
export type Bi = { fr: string; en: string };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (v: Bi) => string };

const LangContext = createContext<Ctx>({ lang: "fr", setLang: () => {}, t: (v) => v.fr });

const STORAGE_KEY = "as-africa-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "fr") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const value = useMemo<Ctx>(
    () => ({ lang, setLang, t: (v: Bi) => (lang === "en" ? v.en : v.fr) }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  return useContext(LangContext);
}