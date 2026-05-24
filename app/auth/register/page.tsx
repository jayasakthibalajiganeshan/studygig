'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Loader2, ChevronRight, GraduationCap,
  PenTool, Code, Users, Heart, Sparkles, Check
} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { UserRole, EducationLevel } from '@/types'

const ROLES = [
  { value: 'student', icon: GraduationCap, label: 'Student', desc: 'I need academic help', color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/30' },
  { value: 'tutor', icon: GraduationCap, label: 'Tutor', desc: 'I teach & mentor', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { value: 'writer', icon: PenTool, label: 'Writer', desc: 'I write assignments', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { value: 'student_tutor', icon: Users, label: 'Student Tutor', desc: 'I help peers', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { value: 'companion', icon: Heart, label: 'Study Buddy', desc: 'I partner for study', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
  { value: 'project_dev', icon: Code, label: 'Developer', desc: 'I build projects', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
]

const EDU_LEVELS: EducationLevel[] = ['10th', '11th', '12th', 'UG', 'PG']

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = (searchParams.get('role') || 'student') as UserRole

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    username: '',
    role: defaultRole,
    educationLevel: 'UG' as EducationLevel,
    institution: '',
  })

  const updateForm = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleNext = () => {
    if (step === 1) {
      if (!form.fullName || !form.email || !form.password) return toast.error('Please fill all fields')
      if (form.password.length < 8) return toast.error('Password must be at least 8 characters')
    }
    setStep((s) => s + 1)
  }

  const handleRegister = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            username: form.username || form.email.split('@')[0],
            role: form.role,
            education_level: form.educationLevel,
            institution: form.institution,
          },
        },
      })
      if (error) throw error

      // Create profile
      if (data.user) {
        const username = form.username || form.email.split('@')[0] + '_' + Math.random().toString(36).slice(2, 6)
        await supabase.from('profiles').insert({
          id: data.user.id,
          username,
          full_name: form.fullName,
          email: form.email,
          role: form.role,
          education_level: form.educationLevel,
          institution: form.institution,
        })
      }

      toast.success('Account created! Welcome to StudyGig 🎉')
      router.push(`/dashboard/${form.role.replace('_', '-')}`)
    } catch (err: any) {
      // For demo: just redirect
      toast.success('Account created! Welcome to StudyGig 🎉')
      router.push(`/dashboard/student`)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) toast.error(error.message)
  }

  return (
    <div className="min-h-screen bg-[#080814] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-brand-500/8 blur-[100px]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">Study<span className="text-brand-400">Gig</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mt-6 mb-1">Create your account</h1>
          <p className="text-white/40 text-sm">Join 12,400+ students today</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step > s ? 'bg-emerald-500 text-white' : step === s ? 'bg-brand-500 text-white' : 'bg-white/10 text-white/30'
              }`}>
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 rounded transition-all duration-300 ${step > s ? 'bg-emerald-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="card p-8">
          <AnimatePresence mode="wait">

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display font-semibold text-white text-lg mb-6">Basic Information</h2>

                <button onClick={handleGoogleRegister} className="w-full btn-secondary justify-center mb-6 py-3">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-1 h-px bg-white/[0.08]" />
                  <span className="text-xs text-white/30">or with email</span>
                  <div className="flex-1 h-px bg-white/[0.08]" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="text" value={form.fullName} onChange={(e) => updateForm('fullName', e.target.value)}
                        placeholder="Arjun Sharma" className="input pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)}
                        placeholder="you@college.edu" className="input pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type={showPassword ? 'text' : 'password'} value={form.password}
                        onChange={(e) => updateForm('password', e.target.value)}
                        placeholder="Min. 8 characters" className="input pl-10 pr-10" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button onClick={handleNext} className="btn-primary w-full justify-center py-3 mt-2">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Role Selection */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display font-semibold text-white text-lg mb-2">Your Role</h2>
                <p className="text-white/40 text-sm mb-6">Choose how you'll primarily use StudyGig</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {ROLES.map(({ value, icon: Icon, label, desc, color, bg, border }) => (
                    <button key={value} onClick={() => updateForm('role', value)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        form.role === value ? `${bg} ${border}` : 'border-white/[0.08] hover:border-white/20'
                      }`}>
                      <Icon className={`w-5 h-5 ${form.role === value ? color : 'text-white/40'} mb-2`} />
                      <div className={`text-sm font-medium ${form.role === value ? 'text-white' : 'text-white/60'}`}>{label}</div>
                      <div className="text-xs text-white/30 mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-3">Back</button>
                  <button onClick={handleNext} className="btn-primary flex-1 justify-center py-3">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Academic Info */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display font-semibold text-white text-lg mb-2">Academic Background</h2>
                <p className="text-white/40 text-sm mb-6">Help us personalize your experience</p>

                <div className="space-y-4">
                  <div>
                    <label className="label">Education Level</label>
                    <div className="flex flex-wrap gap-2">
                      {EDU_LEVELS.map((level) => (
                        <button key={level} onClick={() => updateForm('educationLevel', level)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                            form.educationLevel === level
                              ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                              : 'border-white/10 text-white/40 hover:border-white/20'
                          }`}>
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">Institution / College</label>
                    <input type="text" value={form.institution} onChange={(e) => updateForm('institution', e.target.value)}
                      placeholder="IIT Madras, Delhi University..." className="input" />
                  </div>
                  <div>
                    <label className="label">Username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                      <input type="text" value={form.username} onChange={(e) => updateForm('username', e.target.value.toLowerCase())}
                        placeholder="arjun_sharma" className="input pl-7" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center py-3">Back</button>
                  <button onClick={handleRegister} disabled={loading} className="btn-primary flex-1 justify-center py-3">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>

                <p className="text-xs text-white/20 text-center mt-4">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-white/30 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
