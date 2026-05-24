'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Award, TrendingUp, PenTool, Eye, Heart, MessageSquare, Shield, Zap, Crown, Medal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QualityMetrics {
  neatness: number
  readability: number
  consistency: number
  speed: number
  overall: number
}

interface WriterQualityCardProps {
  writerId: string
  writerName: string
  avatar: string
  qualityMetrics: QualityMetrics
  totalSamples: number
  totalReviews: number
  badges: string[]
  isVerified: boolean
  isTopWriter: boolean
  handwritingStyle: string
  specializations: string[]
  onHireWriter: () => void
  onViewPortfolio: () => void
}

const QUALITY_THRESHOLDS = {
  excellent: 4.5,
  good: 4.0,
  average: 3.5,
  below_average: 3.0
}

const getQualityLabel = (score: number): { label: string; color: string; bg: string } => {
  if (score >= QUALITY_THRESHOLDS.excellent) {
    return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  } else if (score >= QUALITY_THRESHOLDS.good) {
    return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/10' }
  } else if (score >= QUALITY_THRESHOLDS.average) {
    return { label: 'Average', color: 'text-amber-400', bg: 'bg-amber-500/10' }
  } else {
    return { label: 'Needs Improvement', color: 'text-red-400', bg: 'bg-red-500/10' }
  }
}

const getQualityIcon = (score: number) => {
  if (score >= QUALITY_THRESHOLDS.excellent) return <Crown className="w-4 h-4" />
  if (score >= QUALITY_THRESHOLDS.good) return <Award className="w-4 h-4" />
  if (score >= QUALITY_THRESHOLDS.average) return <Medal className="w-4 h-4" />
  return <Star className="w-4 h-4" />
}

