"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

const OWNER_EMAIL = "carvalhosamuel3487@gmail.com"

export interface UserProfile {
  id: string
  email: string
  displayName: string
  role: "owner" | "admin" | "mod" | "tester" | "user"
  canPost: boolean
  canManageUsers: boolean
}

interface UserContextType {
  user: UserProfile | null
  isLoading: boolean
  isOwner: boolean
  canPost: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  isOwner: false,
  canPost: false,
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          setUser(null)
          setIsLoading(false)
          return
        }

        const isOwnerUser = authUser.email === OWNER_EMAIL

        let profile: UserProfile

        if (isOwnerUser) {
          // Owner tem permissões máximas automaticamente
          profile = {
            id: authUser.id,
            email: authUser.email!,
            displayName: authUser.user_metadata?.display_name || "O Chefão",
            role: "owner",
            canPost: true,
            canManageUsers: true,
          }
        } else {
          // Tenta buscar do banco, mas com fallback
          try {
            const { data: dbProfile } = await supabase
              .from("profiles")
              .select("role, display_name, can_post")
              .eq("id", authUser.id)
              .single()

            profile = {
              id: authUser.id,
              email: authUser.email!,
              displayName: dbProfile?.display_name || authUser.email!.split("@")[0],
              role: (dbProfile?.role as any) || "user",
              canPost: dbProfile?.can_post || false,
              canManageUsers: false,
            }
          } catch (error) {
            // Fallback se der erro no banco
            profile = {
              id: authUser.id,
              email: authUser.email!,
              displayName: authUser.email!.split("@")[0],
              role: "user",
              canPost: false,
              canManageUsers: false,
            }
          }
        }

        setUser(profile)
      } catch (error) {
        console.error("[v0] Erro ao carregar usuário:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isOwner: user?.role === "owner",
        canPost: user?.canPost || false,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
