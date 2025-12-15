import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StoreNav } from "@/components/store-nav"
import { AccessibilityPanel } from "@/components/accessibility-panel"
import { ErrorBoundary } from "@/components/error-boundary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ROLE_NAMES, type UserRole } from "@/lib/constants"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/store/settings&message=configurações")
  }

  let profile = null
  let error = null

  try {
    const { data, error: fetchError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (fetchError) throw fetchError
    profile = data
  } catch (e) {
    console.error("[v0] Erro ao buscar perfil:", e)
    error = e
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <StoreNav isLoggedIn={true} />

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-balance">Configs</h1>

          <div className="space-y-6">
            {error ? (
              <Card className="border-red-900/20">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Erro ao carregar perfil. Tenta recarregar.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-red-900/20">
                <CardHeader>
                  <CardTitle>Tuas informações</CardTitle>
                  <CardDescription>Dados da tua conta</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Nome</dt>
                      <dd className="text-lg">{profile?.display_name || "Não definido"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                      <dd className="text-lg">{user.email}</dd>
                    </div>
                    {profile?.role && profile.role !== "user" && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Cargo</dt>
                        <dd className="text-lg">
                          <Badge variant="secondary" className="text-xs uppercase">
                            {ROLE_NAMES[profile.role as UserRole] || profile.role}
                          </Badge>
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            )}

            <AccessibilityPanel />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}
