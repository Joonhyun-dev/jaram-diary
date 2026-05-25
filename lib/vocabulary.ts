import { readFileSync, existsSync } from "fs"
import path from "path"
import type { WordData } from "@/components/word-card"

const CSV_FILENAMES = [
  "한국교육학술정보원_모두의한국어_단어장_20240823_2.csv",
  "한국교육학술정보원_모두의한국어_단어장_20240823.csv",
] as const

const CARD_COLORS: WordData["color"][] = ["yellow", "mint", "pink"]

export interface VocabularyEntry {
  id: number
  word: string
  usage: string
  example: string
  partOfSpeech: string
  pronunciation: string
  definition: string
}

function resolveCsvPath(): string {
  const publicDir = path.join(process.cwd(), "public")
  for (const filename of CSV_FILENAMES) {
    const filePath = path.join(publicDir, filename)
    if (existsSync(filePath)) return filePath
  }
  throw new Error(
    `단어장 CSV 파일을 찾을 수 없습니다. public 폴더에 다음 파일 중 하나가 필요합니다: ${CSV_FILENAMES.join(", ")}`
  )
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      fields.push(current)
      current = ""
    } else {
      current += char
    }
  }
  fields.push(current)
  return fields
}

function parseJsonArrayField(raw: string): string[] {
  const trimmed = raw.trim()
  if (!trimmed) return []

  try {
    const normalized = trimmed.replace(/""/g, '"')
    const parsed: unknown = JSON.parse(normalized)
    return flattenToStrings(parsed)
  } catch {
    return []
  }
}

function flattenToStrings(value: unknown): string[] {
  if (typeof value === "string") return value.trim() ? [value.trim()] : []
  if (Array.isArray(value)) return value.flatMap(flattenToStrings)
  return []
}

function formatPronunciation(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ""
  return trimmed.replace(/^\[/, "").replace(/\]$/, "")
}

function rowToEntry(fields: string[]): VocabularyEntry | null {
  if (fields.length < 9) return null

  const [idRaw, word, , , usage, example, partOfSpeech, pronunciation, definition] =
    fields

  const id = Number.parseInt(idRaw, 10)
  if (Number.isNaN(id) || !word.trim()) return null

  return {
    id,
    word: word.trim(),
    usage: usage.trim(),
    example: example.trim(),
    partOfSpeech: partOfSpeech.trim(),
    pronunciation: pronunciation.trim(),
    definition: definition.trim(),
  }
}

let cachedEligibleEntries: VocabularyEntry[] | null = null

export function loadEligibleVocabularyEntries(): VocabularyEntry[] {
  if (cachedEligibleEntries) return cachedEligibleEntries

  const csvPath = resolveCsvPath()
  const content = readFileSync(csvPath, "utf-8")
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0)

  const entries: VocabularyEntry[] = []

  for (let i = 1; i < lines.length; i++) {
    const entry = rowToEntry(parseCsvLine(lines[i]))
    if (!entry) continue
    if (entry.usage !== "Y") continue
    if (!entry.definition || !entry.example) continue

    const meanings = parseJsonArrayField(entry.definition)
    const examples = parseJsonArrayField(entry.example)
    if (meanings.length === 0 || examples.length === 0) continue

    entries.push(entry)
  }

  cachedEligibleEntries = entries
  return entries
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function pickRandomWords(count: number): WordData[] {
  const eligible = loadEligibleVocabularyEntries()
  const picked = shuffle(eligible).slice(0, Math.min(count, eligible.length))

  return picked.map((entry, index) => {
    const meanings = parseJsonArrayField(entry.definition)
    const examples = parseJsonArrayField(entry.example)

    return {
      id: entry.id,
      word: entry.word,
      pronunciation: formatPronunciation(entry.pronunciation),
      meaning: meanings[0],
      exampleSentence: examples[0],
      color: CARD_COLORS[index % CARD_COLORS.length],
    }
  })
}
