'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface PersonalityTheme {
  id: 'introvert' | 'extrovert' | 'ambivert'
  name: string
  description: string
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
  ui: {
    density: 'compact' | 'comfortable' | 'balanced'
    socialPrompts: 'minimal' | 'moderate' | 'enhanced'
    animations: 'moderate' | 'subtle' | 'dynamic'
    interactionStyle: 'direct' | 'guided' | 'exploratory'
    reducedAnimations: boolean
  }
  features: {
    focusMode: boolean
    quietMode: boolean
    reducedAnimations: boolean
    largeText: boolean
    highContrast: boolean
    readingMode: boolean
  }
  typography: {
    fontFamily: string
    fontWeight: string
    letterSpacing: string
    lineHeight: string
  }
  components: {
    cardStyle: string
    buttonStyle: string
    inputStyle: string
    iconStyle: string
    backgroundPattern?: string
  }
}

export const PERSONALITY_THEMES: Record<string, PersonalityTheme> = {
  introvert: {
    id: 'introvert',
    name: 'Introvert',
    description: 'Calm, focused, and comfortable environment',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#3b82f6',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #2d3748 100%)',
      surface: 'rgba(255, 255, 255, 0.98)',
      text: '#e2e8f0',
      muted: '#9ca3af',
      border: 'rgba(156, 163, 175, 0.15)',
      glow: 'rgba(139, 92, 246, 0.2)'
    },
    ui: {
      density: 'comfortable',
      socialPrompts: 'minimal',
      animations: 'subtle',
      interactionStyle: 'direct',
      reducedAnimations: true
    },
    features: {
      focusMode: true,
      quietMode: true,
      reducedAnimations: true,
      largeText: false,
      highContrast: false,
      readingMode: false
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: '400',
      letterSpacing: '0.005em',
      lineHeight: '1.6'
    },
    components: {
      cardStyle: 'bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm',
      buttonStyle: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-200',
      inputStyle: 'bg-white/90 border border-gray-200/50 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all',
      iconStyle: 'text-gray-600'
    }
  },

  extrovert: {
    id: 'extrovert',
    name: 'Extrovert',
    description: 'Energetic, social, and interactive environment',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#f3f4f6',
      muted: '#64748b',
      border: 'rgba(59, 130, 246, 0.2)',
      glow: 'rgba(251, 191, 36, 0.3)'
    },
    ui: {
      density: 'balanced',
      socialPrompts: 'enhanced',
      animations: 'dynamic',
      interactionStyle: 'exploratory',
      reducedAnimations: false
    },
    features: {
      focusMode: false,
      quietMode: false,
      reducedAnimations: false,
      largeText: false,
      highContrast: false,
      readingMode: false
    },
    typography: {
      fontFamily: 'Poppins, system-ui, sans-serif',
      fontWeight: '600',
      letterSpacing: '0.025em',
      lineHeight: '1.4'
    },
    components: {
      cardStyle: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-purple-500/20 rounded-2xl shadow-xl',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 border border-purple-500/50 rounded-xl px-6 py-3 text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300',
      inputStyle: 'bg-purple-50/10 border border-purple-500/30 rounded-xl px-4 py-3 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all',
      iconStyle: 'text-purple-600'
    }
  },

  ambivert: {
    id: 'ambivert',
    name: 'Ambivert',
    description: 'Balanced hybrid experience',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      accent: '#f59e0b',
      background: 'linear-gradient(135deg, #18181b 0%, #1f2937 100%)',
      surface: 'rgba(255, 255, 255, 0.96)',
      text: '#d1d5db',
      muted: '#6b7280',
      border: 'rgba(107, 114, 128, 0.18)',
      glow: 'rgba(251, 191, 36, 0.25)'
    },
    ui: {
      density: 'balanced',
      socialPrompts: 'moderate',
      animations: 'moderate',
      interactionStyle: 'guided',
      reducedAnimations: false
    },
    features: {
      focusMode: false,
      quietMode: false,
      reducedAnimations: false,
      largeText: false,
      highContrast: false,
      readingMode: false
    },
    typography: {
      fontFamily: 'Space Grotesk, system-ui, sans-serif',
      fontWeight: '500',
      letterSpacing: '0.015em',
      lineHeight: '1.5'
    },
    components: {
      cardStyle: 'bg-white/96 backdrop-blur-sm border border-gray-200/40 rounded-2xl shadow-md',
      buttonStyle: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 border border-emerald-500/50 rounded-xl px-5 py-3 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300',
      inputStyle: 'bg-white/80 border border-gray-200/40 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-all',
      iconStyle: 'text-emerald-600'
    }
  }
}

