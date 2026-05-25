"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { LANGUAGES, type Language, type LanguageCode } from "@/lib/translations"

interface LanguageSelectorProps {
  selectedLanguage: LanguageCode
  onLanguageChange: (code: LanguageCode) => void
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const current = LANGUAGES.find((l) => l.code === selectedLanguage) ?? LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full",
            "bg-card border-2 border-border shadow-md",
            "hover:border-primary/50 hover:shadow-lg",
            "transition-all duration-200 text-sm font-medium text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          )}
          aria-label={`모국어 선택: ${current.label}`}
        >
          <span className="text-lg leading-none" aria-hidden="true">
            {current.flag}
          </span>
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-[10px] text-muted-foreground font-normal">모국어</span>
            <span>{current.label}</span>
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="rounded-2xl border-2 border-border shadow-xl p-1 min-w-[200px]"
      >
        <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
          모국어 번역
        </p>
        {LANGUAGES.map((lang: Language) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer",
              "transition-colors duration-150",
              selectedLanguage === lang.code
                ? "bg-primary/15 text-foreground font-semibold"
                : "text-foreground hover:bg-muted"
            )}
          >
            <span className="text-xl leading-none" aria-hidden="true">
              {lang.flag}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{lang.label}</span>
              <span className="text-xs text-muted-foreground">{lang.nativeLabel}</span>
            </div>
            {selectedLanguage === lang.code && (
              <span className="ml-auto text-primary text-xs font-bold">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
