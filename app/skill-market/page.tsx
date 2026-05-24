'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Star, Edit2, Trash2, Eye, TrendingUp, Award, X, Loader2, Check, Zap } from 'lucide-react'
import { MOCK_USER } from '@/lib/mock-data'
import { getCategoryIcon, getCategoryColor, SUBJECTS } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/pricing'
import toast from 'react-hot-toast'
import type { OrderCategory, EducationLevel } from '@/types'

const MY_SKILLS = [
  { id: '1', title: 'React & Next.js Full Stack Development', category: 'project' as OrderCategory, subject: 'Computer Science', rate: 2500, rating: 4.8, orders: 12, views: 234, is_available: true, tags: ['React', 'Next.js', 'Node.js'] },
  { id: '2', title: 'Python & Machine Learning Projects', category: 'project' as OrderCategory, subject: 'Computer Science', rate: 3500, rating: 5.0, orders: 7, views: 178, is_available: true, tags: ['Python', 'ML', 'TensorFlow'] },
  { id: '3', title: 'Data Structures & Algorithms Tutoring', category: 'student_tutor' as OrderCategory, subject: 'Computer Science', rate: 250, rating: 4.7, orders: 18, views: 412, is_available: false, tags: ['DSA', 'C++', 'Java'] },
]

const MARKET_SKILLS = [
  { name: 'Priya M.', avatar: 'priya', title: 'English Essay & Report Writing', category: 'writing', rating: 4.9, orders: 78, rate: 3, unit: '/page' },
  { name: 'Rahul V.', avatar: 'rahul', title: 'JEE Mathematics Expert Tutoring', category: 'tutor', rating: 4.8, orders: 45, rate: 800, unit: '/session' },
  { name: 'Karthik S.', avatar: 'karthik', title: 'Organic Chemistry Help & Doubt Solving', category: 'student_tutor', rating: 4.7, orders: 33, rate: 200, unit: '/session' },
  { name: 'Meera R.', avatar: 'meera', title: 'Daily Study Accountability Partner', category: 'companion', rating: 4.9, orders: 22, rate: 150, unit: '/week' },
]

const CATEGORY_OPTIONS: OrderCategory[] = ['writing', 'tutor', 'student_tutor', 'companion', 'project', 'craft', 'custom']