export function PersonalityThemeProvider({ 
  children, 
  personality = 'ambivert' 
}: { 
  children: React.ReactNode
  personality?: string 
}) {
  const theme = PERSONALITY_THEMES[personality] || PERSONALITY_THEMES.ambivert

  return (
    <div 
      className="min-h-screen transition-all duration-700 ease-in-out"
      style={{
        background: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.fontWeight,
        letterSpacing: theme.typography.letterSpacing,
        lineHeight: theme.typography.lineHeight
      }}
    >
      <PersonalityThemeContext.Provider value={theme}>
        {children}
      </PersonalityThemeContext.Provider>
    </div>
  )
}

export const PersonalityThemeContext = React.createContext<PersonalityTheme>(PERSONALITY_THEMES.ambivert)

export function usePersonalityTheme() {
  return React.useContext(PersonalityThemeContext)
}

// Personality-specific components
export function PersonalityCard({ 
  personality, 
  isSelected, 
  onClick 
}: { 
  personality: PersonalityTheme
  isSelected: boolean
  onClick: () => void 
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all duration-300',
        isSelected
          ? 'border-purple-500/50 bg-gradient-to-br from-purple-500/20 to-pink-500/10 backdrop-blur-md'
          : 'border-gray-200/50 hover:border-gray-300/50 bg-white/90 hover:bg-white/95'
      )}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: personality.colors.background
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: personality.colors.primary }}
            >
              <span className="text-white text-lg font-bold">
                {personality.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-2" style={{ color: personality.colors.text }}>
              {personality.name}
            </h3>
            <p className="text-sm opacity-80" style={{ color: personality.colors.muted }}>
              {personality.description}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: personality.colors.accent }} />
            <span className="text-sm font-medium" style={{ color: personality.colors.text }}>
              {personality.ui.density === 'compact' ? 'Comfortable UI' : 'Balanced Layout'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: personality.colors.accent }} />
            <span className="text-sm font-medium" style={{ color: personality.colors.text }}>
              {personality.ui.animations === 'subtle' ? 'Subtle Animations' : 'Dynamic Effects'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: personality.colors.accent }} />
            <span className="text-sm font-medium" style={{ color: personality.colors.text }}>
              {personality.ui.socialPrompts === 'minimal' ? 'Minimal Social' : 'Enhanced Social'}
            </span>
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 border-2 rounded-2xl"
          style={{ borderColor: personality.colors.glow }}
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: 1, pathOffset: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  )
}

export function PersonalityToggle({ 
  currentPersonality, 
  onPersonalityChange 
}: { 
  currentPersonality: string
  onPersonalityChange: (personality: string) => void 
}) {
  const personalities = Object.values(PERSONALITY_THEMES)

  return (
    <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
      {personalities.map((personality) => (
        <button
          key={personality.id}
          onClick={() => onPersonalityChange(personality.id)}
          className={cn(
            'px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
            currentPersonality === personality.id
              ? `bg-gradient-to-r ${personality.colors.primary} to ${personality.colors.secondary} text-white`
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-bold">
                {personality.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className={currentPersonality === personality.id ? 'text-white' : 'text-gray-900'}>
              {personality.name}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
