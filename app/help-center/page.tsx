'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Search, 
  HelpCircle, 
  MessageSquare, 
  BookOpen, 
  Video, 
  Download, 
  Clock, 
  TrendingUp,
  Filter,
  ChevronRight,
  Star,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Play,
  FileText,
  Monitor,
  Smartphone,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Send,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const HELP_CATEGORIES = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-500',
    description: 'Learn the basics of StudyGig',
    articles: 12,
    videos: 5
  },
  {
    id: 'orders',
    title: 'Orders & Payments',
    icon: Shield,
    color: 'from-blue-500 to-indigo-500',
    description: 'Manage orders and payments',
    articles: 18,
    videos: 8
  },
  {
    id: 'tutoring',
    title: 'Tutoring Services',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    description: 'Find and work with tutors',
    articles: 15,
    videos: 6
  },
  {
    id: 'writing',
    title: 'Writing Services',
    icon: FileText,
    color: 'from-amber-500 to-orange-500',
    description: 'Professional writing help',
    articles: 20,
    videos: 10
  },
  {
    id: 'companion',
    title: 'Study Companions',
    icon: Heart,
    color: 'from-rose-500 to-pink-500',
    description: 'Find study partners',
    articles: 8,
    videos: 4
  },
  {
    id: 'technical',
    title: 'Technical Support',
    icon: Monitor,
    color: 'from-gray-500 to-slate-500',
    description: 'Technical issues and fixes',
    articles: 10,
    videos: 3
  }
]

const HELP_ARTICLES = [
  {
    id: '1',
    category: 'getting-started',
    title: 'How to Create Your First Order',
    description: 'Step-by-step guide to placing your first order on StudyGig',
    content: 'Creating your first order is simple. Click on "New Order" from the dashboard, select your category, fill in the requirements, set your budget and deadline, then confirm payment. Your order will be matched with qualified providers.',
    readTime: '3 min',
    difficulty: 'beginner',
    views: 1250,
    helpful: 89,
    lastUpdated: '2024-01-15',
    tags: ['orders', 'beginner', 'tutorial']
  },
  {
    id: '2',
    category: 'orders',
    title: 'Understanding Escrow Payments',
    description: 'How our secure payment system protects both buyers and sellers',
    content: 'StudyGig uses escrow to ensure secure transactions. When you place an order, payment is held in escrow until work is completed and approved. This protects buyers from poor quality work and sellers from non-payment.',
    readTime: '5 min',
    difficulty: 'intermediate',
    views: 2100,
    helpful: 94,
    lastUpdated: '2024-01-14',
    tags: ['payments', 'security', 'escrow']
  },
  {
    id: '3',
    category: 'tutoring',
    title: 'Finding the Right Tutor',
    description: 'Tips for selecting the perfect tutor for your needs',
    content: 'Look for tutors with verified badges, high ratings, and relevant expertise. Check their availability, teaching style, and student reviews. Start with a trial session to ensure compatibility.',
    readTime: '4 min',
    difficulty: 'beginner',
    views: 890,
    helpful: 87,
    lastUpdated: '2024-01-13',
    tags: ['tutoring', 'selection', 'tips']
  }
]

const HELP_VIDEOS = [
  {
    id: '1',
    title: 'Complete Platform Walkthrough',
    description: 'Full tour of StudyGig features',
    duration: '8:45',
    thumbnail: '/videos/walkthrough.jpg',
    views: 3400,
    category: 'getting-started'
  },
  {
    id: '2',
    title: 'How Escrow Protects You',
    description: 'Understanding secure payments',
    duration: '5:12',
    thumbnail: '/videos/escrow.jpg',
    views: 2100,
    category: 'orders'
  },
  {
    id: '3',
    title: 'Tutor Session Best Practices',
    description: 'Make the most of your tutoring sessions',
    duration: '6:30',
    thumbnail: '/videos/tutoring.jpg',
    views: 1800,
    category: 'tutoring'
  }
]

