"use client"

import { useState, useCallback } from "react"
import { WordCard, type WordData } from "@/components/word-card"
import { DiaryInput } from "@/components/diary-input"
import { AIFeedbackModal } from "@/components/ai-feedback-modal"
import { StreakCounter } from "@/components/streak-counter"
import { LanguageSelector } from "@/components/language-selector"
import { Sparkles, BookOpen } from "lucide-react"
import {
  type LanguageCode,
  WORD_TRANSLATIONS,
  FEEDBACK_TRANSLATIONS,
} from "@/lib/translations"

// Sample recommended words of the day
const todayWords: WordData[] = [
  {
    id: 1,
    word: "소중하다",
    pronunciation: "so-jung-ha-da",
    meaning: "귀하고 중요하다",
    exampleSentence: "가족은 나에게 소중해요.",
    color: "yellow",
  },
  {
    id: 2,
    word: "신나다",
    pronunciation: "sin-na-da",
    meaning: "기분이 좋고 즐겁다",
    exampleSentence: "운동회가 신나요.",
    color: "mint",
  },
  {
    id: 3,
    word: "도와주다",
    pronunciation: "do-wa-ju-da",
    meaning: "다른 사람을 돕다",
    exampleSentence: "친구를 도와줬어요.",
    color: "pink",
  },
]

// Simulated AI feedback (in a real app, this would call an AI API)
function simulateAIFeedback(text: string): Promise<{ corrected: string; feedback: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple simulation - in production, call actual AI service
      const corrected = text
        .replace(/좋앗어요/g, "좋았어요")
        .replace(/햇어요/g, "했어요")
        .replace(/잇어요/g, "있어요")
      
      resolve({
        corrected: corrected,
        feedback: "문장을 정말 잘 썼어요! 오늘 배운 단어를 사용해서 멋진 일기를 완성했네요. 계속 이렇게 열심히 써보세요! 💕",
      })
    }, 2000)
  })
}

export default function JaramDiaryPage() {
  const [diaryText, setDiaryText] = useState("")
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState({
    original: "",
    corrected: "",
    message: "",
  })
  const [streak] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("ko")

  const handleWordClick = useCallback((word: string) => {
    setDiaryText((prev) => {
      const newText = prev.length > 0 ? `${prev} ${word}` : word
      return newText
    })
    setSelectedWords((prev) =>
      prev.includes(word) ? prev : [...prev, word]
    )
  }, [])

  const handleSubmit = useCallback(async () => {
    if (diaryText.trim().length < 5) return

    setIsModalOpen(true)
    setIsLoading(true)
    setFeedback({ original: diaryText, corrected: "", message: "" })

    try {
      const result = await simulateAIFeedback(diaryText)
      setFeedback({
        original: diaryText,
        corrected: result.corrected,
        message: result.feedback,
      })
    } catch {
      setFeedback({
        original: diaryText,
        corrected: diaryText,
        message: "잘 썼어요! 오늘도 열심히 일기를 썼네요! 🌟",
      })
    } finally {
      setIsLoading(false)
    }
  }, [diaryText])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg leading-tight">자람일기</h1>
              <p className="text-xs text-muted-foreground">한 줄 일기로 배우는 한국어</p>
            </div>
          </div>

          {/* Right side: language selector + streak */}
          <div className="flex items-center gap-2">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
            <StreakCounter streak={streak} />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Today's words section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground text-lg">오늘의 추천 단어</h2>
            <div className="flex-1 h-px bg-border ml-2" />
          </div>

          <p className="text-muted-foreground text-sm mb-4">
            단어 카드를 클릭하면 일기장에 단어가 들어가요! ✨
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {todayWords.map((word) => (
              <WordCard
                key={word.id}
                wordData={word}
                onClick={handleWordClick}
                isSelected={selectedWords.includes(word.word)}
                translationLanguage={selectedLanguage}
                translatedMeaning={WORD_TRANSLATIONS[word.id]?.[selectedLanguage]}
              />
            ))}
          </div>
        </section>

        {/* Diary input section */}
        <section>
          <DiaryInput
            value={diaryText}
            onChange={setDiaryText}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </section>

        {/* Decorative footer */}
        <footer className="text-center py-8">
          <div className="flex justify-center gap-2 mb-3">
            <span className="text-2xl animate-float">🌱</span>
            <span className="text-2xl animate-float" style={{ animationDelay: "0.5s" }}>📝</span>
            <span className="text-2xl animate-float" style={{ animationDelay: "1s" }}>⭐</span>
          </div>
          <p className="text-sm text-muted-foreground">
            매일 조금씩, 한국어 실력이 쑥쑥 자라요!
          </p>
        </footer>
      </main>

      {/* AI Feedback Modal */}
      <AIFeedbackModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        isLoading={isLoading}
        originalText={feedback.original}
        correctedText={feedback.corrected}
        feedback={feedback.message}
        translationLanguage={selectedLanguage}
        translatedFeedback={FEEDBACK_TRANSLATIONS[selectedLanguage]}
      />
    </div>
  )
}
