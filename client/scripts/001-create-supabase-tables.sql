-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    handle TEXT,
    total_campaigns INTEGER DEFAULT 0,
    total_distributed DECIMAL(15, 2) DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES public.users(id) NOT NULL,
    creator_handle TEXT NOT NULL,
    social_platform TEXT NOT NULL CHECK (social_platform IN ('instagram', 'twitter', 'tiktok', 'youtube')),
    total_amount DECIMAL(15, 2) NOT NULL,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    distribution_rule TEXT NOT NULL CHECK (distribution_rule IN ('count', 'time')),
    time_limit_hours INTEGER,
    status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    campaign_url TEXT,
    paystack_reference TEXT,
    amount_per_person DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create participants table
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id TEXT REFERENCES public.campaigns(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_name TEXT NOT NULL,
    has_followed BOOLEAN DEFAULT FALSE,
    payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed')),
    payout_reference TEXT,
    amount_received DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, phone_number)
);

-- Create payouts table
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id TEXT REFERENCES public.campaigns(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    paystack_transfer_code TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    failure_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaigns_creator_id ON public.campaigns(creator_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_participants_campaign_id ON public.participants(campaign_id);
CREATE INDEX IF NOT EXISTS idx_participants_payout_status ON public.participants(payout_status);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts(status);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and update their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Campaigns policies
CREATE POLICY "Anyone can view campaigns" ON public.campaigns
    FOR SELECT USING (true);

CREATE POLICY "Users can create campaigns" ON public.campaigns
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own campaigns" ON public.campaigns
    FOR UPDATE USING (auth.uid() = creator_id);

-- Participants policies
CREATE POLICY "Anyone can view participants" ON public.participants
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert participants" ON public.participants
    FOR INSERT WITH CHECK (true);

-- Payouts policies
CREATE POLICY "Campaign creators can view payouts" ON public.payouts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.campaigns 
            WHERE campaigns.id = payouts.campaign_id 
            AND campaigns.creator_id = auth.uid()
        )
    );
