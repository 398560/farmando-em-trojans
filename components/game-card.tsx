"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, CheckCircle2, Lock } from "lucide-react"
import { SafeAnimation } from "@/components/safe-animation"
import Image from "next/image"
import Link from "next/link"

interface Game {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  rating: number
  genres: string[]
  status?: string
}

interface GameCardProps {
  game: Game
  isOwned: boolean
  isLoggedIn?: boolean
}

export function GameCard({ game, isOwned, isLoggedIn = false }: GameCardProps) {
  const getStatusBadge = (status: string | undefined) => {
    if (!status || status === "stable") return null

    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      beta: { label: "FUNCIONA ÀS VEZES", variant: "secondary" },
      experimental: { label: "VAI QUEBRAR", variant: "outline" },
      restricted: { label: "NEM TENTA", variant: "destructive" },
    }

    const config = variants[status]
    if (!config) return null

    return (
      <Badge variant={config.variant} className="absolute top-2 right-2 text-xs">
        {config.label}
      </Badge>
    )
  }

  return (
    <SafeAnimation animationClass="hover:scale-[1.02] transition-transform duration-200">
      <Link href={`/store/app/${game.id}`}>
        <Card className="overflow-hidden border-red-900/20 bg-card hover:border-red-900/40 h-full">
          <CardHeader className="p-0">
            <div className="relative aspect-video overflow-hidden">
              <Image src={game.image_url || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
              {getStatusBadge(game.status)}
              {game.status === "restricted" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Lock className="h-12 w-12 text-white" />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-bold text-lg text-balance line-clamp-1">{game.title}</h3>
            <p className="text-sm text-muted-foreground text-pretty line-clamp-2">{game.description}</p>

            <div className="flex flex-wrap gap-1">
              {game.genres?.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="text-sm font-semibold">{game.rating?.toFixed(1)}</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            {isOwned ? (
              <Button className="w-full gap-2" variant="secondary" disabled>
                <CheckCircle2 className="h-4 w-4" />
                Já pegou
              </Button>
            ) : game.status === "restricted" ? (
              <Button className="w-full gap-2 bg-transparent" variant="outline" disabled>
                <Lock className="h-4 w-4" />
                Tá bloqueado
              </Button>
            ) : !isLoggedIn ? (
              <Button className="w-full gap-2 bg-transparent" variant="outline" asChild>
                <Link href="/auth/login">Entrar pra pegar</Link>
              </Button>
            ) : (
              <>
                <span className="text-xl font-bold">${game.price?.toFixed(2)}</span>
                <Button size="sm" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Pegar
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </Link>
    </SafeAnimation>
  )
}
