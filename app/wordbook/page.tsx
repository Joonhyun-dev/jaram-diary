"use client"

import { useEffect, useMemo, useState } from "react"
import { BookOpen, Search, Star, Trash2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  loadWordbookEntries,
  removeWordbookEntry,
  type WordbookEntry,
} from "@/lib/wordbook"

type SortOption = "recent" | "alphabetical"

export default function WordbookPage() {
  const [entries, setEntries] = useState<WordbookEntry[]>([])
  const [query, setQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("recent")

  useEffect(() => {
    setEntries(loadWordbookEntries())
  }, [])

  const normalizedQuery = query.trim().toLowerCase()
  const filteredEntries = useMemo(() => {
    if (!normalizedQuery) return entries
    return entries.filter((entry) => {
      const haystack = [
        entry.word,
        entry.pronunciation,
        entry.meaning,
        entry.exampleSentence,
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [entries, normalizedQuery])

  const sortedEntries = useMemo(() => {
    const base = [...filteredEntries]
    if (sortOption === "alphabetical") {
      return base.sort((a, b) => a.word.localeCompare(b.word, "ko"))
    }
    return base.sort((a, b) => b.savedAt.localeCompare(a.savedAt))
  }, [filteredEntries, sortOption])

  const hasQuery = normalizedQuery.length > 0

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">나만의 단어장</h1>
          <p className="text-sm text-muted-foreground">
            일기에서 클릭한 단어들이 여기에 저장됩니다.
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-border bg-card/60 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            아직 저장된 단어가 없어요. 홈에서 단어 카드를 눌러 보세요!
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="단어/뜻/예문을 검색해 보세요"
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
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSortOption("recent")}
                  className={cn(
                    "rounded-full px-3 py-1 font-medium transition",
                    sortOption === "recent"
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  최근
                </button>
                <button
                  type="button"
                  onClick={() => setSortOption("alphabetical")}
                  className={cn(
                    "rounded-full px-3 py-1 font-medium transition",
                    sortOption === "alphabetical"
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  가나다
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {hasQuery
                ? `검색 결과 ${sortedEntries.length}개 / 전체 ${entries.length}개`
                : `전체 ${entries.length}개`}
            </p>
          </div>

          {sortedEntries.length === 0 ? (
            <div className="mt-6 rounded-3xl border-2 border-dashed border-border bg-card/60 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                검색 결과가 없어요. 다른 키워드로 찾아보세요!
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {sortedEntries.map((entry) => (
                <article
                  key={entry.id}
                  className={cn(
                    "rounded-3xl border-2 border-border bg-card p-5 shadow-sm",
                    "transition-shadow hover:shadow-md"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{entry.word}</h2>
                      <p className="text-xs text-muted-foreground">
                        [{entry.pronunciation}]
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <Star className="w-3 h-3" />
                        저장됨
                      </span>
                      <button
                        type="button"
                        onClick={() => setEntries(removeWordbookEntry(entry.id))}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs",
                          "text-muted-foreground hover:text-destructive hover:border-destructive/40"
                        )}
                        aria-label={`${entry.word} 삭제`}
                      >
                        <Trash2 className="w-3 h-3" />
                        삭제
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-foreground/90 font-medium">{entry.meaning}</p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    &quot;{entry.exampleSentence}&quot;
                  </p>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
