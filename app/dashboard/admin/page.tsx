'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, ShoppingBag, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Ban, Eye, BarChart3, Activity, Shield, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/pricing'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const REVENUE_DATA = [
  { month: 'Jan', revenue: 45000, orders: 120, users: 340 },
  { month: 'Feb', revenue: 68000, orders: 185, users: 520 },
  { month: 'Mar', revenue: 52000, orders: 142, users: 680 },
  { month: 'Apr', revenue: 91000, orders: 248, users: 890 },
  { month: 'May', revenue: 78000, orders: 210, users: 1100 },
  { month: 'Jun', revenue: 124000, orders: 334, users: 1450 },
  { month: 'Jul', revenue: 108000, orders: 290, users: 1800 },
]

const CATEGORY_DATA = [
  { name: 'Writing', value: 32, color: '#f59e0b' },
  { name: 'Tutor', value: 28, color: '#3b82f6' },
  { name: 'Project', value: 22, color: '#6366f1' },
  { name: 'Student Tutor', value: 10, color: '#a855f7' },
  { name: 'Companion', value: 5, color: '#ec4899' },
  { name: 'Craft', value: 3, color: '#10b981' },
]

const RECENT_USERS = [
  { name: 'Priya Menon', email: 'priya@iit.ac.in', role: 'tutor', joined: '2h ago', orders: 12, status: 'active' },
  { name: 'Rahul Verma', email: 'rahul@bits.ac.in', role: 'student', joined: '4h ago', orders: 5, status: 'active' },
  { name: 'Ananya Kumar', email: 'ananya@nit.ac.in', role: 'project_dev', joined: '1d ago', orders: 23, status: 'active' },
  { name: 'Karthik S', email: 'karthik@annauniv.edu', role: 'student_tutor', joined: '2d ago', orders: 8, status: 'flagged' },
]

const FLAGGED_ORDERS = [
  { id: 'SG-2024-001500', title: 'Suspicious order - unusual pattern', user: 'unknown@mail.com', amount: 8000, reason: 'Multiple rapid orders' },
  { id: 'SG-2024-001480', title: 'Dispute raised by buyer', user: 'student@college.in', amount: 2500, reason: 'Work not delivered' },
]

