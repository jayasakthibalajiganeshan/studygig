'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, Notification, Wallet } from '@/types'

interface AppStore {
  // Auth
  user: Profile | null
  setUser: (user: Profile | null) => void

  // Wallet
  wallet: Wallet | null
  setWallet: (wallet: Wallet | null) => void

  // Notifications
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  markAllRead: () => void
  addNotification: (n: Notification) => void

  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  theme: 'dark' | 'light'
  toggleTheme: () => void

  // Order flow
  orderDraft: Record<string, unknown> | null
  setOrderDraft: (draft: Record<string, unknown> | null) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      wallet: null,
      setWallet: (wallet) => set({ wallet }),

      notifications: [],
      unreadCount: 0,
      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.is_read).length,
        }),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
          unreadCount: 0,
        })),
      addNotification: (n) =>
        set((state) => ({
          notifications: [n, ...state.notifications],
          unreadCount: state.unreadCount + (n.is_read ? 0 : 1),
        })),

      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      orderDraft: null,
      setOrderDraft: (draft) => set({ orderDraft: draft }),
    }),
    {
      name: 'studygig-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
