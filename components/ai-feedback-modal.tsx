"use client"

import { useEffect, useCallback, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Sparkles, ArrowRight, Star, Languages, ChevronDown, ChevronUp } from "lucide-react"
import confetti from "canvas-confetti"
import { cn } from "@/lib/utils"
import {
  getLanguage,
  getNativeTranslationButtonLabel,
  type LanguageCode,
  type ResolvedTranslation,
} from "@/lib/translations"

interface AIFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  isLoading: boolean
  originalText: string
  correctedText: string
  feedback: string
  translationLanguage?: LanguageCode
  feedbackTranslation?: ResolvedTranslation | null
}

export function AIFeedbackModal({
  isOpen,
  onClose,
  isLoading,
  originalText,
  correctedText,
  feedback,
  translationLanguage = "ko",
  feedbackTranslation,
}: AIFeedbackModalProps) {
  const [showNativeFeedback, setShowNativeFeedback] = useState(false)
  const lang = getLanguage(translationLanguage)
  const canShowNative =
    translationLanguage !== "ko" && feedbackTranslation !== null && feedbackTranslation !== undefined
  const isPlaceholder = feedbackTranslation?.source === "placeholder"

  const fireConfetti = useCallback(() => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ["#FFE066", "#A8E6CF", "#FFB8C6"],
    })
    fire(0.2, {
      spread: 60,
      colors: ["#FFE066", "#A8E6CF", "#FFB8C6"],
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ["#FFE066", "#A8E6CF", "#FFB8C6"],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ["#FFE066", "#A8E6CF", "#FFB8C6"],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ["#FFE066", "#A8E6CF", "#FFB8C6"],
    })
  }, [])

  useEffect(() => {
    if (isOpen && !isLoading && correctedText) {
      const timer = setTimeout(() => {
        fireConfetti()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, isLoading, correctedText, fireConfetti])

  useEffect(() => {
    if (!isOpen) {
      setShowNativeFeedback(false)
    }
  }, [isOpen])

  useEffect(() => {
    setShowNativeFeedback(false)
  }, [translationLanguage])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-md mx-auto bg-card border-2 border-border rounded-3xl p-0 overflow-hidden"
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {isLoading ? (
          <div className="p-8 text-center">
            <DialogTitle className="sr-only">AI 선생님이 읽고 있어요</DialogTitle>
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center animate-bounce-soft">
                <span className="text-4xl">✍️</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              AI 선생님이 읽고 있어요...
            </h3>
            <p className="text-muted-foreground">잠시만 기다려 주세요!</p>

            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-primary"
                  style={{
                    animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : !isLoading && correctedText ? (
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-foreground/10 transition-colors z-10"
              aria-label="닫기"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="bg-gradient-to-b from-primary/30 to-transparent pt-6 pb-8 px-6 text-center">
              <DialogTitle className="sr-only">AI 선생님의 피드백</DialogTitle>
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg animate-bounce-soft">
                  <span className="text-4xl">⭐</span>
                </div>
                <Star className="absolute -top-2 -left-2 w-6 h-6 text-yellow-400 fill-yellow-400 animate-float" />
                <Star
                  className="absolute -top-1 -right-3 w-4 h-4 text-yellow-400 fill-yellow-400 animate-float"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
              <h3 className="text-2xl font-bold text-foreground mt-4">잘했어요! 🎉</h3>
            </div>

            <div className="px-6 pb-6 -mt-2">
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  내가 쓴 문장
                </label>
                <div className="p-4 bg-muted rounded-2xl">
                  <p className="text-foreground">{originalText}</p>
                </div>
              </div>

              <div className="flex justify-center my-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-secondary-foreground rotate-90" />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI가 고쳐준 멋진 문장
                </label>
                <div className="p-4 bg-primary/20 rounded-2xl border-2 border-primary/40">
                  <p className="text-foreground font-medium">{correctedText}</p>
                </div>
              </div>

              <div className="relative mb-4">
                <div className="absolute -top-2 left-6 w-4 h-4 bg-secondary rotate-45" />
                <div className="p-4 bg-secondary rounded-2xl">
                  <p className="text-secondary-foreground">
                    <span className="font-bold">AI 선생님:</span> {feedback}
                  </p>
                </div>
              </div>

              {canShowNative && (
                <div className="mb-4 space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNativeFeedback((prev) => !prev)}
                    className={cn(
                      "w-full h-11 rounded-2xl border-2 font-semibold text-sm",
                      "flex items-center justify-center gap-2",
                      showNativeFeedback
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <Languages className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {getNativeTranslationButtonLabel(translationLanguage)}
                    </span>
                    {showNativeFeedback ? (
                      <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                    )}
                  </Button>

                  {showNativeFeedback && feedbackTranslation && (
                    <div
                      className={cn(
                        "rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200",
                        isPlaceholder
                          ? "border-2 border-dashed border-primary/30 bg-primary/5"
                          : "border-2 border-primary/20 bg-primary/10"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg" aria-hidden="true">
                          {lang.flag}
                        </span>
                        <span className="text-xs font-bold text-primary uppercase tracking-wide">
                          {lang.nativeLabel} 피드백
                        </span>
                        {feedbackTranslation.source === "gemini" && (
                          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                            <Sparkles className="w-3 h-3" />
                            Gemini
                          </span>
                        )}
                        {isPlaceholder && (
                          <span className="ml-auto text-[10px] text-muted-foreground font-medium">
                            샘플 번역
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          isPlaceholder
                            ? "text-muted-foreground italic"
                            : "text-foreground font-medium"
                        )}
                      >
                        {feedbackTranslation.text}
                      </p>
                      {isPlaceholder && (
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          Google Gemini AI 연동 후 실제 일기 내용에 맞는 모국어 피드백이
                          표시됩니다.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-center gap-4 mb-4">
                <div
                  className={cn(
                    "w-16 h-16 rounded-full bg-word-yellow flex items-center justify-center",
                    "shadow-md animate-wiggle"
                  )}
                >
                  <span className="text-2xl">👍</span>
                </div>
                <div
                  className={cn(
                    "w-16 h-16 rounded-full bg-word-mint flex items-center justify-center",
                    "shadow-md animate-wiggle"
                  )}
                  style={{ animationDelay: "0.2s" }}
                >
                  <span className="text-2xl">🌟</span>
                </div>
                <div
                  className={cn(
                    "w-16 h-16 rounded-full bg-word-pink flex items-center justify-center",
                    "shadow-md animate-wiggle"
                  )}
                  style={{ animationDelay: "0.4s" }}
                >
                  <span className="text-2xl">💪</span>
                </div>
              </div>

              <Button
                onClick={onClose}
                className={cn(
                  "w-full h-12 text-base font-bold rounded-2xl",
                  "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                확인했어요! 🙌
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
