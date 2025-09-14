import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import { Loader2, CreditCard, Crown, Check } from 'lucide-react'

export const SubscriptionGate: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { user, signOut, checkSubscription } = useAuth()

  const handleSubscribe = async () => {
    setLoading(true)
    
    try {
      // For now, we'll show a simple message until the edge function is created
      toast({
        title: "Payment Setup Required",
        description: "Please contact support to set up your subscription. The payment system will be configured shortly.",
      })
      
      // You would call your Stripe payment flow here
      // This is a placeholder until the full Stripe integration is complete
      console.log('Subscription flow triggered for user:', user?.email)
      
    } catch (error) {
      console.error('Subscription error:', error)
      toast({
        title: "Subscription Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive"
      })
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ec4899%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <Card className="w-full max-w-lg relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-pink-200 dark:border-purple-700 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Premium Access Required
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
              Subscribe to unlock full access to Nadia ❤️
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              $9.99
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/month</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Full customization features</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Premium styling options</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Advanced color tools</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Export/Import profiles</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Priority support</span>
            </div>
          </div>
          
          <Button 
            onClick={handleSubscribe}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg text-lg py-6"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            <CreditCard className="mr-2 h-5 w-5" />
            Subscribe Now
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={signOut}
              className="flex-1 border-pink-200 text-pink-600 hover:bg-pink-50"
            >
              Sign Out
            </Button>
            <Button 
              variant="outline" 
              onClick={checkSubscription}
              className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              Check Status
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>Secure payment powered by Stripe</p>
            <p>Cancel anytime from your account dashboard</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}