"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Award, 
  Activity, 
  Loader2,
  Calendar,
  Share2,
  Eye
} from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CampaignAnalytics {
  campaignId: string;
  totalParticipants: number;
  totalFollowers: number;
  conversionRate: number;
  avgEngagement: number;
  platformBreakdown: Array<{
    platform: string;
    participants: number;
    percentage: number;
  }>;
  dailySignups: Array<{
    date: string;
    participants: number;
  }>;
  status: string;
  completionRate: number;
  totalAmount: number;
  amountPerPerson: number;
  maxParticipants: number;
  createdAt: string;
}

interface CampaignAnalyticsProps {
  campaignId: string;
}

export function CampaignAnalytics({ campaignId }: CampaignAnalyticsProps) {
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCampaignAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // For now, we'll simulate campaign analytics since we don't have a specific endpoint
        // In a real implementation, you'd fetch from `/api/analytics/campaign/${campaignId}`
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data based on campaign ID
        const mockAnalytics: CampaignAnalytics = {
          campaignId,
          totalParticipants: Math.floor(Math.random() * 100) + 10,
          totalFollowers: Math.floor(Math.random() * 80) + 8,
          conversionRate: Math.floor(Math.random() * 30) + 60,
          avgEngagement: Math.floor(Math.random() * 20) + 5,
          platformBreakdown: [
            { platform: "Instagram", participants: Math.floor(Math.random() * 50) + 10, percentage: 45 },
            { platform: "Twitter", participants: Math.floor(Math.random() * 30) + 5, percentage: 30 },
            { platform: "TikTok", participants: Math.floor(Math.random() * 20) + 3, percentage: 15 },
            { platform: "YouTube", participants: Math.floor(Math.random() * 10) + 2, percentage: 10 },
          ],
          dailySignups: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            participants: Math.floor(Math.random() * 10) + 1
          })),
          status: "active",
          completionRate: Math.floor(Math.random() * 40) + 30,
          totalAmount: 50000,
          amountPerPerson: 5000,
          maxParticipants: 10,
          createdAt: new Date().toISOString()
        }
        
        setAnalytics(mockAnalytics)
      } catch (err) {
        console.error("Campaign analytics fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch campaign analytics")
      } finally {
        setLoading(false)
      }
    }

    if (campaignId) {
      fetchCampaignAnalytics()
    }
  }, [campaignId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading campaign analytics...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading analytics</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-gray-600">
              Analytics data will be available once participants start joining the campaign.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Participants</p>
                <p className="text-3xl font-bold">{analytics.totalParticipants}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Users className="w-3 h-3 text-blue-200" />
                  <p className="text-blue-200 text-xs">of {analytics.maxParticipants} max</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold">{analytics.conversionRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="w-3 h-3 text-emerald-200" />
                  <p className="text-emerald-200 text-xs">Follow to participate</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Completion</p>
                <p className="text-3xl font-bold">{analytics.completionRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Award className="w-3 h-3 text-purple-200" />
                  <p className="text-purple-200 text-xs">Campaign progress</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Total Value</p>
                <p className="text-3xl font-bold">₦{analytics.totalAmount.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <DollarSign className="w-3 h-3 text-orange-200" />
                  <p className="text-orange-200 text-xs">₦{analytics.amountPerPerson.toLocaleString()} per person</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Platform Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Platform Performance
            </CardTitle>
            <CardDescription>Participant distribution across social platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.platformBreakdown.map((platform, index) => (
              <div key={platform.platform} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0
                          ? "bg-pink-500"
                          : index === 1
                            ? "bg-blue-500"
                            : index === 2
                              ? "bg-gray-800"
                              : "bg-red-500"
                      }`}
                    />
                    <span className="font-medium">{platform.platform}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{platform.participants}</div>
                    <div className="text-sm text-gray-600">{platform.percentage}%</div>
                  </div>
                </div>
                <Progress value={platform.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Daily Signups */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Daily Signups
            </CardTitle>
            <CardDescription>Participant growth over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.dailySignups.map((day) => (
                <div key={day.date} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div>
                      <div className="font-semibold">{day.participants} New Participants</div>
                      <div className="text-sm text-gray-600">{day.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{day.participants}</div>
                    <div className="text-sm text-gray-600">signups</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Status */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Campaign Status</CardTitle>
          <CardDescription>Current campaign information and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-blue-900">Created</span>
              </div>
              <p className="text-sm text-blue-800">
                {new Date(analytics.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-green-900">Status</span>
              </div>
              <Badge className="capitalize">{analytics.status}</Badge>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-purple-900">Engagement</span>
              </div>
              <p className="text-sm text-purple-800">
                {analytics.avgEngagement}% average engagement rate
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-orange-900">Followers</span>
              </div>
              <p className="text-sm text-orange-800">
                {analytics.totalFollowers} total followers gained
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 