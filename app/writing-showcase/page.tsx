'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  PenTool, 
  Star, 
  Users, 
  Shield, 
  Truck, 
  FileText, 
  Award,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  Eye,
  Heart,
  Zap,
  Target
} from 'lucide-react'
import { cn } from '@/lib/utils'
import HandwritingQualityCard, { QualityComparison } from '@/components/writing/handwriting-quality-card'
import HandwritingPortfolio from '@/components/writing/handwriting-portfolio'
import { Paper, HandwritingPreview, Notebook } from '@/components/writing/paper-aesthetics'

const SHOWCASE_FEATURES = [
  {
    icon: '✍️',
    title: 'Advanced Writer Selection',
    description: 'Filter and compare writers by handwriting quality, rating, subjects, and delivery speed',
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30'
  },
  {
    icon: '📸',
    title: 'Portfolio Preview',
    description: 'View handwriting samples, previous work, and quality ratings before hiring',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30'
  },
  {
    icon: '📦',
    title: 'Physical Delivery',
    description: 'Send notebooks and receive completed work via secure courier services',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30'
  },
  {
    icon: '🔒',
    title: 'Escrow Protection',
    description: 'Payments held securely until work is delivered and approved',
    color: 'from-emerald-500/20 to-green-500/20',
    borderColor: 'border-emerald-500/30'
  }
]

const SAMPLE_WRITERS = [
  {
    id: '1',
    name: 'Priya Menon',
    avatar: 'priya',
    level: 'IIT Madras · UG',
    qualityMetrics: {
      neatness: 4.8,
      readability: 4.9,
      consistency: 4.7,
      speed: 4.6,
      overall: 4.8
    },
    totalSamples: 24,
    totalReviews: 201,
    badges: ['⭐ Top Rated', '🏆 Best Handwriting', '⚡ Fast Delivery'],
    isVerified: true,
    isTopWriter: true,
    handwritingStyle: 'Cursive Elegant',
    specializations: ['English', 'Physics', 'Chemistry'],
    price: 3
  },
  {
    id: '2',
    name: 'Ananya Kumar',
    avatar: 'ananya',
    level: 'NIT Trichy · PG',
    qualityMetrics: {
      neatness: 4.9,
      readability: 4.8,
      consistency: 4.9,
      speed: 4.4,
      overall: 4.9
    },
    totalSamples: 18,
    totalReviews: 124,
    badges: ['🏆 Best Handwriting', '✅ Verified Expert'],
    isVerified: true,
    isTopWriter: true,
    handwritingStyle: 'Print Neat',
    specializations: ['Mathematics', 'Computer Science'],
    price: 4
  },
  {
    id: '3',
    name: 'Divya Sharma',
    avatar: 'divya',
    level: 'Delhi Univ · UG',
    qualityMetrics: {
      neatness: 4.5,
      readability: 4.6,
      consistency: 4.4,
      speed: 4.8,
      overall: 4.6
    },
    totalSamples: 12,
    totalReviews: 89,
    badges: ['💰 Value for Money', '📊 Business Expert'],
    isVerified: true,
    isTopWriter: false,
    handwritingStyle: 'Hybrid Style',
    specializations: ['Commerce', 'Economics'],
    price: 2.5
  }
]

const SAMPLE_HANDWRITING = [
  {
    id: '1',
    title: 'Physics Assignment - Thermodynamics',
    description: 'Neat cursive handwriting with detailed diagrams',
    image_url: '/samples/physics1.jpg',
    sample_type: 'assignment' as const,
    neatness_rating: 4.8,
    readability_rating: 4.9,
    overall_quality: 4.8,
    pen_color: 'Black',
    paper_type: 'A4 Ruled',
    writing_size: 'medium' as const,
    views: 156,
    likes: 23,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Mathematics Notes - Calculus',
    description: 'Clear print handwriting with mathematical formulas',
    image_url: '/samples/math1.jpg',
    sample_type: 'notes' as const,
    neatness_rating: 4.9,
    readability_rating: 4.8,
    overall_quality: 4.9,
    pen_color: 'Blue',
    paper_type: 'A4 Grid',
    writing_size: 'small' as const,
    views: 203,
    likes: 34,
    created_at: '2024-01-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Chemistry Lab Report',
    description: 'Technical handwriting with chemical structures',
    image_url: '/samples/chemistry1.jpg',
    sample_type: 'other' as const,
    neatness_rating: 4.7,
    readability_rating: 4.6,
    overall_quality: 4.7,
    pen_color: 'Black',
    paper_type: 'A4 Plain',
    writing_size: 'medium' as const,
    views: 128,
    likes: 19,
    created_at: '2024-01-13T09:15:00Z'
  }
]

