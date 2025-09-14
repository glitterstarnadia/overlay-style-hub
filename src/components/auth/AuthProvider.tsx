import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  hasActiveSubscription: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  checkSubscription: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)

  const checkSubscription = async () => {
    if (!user) {
      setHasActiveSubscription(false)
      return
    }

    try {
      // For testing: Check if user email contains "test" to bypass subscription
      if (user.email?.includes('test') || user.email?.includes('demo')) {
        setHasActiveSubscription(true)
        return
      }

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error checking subscription:', error)
        setHasActiveSubscription(false)
        return
      }

      const isActive = data?.status === 'active' && 
        new Date(data.current_period_end) > new Date()
      
      setHasActiveSubscription(isActive)
    } catch (error) {
      console.error('Error checking subscription:', error)
      setHasActiveSubscription(false)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      checkSubscription()
    }
  }, [user])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setHasActiveSubscription(false)
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    hasActiveSubscription,
    signIn,
    signUp,
    signOut,
    checkSubscription,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}