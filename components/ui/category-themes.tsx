'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface CategoryTheme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    muted: string
    border: string
    glow: string
  }
  animations: {
    particles?: boolean
    floating?: boolean
    pulsing?: boolean
    flowing?: boolean
    handwriting?: boolean
    geometric?: boolean
    organic?: boolean
  }
  typography: {
    fontFamily: string
    fontWeight: string
    letterSpacing: string
    textTransform?: string
  }
  components: {
    cardStyle: string
    buttonStyle: string
    inputStyle: string
    iconStyle: string
    backgroundPattern?: string
  }
  sounds?: {
    enabled: boolean
    type?: 'typing' | 'click' | 'notification' | 'ambient'
  }
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  writing: {
    id: 'writing',
    name: 'Writing Services',
    colors: {
      primary: '#d97706',
      secondary: '#f59e0b',
      accent: '#fbbf24',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#78350f',
      muted: '#92400e',
      border: 'rgba(217, 119, 6, 0.2)',
      glow: 'rgba(251, 191, 36, 0.3)'
    },
    animations: {
      handwriting: true,
      floating: true,
      pulsing: false
    },
    typography: {
      fontFamily: 'Georgia, serif',
      fontWeight: '400',
      letterSpacing: '0.01em'
    },
    components: {
      cardStyle: 'shadow-lg bg-white/90 backdrop-blur-sm border-2 border-amber-200/50 rounded-xl',
      buttonStyle: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300',
      inputStyle: 'bg-white/80 border-2 border-amber-200/50 rounded-lg focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50',
      iconStyle: 'text-amber-600',
      backgroundPattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(217, 119, 6, 0.03) 10px, rgba(217, 119, 6, 0.03) 20px)'
    },
    sounds: {
      enabled: true,
      type: 'typing'
    }
  },

  ai_ml: {
    id: 'ai_ml',
    name: 'AI/ML Services',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#60a5fa',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      surface: 'rgba(17, 24, 39, 0.95)',
      text: '#e0e7ff',
      muted: '#9ca3af',
      border: 'rgba(139, 92, 246, 0.2)',
      glow: 'rgba(96, 165, 250, 0.4)'
    },
    animations: {
      particles: true,
      geometric: true,
      pulsing: true
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: '500',
      letterSpacing: '0.025em',
      textTransform: 'uppercase'
    },
    components: {
      cardStyle: 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border border-indigo-500/20 rounded-xl shadow-2xl',
      buttonStyle: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300',
      inputStyle: 'bg-slate-800/60 border border-indigo-500/30 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20',
      iconStyle: 'text-indigo-400',
      backgroundPattern: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(96, 165, 250, 0.1) 0%, transparent 50%)'
    },
    sounds: {
      enabled: true,
      type: 'ambient'
    }
  },

  companion: {
    id: 'companion',
    name: 'Study Companion',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#fbbf24',
      background: 'linear-gradient(135deg, #fce7f3 0%, #ffe4e6 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#831843',
      muted: '#be185d',
      border: 'rgba(236, 72, 153, 0.2)',
      glow: 'rgba(251, 191, 36, 0.3)'
    },
    animations: {
      floating: true,
      organic: true,
      pulsing: false
    },
    typography: {
      fontFamily: 'Poppins, system-ui, sans-serif',
      fontWeight: '400',
      letterSpacing: '0.02em'
    },
    components: {
      cardStyle: 'bg-white/95 backdrop-blur-sm border-2 border-pink-200/50 rounded-2xl shadow-xl',
      buttonStyle: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300',
      inputStyle: 'bg-white/80 border-2 border-pink-200/50 rounded-2xl focus:border-pink-400 focus:ring-2 focus:ring-pink-200/50',
      iconStyle: 'text-pink-500',
      backgroundPattern: 'radial-gradient(circle at 30% 40%, rgba(236, 72, 153, 0.05) 0%, transparent 70%), radial-gradient(circle at 70% 60%, rgba(244, 114, 182, 0.05) 0%, transparent 70%)'
    },
    sounds: {
      enabled: true,
      type: 'notification'
    }
  },

  craft: {
    id: 'craft',
    name: 'Creative Projects',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      accent: '#fbbf24',
      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#064e3b',
      muted: '#047857',
      border: 'rgba(16, 185, 129, 0.2)',
      glow: 'rgba(251, 191, 36, 0.3)'
    },
    animations: {
      floating: true,
      organic: true,
      flowing: true
    },
    typography: {
      fontFamily: 'Space Grotesk, system-ui, sans-serif',
      fontWeight: '600',
      letterSpacing: '0.03em'
    },
    components: {
      cardStyle: 'bg-white/95 backdrop-blur-sm border-2 border-emerald-200/50 rounded-2xl shadow-xl',
      buttonStyle: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300',
      inputStyle: 'bg-white/80 border-2 border-emerald-200/50 rounded-2xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50',
      iconStyle: 'text-emerald-600',
      backgroundPattern: 'repeating-linear-gradient(60deg, transparent, transparent 10px, rgba(16, 185, 129, 0.03) 10px, rgba(52, 211, 153, 0.03) 10px)'
    },
    sounds: {
      enabled: true,
      type: 'click'
    }
  }
}

