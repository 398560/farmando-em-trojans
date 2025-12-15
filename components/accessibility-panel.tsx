"use client"

import { useAccessibility } from "@/contexts/accessibility-context"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Type, Contrast, Zap } from "lucide-react"

export function AccessibilityPanel() {
  const { settings, updateSettings, isLoading } = useAccessibility()

  if (isLoading) {
    return <div className="text-muted-foreground">Carregando...</div>
  }

  return (
    <Card className="border-red-900/20">
      <CardHeader>
        <CardTitle className="text-balance">Não morra jogando</CardTitle>
        <CardDescription>Ajusta do jeito que não te faz mal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-red-500" />
            <div className="space-y-1">
              <Label htmlFor="reduce-motion" className="cursor-pointer">
                Desliga as luz piscando
              </Label>
              <p className="text-sm text-muted-foreground">
                Desliga animação e efeito doido. Bom pra quem não curte coisa piscando muito.
              </p>
            </div>
          </div>
          <Switch
            id="reduce-motion"
            checked={settings.reduceMotion}
            onCheckedChange={(checked) => updateSettings({ reduceMotion: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Contrast className="h-5 w-5 text-red-500" />
            <div className="space-y-1">
              <Label htmlFor="high-contrast" className="cursor-pointer">
                Contraste forte
              </Label>
              <p className="text-sm text-muted-foreground">Deixa tudo mais contrastado pra ler melhor</p>
            </div>
          </div>
          <Switch
            id="high-contrast"
            checked={settings.highContrast}
            onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Type className="h-5 w-5 text-red-500" />
            <div className="space-y-1">
              <Label htmlFor="large-text" className="cursor-pointer">
                Letras gigantes
              </Label>
              <p className="text-sm text-muted-foreground">Aumenta as letra pra ver melhor</p>
            </div>
          </div>
          <Switch
            id="large-text"
            checked={settings.largeText}
            onCheckedChange={(checked) => updateSettings({ largeText: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-red-500" />
            <div className="space-y-1">
              <Label htmlFor="screen-reader" className="cursor-pointer">
                Modo leitor de tela
              </Label>
              <p className="text-sm text-muted-foreground">Se tu usa leitor de tela, ativa isso</p>
            </div>
          </div>
          <Switch
            id="screen-reader"
            checked={settings.screenReaderMode}
            onCheckedChange={(checked) => updateSettings({ screenReaderMode: checked })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
