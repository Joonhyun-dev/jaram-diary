import { NextResponse } from "next/server"
import { createGeminiModel, generateGeminiJson, getGeminiApiKey } from "@/lib/gemini"
import {
  buildTranslateWordsPrompt,
  normalizeLegacyTranslations,
  normalizeWordTranslations,
  translateWordsRequestSchema,
  translateWordsResponseSchema,
  TRANSLATE_WORDS_SYSTEM_PROMPT,
} from "@/lib/translate-words"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (!getGeminiApiKey()) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY가 설정되지 않았습니다." },
      { status: 500 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 })
  }

  const parsed = translateWordsRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "번역할 단어 정보가 올바르지 않습니다." },
      { status: 400 }
    )
  }

  const { language, words } = parsed.data
  const wordIds = words.map((w) => w.id)

  try {
    const model = createGeminiModel({ json: true })
    const jsonPayload = await generateGeminiJson(model, [
      { text: TRANSLATE_WORDS_SYSTEM_PROMPT },
      { text: buildTranslateWordsPrompt(language, words) },
    ])

    const validated = translateWordsResponseSchema.safeParse(jsonPayload)
    let translations = validated.success
      ? normalizeWordTranslations(validated.data.translations, wordIds)
      : {}

    if (Object.keys(translations).length === 0) {
      const raw = jsonPayload as { translations?: Record<string, unknown> }
      if (raw.translations) {
        const flat: Record<string, string> = {}
        for (const [k, v] of Object.entries(raw.translations)) {
          if (typeof v === "string") flat[k] = v
        }
        if (Object.keys(flat).length > 0) {
          translations = normalizeLegacyTranslations(flat, wordIds)
        }
      }
    }

    if (Object.keys(translations).length === 0) {
      return NextResponse.json(
        { error: "번역 결과를 받지 못했습니다." },
        { status: 502 }
      )
    }

    return NextResponse.json({ translations })
  } catch (error) {
    console.error("[api/translate-words]", error)
    const message =
      error instanceof Error ? error.message : "단어 번역 중 오류가 발생했습니다."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
