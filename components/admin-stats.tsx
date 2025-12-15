import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Users, ShoppingCart } from "lucide-react"

interface AdminStatsProps {
  gamesCount: number
  usersCount: number
  purchasesCount: number
}

export function AdminStats({ gamesCount, usersCount, purchasesCount }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-red-900/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Games</CardTitle>
          <Gamepad2 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{gamesCount}</div>
        </CardContent>
      </Card>

      <Card className="border-red-900/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{usersCount}</div>
        </CardContent>
      </Card>

      <Card className="border-red-900/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          <ShoppingCart className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{purchasesCount}</div>
        </CardContent>
      </Card>
    </div>
  )
}
