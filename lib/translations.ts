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

// Word meaning translations keyed by wordId
export const WORD_TRANSLATIONS: Record<number, Record<LanguageCode, string>> = {
  1: {
    ko: "귀하고 중요하다",
    vi: "Quý giá và quan trọng",
    zh: "珍贵且重要",
    tl: "Mahalaga at espesyal",
    en: "Precious and important",
  },
  2: {
    ko: "기분이 좋고 즐겁다",
    vi: "Cảm thấy vui vẻ và hào hứng",
    zh: "心情好，很开心",
    tl: "Masaya at nasasabik",
    en: "Feeling happy and excited",
  },
  3: {
    ko: "다른 사람을 돕다",
    vi: "Giúp đỡ người khác",
    zh: "帮助别人",
    tl: "Tulungan ang iba",
    en: "To help someone",
  },
}

// AI feedback translations — maps a feedback message key to translations
export const FEEDBACK_TRANSLATIONS: Record<LanguageCode, string> = {
  ko: "문장을 정말 잘 썼어요! 오늘 배운 단어를 사용해서 멋진 일기를 완성했네요. 계속 이렇게 열심히 써보세요!",
  vi: "Bạn đã viết câu rất tốt! Bạn đã hoàn thành một bài nhật ký tuyệt vời với từ đã học hôm nay. Hãy tiếp tục cố gắng nhé!",
  zh: "你的句子写得非常好！用今天学到的单词完成了一篇精彩的日记。继续加油！",
  tl: "Napakahusay mong nagsulat! Nagawa mong gumawa ng magandang talaarawan gamit ang salitang natutunan mo ngayon. Patuloy na magsulat!",
  en: "You wrote the sentence really well! You completed a wonderful diary entry using today's learned word. Keep up the great work!",
}
