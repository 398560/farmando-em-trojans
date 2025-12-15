import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GameCard } from "@/components/game-card"
import { StoreNav } from "@/components/store-nav"
import { ErrorBoundary } from "@/components/error-boundary"
import { AlertCircle } from "lucide-react"

export default async function LibraryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/store/library&message=biblioteca")
  }

  let userLibrary = null
  let error = null

  try {
    const { data, error: fetchError } = await supabase
      .from("user_library")
      .select("game_id, games(*)")
      .eq("user_id", user.id)
      .order("purchased_at", { ascending: false })

    if (fetchError) throw fetchError
    userLibrary = data
  } catch (e) {
    console.error("[v0] Erro ao buscar biblioteca:", e)
    error = e
  }

  const games = userLibrary?.map((item) => item.games).filter(Boolean) || []

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <StoreNav isLoggedIn={true} />

        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-balance">Minhas paradas</h1>

          {error && (
            <div className="p-6 rounded-lg border border-red-900/20 bg-card/50 flex items-center gap-4 mb-6">
              <AlertCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-1">Deu ruim ao carregar tua biblioteca</h3>
                <p className="text-sm text-muted-foreground">
                  Alguma coisa quebrou, mas relaxa. Tenta recarregar a página.
                </p>
              </div>
            </div>
          )}

          {!error && games.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground text-pretty mb-4">Tu ainda não pegou nada. Vai lá na loja!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game: any) => (
                <ErrorBoundary
                  key={game?.id || Math.random()}
                  fallback={
                    <div className="p-6 rounded-lg border border-red-900/20 bg-card/50 text-center">
                      <p className="text-sm text-muted-foreground">Erro ao carregar app</p>
                    </div>
                  }
                >
                  {game && <GameCard game={game} isOwned={true} isLoggedIn={true} />}
                </ErrorBoundary>
              ))}
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  )
}
