'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Star, SlidersHorizontal, Grid, List, ArrowRight, Zap, CheckCircle, Award, Clock, MapPin, Eye, Heart, Shield, Truck, PenTool, FileText, Download, X, ChevronDown, ChevronUp, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { getCategoryIcon } from '@/lib/utils'

// Enhanced writer data with new features
const WRITERS = [
  {
    id: '1',
    name: 'Priya Menon',
    avatar: 'priya',
    level: 'IIT Madras · UG',
    rating: 4.9,
    reviews: 201,
    completed_orders: 186,
    base_price: 3,
    handwriting_quality: 4.8,
    handwriting_style: 'Cursive Elegant',
    subjects: ['English', 'Physics', 'Chemistry'],
    writing_types: ['Assignments', 'Reports', 'Notes'],
    education_levels: ['UG', 'PG'],
    delivery_speed: 'fast',
    supports_physical: true,
    delivery_areas: ['Chennai', 'Bangalore', 'Hyderabad'],
    pen_colors: ['Black', 'Blue', 'Red'],
    verified: true,
    badges: ['⭐ Top Rated', '🏆 Best Handwriting', '⚡ Fast Delivery'],
    streak: 45,
    portfolio_images: ['/samples/priya1.jpg', '/samples/priya2.jpg'],
    sample_description: 'Expert in technical assignments with neat cursive handwriting. Specializes in physics and chemistry diagrams.',
    on_time_rate: 98.5,
    avg_response_time: '2 hours'
  },
  {
    id: '2',
    name: 'Ananya Kumar',
    avatar: 'ananya',
    level: 'NIT Trichy · PG',
    rating: 4.7,
    reviews: 124,
    completed_orders: 118,
    base_price: 4,
    handwriting_quality: 4.9,
    handwriting_style: 'Print Neat',
    subjects: ['Mathematics', 'Computer Science', 'Electronics'],
    writing_types: ['Assignments', 'Lab Records', 'Projects'],
    education_levels: ['UG', 'PG'],
    delivery_speed: 'medium',
    supports_physical: true,
    delivery_areas: ['Trichy', 'Chennai', 'Coimbatore'],
    pen_colors: ['Black', 'Blue'],
    verified: true,
    badges: ['🏆 Best Handwriting', '✅ Verified Expert'],
    streak: 32,
    portfolio_images: ['/samples/ananya1.jpg', '/samples/ananya2.jpg', '/samples/ananya3.jpg'],
    sample_description: 'Perfect print handwriting ideal for mathematics and engineering subjects. Excellent diagram drawing skills.',
    on_time_rate: 99.2,
    avg_response_time: '1 hour'
  },
  {
    id: '3',
    name: 'Divya Sharma',
    avatar: 'divya',
    level: 'Delhi Univ · UG',
    rating: 4.8,
    reviews: 89,
    completed_orders: 85,
    base_price: 2.5,
    handwriting_quality: 4.6,
    handwriting_style: 'Hybrid Style',
    subjects: ['Commerce', 'Economics', 'Business Studies'],
    writing_types: ['Assignments', 'Case Studies', 'Reports'],
    education_levels: ['UG', '12th'],
    delivery_speed: 'fast',
    supports_physical: false,
    delivery_areas: [],
    pen_colors: ['Black', 'Blue', 'Green'],
    verified: true,
    badges: ['💰 Value for Money', '📊 Business Expert'],
    streak: 28,
    portfolio_images: ['/samples/divya1.jpg'],
    sample_description: 'Clear and professional handwriting perfect for business and commerce subjects. Quick turnaround time.',
    on_time_rate: 97.8,
    avg_response_time: '3 hours'
  },
  {
    id: '4',
    name: 'Karthik S',
    avatar: 'karthik',
    level: 'Anna Univ · UG',
    rating: 4.6,
    reviews: 56,
    completed_orders: 52,
    base_price: 3.5,
    handwriting_quality: 4.5,
    handwriting_style: 'Technical Print',
    subjects: ['Engineering', 'Physics', 'Mathematics'],
    writing_types: ['Assignments', 'Lab Records', 'Notes'],
    education_levels: ['UG'],
    delivery_speed: 'medium',
    supports_physical: true,
    delivery_areas: ['Chennai', 'Vellore'],
    pen_colors: ['Black'],
    verified: false,
    badges: ['🔧 Technical Expert'],
    streak: 15,
    portfolio_images: ['/samples/karthik1.jpg', '/samples/karthik2.jpg'],
    sample_description: 'Strong technical background with clear engineering handwriting. Good with diagrams and calculations.',
    on_time_rate: 95.5,
    avg_response_time: '4 hours'
  }
]

