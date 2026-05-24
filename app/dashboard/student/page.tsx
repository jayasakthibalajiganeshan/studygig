'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShoppingBag, Wallet, Star, TrendingUp, Zap,
  ArrowRight, Clock, CheckCircle, Plus, BookOpen, Users,
  Flame, ChevronRight
} from 'lucide-react'
import { useAppStore } from '@/store'
import { MOCK_USER, MOCK_ORDERS, MOCK_SESSIONS, MOCK_NOTIFICATIONS } from '@/lib/mock-data'
import { formatPrice, getXPProgress } from '@/lib/pricing'
import { getCategoryIcon, getStatusColor, formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const EARNINGS_DATA = [
  { month: 'Jan', earned: 1200, spent: 800 },
  { month: 'Feb', earned: 2100, spent: 1200 },
  { month: 'Mar', earned: 1800, spent: 600 },
  { month: 'Apr', earned: 3200, spent: 1800 },
  { month: 'May', earned: 2800, spent: 900 },
  { month: 'Jun', earned: 4100, spent: 2100 },
  { month: 'Jul', earned: 3600, spent: 1500 },
]

const QUICK_ACTIONS = [
  { label: 'New Order', icon: Plus, href: '/orders/new', color: 'from-brand-500 to-violet-500', desc: 'Post a request' },
  { label: 'Find Tutor', icon: BookOpen, href: '/marketplace?category=tutor', color: 'from-blue-500 to-cyan-500', desc: 'Book session' },
  { label: 'Demand Board', icon: TrendingUp, href: '/demand-board', color: 'from-amber-500 to-orange-500', desc: 'Browse requests' },
  { label: 'Study Buddy', icon: Users, href: '/companion-match', color: 'from-pink-500 to-rose-500', desc: 'Find partner' },
]

function StatCard({ icon: Icon, label, value, sub, color, href }: any) {
  return (
    <Link href={href || '#'}>
      <motion.div whileHover={{ y: -2 }} className="card-hover p-5 cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-all" />
        </div>
        <div className="font-display text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-white/40 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-emerald-400 mt-1">{sub}</div>}
      </motion.div>
    </Link>
  )
}

