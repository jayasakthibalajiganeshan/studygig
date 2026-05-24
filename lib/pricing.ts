import type { OrderCategory, ProjectType, Complexity, PriceBreakdown } from '@/types'

const PLATFORM_COMMISSION = 0.25 // 25%

const BASE_PRICES: Record<OrderCategory, number> = {
  writing: 3,       // per page
  tutor: 800,       // per week
  student_tutor: 200,
  companion: 150,
  project: 1500,
  craft: 300,
  custom: 500,
}

const URGENCY_MULTIPLIERS = {
  normal: 1.0,
  fast: 1.35,
  urgent: 1.75,
}

const COMPLEXITY_MULTIPLIERS: Record<Complexity, number> = {
  beginner: 1.0,
  intermediate: 1.5,
  advanced: 2.2,
  expert: 3.5,
}

const PROJECT_BASE_PRICES: Record<ProjectType, number> = {
  web_dev: 2500,
  mobile_app: 4000,
  ai_ml: 5000,
  iot: 3500,
  hardware: 4500,
  science: 1500,
  craft: 800,
  presentation: 600,
  other: 1200,
}

export function calculatePrice(params: {
  category: OrderCategory
  pageCount?: number
  weeklySessions?: number
  projectType?: ProjectType
  complexity?: Complexity
  urgency?: 'normal' | 'fast' | 'urgent'
  deliveryDays?: number
  teamSize?: number
}): PriceBreakdown {
  const {
    category,
    pageCount = 1,
    weeklySessions = 1,
    projectType,
    complexity = 'beginner',
    urgency = 'normal',
    deliveryDays = 7,
    teamSize = 1,
  } = params

  let base = BASE_PRICES[category]

  // Category-specific calculation
  if (category === 'writing') {
    base = pageCount * BASE_PRICES.writing
  } else if (category === 'tutor') {
    base = weeklySessions * BASE_PRICES.tutor
  } else if (category === 'student_tutor') {
    base = weeklySessions * BASE_PRICES.student_tutor
  } else if (category === 'project' && projectType) {
    base = PROJECT_BASE_PRICES[projectType] * COMPLEXITY_MULTIPLIERS[complexity]
    if (teamSize > 1) base *= 1 + (teamSize - 1) * 0.2
  } else if (category === 'companion') {
    base = weeklySessions * BASE_PRICES.companion
  }

  const urgencyMultiplier = URGENCY_MULTIPLIERS[urgency]

  // Delivery fee for fast delivery
  const deliveryFee = deliveryDays <= 2 ? base * 0.15 : deliveryDays <= 4 ? base * 0.08 : 0

  const subtotal = base * urgencyMultiplier + deliveryFee
  const platformCommission = subtotal * PLATFORM_COMMISSION
  const sellerAmount = subtotal - platformCommission
  const total = subtotal

  return {
    base: Math.round(base),
    urgencyMultiplier,
    deliveryFee: Math.round(deliveryFee),
    platformCommission: Math.round(platformCommission),
    sellerAmount: Math.round(sellerAmount),
    total: Math.round(total),
  }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getLevelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function getXPForNextLevel(level: number): number {
  return level * level * 100
}

export function getXPProgress(xp: number): { level: number; progress: number; nextLevelXP: number } {
  const level = getLevelFromXP(xp)
  const currentLevelXP = (level - 1) * (level - 1) * 100
  const nextLevelXP = getXPForNextLevel(level)
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
  return { level, progress: Math.min(100, Math.max(0, progress)), nextLevelXP }
}
