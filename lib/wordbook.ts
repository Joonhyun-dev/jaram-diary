import type { LanguageCode } from "@/lib/translations"

export interface WordbookEntry {
  id: number
  word: string
  pronunciation: string
  meaning: string
  exampleSentence: string
  savedAt: string
  translations?: Partial<Record<LanguageCode, { meaning?: string; example?: string }>>
}

const WORDBOOK_STORAGE_KEY = "jaram-wordbook"

function parseWordbook(raw: string | null): WordbookEntry[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is WordbookEntry =>
        typeof item?.id === "number" &&
        typeof item?.word === "string" &&
        typeof item?.meaning === "string" &&
        typeof item?.exampleSentence === "string" &&
        typeof item?.pronunciation === "string" &&
        typeof item?.savedAt === "string"
    )
  } catch (error) {
    console.warn("[wordbook] Failed to parse saved entries.", error)
    return []
  }
}

function persistWordbook(entries: WordbookEntry[]): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(WORDBOOK_STORAGE_KEY, JSON.stringify(entries))
}

export function loadWordbookEntries(): WordbookEntry[] {
  if (typeof window === "undefined") return []
  const entries = parseWordbook(window.localStorage.getItem(WORDBOOK_STORAGE_KEY))
  return entries.sort((a, b) => b.savedAt.localeCompare(a.savedAt))
}

export function upsertWordbookEntry(entry: WordbookEntry): WordbookEntry[] {
  if (typeof window === "undefined") return []
  const entries = loadWordbookEntries()
  const existing = entries.find((item) => item.id === entry.id)
  const mergedTranslations =
    existing?.translations || entry.translations
      ? {
          ...existing?.translations,
          ...entry.translations,
        }
      : undefined
  const nextEntry: WordbookEntry = {
    ...existing,
    ...entry,
    translations: mergedTranslations,
  }
  const next = entries.filter((item) => item.id !== entry.id)
  next.unshift(nextEntry)
  persistWordbook(next)
  return next
}

export function removeWordbookEntry(id: number): WordbookEntry[] {
  if (typeof window === "undefined") return []
  const entries = loadWordbookEntries()
  const next = entries.filter((item) => item.id !== id)
  persistWordbook(next)
  return next
}
