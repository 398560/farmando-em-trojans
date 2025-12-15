"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Game {
  id: string
  title: string
  price: number
  image_url: string
  rating: number
  genres: string[]
  publisher: string
}

interface AdminGamesListProps {
  games: Game[]
}

export function AdminGamesList({ games }: AdminGamesListProps) {
  return (
    <Card className="border-red-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Manage Games</CardTitle>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Game
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-red-900/40 transition-colors"
            >
              <div className="relative h-20 w-32 rounded overflow-hidden flex-shrink-0">
                <Image src={game.image_url || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-balance truncate">{game.title}</h3>
                <p className="text-sm text-muted-foreground">{game.publisher}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {game.genres?.slice(0, 3).map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-xl font-bold">${game.price?.toFixed(2)}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 text-red-500 hover:text-red-600 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
