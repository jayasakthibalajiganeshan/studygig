'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, Clock, TrendingUp, Tag, Send, X, Loader2 } from 'lucide-react'
import { MOCK_DEMAND_POSTS } from '@/lib/mock-data'
import { formatPrice, cn, getCategoryIcon, timeAgo } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { DemandPost } from '@/types'

const FILTERS = ['All', 'Urgent', 'Writing', 'Tutor', 'Student Tutor', 'Project', 'Companion', 'Craft']

function PostCard({ post, onPropose }: { post: DemandPost; onPropose: (p: DemandPost) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-hover p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            {post.is_urgent && <span className="badge-danger text-xs">🔥 Urgent</span>}
            <span className="badge bg-white/[0.06] text-white/50 border border-white/[0.08] text-xs">{getCategoryIcon(post.category)} {post.category.replace('_', ' ')}</span>
            {post.education_level && <span className="text-xs text-white/30">{post.education_level}</span>}
          </div>
          <h3 className="font-semibold text-white text-base leading-tight">{post.title}</h3>
        </div>
        <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${post.user_id}&backgroundColor=b6e3f4`} alt="" className="w-9 h-9 rounded-xl bg-brand-500/20 flex-shrink-0" />
      </div>

      <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">{post.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.tags.map(t => (
          <span key={t} className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/40 text-xs border border-white/[0.06]">#{t}</span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-white/40">
          {post.budget_min && <span className="font-semibold text-emerald-400">₹{post.budget_min}–{post.budget_max}</span>}
          {post.deadline && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Due {new Date(post.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>}
          <span>{post.proposals_count} proposals</span>
          <span>{timeAgo(post.created_at)}</span>
        </div>
        <button onClick={() => onPropose(post)} className="btn-primary text-xs py-2 px-4">
          <Send className="w-3.5 h-3.5" /> Propose
        </button>
      </div>
    </motion.div>
  )
}

export default function DemandBoardPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQ, setSearchQ] = useState('')
  const [showPostModal, setShowPostModal] = useState(false)
  const [proposePost, setProposePost] = useState<DemandPost | null>(null)
  const [proposalMsg, setProposalMsg] = useState('')
  const [proposalPrice, setProposalPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [newRequest, setNewRequest] = useState({ title: '', description: '', category: 'writing', subject: '', budget_min: '', budget_max: '', is_urgent: false })

  const filtered = MOCK_DEMAND_POSTS.filter(p => {
    const catMatch = activeFilter === 'All' || (activeFilter === 'Urgent' ? p.is_urgent : p.category === activeFilter.toLowerCase().replace(' ', '_'))
    const searchMatch = !searchQ || p.title.toLowerCase().includes(searchQ.toLowerCase()) || p.description.toLowerCase().includes(searchQ.toLowerCase())
    return catMatch && searchMatch
  })

  const handlePropose = async () => {
    if (!proposalMsg || !proposalPrice) return toast.error('Please fill all fields')
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success('Proposal sent! 🎉')
    setProposePost(null)
    setProposalMsg('')
    setProposalPrice('')
    setSubmitting(false)
  }

  const handlePostRequest = async () => {
    if (!newRequest.title || !newRequest.description) return toast.error('Please fill required fields')
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Request posted to demand board! 🚀')
    setShowPostModal(false)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Demand Board</h1>
          <p className="text-white/40 mt-1">Browse open requests and send proposals</p>
        </div>
        <button onClick={() => setShowPostModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Post Request
        </button>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Open Requests', value: MOCK_DEMAND_POSTS.filter(p => p.is_open).length, color: 'text-brand-400' },
          { label: 'Urgent', value: MOCK_DEMAND_POSTS.filter(p => p.is_urgent).length, color: 'text-red-400' },
          { label: 'Total Proposals', value: MOCK_DEMAND_POSTS.reduce((a, p) => a + p.proposals_count, 0), color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search requests..." className="input pl-10 w-full" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
              activeFilter === f ? 'bg-brand-500 text-white' : 'bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/[0.08]')}>
            {f === 'Urgent' ? '🔥 ' : ''}{f}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.map(post => <PostCard key={post.id} post={post} onPropose={setProposePost} />)}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-white/40">No requests found</p>
          </div>
        )}
      </div>

      {/* Post request modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-white text-lg">Post a Request</h2>
                <button onClick={() => setShowPostModal(false)} className="btn-icon p-1.5"><X className="w-4 h-4 text-white/60" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Title *</label>
                  <input value={newRequest.title} onChange={e => setNewRequest(r => ({ ...r, title: e.target.value }))} placeholder="e.g. Need help in Physics - Thermodynamics" className="input" />
                </div>
                <div>
                  <label className="label">Description *</label>
                  <textarea value={newRequest.description} onChange={e => setNewRequest(r => ({ ...r, description: e.target.value }))} rows={4} placeholder="Describe exactly what you need..." className="textarea" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Category</label>
                    <select value={newRequest.category} onChange={e => setNewRequest(r => ({ ...r, category: e.target.value }))} className="select">
                      {['writing','tutor','student_tutor','companion','project','craft','custom'].map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Subject</label>
                    <input value={newRequest.subject} onChange={e => setNewRequest(r => ({ ...r, subject: e.target.value }))} placeholder="Physics, React..." className="input" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Budget Min (₹)</label>
                    <input type="number" value={newRequest.budget_min} onChange={e => setNewRequest(r => ({ ...r, budget_min: e.target.value }))} placeholder="500" className="input" />
                  </div>
                  <div>
                    <label className="label">Budget Max (₹)</label>
                    <input type="number" value={newRequest.budget_max} onChange={e => setNewRequest(r => ({ ...r, budget_max: e.target.value }))} placeholder="2000" className="input" />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={newRequest.is_urgent} onChange={e => setNewRequest(r => ({ ...r, is_urgent: e.target.checked }))} className="w-4 h-4 accent-brand-500" />
                  <span className="text-sm text-white">🔥 Mark as Urgent</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowPostModal(false)} className="btn-secondary flex-1 justify-center py-3">Cancel</button>
                  <button onClick={handlePostRequest} disabled={submitting} className="btn-primary flex-1 justify-center py-3">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {submitting ? 'Posting...' : 'Post Request'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Propose modal */}
      <AnimatePresence>
        {proposePost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="card p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-white">Send Proposal</h2>
                <button onClick={() => setProposePost(null)} className="btn-icon p-1.5"><X className="w-4 h-4 text-white/60" /></button>
              </div>
              <div className="p-3 bg-white/[0.03] rounded-xl mb-5">
                <div className="text-sm font-medium text-white mb-1">{proposePost.title}</div>
                <div className="text-xs text-white/40">{proposePost.description.slice(0, 100)}...</div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Your Proposal Message</label>
                  <textarea value={proposalMsg} onChange={e => setProposalMsg(e.target.value)} rows={4}
                    placeholder="Explain why you're the best fit, your approach, and timeline..." className="textarea" />
                </div>
                <div>
                  <label className="label">Your Price (₹)</label>
                  <input type="number" value={proposalPrice} onChange={e => setProposalPrice(e.target.value)}
                    placeholder={proposePost.budget_min ? `Budget: ₹${proposePost.budget_min}–${proposePost.budget_max}` : "Enter your price"} className="input" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setProposePost(null)} className="btn-secondary flex-1 justify-center py-3">Cancel</button>
                  <button onClick={handlePropose} disabled={submitting} className="btn-primary flex-1 justify-center py-3">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? 'Sending...' : 'Send Proposal'}
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
