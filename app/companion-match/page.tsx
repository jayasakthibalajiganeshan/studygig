'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Star, Clock, BookOpen, Users, Zap, MessageSquare, Check, Filter, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const COMPANIONS = [
  { id: '1', name: 'Priya Menon', avatar: 'priya', institution: 'IIT Madras', level: 'UG · 3rd Year', subjects: ['Physics', 'Mathematics', 'Python'], goals: ['JEE Advanced prep', 'Research projects'], availability: 'Evenings 6-10pm', personality: 'introvert', match: 94, online: true, streak: 28, rating: 4.9, bio: 'I love deep-focus study sessions. Looking for a serious study partner who can help me stay accountable for my research goals.', languages: ['English', 'Tamil'] },
  { id: '2', name: 'Rahul Verma', avatar: 'rahul', institution: 'BITS Pilani', level: 'UG · 2nd Year', subjects: ['Computer Science', 'Mathematics', 'DSA'], goals: ['FAANG placement', 'Competitive programming'], availability: 'Flexible', personality: 'extrovert', match: 87, online: true, streak: 15, rating: 4.7, bio: 'Competitive programmer who loves to teach and learn together. Let\'s grind LeetCode and build cool projects!', languages: ['English', 'Hindi'] },
  { id: '3', name: 'Ananya Kumar', avatar: 'ananya', institution: 'NIT Trichy', level: 'UG · Final Year', subjects: ['Web Dev', 'AI/ML', 'React'], goals: ['Startup idea', 'Open source contributions'], availability: 'Weekends', personality: 'ambivert', match: 82, online: false, streak: 42, rating: 4.8, bio: 'Building my startup while finishing college. Need someone to discuss ideas, keep each other accountable, and grow together.', languages: ['English', 'Telugu'] },
  { id: '4', name: 'Karthik S', avatar: 'karthik', institution: 'Anna University', level: 'UG · 3rd Year', subjects: ['Chemistry', 'Biology', 'Organic Chem'], goals: ['NEET preparation', 'Science olympiad'], availability: 'Morning 6-9am & Evenings', personality: 'introvert', match: 78, online: false, streak: 7, rating: 4.6, bio: 'Early morning study champion. Looking for someone to do structured revision sessions and quiz each other.', languages: ['English', 'Tamil'] },
  { id: '5', name: 'Divya Sharma', avatar: 'divya', institution: 'Delhi University', level: 'PG · 1st Year', subjects: ['Economics', 'Statistics', 'Research Methods'], goals: ['PhD preparation', 'Research paper publication'], availability: 'Afternoon 2-6pm', personality: 'ambivert', match: 75, online: true, streak: 21, rating: 4.9, bio: 'PG student interested in econometrics. Let\'s read papers together and push each other to publish!', languages: ['English', 'Hindi'] },
]

const PERSONALITY_COLORS: Record<string, string> = {
  introvert: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  extrovert: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  ambivert: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
}

