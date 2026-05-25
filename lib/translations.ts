import { getUiCopy } from "@/lib/ui-copy"

export type LanguageCode = "ko" | "en" | "vi" | "zh" | "tl"

export interface Language {
  code: LanguageCode
  label: string
  nativeLabel: string
  flag: string
}

export const LANGUAGES: Language[] = [
  { code: "ko", label: "한국어", nativeLabel: "한국어", flag: "🇰🇷" },
  { code: "vi", label: "베트남어", nativeLabel: "Tiếng Việt", flag: "🇻🇳" },
  { code: "zh", label: "중국어", nativeLabel: "中文", flag: "🇨🇳" },
  { code: "tl", label: "필리핀어", nativeLabel: "Filipino", flag: "🇵🇭" },
  { code: "en", label: "영어", nativeLabel: "English", flag: "🇺🇸" },
]

export type TranslationSource =
  | "mapped"
  | "placeholder"
  | "gemini"
  | "loading"
  | "error"

export interface ResolvedTranslation {
  text: string
  source: TranslationSource
}

/** 단어 ID 기준 수동 번역 (샘플·자주 쓰는 표현) */
export const WORD_TRANSLATIONS: Record<number, Partial<Record<LanguageCode, string>>> = {
  5598: {
    vi: "Ngồi xuống, đặt trọng lượng lên mông",
    zh: "坐下，把重量放在臀部上",
    tl: "Umupo at ilagay ang bigat sa puwit",
    en: "To sit down and place one's weight on the buttocks",
  },
  5601: {
    vi: "Đi từ bên ngoài vào trong",
    zh: "从外面进入里面",
    tl: "Pumasok mula sa labas patungo sa loob",
    en: "To move from outside into a space",
  },
  5562: {
    vi: "Bản đồ",
    zh: "地图",
    tl: "Mapa",
    en: "A map",
  },
}

/** 한국어 뜻(일부) 기준 임시 번역 — CSV 단어와 매칭용 */
const MEANING_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  "귀하고 중요하다": {
    vi: "Quý giá và quan trọng",
    zh: "珍贵且重要",
    tl: "Mahalaga at espesyal",
    en: "Precious and important",
  },
  "기분이 좋고 즐겁다": {
    vi: "Cảm thấy vui vẻ và hào hứng",
    zh: "心情好，很开心",
    tl: "Masaya at nasasabik",
    en: "Feeling happy and excited",
  },
  "다른 사람을 돕다": {
    vi: "Giúp đỡ người khác",
    zh: "帮助别人",
    tl: "Tulungan ang iba",
    en: "To help someone",
  },
}

const WORD_PLACEHOLDER: Record<Exclude<LanguageCode, "ko">, string> = {
  vi: "Gemini AI가 곧 베트남어 뜻을 알려줄 예정이에요",
  zh: "Gemini AI 即将提供中文释义",
  tl: "Malapit nang ibigay ng Gemini AI ang kahulugan sa Filipino",
  en: "Gemini AI will provide the English meaning soon",
}

const FEEDBACK_PLACEHOLDER: Record<Exclude<LanguageCode, "ko">, string> = {
  vi: "Phản hồi bằng tiếng Việt sẽ được Gemini AI dịch và hiển thị.",
  zh: "Gemini AI 将翻译并显示中文反馈。",
  tl: "Isasalin at ipapakita ng Gemini AI ang feedback sa Filipino.",
  en: "Gemini AI will translate and show feedback in English.",
}

/** 기본 AI 피드백(한국어)에 대응하는 모국어 샘플 번역 */
export const FEEDBACK_TRANSLATIONS: Record<LanguageCode, string> = {
  ko: "문장을 정말 잘 썼어요! 오늘 배운 단어를 사용해서 멋진 일기를 완성했네요. 계속 이렇게 열심히 써보세요!",
  vi: "Bạn đã viết câu rất tốt! Bạn đã hoàn thành một bài nhật ký tuyệt vời với từ đã học hôm nay. Hãy tiếp tục cố gắng nhé!",
  zh: "你的句子写得非常好！用今天学到的单词完成了一篇精彩的日记。继续加油！",
  tl: "Napakahusay mong nagsulat! Nagawa mong gumawa ng magandang talaarawan gamit ang salitang natutunan mo ngayon. Patuloy na magsulat!",
  en: "You wrote the sentence really well! You completed a wonderful diary entry using today's learned word. Keep up the great work!",
}

export function getLanguage(code: LanguageCode): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]
}

export function resolveWordMeaningTranslation(
  wordId: number,
  koreanMeaning: string,
  lang: LanguageCode,
  options?: { allowPlaceholder?: boolean }
): ResolvedTranslation | null {
  if (lang === "ko") return null

  const byId = WORD_TRANSLATIONS[wordId]?.[lang]
  if (byId) return { text: byId, source: "mapped" }

  const byMeaning = MEANING_TRANSLATIONS[koreanMeaning.trim()]?.[lang]
  if (byMeaning) return { text: byMeaning, source: "mapped" }

  if (options?.allowPlaceholder === false) return null

  return { text: WORD_PLACEHOLDER[lang], source: "placeholder" }
}

export interface CachedWordTranslation {
  meaning: ResolvedTranslation
  exampleNative: string
}

export type WordTranslationCache = Partial<
  Record<LanguageCode, Record<number, CachedWordTranslation>>
>

export function getWordMeaningDisplay(
  wordId: number,
  koreanMeaning: string,
  lang: LanguageCode,
  options?: {
    cache?: WordTranslationCache
    isLoading?: boolean
    hasError?: boolean
  }
): ResolvedTranslation | null {
  if (lang === "ko") return null

  const cached = options?.cache?.[lang]?.[wordId]?.meaning
  if (cached) return cached

  const manual = resolveWordMeaningTranslation(wordId, koreanMeaning, lang, {
    allowPlaceholder: false,
  })
  if (manual) return manual

  if (options?.isLoading) {
    return { text: getUiCopy("meaningTranslating", lang), source: "loading" }
  }

  if (options?.hasError) {
    return { text: getUiCopy("meaningError", lang), source: "error" }
  }

  return null
}

export function getWordExampleNative(
  wordId: number,
  lang: LanguageCode,
  options?: {
    cache?: WordTranslationCache
    isLoading?: boolean
    hasError?: boolean
  }
): string | null {
  if (lang === "ko") return null

  const native = options?.cache?.[lang]?.[wordId]?.exampleNative
  if (native) return native

  if (options?.isLoading) return null
  if (options?.hasError) return null
  return null
}

export function resolveFeedbackTranslation(
  lang: LanguageCode,
  options?: { geminiText?: string | null }
): ResolvedTranslation | null {
  if (lang === "ko") return null

  if (options?.geminiText?.trim()) {
    return { text: options.geminiText.trim(), source: "gemini" }
  }

  const mapped = FEEDBACK_TRANSLATIONS[lang]
  if (mapped) return { text: mapped, source: "mapped" }

  return { text: FEEDBACK_PLACEHOLDER[lang], source: "placeholder" }
}

export function getNativeTranslationButtonLabel(lang: LanguageCode): string {
  const language = getLanguage(lang)
  if (lang === "ko") return getUiCopy("feedbackViewButton", "ko")
  return getUiCopy("nativeFeedbackButton", lang, { flag: language.flag })
}
