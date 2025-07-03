-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    creator_handle VARCHAR(100) NOT NULL,
    social_platform VARCHAR(50) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    distribution_rule ENUM('count', 'time') NOT NULL,
    time_limit_hours INTEGER,
    status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    campaign_url VARCHAR(500),
    paystack_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    has_followed BOOLEAN DEFAULT FALSE,
    payout_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    payout_reference VARCHAR(255),
    amount_received DECIMAL(10, 2),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    UNIQUE KEY unique_participant_per_campaign (campaign_id, phone_number)
);

-- Create payouts table for tracking individual payments
CREATE TABLE IF NOT EXISTS payouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id VARCHAR(255) NOT NULL,
    participant_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    paystack_transfer_code VARCHAR(255),
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    failure_reason TEXT,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_creator ON campaigns(creator_handle);
CREATE INDEX idx_participants_campaign ON participants(campaign_id);
CREATE INDEX idx_participants_payout_status ON participants(payout_status);
CREATE INDEX idx_payouts_status ON payouts(status);
