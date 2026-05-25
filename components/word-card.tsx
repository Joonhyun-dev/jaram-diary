"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { type LanguageCode, type ResolvedTranslation } from "@/lib/translations"
import { WordTranslationPanel } from "@/components/word-translation-panel"

export interface WordData {
  id: number
  word: string
  pronunciation: string
  meaning: string
  exampleSentence: string
  color: "yellow" | "mint" | "pink"
}

interface WordCardProps {
  wordData: WordData
  onClick: (word: string) => void
  isSelected: boolean
  translationLanguage?: LanguageCode
  meaningTranslation?: ResolvedTranslation | null
}

const colorClasses = {
  yellow: "bg-word-yellow hover:bg-word-yellow/80 border-yellow-300",
  mint: "bg-word-mint hover:bg-word-mint/80 border-emerald-300",
  pink: "bg-word-pink hover:bg-word-pink/80 border-pink-300",
}

export function WordCard({
  wordData,
  onClick,
  isSelected,
  translationLanguage,
  meaningTranslation,
}: WordCardProps) {
  const showTranslation =
    translationLanguage && translationLanguage !== "ko" && meaningTranslation
  const [showHint, setShowHint] = useState(false)

  return (
    <div
      className={cn(
        "relative rounded-2xl p-4 border-2 cursor-pointer transition-all duration-300",
        "shadow-md hover:shadow-lg hover:-translate-y-1",
        colorClasses[wordData.color],
        isSelected && "ring-4 ring-primary ring-offset-2 scale-105"
      )}
      onClick={() => onClick(wordData.word)}
    >
      {/* Decorative corner */}
      <div className="absolute top-2 right-2 w-6 h-6 opacity-30">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>

      {/* Word */}
      <div className="text-center mb-3">
        <h3 className="text-2xl font-bold text-foreground mb-1">{wordData.word}</h3>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">[{wordData.pronunciation}]</span>
          <button 
            className="p-1 rounded-full hover:bg-foreground/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              // TTS functionality placeholder
            }}
            aria-label="발음 듣기"
          >
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Meaning */}
      <div className="text-center mb-3">
        <p className="text-foreground/90 font-medium">{wordData.meaning}</p>
        {showTranslation && (
          <WordTranslationPanel
            language={translationLanguage}
            translation={meaningTranslation}
          />
        )}
      </div>

      {/* Example hint toggle */}
      <button
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl",
          "bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm",
          "text-muted-foreground"
        )}
        onClick={(e) => {
          e.stopPropagation()
          setShowHint(!showHint)
        }}
      >
        <span>예문 힌트</span>
        {showHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Example sentence */}
      {showHint && (
        <div className="mt-3 p-3 bg-card/50 rounded-xl text-sm text-center animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-foreground/80 italic">&quot;{wordData.exampleSentence}&quot;</p>
        </div>
      )}

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-bounce-soft">
          <span className="text-lg">✓</span>
        </div>
      )}
    </div>
  )
}
