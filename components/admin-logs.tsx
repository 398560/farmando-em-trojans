import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText } from "lucide-react"

interface AdminLog {
  id: string
  admin_id: string
  action: string
  target_user_id: string | null
  details: Record<string, unknown> | null
  created_at: string
}

interface AdminLogsProps {
  logs: AdminLog[]
}

export function AdminLogs({ logs }: AdminLogsProps) {
  const getActionBadge = (action: string) => {
    const actions: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      role_change: { label: "Mudou cargo", variant: "secondary" },
      ban_user: { label: "Baniu alguém", variant: "destructive" },
      unban_user: { label: "Desbaniu", variant: "outline" },
      update_global_settings: { label: "Mexeu nas config", variant: "default" },
    }
    return actions[action] || { label: action, variant: "secondary" }
  }

  return (
    <Card className="border-red-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Logs (pra saber quem fez o que)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {logs.map((log) => {
              const actionBadge = getActionBadge(log.action)
              return (
                <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg border border-red-900/20 bg-card/50">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={actionBadge.variant}>{actionBadge.label}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    {log.details && (
                      <pre className="text-xs text-muted-foreground mt-2 p-2 bg-background rounded">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
