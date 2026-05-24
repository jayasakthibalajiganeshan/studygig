'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Star, SlidersHorizontal, Grid, List, ArrowRight, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getCategoryColor, getCategoryIcon } from '@/lib/utils'

const CATEGORIES = ['All', 'Writing', 'Tutor', 'Student Tutor', 'Companion', 'Project', 'Craft']
const SORT_OPTIONS = ['Most Popular', 'Highest Rated', 'Lowest Price', 'Newest', 'Fast Delivery']

const GIGS = [
  { id: '1', name: 'Priya Menon', avatar: 'priya', level: 'IIT Madras · UG', category: 'writing', subject: 'English & Physics', title: 'Professional Assignment & Report Writing', rating: 4.9, reviews: 201, price: 3, unit: '/page', badge: '⭐ Top Rated', verified: true, streak: 45, tags: ['Fast Delivery', 'Plagiarism Free'] },
  { id: '2', name: 'Rahul Verma', avatar: 'rahul', level: 'BITS Pilani · UG', category: 'tutor', subject: 'Mathematics & Physics', title: 'Expert Math Tutoring — JEE to University Level', rating: 4.8, reviews: 124, price: 800, unit: '/session', badge: '🔥 Trending', verified: true, streak: 32, tags: ['Live Sessions', 'Mock Tests'] },
  { id: '3', name: 'Ananya Kumar', avatar: 'ananya', level: 'NIT Trichy · PG', category: 'project', subject: 'Web & Mobile Dev', title: 'Full Stack Projects — React, Node.js, MongoDB', rating: 5.0, reviews: 89, price: 2500, unit: '+', badge: '🏆 Pro', verified: true, streak: 28, tags: ['On-Time', 'Clean Code'] },
  { id: '4', name: 'Karthik S', avatar: 'karthik', level: 'Anna Univ · UG', category: 'student_tutor', subject: 'Physics & Chemistry', title: 'Doubt Solving & Topic Assistance — 11th & 12th', rating: 4.7, reviews: 56, price: 200, unit: '/session', badge: '✅ Verified', verified: true, streak: 15, tags: ['Peer Learning', 'Patient Teacher'] },
  { id: '5', name: 'Meera Raj', avatar: 'meera', level: 'Delhi Univ · UG', category: 'companion', subject: 'All Subjects', title: 'Dedicated Study Partner — Daily Accountability', rating: 4.9, reviews: 34, price: 150, unit: '/week', badge: '💖 Caring', verified: false, streak: 60, tags: ['Daily Check-ins', 'Flexible Hours'] },
  { id: '6', name: 'Deepak Nair', avatar: 'deepak', level: 'IIT Bombay · UG', category: 'project', subject: 'AI/ML & Data Science', title: 'AI/ML Projects — Computer Vision, NLP, RL', rating: 4.8, reviews: 67, price: 3500, unit: '+', badge: '🤖 AI Expert', verified: true, streak: 22, tags: ['Research Quality', 'Documentation'] },
  { id: '7', name: 'Shreya Iyer', avatar: 'shreya', level: 'Manipal · UG', category: 'craft', subject: 'Science & Art', title: 'Working Science Models & Craft Projects', rating: 4.6, reviews: 29, price: 500, unit: '+', badge: '🎨 Creative', verified: false, streak: 10, tags: ['Handmade', 'Delivery Available'] },
  { id: '8', name: 'Vishal Patel', avatar: 'vishal', level: 'IIT Delhi · PG', category: 'tutor', subject: 'Computer Science', title: 'DSA, System Design & Competitive Programming', rating: 4.9, reviews: 145, price: 1200, unit: '/session', badge: '💻 FAANG Ready', verified: true, streak: 38, tags: ['Placement Prep', 'LeetCode'] },
  { id: '9', name: 'Divya Sharma', avatar: 'divya', level: 'IIIT Hyderabad · UG', category: 'writing', subject: 'Commerce & Economics', title: 'Business Reports, Case Studies & Research Papers', rating: 4.7, reviews: 88, price: 4, unit: '/page', badge: '📊 B-School Ready', verified: true, streak: 19, tags: ['APA/MLA', 'Turnitin Safe'] },
]

