"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ban, UserIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  role: string
  is_banned: boolean
  last_login: string | null
  created_at: string
}

interface AdminUsersListProps {
  users: Profile[]
  isOwner: boolean
}

const ROLE_NAMES = {
  user: "Ralé",
  tester: "Quebrador",
  mod: "Babá",
  admin: "Deus menor",
}

export function AdminUsersList({ users: initialUsers, isOwner }: AdminUsersListProps) {
  const [users, setUsers] = useState(initialUsers)
  const router = useRouter()

  const handleRoleChange = async (userId: string, newRole: string) => {
    const supabase = createClient()

    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

    if (!error) {
      await supabase.rpc("log_admin_action", {
        p_action: "role_change",
        p_target_user_id: userId,
        p_details: { new_role: newRole },
      })

      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
      router.refresh()
    }
  }

  const handleBanToggle = async (userId: string, currentBanStatus: boolean) => {
    const supabase = createClient()

    const { error } = await supabase.from("profiles").update({ is_banned: !currentBanStatus }).eq("id", userId)

    if (!error) {
      await supabase.rpc("log_admin_action", {
        p_action: currentBanStatus ? "unban_user" : "ban_user",
        p_target_user_id: userId,
        p_details: {},
      })

      setUsers(users.map((u) => (u.id === userId ? { ...u, is_banned: !currentBanStatus } : u)))
      router.refresh()
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default"
      case "admin":
        return "destructive"
      case "mod":
        return "secondary"
      case "tester":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="border-red-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Gerenciar a galera
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-red-900/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quem é</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Último login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.display_name || "Sem nome"}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">{user.id}</div>
                  </TableCell>
                  <TableCell>
                    {isOwner && user.role !== "owner" ? (
                      <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Ralé</SelectItem>
                          <SelectItem value="tester">Quebrador</SelectItem>
                          <SelectItem value="mod">Babá</SelectItem>
                          <SelectItem value="admin">Deus menor</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={getRoleBadgeVariant(user.role)} className="uppercase">
                        {ROLE_NAMES[user.role as keyof typeof ROLE_NAMES] || user.role}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.last_login ? new Date(user.last_login).toLocaleDateString("pt-BR") : "Nunca"}
                  </TableCell>
                  <TableCell>
                    {user.is_banned ? (
                      <Badge variant="destructive">Banido</Badge>
                    ) : (
                      <Badge variant="outline">Vivo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.role !== "owner" && (isOwner || user.role === "user") && (
                      <Button
                        size="sm"
                        variant={user.is_banned ? "outline" : "destructive"}
                        onClick={() => handleBanToggle(user.id, user.is_banned)}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        {user.is_banned ? "Liberar" : "Banir (sem dó)"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
