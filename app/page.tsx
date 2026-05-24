'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Code, Users, PenTool, Rocket, Star,
  ArrowRight, Zap, Shield, TrendingUp, ChevronRight,
  Sparkles, GraduationCap, Brain, Heart
} from 'lucide-react'

const HERO_WORDS = ['Tutoring', 'Projects', 'Assignments', 'Study Partners', 'Skill Learning']
const STATS = [
  { value: '12,400+', label: 'Active Students', icon: Users },
  { value: '₹2.4Cr+', label: 'Paid to Students', icon: TrendingUp },
  { value: '98%', label: 'Satisfaction Rate', icon: Star },
  { value: '48hr', label: 'Avg Delivery', icon: Zap },
]

const CATEGORIES = [
  { icon: PenTool, label: 'Writing', desc: 'Assignments & Essays', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/20', text: 'text-amber-400', href: '/orders/new?category=writing' },
  { icon: GraduationCap, label: 'Tutoring', desc: 'Learn from Experts', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/20', text: 'text-blue-400', href: '/orders/new?category=tutor' },
  { icon: Brain, label: 'Student Tutor', desc: 'Peer Learning', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/20', text: 'text-purple-400', href: '/orders/new?category=student_tutor' },
  { icon: Heart, label: 'Study Buddy', desc: 'Find a Companion', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/20', text: 'text-pink-400', href: '/companion-match' },
  { icon: Code, label: 'Projects', desc: 'Dev & Engineering', color: 'from-brand-500/20 to-violet-500/20', border: 'border-brand-500/20', text: 'text-brand-400', href: '/orders/new?category=project' },
  { icon: Sparkles, label: 'Craft Work', desc: 'Creative Projects', color: 'from-green-500/20 to-teal-500/20', border: 'border-green-500/20', text: 'text-green-400', href: '/orders/new?category=craft' },
]

const FEATURED_GIGS = [
  { name: 'Priya M.', subject: 'Physics & Maths', rating: 4.9, reviews: 124, price: '₹800/session', level: 'IIT Madras', avatar: '1', badge: '⭐ Top Rated' },
  { name: 'Rahul V.', subject: 'Web Dev & React', rating: 5.0, reviews: 89, price: '₹2500/project', level: 'BITS Pilani', avatar: '2', badge: '🔥 Trending' },
  { name: 'Ananya K.', subject: 'Content Writing', rating: 4.8, reviews: 201, price: '₹3/page', level: 'Delhi Univ', avatar: '3', badge: '✅ Verified' },
]

export default function HomePage() {
  const [wordIdx, setWordIdx] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIdx((i) => (i + 1) % HERO_WORDS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#080814] overflow-x-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-500/8 blur-[120px] animate-orb" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/8 blur-[120px] animate-orb" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-pink-500/5 blur-[100px] animate-orb" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 grid-bg opacity-50" />
      </div>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-panel' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">Study<span className="text-brand-400">Gig</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {['Marketplace', 'Demand Board', 'Social', 'Pricing'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm text-white/60 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-white/70 hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm py-2 px-4">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            India's First Student Academic Ecosystem
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
          >
            The Marketplace for{' '}
            <br />
            Student{' '}
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -20, rotateX: 90 }}
                transition={{ duration: 0.35 }}
                className="gradient-text inline-block"
              >
                {HERO_WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/50 max-w-2xl mx-auto mb-10"
          >
            Connect with talented students for tutoring, writing, projects & study partnerships.
            The Fiverr + LinkedIn built exclusively for 10th grade to PG students.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link href="/auth/register" className="btn-primary px-8 py-3.5 text-base w-full sm:w-auto justify-center">
              <Rocket className="w-4 h-4" />
              Start for Free
            </Link>
            <Link href="/marketplace" className="btn-secondary px-8 py-3.5 text-base w-full sm:w-auto justify-center">
              Browse Marketplace
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="card p-4 text-center">
                <Icon className="w-5 h-5 text-brand-400 mx-auto mb-2" />
                <div className="font-display text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-white/40 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Everything a Student Needs
            </h2>
            <p className="text-white/40">One platform. Every academic service.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map(({ icon: Icon, label, desc, color, border, text, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={href}
                  className={`card-hover p-6 bg-gradient-to-br ${color} ${border} flex flex-col gap-3 group cursor-pointer`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} border ${border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${text}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base">{label}</h3>
                    <p className="text-white/40 text-sm mt-0.5">{desc}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${text} opacity-0 group-hover:opacity-100 transition-opacity mt-auto`} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      <section className="py-20 px-4 bg-[#0a0a16]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Top Rated Gigs</h2>
              <p className="text-white/40 mt-1">Handpicked by our community</p>
            </div>
            <Link href="/marketplace" className="btn-ghost text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_GIGS.map((gig, i) => (
              <motion.div
                key={gig.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href="/marketplace">
                  <div className="card-hover p-6 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/8.x/notionists/svg?seed=${gig.avatar}&backgroundColor=b6e3f4`}
                          alt={gig.name}
                          className="w-12 h-12 rounded-xl bg-brand-500/20"
                        />
                        <div>
                          <div className="font-semibold text-white text-sm">{gig.name}</div>
                          <div className="text-white/40 text-xs">{gig.level}</div>
                        </div>
                      </div>
                      <span className="badge-brand text-xs">{gig.badge}</span>
                    </div>
                    <h3 className="font-medium text-white mb-2">{gig.subject}</h3>
                    <div className="flex items-center gap-3 text-sm text-white/40 mb-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {gig.rating}
                      </span>
                      <span>({gig.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/30">Starting from</span>
                      <span className="font-display font-bold text-brand-400">{gig.price}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Built for the Student Life
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Every feature designed with the unique needs of 10th grade to postgraduate students
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Escrow Protection', desc: 'Money held safely until work is delivered and approved. Zero risk.', color: 'text-emerald-400' },
              { icon: Star, title: 'Verified Students', desc: 'All providers are verified with student ID. Trust every transaction.', color: 'text-yellow-400' },
              { icon: Zap, title: 'Live Sessions', desc: 'Book real-time tutoring sessions with calendar sync and meet links.', color: 'text-brand-400' },
              { icon: TrendingUp, title: 'Gamified Learning', desc: 'Earn XP, unlock badges, climb leaderboards. Learning becomes addictive.', color: 'text-violet-400' },
              { icon: Users, title: 'Study Companions', desc: 'Find your perfect study partner based on goals, schedule & personality.', color: 'text-pink-400' },
              { icon: Brain, title: 'AI-Powered Matching', desc: 'Smart algorithm matches you with the right tutor for your exact needs.', color: 'text-cyan-400' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card p-6 hover:border-white/10 transition-colors"
              >
                <Icon className={`w-8 h-8 ${color} mb-4`} />
                <h3 className="font-display font-semibold text-white text-base mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-violet-500/10" />
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="font-display text-3xl font-bold text-white mb-4">
                Ready to Transform Your Academic Journey?
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto">
                Join 12,400+ students already using StudyGig to learn faster, earn more, and connect deeper.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register?role=student" className="btn-primary px-8 py-3.5">
                  I Need Help <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/auth/register?role=tutor" className="btn-secondary px-8 py-3.5">
                  I Want to Earn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-white">Study<span className="text-brand-400">Gig</span></span>
            </div>
            <p className="text-white/30 text-sm">© 2024 StudyGig. Built with ❤️ for India's students.</p>
            <div className="flex items-center gap-4 text-sm text-white/30">
              <Link href="#" className="hover:text-white/60 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white/60 transition-colors">Terms</Link>
              <Link href="/help" className="hover:text-white/60 transition-colors">Help</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
