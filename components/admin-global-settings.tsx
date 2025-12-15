"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Settings, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface GlobalSetting {
  id: string
  key: string
  value: boolean | string
}

interface AdminGlobalSettingsProps {
  settings: GlobalSetting[]
  isOwner: boolean
}

export function AdminGlobalSettings({ settings: initialSettings, isOwner }: AdminGlobalSettingsProps) {
  const [maintenanceMode, setMaintenanceMode] = useState(
    initialSettings.find((s) => s.key === "maintenance_mode")?.value === true,
  )
  const [forceAccessibility, setForceAccessibility] = useState(
    initialSettings.find((s) => s.key === "force_accessibility")?.value === true,
  )
  const [animationsEnabled, setAnimationsEnabled] = useState(
    initialSettings.find((s) => s.key === "animations_enabled")?.value === true,
  )
  const [globalMessage, setGlobalMessage] = useState(
    (initialSettings.find((s) => s.key === "global_message")?.value as string) || "",
  )
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    if (!isOwner) return

    setIsSaving(true)
    const supabase = createClient()

    const updates = [
      { key: "maintenance_mode", value: maintenanceMode },
      { key: "force_accessibility", value: forceAccessibility },
      { key: "animations_enabled", value: animationsEnabled },
      { key: "global_message", value: globalMessage },
    ]

    for (const update of updates) {
      await supabase
        .from("global_settings")
        .update({ value: update.value, updated_at: new Date().toISOString() })
        .eq("key", update.key)
    }

    await supabase.rpc("log_admin_action", {
      p_action: "update_global_settings",
      p_target_user_id: null,
      p_details: { settings: updates },
    })

    setIsSaving(false)
    router.refresh()
  }

  if (!isOwner) {
    return (
      <Card className="border-red-900/20">
        <CardHeader>
          <CardTitle>Configurações globais</CardTitle>
          <CardDescription>Só o chefão mexe aqui. Se tu não é o dono, nem tenta.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-red-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações que quebram tudo
        </CardTitle>
        <CardDescription>Cuidado, isso aqui mexe no site inteiro</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="maintenance">Modo manutenção</Label>
            <p className="text-sm text-muted-foreground">Bloqueia todo mundo (menos os admin)</p>
          </div>
          <Switch id="maintenance" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="force-accessibility">Forçar modo seguro</Label>
            <p className="text-sm text-muted-foreground">Remove TODOS os efeitos pra todo mundo (pra ninguém morrer)</p>
          </div>
          <Switch id="force-accessibility" checked={forceAccessibility} onCheckedChange={setForceAccessibility} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="animations">Animações ligadas</Label>
            <p className="text-sm text-muted-foreground">Liga ou desliga as coisa que mexe</p>
          </div>
          <Switch id="animations" checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="global-message">Mensagem pra galera</Label>
          <Textarea
            id="global-message"
            placeholder="Escreve algo aqui... ou não"
            value={globalMessage}
            onChange={(e) => setGlobalMessage(e.target.value)}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">Isso vai aparecer pra todo mundo ver</p>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Salvando..." : "Salvar e rezar"}
        </Button>
      </CardContent>
    </Card>
  )
}
