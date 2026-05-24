'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, HelpCircle, MessageSquare, X, Send, ChevronDown, ChevronRight, Loader2, CheckCircle, AlertTriangle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const FAQ = [
  { q: 'How does the escrow payment system work?', a: 'When you place an order, your payment is held securely in escrow by StudyGig. The money is only released to the service provider after you confirm satisfactory delivery. This protects both buyers and sellers.' },
  { q: 'What is the platform commission?', a: 'StudyGig charges a 25% platform fee on all transactions. This covers payment processing, dispute resolution, customer support, and platform maintenance. Providers receive 75% of the order value.' },
  { q: 'How long does delivery take?', a: 'Delivery times vary by order type: Writing orders typically take 2-7 days, tutoring sessions are scheduled at your convenience, and projects range from 7-30 days based on complexity.' },
  { q: 'What if I\'m not satisfied with the work?', a: 'Every order includes free revisions (2-3 depending on the tier). If you\'re still unsatisfied, you can raise a dispute. Our team reviews disputes within 24 hours. Refunds are issued if the work doesn\'t meet agreed requirements.' },
  { q: 'How do I verify my student identity?', a: 'Go to Settings → Verification. Upload your student ID or college email. Verification is reviewed within 24 hours. Verified students get a ✅ badge and higher trust score.' },
  { q: 'Can I use StudyGig for illegal or unethical purposes?', a: 'No. StudyGig strictly prohibits use for exam cheating, plagiarized submissions, or any academic dishonesty. Accounts violating this policy will be permanently banned. Our services are for learning assistance only.' },
  { q: 'How does the companion matching work?', a: 'Our algorithm matches you with compatible study partners based on subjects, goals, schedule, personality type, and education level. You can set your preferences and the system shows compatibility scores for each potential match.' },
  { q: 'How do I withdraw my earnings?', a: 'Go to Wallet → Withdraw. Minimum withdrawal is ₹500. Funds are processed within 1-2 business days via UPI or bank transfer. Make sure your bank details are verified in Settings.' },
]

const TICKET_CATEGORIES = ['Payment Issue', 'Order Problem', 'Session Issue', 'Account Problem', 'Technical Bug', 'Refund Request', 'Safety Concern', 'Other']

const EXISTING_TICKETS = [
  { id: 'TKT-001023', subject: 'Payment not reflecting in wallet', status: 'in_progress', priority: 'high', created: '2 hours ago', lastUpdate: '30 min ago' },
  { id: 'TKT-000987', subject: 'Tutor missed the scheduled session', status: 'resolved', priority: 'medium', created: '3 days ago', lastUpdate: '1 day ago' },
]

