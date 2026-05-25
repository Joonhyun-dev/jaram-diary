import { JaramDiaryPage } from "@/components/jaram-diary-page"
import { pickRandomWords } from "@/lib/vocabulary"

export const dynamic = "force-dynamic"

export default function HomePage() {
  const todayWords = pickRandomWords(3)

  return <JaramDiaryPage todayWords={todayWords} />
}
