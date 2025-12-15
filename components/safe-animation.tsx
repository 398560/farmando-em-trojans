"use client"

import { useAccessibility } from "@/contexts/accessibility-context"
import type { ReactNode } from "react"

interface SafeAnimationProps {
  children: ReactNode
  className?: string
  animationClass?: string
}

export function SafeAnimation({ children, className = "", animationClass = "" }: SafeAnimationProps) {
  const { settings } = useAccessibility()

  return <div className={`${className} ${settings.reduceMotion ? "" : animationClass}`}>{children}</div>
}