export default function SkillMarketPage() {
  const [activeTab, setActiveTab] = useState<'my' | 'browse'>('my')
  const [showAdd, setShowAdd] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [mySkills, setMySkills] = useState(MY_SKILLS)
  const [newSkill, setNewSkill] = useState({
    title: '', description: '', category: 'project' as OrderCategory,
    subject: '', rate: '', tags: '', education_level: 'UG' as EducationLevel,
  })
  const updateNew = (k: string, v: string) => setNewSkill(s => ({ ...s, [k]: v }))

  const handleAddSkill = async () => {
    if (!newSkill.title || !newSkill.rate) return toast.error('Please fill required fields')
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    const skill = {
      id: String(Date.now()), title: newSkill.title,
      category: newSkill.category, subject: newSkill.subject,
      rate: +newSkill.rate, rating: 0, orders: 0, views: 0, is_available: true,
      tags: newSkill.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    setMySkills(s => [skill, ...s])
    toast.success('Skill listed! 🎉 You\'re now visible in the marketplace.')
    setShowAdd(false)
    setSubmitting(false)
    setNewSkill({ title: '', description: '', category: 'project', subject: '', rate: '', tags: '', education_level: 'UG' })
  }

  const toggleAvailability = (id: string) => {
    setMySkills(skills => skills.map(s => s.id === id ? { ...s, is_available: !s.is_available } : s))
    const skill = mySkills.find(s => s.id === id)
    toast.success(skill?.is_available ? 'Skill set to unavailable' : 'Skill is now live! 🚀')
  }

  const deleteSkill = (id: string) => {
    setMySkills(s => s.filter(sk => sk.id !== id))
    toast.success('Skill removed')
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Skill Marketplace</h1>
          <p className="text-white/40 mt-1">List your skills and start earning</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> List a Skill
        </button>
      </div>

      {/* Stats banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500/20 to-violet-500/10 border border-brand-500/20 p-6">
        <div className="absolute inset-0 mesh-bg opacity-40" />
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Views', value: mySkills.reduce((a, s) => a + s.views, 0), icon: Eye, color: 'text-brand-400' },
            { label: 'Total Orders', value: mySkills.reduce((a, s) => a + s.orders, 0), icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Active Skills', value: mySkills.filter(s => s.is_available).length, icon: Zap, color: 'text-yellow-400' },
            { label: 'Avg Rating', value: (mySkills.reduce((a, s) => a + s.rating, 0) / mySkills.length).toFixed(1), icon: Star, color: 'text-orange-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center">
              <Icon className={cn('w-6 h-6 mx-auto mb-1', color)} />
              <div className="font-display text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-white/40">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08] w-fit">
        {[['my', 'My Skills'], ['browse', 'Browse Market']].map(([v, l]) => (
          <button key={v} onClick={() => setActiveTab(v as any)}
            className={cn('px-5 py-2 rounded-lg text-sm font-medium transition-all', activeTab === v ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70')}>
            {l}
          </button>
        ))}
      </div>

      {/* My Skills */}
      {activeTab === 'my' && (
        <div className="space-y-4">
          {mySkills.length === 0 && (
            <div className="card p-16 text-center">
              <Award className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">No skills listed yet</h3>
              <p className="text-white/40 text-sm mb-6">List your first skill and start earning today</p>
              <button onClick={() => setShowAdd(true)} className="btn-primary mx-auto"><Plus className="w-4 h-4" />List First Skill</button>
            </div>
          )}
          {mySkills.map((skill, i) => (
            <motion.div key={skill.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-violet-500/20 border border-brand-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                    {getCategoryIcon(skill.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">{skill.title}</h3>
                      <span className={cn('badge text-xs', skill.is_available ? 'badge-success' : 'badge bg-white/[0.05] text-white/40 border border-white/[0.08]')}>
                        {skill.is_available ? '● Live' : '○ Paused'}
                      </span>
                    </div>
                    <div className="text-xs text-white/40 mb-2">{skill.subject} · {skill.category.replace('_', ' ')}</div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {skill.tags.map(t => <span key={t} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-white/40 text-xs border border-white/[0.06]">{t}</span>)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{skill.views} views</span>
                      <span>{skill.orders} orders</span>
                      {skill.rating > 0 && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" />{skill.rating}</span>}
                      <span className="text-brand-400 font-semibold">{formatPrice(skill.rate)}{skill.category === 'writing' ? '/page' : skill.category === 'companion' ? '/week' : '/order'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => toggleAvailability(skill.id)} className={cn('text-xs py-2 px-3 rounded-xl border transition-all', skill.is_available ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10')}>
                    {skill.is_available ? 'Pause' : 'Activate'}
                  </button>
                  <button onClick={() => toast('Edit skill coming soon!')} className="btn-icon p-2"><Edit2 className="w-3.5 h-3.5 text-white/50" /></button>
                  <button onClick={() => deleteSkill(skill.id)} className="btn-icon p-2 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5 text-red-400/60 hover:text-red-400" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Browse Market */}
      {activeTab === 'browse' && (
        <div className="grid sm:grid-cols-2 gap-5">
          {MARKET_SKILLS.map((skill, i) => (
            <motion.div key={skill.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="card-hover p-5 cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <img src={`https://api.dicebear.com/8.x/notionists/svg?seed=${skill.avatar}&backgroundColor=b6e3f4`}
                  alt="" className="w-12 h-12 rounded-xl bg-brand-500/20" />
                <div>
                  <div className="font-semibold text-white text-sm">{skill.name}</div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white">{skill.rating}</span>
                    <span className="text-white/30">({skill.orders} orders)</span>
                  </div>
                </div>
                <span className="ml-auto text-xl">{getCategoryIcon(skill.category)}</span>
              </div>
              <h3 className="font-medium text-white text-sm mb-3 leading-snug">{skill.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/30">Starting at</span>
                <span className="font-display font-bold text-brand-400">₹{skill.rate.toLocaleString()}<span className="text-xs font-normal text-white/40">{skill.unit}</span></span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-white text-lg">List New Skill</h2>
                <button onClick={() => setShowAdd(false)} className="btn-icon p-1.5"><X className="w-4 h-4 text-white/60" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Skill Title *</label>
                  <input value={newSkill.title} onChange={e => updateNew('title', e.target.value)} placeholder="e.g. Expert Python & ML Project Development" className="input" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Category</label>
                    <select value={newSkill.category} onChange={e => updateNew('category', e.target.value)} className="select">
                      {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{getCategoryIcon(c)} {c.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Subject Area</label>
                    <select value={newSkill.subject} onChange={e => updateNew('subject', e.target.value)} className="select">
                      <option value="">Select...</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea value={newSkill.description} onChange={e => updateNew('description', e.target.value)}
                    rows={3} placeholder="Describe your expertise, what you offer, and why students should choose you..." className="textarea" />
                </div>
                <div>
                  <label className="label">Rate (₹) *</label>
                  <input type="number" value={newSkill.rate} onChange={e => updateNew('rate', e.target.value)} placeholder="e.g. 2500 for a project, 800 for tutoring" className="input" />
                  <p className="text-xs text-white/30 mt-1">Platform commission: 25% · You receive: {newSkill.rate ? formatPrice(+newSkill.rate * 0.75) : '₹0'}</p>
                </div>
                <div>
                  <label className="label">Tags (comma-separated)</label>
                  <input value={newSkill.tags} onChange={e => updateNew('tags', e.target.value)} placeholder="React, Node.js, MongoDB, REST API" className="input" />
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-1"><Check className="w-4 h-4" />Your Skill Will Be Visible In:</div>
                  <ul className="text-xs text-emerald-400/70 space-y-0.5 ml-6 list-disc">
                    <li>Public marketplace</li>
                    <li>Search results matching your subjects</li>
                    <li>Demand board proposals (you can respond to requests)</li>
                  </ul>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1 justify-center py-3">Cancel</button>
                  <button onClick={handleAddSkill} disabled={submitting} className="btn-primary flex-1 justify-center py-3">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {submitting ? 'Listing...' : 'List Skill'}
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