export default function HelpPage() {
  const [searchQ, setSearchQ] = useState('')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [showTicket, setShowTicket] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'Hi! 👋 I\'m the StudyGig support assistant. How can I help you today?' },
    { from: 'bot', text: 'You can ask me about orders, payments, sessions, or any other issue.' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [ticket, setTicket] = useState({ subject: '', category: 'Payment Issue', description: '', priority: 'medium', orderId: '' })
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'faq' | 'tickets'>('faq')

  const filteredFAQ = FAQ.filter(f => !searchQ || f.q.toLowerCase().includes(searchQ.toLowerCase()) || f.a.toLowerCase().includes(searchQ.toLowerCase()))

  const handleSubmitTicket = async () => {
    if (!ticket.subject || !ticket.description) return toast.error('Please fill all required fields')
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    toast.success('Ticket submitted! We\'ll respond within 2-4 hours. 📧')
    setShowTicket(false)
    setTicket({ subject: '', category: 'Payment Issue', description: '', priority: 'medium', orderId: '' })
    setSubmitting(false)
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput
    setChatMessages(m => [...m, { from: 'user', text: userMsg }])
    setChatInput('')
    await new Promise(r => setTimeout(r, 1000))
    const responses: Record<string, string> = {
      payment: 'For payment issues, please check your wallet balance and transaction history. If funds are missing, submit a ticket with your transaction ID.',
      order: 'For order issues, go to your active orders and click on the order to view status. You can also message the service provider directly.',
      session: 'For session issues, check your scheduled sessions page. If a tutor missed a session, you can request a rescheduled session or refund.',
      refund: 'Refunds are processed within 5-7 business days. For escrow-held payments, they\'re returned automatically if an order is cancelled within the terms.',
    }
    const matchKey = Object.keys(responses).find(k => userMsg.toLowerCase().includes(k))
    const reply = matchKey ? responses[matchKey] : 'I understand your concern. Let me connect you with a human support agent for this. Please click "Open Ticket" for faster resolution.'
    setChatMessages(m => [...m, { from: 'bot', text: reply }])
  }

  const statusColor: Record<string, string> = {
    open: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    in_progress: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    resolved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    closed: 'text-white/40 bg-white/5 border-white/10',
  }
  const priorityColor: Record<string, string> = {
    low: 'text-white/40', medium: 'text-yellow-400', high: 'text-red-400', urgent: 'text-red-500',
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Help & Support</h1>
        <p className="text-white/40">Find answers or get in touch with our team</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: MessageSquare, label: 'Live Chat', desc: 'Chat with support', color: 'from-brand-500 to-violet-500', action: () => setShowChat(true) },
          { icon: HelpCircle, label: 'Open Ticket', desc: 'Submit a request', color: 'from-orange-500 to-amber-500', action: () => setShowTicket(true) },
          { icon: Zap, label: 'Quick Help', desc: 'FAQ & guides', color: 'from-emerald-500 to-teal-500', action: () => setActiveTab('faq') },
        ].map(({ icon: Icon, label, desc, color, action }) => (
          <button key={label} onClick={action}
            className="card-hover p-5 text-center group">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-semibold text-white text-sm">{label}</div>
            <div className="text-white/40 text-xs mt-0.5">{desc}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search for help topics..." className="input pl-10 w-full" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08] w-fit">
        {[['faq', 'FAQ'], ['tickets', 'My Tickets']].map(([v, l]) => (
          <button key={v} onClick={() => setActiveTab(v as any)}
            className={cn('px-5 py-2 rounded-lg text-sm font-medium transition-all', activeTab === v ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70')}>
            {l}
          </button>
        ))}
      </div>

      {/* FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-3">
          {filteredFAQ.map((item, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-medium text-white pr-4 text-sm">{item.q}</span>
                {openFAQ === i ? <ChevronDown className="w-4 h-4 text-brand-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {openFAQ === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-5 pb-5 text-sm text-white/60 leading-relaxed border-t border-white/[0.06] pt-4">{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {filteredFAQ.length === 0 && (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-white/40">No FAQ found. <button onClick={() => setShowTicket(true)} className="text-brand-400 hover:underline">Open a ticket</button></p>
            </div>
          )}
        </div>
      )}

      {/* Tickets */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowTicket(true)} className="btn-primary text-sm">
              <HelpCircle className="w-4 h-4" /> New Ticket
            </button>
          </div>
          {EXISTING_TICKETS.map(t => (
            <div key={t.id} className="card-hover p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-white/30 font-mono">{t.id}</span>
                    <span className={cn('badge text-xs border', statusColor[t.status])}>{t.status.replace('_', ' ')}</span>
                    <span className={cn('text-xs font-medium', priorityColor[t.priority])}>{t.priority}</span>
                  </div>
                  <h3 className="font-medium text-white text-sm">{t.subject}</h3>
                  <div className="flex gap-3 text-xs text-white/30 mt-1">
                    <span>Created {t.created}</span>
                    <span>·</span>
                    <span>Updated {t.lastUpdate}</span>
                  </div>
                </div>
                <button className="btn-secondary text-xs py-1.5 px-3">View</button>
              </div>
            </div>
          ))}
          {EXISTING_TICKETS.length === 0 && (
            <div className="card p-10 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="text-white/40">No tickets yet. Great!</p>
            </div>
          )}
        </div>
      )}

      {/* Open Ticket Modal */}
      <AnimatePresence>
        {showTicket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-white text-lg">Open Support Ticket</h2>
                <button onClick={() => setShowTicket(false)} className="btn-icon p-1.5"><X className="w-4 h-4 text-white/60" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Subject *</label>
                  <input value={ticket.subject} onChange={e => setTicket(t => ({ ...t, subject: e.target.value }))} placeholder="Brief description of your issue" className="input" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Category</label>
                    <select value={ticket.category} onChange={e => setTicket(t => ({ ...t, category: e.target.value }))} className="select">
                      {TICKET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Priority</label>
                    <select value={ticket.priority} onChange={e => setTicket(t => ({ ...t, priority: e.target.value }))} className="select">
                      {['low', 'medium', 'high', 'urgent'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Order ID (if applicable)</label>
                  <input value={ticket.orderId} onChange={e => setTicket(t => ({ ...t, orderId: e.target.value }))} placeholder="SG-2024-XXXXXX" className="input" />
                </div>
                <div>
                  <label className="label">Detailed Description *</label>
                  <textarea value={ticket.description} onChange={e => setTicket(t => ({ ...t, description: e.target.value }))}
                    rows={5} placeholder="Please describe your issue in detail, including any error messages or steps to reproduce..." className="textarea" />
                </div>
                {ticket.priority === 'urgent' && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-sm text-red-400">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> Urgent tickets are escalated to our senior team within 1 hour
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowTicket(false)} className="btn-secondary flex-1 justify-center py-3">Cancel</button>
                  <button onClick={handleSubmitTicket} disabled={submitting} className="btn-primary flex-1 justify-center py-3">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Chat Widget */}
      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 w-80 z-50">
            <div className="card overflow-hidden shadow-xl">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-500 to-violet-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">🤖</div>
                  <div>
                    <div className="font-semibold text-white text-sm">StudyGig Support</div>
                    <div className="text-white/70 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Online</div>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="text-white/70 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="h-64 overflow-y-auto p-4 space-y-3 bg-[#0a0a18]">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn('flex', msg.from === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed',
                      msg.from === 'user' ? 'bg-brand-500 text-white' : 'bg-white/[0.06] text-white/80')}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/[0.06] flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type your message..." className="input text-sm py-2 flex-1" />
                <button onClick={sendChatMessage} className="btn-primary p-2.5">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