const CATEGORY_COLORS: Record<string, string> = {
  writing: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  tutor: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  student_tutor: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
  companion: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
  project: 'bg-brand-500/15 text-brand-300 border-brand-500/20',
  craft: 'bg-green-500/15 text-green-300 border-green-500/20',
}

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('Most Popular')
  const [searchQ, setSearchQ] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filtered = GIGS.filter(g => {
    const catMatch = activeCategory === 'All' || g.category === activeCategory.toLowerCase().replace(' ', '_')
    const searchMatch = !searchQ || g.title.toLowerCase().includes(searchQ.toLowerCase()) || g.subject.toLowerCase().includes(searchQ.toLowerCase()) || g.name.toLowerCase().includes(searchQ.toLowerCase())
    const verMatch = !verifiedOnly || g.verified
    return catMatch && searchMatch && verMatch
  })

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Student Marketplace</h1>
        <p className="text-white/40">Browse {GIGS.length}+ services from verified students</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search subjects, skills, names..." className="input pl-10 w-full" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={cn('btn-secondary gap-2', showFilters && 'border-brand-500/40 text-brand-400')}>
          <SlidersHorizontal className="w-4 h-4" /> Filters
          {(verifiedOnly) && <span className="w-2 h-2 rounded-full bg-brand-400" />}
        </button>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="select w-full sm:w-auto">
          {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08]">
          <button onClick={() => setView('grid')} className={cn('p-2 rounded-lg transition-all', view === 'grid' ? 'bg-white/10 text-white' : 'text-white/30')}>
            <Grid className="w-4 h-4" />
          </button>
          <button onClick={() => setView('list')} className={cn('p-2 rounded-lg transition-all', view === 'list' ? 'bg-white/10 text-white' : 'text-white/30')}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="card p-5 mb-6 overflow-hidden">
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="w-4 h-4 accent-brand-500" />
                <span className="text-sm text-white">✅ Verified Only</span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/40">Min Rating:</span>
                {[4.0, 4.5, 4.8].map(r => (
                  <button key={r} className="px-3 py-1 rounded-lg text-xs border border-white/10 text-white/50 hover:border-brand-500/40 hover:text-brand-400 transition-all">⭐ {r}+</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
              activeCategory === c ? 'bg-brand-500 text-white shadow-glow-brand' : 'bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/[0.08]')}>
            {getCategoryIcon(c.toLowerCase().replace(' ','_'))} {c}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/40 text-sm">{filtered.length} results{searchQ && ` for "${searchQ}"`}</p>
      </div>

      {/* Gig grid */}
      <div className={cn('gap-5', view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col')}>
        {filtered.map((gig, i) => (
          <motion.div key={gig.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Link href={`/marketplace/${gig.id}`}>
              <div className={cn('card-hover cursor-pointer group overflow-hidden', view === 'list' ? 'flex items-center gap-5 p-5' : 'p-5')}>
                <div className={cn('flex items-start gap-3 mb-4', view === 'list' ? 'mb-0 flex-shrink-0 w-60' : '')}>
                  <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${gig.avatar}&backgroundColor=b6e3f4`}
                    alt={gig.name} className="w-12 h-12 rounded-xl bg-brand-500/20 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{gig.name}</div>
                    <div className="text-xs text-white/40 truncate">{gig.level}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {gig.verified && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                      <span className="text-xs text-white/30">🔥 {gig.streak}d streak</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={cn('font-medium text-white leading-tight group-hover:text-brand-300 transition-colors', view === 'list' ? 'text-base' : 'text-sm')}>{gig.title}</h3>
                    <span className={cn('badge text-xs flex-shrink-0 border', CATEGORY_COLORS[gig.category] || 'badge-brand')}>{getCategoryIcon(gig.category)}</span>
                  </div>

                  <div className="text-xs text-white/40 mb-3">{gig.subject}</div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {gig.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-white/40 text-xs border border-white/[0.06]">{t}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold text-white">{gig.rating}</span>
                      </div>
                      <span className="text-xs text-white/30">({gig.reviews})</span>
                      <span className="text-xs text-amber-400">{gig.badge}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/30">Starting</div>
                      <div className="font-display font-bold text-brand-400">₹{gig.price.toLocaleString()}<span className="text-xs font-normal text-white/40">{gig.unit}</span></div>
                    </div>
                  </div>
                </div>

                {view === 'list' && (
                  <button className="btn-primary text-sm py-2 flex-shrink-0">
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-white/40 mb-6">Try adjusting your search or filters</p>
          <button onClick={() => { setSearchQ(''); setActiveCategory('All'); setVerifiedOnly(false) }} className="btn-secondary">Clear Filters</button>
        </div>
      )}
    </div>
  )
}
