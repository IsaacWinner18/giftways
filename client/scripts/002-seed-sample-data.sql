-- Insert sample user (this would normally be created through Supabase Auth)
INSERT INTO public.users (
    id, email, name, avatar, handle, total_campaigns, total_distributed, total_participants, is_verified
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'demo@giftways.com',
    'Alex Johnson',
    '/placeholder.svg?height=40&width=40',
    '@alexjohnson',
    12,
    2500000,
    5420,
    true
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    avatar = EXCLUDED.avatar,
    handle = EXCLUDED.handle,
    total_campaigns = EXCLUDED.total_campaigns,
    total_distributed = EXCLUDED.total_distributed,
    total_participants = EXCLUDED.total_participants,
    is_verified = EXCLUDED.is_verified;

-- Insert sample campaigns
INSERT INTO public.campaigns (
    id, title, description, creator_id, creator_handle, social_platform, 
    total_amount, max_participants, current_participants, 
    distribution_rule, status, campaign_url, amount_per_person
) VALUES 
(
    'crypto-drop-x7gh2', 
    'Christmas Giveaway 2024', 
    'Celebrating the festive season with our amazing community!',
    '550e8400-e29b-41d4-a716-446655440000',
    '@cryptoking', 
    'instagram', 
    50000.00, 
    100, 
    67, 
    'count', 
    'active',
    'https://giftways.com/campaign/crypto-drop-x7gh2',
    500.00
),
(
    'new-year-blast-a8k3', 
    'New Year Celebration', 
    'Welcome 2024 with a bang!',
    '550e8400-e29b-41d4-a716-446655440000',
    '@cryptoking', 
    'twitter', 
    25000.00, 
    50, 
    50, 
    'count', 
    'completed',
    'https://giftways.com/campaign/new-year-blast-a8k3',
    500.00
),
(
    'thanksgiving-joy-m9n4', 
    'Thanksgiving Special', 
    'Grateful for our community support',
    '550e8400-e29b-41d4-a716-446655440000',
    '@cryptoking', 
    'tiktok', 
    75000.00, 
    150, 
    0, 
    'time', 
    'pending',
    'https://giftways.com/campaign/thanksgiving-joy-m9n4',
    500.00
);

-- Insert sample participants for the active campaign
INSERT INTO public.participants (
    campaign_id, full_name, phone_number, bank_name, 
    account_number, account_name, has_followed
) VALUES 
('crypto-drop-x7gh2', 'John Doe', '08012345678', 'GTBank', '0123456789', 'John Doe', TRUE),
('crypto-drop-x7gh2', 'Jane Smith', '08087654321', 'Access Bank', '9876543210', 'Jane Smith', TRUE),
('crypto-drop-x7gh2', 'Mike Johnson', '08055555555', 'Zenith Bank', '5555555555', 'Mike Johnson', TRUE),
('crypto-drop-x7gh2', 'Sarah Wilson', '08099999999', 'UBA', '9999999999', 'Sarah Wilson', TRUE),
('crypto-drop-x7gh2', 'David Brown', '08077777777', 'First Bank', '7777777777', 'David Brown', TRUE);
