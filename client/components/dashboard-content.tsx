"use client"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Gift,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  ExternalLink,
  MoreHorizontal,
  Calendar,
  Target,
  Edit,
  Trash2,
  Settings,
} from "lucide-react"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Campaign {
  _id?: string;
  id?: string;
  title: string;
  status: string;
  socialPlatform?: string;
  creatorId: string;
  creatorName: string;
  totalAmount: number;
  currentParticipants: number;
  maxParticipants: number;
  amountPerPerson: number;
  createdAt: string;
  [key: string]: unknown;
}

export function DashboardContent() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    // Fetch real campaigns from API
    const fetchCampaigns = async () => {
      try {
        console.log("API_URL:", API_URL)
        console.log("Fetching campaigns from:", `${API_URL}/campaigns`)
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/campaigns`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Campaigns response:", data)

        if (data.success && data.campaigns) {
          console.log("All campaigns:", data.campaigns)
          console.log("Current user:", user)
          console.log("User ID:", user?.id)
          console.log("User _id:", user?._id)
          
          // Filter to show only user's campaigns (in real app, this would be done on backend)
          const userCampaigns = data.campaigns.filter((campaign: Campaign) => {
            const userIdentifier = user?.id || user?._id || ""
            const matches = campaign.creatorId === userIdentifier || campaign.creatorId === userIdentifier.toString()
            console.log(`Campaign ${campaign.title}: creatorId=${campaign.creatorId}, userIdentifier=${userIdentifier}, matches=${matches}`)
            return matches
          })
          console.log("Filtered user campaigns:", userCampaigns)
          setCampaigns(userCampaigns)
        } else {
          throw new Error(data.error || "Failed to fetch campaigns")
        }
      } catch (error) {
  console.error("Error fetching campaigns:", error)
  if (error instanceof Error) {
    setError(error.message)
  } else {
    setError("An unexpected error occurred")
  }
  setCampaigns([])
} finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchCampaigns()
    } else {
      // If no user, still fetch campaigns to see what's available
      console.log("No user available, fetching all campaigns for debugging")
      fetchCampaigns()
    }
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "bg-pink-100 text-pink-800"
      case "twitter":
        return "bg-blue-100 text-blue-800"
      case "tiktok":
        return "bg-gray-100 text-gray-800"
      case "twitch":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCampaignAction = (action: string, campaignId: string) => {
    switch (action) {
      case "view-details":
        window.location.href = `/campaigns/${campaignId}/details`
        break
      case "edit":
        window.location.href = `/campaigns/${campaignId}/edit`
        break
      case "manage":
        window.location.href = `/campaigns/${campaignId}/manage`
        break
      case "duplicate":
        alert(`Duplicating campaign ${campaignId}`)
        break
      case "delete":
        if (confirm("Are you sure you want to delete this campaign?")) {
          alert(`Deleting campaign ${campaignId}`)
        }
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loading Dashboard... 📊</h1>
            <p className="text-gray-600 mt-1">Please wait while we fetch your campaigns.</p>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 shadow-lg animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Error ⚠️</h1>
            <p className="text-red-600 mt-1">Error: {error}</p>
          </div>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-800">
              Unable to load campaigns. Please try refreshing the page or contact support if the issue persists.
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700">
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="md:text-3xl text-xl font-bold text-gray-900">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
          <p className="text-gray-600 mt-1">Here&apos;s what&apos;s happening with your campaigns today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="md:p-6 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Campaigns</p>
                <p className="text-3xl font-bold">{campaigns.length}</p>
                <p className="text-purple-200 text-xs mt-1">+2 this month</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Distributed</p>
                <p className="text-3xl font-bold">
                  ₦{campaigns.reduce((sum, c) => sum + c.totalAmount, 0).toLocaleString()}
                </p>
                <p className="text-emerald-200 text-xs mt-1">+15% from last month</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Participants</p>
                <p className="text-3xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.currentParticipants, 0).toLocaleString()}
                </p>
                <p className="text-blue-200 text-xs mt-1">+8% this week</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold">98.5%</p>
                <p className="text-orange-200 text-xs mt-1">Campaign completion</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Recent Campaigns */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Recent Campaigns</CardTitle>
              <CardDescription className="text-gray-600">
                Manage and monitor your active giveaway campaigns
              </CardDescription>
            </div>
            <Link href="/campaigns">
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-600 mb-4">Create your first giveaway campaign to get started!</p>
              {/* <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Link href="/create-campaign">Create Campaign</Link>
              </Button> */}
            </div>
          ) : (
            campaigns.slice(0, 3).map((campaign: Campaign) => (
              <div
                key={campaign._id || campaign.id}
                className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 bg-white"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{campaign.title}</h3>
                      <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      <Badge variant="outline" className={getPlatformColor(campaign.socialPlatform || "default")}>
                        {campaign.socialPlatform || "Unknown"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created {new Date(campaign.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {campaign.creatorName}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleCampaignAction("view-details", campaign.id || campaign._id || "")}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCampaignAction("edit", campaign.id || campaign._id || "")}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCampaignAction("manage", campaign.id || campaign._id || "")}>
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCampaignAction("duplicate", campaign.id || campaign._id || "")}>
                        <Gift className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCampaignAction("delete", campaign.id || campaign._id || "")}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="text-lg font-bold text-purple-900">₦{campaign.totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Total Prize</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-lg font-bold text-blue-900">
                      {campaign.currentParticipants}/{campaign.maxParticipants}
                    </div>
                    <div className="text-xs text-gray-600">Participants</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="text-lg font-bold text-emerald-900">₦{campaign.amountPerPerson}</div>
                    <div className="text-xs text-gray-600">Per Winner</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="text-lg font-bold text-orange-900">
                      {Math.round((campaign.currentParticipants / campaign.maxParticipants) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600">Complete</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      {campaign.currentParticipants} of {campaign.maxParticipants} participants
                    </span>
                  </div>
                  <Progress value={(campaign.currentParticipants / campaign.maxParticipants) * 100} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleCampaignAction("view-details", campaign.id || campaign._id || "")}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/campaign/${campaign.id}`} className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Public Page
                    </Link>
                  </Button>
                  {campaign.status === "active" && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 ml-auto"
                      onClick={() => handleCampaignAction("manage", campaign.id || campaign._id || "")}
                    >
                      Manage Campaign
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
