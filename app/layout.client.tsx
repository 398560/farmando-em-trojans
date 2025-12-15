"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { AccessibilityProvider } from "@/contexts/accessibility-context"
import { AccessibilityWrapper } from "@/components/accessibility-wrapper"
import { ErrorBoundary } from "@/components/error-boundary"
import { UserProvider } from "@/contexts/user-context"
import { PostsProvider } from "@/contexts/posts-context"

export function LayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <ErrorBoundary
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-primary">Deu ruim</h1>
              <p className="text-muted-foreground">Alguma coisa quebrou, mas a gente tá trabalhando nisso (talvez)</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Tentar de novo
              </button>
            </div>
          </div>
        }
      >
        <AccessibilityProvider>
          <UserProvider>
            <PostsProvider>
              <AccessibilityWrapper>{children}</AccessibilityWrapper>
            </PostsProvider>
          </UserProvider>
        </AccessibilityProvider>
      </ErrorBoundary>
      <Analytics />
    </>
  )
}