const FILTER_OPTIONS = {
  rating: [4.0, 4.5, 4.8],
  handwriting_quality: [4.0, 4.5, 4.8],
  delivery_speed: ['fast', 'medium', 'slow'],
  price_range: [
    { label: 'Under ₹3', min: 0, max: 3 },
    { label: '₹3 - ₹5', min: 3, max: 5 },
    { label: 'Above ₹5', min: 5, max: 50 }
  ],
  physical_delivery: ['yes', 'no'],
  verification: ['verified', 'all']
}

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'handwriting', label: 'Best Handwriting' },
  { value: 'price_low', label: 'Lowest Price' },
  { value: 'orders', label: 'Most Orders' },
  { value: 'speed', label: 'Fast Delivery' },
  { value: 'response', label: 'Quick Response' }
]

export default function WritingMarketplacePage() {
  const [searchQ, setSearchQ] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [selectedWriter, setSelectedWriter] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [compareList, setCompareList] = useState<string[]>([])
  
  // Filter states
  const [filters, setFilters] = useState({
    minRating: 0,
    minHandwriting: 0,
    deliverySpeed: '',
    priceRange: { min: 0, max: 50 },
    physicalDelivery: '',
    verified: 'all'
  })

  const filteredAndSortedWriters = useMemo(() => {
    let filtered = WRITERS.filter(writer => {
      const searchMatch = !searchQ || 
        writer.name.toLowerCase().includes(searchQ.toLowerCase()) ||
        writer.subjects.some(s => s.toLowerCase().includes(searchQ.toLowerCase())) ||
        writer.handwriting_style.toLowerCase().includes(searchQ.toLowerCase())
      
      const ratingMatch = writer.rating >= filters.minRating
      const handwritingMatch = writer.handwriting_quality >= filters.minHandwriting
      const speedMatch = !filters.deliverySpeed || writer.delivery_speed === filters.deliverySpeed
      const priceMatch = writer.base_price >= filters.priceRange.min && writer.base_price <= filters.priceRange.max
      const physicalMatch = !filters.physicalDelivery || 
        (filters.physicalDelivery === 'yes' ? writer.supports_physical : !writer.supports_physical)
      const verifiedMatch = filters.verified === 'all' || 
        (filters.verified === 'verified' ? writer.verified : true)

      return searchMatch && ratingMatch && handwritingMatch && speedMatch && priceMatch && physicalMatch && verifiedMatch
    })

    // Sort writers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'handwriting':
          return b.handwriting_quality - a.handwriting_quality
        case 'price_low':
          return a.base_price - b.base_price
        case 'orders':
          return b.completed_orders - a.completed_orders
        case 'speed':
          return a.delivery_speed === 'fast' ? -1 : 1
        case 'response':
          return parseInt(a.avg_response_time) - parseInt(b.avg_response_time)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQ, filters, sortBy])

  const toggleCompare = (writerId: string) => {
    if (compareList.includes(writerId)) {
      setCompareList(compareList.filter(id => id !== writerId))
    } else if (compareList.length < 3) {
      setCompareList([...compareList, writerId])
    } else {
      toast.error('You can compare up to 3 writers at a time')
    }
  }

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">Writing Marketplace</h1>
            <p className="text-white/40">Browse {WRITERS.length}+ expert writers with handwriting samples</p>
          </div>
          {compareList.length > 0 && (
            <button
              onClick={() => setCompareMode(!compareMode)}
              className="btn-primary gap-2"
            >
              <Users className="w-4 h-4" />
              Compare ({compareList.length})
            </button>
          )}
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search writers, subjects, handwriting styles..."
            className="input pl-10 w-full"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn('btn-secondary gap-2', showFilters && 'border-brand-500/40 text-brand-400')}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {(filters.minRating > 0 || filters.minHandwriting > 0 || filters.deliverySpeed) && (
            <span className="w-2 h-2 rounded-full bg-brand-400" />
          )}
        </button>
        
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="select w-full lg:w-auto">
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        
        <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08]">
          <button
            onClick={() => setView('grid')}
            className={cn('p-2 rounded-lg transition-all', view === 'grid' ? 'bg-white/10 text-white' : 'text-white/30')}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn('p-2 rounded-lg transition-all', view === 'list' ? 'bg-white/10 text-white' : 'text-white/30')}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6 mb-6 overflow-hidden"
          >
            <h3 className="font-semibold text-white mb-4">Advanced Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Rating Filter */}
              <div>
                <label className="label mb-3 block">Minimum Rating</label>
                <div className="flex gap-2">
                  {FILTER_OPTIONS.rating.map(rating => (
                    <button
                      key={rating}
                      onClick={() => updateFilter('minRating', rating)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm border transition-all',
                        filters.minRating === rating
                          ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                          : 'border-white/10 text-white/50 hover:border-white/20'
                      )}
                    >
                      ⭐ {rating}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Handwriting Quality Filter */}
              <div>
                <label className="label mb-3 block">Handwriting Quality</label>
                <div className="flex gap-2">
                  {FILTER_OPTIONS.handwriting_quality.map(quality => (
                    <button
                      key={quality}
                      onClick={() => updateFilter('minHandwriting', quality)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm border transition-all',
                        filters.minHandwriting === quality
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'border-white/10 text-white/50 hover:border-white/20'
                      )}
                    >
                      ✍️ {quality}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Speed Filter */}
              <div>
                <label className="label mb-3 block">Delivery Speed</label>
                <div className="flex gap-2">
                  {FILTER_OPTIONS.delivery_speed.map(speed => (
                    <button
                      key={speed}
                      onClick={() => updateFilter('deliverySpeed', speed)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm border transition-all capitalize',
                        filters.deliverySpeed === speed
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'border-white/10 text-white/50 hover:border-white/20'
                      )}
                    >
                      <Clock className="w-3 h-3 inline mr-1" />
                      {speed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="label mb-3 block">Price per Page</label>
                <div className="flex gap-2">
                  {FILTER_OPTIONS.price_range.map(range => (
                    <button
                      key={range.label}
                      onClick={() => updateFilter('priceRange', { min: range.min, max: range.max })}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm border transition-all',
                        filters.priceRange.min === range.min && filters.priceRange.max === range.max
                          ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                          : 'border-white/10 text-white/50 hover:border-white/20'
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical Delivery Filter */}
              <div>
                <label className="label mb-3 block">Physical Delivery</label>
                <div className="flex gap-2">
                  {FILTER_OPTIONS.physical_delivery.map(option => (
                    <button
                      key={option}
                      onClick={() => updateFilter('physicalDelivery', option)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm border transition-all',
                        filters.physicalDelivery === option
                          ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                          : 'border-white/10 text-white/50 hover:border-white/20'
                      )}
                    >
                      {option === 'yes' ? <Truck className="w-3 h-3 inline mr-1" /> : <Download className="w-3 h-3 inline mr-1" />}
                      {option === 'yes' ? 'Available' : 'Digital Only'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification Filter */}
              <div>
                <label className="label mb-3 block">Verification</label>
                <div className="flex gap-2">
                  {FILTER_OPTIONS.verification.map(option => (
                    <button
                      key={option}
                      onClick={() => updateFilter('verified', option)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm border transition-all',
                        filters.verified === option
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'border-white/10 text-white/50 hover:border-white/20'
                      )}
                    >
                      {option === 'verified' ? <Shield className="w-3 h-3 inline mr-1" /> : <Users className="w-3 h-3 inline mr-1" />}
                      {option === 'verified' ? 'Verified Only' : 'All Writers'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setFilters({
                  minRating: 0,
                  minHandwriting: 0,
                  deliverySpeed: '',
                  priceRange: { min: 0, max: 50 },
                  physicalDelivery: '',
                  verified: 'all'
                })}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/40 text-sm">
          {filteredAndSortedWriters.length} writers found{searchQ && ` for "${searchQ}"`}
        </p>
        {compareMode && (
          <p className="text-brand-400 text-sm">
            Select up to 3 writers to compare
          </p>
        )}
      </div>

      {/* Writer Grid/List */}
      <div className={cn('gap-5', view === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'flex flex-col')}>
        {filteredAndSortedWriters.map((writer, index) => (
          <motion.div
            key={writer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <div className={cn(
              'card-hover group overflow-hidden',
              view === 'list' ? 'flex items-center gap-5 p-5' : 'p-5',
              selectedWriter === writer.id && 'ring-2 ring-brand-500/50'
            )}>
              {/* Compare Mode Checkbox */}
              {compareMode && (
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={() => toggleCompare(writer.id)}
                    className={cn(
                      'w-6 h-6 rounded border-2 flex items-center justify-center transition-all',
                      compareList.includes(writer.id)
                        ? 'bg-brand-500 border-brand-500 text-white'
                        : 'border-white/30 text-white/30 hover:border-white/50'
                    )}
                  >
                    {compareList.includes(writer.id) && <CheckCircle className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Writer Header */}
              <div className={cn('flex items-start gap-3 mb-4', view === 'list' ? 'mb-0 flex-shrink-0 w-60' : '')}>
                <div className="relative">
                  <img
                    src={`https://api.dicebear.com/8.x/notionists/svg?seed=${writer.avatar}&backgroundColor=b6e3f4`}
                    alt={writer.name}
                    className="w-14 h-14 rounded-xl bg-brand-500/20 flex-shrink-0"
                  />
                  {writer.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white text-sm truncate">{writer.name}</div>
                  <div className="text-xs text-white/40 truncate">{writer.level}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium text-white">{writer.rating}</span>
                      <span className="text-xs text-white/30">({writer.reviews})</span>
                    </div>
                    <span className="text-xs text-amber-400">🔥 {writer.streak}d</span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mb-3">
                {writer.badges.map(badge => (
                  <span key={badge} className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 text-xs border border-amber-500/30">
                    {badge}
                  </span>
                ))}
              </div>

              {/* Handwriting Quality */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-amber-300">✍️ Handwriting Quality</span>
                  <span className="text-xs font-bold text-amber-400">{writer.handwriting_quality}/5.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                      style={{ width: `${(writer.handwriting_quality / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-amber-400">{writer.handwriting_style}</span>
                </div>
              </div>

              {/* Subjects & Expertise */}
              <div className="mb-3">
                <div className="text-xs text-white/40 mb-1">Subjects</div>
                <div className="flex flex-wrap gap-1">
                  {writer.subjects.slice(0, 3).map(subject => (
                    <span key={subject} className="px-2 py-0.5 rounded bg-white/[0.04] text-white/60 text-xs">
                      {subject}
                    </span>
                  ))}
                  {writer.subjects.length > 3 && (
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] text-white/40 text-xs">
                      +{writer.subjects.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-white/60">
                  <Clock className="w-3 h-3" />
                  <span className="capitalize">{writer.delivery_speed}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/60">
                  <MapPin className="w-3 h-3" />
                  <span>{writer.on_time_rate}% on-time</span>
                </div>
                {writer.supports_physical && (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Truck className="w-3 h-3" />
                    <span>Physical delivery</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-white/60">
                  <Zap className="w-3 h-3" />
                  <span>{writer.avg_response_time}</span>
                </div>
              </div>

              {/* Portfolio Preview */}
              {writer.portfolio_images.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">Portfolio Samples</span>
                    <button
                      onClick={() => setSelectedWriter(writer.id)}
                      className="text-xs text-brand-400 hover:text-brand-300"
                    >
                      View All
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    {writer.portfolio_images.slice(0, 3).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-20 rounded bg-white/[0.04] border border-white/[0.08] overflow-hidden cursor-pointer hover:border-brand-500/40 transition-all"
                        onClick={() => setSelectedWriter(writer.id)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                          <PenTool className="w-6 h-6 text-amber-400/50" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                <div>
                  <div className="text-xs text-white/30">Starting from</div>
                  <div className="font-display font-bold text-brand-400 text-lg">
                    ₹{writer.base_price}
                    <span className="text-xs font-normal text-white/40">/page</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!compareMode && (
                    <button
                      onClick={() => toggleCompare(writer.id)}
                      className="btn-secondary text-xs py-2 px-3"
                    >
                      Compare
                    </button>
                  )}
                  <Link href={`/orders/new?category=writing&writer=${writer.id}`}>
                    <button className="btn-primary text-xs py-2 px-3">
                      Select Writer
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedWriters.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-semibold text-white mb-2">No writers found</h3>
          <p className="text-white/40 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQ('')
              setFilters({
                minRating: 0,
                minHandwriting: 0,
                deliverySpeed: '',
                priceRange: { min: 0, max: 50 },
                physicalDelivery: '',
                verified: 'all'
              })
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Writer Detail Modal */}
      <AnimatePresence>
        {selectedWriter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedWriter(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/[0.08]"
              onClick={e => e.stopPropagation()}
            >
              {/* Writer Detail Content */}
              {(() => {
                const writer = WRITERS.find(w => w.id === selectedWriter)
                if (!writer) return null

                return (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={`https://api.dicebear.com/8.x/notionists/svg?seed=${writer.avatar}&backgroundColor=b6e3f4`}
                          alt={writer.name}
                          className="w-16 h-16 rounded-xl bg-brand-500/20"
                        />
                        <div>
                          <h2 className="font-display text-xl font-bold text-white">{writer.name}</h2>
                          <p className="text-white/40">{writer.level}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-medium text-white">{writer.rating}</span>
                              <span className="text-white/30">({writer.reviews} reviews)</span>
                            </div>
                            {writer.verified && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedWriter(null)}
                        className="btn-icon p-2"
                      >
                        <X className="w-5 h-5 text-white/60" />
                      </button>
                    </div>

                    {/* Portfolio Gallery */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-white mb-3">Portfolio Samples</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className="aspect-[3/4] rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
                            <PenTool className="w-8 h-8 text-amber-400/30" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-white mb-2">About</h3>
                      <p className="text-white/60 leading-relaxed">{writer.sample_description}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-white/[0.02] rounded-lg">
                        <div className="font-display font-bold text-brand-400">{writer.completed_orders}</div>
                        <div className="text-xs text-white/40">Orders</div>
                      </div>
                      <div className="text-center p-3 bg-white/[0.02] rounded-lg">
                        <div className="font-display font-bold text-amber-400">{writer.handwriting_quality}/5</div>
                        <div className="text-xs text-white/40">Handwriting</div>
                      </div>
                      <div className="text-center p-3 bg-white/[0.02] rounded-lg">
                        <div className="font-display font-bold text-emerald-400">{writer.on_time_rate}%</div>
                        <div className="text-xs text-white/40">On-time</div>
                      </div>
                      <div className="text-center p-3 bg-white/[0.02] rounded-lg">
                        <div className="font-display font-bold text-blue-400">{writer.avg_response_time}</div>
                        <div className="text-xs text-white/40">Response</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link href={`/orders/new?category=writing&writer=${writer.id}`}>
                        <button className="btn-primary flex-1">
                          Hire This Writer
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          toggleCompare(writer.id)
                          setSelectedWriter(null)
                        }}
                        className="btn-secondary"
                      >
                        Add to Compare
                      </button>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {compareMode && compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 right-4 bg-slate-900 rounded-xl p-4 border border-white/[0.08] shadow-2xl max-w-sm z-40"
          >
            <h4 className="font-semibold text-white mb-3">Compare Writers ({compareList.length}/3)</h4>
            <div className="space-y-2 mb-3">
              {compareList.map(writerId => {
                const writer = WRITERS.find(w => w.id === writerId)
                if (!writer) return null
                return (
                  <div key={writerId} className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{writer.name}</span>
                    <button
                      onClick={() => toggleCompare(writerId)}
                      className="text-white/40 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
            </div>
            {compareList.length > 1 && (
              <button className="btn-primary w-full text-sm">
                Compare Selected
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
