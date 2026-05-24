import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: any
  loading: boolean
  setUser: (user: any) => void
  checkSession: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  checkSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    set({
      user: session?.user ?? null,
      loading: false,
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        user: session?.user ?? null,
        loading: false,
      })
    })
  },

  logout: async () => {
    await supabase.auth.signOut()

    set({
      user: null,
    })
  },
}))