import { PostCreator } from "@/components/post-creator"
import { PostsFeed } from "@/components/posts-feed"
import { StoreNav } from "@/components/store-nav"

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-background">
      <StoreNav />

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-balance">Posts Globais</h1>
          <p className="text-muted-foreground">Aqui a gente escreve coisa e torce pra não quebrar</p>
        </div>

        <PostCreator type="global" />

        <PostsFeed type="global" />
      </main>
    </div>
  )
}
