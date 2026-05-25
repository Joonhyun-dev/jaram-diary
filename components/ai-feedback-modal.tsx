"use client"

import { useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Sparkles, ArrowRight, Star } from "lucide-react"
import confetti from "canvas-confetti"
import { cn } from "@/lib/utils"
import { type LanguageCode, LANGUAGES } from "@/lib/translations"

interface AIFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  isLoading: boolean
  originalText: string
  correctedText: string
  feedback: string
  translationLanguage?: LanguageCode
  translatedFeedback?: string
}

export function AIFeedbackModal({
  isOpen,
  onClose,
  isLoading,
  originalText,
  correctedText,
  feedback,
  translationLanguage,
  translatedFeedback,
}: AIFeedbackModalProps) {
  const showTranslation = translationLanguage && translationLanguage !== "ko" && translatedFeedback
  const translationLang = LANGUAGES.find((l) => l.code === translationLanguage)
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-md mx-auto bg-card border-2 border-border rounded-3xl p-0 overflow-hidden"
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {isLoading ? (
          /* Loading state */
          <div className="p-8 text-center">
            <DialogTitle className="sr-only">AI 선생님이 읽고 있어요</DialogTitle>
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Cute animated character */}
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center animate-bounce-soft">
                <span className="text-4xl">✍️</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              AI 선생님이 읽고 있어요...
            </h3>
            <p className="text-muted-foreground">잠시만 기다려 주세요!</p>
            
            {/* Animated dots */}
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
          /* Result state */
          <div className="relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-foreground/10 transition-colors z-10"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Header with sticker */}
            <div className="bg-gradient-to-b from-primary/30 to-transparent pt-6 pb-8 px-6 text-center">
              <DialogTitle className="sr-only">AI 선생님의 피드백</DialogTitle>
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg animate-bounce-soft">
                  <span className="text-4xl">⭐</span>
                </div>
                {/* Floating stars */}
                <Star className="absolute -top-2 -left-2 w-6 h-6 text-yellow-400 fill-yellow-400 animate-float" />
                <Star className="absolute -top-1 -right-3 w-4 h-4 text-yellow-400 fill-yellow-400 animate-float" style={{ animationDelay: "0.5s" }} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mt-4">
                잘했어요! 🎉
              </h3>
            </div>

            {/* Content */}
            <div className="px-6 pb-6 -mt-2">
              {/* Original sentence */}
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  내가 쓴 문장
                </label>
                <div className="p-4 bg-muted rounded-2xl">
                  <p className="text-foreground">{originalText}</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center my-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-secondary-foreground rotate-90" />
                </div>
              </div>

              {/* Corrected sentence */}
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI가 고쳐준 멋진 문장
                </label>
                <div className="p-4 bg-primary/20 rounded-2xl border-2 border-primary/40">
                  <p className="text-foreground font-medium">{correctedText}</p>
                </div>
              </div>

              {/* Feedback bubble */}
              <div className="relative mb-6">
                <div className="absolute -top-2 left-6 w-4 h-4 bg-secondary rotate-45" />
                <div className="p-4 bg-secondary rounded-2xl space-y-2">
                  <p className="text-secondary-foreground">
                    <span className="font-bold">AI 선생님:</span> {feedback}
                  </p>
                  {showTranslation && (
                    <div className="border-t border-secondary-foreground/10 pt-2 flex items-start gap-1.5">
                      <span className="text-base leading-none mt-0.5" aria-hidden="true">
                        {translationLang?.flag}
                      </span>
                      <p className="text-secondary-foreground/80 text-sm">
                        {translatedFeedback}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Praise sticker row */}
              <div className="flex justify-center gap-4 mb-4">
                <div className={cn(
                  "w-16 h-16 rounded-full bg-word-yellow flex items-center justify-center",
                  "shadow-md animate-wiggle"
                )}>
                  <span className="text-2xl">👍</span>
                </div>
                <div className={cn(
                  "w-16 h-16 rounded-full bg-word-mint flex items-center justify-center",
                  "shadow-md animate-wiggle"
                )} style={{ animationDelay: "0.2s" }}>
                  <span className="text-2xl">🌟</span>
                </div>
                <div className={cn(
                  "w-16 h-16 rounded-full bg-word-pink flex items-center justify-center",
                  "shadow-md animate-wiggle"
                )} style={{ animationDelay: "0.4s" }}>
                  <span className="text-2xl">💪</span>
                </div>
              </div>

              {/* Close button */}
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
