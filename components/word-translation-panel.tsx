"use client"

import { Sparkles, Languages, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getLanguage,
  type LanguageCode,
  type ResolvedTranslation,
} from "@/lib/translations"

interface WordTranslationPanelProps {
  language: LanguageCode
  translation: ResolvedTranslation
}

export function WordTranslationPanel({
  language,
  translation,
}: WordTranslationPanelProps) {
  const lang = getLanguage(language)
  const isPlaceholder = translation.source === "placeholder"
  const isLoading = translation.source === "loading"
  const isError = translation.source === "error"

  return (
    <div
      className={cn(
        "mt-2 rounded-xl px-3 py-2 text-left transition-all duration-200",
        isPlaceholder || isLoading
          ? "border border-dashed border-foreground/20 bg-card/40"
          : isError
            ? "border border-dashed border-destructive/30 bg-destructive/5"
            : "border border-foreground/10 bg-card/60 shadow-sm"
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-base leading-none" aria-hidden="true">
          {lang.flag}
        </span>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
          {lang.nativeLabel}
        </span>
        {translation.source === "gemini" && (
          <span className="ml-auto inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            <Sparkles className="w-2.5 h-2.5" />
            AI
          </span>
        )}
        {isLoading && (
          <span className="ml-auto inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
            번역 중
          </span>
        )}
        {isPlaceholder && (
          <span className="ml-auto inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            <Languages className="w-2.5 h-2.5" />
            준비 중
          </span>
        )}
        {isError && (
          <span className="ml-auto inline-flex items-center gap-0.5 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] text-destructive">
            <AlertCircle className="w-2.5 h-2.5" />
            오류
          </span>
        )}
      </div>
      <p
        className={cn(
          "text-sm leading-snug",
          isPlaceholder || isLoading
            ? "text-muted-foreground italic"
            : isError
              ? "text-destructive/90"
              : "text-foreground/85 font-medium"
        )}
      >
        {translation.text}
      </p>
    </div>
  )
}
