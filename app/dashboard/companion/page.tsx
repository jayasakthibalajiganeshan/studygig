'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Calendar, Target, Flame, CheckCircle, Clock, Users, Plus, TrendingUp, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const MY_PARTNERS = [
  { name: 'Arjun S.', avatar: 'arjun', subject: 'Maths + CS', since: '3 weeks', streak: 18, checkins: 21, goal: 'JEE Prep', nextSession: 'Today 7pm', online: true },
  { name: 'Priya K.', avatar: 'priya2', subject: 'Physics', since: '1 week', streak: 7, checkins: 7, goal: 'NEET Prep', nextSession: 'Tomorrow 5pm', online: false },
]

const GOALS_TRACKER = [
  { goal: 'Complete 3 chapters of Calculus', done: true, partner: 'Arjun S.' },
  { goal: 'Solve 20 Physics numericals', done: true, partner: 'Priya K.' },
  { goal: 'Revise Organic Chemistry mechanisms', done: false, partner: 'Priya K.' },
  { goal: 'Practice 10 LeetCode problems', done: false, partner: 'Arjun S.' },
  { goal: 'Complete Mock Test #4', done: false, partner: 'Self' },
]

const STREAK_DAYS = [true, true, true, false, true, true, true, true, true, false, false, true, true, true]

export default function CompanionDashboard() {
  const [goals, setGoals] = useState(GOALS_TRACKER)
  const [newGoal, setNewGoal] = useState('')
  const streak = 18

  const toggleGoal = (i: number) => {
    setGoals(gs => gs.map((g, idx) => idx === i ? { ...g, done: !g.done } : g))
    toast.success(goals[i].done ? 'Goal unchecked' : '🎉 Goal completed! +25 XP')
  }

  const addGoal = () => {
    if (!newGoal.trim()) return
    setGoals(gs => [...gs, { goal: newGoal, done: false, partner: 'Self' }])
    setNewGoal('')
    toast.success('Goal added!')
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Study Companion Hub</h1>
          <p className="text-white/40 text-sm mt-0.5">Accountability, goals and study streaks</p>
        </div>
        <Link href="/companion-match" className="btn-primary text-sm"><Plus className="w-4 h-4" />Find Companion</Link>
      </div>

      {/* Streak banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 via-red-500/10 to-transparent border border-orange-500/20 p-6">
        <div className="absolute inset-0 mesh-bg opacity-40" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-4xl">🔥</span>
              <div>
                <h2 className="font-display text-3xl font-bold text-white">{streak} Day Streak!</h2>
                <p className="text-white/50 text-sm">You and your partner are crushing it</p>
              </div>
            </div>
            <div className="flex gap-1.5 mt-3">
              {STREAK_DAYS.map((active, i) => (
                <div key={i} className={cn('w-5 h-5 rounded-sm', active ? 'bg-orange-500' : 'bg-white/10')} />
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-bold text-orange-400">+450 XP</div>
            <div className="text-white/40 text-xs">From streak bonus</div>
            <div className="mt-2 badge bg-orange-500/20 text-orange-300 border border-orange-500/20">🎯 On track for 30d badge!</div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Partners', value: MY_PARTNERS.length, icon: Users, color: 'from-pink-500 to-rose-500' },
          { label: 'Study Streak', value: `${streak}d`, icon: Flame, color: 'from-orange-500 to-red-500' },
          { label: 'Goals Completed', value: goals.filter(g => g.done).length, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
          { label: 'Sessions Done', value: 28, icon: Calendar, color: 'from-brand-500 to-violet-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-4 text-center">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Partners */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white">My Study Partners</h2>
            <Link href="/companion-match" className="text-sm text-brand-400 hover:text-brand-300">Find more</Link>
          </div>
          <div className="space-y-4">
            {MY_PARTNERS.map((partner) => (
              <div key={partner.name} className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative">
                    <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${partner.avatar}&backgroundColor=b6e3f4`}
                      alt="" className="w-10 h-10 rounded-xl bg-brand-500/20" />
                    {partner.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0f0f1e]" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">{partner.name}</div>
                    <div className="text-xs text-white/40">{partner.subject} · Since {partner.since}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 text-sm font-bold flex items-center gap-1">🔥 {partner.streak}d</div>
                    <div className="text-xs text-white/30">{partner.checkins} check-ins</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-400 flex items-center gap-1"><Target className="w-3 h-3" />{partner.goal}</span>
                  <span className="text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" />{partner.nextSession}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => toast.success(`Check-in with ${partner.name}! 🎯`)}
                    className="btn-success flex-1 justify-center py-2 text-xs">✓ Check In</button>
                  <button className="btn-secondary flex-1 justify-center py-2 text-xs">💬 Message</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals tracker */}
        <div className="card p-5">
          <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-400" />
            Today's Goals ({goals.filter(g => g.done).length}/{goals.length})
          </h2>

          <div className="mb-4">
            <div className="progress-bar h-2.5 mb-1">
              <motion.div className="progress-fill" initial={{ width: 0 }}
                animate={{ width: `${(goals.filter(g => g.done).length / goals.length) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }} />
            </div>
            <div className="text-xs text-white/30 text-right">{Math.round((goals.filter(g => g.done).length / goals.length) * 100)}% complete</div>
          </div>

          <div className="space-y-2 mb-4">
            {goals.map((goal, i) => (
              <motion.div key={i} layout className={cn('flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all',
                goal.done ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/[0.02] hover:bg-white/[0.04]')}
                onClick={() => toggleGoal(i)}>
                <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                  goal.done ? 'bg-emerald-500 border-emerald-500' : 'border-white/20')}>
                  {goal.done && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn('text-sm', goal.done ? 'line-through text-white/40' : 'text-white/80')}>{goal.goal}</span>
                  <div className="text-xs text-white/30 mt-0.5">with {goal.partner}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2">
            <input value={newGoal} onChange={e => setNewGoal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addGoal()}
              placeholder="Add new goal..." className="input flex-1 text-sm py-2" />
            <button onClick={addGoal} className="btn-primary py-2 px-4 text-sm">Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}
