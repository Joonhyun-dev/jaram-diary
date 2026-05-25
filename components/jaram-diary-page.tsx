"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { WordCard, type WordData } from "@/components/word-card"
import { DiaryInput } from "@/components/diary-input"
import { AIFeedbackModal } from "@/components/ai-feedback-modal"
import { StreakCounter } from "@/components/streak-counter"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/components/language-provider"
import { Sparkles, BookOpen } from "lucide-react"
import type { CorrectDiaryResponse } from "@/lib/correct-diary"
import { appendWordToDiary } from "@/lib/diary"
import { trimExample, trimMeaning } from "@/lib/translate-words"
import { getUiCopy } from "@/lib/ui-copy"
import { upsertWordbookEntry } from "@/lib/wordbook"
import { addArchiveEntry } from "@/lib/archive"
import {
  type CachedWordTranslation,
  type LanguageCode,
  type WordTranslationCache,
  getLanguage,
  getWordExampleNative,
  getWordMeaningDisplay,
  resolveFeedbackTranslation,
  resolveWordMeaningTranslation,
} from "@/lib/translations"

interface JaramDiaryPageProps {
  todayWords: WordData[]
}

function isWordTranslationCached(
  word: WordData,
  lang: LanguageCode,
  cache: WordTranslationCache
): boolean {
  const entry = cache[lang]?.[word.id]
  if (entry?.meaning?.text?.trim()) return true
  if (entry?.exampleNative?.trim()) return true
  return !!resolveWordMeaningTranslation(word.id, word.meaning, lang, {
    allowPlaceholder: false,
  })
}

function wordsNeedingFetch(
  words: WordData[],
  lang: LanguageCode,
  cache: WordTranslationCache
): WordData[] {
  return words.filter((w) => !isWordTranslationCached(w, lang, cache))
}

