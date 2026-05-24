'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Code, Cpu, Globe, Smartphone, Brain, Zap, DollarSign, CheckCircle, Clock, ArrowRight, GitBranch } from 'lucide-react'
import { formatPrice } from '@/lib/pricing'
import { getStatusColor, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const PROJECT_ORDERS = [
  { id: 'p1', title: 'E-Commerce Platform — React + Node.js', type: 'web_dev', complexity: 'advanced', technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'], status: 'in_progress', price: 5500, deadline: '5 days', progress: 65, client: 'Arjun S.' },
  { id: 'p2', title: 'Sentiment Analysis — BERT Model', type: 'ai_ml', complexity: 'expert', technologies: ['Python', 'PyTorch', 'Hugging Face', 'FastAPI'], status: 'accepted', price: 4200, deadline: '10 days', progress: 10, client: 'Priya K.' },
  { id: 'p3', title: 'Smart Home IoT Dashboard', type: 'iot', complexity: 'intermediate', technologies: ['Arduino', 'MQTT', 'React', 'Node.js'], status: 'completed', price: 3200, deadline: 'Done', progress: 100, client: 'Rahul V.' },
]

const TYPE_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
  web_dev: { icon: Globe, color: 'text-blue-400', label: 'Web Dev' },
  ai_ml: { icon: Brain, color: 'text-purple-400', label: 'AI/ML' },
  mobile_app: { icon: Smartphone, color: 'text-green-400', label: 'Mobile App' },
  iot: { icon: Cpu, color: 'text-orange-400', label: 'IoT' },
}

export default function ProjectDashboard() {
  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Project Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">Track your development projects</p>
        </div>
        <Link href="/demand-board" className="btn-primary text-sm"><Code className="w-4 h-4" />Find Projects</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: PROJECT_ORDERS.filter(p => p.status !== 'completed').length, icon: Code, color: 'from-brand-500 to-violet-500' },
          { label: 'Completed', value: PROJECT_ORDERS.filter(p => p.status === 'completed').length, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
          { label: 'Earnings (Month)', value: '₹7,800', icon: DollarSign, color: 'from-amber-500 to-orange-500' },
          { label: 'Technologies', value: '12+', icon: GitBranch, color: 'from-blue-500 to-cyan-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-white/40">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <h2 className="font-display font-semibold text-white">My Projects</h2>
        {PROJECT_ORDERS.map((project, i) => {
          const typeConf = TYPE_CONFIG[project.type] || TYPE_CONFIG.web_dev
          const Icon = typeConf.icon
          return (
            <motion.div key={project.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="card-hover p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-violet-500/20 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className={cn('w-6 h-6', typeConf.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{project.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                        <span className={typeConf.color}>{typeConf.label}</span>
                        <span>·</span>
                        <span className="capitalize">{project.complexity}</span>
                        <span>·</span>
                        <span>Client: {project.client}</span>
                      </div>
                    </div>
                    <span className={cn('badge text-xs border flex-shrink-0', getStatusColor(project.status))}>{project.status.replace('_',' ')}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-300/80 text-xs border border-brand-500/15 font-mono">{t}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1 text-xs text-white/40">
                      <Clock className="w-3 h-3" />{project.deadline}
                    </div>
                    <div className="font-semibold text-brand-400 text-sm">{formatPrice(project.price * 0.75)} net</div>
                  </div>

                  {project.status !== 'completed' && (
                    <div>
                      <div className="flex justify-between text-xs text-white/30 mb-1">
                        <span>Progress</span><span>{project.progress}%</span>
                      </div>
                      <div className="progress-bar h-1.5">
                        <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.2 }} />
                      </div>
                    </div>
                  )}
                  {project.status === 'completed' && (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs"><CheckCircle className="w-3.5 h-3.5" />Delivered & Approved</div>
                  )}
                </div>

                <Link href={`/orders/${project.id}`} className="btn-secondary text-xs py-2 px-3 flex-shrink-0">
                  {project.status === 'in_progress' ? 'Update' : 'View'} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Tech stack used */}
      <div className="card p-5">
        <h2 className="font-display font-semibold text-white mb-4">Your Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {['React', 'Next.js', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'FastAPI', 'PyTorch', 'TensorFlow', 'Arduino', 'MQTT', 'Stripe', 'Docker', 'AWS'].map(tech => (
            <span key={tech} className="px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-300 text-sm border border-brand-500/20 font-mono">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
