import { Button } from "@/components/ui/button"
import { Gamepad2, Zap, Shield, Eye } from "lucide-react"
import Link from "next/link"
import { SafeAnimation } from "@/components/safe-animation"
import { SITE_NAME, getRandomFooterMessage } from "@/lib/constants"

export default function HomePage() {
  const footerMessage = getRandomFooterMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-red-950/10 flex flex-col">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-pretty">
              <span className="text-primary">{SITE_NAME}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Entrar (opcional)</Link>
            </Button>
            <Button asChild>
              <Link href="/store">Ver as paradas</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20 flex-1">
        <SafeAnimation animationClass="animate-fade-in">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-balance">
              Bem-vindo ao <span className="text-primary">Farmando em Trojans</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty">
              Aqui a gente junta nossos apps e torce pra não quebrar. Se tu não sabe o que tá fazendo, relaxa, a gente
              também não.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/store">
                  <Zap className="h-5 w-5" />
                  Entrar na plataforma
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent" asChild>
                <Link href="/auth/login">Login (se tiver conta)</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <SafeAnimation
                animationClass="hover:scale-105 transition-transform"
                className="p-6 rounded-lg border border-red-900/20 bg-card"
              >
                <Zap className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Rápido que nem raio</h3>
                <p className="text-muted-foreground text-pretty">Ou pelo menos a gente tentou fazer rápido</p>
              </SafeAnimation>

              <SafeAnimation
                animationClass="hover:scale-105 transition-transform"
                className="p-6 rounded-lg border border-red-900/20 bg-card"
              >
                <Eye className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Modo não te mata</h3>
                <p className="text-muted-foreground text-pretty">
                  Desliga as luz piscando, bom pra quem não curte efeito doido. A gente não quer matar ninguém.
                </p>
              </SafeAnimation>

              <SafeAnimation
                animationClass="hover:scale-105 transition-transform"
                className="p-6 rounded-lg border border-red-900/20 bg-card"
              >
                <Shield className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Seguro (mais ou menos)</h3>
                <p className="text-muted-foreground text-pretty">A gente testa antes de soltar... às vezes</p>
              </SafeAnimation>
            </div>

            <div className="mt-12 p-4 rounded-lg border border-red-900/20 bg-card/50">
              <p className="text-sm text-muted-foreground italic">
                Projeto em desenvolvimento desde: sei lá, tem um tempo já
              </p>
            </div>
          </div>
        </SafeAnimation>
      </main>

      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground italic">&quot;{footerMessage}&quot;</p>
        </div>
      </footer>
    </div>
  )
}
