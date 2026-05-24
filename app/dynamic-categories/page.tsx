'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CategoryThemeProvider, useCategoryTheme, ThemeParticles, HandwritingAnimation, FloatingElements } from '@/components/ui/category-themes'
import { 
  PenTool, 
  Code, 
  Heart, 
  Bot, 
  Palette, 
  Sparkles,
  Zap,
  ArrowRight,
  Users,
  Star,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Shield,
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const CATEGORIES = [
  {
    id: 'writing',
    name: 'Writing Services',
    description: 'Professional handwriting and academic writing',
    icon: PenTool,
    features: ['Handwriting Quality Scoring', 'Portfolio Preview', 'Physical Delivery', 'Escrow Protection'],
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'ai_ml',
    name: 'AI & ML Services',
    description: 'Intelligent solutions and automation',
    icon: Brain,
    features: ['Smart Matching', 'Automated Grading', 'Predictive Analytics', 'AI Assistant'],
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'companion',
    name: 'Study Companion',
    description: 'Find your perfect study partner',
    icon: Heart,
    features: ['Personality Matching', 'Study Sessions', 'Progress Tracking', 'Social Features'],
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    id: 'craft',
    name: 'Creative Projects',
    description: 'Build and showcase creative work',
    icon: Palette,
    features: ['Project Showcase', 'Collaboration Tools', 'Version Control', 'Creative Assets'],
    gradient: 'from-emerald-500 to-teal-500'
  }
]

export default function DynamicCategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('writing')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const theme = useCategoryTheme()

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === selectedCategory) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedCategory(categoryId)
      setIsTransitioning(false)
    }, 300)
  }

  const currentCategory = CATEGORIES.find(cat => cat.id === selectedCategory)

  return (
    <CategoryThemeProvider category={selectedCategory}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Theme Particles */}
        <ThemeParticles />
        
        {/* Floating Elements */}
        <FloatingElements />
        
        {/* Handwriting Animation for Writing Category */}
        <HandwritingAnimation />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10"
        >
          <div className="text-center py-12">
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display text-5xl md:text-6xl font-bold mb-4"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {currentCategory?.name}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl max-w-3xl mx-auto opacity-80"
            >
              {currentCategory?.description}
            </motion.p>
          </div>
        </motion.div>

        {/* Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-20 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center font-display text-2xl font-bold text-white mb-8">
              Choose Your Experience
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CATEGORIES.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1 + 0.6, 
                    duration: 0.5,
                    ease: 'easeOut'
                  }}
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    'relative group overflow-hidden rounded-2xl p-8 text-left transition-all duration-300',
                    selectedCategory === category.id
                      ? 'ring-4 ring-white/20 shadow-2xl'
                      : 'hover:scale-105'
                  )}
                  style={{
                    background: selectedCategory === category.id 
                      ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                      : 'rgba(255, 255, 255, 0.05)',
                    border: selectedCategory === category.id 
                      ? '2px solid transparent'
                      : '2px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center mb-6',
                      `bg-gradient-to-br ${category.gradient}`
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Category Name */}
                  <div>
                    <h3 className="font-bold text-lg mb-3">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-80 mb-6">
                      {category.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {category.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.8 + featureIndex * 0.1, 
                          duration: 0.4 
                        }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Arrow */}
                  {selectedCategory === category.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="absolute top-4 right-4"
                    >
                      <ArrowRight className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category-Specific Content */}
        <AnimatePresence mode="wait">
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
                <p className="text-white text-lg">Switching to {currentCategory?.name}...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Sections */}
        {!isTransitioning && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative z-10 px-6 py-12"
          >
            {selectedCategory === 'writing' && <WritingContent />}
            {selectedCategory === 'ai_ml' && <AIContent />}
            {selectedCategory === 'companion' && <CompanionContent />}
            {selectedCategory === 'craft' && <CraftContent />}
          </motion.div>
        )}
      </div>
    </CategoryThemeProvider>
  )
}

// Category-Specific Content Components
function WritingContent() {
  const theme = useCategoryTheme()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="card p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <PenTool className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Premium Writing</h3>
              <p className="text-white/60">Professional handwriting services</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-400" />
              <span>Quality scoring system</span>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Portfolio preview</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>Physical delivery</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card p-8"
        >
          <h4 className="font-bold text-lg mb-4">Elegant Paper Aesthetics</h4>
          <p className="text-white/60 mb-6">
            Experience beautiful paper textures, pen animations, and professional typography designed specifically for academic writing.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <h5 className="font-medium mb-2">Notebook Feel</h5>
              <p className="text-sm">Realistic paper textures</p>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <h5 className="font-medium mb-2">Pen Animations</h5>
              <p className="text-sm">Smooth writing effects</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <Link href="/writing-marketplace" className="btn-primary text-lg px-8 py-4">
            Explore Writing Services
            <PenTool className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function AIContent() {
  const theme = useCategoryTheme()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="card p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Smart Solutions</h3>
              <p className="text-white/60">Intelligent automation</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-400" />
              <span>Smart matching</span>
            </div>
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-blue-400" />
              <span>AI assistant</span>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span>Predictive analytics</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card p-8"
        >
          <h4 className="font-bold text-lg mb-4">Futuristic Interface</h4>
          <p className="text-white/60 mb-6">
            Modern neon aesthetics with animated particles and intelligent assistant features.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h5 className="font-medium mb-2">Neon UI</h5>
              <p className="text-sm">Glowing elements</p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h5 className="font-medium mb-2">AI Voice</h5>
              <p className="text-sm">Voice commands</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <Link href="/ai-services" className="btn-primary text-lg px-8 py-4">
            Explore AI Services
            <Brain className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function CompanionContent() {
  const theme = useCategoryTheme()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="card p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Social Learning</h3>
              <p className="text-white/60">Connect with partners</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-pink-400" />
              <span>Personality matching</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-pink-400" />
              <span>Study sessions</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-pink-400" />
              <span>Progress tracking</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card p-8"
        >
          <h4 className="font-bold text-lg mb-4">Safe Environment</h4>
          <p className="text-white/60 mb-6">
            Friendly gradients and emotional comfort features designed for social learning.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
              <h5 className="font-medium mb-2">Soft Colors</h5>
              <p className="text-sm">Comforting palette</p>
            </div>
            <div className="p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
              <h5 className="font-medium mb-2">Social Features</h5>
              <p className="text-sm">Community tools</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <Link href="/companion-match" className="btn-primary text-lg px-8 py-4">
            Find Study Companion
            <Heart className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function CraftContent() {
  const theme = useCategoryTheme()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="card p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Palette className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Creative Tools</h3>
              <p className="text-white/60">Build & showcase</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Project showcase</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>Collaboration</span>
            </div>
            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-emerald-400" />
              <span>Version control</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="card p-8"
        >
          <h4 className="font-bold text-lg mb-4">Handmade Feel</h4>
          <p className="text-white/60 mb-6">
            Colorful creative design with organic shapes and handmade visual aesthetics.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <h5 className="font-medium mb-2">Vibrant Colors</h5>
              <p className="text-sm">Creative palette</p>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <h5 className="font-medium mb-2">Organic Shapes</h5>
              <p className="text-sm">Natural elements</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <Link href="/skill-market" className="btn-primary text-lg px-8 py-4">
            Explore Creative Projects
            <Palette className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
