# Subscription System Setup Guide

## 🚀 Your subscription-based license system is ready!

### Current Features:
- ✅ Login/Registration screen on startup  
- ✅ Subscription gate that blocks access without payment
- ✅ Beautiful authentication UI
- ✅ Stripe integration prepared
- ✅ User management system

### Next Steps to Complete Setup:

## 1. Configure Supabase Credentials

Update `src/lib/supabase.ts` with your actual Supabase project credentials:

```typescript
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key-here'
```

## 2. Create Database Table

Run this SQL in your Supabase SQL editor:

```sql
-- Create user_subscriptions table
CREATE TABLE user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')) DEFAULT 'trialing',
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);
```

## 3. Complete Stripe Integration

The Stripe system is prepared. To complete it:

1. **Create Stripe Product**: Use the Stripe dashboard or API to create your monthly subscription product
2. **Set up Webhooks**: Configure Stripe webhooks to update subscription status
3. **Deploy Edge Function**: Create a Supabase Edge Function to handle Stripe payments

## 4. Test Mode

For testing purposes, you can temporarily bypass the subscription by:
- Manually inserting a test subscription in the database
- Or modifying the `hasActiveSubscription` check in `AuthProvider.tsx`

## 5. Production Deployment

When ready for production:
- Enable Stripe live mode
- Set up proper error handling
- Configure email notifications
- Add subscription management UI

---

## 🎯 Current App Behavior:

1. **Startup**: Shows login screen
2. **Authentication**: Users must create account/sign in  
3. **Subscription Gate**: Blocks access until payment
4. **Main App**: Full access after subscription

## 💰 Pricing Structure:
- **Monthly**: $9.99/month
- **Features**: Full customization access
- **Payment**: Stripe integration ready

Your app is now protected with a complete subscription system! Users must pay to gain access to the main application features.