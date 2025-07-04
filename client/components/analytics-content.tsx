"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, DollarSign, Target, Award, Activity, Loader2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AnalyticsData {
  totalRevenue: number;
  totalParticipants: number;
  conversionRate: number;
  avgCampaignValue: number;
  monthlyGrowth: number;
  topPlatforms: Array<{
    name: string;
    participants: number;
    percentage: number;
  }>;
  recentPerformance: Array<{
    month: string;
    campaigns: number;
    participants: number;
    revenue: number;
  }>;
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
}

export function AnalyticsContent() {
  const { user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id && !user?._id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const userId = user?.id || user?._id
        const response = await fetch(`${API_URL}/analytics/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.success && data.analytics) {
          setAnalyticsData(data.analytics)
        } else {
          throw new Error(data.error || "Failed to fetch analytics")
        }
      } catch (err) {
        console.error("Analytics fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user])

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your campaign performance and audience insights</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading analytics...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your campaign performance and audience insights</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading analytics</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your campaign performance and audience insights</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-gray-600">
              Create your first campaign to start seeing analytics and insights.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your campaign performance and audience insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">₦{analyticsData.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-blue-200" />
                  <p className="text-blue-200 text-xs">+{analyticsData.monthlyGrowth}% this month</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Participants</p>
                <p className="text-3xl font-bold">{analyticsData.totalParticipants.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Users className="w-3 h-3 text-emerald-200" />
                  <p className="text-emerald-200 text-xs">Across all campaigns</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold">{analyticsData.conversionRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="w-3 h-3 text-purple-200" />
                  <p className="text-purple-200 text-xs">Follow to participate</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Avg Campaign Value</p>
                <p className="text-3xl font-bold">₦{analyticsData.avgCampaignValue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Award className="w-3 h-3 text-orange-200" />
                  <p className="text-orange-200 text-xs">Per campaign</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6" />
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
              <BarChart3 className="w-5 h-5" />
              Platform Performance
            </CardTitle>
            <CardDescription>Participant distribution across social platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.topPlatforms.length > 0 ? (
              analyticsData.topPlatforms.map((platform, index) => (
                <div key={platform.name} className="space-y-2">
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
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{platform.participants.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{platform.percentage}%</div>
                    </div>
                  </div>
                  <Progress value={platform.percentage} className="h-2" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No platform data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Monthly Performance
            </CardTitle>
            <CardDescription>Campaign and participant growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentPerformance.length > 0 ? (
                analyticsData.recentPerformance.slice(-3).map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {month.month}
                      </div>
                      <div>
                        <div className="font-semibold">{month.campaigns} Campaigns</div>
                        <div className="text-sm text-gray-600">{month.participants} participants</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">₦{month.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No performance data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Key insights and recommendations for your campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-green-900">Growth Trend</span>
              </div>
              <p className="text-sm text-green-800">
                {analyticsData.monthlyGrowth > 0 
                  ? `Your campaigns are showing consistent growth with a ${analyticsData.monthlyGrowth}% increase this month.`
                  : analyticsData.monthlyGrowth < 0
                    ? `Your campaigns show a ${Math.abs(analyticsData.monthlyGrowth)}% decrease this month. Consider optimizing your strategy.`
                    : "Your campaigns are maintaining steady performance this month."
                }
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-blue-900">Campaign Overview</span>
              </div>
              <p className="text-sm text-blue-800">
                You have {analyticsData.totalCampaigns} total campaigns with {analyticsData.activeCampaigns} currently active and {analyticsData.completedCampaigns} completed.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-purple-900">Engagement</span>
              </div>
              <p className="text-sm text-purple-800">
                {analyticsData.topPlatforms.length > 0 
                  ? `${analyticsData.topPlatforms[0].name} generates the highest engagement at ${analyticsData.topPlatforms[0].percentage}% of total participants.`
                  : "Start creating campaigns to see platform performance insights."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
