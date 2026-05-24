'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Zap, Clock, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { calculatePrice, formatPrice } from '@/lib/pricing'
import { SUBJECTS, EDUCATION_LEVELS, PROJECT_TYPES, TECH_STACK } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { OrderCategory, EducationLevel, ProjectType, Complexity, DeliveryMode } from '@/types'

const CATEGORIES = [
  { value: 'writing', label: 'Writing', icon: '✍️', desc: 'Assignments, essays, reports', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
  { value: 'tutor', label: 'Tutor', icon: '🎓', desc: 'Expert teacher sessions', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
  { value: 'student_tutor', label: 'Student Tutor', icon: '📚', desc: 'Peer learning & doubt solving', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
  { value: 'companion', label: 'Study Companion', icon: '🤝', desc: 'Study partner & accountability', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30' },
  { value: 'project', label: 'Project', icon: '🚀', desc: 'Dev, hardware, science projects', color: 'from-brand-500/20 to-violet-500/20', border: 'border-brand-500/30' },
  { value: 'craft', label: 'Craft Work', icon: '🎨', desc: 'Creative & handmade projects', color: 'from-green-500/20 to-teal-500/20', border: 'border-green-500/30' },
  { value: 'custom', label: 'Custom Request', icon: '⚡', desc: 'Something unique', color: 'from-gray-500/20 to-slate-500/20', border: 'border-gray-500/30' },
]
const URGENCY_OPTIONS = [
  { value: 'normal', label: 'Normal', desc: '7+ days', multiplier: 1.0, color: 'text-white' },
  { value: 'fast', label: 'Fast', desc: '3-6 days', multiplier: 1.35, color: 'text-yellow-400' },
  { value: 'urgent', label: 'Urgent', desc: '1-2 days', multiplier: 1.75, color: 'text-red-400' },
]

export default function NewOrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [form, setForm] = useState({
    category: (searchParams.get('category') || 'writing') as OrderCategory,
    title: '', description: '', subject: '', topic: '',
    educationLevel: 'UG' as EducationLevel,
    pageCount: 5, wordCount: 1250, writingType: 'assignment',
    weeklySessions: 1, preferredTimings: '', deliveryMode: 'online' as DeliveryMode,
    projectType: 'web_dev' as ProjectType, complexity: 'intermediate' as Complexity, teamSize: 1,
    urgency: 'normal' as 'normal' | 'fast' | 'urgent',
    deliveryDays: 7, requirements: '', deadline: '',
    // New writing customization fields
    handwritingStyle: '', penColor: 'Black', paperFormat: 'A4', marginStyle: 'standard',
    diagramSupport: false, requiresPhysicalDelivery: false, deliveryInstructions: '',
  })
  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const pricing = calculatePrice({
    category: form.category, pageCount: form.pageCount,
    weeklySessions: form.weeklySessions, projectType: form.projectType,
    complexity: form.complexity, urgency: form.urgency,
    deliveryDays: form.deliveryDays, teamSize: form.teamSize,
  })

  const toggleTech = (t: string) => setSelectedTechs(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t])

  const handleSubmit = async () => {
    if (!form.title || !form.description) return toast.error('Please fill all required fields')
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    toast.success('Order posted! 🎉 Finding the best match for you...')
    router.push('/dashboard/student')
  }

  const steps = ['Category', 'Details', 'Requirements', 'Confirm']
  const cat = CATEGORIES.find(c => c.value === form.category)

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/student" className="btn-icon p-2"><ArrowLeft className="w-4 h-4 text-white/60" /></Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Place New Order</h1>
          <p className="text-white/40 text-sm">Tell us what you need and we'll find the perfect match</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0',
              step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-brand-500 text-white' : 'bg-white/10 text-white/30')}>
              {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={cn('text-xs hidden sm:block', step === i + 1 ? 'text-white' : 'text-white/30')}>{s}</span>
            {i < steps.length - 1 && <div className={cn('flex-1 h-0.5 rounded', step > i + 1 ? 'bg-emerald-500' : 'bg-white/10')} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">

            {/* Step 1: Category */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6">
                <h2 className="font-display font-semibold text-white text-lg mb-2">What do you need?</h2>
                <p className="text-white/40 text-sm mb-6">Choose the type of service you're looking for</p>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map(c => (
                    <button key={c.value} onClick={() => update('category', c.value)}
                      className={cn('p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02]',
                        form.category === c.value ? `bg-gradient-to-br ${c.color} ${c.border}` : 'border-white/[0.08] hover:border-white/20')}>
                      <span className="text-2xl mb-2 block">{c.icon}</span>
                      <div className={cn('font-semibold text-sm', form.category === c.value ? 'text-white' : 'text-white/70')}>{c.label}</div>
                      <div className="text-xs text-white/40 mt-0.5">{c.desc}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full justify-center mt-6 py-3">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6 space-y-5">
                <div>
                  <h2 className="font-display font-semibold text-white text-lg mb-1">Order Details</h2>
                  <p className="text-white/40 text-sm">The more detail, the better the match</p>
                </div>

                <div>
                  <label className="label">Order Title *</label>
                  <input value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Physics Thermodynamics Assignment - 5 Pages" className="input" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Education Level</label>
                    <select value={form.educationLevel} onChange={e => update('educationLevel', e.target.value)} className="select">
                      {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Subject</label>
                    <select value={form.subject} onChange={e => update('subject', e.target.value)} className="select">
                      <option value="">Select subject</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Specific Topic</label>
                  <input value={form.topic} onChange={e => update('topic', e.target.value)} placeholder="e.g. Thermodynamics, React Hooks, Integration..." className="input" />
                </div>

                {/* Enhanced Writing Category Fields */}
                {form.category === 'writing' && (
                  <div className="space-y-6">
                    {/* Basic Writing Details */}
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-amber-400">📝</span>
                        Basic Details
                      </h4>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="label">Pages</label>
                          <input type="number" min={1} max={200} value={form.pageCount} onChange={e => update('pageCount', +e.target.value)} className="input" />
                        </div>
                        <div>
                          <label className="label">Word Count</label>
                          <input type="number" min={100} value={form.wordCount} onChange={e => update('wordCount', +e.target.value)} className="input" />
                        </div>
                        <div>
                          <label className="label">Writing Type</label>
                          <select value={form.writingType} onChange={e => update('writingType', e.target.value)} className="select">
                            {['assignment','essay','report','research paper','case study','thesis chapter','lab report','notes','practical record'].map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Handwriting Preferences */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20">
                      <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-amber-400">✍️</span>
                        Handwriting Preferences
                      </h4>
                      
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="label">Handwriting Style</label>
                          <select value={form.handwritingStyle || ''} onChange={e => update('handwritingStyle', e.target.value)} className="select">
                            <option value="">No Preference</option>
                            <option value="cursive">Cursive</option>
                            <option value="print">Print</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="elegant">Elegant</option>
                            <option value="technical">Technical</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="label">Pen Color</label>
                          <select value={form.penColor || 'Black'} onChange={e => update('penColor', e.target.value)} className="select">
                            <option value="Black">Black</option>
                            <option value="Blue">Blue</option>
                            <option value="Red">Red</option>
                            <option value="Green">Green</option>
                            <option value="Purple">Purple</option>
                            <option value="Mixed">Mixed Colors</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="label">Paper Format</label>
                          <select value={form.paperFormat || 'A4'} onChange={e => update('paperFormat', e.target.value)} className="select">
                            <option value="A4">A4</option>
                            <option value="A3">A3</option>
                            <option value="Legal">Legal</option>
                            <option value="Letter">Letter</option>
                            <option value="Notebook">Notebook</option>
                            <option value="Record">Practical Record</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="label">Margin Style</label>
                          <select value={form.marginStyle || 'standard'} onChange={e => update('marginStyle', e.target.value)} className="select">
                            <option value="standard">Standard</option>
                            <option value="narrow">Narrow</option>
                            <option value="wide">Wide</option>
                            <option value="none">No Margins</option>
                            <option value="ruled">Ruled Lines</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Requirements */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                      <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-brand-400">⚙️</span>
                        Additional Requirements
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                              📊
                            </div>
                            <div>
                              <div className="font-medium text-white">Diagram Support</div>
                              <div className="text-sm text-white/40">Include diagrams, charts, and illustrations</div>
                            </div>
                          </div>
                          <button
                            onClick={() => update('diagramSupport', !form.diagramSupport)}
                            className={cn(
                              'w-12 h-6 rounded-full transition-colors',
                              form.diagramSupport ? 'bg-brand-500' : 'bg-white/10'
                            )}
                          >
                            <div className={cn(
                              'w-5 h-5 bg-white rounded-full transition-transform',
                              form.diagramSupport ? 'translate-x-6' : 'translate-x-0.5'
                            )} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg border border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                              📦
                            </div>
                            <div>
                              <div className="font-medium text-white">Physical Delivery</div>
                              <div className="text-sm text-white/40">Send/receive physical notebooks</div>
                            </div>
                          </div>
                          <button
                            onClick={() => update('requiresPhysicalDelivery', !form.requiresPhysicalDelivery)}
                            className={cn(
                              'w-12 h-6 rounded-full transition-colors',
                              form.requiresPhysicalDelivery ? 'bg-brand-500' : 'bg-white/10'
                            )}
                          >
                            <div className={cn(
                              'w-5 h-5 bg-white rounded-full transition-transform',
                              form.requiresPhysicalDelivery ? 'translate-x-6' : 'translate-x-0.5'
                            )} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Instructions (for physical delivery) */}
                    {form.requiresPhysicalDelivery && (
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                          <span className="text-emerald-400">📦</span>
                          Physical Delivery Details
                        </h4>
                        
                        <div>
                          <label className="label">Delivery Instructions</label>
                          <textarea
                            value={form.deliveryInstructions || ''}
                            onChange={e => update('deliveryInstructions', e.target.value)}
                            placeholder="Provide details about notebook/record pickup, delivery preferences, special handling requirements..."
                            rows={3}
                            className="textarea"
                          />
                        </div>
                        
                        <div className="mt-3 p-3 bg-emerald-500/10 rounded-lg">
                          <div className="flex items-start gap-2">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs">!</span>
                            </div>
                            <div className="text-sm text-emerald-300">
                              Physical delivery involves shipping your notebook/record to the writer. Additional shipping charges will apply based on distance and courier service.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(form.category === 'tutor' || form.category === 'student_tutor') && (
                  <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <div>
                      <label className="label">Sessions per Week</label>
                      <input type="number" min={1} max={7} value={form.weeklySessions} onChange={e => update('weeklySessions', +e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="label">Mode</label>
                      <select value={form.deliveryMode} onChange={e => update('deliveryMode', e.target.value)} className="select">
                        <option value="online">Online (Google Meet)</option>
                        <option value="offline">In Person</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label">Preferred Timings</label>
                      <input value={form.preferredTimings} onChange={e => update('preferredTimings', e.target.value)} placeholder="e.g. Weekday evenings 6-8pm, Saturday morning" className="input" />
                    </div>
                  </div>
                )}

                {form.category === 'project' && (
                  <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Project Type</label>
                        <select value={form.projectType} onChange={e => update('projectType', e.target.value)} className="select">
                          {PROJECT_TYPES.map(p => <option key={p.value} value={p.value}>{p.icon} {p.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label">Complexity</label>
                        <select value={form.complexity} onChange={e => update('complexity', e.target.value)} className="select">
                          {['beginner','intermediate','advanced','expert'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="label">Technologies / Stack</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {TECH_STACK.map(t => (
                          <button key={t} onClick={() => toggleTech(t)}
                            className={cn('px-3 py-1 rounded-lg text-xs border transition-all',
                              selectedTechs.includes(t) ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'border-white/10 text-white/40 hover:border-white/20')}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary px-6 py-3">Back</button>
                  <button onClick={() => { if(!form.title) return toast.error('Please add a title'); setStep(3) }} className="btn-primary flex-1 justify-center py-3">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Requirements + Urgency */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6 space-y-5">
                <div>
                  <h2 className="font-display font-semibold text-white text-lg mb-1">Requirements & Timeline</h2>
                  <p className="text-white/40 text-sm">Help the provider understand exactly what you need</p>
                </div>

                <div>
                  <label className="label">Detailed Requirements</label>
                  <textarea value={form.requirements} onChange={e => update('requirements', e.target.value)}
                    rows={5} placeholder="Describe everything: specific chapters/topics, formatting preferences, reference styles, examples you want included..." className="textarea" />
                </div>

                <div>
                  <label className="label">Deadline (optional)</label>
                  <input type="datetime-local" value={form.deadline} onChange={e => update('deadline', e.target.value)} className="input" />
                </div>

                <div>
                  <label className="label mb-3 block">Delivery Speed</label>
                  <div className="grid grid-cols-3 gap-3">
                    {URGENCY_OPTIONS.map(u => (
                      <button key={u.value} onClick={() => { update('urgency', u.value); update('deliveryDays', u.value === 'normal' ? 7 : u.value === 'fast' ? 4 : 2) }}
                        className={cn('p-4 rounded-xl border text-center transition-all',
                          form.urgency === u.value ? 'bg-white/[0.08] border-white/30' : 'border-white/[0.08] hover:border-white/20')}>
                        <div className={cn('font-bold text-base', u.color)}>{u.label}</div>
                        <div className="text-xs text-white/40 mt-1">{u.desc}</div>
                        {u.multiplier > 1 && <div className="text-xs text-amber-400 mt-1">+{Math.round((u.multiplier-1)*100)}% fee</div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Description *</label>
                  <textarea value={form.description} onChange={e => update('description', e.target.value)}
                    rows={3} placeholder="Brief summary of what you need..." className="textarea" />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary px-6 py-3">Back</button>
                  <button onClick={() => { if(!form.description) return toast.error('Please add description'); setStep(4) }} className="btn-primary flex-1 justify-center py-3">
                    Review Order <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6 space-y-5">
                <h2 className="font-display font-semibold text-white text-lg mb-1">Order Summary</h2>
                <div className="space-y-3 p-4 bg-white/[0.02] rounded-xl">
                  {[
                    ['Category', cat?.label],
                    ['Title', form.title],
                    ['Subject', form.subject || '—'],
                    ['Topic', form.topic || '—'],
                    ['Education Level', form.educationLevel],
                    ...(form.category === 'writing' ? [['Pages', form.pageCount], ['Writing Type', form.writingType]] : []),
                    ...(form.category === 'tutor' || form.category === 'student_tutor' ? [['Sessions/Week', form.weeklySessions], ['Mode', form.deliveryMode]] : []),
                    ...(form.category === 'project' ? [['Project Type', form.projectType], ['Complexity', form.complexity]] : []),
                    ['Urgency', form.urgency],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="flex items-center justify-between text-sm">
                      <span className="text-white/40">{k}</span>
                      <span className="text-white font-medium capitalize">{String(v)}</span>
                    </div>
                  ))}
                </div>

                {form.requirements && (
                  <div className="p-4 bg-white/[0.02] rounded-xl">
                    <div className="text-xs text-white/40 mb-1">Requirements</div>
                    <div className="text-sm text-white/80 leading-relaxed">{form.requirements}</div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(3)} className="btn-secondary px-6 py-3">Back</button>
                  <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 justify-center py-3">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {submitting ? 'Posting Order...' : 'Post Order'}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Live pricing panel */}
        <div className="space-y-4">
          <div className="card p-5 sticky top-6">
            <h3 className="font-display font-semibold text-white mb-4">💰 Live Pricing</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-white/40">Base price</span><span className="text-white">{formatPrice(pricing.base)}</span></div>
              {pricing.urgencyMultiplier > 1 && (
                <div className="flex justify-between"><span className="text-yellow-400/80">Urgency ({form.urgency})</span><span className="text-yellow-400">×{pricing.urgencyMultiplier}</span></div>
              )}
              {pricing.deliveryFee > 0 && (
                <div className="flex justify-between"><span className="text-white/40">Fast delivery fee</span><span className="text-white">+{formatPrice(pricing.deliveryFee)}</span></div>
              )}
              <div className="h-px bg-white/[0.08] my-2" />
              <div className="flex justify-between text-xs text-white/30">
                <span>Platform fee (25%)</span><span>-{formatPrice(pricing.platformCommission)}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-400">
                <span>Provider receives</span><span>{formatPrice(pricing.sellerAmount)}</span>
              </div>
              <div className="h-px bg-white/[0.08] my-2" />
              <div className="flex justify-between">
                <span className="font-semibold text-white">You Pay</span>
                <motion.span key={pricing.total} initial={{ scale: 1.2, color: '#34d399' }} animate={{ scale: 1, color: '#fff' }} className="font-display text-xl font-bold">{formatPrice(pricing.total)}</motion.span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                <Check className="w-3.5 h-3.5" /> Escrow protected — pay only on delivery
              </div>
            </div>

            {form.urgency === 'urgent' && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 text-red-400 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" /> Urgent orders are prioritized but cost more
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2 text-xs text-white/30">
              <div className="flex items-center gap-2"><Clock className="w-3 h-3" />Delivery in {form.deliveryDays} day{form.deliveryDays !== 1 ? 's' : ''}</div>
              <div className="flex items-center gap-2"><Check className="w-3 h-3" />Free revisions included</div>
              <div className="flex items-center gap-2"><Check className="w-3 h-3" />24/7 support</div>
            </div>
          </div>

          <div className="card p-4">
            <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Category Info</div>
            <div className="text-3xl mb-2">{cat?.icon}</div>
            <div className="font-semibold text-white text-sm">{cat?.label}</div>
            <div className="text-xs text-white/40 mt-1">{cat?.desc}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