const STATUS_COLOR: Record<string, string> = {
  active: 'text-emerald-400 bg-emerald-500/10',
  flagged: 'text-red-400 bg-red-500/10',
  suspended: 'text-yellow-400 bg-yellow-500/10',
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'orders' | 'payments' | 'fraud'>('overview')

  const STATS = [
    { label: 'Total Users', value: '12,487', sub: '+342 this week', icon: Users, color: 'from-brand-500 to-violet-500' },
    { label: 'Total Orders', value: '8,234', sub: '+89 today', icon: ShoppingBag, color: 'from-emerald-500 to-teal-500' },
    { label: 'Platform Revenue', value: '₹24.8L', sub: '+18% this month', icon: DollarSign, color: 'from-amber-500 to-orange-500' },
    { label: 'Active Disputes', value: '12', sub: '3 urgent', icon: AlertTriangle, color: 'from-red-500 to-rose-500' },
  ]

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/40 mt-1">Platform overview and management</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 text-sm">All systems operational</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-white/40 mt-0.5">{stat.label}</div>
            <div className="text-xs text-emerald-400 mt-1">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08] overflow-x-auto w-fit">
        {[['overview','Overview'],['users','Users'],['orders','Orders'],['payments','Payments'],['fraud','Fraud Detection']].map(([v, l]) => (
          <button key={v} onClick={() => setActiveTab(v as any)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all', activeTab === v ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70')}>
            {v === 'fraud' ? '🛡️ ' : ''}{l}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-5">
            <h3 className="font-display font-semibold text-white mb-5">Revenue & Growth</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="font-display font-semibold text-white mb-5">Orders by Category</h3>
            <div className="h-40 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                    {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {CATEGORY_DATA.map(c => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                    <span className="text-white/60">{c.name}</span>
                  </div>
                  <span className="text-white font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="card p-5">
          <h3 className="font-display font-semibold text-white mb-5">Recent Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-white/30 border-b border-white/[0.06]">
                  <th className="pb-3 pr-4">User</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Joined</th>
                  <th className="pb-3 pr-4">Orders</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {RECENT_USERS.map((u, i) => (
                  <tr key={i} className="text-sm">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${u.name}&backgroundColor=b6e3f4`} alt="" className="w-8 h-8 rounded-lg bg-brand-500/20" />
                        <div>
                          <div className="text-white font-medium">{u.name}</div>
                          <div className="text-white/30 text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-white/60 capitalize">{u.role.replace('_', ' ')}</td>
                    <td className="py-3 pr-4 text-white/40">{u.joined}</td>
                    <td className="py-3 pr-4 text-white">{u.orders}</td>
                    <td className="py-3 pr-4">
                      <span className={cn('px-2 py-1 rounded-lg text-xs font-medium', STATUS_COLOR[u.status])}>{u.status}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <button className="btn-icon p-1.5"><Eye className="w-3.5 h-3.5 text-white/50" /></button>
                        <button className="btn-icon p-1.5 hover:bg-red-500/10"><Ban className="w-3.5 h-3.5 text-red-400/60" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fraud Detection */}
      {activeTab === 'fraud' && (
        <div className="space-y-4">
          <div className="card p-5 border-red-500/20 bg-red-500/[0.03]">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-red-400" />
              <h3 className="font-display font-semibold text-white">Flagged Activity</h3>
              <span className="badge-danger text-xs">{FLAGGED_ORDERS.length} alerts</span>
            </div>
            <div className="space-y-3">
              {FLAGGED_ORDERS.map(order => (
                <div key={order.id} className="p-4 rounded-xl bg-white/[0.02] border border-red-500/20">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span className="font-medium text-white text-sm">{order.title}</span>
                      </div>
                      <div className="text-xs text-white/40">{order.id} · {order.user}</div>
                      <div className="text-xs text-red-400/70 mt-1">Reason: {order.reason}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{formatPrice(order.amount)}</div>
                      <div className="flex gap-2 mt-2">
                        <button className="btn-success text-xs py-1.5 px-3"><CheckCircle className="w-3 h-3" />Clear</button>
                        <button className="btn-danger text-xs py-1.5 px-3"><Ban className="w-3 h-3" />Block</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Suspicious Transactions', value: 3, color: 'text-red-400' },
              { label: 'Flagged Accounts', value: 2, color: 'text-yellow-400' },
              { label: 'Blocked This Month', value: 7, color: 'text-white/40' },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payments */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Escrow', value: '₹8.4L', color: 'text-yellow-400' },
              { label: 'Released Today', value: '₹1.2L', color: 'text-emerald-400' },
              { label: 'Pending Payouts', value: '₹2.1L', color: 'text-brand-400' },
              { label: 'Platform Comm.', value: '₹24.8L', color: 'text-orange-400' },
            ].map(s => (
              <div key={s.label} className="card p-5 text-center">
                <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <h3 className="font-display font-semibold text-white mb-4">Commission Split (25%)</h3>
            <div className="space-y-3">
              {[
                { label: 'Infrastructure & Hosting', percent: 30, color: 'bg-brand-500' },
                { label: 'Payment Processing (Razorpay)', percent: 20, color: 'bg-emerald-500' },
                { label: 'Customer Support', percent: 15, color: 'bg-yellow-500' },
                { label: 'Marketing & Growth', percent: 20, color: 'bg-orange-500' },
                { label: 'Operations & Profit', percent: 15, color: 'bg-violet-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-white/50 mb-1"><span>{item.label}</span><span>{item.percent}%</span></div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
