import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Gamepad2 } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-red-950/10 p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gamepad2 className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-pretty">
              <span className="text-primary">FLASH</span>
              <span className="text-foreground">STORE</span>
            </span>
          </div>

          <Card className="border-red-900/30">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Mail className="h-16 w-16 text-primary" />
              </div>
              <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
              <CardDescription className="text-center">We&apos;ve sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center text-pretty">
                You&apos;ve successfully signed up! Please check your email to confirm your account before signing in.
              </p>
              <Button className="w-full" asChild>
                <Link href="/auth/login">Return to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
