import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StoreNav } from "@/components/store-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Calendar, Award } from "lucide-react"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: userBadges } = await supabase.from("user_badges").select("*, badges(*)").eq("user_id", user.id)

  const { count: gamesCount } = await supabase
    .from("user_library")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

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
    <div className="min-h-screen bg-background">
      <StoreNav />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-red-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {profile?.display_name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold">{profile?.display_name || "Unknown User"}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getRoleBadgeVariant(profile?.role || "user")} className="uppercase">
                      {profile?.role || "user"}
                    </Badge>
                    {profile?.is_banned && <Badge variant="destructive">Banned</Badge>}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(profile?.created_at || "").toLocaleDateString()}
                    </div>
                    {profile?.last_login && <div>Last login {new Date(profile.last_login).toLocaleDateString()}</div>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBadges && userBadges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {userBadges.map((userBadge: any) => (
                    <div
                      key={userBadge.id}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-red-900/20 bg-card/50"
                    >
                      <div className="text-3xl">{userBadge.badges.icon_url || "🏆"}</div>
                      <div className="text-center">
                        <p className="font-semibold">{userBadge.badges.name}</p>
                        <p className="text-xs text-muted-foreground">{userBadge.badges.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No badges earned yet</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-red-900/20">
            <CardHeader>
              <CardTitle>Game Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{gamesCount || 0}</div>
              <p className="text-muted-foreground">Games owned</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
