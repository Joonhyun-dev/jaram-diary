import { z } from "zod"
import type { LanguageCode } from "@/lib/translations"
import { LANGUAGE_PROMPT_LABELS } from "@/lib/correct-diary"

export const wordToTranslateSchema = z.object({
  id: z.number().int().positive(),
  word: z.string().min(1),
  meaning: z.string().min(1),
  example: z.string().min(1),
})

export const translateWordsRequestSchema = z.object({
  language: z.enum(["en", "vi", "zh", "tl"]),
  words: z.array(wordToTranslateSchema).min(1).max(3),
})

export type TranslateWordsRequest = z.infer<typeof translateWordsRequestSchema>

export const wordTranslationEntrySchema = z.object({
  meaning: z.string(),
  example: z.string(),
})

export const translateWordsResponseSchema = z.object({
  translations: z.record(z.string(), wordTranslationEntrySchema),
})

export type TranslateWordsResponse = z.infer<typeof translateWordsResponseSchema>

export const TRANSLATE_WORDS_SYSTEM_PROMPT = `너는 다문화 가정 초등학생을 돕는 친절한 AI 한국어 선생님이야.
한국어 단어의 '뜻'과 '예문'을 요청된 모국어로 초등학생이 이해하기 쉽게 번역해줘.
인명(민준 등)은 가능하면 그대로 두거나 모국어 표기로 자연스럽게 옮겨줘.`

const MAX_MEANING_LENGTH = 200
const MAX_EXAMPLE_LENGTH = 300

export function trimMeaning(meaning: string): string {
  if (meaning.length <= MAX_MEANING_LENGTH) return meaning
  return `${meaning.slice(0, MAX_MEANING_LENGTH)}…`
}

export function trimExample(example: string): string {
  if (example.length <= MAX_EXAMPLE_LENGTH) return example
  return `${example.slice(0, MAX_EXAMPLE_LENGTH)}…`
}

export function buildTranslateWordsPrompt(
  language: Exclude<LanguageCode, "ko">,
  words: z.infer<typeof wordToTranslateSchema>[]
): string {
  const targetLanguage = LANGUAGE_PROMPT_LABELS[language]
  const wordList = words
    .map(
      (w) =>
        `- id: ${w.id}, 단어: ${w.word}, 한국어 뜻: ${trimMeaning(w.meaning)}, 한국어 예문: ${trimExample(w.example)}`
    )
    .join("\n")

  return `다음 한국어 단어의 '뜻'과 '예문'을 ${targetLanguage}로 번역해줘.

[단어 목록]
${wordList}

반드시 아래 JSON 형식만 출력해. translations의 키는 id를 문자열로 써.
{
  "translations": {
    "${words[0]?.id ?? "1"}": {
      "meaning": "번역된 뜻",
      "example": "번역된 예문"
    }
  }
}`
}

export interface NormalizedWordTranslation {
  meaning: string
  example: string
}

export function normalizeWordTranslations(
  raw: Record<string, z.infer<typeof wordTranslationEntrySchema>>,
  wordIds: number[]
): Record<number, NormalizedWordTranslation> {
  const result: Record<number, NormalizedWordTranslation> = {}

  for (const id of wordIds) {
    const entry = raw[String(id)]
    const meaning = entry?.meaning?.trim()
    const example = entry?.example?.trim()
    if (meaning && example) {
      result[id] = { meaning, example }
    }
  }

  return result
}

/** 이전 API 응답(문자열만) 하위 호환 */
export function normalizeLegacyTranslations(
  raw: Record<string, string>,
  wordIds: number[]
): Record<number, NormalizedWordTranslation> {
  const result: Record<number, NormalizedWordTranslation> = {}
  for (const id of wordIds) {
    const meaning = raw[String(id)]?.trim()
    if (meaning) result[id] = { meaning, example: "" }
  }
  return result
}
