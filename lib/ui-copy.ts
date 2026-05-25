import type { LanguageCode } from "@/lib/translations"

export type UiCopyKey =
  | "appTagline"
  | "todayWordsTitle"
  | "wordCardClickHint"
  | "multilingualHint"
  | "translatingSuffix"
  | "exampleHint"
  | "todayDiaryTitle"
  | "diarySubtitle"
  | "diaryPlaceholder"
  | "aiReadingTitle"
  | "aiReadingWait"
  | "aiChecking"
  | "aiCheckButton"
  | "minCharsHint"
  | "footerMessage"
  | "streakLabel"
  | "nativeLanguageShort"
  | "languageMenuTitle"
  | "listenPronunciation"
  | "meaningTranslating"
  | "meaningError"
  | "exampleTranslating"
  | "exampleError"
  | "modalWellDone"
  | "modalMySentence"
  | "modalCorrected"
  | "modalAiTeacher"
  | "modalConfirm"
  | "modalCloseAria"
  | "modalReadingSr"
  | "modalFeedbackSr"
  | "feedbackViewButton"
  | "nativeFeedbackButton"
  | "feedbackInLanguage"

type UiCopyTable = Record<UiCopyKey, string>

const UI_COPY: Record<LanguageCode, UiCopyTable> = {
  ko: {
    appTagline: "한 줄 일기로 배우는 한국어",
    todayWordsTitle: "오늘의 추천 단어",
    wordCardClickHint: "단어 카드를 클릭하면 일기장에 단어가 들어가요! ✨",
    multilingualHint: "{label} 모국어로 단어 뜻과 예문을 함께 보여드려요.",
    translatingSuffix: " (번역 중…)",
    exampleHint: "예문 힌트",
    todayDiaryTitle: "오늘의 일기",
    diarySubtitle: "오늘 배운 단어로 일기를 한 줄 써보세요!",
    diaryPlaceholder: "여기에 일기를 써보세요... 🌸",
    aiReadingTitle: "AI 선생님이 읽고 있어요...",
    aiReadingWait: "잠시만 기다려 주세요 ✨",
    aiChecking: "AI 선생님이 검사 중...",
    aiCheckButton: "AI 선생님에게 검사받기",
    minCharsHint: "조금만 더 써볼까요? (최소 5글자)",
    footerMessage: "매일 조금씩, 한국어 실력이 쑥쑥 자라요!",
    streakLabel: "연속 일기 작성일수:",
    nativeLanguageShort: "모국어",
    languageMenuTitle: "모국어 번역",
    listenPronunciation: "발음 듣기",
    meaningTranslating: "번역 중…",
    meaningError: "번역을 불러오지 못했어요. 언어를 다시 선택해 주세요.",
    exampleTranslating: "예문 번역 중…",
    exampleError: "예문 번역을 불러오지 못했어요.",
    modalWellDone: "잘했어요! 🎉",
    modalMySentence: "내가 쓴 문장",
    modalCorrected: "AI가 고쳐준 멋진 문장",
    modalAiTeacher: "AI 선생님:",
    modalConfirm: "확인했어요! 🙌",
    modalCloseAria: "닫기",
    modalReadingSr: "AI 선생님이 읽고 있어요",
    modalFeedbackSr: "AI 선생님의 피드백",
    feedbackViewButton: "한국어 피드백 보기",
    nativeFeedbackButton: "{flag} 한국어 피드백 보기",
    feedbackInLanguage: "{flag} {label} 피드백",
  },
  vi: {
    appTagline: "Học tiếng Hàn qua nhật ký một dòng",
    todayWordsTitle: "Từ gợi ý hôm nay",
    wordCardClickHint: "Nhấn thẻ từ để đưa từ vào nhật ký! ✨",
    multilingualHint: "Hiển thị nghĩa và ví dụ bằng {label}.",
    translatingSuffix: " (đang dịch…)",
    exampleHint: "Gợi ý câu ví dụ",
    todayDiaryTitle: "Nhật ký hôm nay",
    diarySubtitle: "Viết một dòng nhật ký bằng từ đã học hôm nay!",
    diaryPlaceholder: "Viết nhật ký ở đây... 🌸",
    aiReadingTitle: "Cô giáo AI đang đọc...",
    aiReadingWait: "Vui lòng đợi một chút ✨",
    aiChecking: "Cô giáo AI đang kiểm tra...",
    aiCheckButton: "Nhờ cô giáo AI kiểm tra",
    minCharsHint: "Viết thêm chút nữa nhé? (tối thiểu 5 ký tự)",
    footerMessage: "Mỗi ngày một chút, tiếng Hàn sẽ tiến bộ!",
    streakLabel: "Số ngày viết liên tiếp:",
    nativeLanguageShort: "Tiếng mẹ",
    languageMenuTitle: "Ngôn ngữ của bạn",
    listenPronunciation: "Nghe phát âm",
    meaningTranslating: "Đang dịch…",
    meaningError: "Không tải được bản dịch. Chọn lại ngôn ngữ nhé.",
    exampleTranslating: "Đang dịch câu ví dụ…",
    exampleError: "Không tải được bản dịch ví dụ.",
    modalWellDone: "Làm tốt lắm! 🎉",
    modalMySentence: "Câu em đã viết",
    modalCorrected: "Câu đẹp cô AI đã sửa",
    modalAiTeacher: "Cô giáo AI:",
    modalConfirm: "Em hiểu rồi! 🙌",
    modalCloseAria: "Đóng",
    modalReadingSr: "Cô giáo AI đang đọc",
    modalFeedbackSr: "Phản hồi của cô giáo AI",
    feedbackViewButton: "Xem phản hồi tiếng Hàn",
    nativeFeedbackButton: "{flag} Xem phản hồi bằng tiếng Việt",
    feedbackInLanguage: "Phản hồi {label}",
  },
  zh: {
    appTagline: "用一行日记学韩语",
    todayWordsTitle: "今日推荐单词",
    wordCardClickHint: "点击单词卡，单词会进入日记本！✨",
    multilingualHint: "用{label}显示词义和例句。",
    translatingSuffix: "（翻译中…）",
    exampleHint: "例句提示",
    todayDiaryTitle: "今日日记",
    diarySubtitle: "用今天学的单词写一行日记吧！",
    diaryPlaceholder: "在这里写日记... 🌸",
    aiReadingTitle: "AI老师正在阅读...",
    aiReadingWait: "请稍等一下 ✨",
    aiChecking: "AI老师正在检查...",
    aiCheckButton: "请AI老师检查",
    minCharsHint: "再写一点点吧？（至少5个字）",
    footerMessage: "每天一点点，韩语会越来越棒！",
    streakLabel: "连续写日记天数：",
    nativeLanguageShort: "母语",
    languageMenuTitle: "母语翻译",
    listenPronunciation: "听发音",
    meaningTranslating: "翻译中…",
    meaningError: "无法加载翻译，请重新选择语言。",
    exampleTranslating: "例句翻译中…",
    exampleError: "无法加载例句翻译。",
    modalWellDone: "做得好！🎉",
    modalMySentence: "我写的句子",
    modalCorrected: "AI修改后的漂亮句子",
    modalAiTeacher: "AI老师：",
    modalConfirm: "我知道啦！🙌",
    modalCloseAria: "关闭",
    modalReadingSr: "AI老师正在阅读",
    modalFeedbackSr: "AI老师的反馈",
    feedbackViewButton: "查看韩语反馈",
    nativeFeedbackButton: "{flag} 查看中文反馈",
    feedbackInLanguage: "{label}反馈",
  },
  tl: {
    appTagline: "Matuto ng Korean sa isang linya ng diary",
    todayWordsTitle: "Mga salitang inirerekomenda ngayon",
    wordCardClickHint: "I-click ang card para ilagay ang salita sa diary! ✨",
    multilingualHint: "Ipinapakita ang kahulugan at halimbawa sa {label}.",
    translatingSuffix: " (nagsasalin…)",
    exampleHint: "Hint ng halimbawang pangungusap",
    todayDiaryTitle: "Diary ngayong araw",
    diarySubtitle: "Sumulat ng isang linya gamit ang salitang natutunan mo!",
    diaryPlaceholder: "Sumulat ng diary dito... 🌸",
    aiReadingTitle: "Binabasa ng AI teacher...",
    aiReadingWait: "Sandali lang ✨",
    aiChecking: "Sinusuri ng AI teacher...",
    aiCheckButton: "Ipasuri sa AI teacher",
    minCharsHint: "Sumulat pa ng kaunti? (minimum 5 titik)",
    footerMessage: "Araw-araw, lumalaki ang Korean mo!",
    streakLabel: "Sunod-sunod na araw ng pagsulat:",
    nativeLanguageShort: "Katutubong wika",
    languageMenuTitle: "Wika mo",
    listenPronunciation: "Makinig sa bigkas",
    meaningTranslating: "Nagsasalin…",
    meaningError: "Hindi ma-load ang salin. Piliin muli ang wika.",
    exampleTranslating: "Nagsasalin ng halimbawa…",
    exampleError: "Hindi ma-load ang salin ng halimbawa.",
    modalWellDone: "Magaling! 🎉",
    modalMySentence: "Ang sinulat ko",
    modalCorrected: "Magandang pangungusap na inayos ng AI",
    modalAiTeacher: "AI teacher:",
    modalConfirm: "Nakuha ko na! 🙌",
    modalCloseAria: "Isara",
    modalReadingSr: "Binabasa ng AI teacher",
    modalFeedbackSr: "Feedback ng AI teacher",
    feedbackViewButton: "Tingnan ang feedback sa Korean",
    nativeFeedbackButton: "{flag} Tingnan ang feedback sa Filipino",
    feedbackInLanguage: "Feedback sa {label}",
  },
  en: {
    appTagline: "Learn Korean with a one-line diary",
    todayWordsTitle: "Today's recommended words",
    wordCardClickHint: "Tap a word card to add it to your diary! ✨",
    multilingualHint: "Showing meanings and examples in {label}.",
    translatingSuffix: " (translating…)",
    exampleHint: "Example hint",
    todayDiaryTitle: "Today's diary",
    diarySubtitle: "Write a one-line diary with today's words!",
    diaryPlaceholder: "Write your diary here... 🌸",
    aiReadingTitle: "AI teacher is reading...",
    aiReadingWait: "Please wait a moment ✨",
    aiChecking: "AI teacher is checking...",
    aiCheckButton: "Ask AI teacher to check",
    minCharsHint: "Write a little more? (at least 5 characters)",
    footerMessage: "Little by little, your Korean grows!",
    streakLabel: "Diary streak:",
    nativeLanguageShort: "My language",
    languageMenuTitle: "Your language",
    listenPronunciation: "Listen to pronunciation",
    meaningTranslating: "Translating…",
    meaningError: "Could not load translation. Please select your language again.",
    exampleTranslating: "Translating example…",
    exampleError: "Could not load example translation.",
    modalWellDone: "Well done! 🎉",
    modalMySentence: "My sentence",
    modalCorrected: "Great sentence fixed by AI",
    modalAiTeacher: "AI teacher:",
    modalConfirm: "Got it! 🙌",
    modalCloseAria: "Close",
    modalReadingSr: "AI teacher is reading",
    modalFeedbackSr: "AI teacher feedback",
    feedbackViewButton: "View Korean feedback",
    nativeFeedbackButton: "{flag} View feedback in English",
    feedbackInLanguage: "{label} feedback",
  },
}

export function getUiCopy(
  key: UiCopyKey,
  lang: LanguageCode,
  vars?: Record<string, string>
): string {
  let text = UI_COPY[lang][key] ?? UI_COPY.ko[key]
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, v)
    }
  }
  return text
}
