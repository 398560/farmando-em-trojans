"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useUser } from "./user-context"

export interface Post {
  id: string
  author: string
  authorId: string
  text: string
  timestamp: Date
  type: "global" | "profile"
}

interface PostsContextType {
  posts: Post[]
  addPost: (text: string, type: "global" | "profile") => void
  deletePost: (postId: string) => void
  canDeletePost: (post: Post) => boolean
}

const PostsContext = createContext<PostsContextType>({
  posts: [],
  addPost: () => {},
  deletePost: () => {},
  canDeletePost: () => false,
})

export function PostsProvider({ children }: { children: ReactNode }) {
  const { user, isOwner } = useUser()
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "welcome",
      author: "Sistema",
      authorId: "system",
      text: "Bem-vindo ao sistema de posts! Aqui a gente escreve coisa e torce pra não quebrar.",
      timestamp: new Date(),
      type: "global",
    },
  ])

  const addPost = (text: string, type: "global" | "profile") => {
    if (!user) return
    if (type === "global" && !isOwner) return
    if (type === "profile" && !user.canPost && !isOwner) return

    const newPost: Post = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: user.displayName,
      authorId: user.id,
      text,
      timestamp: new Date(),
      type,
    }

    setPosts((prev) => [newPost, ...prev])
  }

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
  }

  const canDeletePost = (post: Post) => {
    if (!user) return false
    if (isOwner) return true // Owner pode apagar tudo
    return post.authorId === user.id // Usuário pode apagar próprios posts
  }

  return <PostsContext.Provider value={{ posts, addPost, deletePost, canDeletePost }}>{children}</PostsContext.Provider>
}

export function usePosts() {
  return useContext(PostsContext)
}
