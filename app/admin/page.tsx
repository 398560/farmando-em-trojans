import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StoreNav } from "@/components/store-nav"
import { AdminStats } from "@/components/admin-stats"
import { AdminGamesList } from "@/components/admin-games-list"
import { AdminUsersList } from "@/components/admin-users-list"
import { AdminGlobalSettings } from "@/components/admin-global-settings"
import { AdminLogs } from "@/components/admin-logs"
import { AdminOwnerPanel } from "@/components/admin-owner-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isOwner } from "@/lib/constants"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || !["admin", "owner", "mod"].includes(profile.role)) {
    redirect("/store")
  }

  const { data: games, count: gamesCount } = await supabase
    .from("games")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })

  const { data: users, count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })

  const { count: purchasesCount } = await supabase.from("user_library").select("*", { count: "exact", head: true })

  const { data: logs } = await supabase
    .from("admin_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: globalSettings } = await supabase.from("global_settings").select("*")

  const userIsOwner = isOwner(profile.role)

  return (
    <div className="min-h-screen bg-background">
      <StoreNav />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-balance">
          Área dos admins <span className="text-red-500">(perigo real)</span>
        </h1>

        <AdminStats gamesCount={gamesCount || 0} usersCount={usersCount || 0} purchasesCount={purchasesCount || 0} />

        <Tabs defaultValue={userIsOwner ? "owner" : "games"} className="mt-8">
          <TabsList className={`grid w-full ${userIsOwner ? "grid-cols-5" : "grid-cols-4"}`}>
            {userIsOwner && <TabsTrigger value="owner">Painel do chefão</TabsTrigger>}
            <TabsTrigger value="games">Apps</TabsTrigger>
            <TabsTrigger value="users">Galera</TabsTrigger>
            <TabsTrigger value="settings">Configs</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          {userIsOwner && (
            <TabsContent value="owner" className="mt-6">
              <AdminOwnerPanel />
            </TabsContent>
          )}

          <TabsContent value="games" className="mt-6">
            <AdminGamesList games={games || []} />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AdminUsersList users={users || []} isOwner={userIsOwner} currentUserRole={profile.role} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AdminGlobalSettings settings={globalSettings || []} isOwner={userIsOwner} />
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <AdminLogs logs={logs || []} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