export default function CompanionMatchPage() {
  const [filter, setFilter] = useState('All')
  const [selectedCompanion, setSelectedCompanion] = useState<typeof COMPANIONS[0] | null>(null)
  const [requestSent, setRequestSent] = useState<string[]>([])
  const [showPrefs, setShowPrefs] = useState(false)
  const [sending, setSending] = useState(false)
  const [prefs, setPrefs] = useState({ subjects: [] as string[], personality: 'any', availability: 'any', goals: '' })

  const FILTERS = ['All', 'Online Now', 'High Match', 'Introvert', 'Extrovert', 'Ambivert']

  const filtered = COMPANIONS.filter(c => {
    if (filter === 'Online Now') return c.online
    if (filter === 'High Match') return c.match >= 85
    if (['Introvert', 'Extrovert', 'Ambivert'].includes(filter)) return c.personality === filter.toLowerCase()
    return true
  })

  const handleRequest = async (id: string) => {
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setRequestSent(prev => [...prev, id])
    toast.success('Study request sent! 🎉')
    setSelectedCompanion(null)
    setSending(false)
  }

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-emerald-400'
    if (match >= 80) return 'text-brand-400'
    if (match >= 70) return 'text-yellow-400'
    return 'text-white/50'
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Find Your Study Buddy</h1>
          <p className="text-white/40 mt-1">Matched based on your goals, subjects & personality</p>
        </div>
        <button onClick={() => setShowPrefs(true)} className="btn-secondary text-sm">
          <Filter className="w-4 h-4" /> Set Preferences
        </button>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-transparent border border-pink-500/20 p-6">
        <div className="absolute inset-0 mesh-bg opacity-40" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-white mb-2">How Matching Works 💖</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {[
                { icon: BookOpen, label: 'Subject Overlap', desc: 'Shared topics & goals' },
                { icon: Clock, label: 'Schedule Match', desc: 'Compatible availability' },
                { icon: Users, label: 'Personality Fit', desc: 'Introvert / Extrovert sync' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white text-xs">{label}</div>
                    <div className="text-white/40 text-xs">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-4xl font-bold text-pink-400">94%</div>
            <div className="text-white/40 text-sm">Your top match</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
              filter === f ? 'bg-pink-500 text-white shadow-glow-brand' : 'bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/[0.08]')}>
            {f === 'Online Now' && '🟢 '}{f}
          </button>
        ))}
      </div>

      {/* Companion cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((companion, i) => (
          <motion.div key={companion.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className={cn('card-hover p-5 cursor-pointer relative overflow-hidden', requestSent.includes(companion.id) && 'opacity-60')}>
              {/* Match badge */}
              <div className="absolute top-4 right-4">
                <div className={cn('font-display text-xl font-bold', getMatchColor(companion.match))}>
                  {companion.match}%
                </div>
                <div className="text-xs text-white/30 text-right">match</div>
              </div>

              {/* Profile */}
              <div className="flex items-start gap-3 mb-4">
                <div className="relative">
                  <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${companion.avatar}&backgroundColor=b6e3f4`}
                    alt={companion.name} className="w-14 h-14 rounded-2xl bg-brand-500/20" />
                  {companion.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0f0f1e]" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-white">{companion.name}</div>
                  <div className="text-xs text-white/40">{companion.institution}</div>
                  <div className="text-xs text-white/30">{companion.level}</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className={cn('badge text-xs border', PERSONALITY_COLORS[companion.personality])}>
                  {companion.personality}
                </span>
                <span className="badge bg-white/[0.05] text-white/40 border border-white/[0.08] text-xs">
                  🔥 {companion.streak}d streak
                </span>
                <span className="badge bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs">
                  ⭐ {companion.rating}
                </span>
              </div>

              {/* Subjects */}
              <div className="flex flex-wrap gap-1 mb-3">
                {companion.subjects.slice(0, 3).map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-300 text-xs border border-brand-500/15">{s}</span>
                ))}
              </div>

              {/* Availability */}
              <div className="flex items-center gap-1.5 text-xs text-white/40 mb-4">
                <Clock className="w-3.5 h-3.5" />
                <span>{companion.availability}</span>
              </div>

              {/* Bio excerpt */}
              <p className="text-xs text-white/50 leading-relaxed mb-4 line-clamp-2">{companion.bio}</p>

              {/* Action buttons */}
              {requestSent.includes(companion.id) ? (
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  <Check className="w-4 h-4" /> Request Sent
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setSelectedCompanion(companion)} className="btn-primary flex-1 justify-center py-2 text-sm">
                    <Heart className="w-3.5 h-3.5" /> Connect
                  </button>
                  <button onClick={() => { toast('View full profile coming soon!') }} className="btn-secondary py-2 px-3 text-sm">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Companion detail modal */}
      <AnimatePresence>
        {selectedCompanion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-white text-lg">Study Partner Profile</h2>
                <button onClick={() => setSelectedCompanion(null)} className="btn-icon p-1.5"><X className="w-4 h-4 text-white/60" /></button>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="relative">
                  <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${selectedCompanion.avatar}&backgroundColor=b6e3f4`}
                    alt="" className="w-16 h-16 rounded-2xl bg-brand-500/20" />
                  {selectedCompanion.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#1a1a2e]" />}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{selectedCompanion.name}</div>
                  <div className="text-white/40 text-sm">{selectedCompanion.institution} · {selectedCompanion.level}</div>
                  <div className={cn('font-display text-2xl font-bold mt-1', getMatchColor(selectedCompanion.match))}>{selectedCompanion.match}% match</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-white/30 uppercase tracking-wider mb-2">About</div>
                  <p className="text-sm text-white/70 leading-relaxed">{selectedCompanion.bio}</p>
                </div>
                <div>
                  <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Subjects</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompanion.subjects.map(s => (
                      <span key={s} className="badge-brand text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Study Goals</div>
                  <ul className="space-y-1">
                    {selectedCompanion.goals.map(g => (
                      <li key={g} className="flex items-center gap-2 text-sm text-white/70">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />{g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03]">
                    <div className="text-xs text-white/30">Availability</div>
                    <div className="text-sm text-white mt-1">{selectedCompanion.availability}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03]">
                    <div className="text-xs text-white/30">Languages</div>
                    <div className="text-sm text-white mt-1">{selectedCompanion.languages.join(', ')}</div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setSelectedCompanion(null)} className="btn-secondary flex-1 justify-center py-3">Cancel</button>
                  <button onClick={() => handleRequest(selectedCompanion.id)} disabled={sending} className="btn-primary flex-1 justify-center py-3">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
                    {sending ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences modal */}
      <AnimatePresence>
        {showPrefs && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="card p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-white text-lg">Matching Preferences</h2>
                <button onClick={() => setShowPrefs(false)} className="btn-icon p-1.5"><X className="w-4 h-4 text-white/60" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Personality Preference</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['any', 'introvert', 'extrovert', 'ambivert'].map(p => (
                      <button key={p} onClick={() => setPrefs(prev => ({ ...prev, personality: p }))}
                        className={cn('py-2 rounded-xl border text-xs transition-all capitalize',
                          prefs.personality === p ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'border-white/10 text-white/40')}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Availability</label>
                  <select className="select" value={prefs.availability} onChange={e => setPrefs(prev => ({ ...prev, availability: e.target.value }))}>
                    <option value="any">Any time</option>
                    <option value="morning">Morning (6am-12pm)</option>
                    <option value="afternoon">Afternoon (12-6pm)</option>
                    <option value="evening">Evening (6-11pm)</option>
                    <option value="weekend">Weekends only</option>
                  </select>
                </div>
                <div>
                  <label className="label">Your Study Goals</label>
                  <textarea value={prefs.goals} onChange={e => setPrefs(prev => ({ ...prev, goals: e.target.value }))}
                    rows={3} placeholder="e.g. Preparing for JEE, learning React, writing thesis..." className="textarea" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowPrefs(false)} className="btn-secondary flex-1 justify-center py-3">Cancel</button>
                  <button onClick={() => { setShowPrefs(false); toast.success('Preferences saved! Finding better matches...') }}
                    className="btn-primary flex-1 justify-center py-3">
                    <Zap className="w-4 h-4" /> Find Matches
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
