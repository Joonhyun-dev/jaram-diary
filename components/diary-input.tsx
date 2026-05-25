"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, PenLine } from "lucide-react"
import { cn } from "@/lib/utils"

interface DiaryInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function DiaryInput({ value, onChange, onSubmit, isLoading }: DiaryInputProps) {
  const charCount = value.length
  const maxChars = 100

  return (
    <div className="bg-card rounded-3xl p-6 shadow-lg border-2 border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <PenLine className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div>
          <h2 className="font-bold text-foreground text-lg">오늘의 일기</h2>
          <p className="text-sm text-muted-foreground">
            오늘 배운 단어로 일기를 한 줄 써보세요!
          </p>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative mb-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxChars))}
          placeholder="여기에 일기를 써보세요... 🌸"
          className={cn(
            "min-h-[140px] text-lg rounded-2xl border-2 border-border",
            "bg-input focus:border-primary focus:ring-primary",
            "placeholder:text-muted-foreground/50 resize-none",
            "p-4"
          )}
        />
        
        {/* Character count */}
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          <span className={charCount > maxChars * 0.9 ? "text-destructive" : ""}>
            {charCount}
          </span>
          /{maxChars}
        </div>
      </div>

      {/* Decorative line with stars */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xl">✨</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Submit button */}
      <Button
        onClick={onSubmit}
        disabled={value.trim().length < 5 || isLoading}
        className={cn(
          "w-full h-14 text-lg font-bold rounded-2xl",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "shadow-lg hover:shadow-xl transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center gap-3"
        )}
      >
        <Sparkles className="w-5 h-5" />
        <span>AI 선생님에게 검사받기</span>
        <Sparkles className="w-5 h-5" />
      </Button>

      {/* Helper text */}
      {value.trim().length > 0 && value.trim().length < 5 && (
        <p className="text-center text-sm text-muted-foreground mt-3 animate-in fade-in">
          조금만 더 써볼까요? (최소 5글자)
        </p>
      )}
    </div>
  )
}
