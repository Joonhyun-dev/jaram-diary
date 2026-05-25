"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { LANGUAGES, type LanguageCode } from "@/lib/translations"

type LanguageContextValue = {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)
const STORAGE_KEY = "jaram-native-language"

function isLanguageCode(value: string): value is LanguageCode {
  return LANGUAGES.some((lang) => lang.code === value)
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>("ko")

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && isLanguageCode(stored)) {
      setLanguage(stored)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const value = useMemo(() => ({ language, setLanguage }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
