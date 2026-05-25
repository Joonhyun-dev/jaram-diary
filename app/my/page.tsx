"use client"

import { useState } from "react"
import { User, Settings } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { StreakCounter } from "@/components/streak-counter"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

export default function MyPage() {
  const { language, setLanguage } = useLanguage()
  const [streak] = useState(0)

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">마이페이지</h1>
          <p className="text-sm text-muted-foreground">
            나의 학습 기록과 모국어 설정을 관리해요.
          </p>
        </div>
      </div>

      <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">모국어 설정</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          선택한 모국어는 앱 전체에 적용됩니다.
        </p>
        <div className="mt-4">
          <LanguageSelector
            selectedLanguage={language}
            onLanguageChange={setLanguage}
          />
        </div>
      </section>

      <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h2 className="text-lg font-semibold text-foreground">연속 기록</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          꾸준히 쓰는 만큼 기록이 쌓여요.
        </p>
        <div className={cn("mt-4 flex items-center justify-center")}>
          <StreakCounter streak={streak} uiLanguage={language} />
        </div>
      </section>
    </main>
  )
}
