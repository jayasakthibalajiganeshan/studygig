'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Share2,
  Edit2,
  CheckCircle,
  Flame,
  BookOpen,
  Code,
} from 'lucide-react'

import { MOCK_USER } from '@/lib/mock-data'
import { getXPProgress, cn } from '@/lib/utils'

import toast from 'react-hot-toast'

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

const BADGES = [
  {
    icon: '🔥',
    name: '12 Day Streak',
    desc: 'Study consistency',
    earned: true,
  },
  {
    icon: '⭐',
    name: 'Top Rated',
    desc: '4.8+ average rating',
    earned: true,
  },
  {
    icon: '🚀',
    name: 'Power User',
    desc: '25+ completed orders',
    earned: true,
  },
]

const SKILLS_DECLARED = [
  {
    name: 'React & Next.js',
    level: 'Advanced',
    endorsed: 12,
  },
  {
    name: 'Python / ML',
    level: 'Advanced',
    endorsed: 8,
  },
  {
    name: 'Data Structures',
    level: 'Expert',
    endorsed: 15,
  },
]

export default function ProfilePage() {
  const user = MOCK_USER

  const { level, progress, nextLevelXP } = getXPProgress(
    user.xp || 2400
  )

  const [editing, setEditing] = useState(false)

  const [bio, setBio] = useState(
    user.bio ||
      'Passionate student developer helping others in projects, tutoring, and academic growth.'
  )

  const handleSaveBio = () => {
    setEditing(false)
    toast.success('Profile updated!')
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">

      {/* HEADER */}

      <div className="card overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f1e]">

        <div className="h-32 bg-gradient-to-br from-indigo-500/40 via-violet-500/30 to-pink-500/20 relative">
          <div className="absolute inset-0 mesh-bg" />
        </div>

        <div className="px-6 pb-6">

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10 mb-5">

            <div className="relative">

              <img
                src={`https://api.dicebear.com/8.x/notionists/svg?seed=${user.id}`}
                alt={user.full_name}
                className="w-20 h-20 rounded-2xl bg-indigo-500/20 border-4 border-[#0f0f1e]"
              />

              {user.is_verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0f0f1e] flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              )}

            </div>

            <div className="flex-1">

              <div className="flex items-center gap-2 flex-wrap">

                <h1 className="text-2xl font-bold text-white">
                  {user.full_name}
                </h1>

                <span className="badge-brand text-xs px-2 py-1 rounded-lg">
                  Lv.{level}
                </span>

              </div>

              <div className="text-white/40 text-sm">
                @{user.username} · {user.role}
              </div>

            </div>

            <div className="flex gap-2">

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Profile link copied!')
                }}
                className="btn-secondary"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setEditing(!editing)}
                className="btn-primary"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>

            </div>

          </div>

          {/* BIO */}

          {editing ? (
            <div className="mb-4">

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="textarea w-full mb-2"
              />

              <div className="flex gap-2">

                <button
                  onClick={() => setEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveBio}
                  className="btn-primary"
                >
                  Save
                </button>

              </div>

            </div>
          ) : (
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              {bio}
            </p>
          )}

          {/* STATS */}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            {[
              {
                label: 'Rating',
                value: `${user.rating || 4.8} ⭐`,
              },
              {
                label: 'Orders',
                value: user.completed_orders || 24,
              },
              {
                label: 'Followers',
                value: user.followers_count || 120,
              },
              {
                label: 'Earned',
                value: formatPrice(user.total_earnings || 18500),
              },
            ].map((s) => (

              <div
                key={s.label}
                className="p-3 rounded-xl bg-white/5 text-center"
              >
                <div className="font-bold text-white">
                  {s.value}
                </div>

                <div className="text-xs text-white/40">
                  {s.label}
                </div>
              </div>

            ))}

          </div>

          {/* XP */}

          <div className="mt-4">

            <div className="flex items-center justify-between text-xs text-white/40 mb-1">

              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                {user.study_streak || 12} day streak
              </span>

              <span>
                Next level at {nextLevelXP} XP
              </span>

            </div>

            <div className="progress-bar">

              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />

            </div>

          </div>

        </div>
      </div>

      {/* GRID */}

      <div className="grid sm:grid-cols-2 gap-6">

        {/* SKILLS */}

        <div className="card p-5 rounded-2xl border border-white/10 bg-[#0f0f1e]">

          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-400" />
            Skills
          </h3>

          <div className="space-y-3">

            {SKILLS_DECLARED.map((skill) => (

              <div
                key={skill.name}
                className="flex items-center justify-between"
              >

                <div>
                  <div className="text-sm font-medium text-white">
                    {skill.name}
                  </div>

                  <div className="text-xs text-white/40">
                    {skill.level}
                  </div>
                </div>

                <div className="text-xs text-indigo-400">
                  {skill.endorsed} endorsed
                </div>

              </div>

            ))}

          </div>

        </div>

        {/* INFO */}

        <div className="card p-5 rounded-2xl border border-white/10 bg-[#0f0f1e]">

          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Academic Info
          </h3>

          <div className="space-y-3 text-sm">

            {[
              {
                label: 'Institution',
                value: user.institution || 'StudyGig University',
              },
              {
                label: 'Education',
                value: user.education_level || 'UG',
              },
              {
                label: 'City',
                value: user.city || 'Coimbatore',
              },
            ].map((item) => (

              <div
                key={item.label}
                className="flex items-center justify-between"
              >

                <span className="text-white/40">
                  {item.label}
                </span>

                <span className="text-white">
                  {item.value}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* BADGES */}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

        {BADGES.map((badge) => (

          <div
            key={badge.name}
            className={cn(
              'card p-5 text-center rounded-2xl border border-white/10 bg-[#0f0f1e]',
              !badge.earned && 'opacity-40 grayscale'
            )}
          >

            <div className="text-4xl mb-3">
              {badge.icon}
            </div>

            <div className="font-semibold text-white text-sm">
              {badge.name}
            </div>

            <div className="text-xs text-white/40 mt-1">
              {badge.desc}
            </div>

          </div>

        ))}

      </div>

    </div>
  )
}