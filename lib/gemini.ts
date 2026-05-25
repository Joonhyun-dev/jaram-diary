import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai"
import { parseGeminiJsonResponse } from "@/lib/correct-diary"

export const GEMINI_MODEL = "gemini-2.5-flash"

export function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY
}

export function createGeminiModel(options?: { json?: boolean }): GenerativeModel {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.")
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    ...(options?.json
      ? { generationConfig: { responseMimeType: "application/json" } }
      : {}),
  })
}

export async function generateGeminiJson(
  model: GenerativeModel,
  parts: { text: string }[]
): Promise<unknown> {
  const result = await model.generateContent(parts)
  const text = result.response.text()
  if (!text) {
    throw new Error("AI 응답이 비어 있습니다.")
  }
  return parseGeminiJsonResponse(text)
}
