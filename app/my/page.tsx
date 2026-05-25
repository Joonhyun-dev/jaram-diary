"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { User, Settings, Calendar as CalendarIcon, Flame } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { StreakCounter } from "@/components/streak-counter"
import { useLanguage } from "@/components/language-provider"
import {
  getArchiveStreak,
  loadArchiveEntries,
  type DiaryArchiveEntry,
} from "@/lib/archive"
import { cn } from "@/lib/utils"
import { isSameMonth } from "date-fns"

export default function MyPage() {
  const { language, setLanguage } = useLanguage()
  const [streak, setStreak] = useState(0)
  const [entries, setEntries] = useState<DiaryArchiveEntry[]>([])

  useEffect(() => {
    const stored = loadArchiveEntries()
    setEntries(stored)
    setStreak(getArchiveStreak(stored))
  }, [])

  const entryDates = useMemo(
    () => entries.map((entry) => new Date(entry.createdAt)),
    [entries]
  )
  const totalCount = entries.length
  const monthCount = useMemo(() => {
    const now = new Date()
    return entries.filter((entry) => isSameMonth(new Date(entry.createdAt), now))
      .length
  }, [entries])

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
          <Flame className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">연속 기록</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          꾸준히 쓰는 만큼 기록이 쌓여요.
        </p>
        <div className={cn("mt-4 flex items-center justify-center")}>
          <StreakCounter streak={streak} uiLanguage={language} />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            연속 {streak}일
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            이번 달 {monthCount}회
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            전체 {totalCount}회
          </span>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border-2 border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">작성 캘린더</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          기록한 날이 점으로 표시돼요.
        </p>
        <div className="mt-4">
          <Calendar
            mode="single"
            selected={new Date()}
            modifiers={{ hasEntry: entryDates }}
            modifiersClassNames={{
              hasEntry:
                "relative after:absolute after:bottom-1 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:bg-primary",
            }}
          />
        </div>
      </section>
    </main>
  )
}
