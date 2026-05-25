export const DIARY_MAX_CHARS = 100
export const MAX_WORD_INSERTIONS = 3

export function clampDiaryText(text: string): string {
  return text.slice(0, DIARY_MAX_CHARS)
}

/** 공백으로 나눈 토큰 중 해당 단어가 몇 번 들어갔는지 셉니다. */
export function countWordOccurrences(text: string, word: string): number {
  if (!word.trim()) return 0
  return text.split(/\s+/).filter((part) => part === word).length
}

export function canAppendWord(current: string, word: string): boolean {
  return countWordOccurrences(current, word) < MAX_WORD_INSERTIONS
}

/** 일기장에 단어를 붙일 때 100자·동일 단어 3회 제한을 지킵니다. */
export function appendWordToDiary(current: string, word: string): string {
  const trimmed = clampDiaryText(current)
  if (!canAppendWord(trimmed, word)) return trimmed
  if (trimmed.length >= DIARY_MAX_CHARS) return trimmed

  const separator = trimmed.length > 0 ? " " : ""
  const next = trimmed + separator + word
  return clampDiaryText(next)
}
