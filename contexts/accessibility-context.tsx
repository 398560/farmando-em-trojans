"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface AccessibilitySettings {
  reduceMotion: boolean
  highContrast: boolean
  largeText: boolean
  screenReaderMode: boolean
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void
  isLoading: boolean
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: {
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderMode: false,
  },
  updateSettings: () => {},
  isLoading: false,
})

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderMode: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Carrega de localStorage se disponível
    try {
      const saved = localStorage.getItem("accessibility-settings")
      if (saved) {
        setSettings(JSON.parse(saved))
      }
    } catch (error) {
      console.error("[v0] Error loading accessibility settings from localStorage:", error)
    }
  }, [])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)

    try {
      localStorage.setItem("accessibility-settings", JSON.stringify(updatedSettings))
    } catch (error) {
      console.error("[v0] Error saving accessibility settings:", error)
    }
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  return useContext(AccessibilityContext)
}
