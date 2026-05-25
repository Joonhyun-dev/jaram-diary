import { isSameDay, startOfDay, subDays } from "date-fns"
import type { LanguageCode } from "@/lib/translations"

export interface DiaryArchiveEntry {
  id: string
  createdAt: string
  original: string
  corrected: string
  feedback: string
  language: LanguageCode
}

const STORAGE_KEY = "jaram-diary-archive"

function parseArchive(raw: string | null): DiaryArchiveEntry[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is DiaryArchiveEntry =>
        typeof item?.id === "string" &&
        typeof item?.createdAt === "string" &&
        typeof item?.original === "string" &&
        typeof item?.corrected === "string" &&
        typeof item?.feedback === "string" &&
        typeof item?.language === "string"
    )
  } catch (error) {
    console.warn("[archive] Failed to parse saved entries.", error)
    return []
  }
}

function persistArchive(entries: DiaryArchiveEntry[]): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function loadArchiveEntries(): DiaryArchiveEntry[] {
  if (typeof window === "undefined") return []
  const entries = parseArchive(window.localStorage.getItem(STORAGE_KEY))
  return entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function addArchiveEntry(
  entry: Omit<DiaryArchiveEntry, "id" | "createdAt"> & {
    id?: string
    createdAt?: string
  }
): DiaryArchiveEntry[] {
  if (typeof window === "undefined") return []
  const entries = loadArchiveEntries()
  const nextEntry: DiaryArchiveEntry = {
    id: entry.id ?? generateId(),
    createdAt: entry.createdAt ?? new Date().toISOString(),
    original: entry.original,
    corrected: entry.corrected,
    feedback: entry.feedback,
    language: entry.language,
  }
  const next = [nextEntry, ...entries]
  persistArchive(next)
  return next
}

export function removeArchiveEntry(id: string): DiaryArchiveEntry[] {
  if (typeof window === "undefined") return []
  const entries = loadArchiveEntries()
  const next = entries.filter((entry) => entry.id !== id)
  persistArchive(next)
  return next
}

export function updateArchiveEntry(
  id: string,
  updates: Partial<Pick<DiaryArchiveEntry, "original" | "corrected" | "feedback">>
): DiaryArchiveEntry[] {
  if (typeof window === "undefined") return []
  const entries = loadArchiveEntries()
  const next = entries.map((entry) =>
    entry.id === id ? { ...entry, ...updates } : entry
  )
  persistArchive(next)
  return next
}

export function getArchiveStreak(
  entries: DiaryArchiveEntry[],
  today: Date = new Date()
): number {
  if (entries.length === 0) return 0

  const dayTimes = Array.from(
    new Set(
      entries.flatMap((entry) => {
        const date = new Date(entry.createdAt)
        if (Number.isNaN(date.getTime())) return []
        return startOfDay(date).getTime()
      })
    )
  ).sort((a, b) => b - a)

  if (dayTimes.length === 0) return 0

  let streak = 0
  let cursor = startOfDay(today)

  for (const time of dayTimes) {
    if (time > cursor.getTime()) continue
    if (isSameDay(new Date(time), cursor)) {
      streak += 1
      cursor = subDays(cursor, 1)
      continue
    }
    break
  }

  return streak
}
