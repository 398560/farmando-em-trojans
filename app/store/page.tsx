import { createClient } from "@/lib/supabase/server"
import { GameCard } from "@/components/game-card"
import { StoreFeaturedHero } from "@/components/store-featured-hero"
import { StoreNav } from "@/components/store-nav"
import { ErrorBoundary } from "@/components/error-boundary"
import { AlertCircle } from "lucide-react"

export default async function StorePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let games = null
  let error = null

  try {
    const { data, error: fetchError } = await supabase
      .from("games")
      .select("*")
      .order("release_date", { ascending: false })

    if (fetchError) throw fetchError
    games = data
  } catch (e) {
    console.error("[v0] Erro ao buscar games:", e)
    error = e
  }

  let ownedGameIds = new Set<string>()

  if (user) {
    try {
      const { data: userLibrary } = await supabase.from("user_library").select("game_id").eq("user_id", user.id)

      ownedGameIds = new Set(userLibrary?.map((item) => item.game_id) || [])
    } catch (e) {
      console.error("[v0] Erro ao buscar biblioteca:", e)
    }
  }

  const featuredGame = games?.[0]
  const otherGames = games?.slice(1) || []

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <StoreNav isLoggedIn={!!user} />

        <main className="container mx-auto px-4 py-8 space-y-12">
          {error && (
            <div className="p-6 rounded-lg border border-red-900/20 bg-card/50 flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-1">Deu ruim ao carregar as paradas</h3>
                <p className="text-sm text-muted-foreground">
                  Alguma coisa quebrou, mas relaxa. Tenta recarregar a página.
                </p>
              </div>
            </div>
          )}

          {!error && games && games.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-xl text-muted-foreground">Ainda não tem nada aqui. Volta depois.</p>
            </div>
          )}

          {featuredGame && (
            <ErrorBoundary
              fallback={
                <div className="p-6 rounded-lg border border-red-900/20 bg-card/50 text-center">
                  <p className="text-muted-foreground">Erro ao carregar destaque</p>
                </div>
              }
            >
              <StoreFeaturedHero game={featuredGame} isOwned={ownedGameIds.has(featuredGame.id)} isLoggedIn={!!user} />
            </ErrorBoundary>
          )}

          {otherGames.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-6 text-balance">As paradas recentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherGames.map((game) => (
                  <ErrorBoundary
                    key={game.id}
                    fallback={
                      <div className="p-6 rounded-lg border border-red-900/20 bg-card/50 text-center">
                        <p className="text-sm text-muted-foreground">Erro ao carregar app</p>
                      </div>
                    }
                  >
                    <GameCard game={game} isOwned={ownedGameIds.has(game.id)} isLoggedIn={!!user} />
                  </ErrorBoundary>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </ErrorBoundary>
  )
}