export default function WriterQualityCard({
  writerId,
  writerName,
  avatar,
  qualityMetrics,
  totalSamples,
  totalReviews,
  badges,
  isVerified,
  isTopWriter,
  handwritingStyle,
  specializations,
  onHireWriter,
  onViewPortfolio
}: WriterQualityCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const overallQuality = getQualityLabel(qualityMetrics.overall)
  const neatnessQuality = getQualityLabel(qualityMetrics.neatness)
  const readabilityQuality = getQualityLabel(qualityMetrics.readability)

  const qualityScore = Math.round(qualityMetrics.overall * 20) // Convert to 100-point scale

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="card-hover relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-white/[0.08] rounded-2xl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/paper-texture.png')] bg-repeat" />
      </div>

      {/* Top Banner for Top Writers */}
      {isTopWriter && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400" />
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={`https://api.dicebear.com/8.x/notionists/svg?seed=${avatar}&backgroundColor=b6e3f4`}
                alt={writerName}
                className="w-16 h-16 rounded-xl bg-brand-500/20"
              />
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
              {isTopWriter && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-1">{writerName}</h3>
              <p className="text-white/40 text-sm mb-2">{handwritingStyle}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium text-white">{qualityMetrics.overall.toFixed(1)}</span>
                </div>
                <span className="text-white/30 text-sm">({totalReviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Quality Score Badge */}
          <div className={cn(
            'px-3 py-2 rounded-xl border flex items-center gap-2',
            overallQuality.bg,
            overallQuality.color,
            'border-current/20'
          )}>
            {getQualityIcon(qualityMetrics.overall)}
            <div className="text-right">
              <div className="text-xs font-medium opacity-80">Quality Score</div>
              <div className="font-bold">{qualityScore}/100</div>
            </div>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Neatness</span>
              <span className={cn('text-sm font-medium', neatnessQuality.color)}>
                {qualityMetrics.neatness.toFixed(1)}/5
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(qualityMetrics.neatness / 5) * 100}%` }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className={cn(
                  'h-full rounded-full',
                  qualityMetrics.neatness >= 4.5 ? 'bg-emerald-400' :
                  qualityMetrics.neatness >= 4.0 ? 'bg-blue-400' :
                  qualityMetrics.neatness >= 3.5 ? 'bg-amber-400' : 'bg-red-400'
                )}
              />
            </div>
          </div>

          <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/60">Readability</span>
              <span className={cn('text-sm font-medium', readabilityQuality.color)}>
                {qualityMetrics.readability.toFixed(1)}/5
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(qualityMetrics.readability / 5) * 100}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className={cn(
                  'h-full rounded-full',
                  qualityMetrics.readability >= 4.5 ? 'bg-emerald-400' :
                  qualityMetrics.readability >= 4.0 ? 'bg-blue-400' :
                  qualityMetrics.readability >= 3.5 ? 'bg-amber-400' : 'bg-red-400'
                )}
              />
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 bg-white/[0.02] rounded-lg">
            <div className="font-display font-bold text-white text-lg">{qualityMetrics.consistency.toFixed(1)}</div>
            <div className="text-xs text-white/40">Consistency</div>
          </div>
          <div className="text-center p-3 bg-white/[0.02] rounded-lg">
            <div className="font-display font-bold text-white text-lg">{qualityMetrics.speed.toFixed(1)}</div>
            <div className="text-xs text-white/40">Speed</div>
          </div>
          <div className="text-center p-3 bg-white/[0.02] rounded-lg">
            <div className="font-display font-bold text-white text-lg">{totalSamples}</div>
            <div className="text-xs text-white/40">Samples</div>
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-6">
          <div className="text-sm text-white/40 mb-2">Specializations</div>
          <div className="flex flex-wrap gap-1.5">
            {specializations.slice(0, 4).map((spec, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-300 text-xs border border-brand-500/20"
              >
                {spec}
              </span>
            ))}
            {specializations.length > 4 && (
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/40 text-xs">
                +{specializations.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-white/40 mb-2">Achievements</div>
            <div className="flex flex-wrap gap-1.5">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-300 text-xs border border-amber-500/20"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onViewPortfolio}
            className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Portfolio
          </button>
          <button
            onClick={onHireWriter}
            className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
          >
            <PenTool className="w-4 h-4" />
            Hire Writer
          </button>
        </div>

        {/* Hover Effect Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-brand-500/5 to-transparent pointer-events-none"
        />
      </div>
    </motion.div>
  )
}

// Quality Comparison Component
interface QualityComparisonProps {
  writers: Array<{
    id: string
    name: string
    avatar: string
    metrics: QualityMetrics
    price: number
  }>
}

export function QualityComparison({ writers }: QualityComparisonProps) {
  const maxValues = {
    neatness: Math.max(...writers.map(w => w.metrics.neatness)),
    readability: Math.max(...writers.map(w => w.metrics.readability)),
    consistency: Math.max(...writers.map(w => w.metrics.consistency)),
    speed: Math.max(...writers.map(w => w.metrics.speed)),
    overall: Math.max(...writers.map(w => w.metrics.overall))
  }

  return (
    <div className="card p-6">
      <h3 className="font-display text-lg font-bold text-white mb-6">Quality Comparison</h3>
      
      <div className="space-y-6">
        {writers.map((writer, index) => (
          <div key={writer.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/8.x/notionists/svg?seed=${writer.avatar}&backgroundColor=b6e3f4`}
                  alt={writer.name}
                  className="w-10 h-10 rounded-lg"
                />
                <div>
                  <div className="font-medium text-white">{writer.name}</div>
                  <div className="text-sm text-white/40">₹{writer.price}/page</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-brand-400">{writer.metrics.overall.toFixed(1)}/5</div>
                <div className="text-xs text-white/40">Overall</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(writer.metrics).map(([key, value]) => {
                if (key === 'overall') return null
                const maxValue = maxValues[key as keyof typeof maxValues]
                const percentage = (value / maxValue) * 100
                
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60 capitalize">{key}</span>
                      <span className="text-white font-medium">{value.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                        className={cn(
                          'h-full rounded-full',
                          key === 'neatness' ? 'bg-blue-400' :
                          key === 'readability' ? 'bg-emerald-400' :
                          key === 'consistency' ? 'bg-amber-400' :
                          'bg-purple-400'
                        )}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
