"use client"

import { useAccessibility } from "@/contexts/accessibility-context"
import type { ReactNode } from "react"

export function AccessibilityWrapper({ children }: { children: ReactNode }) {
  const { settings } = useAccessibility()

  return (
    <div
      className={`
        ${settings.reduceMotion ? "motion-reduce" : ""}
        ${settings.highContrast ? "high-contrast" : ""}
        ${settings.largeText ? "text-lg" : ""}
        ${settings.screenReaderMode ? "sr-mode" : ""}
      `}
      data-reduce-motion={settings.reduceMotion}
      data-high-contrast={settings.highContrast}
      data-large-text={settings.largeText}
      data-screen-reader={settings.screenReaderMode}
    >
      {children}
    </div>
  )
}
