"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MessageSquarePlus, X } from "lucide-react"
import { usePosts } from "@/contexts/posts-context"
import { useUser } from "@/contexts/user-context"

interface PostCreatorProps {
  type: "global" | "profile"
}

export function PostCreator({ type }: PostCreatorProps) {
  const { addPost } = usePosts()
  const { user, isOwner } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState("")

  const canCreatePost = type === "global" ? isOwner : user?.canPost || isOwner

  if (!user || !canCreatePost) return null

  const handleSubmit = () => {
    if (text.trim()) {
      addPost(text.trim(), type)
      setText("")
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <MessageSquarePlus className="h-4 w-4" />
        {type === "global" ? "Criar post global" : "Postar algo"}
      </Button>
    )
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{type === "global" ? "Post global (todo mundo vê)" : "Novo post no teu perfil"}</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Textarea
        placeholder="Escreve algo aí e reza pra não quebrar..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="resize-none"
      />

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Deixa pra lá
        </Button>
        <Button onClick={handleSubmit} disabled={!text.trim()}>
          Postar
        </Button>
      </div>
    </Card>
  )
}
