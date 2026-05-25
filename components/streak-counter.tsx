"use client"

import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakCounterProps {
  streak: number
}

export function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full",
      "bg-card border-2 border-border shadow-md",
      "transition-all duration-300",
      streak > 0 && "animate-pulse-glow border-primary/50"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center",
        streak > 0 ? "bg-orange-100" : "bg-muted"
      )}>
        <Flame className={cn(
          "w-5 h-5",
          streak > 0 ? "text-orange-500" : "text-muted-foreground"
        )} />
      </div>
      <div className="text-sm">
        <span className="text-muted-foreground">연속 일기 작성일수:</span>
        <span className={cn(
          "font-bold ml-1",
          streak > 0 ? "text-orange-500" : "text-foreground"
        )}>
          {streak}일
        </span>
        <span className="ml-1">{streak > 0 ? "🔥" : ""}</span>
      </div>
    </div>
  )
}
