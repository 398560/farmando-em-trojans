import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { StoreNav } from "@/components/store-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ErrorBoundary } from "@/components/error-boundary"
import { Star, ShoppingCart, CheckCircle2, Lock, Download, AlertCircle } from "lucide-react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import Link from "next/link"

export default async function AppPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let game = null
  let error = null

  try {
    const { data, error: fetchError } = await supabase.from("games").select("*").eq("id", id).single()

    if (fetchError) throw fetchError
    game = data
  } catch (e) {
    console.error("[v0] Erro ao buscar game:", e)
    error = e
  }

  if (!game && !error) {
    notFound()
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <StoreNav isLoggedIn={!!user} />
        <main className="container mx-auto px-4 py-8">
          <div className="p-8 rounded-lg border border-red-900/20 bg-card/50 flex flex-col items-center gap-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <h2 className="text-2xl font-bold">Isso aqui deu ruim</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Não conseguimos carregar esse app. Tenta de novo ou volta pra loja.
            </p>
            <Button asChild>
              <Link href="/store">Voltar pra loja</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  let profile = null
  let ownership = null

  if (user) {
    try {
      const { data: profileData } = await supabase.from("profiles").select("role").eq("id", user.id).single()
      profile = profileData

      const { data: ownershipData } = await supabase
        .from("user_library")
        .select("*")
        .eq("user_id", user.id)
        .eq("game_id", id)
        .single()
      ownership = ownershipData
    } catch (e) {
      console.error("[v0] Erro ao buscar perfil/ownership:", e)
    }
  }

  const isOwned = !!ownership
  const canAccess =
    game.status !== "restricted" || isOwned || ["admin", "owner", "tester"].includes(profile?.role || "")

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      stable: { label: "ESTÁVEL", className: "bg-green-600" },
      beta: { label: "FUNCIONA ÀS VEZES", className: "bg-yellow-600" },
      experimental: { label: "VAI QUEBRAR", className: "bg-orange-600" },
      restricted: { label: "NEM TENTA", className: "bg-red-600" },
    }
    return variants[status] || variants.stable
  }

  const statusBadge = getStatusBadge(game.status)

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <StoreNav isLoggedIn={!!user} />

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative aspect-video overflow-hidden rounded-lg border border-red-900/20">
                <Image src={game.image_url || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
              </div>

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2 text-balance">{game.title}</h1>
                    <p className="text-muted-foreground text-pretty">{game.publisher}</p>
                  </div>
                  <Badge className={`${statusBadge.className} text-white`}>{statusBadge.label}</Badge>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="text-lg font-semibold">{game.rating?.toFixed(1)}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {game.genres?.map((genre: string) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-lg text-pretty">{game.description}</p>
              </div>

              {game.changelog && (
                <ErrorBoundary
                  fallback={
                    <Card className="border-red-900/20">
                      <CardContent className="p-6 text-center text-muted-foreground">
                        Erro ao carregar changelog
                      </CardContent>
                    </Card>
                  }
                >
                  <Card className="border-red-900/20">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-4">Mudanças</h2>
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{game.changelog}</ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              )}
            </div>

            <div className="space-y-4">
              <Card className="border-red-900/20 sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <div className="text-3xl font-bold">${game.price?.toFixed(2)}</div>

                  {!user ? (
                    <Button className="w-full gap-2" size="lg" asChild>
                      <Link href="/auth/login">
                        <ShoppingCart className="h-5 w-5" />
                        Entrar pra pegar
                      </Link>
                    </Button>
                  ) : isOwned ? (
                    <>
                      <Button className="w-full gap-2" size="lg">
                        <Download className="h-5 w-5" />
                        Instalar
                      </Button>
                      <Button className="w-full gap-2 bg-transparent" variant="outline" size="lg">
                        <CheckCircle2 className="h-5 w-5" />
                        Já pegou
                      </Button>
                    </>
                  ) : canAccess ? (
                    <Button className="w-full gap-2" size="lg">
                      <ShoppingCart className="h-5 w-5" />
                      Pegar
                    </Button>
                  ) : (
                    <>
                      <Button className="w-full gap-2 bg-transparent" variant="outline" size="lg" disabled>
                        <Lock className="h-5 w-5" />
                        Tá bloqueado
                      </Button>
                      <p className="text-sm text-muted-foreground text-center">
                        Isso aqui precisa de conta e permissão especial
                      </p>
                    </>
                  )}

                  {game.features && game.features.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Recursos</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {game.features.map((feature: string) => (
                          <li key={feature}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}
