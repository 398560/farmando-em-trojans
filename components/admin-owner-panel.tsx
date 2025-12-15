"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Mail, Shield, AlertTriangle, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { OWNER_EMAIL } from "@/lib/constants"

export function AdminOwnerPanel() {
  const [newOwnerEmail, setNewOwnerEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleUpdateOwnerEmail = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.rpc("update_owner_email", { new_email: newOwnerEmail })

      if (error) throw error

      setMessage({ type: "success", text: "Email do dono atualizado com sucesso!" })
      setNewOwnerEmail("")
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao atualizar email do dono." })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetAllSettings = async () => {
    if (!confirm("Tem certeza que deseja resetar todas as configurações globais? Esta ação não pode ser desfeita.")) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()

      // Reset all global settings to default
      const { error } = await supabase
        .from("global_settings")
        .update({ value: false })
        .in("key", ["maintenance_mode", "force_accessibility"])

      if (error) throw error

      setMessage({ type: "success", text: "Configurações resetadas com sucesso!" })
      window.location.reload()
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao resetar configurações." })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Alert className="border-yellow-500/50 bg-yellow-950/20">
        <Crown className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-200">
          Este painel é exclusivo para o dono do site. Você tem privilégios máximos e ignora todas as restrições.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuração do Email do Dono
            </CardTitle>
            <CardDescription>
              Altere o email que identifica o dono do site. Apenas este email terá acesso total.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email Atual do Dono</Label>
              <Input value={OWNER_EMAIL} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-owner-email">Novo Email do Dono</Label>
              <Input
                id="new-owner-email"
                type="email"
                placeholder="novo-dono@exemplo.com"
                value={newOwnerEmail}
                onChange={(e) => setNewOwnerEmail(e.target.value)}
              />
            </div>

            <Button onClick={handleUpdateOwnerEmail} disabled={loading || !newOwnerEmail} className="w-full">
              Atualizar Email do Dono
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Gerenciamento Total de Cargos
            </CardTitle>
            <CardDescription>
              Como dono, você pode promover e rebaixar qualquer usuário, incluindo admins.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span>Você pode gerenciar todos os cargos na aba &quot;Usuários&quot;</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Reset de Configurações
            </CardTitle>
            <CardDescription>Resetar todas as configurações globais para os valores padrão.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleResetAllSettings} variant="destructive" disabled={loading} className="w-full">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Resetar Todas as Configurações
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privilégios do Dono
            </CardTitle>
            <CardDescription>Lista de privilégios exclusivos do dono do site.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Ignora todas as restrições do sistema</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Pode acessar qualquer painel administrativo</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Pode promover e rebaixar admins</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Pode forçar configurações globais</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Acesso completo aos logs do sistema</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Pode alterar o email do dono</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
