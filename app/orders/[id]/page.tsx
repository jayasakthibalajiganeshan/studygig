'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, CheckCircle, MessageSquare, Send, AlertTriangle, Download, Star, Loader2, X, Upload } from 'lucide-react'
import Link from 'next/link'
import { MOCK_ORDERS } from '@/lib/mock-data'
import { formatPrice } from '@/lib/pricing'
import { getStatusColor, getCategoryIcon, formatDateTime, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const ORDER_TIMELINE = [
  { label: 'Order Placed', time: '2 days ago', done: true },
  { label: 'Payment Confirmed', time: '2 days ago', done: true },
  { label: 'Provider Accepted', time: '1 day ago', done: true },
  { label: 'Work In Progress', time: '12 hours ago', done: true, active: true },
  { label: 'Delivery', time: 'Expected tomorrow', done: false },
  { label: 'Review & Complete', time: '—', done: false },
]

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { from: 'seller', text: 'Hi! I\'ve started working on your assignment. I\'ll cover the Carnot cycle with detailed diagrams and calculations.', time: '1 day ago' },
    { from: 'buyer', text: 'Great! Please make sure to include the efficiency calculations for real vs ideal cycles.', time: '1 day ago' },
    { from: 'seller', text: 'Absolutely! I\'m about 60% done. Will deliver well before the deadline.', time: '10 hours ago' },
  ])
  const [loading, setLoading] = useState(false)
  const [showDispute, setShowDispute] = useState(false)
  const [disputeReason, setDisputeReason] = useState('')

  const order = MOCK_ORDERS.find(o => o.id === params.id) || MOCK_ORDERS[0]

  const sendMessage = () => {
    if (!message.trim()) return
    setMessages(m => [...m, { from: 'buyer', text: message, time: 'Just now' }])
    setMessage('')
    setTimeout(() => {
      setMessages(m => [...m, { from: 'seller', text: 'Got it! I\'ll take that into account. 👍', time: 'Just now' }])
    }, 1500)
  }

  const handleApprove = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    toast.success('Order approved! Payment released to provider. 🎉')
    router.push('/dashboard/student')
  }

  const handleDispute = async () => {
    if (!disputeReason.trim()) return toast.error('Please describe the issue')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    toast('Dispute raised. Our team will review within 24 hours.', { icon: '⚖️' })
    setShowDispute(false)
    setLoading(false)
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/student" className="btn-icon p-2"><ArrowLeft className="w-4 h-4 text-white/60" /></Link>
        <div>
          <h1 className="font-display text-xl font-bold text-white">{order.title}</h1>
          <div className="flex items-center gap-2 text-sm text-white/40">
            <span>{order.order_number}</span>
            <span>·</span>
            <span className={cn('badge text-xs border', getStatusColor(order.status))}>{order.status.replace('_',' ')}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Timeline */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-white mb-5">Order Progress</h2>
            <div className="space-y-4">
              {ORDER_TIMELINE.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                      step.done ? (step.active ? 'bg-brand-500 ring-4 ring-brand-500/20' : 'bg-emerald-500') : 'bg-white/10')}>
                      {step.done ? <CheckCircle className="w-4 h-4 text-white" /> : <div className="w-2 h-2 rounded-full bg-white/30" />}
                    </div>
                    {i < ORDER_TIMELINE.length - 1 && (
                      <div className={cn('w-0.5 h-8 mt-1', step.done ? 'bg-emerald-500/40' : 'bg-white/10')} />
                    )}
                  </div>
                  <div className="pt-0.5">
                    <div className={cn('font-medium text-sm', step.done ? 'text-white' : 'text-white/40')}>{step.label}</div>
                    <div className="text-xs text-white/30 mt-0.5">{step.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {order.status === 'review' && (
              <div className="flex gap-3 mt-5 pt-5 border-t border-white/[0.06]">
                <button onClick={handleApprove} disabled={loading} className="btn-primary flex-1 justify-center py-2.5">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Approve & Release Payment
                </button>
                <button onClick={() => setShowDispute(true)} className="btn-danger py-2.5 px-4">
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-400" /> Messages
            </h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className={cn('flex', msg.from === 'buyer' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                    msg.from === 'buyer' ? 'bg-brand-500 text-white rounded-tr-sm' : 'bg-white/[0.06] text-white/80 rounded-tl-sm')}>
                    {msg.text}
                    <div className={cn('text-xs mt-1', msg.from === 'buyer' ? 'text-white/60' : 'text-white/30')}>{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..." className="input flex-1 text-sm" />
              <button onClick={sendMessage} className="btn-primary p-3"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-display font-semibold text-white mb-4">Order Details</h3>
            <div className="space-y-3 text-sm">
              {[
                ['Category', getCategoryIcon(order.category) + ' ' + order.category.replace('_',' ')],
                ['Subject', order.subject || '—'],
                ['Topic', order.topic || '—'],
                ['Education', order.education_level || '—'],
                ...(order.page_count ? [['Pages', order.page_count]] : []),
                ...(order.weekly_sessions ? [['Sessions/Week', order.weekly_sessions]] : []),
                ['Deadline', order.deadline ? new Date(order.deadline).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'}) : '—'],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between items-start gap-2">
                  <span className="text-white/40 flex-shrink-0">{k}</span>
                  <span className="text-white text-right capitalize">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold text-white mb-4">Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-white/40">Base price</span><span className="text-white">{formatPrice(order.base_price)}</span></div>
              {order.urgency_multiplier > 1 && <div className="flex justify-between"><span className="text-white/40">Urgency</span><span className="text-yellow-400">×{order.urgency_multiplier}</span></div>}
              <div className="flex justify-between"><span className="text-white/40">Platform fee</span><span className="text-white/60">-{formatPrice(order.platform_commission || 0)}</span></div>
              <div className="h-px bg-white/[0.08] my-2" />
              <div className="flex justify-between font-semibold"><span className="text-white">Total Paid</span><span className="text-brand-400 font-display text-lg">{formatPrice(order.total_price)}</span></div>
              <div className="p-2.5 mt-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-400 flex items-center gap-2">
                <span>🔒</span> {formatPrice(order.total_price)} in escrow — released on approval
              </div>
            </div>
          </div>

          <button onClick={() => toast.success('Invoice downloaded!')} className="btn-secondary w-full justify-center py-3">
            <Download className="w-4 h-4" /> Download Invoice
          </button>
        </div>
      </div>

      {/* Dispute modal */}
      {showDispute && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-white text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400" />Raise Dispute</h2>
              <button onClick={() => setShowDispute(false)} className="btn-icon p-1.5"><X className="w-4 h-4 text-white/60" /></button>
            </div>
            <p className="text-white/50 text-sm mb-4">Describe your issue. Our team resolves disputes within 24 hours.</p>
            <textarea value={disputeReason} onChange={e => setDisputeReason(e.target.value)} rows={4}
              placeholder="e.g. Work not matching requirements, plagiarism detected, missed deadline..." className="textarea mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowDispute(false)} className="btn-secondary flex-1 justify-center py-3">Cancel</button>
              <button onClick={handleDispute} disabled={loading} className="btn-danger flex-1 justify-center py-3">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                {loading ? 'Submitting...' : 'Submit Dispute'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
