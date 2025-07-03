import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database abstraction layer for easy switching
export interface DatabaseUser {
  id: string
  email: string
  name: string
  avatar?: string
  handle?: string
  totalCampaigns: number
  totalDistributed: number
  totalParticipants: number
  isVerified: boolean
}

export interface DatabaseCampaign {
  id: string
  title: string
  description?: string
  creatorId: string
  creatorHandle: string
  socialPlatform: string
  totalAmount: number
  maxParticipants: number
  currentParticipants: number
  distributionRule: string
  timeLimitHours?: number
  status: string
  campaignUrl?: string
  paystackReference?: string
  amountPerPerson?: number
  createdAt: string
  updatedAt: string
}

export interface DatabaseParticipant {
  id: string
  campaignId: string
  fullName: string
  phoneNumber: string
  bankName: string
  accountNumber: string
  accountName: string
  hasFollowed: boolean
  payoutStatus: string
  payoutReference?: string
  amountReceived: number
  createdAt: string
}

// Database operations
export const db = {
  // User operations
  async getUser(id: string): Promise<DatabaseUser | null> {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

    if (error || !data) return null

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      handle: data.handle,
      totalCampaigns: data.total_campaigns,
      totalDistributed: data.total_distributed,
      totalParticipants: data.total_participants,
      isVerified: data.is_verified,
    }
  },

  async createUser(
    user: Omit<DatabaseUser, "totalCampaigns" | "totalDistributed" | "totalParticipants" | "isVerified">,
  ): Promise<DatabaseUser | null> {
    const { data, error } = await supabase
      .from("users")
      .insert({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        handle: user.handle,
      })
      .select()
      .single()

    if (error || !data) return null

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      handle: data.handle,
      totalCampaigns: data.total_campaigns,
      totalDistributed: data.total_distributed,
      totalParticipants: data.total_participants,
      isVerified: data.is_verified,
    }
  },

  // Campaign operations
  async getCampaigns(creatorId?: string): Promise<DatabaseCampaign[]> {
    let query = supabase.from("campaigns").select("*")

    if (creatorId) {
      query = query.eq("creator_id", creatorId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error || !data) return []

    return data.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      creatorId: campaign.creator_id,
      creatorHandle: campaign.creator_handle,
      socialPlatform: campaign.social_platform,
      totalAmount: campaign.total_amount,
      maxParticipants: campaign.max_participants,
      currentParticipants: campaign.current_participants,
      distributionRule: campaign.distribution_rule,
      timeLimitHours: campaign.time_limit_hours,
      status: campaign.status,
      campaignUrl: campaign.campaign_url,
      paystackReference: campaign.paystack_reference,
      amountPerPerson: campaign.amount_per_person,
      createdAt: campaign.created_at,
      updatedAt: campaign.updated_at,
    }))
  },

  async getCampaign(id: string): Promise<DatabaseCampaign | null> {
    const { data, error } = await supabase.from("campaigns").select("*").eq("id", id).single()

    if (error || !data) return null

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      creatorId: data.creator_id,
      creatorHandle: data.creator_handle,
      socialPlatform: data.social_platform,
      totalAmount: data.total_amount,
      maxParticipants: data.max_participants,
      currentParticipants: data.current_participants,
      distributionRule: data.distribution_rule,
      timeLimitHours: data.time_limit_hours,
      status: data.status,
      campaignUrl: data.campaign_url,
      paystackReference: data.paystack_reference,
      amountPerPerson: data.amount_per_person,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  },

  async createCampaign(
    campaign: Omit<DatabaseCampaign, "createdAt" | "updatedAt" | "currentParticipants">,
  ): Promise<DatabaseCampaign | null> {
    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        creator_id: campaign.creatorId,
        creator_handle: campaign.creatorHandle,
        social_platform: campaign.socialPlatform,
        total_amount: campaign.totalAmount,
        max_participants: campaign.maxParticipants,
        distribution_rule: campaign.distributionRule,
        time_limit_hours: campaign.timeLimitHours,
        status: campaign.status,
        campaign_url: campaign.campaignUrl,
        paystack_reference: campaign.paystackReference,
        amount_per_person: campaign.amountPerPerson,
      })
      .select()
      .single()

    if (error || !data) return null

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      creatorId: data.creator_id,
      creatorHandle: data.creator_handle,
      socialPlatform: data.social_platform,
      totalAmount: data.total_amount,
      maxParticipants: data.max_participants,
      currentParticipants: data.current_participants,
      distributionRule: data.distribution_rule,
      timeLimitHours: data.time_limit_hours,
      status: data.status,
      campaignUrl: data.campaign_url,
      paystackReference: data.paystack_reference,
      amountPerPerson: data.amount_per_person,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  },

  // Participant operations
  async getParticipants(campaignId: string): Promise<DatabaseParticipant[]> {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false })

    if (error || !data) return []

    return data.map((participant) => ({
      id: participant.id,
      campaignId: participant.campaign_id,
      fullName: participant.full_name,
      phoneNumber: participant.phone_number,
      bankName: participant.bank_name,
      accountNumber: participant.account_number,
      accountName: participant.account_name,
      hasFollowed: participant.has_followed,
      payoutStatus: participant.payout_status,
      payoutReference: participant.payout_reference,
      amountReceived: participant.amount_received,
      createdAt: participant.created_at,
    }))
  },

  async createParticipant(
    participant: Omit<DatabaseParticipant, "id" | "createdAt" | "payoutStatus" | "amountReceived">,
  ): Promise<DatabaseParticipant | null> {
    const { data, error } = await supabase
      .from("participants")
      .insert({
        campaign_id: participant.campaignId,
        full_name: participant.fullName,
        phone_number: participant.phoneNumber,
        bank_name: participant.bankName,
        account_number: participant.accountNumber,
        account_name: participant.accountName,
        has_followed: participant.hasFollowed,
      })
      .select()
      .single()

    if (error || !data) return null

    return {
      id: data.id,
      campaignId: data.campaign_id,
      fullName: data.full_name,
      phoneNumber: data.phone_number,
      bankName: data.bank_name,
      accountNumber: data.account_number,
      accountName: data.account_name,
      hasFollowed: data.has_followed,
      payoutStatus: data.payout_status,
      payoutReference: data.payout_reference,
      amountReceived: data.amount_received,
      createdAt: data.created_at,
    }
  },
}
