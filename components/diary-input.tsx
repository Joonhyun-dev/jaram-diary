"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, PenLine, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CorrectDiaryResponse } from "@/lib/correct-diary"
import { clampDiaryText, DIARY_MAX_CHARS } from "@/lib/diary"
import { getUiCopy } from "@/lib/ui-copy"
import type { LanguageCode } from "@/lib/translations"

interface DiaryInputProps {
  value: string
  onChange: (value: string) => void
  selectedLanguage: LanguageCode
  onCorrectionStart: () => void
  onCorrectionComplete: (result: CorrectDiaryResponse) => void
  onCorrectionError: (message: string) => void
}

export function DiaryInput({
  value,
  onChange,
  selectedLanguage,
  onCorrectionStart,
  onCorrectionComplete,
  onCorrectionError,
}: DiaryInputProps) {
  const [isLoading, setIsLoading] = useState(false)
  const ui = (key: Parameters<typeof getUiCopy>[0]) => getUiCopy(key, selectedLanguage)
  const charCount = value.length
  const maxChars = DIARY_MAX_CHARS

  const handleSubmit = async () => {
    const trimmed = value.trim()
    if (trimmed.length < 5 || isLoading) return

    setIsLoading(true)
    onCorrectionStart()

    try {
      const response = await fetch("/api/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, language: selectedLanguage }),
      })

      const data = await response.json()

      if (!response.ok) {
        onCorrectionError(data.error ?? "AI 교정에 실패했습니다.")
        return
      }

      onCorrectionComplete(data as CorrectDiaryResponse)
    } catch {
      onCorrectionError("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card rounded-3xl p-6 shadow-lg border-2 border-border relative">
      {isLoading && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-3xl bg-card/80 backdrop-blur-sm animate-in fade-in duration-200"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
            </div>
          </div>
          <p className="font-semibold text-foreground">{ui("aiReadingTitle")}</p>
          <p className="text-sm text-muted-foreground">{ui("aiReadingWait")}</p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <PenLine className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div>
          <h2 className="font-bold text-foreground text-lg">{ui("todayDiaryTitle")}</h2>
          <p className="text-sm text-muted-foreground">{ui("diarySubtitle")}</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(clampDiaryText(e.target.value))}
          placeholder={ui("diaryPlaceholder")}
          disabled={isLoading}
          className={cn(
            "min-h-[140px] text-lg rounded-2xl border-2 border-border",
            "bg-input focus:border-primary focus:ring-primary",
            "placeholder:text-muted-foreground/50 resize-none",
            "p-4",
            isLoading && "opacity-60"
          )}
        />

        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          <span className={charCount > maxChars * 0.9 ? "text-destructive" : ""}>
            {charCount}
          </span>
          /{maxChars}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xl">✨</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={value.trim().length < 5 || isLoading}
        className={cn(
          "w-full h-14 text-lg font-bold rounded-2xl",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "shadow-lg hover:shadow-xl transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center gap-3"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{ui("aiChecking")}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>{ui("aiCheckButton")}</span>
            <Sparkles className="w-5 h-5" />
          </>
        )}
      </Button>

      {value.trim().length > 0 && value.trim().length < 5 && !isLoading && (
        <p className="text-center text-sm text-muted-foreground mt-3 animate-in fade-in">
          {ui("minCharsHint")}
        </p>
      )}
    </div>
  )
}
