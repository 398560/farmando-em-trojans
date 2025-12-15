"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, MessageSquare } from "lucide-react"
import { usePosts } from "@/contexts/posts-context"
import { useUser } from "@/contexts/user-context"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PostsFeedProps {
  type?: "global" | "profile" | "all"
  userId?: string
}

export function PostsFeed({ type = "all", userId }: PostsFeedProps) {
  const { posts, deletePost, canDeletePost } = usePosts()
  const { user } = useUser()

  const filteredPosts = posts.filter((post) => {
    if (type === "all") return true
    if (type === "global") return post.type === "global"
    if (type === "profile") return post.type === "profile" && (!userId || post.authorId === userId)
    return true
  })

  if (filteredPosts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nada por aqui ainda. Seja o primeiro a postar!</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
        <Card key={post.id} className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{post.author}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(post.timestamp, { addSuffix: true, locale: ptBR })}
                </span>
                {post.type === "global" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">Global</span>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap break-words">{post.text}</p>
            </div>

            {user && canDeletePost(post) && (
              <Button variant="ghost" size="icon" onClick={() => deletePost(post.id)} className="flex-shrink-0">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
