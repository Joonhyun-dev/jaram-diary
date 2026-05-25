"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpen,
  Calendar as CalendarIcon,
  Check,
  Pencil,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format, isSameDay } from "date-fns"
import {
  loadArchiveEntries,
  removeArchiveEntry,
  updateArchiveEntry,
  type DiaryArchiveEntry,
} from "@/lib/archive"
import { LANGUAGES, type LanguageCode } from "@/lib/translations"

export default function ArchivePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [entries, setEntries] = useState<DiaryArchiveEntry[]>([])
  const [query, setQuery] = useState("")
  const [languageFilter, setLanguageFilter] = useState<LanguageCode | "all">("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState({
    original: "",
    corrected: "",
    feedback: "",
  })

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
  const normalizedQuery = query.trim().toLowerCase()
  const filteredEntries = useMemo(() => {
    let list = selectedEntries
    if (languageFilter !== "all") {
      list = list.filter((entry) => entry.language === languageFilter)
    }
    if (normalizedQuery) {
      list = list.filter((entry) =>
        [entry.original, entry.corrected, entry.feedback]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    }
    return list
  }, [selectedEntries, languageFilter, normalizedQuery])

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

          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="일기 내용을 검색해 보세요"
                  className="h-10 rounded-full bg-card pl-9 pr-9"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
                    aria-label="검색어 지우기"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <select
                value={languageFilter}
                onChange={(event) =>
                  setLanguageFilter(event.target.value as LanguageCode | "all")
                }
                className={cn(
                  "h-10 rounded-full border border-border bg-card px-3 text-sm",
                  "text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                )}
              >
                <option value="all">전체 언어</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              {normalizedQuery || languageFilter !== "all"
                ? `검색 결과 ${filteredEntries.length}개 / 전체 ${selectedEntries.length}개`
                : `전체 ${selectedEntries.length}개`}
            </p>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center text-sm text-muted-foreground">
              {selectedEntries.length === 0
                ? "아직 저장된 일기가 없어요."
                : "검색 결과가 없어요."}
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {filteredEntries.map((entry) => (
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
                    <div className="flex items-center gap-2">
                      {editingId === entry.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEntries(
                                updateArchiveEntry(entry.id, {
                                  original: draft.original.trim(),
                                  corrected: draft.corrected.trim(),
                                  feedback: draft.feedback.trim(),
                                })
                              )
                              setEditingId(null)
                            }}
                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                          >
                            <Check className="h-3 w-3" />
                            저장
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(entry.id)
                              setDraft({
                                original: entry.original,
                                corrected: entry.corrected,
                                feedback: entry.feedback,
                              })
                            }}
                            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="h-3 w-3" />
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => setEntries(removeArchiveEntry(entry.id))}
                            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40"
                          >
                            <Trash2 className="h-3 w-3" />
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {editingId === entry.id ? (
                    <div className="mt-3 space-y-3">
                      <Textarea
                        value={draft.original}
                        onChange={(event) =>
                          setDraft((prev) => ({ ...prev, original: event.target.value }))
                        }
                        className="min-h-[80px] rounded-2xl"
                        placeholder="내가 쓴 문장"
                      />
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI 선생님 문장
                      </div>
                      <Textarea
                        value={draft.corrected}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            corrected: event.target.value,
                          }))
                        }
                        className="min-h-[80px] rounded-2xl"
                        placeholder="AI가 고쳐준 문장"
                      />
                      <Textarea
                        value={draft.feedback}
                        onChange={(event) =>
                          setDraft((prev) => ({ ...prev, feedback: event.target.value }))
                        }
                        className="min-h-[80px] rounded-2xl"
                        placeholder="AI 피드백"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="mt-2 text-sm text-foreground/90">{entry.original}</p>

                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI 선생님 문장
                      </div>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {entry.corrected}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {entry.feedback}
                      </p>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
