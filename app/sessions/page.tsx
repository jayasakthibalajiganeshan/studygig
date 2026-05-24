'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Video, MapPin, Star, X, Loader2, CheckCircle, Plus } from 'lucide-react'
import { MOCK_SESSIONS } from '@/lib/mock-data'
import { formatDateTime, formatDate, getStatusColor, cn } from '@/lib/utils'
import { formatPrice } from '@/lib/pricing'
import toast from 'react-hot-toast'
import type { Session } from '@/types'

const SESSION_TABS = ['Upcoming', 'Completed', 'Cancelled']

const CALENDAR_DAYS = Array.from({ length: 35 }, (_, i) => {
  const d = new Date(2024, 6, 1)
  d.setDate(d.getDate() + i - d.getDay())
  return d
})

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState('Upcoming')
  const [showBookModal, setShowBookModal] = useState(false)
  const [showReschedule, setShowReschedule] = useState<Session | null>(null)
  const [showReview, setShowReview] = useState<Session | null>(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [calView, setCalView] = useState(false)
  const [bookForm, setBookForm] = useState({ subject: '', topic: '', date: '', time: '', duration: '60', mode: 'online', tutorId: '' })

  const filtered = MOCK_SESSIONS.filter(s => {
    if (activeTab === 'Upcoming') return ['scheduled','live'].includes(s.status)
    if (activeTab === 'Completed') return s.status === 'completed'
    return s.status === 'cancelled' || s.status === 'missed'
  })

  const handleJoin = (session: Session) => {
    if (session.meet_link) window.open(session.meet_link, '_blank')
    else toast.error('Meeting link not available yet')
  }

  const handleReschedule = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Session rescheduled successfully!')
    setShowReschedule(null)
    setLoading(false)
  }

  const handleReview = async () => {
    if (!rating) return toast.error('Please select a rating')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Review submitted! ⭐')
    setShowReview(null)
    setRating(0)
    setReview('')
    setLoading(false)
  }

  const handleBookSession = async () => {
    if (!bookForm.subject || !bookForm.date) return toast.error('Please fill required fields')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    toast.success('Session booked! 🎉 Check your calendar.')
    setShowBookModal(false)
    setLoading(false)
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Sessions</h1>
          <p className="text-white/40 mt-1">Manage your tutoring and study sessions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCalView(!calView)} className={cn('btn-secondary text-sm', calView && 'border-brand-500/40 text-brand-400')}>
            <Calendar className="w-4 h-4" /> {calView ? 'List View' : 'Calendar'}
          </button>
          <button onClick={() => setShowBookModal(true)} className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Book Session
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Upcoming', value: MOCK_SESSIONS.filter(s => s.status === 'scheduled').length, color: 'text-brand-400' },
          { label: 'Completed', value: MOCK_SESSIONS.filter(s => s.status === 'completed').length, color: 'text-emerald-400' },
          { label: 'Hours Learned', value: '12.5h', color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Calendar view */}
      <AnimatePresence>
        {calView && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="card p-5 overflow-hidden">
            <h3 className="font-display font-semibold text-white mb-4">July 2024</h3>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="text-center text-xs text-white/30 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {CALENDAR_DAYS.map((day, i) => {
                const isToday = day.toDateString() === new Date().toDateString()
                const hasSession = MOCK_SESSIONS.some(s => new Date(s.scheduled_at).toDateString() === day.toDateString())
                const isCurrentMonth = day.getMonth() === 6
                return (
                  <div key={i} className={cn('aspect-square flex flex-col items-center justify-center rounded-xl text-sm cursor-pointer transition-all',
                    isToday ? 'bg-brand-500 text-white' : isCurrentMonth ? 'text-white/70 hover:bg-white/[0.06]' : 'text-white/20')}>
                    {day.getDate()}
                    {hasSession && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08] w-fit">
        {SESSION_TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={cn('px-5 py-2 rounded-lg text-sm font-medium transition-all', activeTab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70')}>
            {t}
          </button>
        ))}
      </div>

      {/* Session cards */}
      <div className="space-y-4">
        {filtered.map((session, i) => (
          <motion.div key={session.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card-hover p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${session.tutor_id}&backgroundColor=b6e3f4`}
                  alt="" className="w-12 h-12 rounded-xl bg-brand-500/20 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{session.title}</h3>
                    <span className={cn('badge text-xs border', getStatusColor(session.status))}>{session.status}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/40">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDateTime(session.scheduled_at)}</span>
                    <span>{session.duration_minutes} minutes</span>
                    <span className="flex items-center gap-1">
                      {session.delivery_mode === 'online' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                      {session.delivery_mode}
                    </span>
                    {session.price && <span className="text-emerald-400">{formatPrice(session.price)}</span>}
                  </div>
                  {session.subject && <div className="mt-1 text-xs text-white/30">{session.subject}{session.topic && ` · ${session.topic}`}</div>}
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {session.status === 'scheduled' && (
                  <>
                    <button onClick={() => handleJoin(session)} className="btn-primary text-xs py-2 px-4">
                      <Video className="w-3.5 h-3.5" /> Join
                    </button>
                    <button onClick={() => setShowReschedule(session)} className="btn-secondary text-xs py-2 px-3">Reschedule</button>
                  </>
                )}
                {session.status === 'completed' && !session.student_rating && (
                  <button onClick={() => setShowReview(session)} className="btn-success text-xs py-2 px-4">
                    <Star className="w-3.5 h-3.5" /> Review
                  </button>
                )}
                {session.student_rating && (
                  <div className="flex items-center gap-1 text-sm text-yellow-400">
                    {'⭐'.repeat(session.student_rating)}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="card p-16 text-center">
            <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="font-semibold text-white mb-2">No sessions {activeTab.toLowerCase()}</h3>
            <p className="text-white/40 text-sm mb-6">Book a session with a tutor to get started</p>
            <button onClick={() => setShowBookModal(true)} className="btn-primary mx-auto">
              <Plus className="w-4 h-4" /> Book Session
            </button>
          </div>
        )}
      </div>

      {/* Book Session Modal */}
      <AnimatePresence>
        {showBookModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="card p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-white text-lg">Book a Session</h2>
                <button onClick={() => setShowBookModal(false)} className="btn-icon p-1.5"><X className="w-4 h-4 text-white/60" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Subject *</label>
                  <input value={bookForm.subject} onChange={e => setBookForm(f => ({ ...f, subject: e.target.value }))} placeholder="Mathematics, Physics..." className="input" />
                </div>
                <div>
                  <label className="label">Topic</label>
                  <input value={bookForm.topic} onChange={e => setBookForm(f => ({ ...f, topic: e.target.value }))} placeholder="Integration, Thermodynamics..." className="input" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Date *</label>
                    <input type="date" value={bookForm.date} onChange={e => setBookForm(f => ({ ...f, date: e.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="label">Time</label>
                    <input type="time" value={bookForm.time} onChange={e => setBookForm(f => ({ ...f, time: e.target.value }))} className="input" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Duration</label>
                    <select value={bookForm.duration} onChange={e => setBookForm(f => ({ ...f, duration: e.target.value }))} className="select">
                      {['30','45','60','90','120'].map(d => <option key={d} value={d}>{d} min</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Mode</label>
                    <select value={bookForm.mode} onChange={e => setBookForm(f => ({ ...f, mode: e.target.value }))} className="select">
                      <option value="online">Online</option>
                      <option value="offline">In Person</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowBookModal(false)} className="btn-secondary flex-1 justify-center py-3">Cancel</button>
                  <button onClick={handleBookSession} disabled={loading} className="btn-primary flex-1 justify-center py-3">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    {loading ? 'Booking...' : 'Book Session'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="card p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-white text-lg">Rate Session</h2>
                <button onClick={() => setShowReview(null)} className="btn-icon p-1.5"><X className="w-4 h-4 text-white/60" /></button>
              </div>
              <div className="text-center mb-5">
                <div className="text-sm text-white/40 mb-3">How was your session?</div>
                <div className="flex justify-center gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setRating(s)} className="text-3xl transition-transform hover:scale-125">
                      {s <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={review} onChange={e => setReview(e.target.value)} rows={3} placeholder="Share your experience..." className="textarea mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setShowReview(null)} className="btn-secondary flex-1 justify-center py-3">Skip</button>
                <button onClick={handleReview} disabled={loading} className="btn-primary flex-1 justify-center py-3">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
