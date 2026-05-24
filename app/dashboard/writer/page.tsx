'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { PenTool, Clock, CheckCircle, DollarSign, FileText, ArrowRight, AlertTriangle, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/lib/pricing'
import { getStatusColor, cn } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const WRITING_ORDERS = [
  { id: 'w1', title: 'Physics Thermodynamics — 5 pages', subject: 'Physics', pages: 5, deadline: '2h left', status: 'in_progress', price: 15, urgency: 'urgent', wordCount: 1250 },
  { id: 'w2', title: 'Marketing Case Study — 8 pages', subject: 'Commerce', pages: 8, deadline: 'Tomorrow', status: 'accepted', price: 24, urgency: 'fast', wordCount: 2000 },
  { id: 'w3', title: 'Research Paper — Quantum Computing', subject: 'Physics', pages: 12, deadline: '3 days', status: 'pending', price: 36, urgency: 'normal', wordCount: 3000 },
  { id: 'w4', title: 'Biology Lab Report — Cell Division', subject: 'Biology', pages: 3, deadline: 'Completed', status: 'completed', price: 9, urgency: 'normal', wordCount: 750 },
]

const EARNINGS_DATA = [
  { week: 'W1', pages: 18, earned: 54 }, { week: 'W2', pages: 32, earned: 96 },
  { week: 'W3', pages: 24, earned: 72 }, { week: 'W4', pages: 45, earned: 135 },
  { week: 'W5', pages: 38, earned: 114 }, { week: 'W6', pages: 55, earned: 165 },
]

const URGENCY_COLORS: Record<string, string> = {
  urgent: 'text-red-400 bg-red-500/10 border-red-500/20',
  fast: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  normal: 'text-white/40 bg-white/5 border-white/10',
}

export default function WriterDashboard() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  const active = WRITING_ORDERS.filter(o => o.status !== 'completed')
  const completed = WRITING_ORDERS.filter(o => o.status === 'completed')
  const displayed = activeTab === 'active' ? active : completed

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Writer Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">Your writing tasks and earnings</p>
        </div>
        <Link href="/demand-board" className="btn-primary text-sm"><PenTool className="w-4 h-4" />Find New Work</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Orders', value: active.length, sub: '1 urgent', icon: FileText, color: 'from-amber-500 to-orange-500' },
          { label: 'Pages Written', value: '214', sub: 'This month', icon: PenTool, color: 'from-brand-500 to-violet-500' },
          { label: 'This Month', value: '₹4,200', sub: 'After platform fee', icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
          { label: 'On-Time Rate', value: '97%', sub: 'Last 30 orders', icon: CheckCircle, color: 'from-blue-500 to-cyan-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-white/40">{s.label}</div>
            <div className="text-xs text-emerald-400 mt-1">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Urgent alert */}
      {active.some(o => o.urgency === 'urgent') && (
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <div className="font-semibold text-red-400 text-sm">Urgent Deadline!</div>
            <div className="text-white/60 text-xs">"Physics Thermodynamics" is due in 2 hours. Complete it first.</div>
          </div>
          <Link href="/orders/w1" className="btn-danger text-xs py-2 px-4 ml-auto">View Now</Link>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08] w-fit">
            {[['active','Active'], ['completed','Completed']].map(([v, l]) => (
              <button key={v} onClick={() => setActiveTab(v as any)}
                className={cn('px-5 py-2 rounded-lg text-sm font-medium transition-all', activeTab === v ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70')}>
                {l}
              </button>
            ))}
          </div>

          {/* Order list */}
          <div className="space-y-3">
            {displayed.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="card-hover p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium text-white text-sm">{order.title}</h3>
                      <span className={cn('badge text-xs border', getStatusColor(order.status))}>{order.status.replace('_',' ')}</span>
                      <span className={cn('badge text-xs border', URGENCY_COLORS[order.urgency])}>{order.urgency}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span>{order.subject}</span>
                      <span>·</span>
                      <span>{order.pages} pages / {order.wordCount.toLocaleString()} words</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-yellow-400"><Clock className="w-3 h-3" />{order.deadline}</span>
                    </div>

                    {order.status === 'in_progress' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-white/30 mb-1"><span>Writing progress</span><span>60%</span></div>
                        <div className="progress-bar h-1.5">
                          <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1 }} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="font-display font-bold text-brand-400">{formatPrice(order.price * 0.75)}</div>
                    <div className="text-xs text-white/30">You receive</div>
                    <Link href={`/orders/${order.id}`} className="btn-secondary text-xs py-1.5 px-3 mt-2 inline-flex">
                      {order.status === 'in_progress' ? 'Submit Work' : 'View'}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Earnings chart */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-white mb-5">Weekly Earnings (₹/page avg)</h2>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={EARNINGS_DATA} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <defs>
                    <linearGradient id="writerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`₹${v}`, '']} />
                  <Area type="monotone" dataKey="earned" stroke="#f59e0b" strokeWidth={2} fill="url(#writerGrad)" name="Earned" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tips sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4">✍️ Pro Writing Tips</h3>
            <div className="space-y-3">
              {[
                { tip: 'Always use headings & sub-headings for clarity', icon: '📝' },
                { tip: 'Cite sources in APA/MLA as requested', icon: '📚' },
                { tip: 'Run Grammarly before submission', icon: '✅' },
                { tip: 'Use Turnitin-safe paraphrasing', icon: '🔒' },
                { tip: 'Deliver 1 day before deadline for buffer', icon: '⏰' },
              ].map(({ tip, icon }) => (
                <div key={tip} className="flex items-start gap-2.5 text-sm">
                  <span className="text-base flex-shrink-0">{icon}</span>
                  <span className="text-white/60 leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-3">📊 This Month</h3>
            <div className="space-y-2">
              {[
                { label: 'Pages Written', value: '214 pages' },
                { label: 'Orders Completed', value: '28' },
                { label: 'Gross Earnings', value: '₹5,600' },
                { label: 'Platform Fee (25%)', value: '₹1,400' },
                { label: 'Net Earnings', value: '₹4,200', highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-white/40">{label}</span>
                  <span className={highlight ? 'text-emerald-400 font-bold' : 'text-white'}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
