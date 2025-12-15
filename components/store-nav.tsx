"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Settings, Library, LogOut, Shield, User, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { SafeAnimation } from "@/components/safe-animation"
import { SITE_NAME, ROLE_NAMES, type UserRole } from "@/lib/constants"
import { useUser } from "@/contexts/user-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function StoreNav() {
  const router = useRouter()
  const { user, isLoading } = useUser()

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("[v0] Erro ao sair:", error)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default"
      case "admin":
        return "destructive"
      case "mod":
        return "secondary"
      case "tester":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <SafeAnimation animationClass="hover:scale-105 transition-transform">
            <Link href="/store" className="flex items-center gap-2">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-pretty">
                <span className="text-primary">{SITE_NAME}</span>
              </span>
            </Link>
          </SafeAnimation>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <Link href="/posts">
                <MessageSquare className="h-4 w-4" />
                Posts
              </Link>
            </Button>

            {isLoading ? (
              <div className="text-sm text-muted-foreground">Carregando...</div>
            ) : !user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Entrar (opcional)</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/sign-up">Criar conta</Link>
                </Button>
              </>
            ) : (
              <>
                {(user.role === "admin" || user.role === "owner" || user.role === "mod") && (
                  <Button variant="ghost" size="sm" className="gap-2" asChild>
                    <Link href="/admin">
                      <Shield className="h-4 w-4" />
                      Painel
                    </Link>
                  </Button>
                )}

                <Button variant="ghost" size="icon" asChild>
                  <Link href="/store/library" aria-label="Minhas paradas">
                    <Library className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/store/settings" aria-label="Configs">
                    <Settings className="h-5 w-5" />
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      {user.displayName}
                      {user.role !== "user" && (
                        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs uppercase">
                          {ROLE_NAMES[user.role as UserRole] || user.role}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tua conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/store/settings">Configs</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                      <LogOut className="h-4 w-4 mr-2" />
                      Vazar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