export function CategoryThemeProvider({ 
  children, 
  category = 'default' 
}: { 
  children: React.ReactNode
  category?: string 
}) {
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.writing

  return (
    <div 
      className="min-h-screen transition-all duration-700 ease-in-out"
      style={{
        background: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.fontWeight,
        letterSpacing: theme.typography.letterSpacing
      }}
    >
      <CategoryThemeContext.Provider value={theme}>
        {children}
      </CategoryThemeContext.Provider>
    </div>
  )
}

export const CategoryThemeContext = React.createContext<CategoryTheme>(CATEGORY_THEMES.writing)

export function useCategoryTheme() {
  return React.useContext(CategoryThemeContext)
}

// Animated Components
export function AnimatedCard({ 
  children, 
  className = '',
  delay = 0 
}: { 
  children: React.ReactNode
  className?: string
  delay?: number 
}) {
  const theme = useCategoryTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: delay * 0.1, 
        duration: 0.6, 
        ease: 'easeOut' 
      }}
      className={cn(theme.components.cardStyle, className)}
      style={{
        boxShadow: theme.colors.glow ? `0 10px 40px ${theme.colors.glow}` : undefined
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedButton({ 
  children, 
  className = '',
  onClick,
  disabled = false,
  delay = 0 
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  delay?: number 
}) {
  const theme = useCategoryTheme()

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        delay: delay * 0.1, 
        duration: 0.3,
        ease: 'easeOut'
      }}
      onClick={onClick}
      disabled={disabled}
      className={cn(theme.components.buttonStyle, className, 'relative overflow-hidden')}
    >
      {theme.animations.pulsing && (
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.colors.accent}, transparent)`
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

export function AnimatedInput({ 
  className = '',
  placeholder,
  value,
  onChange,
  type = 'text',
  delay = 0 
}: { 
  className?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  type?: string
  delay?: number 
}) {
  const theme = useCategoryTheme()

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: delay * 0.1, 
        duration: 0.5, 
        ease: 'easeOut' 
      }}
      className="relative"
    >
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(theme.components.inputStyle, className, 'w-full')}
        style={{
          textTransform: theme.typography.textTransform
        }}
      />
    </motion.div>
  )
}

export function ThemeParticles() {
  const theme = useCategoryTheme()

  if (!theme.animations.particles) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {theme.id === 'ai_ml' && (
        <>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut'
              }}
              style={{
                boxShadow: '0 0 6px rgba(139, 92, 246, 0.5)'
              }}
            />
          ))}
        </>
      )}

      {theme.id === 'craft' && (
        <>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut'
              }}
              style={{
                boxShadow: '0 0 6px rgba(139, 92, 246, 0.5)'
              }}
            />
          ))}
        </>
      )}

      {theme.id === 'companion' && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-pink-300 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
              }}
              animate={{
                y: [-20, 0, -20]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut'
              }}
              style={{
                boxShadow: '0 0 12px rgba(236, 72, 153, 0.3)'
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}

export function HandwritingAnimation() {
  const theme = useCategoryTheme()

  if (!theme.animations.handwriting) return null

  return (
    <motion.div
      className="fixed bottom-8 right-8 pointer-events-none"
      animate={{ rotate: [0, -5, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="relative">
        <div 
          className="w-1 h-16"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div 
          className="absolute top-0 left-0 w-4 h-4 rounded-full"
          style={{ backgroundColor: theme.colors.primary }}
        />
      </div>
    </motion.div>
  )
}

export function FloatingElements() {
  const theme = useCategoryTheme()

  if (!theme.animations.floating) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16 rounded-2xl opacity-20"
          style={{
            background: theme.colors.background,
            border: `2px solid ${theme.colors.border}`
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            rotate: Math.random() * 360
          }}
          animate={{
            y: [-30, 0, -30],
            rotate: [0, Math.random() * 360, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}