const QUICK_ACTIONS = [
  {
    icon: MessageSquare,
    title: 'Live Chat Support',
    description: 'Chat with our support team instantly',
    action: 'chat',
    color: 'from-brand-500 to-violet-500'
  },
  {
    icon: Phone,
    title: 'Call Support',
    description: 'Speak with a support agent',
    action: 'call',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send detailed support requests',
    action: 'email',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    icon: Calendar,
    title: 'Schedule Callback',
    description: 'Have us call you back',
    action: 'callback',
    color: 'from-purple-500 to-pink-500'
  }
]

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'all' | 'articles' | 'videos'>('all')
  const [sortBy, setSortBy] = useState<'relevant' | 'recent' | 'popular'>('relevant')
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredArticles = HELP_ARTICLES.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = !selectedCategory || article.category === selectedCategory
    
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case 'popular':
        return b.views - a.views
      default:
        return 0
    }
  })

  const filteredVideos = HELP_VIDEOS.filter(video => {
    const matchesSearch = !searchQuery || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !selectedCategory || video.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill all required fields')
      return
    }
    
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('Support request submitted! We\'ll respond within 24 hours.')
    setShowContactModal(false)
    setContactForm({ name: '', email: '', subject: '', message: '', priority: 'medium' })
    setIsSubmitting(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-emerald-400 bg-emerald-500/10'
      case 'intermediate': return 'text-amber-400 bg-amber-500/10'
      case 'advanced': return 'text-red-400 bg-red-500/10'
      default: return 'text-gray-400 bg-gray-500/10'
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-500/20 to-violet-500/20 rounded-3xl mb-6"
        >
          <HelpCircle className="w-10 h-10 text-brand-400" />
        </motion.div>
        
        <h1 className="font-display text-4xl font-bold text-white mb-4">
          Help Center
        </h1>
        
        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
          Find answers, watch tutorials, and get support for your StudyGig experience
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, videos, or topics..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-brand-500/40 transition-all text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          {QUICK_ACTIONS.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => action.action === 'chat' ? window.open('/help', '_blank') : setShowContactModal(true)}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04] transition-all text-left group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-semibold text-white text-sm mb-1">{action.title}</div>
              <div className="text-white/40 text-xs">{action.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="font-display text-2xl font-bold text-white mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HELP_CATEGORIES.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={cn(
                'p-6 rounded-xl border text-left transition-all group',
                selectedCategory === category.id
                  ? 'border-brand-500/40 bg-brand-500/10'
                  : 'border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04]'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}>
                  <category.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-white/40 text-sm mb-3">{category.description}</p>
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span>{category.articles} articles</span>
                    <span>•</span>
                    <span>{category.videos} videos</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filters and View Mode */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        <div className="flex gap-2 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08]">
          {[
            { value: 'all', label: 'All Content' },
            { value: 'articles', label: 'Articles' },
            { value: 'videos', label: 'Videos' }
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => setViewMode(mode.value as any)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                viewMode === mode.value
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/[0.05]'
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="relevant">Most Relevant</option>
            <option value="recent">Recently Updated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Content Display */}
      <div className="space-y-8">
        {/* Articles */}
        {(viewMode === 'all' || viewMode === 'articles') && filteredArticles.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Help Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedArticle(article.id)}
                  className="card-hover cursor-pointer p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={cn('px-2 py-1 rounded-lg text-xs font-medium', getDifficultyColor(article.difficulty))}>
                      {article.difficulty}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-white/30">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {article.views}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-white mb-2">{article.title}</h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{article.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded bg-white/[0.04] text-xs text-white/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                      <Star className="w-3 h-3 fill-current" />
                      {article.helpful}% helpful
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {(viewMode === 'all' || viewMode === 'videos') && filteredVideos.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Video Tutorials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-hover cursor-pointer group"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-brand-500/10 to-violet-500/10 rounded-xl mb-4 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white/60 group-hover:text-white transition-colors" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                      {video.duration}
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{video.title}</h3>
                  <p className="text-white/60 text-sm mb-3">{video.description}</p>
                  <div className="flex items-center justify-between text-xs text-white/30">
                    <span>{video.views} views</span>
                    <span>{video.category}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredArticles.length === 0 && filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-semibold text-white mb-2">No results found</h3>
            <p className="text-white/40 mb-6">
              Try adjusting your search terms or browse our categories
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory(null)
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-white">Contact Support</h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="btn-icon p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Name *</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Your full name"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="your@email.com"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Priority</label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                    className="select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="label">Message *</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={5}
                    placeholder="Please describe your issue in detail..."
                    className="textarea"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleContactSubmit}
                    disabled={isSubmitting}
                    className="btn-primary flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
