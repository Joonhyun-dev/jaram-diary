import { z } from "zod"
import type { LanguageCode } from "@/lib/translations"

export const correctDiaryResponseSchema = z.object({
  original: z.string(),
  corrected: z.string(),
  feedback_ko: z.string(),
  feedback_translation: z.string(),
})

export type CorrectDiaryResponse = z.infer<typeof correctDiaryResponseSchema>

export const correctDiaryRequestSchema = z.object({
  text: z.string().min(1).max(200),
  language: z.enum(["ko", "en", "vi", "zh", "tl"]).default("ko"),
})

export type CorrectDiaryRequest = z.infer<typeof correctDiaryRequestSchema>

export const LANGUAGE_PROMPT_LABELS: Record<LanguageCode, string> = {
  ko: "한국어 (모국어 번역 불필요)",
  vi: "베트남어 (Tiếng Việt)",
  zh: "중국어 (中文)",
  tl: "필리핀어 (Filipino)",
  en: "영어 (English)",
}

export const CORRECT_DIARY_SYSTEM_PROMPT =
  "너는 다문화 가정 초등학생을 돕는 친절한 AI 한국어 선생님이야. 맞춤법과 띄어쓰기를 올바르게 교정하고, 초등학생 눈높이에 맞게 다정한 칭찬과 피드백을 한국어로 적어줘. 유저가 선택한 모국어가 있다면, 한국어 피드백을 해당 모국어로 번역한 문장도 포함해줘."

export function parseGeminiJsonResponse(raw: string): unknown {
  const trimmed = raw.trim()
  const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonStr = codeBlock ? codeBlock[1].trim() : trimmed
  return JSON.parse(jsonStr)
}
