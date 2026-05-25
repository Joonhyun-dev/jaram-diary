"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { BookOpen, Calendar as CalendarIcon, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isSameDay } from "date-fns"
import { loadArchiveEntries, type DiaryArchiveEntry } from "@/lib/archive"

export default function ArchivePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [entries, setEntries] = useState<DiaryArchiveEntry[]>([])

  useEffect(() => {
    const stored = loadArchiveEntries()
    setEntries(stored)
    if (stored[0]) {
      setSelectedDate(new Date(stored[0].createdAt))
    }
  }, [])

  const entryDates = useMemo(
    () => entries.map((entry) => new Date(entry.createdAt)),
    [entries]
  )
  const activeDate = selectedDate ?? new Date()
  const selectedEntries = useMemo(
    () =>
      entries.filter((entry) => isSameDay(new Date(entry.createdAt), activeDate)),
    [entries, activeDate]
  )

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
          <CalendarIcon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">일기 보관함</h1>
          <p className="text-sm text-muted-foreground">
            달력에서 일기를 쓴 날을 확인하고 다시 읽어보세요.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-3xl border-2 border-border bg-card p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ hasEntry: entryDates }}
            modifiersClassNames={{
              hasEntry:
                "relative after:absolute after:bottom-1 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:bg-primary",
            }}
          />
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
            저장된 일기
          </div>
        </section>

        <section className="rounded-3xl border-2 border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">선택한 날짜의 일기</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {format(activeDate, "yyyy년 M월 d일")}
          </p>

          {selectedEntries.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">
              아직 저장된 일기가 없어요.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {selectedEntries.map((entry) => (
                <article
                  key={entry.id}
                  className={cn(
                    "rounded-2xl border border-border bg-background p-4",
                    "shadow-sm transition-shadow hover:shadow-md"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      나의 문장
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/90">{entry.original}</p>

                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI 선생님 문장
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {entry.corrected}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{entry.feedback}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
