// Site constants
export const SITE_NAME = "Farmando em Trojans"
export const SITE_DESCRIPTION = "A gente junta nossos apps aqui e torce pra não quebrar tudo"
export const SITE_MOTTO = "feito na base do ódio e do café"

// Owner configuration
export const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL || "owner@farmandoemtrojans.com"

// Role hierarchy (higher number = more power)
export const ROLE_HIERARCHY = {
  user: 0,
  tester: 1,
  mod: 2,
  admin: 3,
  owner: 4,
} as const

export type UserRole = keyof typeof ROLE_HIERARCHY

// Check if a role can perform an action on another role
export function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole]
}

// Check if user is owner
export function isOwner(role: string | null): boolean {
  return role === "owner"
}

// Role display names in Portuguese
export const ROLE_NAMES: Record<UserRole, string> = {
  user: "Ralé",
  tester: "Quebrador oficial",
  mod: "Babá",
  admin: "Deus menor",
  owner: "O chefão",
}

// Status display names in Portuguese
export const STATUS_NAMES = {
  stable: "Tá suave",
  beta: "Funciona às vezes",
  experimental: "Pode quebrar tudo",
  restricted: "Quebrado (não pergunta)",
} as const

// Random footer messages for easter eggs
export const RANDOM_FOOTER_MESSAGES = [
  "feito na base do ódio e do café",
  "para de fuçar",
  "tu é curioso hein",
  "isso aqui não era pra tu ver",
  "se quebrou, finge que não viu",
  "a gente tenta, tá",
  "em breve™ (talvez)",
  "preguiça bateu forte nesse dia",
  "ctrl+z não funciona aqui",
  "bugs são features não documentadas",
]

// Get random footer message
export function getRandomFooterMessage(): string {
  return RANDOM_FOOTER_MESSAGES[Math.floor(Math.random() * RANDOM_FOOTER_MESSAGES.length)]
}
