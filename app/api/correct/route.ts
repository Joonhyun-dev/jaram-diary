import { NextResponse } from "next/server"
import { LANGUAGE_PROMPT_LABELS } from "@/lib/correct-diary"
import {
  correctDiaryRequestSchema,
  correctDiaryResponseSchema,
} from "@/lib/correct-diary"
import { createGeminiModel, generateGeminiJson, getGeminiApiKey } from "@/lib/gemini"

export const runtime = "nodejs"

function buildCorrectPrompt(text: string, language: keyof typeof LANGUAGE_PROMPT_LABELS): string {
  const nativeLanguage = LANGUAGE_PROMPT_LABELS[language]

  return `학생이 쓴 일기 문장을 교정하고 피드백을 작성해줘.

[학생 일기]
${text}

[선택한 모국어]
${nativeLanguage}

반드시 아래 JSON 형식만 출력해. 다른 설명은 넣지 마.
{
  "original": "학생이 쓴 원문 그대로",
  "corrected": "맞춤법·띄어쓰기를 고친 문장",
  "feedback_ko": "초등학생 눈높이의 다정한 한국어 피드백 (2~3문장)",
  "feedback_translation": "모국어가 한국어가 아니면 feedback_ko를 해당 모국어로 번역. 한국어면 빈 문자열"
}`
}

const CORRECT_SYSTEM_PROMPT = `너는 다문화 가정 초등학생을 돕는 친절한 AI 한국어 선생님이야.
맞춤법과 띄어쓰기를 올바르게 교정하고, 초등학생 눈높이에 맞게 다정한 칭찬과 피드백을 한국어로 적어줘.
유저가 선택한 모국어가 한국어가 아니면, 한국어 피드백을 해당 모국어로 번역한 문장도 포함해줘.`

export async function POST(request: Request) {
  if (!getGeminiApiKey()) {
    return NextResponse.json({ error: "API 키가 없습니다." }, { status: 500 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 })
  }

  const parsed = correctDiaryRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "일기는 1자 이상 200자 이하로 입력해 주세요." },
      { status: 400 }
    )
  }

  const { text, language } = parsed.data
  const trimmedText = text.trim()

  if (trimmedText.length < 5) {
    return NextResponse.json(
      { error: "일기는 최소 5글자 이상 써 주세요." },
      { status: 400 }
    )
  }

  try {
    const model = createGeminiModel({ json: true })
    const jsonPayload = await generateGeminiJson(model, [
      { text: CORRECT_SYSTEM_PROMPT },
      { text: buildCorrectPrompt(trimmedText, language) },
    ])

    const validated = correctDiaryResponseSchema.safeParse(jsonPayload)
    if (!validated.success) {
      return NextResponse.json(
        { error: "AI 응답 형식이 올바르지 않습니다." },
        { status: 502 }
      )
    }

    return NextResponse.json({
      original: validated.data.original || trimmedText,
      corrected: validated.data.corrected || trimmedText,
      feedback_ko: validated.data.feedback_ko,
      feedback_translation:
        language === "ko" ? "" : (validated.data.feedback_translation ?? ""),
    })
  } catch (error) {
    console.error("[api/correct]", error)
    const message =
      error instanceof Error ? error.message : "AI 교정 중 오류가 발생했습니다."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