export function JaramDiaryPage({ todayWords }: JaramDiaryPageProps) {
  const [diaryText, setDiaryText] = useState("")
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalLoading, setIsModalLoading] = useState(false)
  const [isCorrectionSuccess, setIsCorrectionSuccess] = useState(false)
  const [feedback, setFeedback] = useState({
    original: "",
    corrected: "",
    feedbackKo: "",
    feedbackTranslation: "",
  })
  const [streak] = useState(0)
  const { language: selectedLanguage, setLanguage: setSelectedLanguage } = useLanguage()
  const [wordTranslationCache, setWordTranslationCache] =
    useState<WordTranslationCache>({})
  const [isTranslatingWords, setIsTranslatingWords] = useState(false)
  const [wordTranslationError, setWordTranslationError] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const activeLanguage = getLanguage(selectedLanguage)
  const showMultilingualHint = selectedLanguage !== "ko"
  const ui = (key: Parameters<typeof getUiCopy>[0], vars?: Record<string, string>) =>
    getUiCopy(key, selectedLanguage, vars)

  useEffect(() => {
    if (selectedLanguage === "ko") {
      setWordTranslationError(false)
      setIsTranslatingWords(false)
      return
    }

    const toFetch = wordsNeedingFetch(todayWords, selectedLanguage, wordTranslationCache)
    if (toFetch.length === 0) {
      setWordTranslationError(false)
      setIsTranslatingWords(false)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsTranslatingWords(true)
    setWordTranslationError(false)

    const fetchTranslations = async () => {
      try {
        const response = await fetch("/api/translate-words", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: selectedLanguage,
            words: toFetch.map((w) => ({
              id: w.id,
              word: w.word,
              meaning: trimMeaning(w.meaning),
              example: trimExample(w.exampleSentence),
            })),
          }),
          signal: controller.signal,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error ?? "단어 번역에 실패했습니다.")
        }

        const raw = data.translations as Record<
          string,
          { meaning: string; example: string }
        >
        const geminiEntries: Record<number, CachedWordTranslation> = {}

        for (const [idKey, bundle] of Object.entries(raw)) {
          const id = Number(idKey)
          const meaningText = bundle.meaning?.trim() ?? ""
          const exampleText = bundle.example?.trim() ?? ""
          if (Number.isNaN(id) || (!meaningText && !exampleText)) continue

          const manual = resolveWordMeaningTranslation(
            id,
            toFetch.find((w) => w.id === id)?.meaning ?? "",
            selectedLanguage,
            { allowPlaceholder: false }
          )

          geminiEntries[id] = {
            meaning: manual ?? {
              text: meaningText || exampleText,
              source: "gemini",
            },
            exampleNative: exampleText,
          }
        }

        if (Object.keys(geminiEntries).length === 0) {
          throw new Error("번역 결과가 비어 있습니다.")
        }

        setWordTranslationCache((prev) => ({
          ...prev,
          [selectedLanguage]: {
            ...prev[selectedLanguage],
            ...geminiEntries,
          },
        }))
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return
        setWordTranslationError(true)
      } finally {
        if (!controller.signal.aborted) {
          setIsTranslatingWords(false)
        }
      }
    }

    fetchTranslations()

    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, todayWords])

  const handleWordClick = useCallback((word: WordData) => {
    setDiaryText((prev) => appendWordToDiary(prev, word.word))
    setSelectedWords((prev) => (prev.includes(word.word) ? prev : [...prev, word.word]))
    upsertWordbookEntry({
      id: word.id,
      word: word.word,
      pronunciation: word.pronunciation,
      meaning: word.meaning,
      exampleSentence: word.exampleSentence,
      savedAt: new Date().toISOString(),
    })
  }, [])

  const handleCorrectionStart = useCallback(() => {
    setIsModalOpen(true)
    setIsModalLoading(true)
    setIsCorrectionSuccess(false)
    setFeedback({
      original: diaryText,
      corrected: "",
      feedbackKo: "",
      feedbackTranslation: "",
    })
  }, [diaryText])

  const handleCorrectionComplete = useCallback((result: CorrectDiaryResponse) => {
    addArchiveEntry({
      original: result.original,
      corrected: result.corrected,
      feedback: result.feedback_ko,
      language: selectedLanguage,
    })
    setFeedback({
      original: result.original,
      corrected: result.corrected,
      feedbackKo: result.feedback_ko,
      feedbackTranslation: result.feedback_translation,
    })
    setIsCorrectionSuccess(true)
    setIsModalLoading(false)
  }, [selectedLanguage])

  const handleCorrectionError = useCallback((message: string) => {
    setFeedback({
      original: diaryText,
      corrected: diaryText,
      feedbackKo: message,
      feedbackTranslation: "",
    })
    setIsCorrectionSuccess(false)
    setIsModalLoading(false)
  }, [diaryText])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setIsModalLoading(false)
  }, [])

  const feedbackTranslation = resolveFeedbackTranslation(selectedLanguage, {
    geminiText: feedback.feedbackTranslation,
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg leading-tight">자람일기</h1>
              <p className="text-xs text-muted-foreground">{ui("appTagline")}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
            <StreakCounter streak={streak} uiLanguage={selectedLanguage} />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground text-lg">{ui("todayWordsTitle")}</h2>
            <div className="flex-1 h-px bg-border ml-2" />
          </div>

          <p className="text-muted-foreground text-sm mb-3">{ui("wordCardClickHint")}</p>

          {showMultilingualHint && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-primary/25 bg-primary/5 px-3 py-2.5 text-sm text-foreground/90">
              <span className="text-lg" aria-hidden="true">
                {activeLanguage.flag}
              </span>
              <p>
                {ui("multilingualHint", { label: activeLanguage.label })}
                {isTranslatingWords && (
                  <span className="text-muted-foreground">{ui("translatingSuffix")}</span>
                )}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {todayWords.map((word) => (
              <WordCard
                key={word.id}
                wordData={word}
                onClick={handleWordClick}
                isSelected={selectedWords.includes(word.word)}
                uiLanguage={selectedLanguage}
                translationLanguage={selectedLanguage}
                meaningTranslation={getWordMeaningDisplay(
                  word.id,
                  word.meaning,
                  selectedLanguage,
                  {
                    cache: wordTranslationCache,
                    isLoading: isTranslatingWords,
                    hasError: wordTranslationError,
                  }
                )}
                exampleNative={getWordExampleNative(word.id, selectedLanguage, {
                  cache: wordTranslationCache,
                  isLoading: isTranslatingWords,
                  hasError: wordTranslationError,
                })}
              />
            ))}
          </div>
        </section>

        <section>
          <DiaryInput
            value={diaryText}
            onChange={setDiaryText}
            selectedLanguage={selectedLanguage}
            onCorrectionStart={handleCorrectionStart}
            onCorrectionComplete={handleCorrectionComplete}
            onCorrectionError={handleCorrectionError}
          />
        </section>

        <footer className="text-center py-8">
          <div className="flex justify-center gap-2 mb-3">
            <span className="text-2xl animate-float">🌱</span>
            <span className="text-2xl animate-float" style={{ animationDelay: "0.5s" }}>
              📝
            </span>
            <span className="text-2xl animate-float" style={{ animationDelay: "1s" }}>
              ⭐
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{ui("footerMessage")}</p>
        </footer>
      </main>

      <AIFeedbackModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        isLoading={isModalLoading}
        originalText={feedback.original}
        correctedText={feedback.corrected}
        feedback={feedback.feedbackKo}
        uiLanguage={selectedLanguage}
        translationLanguage={selectedLanguage}
        feedbackTranslation={feedbackTranslation}
        isSuccess={isCorrectionSuccess}
      />
    </div>
  )
}
