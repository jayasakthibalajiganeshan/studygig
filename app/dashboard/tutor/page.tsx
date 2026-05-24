'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Users, DollarSign, Star, Clock, TrendingUp, Plus, Video, CheckCircle, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/pricing'
import { cn } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const EARNINGS_DATA = [
  { week: 'W1', earned: 3200 }, { week: 'W2', earned: 4800 }, { week: 'W3', earned: 2900 },
  { week: 'W4', earned: 6100 }, { week: 'W5', earned: 5400 }, { week: 'W6', earned: 7200 },
]

const MY_STUDENTS = [
  { name: 'Arjun S.', subject: 'Mathematics', sessions: 8, nextSession: 'Today 6pm', avatar: 'arjun', progress: 75 },
  { name: 'Priya K.', subject: 'Physics', sessions: 5, nextSession: 'Tomorrow 4pm', avatar: 'priya2', progress: 60 },
  { name: 'Rahul M.', subject: 'Chemistry', sessions: 3, nextSession: 'Thu 7pm', avatar: 'rahul2', progress: 40 },
]

const PENDING_SESSIONS = [
  { student: 'Arjun S.', subject: 'Calculus', time: 'Today, 6:00 PM', duration: '60 min', mode: 'Online', link: 'meet.google.com/abc' },
  { student: 'Priya K.', subject: 'Thermodynamics', time: 'Tomorrow, 4:00 PM', duration: '90 min', mode: 'Online', link: 'meet.google.com/xyz' },
]

export default function TutorDashboard() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Tutor Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">Manage sessions and track earnings</p>
        </div>
        <Link href="/sessions" className="btn-primary text-sm"><Plus className="w-4 h-4" />Schedule Session</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: '24', sub: '3 active this week', icon: Users, color: 'from-brand-500 to-violet-500' },
          { label: 'Sessions This Month', value: '38', sub: '+12 vs last month', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
          { label: 'Monthly Earnings', value: '₹18,400', sub: 'After 25% fee', icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
          { label: 'Average Rating', value: '4.9 ⭐', sub: '124 reviews', icon: Star, color: 'from-yellow-500 to-amber-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-white/40 mt-0.5">{s.label}</div>
            <div className="text-xs text-emerald-400 mt-1">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Upcoming sessions */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-white">Upcoming Sessions</h2>
              <Link href="/sessions" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
            <div className="space-y-3">
              {PENDING_SESSIONS.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-brand-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">{s.student} — {s.subject}</div>
                    <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                      <Clock className="w-3 h-3" />{s.time} · {s.duration} · {s.mode}
                    </div>
                  </div>
                  <a href={`https://${s.link}`} target="_blank" className="btn-primary text-xs py-2 px-4">Join</a>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings chart */}
          <div className="card p-5">
            <h2 className="font-display font-semibold text-white mb-5">Weekly Earnings</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={EARNINGS_DATA} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <defs>
                    <linearGradient id="tutorEarn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Earned']} />
                  <Area type="monotone" dataKey="earned" stroke="#10b981" strokeWidth={2} fill="url(#tutorEarn)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* My Students */}
        <div className="card p-5 h-fit">
          <h2 className="font-display font-semibold text-white text-sm mb-4">My Students</h2>
          <div className="space-y-4">
            {MY_STUDENTS.map(student => (
              <div key={student.name} className="space-y-2">
                <div className="flex items-center gap-3">
                  <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${student.avatar}&backgroundColor=b6e3f4`} alt="" className="w-9 h-9 rounded-xl bg-brand-500/20" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{student.name}</div>
                    <div className="text-xs text-white/40">{student.subject} · {student.sessions} sessions</div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/30 mb-1"><span>Progress</span><span>{student.progress}%</span></div>
                  <div className="progress-bar h-1.5">
                    <div className="progress-fill" style={{ width: `${student.progress}%` }} />
                  </div>
                </div>
                <div className="text-xs text-brand-400 flex items-center gap-1"><Clock className="w-3 h-3" />{student.nextSession}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
