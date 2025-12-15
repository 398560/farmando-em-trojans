"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, CheckCircle2 } from "lucide-react"
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
  publisher: string
}

interface StoreFeaturedHeroProps {
  game: Game
  isOwned: boolean
  isLoggedIn?: boolean
}

export function StoreFeaturedHero({ game, isOwned, isLoggedIn = false }: StoreFeaturedHeroProps) {
  return (
    <SafeAnimation
      animationClass="animate-shimmer"
      className="relative overflow-hidden rounded-lg border border-red-900/30 bg-gradient-to-br from-card via-card to-red-950/10"
    >
      <div className="grid md:grid-cols-2 gap-8 p-8">
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">Destaque</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-balance">{game.title}</h1>
            <p className="text-muted-foreground text-pretty">{game.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {game.genres?.map((genre) => (
              <Badge key={genre} variant="secondary">
                {genre}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="font-semibold">{game.rating?.toFixed(1)}</span>
              <span className="text-muted-foreground text-sm">/5</span>
            </div>
            <span className="text-muted-foreground">by {game.publisher}</span>
          </div>

          <div className="flex items-center gap-4">
            {isOwned ? (
              <Button size="lg" className="gap-2" disabled>
                <CheckCircle2 className="h-5 w-5" />
                Já pegou
              </Button>
            ) : !isLoggedIn ? (
              <Button size="lg" className="gap-2 bg-transparent" variant="outline" asChild>
                <Link href="/auth/login">Entrar pra pegar</Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                  <ShoppingCart className="h-5 w-5" />
                  Pegar agora
                </Button>
                <span className="text-2xl font-bold">${game.price?.toFixed(2)}</span>
              </>
            )}
          </div>
        </div>

        <SafeAnimation animationClass="hover:scale-105 transition-transform duration-300" className="relative">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-red-900/30">
            <Image src={game.image_url || "/placeholder.svg"} alt={game.title} fill className="object-cover" priority />
          </div>
        </SafeAnimation>
      </div>
    </SafeAnimation>
  )
}
