'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, LayoutDashboard, ShoppingBag, Star, Wallet,
  Calendar, MessageSquare, Bell, Settings, LogOut, Menu, X,
  TrendingUp, Users, HelpCircle, Zap, Search, ChevronDown,
  Home, Briefcase, Heart, Award, PenTool, Code, Globe, Shield
} from 'lucide-react'
import { useAppStore } from '@/store'
import { MOCK_USER, MOCK_NOTIFICATIONS } from '@/lib/mock-data'
import { getXPProgress, getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { href: '/dashboard/student', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/marketplace', icon: Globe, label: 'Marketplace' },
      { href: '/orders/new', icon: ShoppingBag, label: 'New Order', highlight: true },
      { href: '/demand-board', icon: TrendingUp, label: 'Demand Board' },
    ]
  },
  {
    label: 'My Activity',
    items: [
      { href: '/dashboard/student', icon: Briefcase, label: 'My Orders' },
      { href: '/sessions', icon: Calendar, label: 'Sessions' },
      { href: '/wallet', icon: Wallet, label: 'Wallet' },
      { href: '/social', icon: Users, label: 'Social Feed' },
    ]
  },
  {
    label: 'Earn',
    items: [
      { href: '/skill-market', icon: Star, label: 'Skill Market' },
      { href: '/companion-match', icon: Heart, label: 'Find Companion' },
    ]
  },
  {
    label: 'Account',
    items: [
      { href: '/profile', icon: Award, label: 'My Profile' },
      { href: '/help', icon: HelpCircle, label: 'Help & Support' },
    ]
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, setUser, notifications, setNotifications, unreadCount, sidebarOpen, setSidebarOpen } = useAppStore()

  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Load mock data
    if (!user) setUser(MOCK_USER)
    if (notifications.length === 0) setNotifications(MOCK_NOTIFICATIONS)
  }, [])

  const currentUser = user || MOCK_USER
  const { level, progress } = getXPProgress(currentUser.xp)

  const handleLogout = async () => {
    setUser(null)
    router.push('/')
  }

  return (
    <div className="flex h-screen bg-[#080814] overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        className={cn(
          'fixed lg:relative z-30 lg:z-auto h-full w-[260px] flex flex-col',
          'bg-[#0a0a18] border-r border-white/[0.06]',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">Study<span className="text-brand-400">Gig</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden btn-icon p-1.5">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* User profile */}
        <div className="p-4 border-b border-white/[0.06]">
          <Link href="/profile" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group">
            <div className="relative">
              <img
                src={`https://api.dicebear.com/8.x/notionists/svg?seed=${currentUser.id}&backgroundColor=b6e3f4`}
                alt={currentUser.full_name}
                className="w-9 h-9 rounded-xl bg-brand-500/20"
              />
              {currentUser.is_verified && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a0a18] flex items-center justify-center">
                  <span className="text-[7px]">✓</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm truncate">{currentUser.full_name}</div>
              <div className="text-white/40 text-xs capitalize">{currentUser.role.replace('_', ' ')} · Lv.{level}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60" />
          </Link>

          {/* XP bar */}
          <div className="mt-2 px-2">
            <div className="flex items-center justify-between text-xs text-white/30 mb-1">
              <span>XP: {currentUser.xp.toLocaleString()}</span>
              <span>Lv.{level + 1}</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-2 mb-1.5">
                {section.label}
              </div>
              {section.items.map(({ href, icon: Icon, label, highlight }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
                return (
                  <Link key={href} href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 mb-0.5 relative group',
                      isActive
                        ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.05]',
                      highlight && !isActive && 'border border-dashed border-brand-500/20 text-brand-400/70'
                    )}>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-brand-500/10 rounded-xl"
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                      />
                    )}
                    <Icon className={cn('w-4 h-4 relative z-10', isActive ? 'text-brand-400' : '')} />
                    <span className="relative z-10">{label}</span>
                    {highlight && <Zap className="w-3 h-3 text-brand-400 ml-auto relative z-10" />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Streak badge */}
        {currentUser.study_streak > 0 && (
          <div className="m-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <div>
                <div className="text-sm font-semibold text-white">{currentUser.study_streak} Day Streak!</div>
                <div className="text-xs text-white/40">Keep it up!</div>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t border-white/[0.06]">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-4 sm:px-6 py-3.5 border-b border-white/[0.06] bg-[#080814]/80 backdrop-blur-xl">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn-icon p-2">
            <Menu className="w-4 h-4 text-white/60" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, tutors, skills..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-brand-500/40 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn-icon p-2.5 relative"
              >
                <Bell className="w-4 h-4 text-white/60" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 card shadow-xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                      <span className="font-semibold text-white text-sm">Notifications</span>
                      <span className="badge-brand text-xs">{unreadCount} new</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {MOCK_NOTIFICATIONS.map((n) => (
                        <div key={n.id} className={cn(
                          'p-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer',
                          !n.is_read && 'bg-brand-500/[0.03]'
                        )}>
                          <div className="flex items-start gap-3">
                            <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', !n.is_read ? 'bg-brand-400' : 'bg-transparent')} />
                            <div>
                              <div className="text-sm font-medium text-white">{n.title}</div>
                              <div className="text-xs text-white/40 mt-0.5">{n.message}</div>
                              <div className="text-xs text-white/20 mt-1">
                                {new Date(n.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center">
                      <Link href="/notifications" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                        View all notifications
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings */}
            <Link href="/settings" className="btn-icon p-2.5">
              <Settings className="w-4 h-4 text-white/60" />
            </Link>

            {/* Avatar */}
            <Link href="/profile">
              <img
                src={`https://api.dicebear.com/8.x/notionists/svg?seed=${currentUser.id}&backgroundColor=b6e3f4`}
                alt={currentUser.full_name}
                className="w-8 h-8 rounded-xl bg-brand-500/20 cursor-pointer hover:ring-2 hover:ring-brand-500/50 transition-all"
              />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