export default function StudentDashboard() {
  const { user, setUser, setNotifications } = useAppStore()
  const currentUser = user || MOCK_USER
  useEffect(() => { if (!user) setUser(MOCK_USER); setNotifications(MOCK_NOTIFICATIONS) }, [])
  const { level, progress, nextLevelXP } = getXPProgress(currentUser.xp)
  const activeOrders = MOCK_ORDERS.filter(o => ['pending','accepted','in_progress','review'].includes(o.status))
  const upcomingSession = MOCK_SESSIONS.find(s => s.status === 'scheduled')

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500/20 via-violet-500/10 to-transparent border border-brand-500/20 p-6">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{new Date().getHours() < 12 ? '🌅' : new Date().getHours() < 17 ? '☀️' : '🌙'}</span>
              <span className="text-white/50 text-sm">{new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'}</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">{currentUser.full_name.split(' ')[0]}! 👋</h1>
            <p className="text-white/50 text-sm mt-1">
              You have <span className="text-brand-400 font-semibold">{activeOrders.length} active orders</span>
              {upcomingSession && <> and <span className="text-emerald-400 font-semibold">1 session today</span></>}
            </p>
          </div>
          <div className="bg-white/[0.05] border border-white/[0.1] rounded-2xl p-4 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">{level}</div>
                <div>
                  <div className="text-xs font-semibold text-white">Level {level}</div>
                  <div className="text-[10px] text-white/40">{currentUser.xp.toLocaleString()} XP</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-orange-400">
                <Flame className="w-4 h-4" /><span className="text-sm font-bold">{currentUser.study_streak}</span>
              </div>
            </div>
            <div className="progress-bar">
              <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.2, delay: 0.3 }} />
            </div>
            <div className="text-[10px] text-white/30 mt-1 text-right">{nextLevelXP - currentUser.xp} XP to next level</div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ label, icon: Icon, href, color, desc }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link href={href}>
              <div className="card-hover p-4 text-center cursor-pointer group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-white text-sm">{label}</div>
                <div className="text-white/40 text-xs mt-0.5">{desc}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Active Orders" value={activeOrders.length} sub="2 due this week" color="from-brand-500 to-violet-500" href="/orders" />
        <StatCard icon={CheckCircle} label="Completed" value={currentUser.completed_orders} sub="98% success rate" color="from-emerald-500 to-teal-500" href="/orders" />
        <StatCard icon={Wallet} label="Wallet Balance" value={formatPrice(5200)} sub="+₹2,400 this month" color="from-amber-500 to-orange-500" href="/wallet" />
        <StatCard icon={Star} label="Your Rating" value={`${currentUser.rating} ⭐`} sub={`${currentUser.review_count} reviews`} color="from-yellow-500 to-amber-500" href="/profile" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">Active Orders</h2>
            <Link href="/orders" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          {activeOrders.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <Link href={`/orders/${order.id}`}>
                <div className="card-hover p-5 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-violet-500/20 border border-brand-500/20 flex items-center justify-center text-xl flex-shrink-0">
                      {getCategoryIcon(order.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-medium text-white text-sm truncate">{order.title}</h3>
                        <span className={cn('badge text-xs flex-shrink-0', getStatusColor(order.status))}>{order.status.replace('_',' ')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span>{order.order_number}</span>
                        <span>·</span>
                        <span>{formatPrice(order.total_price)}</span>
                        {order.deadline && <><span>·</span><span className="flex items-center gap-1 text-yellow-400/80"><Clock className="w-3 h-3" />Due {new Date(order.deadline).toLocaleDateString('en-IN',{month:'short',day:'numeric'})}</span></>}
                      </div>
                      {order.status === 'in_progress' && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-white/30 mb-1"><span>Progress</span><span>60%</span></div>
                          <div className="progress-bar h-1.5"><motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1, delay: 0.5 + i * 0.2 }} /></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-white">Earnings & Spending</h3>
              <span className="badge-brand text-xs">Last 7 months</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={EARNINGS_DATA} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <defs>
                    <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} labelStyle={{ color: 'rgba(255,255,255,0.6)' }} formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="earned" stroke="#6366f1" strokeWidth={2} fill="url(#earnGrad)" name="Earned" />
                  <Area type="monotone" dataKey="spent" stroke="#f97316" strokeWidth={2} fill="url(#spendGrad)" name="Spent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {upcomingSession && (
            <div className="card p-5 border-brand-500/20 bg-brand-500/[0.03]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-white text-sm">Next Session</h3>
                <span className="badge-brand text-xs">Today</span>
              </div>
              <div className="font-medium text-white mb-1">{upcomingSession.title}</div>
              <div className="text-sm text-white/50 mb-2">{upcomingSession.subject} · {upcomingSession.duration_minutes}min</div>
              <div className="flex items-center gap-1.5 text-sm text-emerald-400 mb-4">
                <Clock className="w-3.5 h-3.5" />{formatDateTime(upcomingSession.scheduled_at)}
              </div>
              <div className="flex gap-2">
                <a href={upcomingSession.meet_link || '#'} target="_blank" className="btn-primary flex-1 justify-center py-2 text-xs"><Zap className="w-3.5 h-3.5" />Join Now</a>
                <Link href="/sessions" className="btn-secondary flex-1 justify-center py-2 text-xs">Reschedule</Link>
              </div>
            </div>
          )}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {[{icon:'🔥',title:'12 Day Streak',desc:'Keep going!',xp:'+200 XP'},{icon:'⭐',title:'Top Rated',desc:'4.8 avg rating',xp:'+50 XP'},{icon:'🚀',title:'Power User',desc:'25 orders done',xp:'+300 XP'}].map(b => (
                <div key={b.title} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <span className="text-2xl">{b.icon}</span>
                  <div className="flex-1"><div className="text-sm font-medium text-white">{b.title}</div><div className="text-xs text-white/40">{b.desc}</div></div>
                  <span className="text-xs text-emerald-400 font-medium">{b.xp}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white text-sm">Hot Requests</h3>
              <Link href="/demand-board" className="text-xs text-brand-400 hover:text-brand-300">View all</Link>
            </div>
            <div className="space-y-2">
              {[{title:'AI/ML Project - BERT',budget:'₹2000-4000',tag:'🔥 Urgent'},{title:'Physics Thermodynamics',budget:'₹150-300',tag:'⚡ Fast'},{title:'React Tutoring 4 Sessions',budget:'₹2000-3500',tag:'🆕 New'}].map(r => (
                <Link key={r.title} href="/demand-board">
                  <div className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer mb-2">
                    <div className="text-sm text-white font-medium truncate mb-1">{r.title}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">{r.budget}</span>
                      <span className="text-xs text-amber-400">{r.tag}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white text-sm">🏆 Leaderboard</h3>
              <span className="text-xs text-white/30">This week</span>
            </div>
            <div className="space-y-2">
              {[{rank:1,name:'Priya M.',xp:4820,you:false},{rank:2,name:'Rahul V.',xp:4210,you:false},{rank:3,name:'Ananya K.',xp:3890,you:false},{rank:8,name:currentUser.full_name.split(' ')[0]+' (You)',xp:currentUser.xp,you:true}].map(e => (
                <div key={e.rank} className={cn('flex items-center gap-3 p-2.5 rounded-xl', e.you ? 'bg-brand-500/10 border border-brand-500/20' : 'bg-white/[0.02]')}>
                  <span className={cn('text-sm font-bold w-5 text-center', e.rank <= 3 ? 'text-yellow-400' : 'text-white/30')}>{e.rank}</span>
                  <div className="flex-1 text-sm text-white truncate">{e.name}</div>
                  <span className="text-xs text-white/40">{e.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