export default function WritingShowcasePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'writers' | 'portfolio' | 'comparison'>('overview')
  const [selectedWriter, setSelectedWriter] = useState<string | null>(null)

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-3xl mb-6">
          <PenTool className="w-10 h-10 text-amber-400" />
        </div>
        
        <h1 className="font-display text-4xl font-bold text-white mb-4">
          Premium Writing Marketplace
        </h1>
        
        <p className="text-xl text-white/60 max-w-3xl mx-auto mb-8">
          Connect with expert writers, preview handwriting quality, and get your assignments done with physical delivery options and complete payment protection.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/writing-marketplace">
            <button className="btn-primary text-lg px-8 py-4 gap-3">
              <Users className="w-5 h-5" />
              Browse Writers
            </button>
          </Link>
          <Link href="/orders/new?category=writing">
            <button className="btn-secondary text-lg px-8 py-4 gap-3">
              <FileText className="w-5 h-5" />
              Post Order
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {SHOWCASE_FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={cn(
              'card p-6 text-center border-2',
              feature.color,
              feature.borderColor
            )}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: Target },
          { id: 'writers', label: 'Top Writers', icon: Award },
          { id: 'portfolio', label: 'Sample Portfolio', icon: Eye },
          { id: 'comparison', label: 'Compare Writers', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab.id
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/[0.08]'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Expert Writers', value: '500+', icon: Users, color: 'text-blue-400' },
                { label: 'Completed Orders', value: '10,000+', icon: CheckCircle, color: 'text-emerald-400' },
                { label: 'Avg Rating', value: '4.8/5', icon: Star, color: 'text-amber-400' },
                { label: 'On-Time Delivery', value: '98%', icon: Clock, color: 'text-purple-400' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 text-center"
                >
                  <stat.icon className={cn('w-8 h-8 mx-auto mb-3', stat.color)} />
                  <div className="font-display text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Paper Preview */}
            <div className="card p-8">
              <h3 className="font-display text-xl font-bold text-white mb-6 text-center">
                Premium Handwriting Quality
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-white mb-4">Sample Work</h4>
                  <HandwritingPreview
                    sample="This is a sample of the premium handwriting quality you can expect from our expert writers. Each writer is carefully vetted for neatness, readability, and consistency."
                    style="elegant"
                    animated={true}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-4">Notebook Delivery</h4>
                  <Notebook
                    coverColor="blue"
                    spiral={true}
                    pages={100}
                    currentPage={42}
                  >
                    <div className="text-gray-700">
                      <p className="mb-4">Chapter 3: Advanced Topics</p>
                      <p className="mb-4">Your completed work will be delivered in premium notebooks with professional binding...</p>
                    </div>
                  </Notebook>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Writers Tab */}
        {activeTab === 'writers' && (
          <motion.div
            key="writers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {SAMPLE_WRITERS.map((writer, index) => (
                <motion.div
                  key={writer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HandwritingQualityCard
                    writerId={writer.id}
                    writerName={writer.name}
                    avatar={writer.avatar}
                    qualityMetrics={writer.qualityMetrics}
                    totalSamples={writer.totalSamples}
                    totalReviews={writer.totalReviews}
                    badges={writer.badges}
                    isVerified={writer.isVerified}
                    isTopWriter={writer.isTopWriter}
                    handwritingStyle={writer.handwritingStyle}
                    specializations={writer.specializations}
                    onHireWriter={() => setSelectedWriter(writer.id)}
                    onViewPortfolio={() => setActiveTab('portfolio')}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <HandwritingPortfolio
              writerId="1"
              writerName="Priya Menon"
              samples={SAMPLE_HANDWRITING}
              isOwnPortfolio={false}
              onUploadSample={() => {}}
            />
          </motion.div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <QualityComparison
              writers={SAMPLE_WRITERS.map(writer => ({
                id: writer.id,
                name: writer.name,
                avatar: writer.avatar,
                metrics: writer.qualityMetrics,
                price: writer.price
              }))}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-center"
      >
        <div className="card p-8 bg-gradient-to-br from-brand-500/10 to-blue-500/10 border border-brand-500/20">
          <h2 className="font-display text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            Join thousands of students who trust our platform for premium writing services with complete quality assurance and payment protection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/writing-marketplace">
              <button className="btn-primary text-lg px-8 py-4 gap-3">
                <Users className="w-5 h-5" />
                Browse Expert Writers
              </button>
            </Link>
            <Link href="/orders/new?category=writing">
              <button className="btn-secondary text-lg px-8 py-4 gap-3">
                <Zap className="w-5 h-5" />
                Post Your Order
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
